import * as echarts from 'echarts'
import ReactECharts from 'echarts-for-react'
import { useEffect, useMemo, useState } from 'react'

import { useChartColors } from '@/components/cockpit-ui'
import type { ChartVarName } from '@/components/cockpit-ui'

import { MAP_NODES } from '../constants'

import { WorldBackdrop } from './WorldBackdrop'

const MAP_NAME = 'china'

/** 中部主视觉：淡色世界地图衬底 + 中国地图 + 站点光点 */
export function ChinaMap({ className = '' }: { className?: string }) {
  const c = useChartColors()
  const [ready, setReady] = useState(() => Boolean(echarts.getMap(MAP_NAME)))

  useEffect(() => {
    if (echarts.getMap(MAP_NAME)) {
      setReady(true)
      return
    }

    let cancelled = false
    const load = async () => {
      try {
        const res = await fetch(`${import.meta.env.BASE_URL}china.json`)
        if (!res.ok) throw new Error(`地图数据加载失败：${res.status}`)
        const geo = await res.json()
        if (cancelled) return
        echarts.registerMap(MAP_NAME, geo)
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

  const option = useMemo(() => buildMapOption(c), [c])

  if (!ready) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <span className="text-[13px] text-(--text-tertiary)">地图加载中…</span>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* 地图下方的承影，给倾斜的面一点重量 */}
      <span className="ck-map-ground" aria-hidden />

      {/*
        倾斜的立体地图舞台：世界底图与中国地图套在同一个变换容器里，
        两层始终重合，倾斜不会破坏 WorldBackdrop 标定出来的像素对齐。
      */}
      <div className="ck-map-stage absolute inset-0 z-10">
        {/* 世界底图单独一个实例垫在下面，中国地图这一层的 option 保持原样，尺寸位置不受影响 */}
        <WorldBackdrop className="pointer-events-none absolute inset-0" />
        <div className="relative h-full w-full">
          <ReactECharts
            option={option}
            style={{ height: '100%', width: '100%' }}
            /* 舞台整体做了透视放大，提高像素比避免城市名发虚 */
            opts={{ renderer: 'canvas', devicePixelRatio: 2 }}
            notMerge
          />
        </div>
      </div>

      {/* 远处渐隐：倾斜后地图上方是「远端」，加一层空气透视 */}
      <span className="ck-map-haze" aria-hidden />
    </div>
  )
}

function buildMapOption(c: Record<ChartVarName, string>) {
  const points = MAP_NODES.map((n) => ({
    name: n.name,
    value: [...n.coord, n.weight],
    primary: n.primary ?? false,
  }))

  const primary = points.filter((p) => p.primary)
  const normal = points.filter((p) => !p.primary)

  /** 两个 geo 共用的定位参数，保证立体底层与主图层完全重合 */
  const geoBase = {
    map: MAP_NAME,
    roam: false,
    zoom: 1.16,
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
        // 立体底层：同形状下沉一档，形成地图的「厚度」
        // 舞台整体倾斜后，这一层的下沉量就等于地图侧面的厚度，适当加大才有厚度感
        ...geoBase,
        zlevel: 1,
        itemStyle: {
          areaColor: c['--ck-map-emphasis'],
          borderColor: c['--ck-map-border'],
          borderWidth: 1,
          shadowColor: c['--ck-map-emphasis'],
          shadowOffsetY: 22,
          shadowBlur: 0,
        },
        emphasis: { disabled: true },
        regions: [{ name: '南海诸岛', itemStyle: { opacity: 0.85 } }],
      },
      {
        // 主图层
        ...geoBase,
        zlevel: 2,
        silent: false,
        itemStyle: {
          areaColor: c['--ck-map-area'],
          borderColor: c['--ck-map-border'],
          borderWidth: 1.1,
          shadowColor: 'rgba(90,140,230,0.35)',
          shadowBlur: 18,
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
        name: '站点',
        type: 'effectScatter',
        coordinateSystem: 'geo',
        geoIndex: 1,
        data: normal,
        symbolSize: (val: number[]) => Math.max(3.5, val[2] / 14),
        rippleEffect: { brushType: 'stroke', scale: 2.6, period: 4 },
        itemStyle: {
          color: c['--ck-cyan'],
          shadowBlur: 8,
          shadowColor: c['--ck-cyan'],
        },
        label: {
          show: true,
          position: 'right',
          distance: 4,
          formatter: '{b}',
          color: c['--text-secondary'],
          fontSize: 12,
          textShadowColor: 'rgba(128,160,200,0.55)',
          textShadowBlur: 2,
        },
        zlevel: 3,
      },
      {
        name: '枢纽',
        type: 'effectScatter',
        coordinateSystem: 'geo',
        geoIndex: 1,
        data: primary,
        symbolSize: 11,
        rippleEffect: { brushType: 'stroke', scale: 4, period: 3 },
        itemStyle: {
          color: c['--ck-yellow'],
          shadowBlur: 14,
          shadowColor: c['--ck-yellow'],
        },
        label: {
          show: true,
          position: 'right',
          distance: 6,
          formatter: '{b}',
          color: c['--ck-orange'],
          fontSize: 13,
          fontWeight: 'bold' as const,
          textShadowColor: 'rgba(128,160,200,0.55)',
          textShadowBlur: 2,
        },
        zlevel: 3,
      },
    ],
  }
}
