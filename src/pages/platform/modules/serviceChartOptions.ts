import type { ChartVarName } from '@/components/cockpit-ui'

import { SERVICE_COMPLAINT_BARS, SERVICE_RESOLVE_HOURS, SERVICE_REVENUE_BARS } from './serviceData'

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

/** ECharts 提示框皮肤：白卡 + 柔和蓝投影，随主题取色 */
function tooltipSkin(c: Record<ChartVarName, string>) {
  return {
    backgroundColor: c['--ck-panel-bg-strong'],
    borderColor: c['--ck-panel-border'],
    borderWidth: 1,
    textStyle: { color: c['--foreground'], fontSize: 12 },
    extraCssText: 'box-shadow: 0 6px 18px rgba(42,102,232,0.16); border-radius: 8px;',
  }
}

const FONT = 'Noto Sans SC, sans-serif'

/** 竖向渐变填充，用于柱体 */
function verticalFill(from: string, to: string) {
  return {
    type: 'linear',
    x: 0,
    y: 0,
    x2: 0,
    y2: 1,
    colorStops: [
      { offset: 0, color: from },
      { offset: 1, color: to },
    ],
  }
}

/** 平均问题解决时长（折线 + 面积） */
export function buildResolveHoursOption(c: Record<ChartVarName, string>) {
  return {
    animation: ANIMATION,
    backgroundColor: 'transparent',
    textStyle: { fontFamily: FONT },
    tooltip: { trigger: 'axis', ...tooltipSkin(c) },
    grid: { left: 30, right: 18, top: 26, bottom: 24 },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: SERVICE_RESOLVE_HOURS.map((d) => d.month),
      axisLine: { lineStyle: { color: c['--ck-panel-border'] } },
      axisTick: { show: false },
      axisLabel: { color: c['--ck-axis'], fontSize: 12 },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 7,
      interval: 1,
      axisLabel: { color: c['--ck-axis'], fontSize: 11 },
      axisLine: { show: false },
      splitLine: { lineStyle: { color: c['--ck-grid'], type: 'dashed' as const } },
    },
    series: [
      {
        type: 'line',
        symbol: 'circle',
        symbolSize: 8,
        data: SERVICE_RESOLVE_HOURS.map((d) => d.value),
        label: {
          show: true,
          position: 'top',
          distance: 8,
          color: c['--ck-axis'],
          fontSize: 13,
          fontWeight: 'bold' as const,
          formatter: (p: { value: number }) => p.value.toFixed(1),
        },
        lineStyle: { color: c['--ck-green'], width: 2 },
        itemStyle: { color: c['--ck-green'] },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: alpha(c['--ck-green'], 0.45) },
              { offset: 1, color: alpha(c['--ck-blue'], 0.04) },
            ],
          },
        },
      },
    ],
  }
}

/** 服务收入金额（柱状） */
export function buildRevenueOption(c: Record<ChartVarName, string>) {
  return {
    animation: ANIMATION,
    backgroundColor: 'transparent',
    textStyle: { fontFamily: FONT },
    tooltip: { trigger: 'axis', ...tooltipSkin(c) },
    grid: { left: 48, right: 16, top: 30, bottom: 24 },
    xAxis: {
      type: 'category',
      data: SERVICE_REVENUE_BARS.map((d) => d.month),
      axisLine: { lineStyle: { color: c['--ck-panel-border'] } },
      axisTick: { show: false },
      axisLabel: { color: c['--ck-axis'], fontSize: 12 },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 3500,
      interval: 500,
      axisLabel: { color: c['--ck-axis'], fontSize: 11 },
      axisLine: { show: false },
      splitLine: { lineStyle: { color: c['--ck-grid'], type: 'dashed' as const } },
    },
    series: [
      {
        type: 'bar',
        barWidth: 16,
        data: SERVICE_REVENUE_BARS.map((d) => d.value),
        label: {
          show: true,
          position: 'top',
          distance: 6,
          color: c['--ck-axis'],
          fontSize: 12,
          fontWeight: 'bold' as const,
          formatter: (p: { value: number }) => p.value.toLocaleString('en-US'),
        },
        itemStyle: { color: verticalFill(c['--ck-cyan'], c['--ck-blue']) },
      },
    ],
  }
}

/** 用户投诉总量（柱状） */
export function buildComplaintOption(c: Record<ChartVarName, string>) {
  return {
    animation: ANIMATION,
    backgroundColor: 'transparent',
    textStyle: { fontFamily: FONT },
    tooltip: { trigger: 'axis', ...tooltipSkin(c) },
    grid: { left: 34, right: 12, top: 24, bottom: 24 },
    xAxis: {
      type: 'category',
      data: SERVICE_COMPLAINT_BARS.map((d) => d.month),
      axisLine: { lineStyle: { color: c['--ck-panel-border'] } },
      axisTick: { show: false },
      axisLabel: { color: c['--ck-axis'], fontSize: 12 },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 2.5,
      interval: 0.5,
      axisLabel: {
        color: c['--ck-axis'],
        fontSize: 11,
        formatter: (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(1)),
      },
      axisLine: { show: false },
      splitLine: { lineStyle: { color: c['--ck-grid'], type: 'dashed' as const } },
    },
    series: [
      {
        type: 'bar',
        barWidth: 14,
        data: SERVICE_COMPLAINT_BARS.map((d) => d.value),
        label: {
          show: true,
          position: 'top',
          distance: 5,
          color: c['--ck-axis'],
          fontSize: 12,
          fontWeight: 'bold' as const,
        },
        itemStyle: { color: verticalFill(c['--ck-yellow'], c['--ck-orange']) },
      },
    ],
  }
}
