import * as echarts from 'echarts'
import ReactECharts from 'echarts-for-react'
import { useEffect, useMemo, useState } from 'react'

import { useChartColors } from '@/components/cockpit-ui'
import type { ChartVarName } from '@/components/cockpit-ui'

import { MAP_GEO_FIT } from '../constants'

const WORLD_MAP = 'world'

/**
 * 与 `ChinaMap` 对齐用的取景参数。
 *
 * 两张底图的 geo boundingRect 不同（中国 vs 全球），所以不能照搬同一组 zoom/center；
 * ECharts 6 的 `geo.boundingCoords` 虽然能统一映射，但会让同实例里 scatter 的 label 整体不渲染，
 * 因此这里改成「世界地图单独一个实例垫在底下」，用标定出来的 zoom/center 和中国地图对齐。
 *
 * 标定方法：两张图各放两个已知经纬度的标记点（[80,45] 与 [125,25]），
 * 截图量出像素位置后解出缩放比与中心点，实测两图对应点偏差 ≤0.5px。
 * **改动标定基准 zoom 或 geo.center 后，这两个值必须重新标定。**
 * 地图舞台现为平面视图；仅调整 `.ck-map-stage` 的 CSS transform 不需要重新标定：
 * 两层同处一个变换容器，缩放会一起作用到世界底图与中国地图上，相对位置不变。
 * 取景收缩系数 MAP_GEO_FIT 与中国地图共用，两层围绕同一中心按同一比例缩放，
 * 因此收缩后仍然重合，无需重新标定。
 */
const WORLD_ZOOM = 5.8087 * MAP_GEO_FIT
const WORLD_CENTER: [number, number] = [104, 36]

/** 中国地图背后的淡色世界底图：俄罗斯、蒙古、朝鲜半岛、日本、东南亚、印度等周边轮廓 */
export function WorldBackdrop({ className = '' }: { className?: string }) {
  const c = useChartColors()
  const [ready, setReady] = useState(() => Boolean(echarts.getMap(WORLD_MAP)))

  useEffect(() => {
    if (echarts.getMap(WORLD_MAP)) {
      setReady(true)
      return
    }

    let cancelled = false
    const load = async () => {
      try {
        // 与 ChinaMap 同样按模块加载，避免 file:// 下 fetch 被 CORS 拦下
        const geo = (await import('@/assets/geo/world.json')).default
        if (cancelled) return
        echarts.registerMap(WORLD_MAP, geo as never)
        setReady(true)
      } catch (err) {
        console.error('[WorldBackdrop] 世界地图注册失败', err)
      }
    }
    void load()

    return () => {
      cancelled = true
    }
  }, [])

  const option = useMemo(() => buildOption(c), [c])

  if (!ready) return <div className={className} />

  return (
    <div className={className}>
      <ReactECharts
        option={option}
        style={{ height: '100%', width: '100%' }}
        opts={{ renderer: 'canvas' }}
        notMerge
      />
    </div>
  )
}

function buildOption(c: Record<ChartVarName, string>) {
  return {
    backgroundColor: 'transparent',
    animation: false,
    textStyle: { fontFamily: 'Noto Sans SC, sans-serif' },
    geo: {
      map: WORLD_MAP,
      roam: false,
      silent: true,
      zoom: WORLD_ZOOM,
      center: WORLD_CENTER,
      label: { show: false },
      itemStyle: {
        areaColor: c['--ck-map-world-area'],
        borderColor: c['--ck-map-world-border'],
        borderWidth: 0.6,
      },
      emphasis: { disabled: true },
      select: { disabled: true },
    },
  }
}
