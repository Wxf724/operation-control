import * as echarts from 'echarts'
import ReactECharts from 'echarts-for-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

import { useChartColors } from '@/components/cockpit-ui'
import type { ChartVarName } from '@/components/cockpit-ui'

import { MAP_GEO_FIT, MAP_NODES } from '../constants'

import { WorldBackdrop } from './WorldBackdrop'

const MAP_NAME = 'china'

/**
 * 区域中心：从普通站点里提出来单独着色，和金色枢纽一起构成
 * 「枢纽 → 区域中心 → 一般站点」三级，避免整幅图只剩一种蓝点。
 */
const REGION_HUB_NAMES = new Set(['上海', '广州', '西安', '乌鲁木齐', '成都', '武汉', '沈阳'])

/** 主干（暖金）：沿海与中部两条骨架线，多点连成折线 */
const TRUNK_PATHS = [
  ['北京', '济南', '上海', '广州'],
  ['北京', '郑州', '西安', '成都'],
]

/** 支线（清透青）：区域中心回接主干 */
const BRANCH_PATHS = [
  ['西安', '兰州', '乌鲁木齐'],
  ['西安', '银川', '呼和浩特'],
  ['北京', '沈阳', '哈尔滨'],
  ['郑州', '武汉', '长沙'],
  ['武汉', '南京', '上海'],
  ['成都', '重庆', '昆明'],
]

interface MapLabel {
  name: string
  /** 换算到舞台缩放之后的像素位置（相对未缩放的地图容器） */
  left: number
  top: number
  kind: 'normal' | 'region' | 'primary'
}

/*
  城市名坐标的模块级缓存。
  从平台页／静态驾驶舱返回首页时，CockpitPager 会整棵重新挂载，组件内的
  state 会清空，而 ECharts 的首帧回调不一定来得及重算。画布尺寸与取景不变，
  坐标可以直接复用，保证城市名在路由往返中始终存在、不会闪没。
*/
let labelCache: MapLabel[] = []

/** 坐标未变化时不触发 React 重渲染，避免尺寸/可见性事件反复重算造成抖动 */
function sameLabels(a: MapLabel[], b: MapLabel[]) {
  return (
    a.length === b.length &&
    a.every(
      (item, i) =>
        item.name === b[i].name &&
        Math.abs(item.left - b[i].left) < 0.5 &&
        Math.abs(item.top - b[i].top) < 0.5
    )
  )
}

/** 中部主视觉：淡色世界地图衬底 + 中国地图 + 管网干线 + 站点光点 */
export function ChinaMap({ className = '' }: { className?: string }) {
  const c = useChartColors()
  const reducedMotion = useReducedMotion()
  const [ready, setReady] = useState(() => Boolean(echarts.getMap(MAP_NAME)))

  const hostRef = useRef<HTMLDivElement>(null)
  /** 只包住中国地图这一张 ECharts，用来精确定位实例（舞台里还有世界底图实例） */
  const chartHostRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<ReturnType<typeof echarts.init> | null>(null)
  const retryRef = useRef<number | undefined>(undefined)
  const labelsRef = useRef<MapLabel[]>(labelCache)
  const [labels, setLabels] = useState<MapLabel[]>(() => labelCache)

  useEffect(() => {
    if (echarts.getMap(MAP_NAME)) {
      setReady(true)
      return
    }

    let cancelled = false
    const load = async () => {
      try {
        // 直接按模块加载地图数据：file:// 打开时 fetch 会被 CORS 拦下，
        // 走打包内联的方式离线双击 index.html 也能出图。
        const geo = (await import('@/assets/geo/china.json')).default
        if (cancelled) return
        echarts.registerMap(MAP_NAME, geo as never)
        setReady(true)
      } catch (err) {
        console.error('[ChinaMap] 地图注册失败', err)
      }
    }
    void load()

    return () => {
      cancelled = true
    }
  }, [])

  /*
    城市名改由 DOM 层渲染：舞台用 scaleX 把地图拉宽时，canvas 里的文字
    会一起被横向拉宽。这里取 ECharts 的经纬度→像素结果，再按舞台的
    完整变换矩阵换算到缩放／配平之后的位置，文字本身不参与变换，字形保持正常。
    矩阵直接读 .ck-map-stage 的 computed transform，改 CSS 不必改这里。
  */
  const syncLabels = useCallback(() => {
    const host = hostRef.current
    if (!host) return false

    const w = host.clientWidth
    const h = host.clientHeight
    if (!w || !h) return false

    /*
      ECharts 实例优先用回调缓存；路由往返重新挂载时回调可能没赶上，
      直接从 chart DOM 取实例，不把标签的存亡押在 onChartReady 的时序上。
    */
    const chartDom = chartHostRef.current?.querySelector<HTMLElement>('[_echarts_instance_]') ?? null
    const fallback = chartDom ? echarts.getInstanceByDom(chartDom) ?? null : null
    const cached = chartRef.current
    const chart = cached && !cached.isDisposed() ? cached : fallback
    if (!chart || chart.isDisposed() || (chart !== cached && !chart.getOption()?.geo)) return false

    /* 读取舞台的完整变换矩阵（缩放 + 视觉配平角），以舞台中心为原点换算 */
    const stage = host.querySelector<HTMLElement>('.ck-map-stage')
    const transform = stage ? getComputedStyle(stage).transform : 'none'
    const matrix = transform === 'none' ? new DOMMatrix() : new DOMMatrix(transform)
    const cx = w / 2
    const cy = h / 2

    const next: MapLabel[] = []
    for (const n of MAP_NODES) {
      const pixel = chart.convertToPixel({ geoIndex: 0 }, n.coord)
      /* 只要有坐标还没就绪就整体放弃，保留现有标签，绝不用残缺结果覆盖 */
      if (!Array.isArray(pixel) || !Number.isFinite(pixel[0]) || !Number.isFinite(pixel[1])) {
        return false
      }
      const point = new DOMPoint(pixel[0] - cx, pixel[1] - cy).matrixTransform(matrix)
      next.push({
        name: n.name,
        left: cx + point.x,
        top: cy + point.y,
        kind: n.primary ? 'primary' : REGION_HUB_NAMES.has(n.name) ? 'region' : 'normal',
      })
    }

    if (!sameLabels(next, labelsRef.current)) {
      labelsRef.current = next
      labelCache = next
      setLabels(next)
    }
    return true
  }, [])

  /** geo 布局可能晚于挂载，连续重试到坐标稳定为止；成功后自动停止 */
  const scheduleSync = useCallback(() => {
    window.clearTimeout(retryRef.current)
    let tries = 0
    const attempt = () => {
      if (syncLabels()) return
      if (tries++ >= 15) return
      retryRef.current = window.setTimeout(attempt, 60)
    }
    retryRef.current = window.setTimeout(attempt, 0)
  }, [syncLabels])

  useEffect(() => {
    if (!ready) return

    scheduleSync()
    const host = hostRef.current
    const observer = new ResizeObserver(() => scheduleSync())
    if (host) observer.observe(host)

    const onResize = () => scheduleSync()
    const onVisible = () => {
      if (!document.hidden) scheduleSync()
    }
    window.addEventListener('resize', onResize)
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      window.clearTimeout(retryRef.current)
      observer.disconnect()
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [ready, scheduleSync])

  const option = useMemo(() => buildMapOption(c, Boolean(reducedMotion)), [c, reducedMotion])

  if (!ready) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <span className="text-[13px] text-(--text-tertiary)">地图加载中…</span>
      </div>
    )
  }

  return (
    <div ref={hostRef} className={`relative overflow-hidden ${className}`}>
      {/*
        平面地图舞台：世界底图与中国地图套在同一个变换容器里一起缩放，
        两层始终重合，不做透视倾斜。
      */}
      <div className="ck-map-stage absolute inset-0 z-10">
        {/* 世界底图单独一个实例垫在下面，中国地图这一层的 option 保持原样，尺寸位置不受影响 */}
        <WorldBackdrop className="pointer-events-none absolute inset-0" />
        <span className="ck-map-sweep pointer-events-none absolute inset-y-0 left-0 z-20" aria-hidden />
        <div ref={chartHostRef} className="relative h-full w-full">
          <ReactECharts
            option={option}
            style={{ height: '100%', width: '100%' }}
            /* 舞台做了缩放，提高像素比避免地图线条发虚 */
            opts={{ renderer: 'canvas', devicePixelRatio: 2 }}
            onChartReady={(chart) => {
              chartRef.current = chart
              // geo 首帧完成后经纬度→像素的映射才稳定，交给重试调度去对齐
              scheduleSync()
            }}
            notMerge
          />
        </div>
      </div>

      {/* 城市名：独立于舞台的 DOM 文字层，不随 scaleX 被拉宽 */}
      <div className="pointer-events-none absolute inset-0 z-20">
        {labels.map((label) => (
          <span
            key={label.name}
            className="ck-map-label"
            data-kind={label.kind}
            style={{ left: label.left, top: label.top }}
          >
            {label.name}
          </span>
        ))}
      </div>
    </div>
  )
}

function buildMapOption(c: Record<ChartVarName, string>, reducedMotion: boolean) {
  const coordByName = new Map(MAP_NODES.map((n) => [n.name, n.coord]))
  const toPath = (names: string[]) => ({
    coords: names.map((name) => coordByName.get(name) ?? ([0, 0] as [number, number])),
  })

  const points = MAP_NODES.filter(
    (n) => !n.primary && !REGION_HUB_NAMES.has(n.name)
  ).map((n) => ({ name: n.name, value: [...n.coord, n.weight] }))
  const regions = MAP_NODES.filter((n) => REGION_HUB_NAMES.has(n.name)).map((n) => ({
    name: n.name,
    value: [...n.coord, n.weight],
  }))
  const primary = MAP_NODES.filter((n) => n.primary).map((n) => ({
    name: n.name,
    value: [...n.coord, n.weight],
  }))

  /** 地图定位参数：与世界底图的取景保持一致 */
  const geoBase = {
    map: MAP_NAME,
    roam: false,
    zoom: 1.16 * MAP_GEO_FIT,
    center: [104, 36] as [number, number],
    label: { show: false },
    silent: true,
    select: { disabled: true },
  }

  return {
    backgroundColor: 'transparent',
    textStyle: { fontFamily: 'Noto Sans SC, sans-serif' },
    tooltip: {
      trigger: 'item',
      backgroundColor: c['--ck-tooltip-bg'],
      borderWidth: 0,
      textStyle: { color: c['--ck-tooltip-text'], fontSize: 12 },
      formatter: (p: { name?: string; value?: number[] }) =>
        p.name ? `${p.name}<br/>接入量 ${p.value?.[2] ?? 0}` : '',
    },
    geo: [
      {
        // 单一图层：平面地图不再需要下沉的立体底层；
        // 由上至下的蓝色渐变只用来给陆块一点层次
        ...geoBase,
        zlevel: 1,
        silent: false,
        itemStyle: {
          areaColor: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: c['--ck-map-area'] },
            { offset: 1, color: c['--ck-map-emphasis'] },
          ]),
          borderColor: c['--ck-map-border'],
          borderWidth: 1.1,
        },
        emphasis: {
          disabled: false,
          itemStyle: { areaColor: c['--ck-map-emphasis'] },
          label: { show: false },
        },
        regions: [{ name: '南海诸岛', itemStyle: { opacity: 0.85 } }],
      },
    ],
    series: [
      {
        name: '主干管网',
        type: 'lines',
        coordinateSystem: 'geo',
        geoIndex: 0,
        polyline: true,
        silent: true,
        zlevel: 3,
        z: 3,
        data: TRUNK_PATHS.map(toPath),
        lineStyle: {
          color: c['--ck-map-trunk'],
          width: 2,
          opacity: 0.62,
        },
        effect: reducedMotion
          ? { show: false }
          : {
              show: true,
              period: 7,
              trailLength: 0.32,
              symbol: 'circle',
              symbolSize: 4,
              color: c['--ck-map-trunk'],
            },
      },
      {
        name: '支线管网',
        type: 'lines',
        coordinateSystem: 'geo',
        geoIndex: 0,
        polyline: true,
        silent: true,
        zlevel: 3,
        z: 3,
        data: BRANCH_PATHS.map(toPath),
        lineStyle: {
          color: c['--ck-map-route'],
          width: 1.4,
          opacity: 0.55,
        },
        effect: reducedMotion
          ? { show: false }
          : {
              show: true,
              period: 9,
              trailLength: 0.26,
              symbol: 'circle',
              symbolSize: 3,
              color: c['--ck-map-route'],
            },
      },
      {
        name: '站点',
        type: reducedMotion ? 'scatter' : 'effectScatter',
        coordinateSystem: 'geo',
        geoIndex: 0,
        data: points,
        zlevel: 3,
        z: 4,
        symbolSize: (val: number[]) => Math.max(3.5, val[2] / 14),
        rippleEffect: { brushType: 'stroke', scale: 2.6, period: 4 },
        itemStyle: {
          color: c['--ck-cyan'],
          shadowBlur: 8,
          shadowColor: c['--ck-cyan'],
        },
        label: { show: false },
      },
      {
        name: '区域中心',
        type: reducedMotion ? 'scatter' : 'effectScatter',
        coordinateSystem: 'geo',
        geoIndex: 0,
        data: regions,
        zlevel: 3,
        z: 5,
        symbolSize: 8,
        rippleEffect: { brushType: 'stroke', scale: 3.2, period: 4.5 },
        itemStyle: {
          color: c['--ck-map-region'],
          shadowBlur: 12,
          shadowColor: c['--ck-map-region'],
        },
        label: { show: false },
      },
      {
        name: '枢纽',
        type: reducedMotion ? 'scatter' : 'effectScatter',
        coordinateSystem: 'geo',
        geoIndex: 0,
        data: primary,
        zlevel: 3,
        z: 6,
        symbolSize: 11,
        rippleEffect: { brushType: 'stroke', scale: 4, period: 3 },
        itemStyle: {
          color: c['--ck-yellow'],
          shadowBlur: 14,
          shadowColor: c['--ck-yellow'],
        },
        label: { show: false },
      },
    ],
  }
}
