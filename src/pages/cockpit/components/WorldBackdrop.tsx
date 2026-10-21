import * as echarts from 'echarts'
import ReactECharts from 'echarts-for-react'
import { useEffect, useMemo, useState } from 'react'

import { useChartColors } from '@/components/cockpit-ui'
import type { ChartVarName } from '@/components/cockpit-ui'

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
 * **改动 `ChinaMap` 的 geo.zoom / geo.center 或中栏布局尺寸后，这两个值必须重新标定。**
 */
const WORLD_ZOOM = 5.8087
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
        const res = await fetch(`${import.meta.env.BASE_URL}world.json`)
        if (!res.ok) throw new Error(`世界地图加载失败：${res.status}`)
        const geo = await res.json()
        if (cancelled) return
        echarts.registerMap(WORLD_MAP, geo)
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
