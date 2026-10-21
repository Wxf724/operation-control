import type { ChartVarName } from '@/components/cockpit-ui'

import { PROCESS_MONTHS } from './processData'
import type { ProcessSeries } from './processData'

/** 带面积填充的月度折线图配置（驻企团队 / 分中心的完成率曲线） */
export function buildAreaLineOption(c: Record<ChartVarName, string>, series: ProcessSeries[]) {
  const axisLabel = { color: c['--ck-axis'], fontSize: 11 }

  return {
    /**
     * 关掉入场动画。
     *
     * `useChartColors()` 挂载后才解析出真实色值，option 因此被重建并以 notMerge 重新 setOption；
     * 面板用 flex-1 定高时容器尺寸回调又会再触发一次渲染，动画被反复打回起点，
     * 表现为「只有坐标轴、没有折线」。
     */
    animation: false,
    backgroundColor: 'transparent',
    textStyle: { fontFamily: 'Noto Sans SC, sans-serif' },
    tooltip: {
      trigger: 'axis' as const,
      backgroundColor: c['--ck-panel-bg-strong'],
      borderColor: c['--ck-panel-border'],
      borderWidth: 1,
      textStyle: { color: c['--foreground'], fontSize: 12 },
      extraCssText: 'box-shadow: 0 6px 18px rgba(42,102,232,0.16); border-radius: 8px;',
      valueFormatter: (v: number) => `${v}%`,
    },
    grid: { left: 34, right: 14, top: 14, bottom: 24 },
    xAxis: {
      type: 'category' as const,
      boundaryGap: false,
      data: [...PROCESS_MONTHS],
      axisLine: { lineStyle: { color: c['--ck-panel-border'] } },
      axisTick: { show: false },
      axisLabel: { ...axisLabel, fontSize: 12 },
    },
    yAxis: {
      type: 'value' as const,
      min: 0,
      max: 100,
      interval: 20,
      axisLabel,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: c['--ck-grid'], type: 'dashed' as const } },
    },
    series: series.map((s, i) => {
      const color = s.tone === 'cyan' ? c['--ck-cyan'] : c['--ck-green']
      return {
        name: s.name,
        type: 'line' as const,
        smooth: false,
        symbol: 'circle',
        symbolSize: 7,
        data: s.data,
        lineStyle: { color, width: 2 },
        itemStyle: { color, borderColor: c['--ck-panel-bg-strong'], borderWidth: 1 },
        // 只给最底层序列铺面积，避免两条线的填充互相压暗
        areaStyle:
          i === series.length - 1
            ? {
                color: {
                  type: 'linear' as const,
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    { offset: 0, color: fade(color, 0.34) },
                    { offset: 1, color: fade(color, 0.02) },
                  ],
                },
              }
            : undefined,
      }
    }),
  }
}

/** 把十六进制主题色转成带透明度的 rgba，供 ECharts 渐变使用 */
function fade(hex: string, alpha: number) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim())
  if (!m) return hex
  const n = parseInt(m[1], 16)
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`
}

/** 折线图上方的图例：小圆点 + 短横线 + 名称 */
export const PROCESS_LEGEND_TONE: Record<ProcessSeries['tone'], string> = {
  cyan: 'var(--ck-cyan)',
  green: 'var(--ck-green)',
}
