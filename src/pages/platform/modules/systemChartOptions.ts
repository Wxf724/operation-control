import type { ChartVarName } from '@/components/cockpit-ui'

import { SYSTEM_BIZ_SERIES, SYSTEM_MONTHS, SYSTEM_RESOURCE_SERIES } from './systemData'

import type { SystemLineSeries } from './systemData'

/**
 * 关掉入场动画。
 *
 * `useChartColors()` 挂载后才解析出真实色值，option 因此会被重建并以 notMerge 重新 setOption；
 * 面板用 flex-1 定高时容器尺寸回调又会再触发一次渲染，动画被反复打回起点，
 * 表现为「只剩坐标轴、图形全部停在 0」。大屏是常驻展示，直接静态出图最稳。
 */
const ANIMATION = false

/**
 * 把主题变量解析出的颜色转成带透明度的 rgba。
 *
 * canvas 解析不了 `color-mix()` 和 `var()`，塞进 `colorStops` 会让整条序列都画不出来，
 * 所以统一先转成 ECharts 一定认得的 rgba。
 */
function alpha(color: string, a: number) {
  const raw = (color || '').trim()

  const hex = /^#([0-9a-f]{3,8})$/i.exec(raw)
  if (hex) {
    const body = hex[1]
    const full =
      body.length === 3 || body.length === 4
        ? body
            .slice(0, 3)
            .split('')
            .map((ch) => ch + ch)
            .join('')
        : body.slice(0, 6)
    if (full.length === 6) {
      const n = Number.parseInt(full, 16)
      return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`
    }
  }

  if (raw.toLowerCase().startsWith('rgb')) {
    const [r, g, b] = raw
      .slice(raw.indexOf('(') + 1)
      .split(',')
      .slice(0, 3)
      .map((v) => Math.round(Number.parseFloat(v)))
    if ([r, g, b].every((v) => Number.isFinite(v))) return `rgba(${r}, ${g}, ${b}, ${a})`
  }

  // 兜底：宁可退回一个中性蓝，也不要把 `var(--x)` 原样传给 canvas
  return `rgba(42, 102, 232, ${a})`
}

/** 两个折线图共用的底座：透明底、月份轴、提示框、「单位：%」标题 */
function lineBase(c: Record<ChartVarName, string>, legendLeft: number) {
  return {
    animation: ANIMATION,
    backgroundColor: 'transparent',
    textStyle: { fontFamily: 'Noto Sans SC, sans-serif' },
    tooltip: {
      trigger: 'axis' as const,
      backgroundColor: c['--ck-panel-bg-strong'],
      borderColor: c['--ck-panel-border'],
      borderWidth: 1,
      textStyle: { color: c['--foreground'], fontSize: 12 },
      extraCssText: 'box-shadow: 0 6px 18px rgba(42,102,232,0.16); border-radius: 8px;',
    },
    title: {
      text: '单位：%',
      left: 2,
      top: 2,
      textStyle: { color: c['--text-tertiary'], fontSize: 11, fontWeight: 'normal' as const },
    },
    legend: {
      top: 0,
      left: legendLeft,
      itemWidth: 9,
      itemHeight: 9,
      itemGap: 16,
      icon: 'circle',
      textStyle: { color: c['--text-secondary'], fontSize: 12 },
    },
    xAxis: {
      type: 'category' as const,
      data: [...SYSTEM_MONTHS],
      boundaryGap: false,
      axisLine: { lineStyle: { color: c['--ck-panel-border'] } },
      axisTick: { show: false },
      axisLabel: { color: c['--ck-axis'], fontSize: 12 },
    },
  }
}

/** 折线序列的统一外观 */
function lineSeries(c: Record<ChartVarName, string>, s: SystemLineSeries, area: boolean) {
  return {
    name: s.name,
    type: 'line' as const,
    symbol: 'circle',
    symbolSize: 7,
    data: s.data,
    lineStyle: { color: c[s.colorVar], width: 2 },
    itemStyle: { color: c[s.colorVar] },
    areaStyle: area
      ? {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: alpha(c['--ck-blue'], 0.4) },
              { offset: 1, color: alpha(c['--ck-blue'], 0.02) },
            ],
          },
        }
      : undefined,
  }
}

/** 系统基础资源监控：服务器 CPU / 磁盘 / 内存三线图 */
export function buildResourceOption(c: Record<ChartVarName, string>) {
  return {
    ...lineBase(c, 76),
    grid: { left: 36, right: 16, top: 42, bottom: 26 },
    yAxis: {
      type: 'value' as const,
      min: 0,
      max: 1,
      interval: 0.2,
      axisLabel: { color: c['--ck-axis'], fontSize: 11 },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: c['--ck-grid'], type: 'dashed' as const } },
    },
    series: SYSTEM_RESOURCE_SERIES.map((s) => lineSeries(c, s, s.colorVar === '--ck-blue')),
  }
}

/** 关键作业功能监控：业务办理功能稳定情况四线图 */
export function buildBizOption(c: Record<ChartVarName, string>) {
  const base = lineBase(c, 72)

  return {
    ...base,
    legend: {
      ...base.legend,
      top: 18,
      left: 'center' as const,
      itemGap: 10,
      textStyle: { color: c['--text-secondary'], fontSize: 11 },
    },
    grid: { left: 40, right: 18, top: 54, bottom: 26 },
    yAxis: {
      type: 'value' as const,
      min: 60,
      max: 100,
      interval: 10,
      axisLabel: { color: c['--ck-axis'], fontSize: 11 },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: c['--ck-grid'], type: 'dashed' as const } },
    },
    series: SYSTEM_BIZ_SERIES.map((s) => lineSeries(c, s, false)),
  }
}
