import type { ChartVarName } from '@/components/cockpit-ui'

import type { TrendSeries } from './types'

/**
 * 关掉入场动画。
 *
 * `useChartColors()` 挂载后才解析出真实色值，option 因此被重建并以 notMerge 重新 setOption；
 * 容器用 flex 定高时尺寸回调又会再触发一次渲染，动画被反复打回起点，
 * 表现为「只有坐标轴、没有折线」。大屏常驻展示，直接静态出图最稳。
 */
const ANIMATION = false

const TONE_VAR: Record<string, ChartVarName> = {
  cyan: '--ck-cyan',
  blue: '--ck-blue',
  green: '--ck-green',
  orange: '--ck-orange',
  red: '--ck-red',
  purple: '--ck-purple',
}

/** 把主题变量解析出的颜色转成 rgba —— canvas 解析不了 `var()` 和 `color-mix()` */
function alpha(color: string, a: number) {
  const raw = (color || '').trim()
  const hex = raw.replace('#', '')

  if (/^[0-9a-f]{6}$/i.test(hex)) {
    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)
    return `rgba(${r}, ${g}, ${b}, ${a})`
  }

  const m = raw.match(/^rgba?\(([^)]+)\)$/i)
  if (m) {
    const [r, g, b] = m[1].split(',').map((v) => v.trim())
    return `rgba(${r}, ${g}, ${b}, ${a})`
  }

  return raw
}

/**
 * 作业趋势监测的折线图（任务平均处理时长 / 任务量情况共用）。
 *
 * 参考稿里两张图都是「细线 + 实心圆点 + 浅网格」，图例画在面板标题行上，
 * 所以 option 里不开 legend，只出图形本体。
 */
export function buildTrendOption(series: TrendSeries, c: Record<ChartVarName, string>) {
  return {
    animation: ANIMATION,
    backgroundColor: 'transparent',
    textStyle: { fontFamily: 'Noto Sans SC, sans-serif' },
    tooltip: {
      trigger: 'axis' as const,
      backgroundColor: c['--ck-tooltip-bg'],
      borderWidth: 0,
      textStyle: { color: c['--ck-tooltip-text'], fontSize: 12 },
    },
    grid: { left: 46, right: 14, top: 14, bottom: 26 },
    xAxis: {
      type: 'category' as const,
      data: series.axis,
      boundaryGap: false,
      axisLine: { lineStyle: { color: c['--ck-panel-border'] } },
      axisTick: { show: false },
      axisLabel: { color: c['--ck-axis'], fontSize: 11, interval: 0 },
    },
    yAxis: {
      type: 'value' as const,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: c['--ck-axis'], fontSize: 11 },
      splitLine: { lineStyle: { color: c['--ck-grid'], type: 'dashed' as const } },
    },
    series: series.lines.map((line) => {
      const color = c[TONE_VAR[line.tone] ?? '--ck-cyan']
      return {
        name: line.name,
        type: 'line' as const,
        data: line.data,
        smooth: false,
        symbol: 'circle' as const,
        symbolSize: 5,
        lineStyle: { width: 1.8, color },
        itemStyle: { color },
        areaStyle: {
          color: {
            type: 'linear' as const,
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: alpha(color, 0.22) },
              { offset: 1, color: alpha(color, 0) },
            ],
          },
        },
      }
    }),
  }
}
