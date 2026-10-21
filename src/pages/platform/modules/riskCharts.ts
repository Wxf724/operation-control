import type { ChartVarName } from '@/components/cockpit-ui'

import { RISK_PENETRATION, RISK_TREND } from './riskData'

/* ═══════════ 风险管理平台的 ECharts 配置（浅蓝白） ═══════════ */

const FONT = { fontFamily: 'Noto Sans SC, sans-serif' }

type Colors = Record<ChartVarName, string>

/**
 * 关掉入场动画。
 *
 * `useChartColors()` 挂载后才解析出真实色值，option 因此被重建并以 notMerge 重新 setOption；
 * 面板用 flex-1 定高时尺寸回调又会再触发渲染，动画被反复打回起点，
 * 表现为「只有坐标轴、没有图形」。大屏常驻展示，直接静态出图最稳。
 */
const ANIMATION = false

/**
 * 把主题变量解析出的颜色转成带透明度的 rgba —— canvas 解析不了 `color-mix()` 和 `var()`。
 *
 * 必须容错：主题里既有 `--ck-cyan: var(--cl-primary)` 这类间接引用，
 * 也有 `--ck-grid: rgba(...)` 这种本来就带透明度的值。
 * 解析不出来时绝不能把非法字符串塞进 colorStop，否则 ECharts 直接画不出图形。
 */
function alpha(color: string, a: number) {
  const raw = (color || '').trim()

  const hex = /^#([0-9a-f]{3,8})$/i.exec(raw)
  if (hex) {
    const body = hex[1]
    const short = body.length === 3 || body.length === 4
    const full = short ? expandShortHex(body.slice(0, 3)) : body.slice(0, 6)
    if (full.length === 6) {
      const n = Number.parseInt(full, 16)
      return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`
    }
  }

  const rgb = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i.exec(raw)
  if (rgb) {
    const [r, g, b] = [rgb[1], rgb[2], rgb[3]].map((v) => Math.round(Number(v)))
    return `rgba(${r}, ${g}, ${b}, ${a})`
  }

  // 兜底：宁可退回一个 ECharts 一定认得的中性蓝，也不要把 `var(--x)` 原样传下去
  return `rgba(42, 102, 232, ${a})`
}

function expandShortHex(body: string) {
  let out = ''
  for (const ch of body) out += ch + ch
  return out
}

function vGradient(from: string, to: string) {
  return {
    type: 'linear' as const,
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

function hGradient(from: string, to: string) {
  return {
    type: 'linear' as const,
    x: 0,
    y: 0,
    x2: 1,
    y2: 0,
    colorStops: [
      { offset: 0, color: from },
      { offset: 1, color: to },
    ],
  }
}

function tooltip(c: Colors) {
  return {
    trigger: 'axis' as const,
    backgroundColor: c['--ck-panel-bg-strong'],
    borderColor: c['--ck-panel-border'],
    borderWidth: 1,
    textStyle: { color: c['--foreground'], fontSize: 13 },
    extraCssText: 'box-shadow: 0 6px 18px rgba(42,102,232,0.16); border-radius: 8px;',
  }
}

/** 风险趋势分析（近 30 天）：三条面积折线 */
export function buildRiskTrendOption(c: Colors) {
  const [clueName, warnName, investName] = RISK_TREND.legend

  const line = (name: string, data: readonly number[], varName: ChartVarName, area: boolean) => ({
    name,
    type: 'line' as const,
    smooth: true,
    symbol: 'circle' as const,
    symbolSize: 6,
    data: [...data],
    lineStyle: { color: c[varName], width: 2.4 },
    itemStyle: { color: c[varName] },
    ...(area
      ? { areaStyle: { color: vGradient(alpha(c[varName], 0.3), alpha(c[varName], 0.02)) } }
      : {}),
  })

  return {
    animation: ANIMATION,
    backgroundColor: 'transparent',
    textStyle: FONT,
    tooltip: tooltip(c),
    legend: {
      data: [clueName, warnName, investName],
      top: 0,
      right: 2,
      itemWidth: 10,
      itemHeight: 10,
      itemGap: 16,
      icon: 'circle',
      textStyle: { color: c['--text-secondary'], fontSize: 12 },
    },
    grid: { left: 2, right: 12, top: 28, bottom: 0, containLabel: true },
    xAxis: {
      type: 'category' as const,
      boundaryGap: false,
      data: [...RISK_TREND.days],
      axisLine: { lineStyle: { color: c['--ck-panel-border'] } },
      axisTick: { show: false },
      axisLabel: { color: c['--ck-axis'], fontSize: 11, margin: 7 },
    },
    yAxis: {
      type: 'value' as const,
      min: 0,
      max: 10000,
      interval: 2500,
      axisLabel: { color: c['--ck-axis'], fontSize: 11, margin: 6 },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: c['--ck-grid'], type: 'dashed' as const } },
    },
    series: [
      line(clueName, RISK_TREND.clues, '--ck-cyan', true),
      line(warnName, RISK_TREND.autoWarn, '--ck-blue', false),
      line(investName, RISK_TREND.investigate, '--ck-teal', false),
    ],
  }
}

/** 穿透式监管覆盖情况：逐层级的横向条 */
export function buildPenetrationOption(c: Colors) {
  return {
    animation: ANIMATION,
    backgroundColor: 'transparent',
    textStyle: FONT,
    tooltip: {
      ...tooltip(c),
      valueFormatter: (v: number) => `${v}%`,
    },
    grid: { left: 2, right: 42, top: 8, bottom: 0, containLabel: true },
    xAxis: {
      type: 'value' as const,
      min: 0,
      max: 100,
      show: false,
    },
    yAxis: {
      type: 'category' as const,
      data: [...RISK_PENETRATION.levels],
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: c['--ck-axis'], fontSize: 12, margin: 8 },
    },
    series: [
      {
        type: 'bar' as const,
        barWidth: 13,
        data: [...RISK_PENETRATION.rates],
        itemStyle: {
          color: hGradient(alpha(c['--ck-blue'], 0.9), alpha(c['--ck-cyan'], 1)),
          borderRadius: [0, 7, 7, 0] as [number, number, number, number],
        },
        showBackground: true,
        backgroundStyle: { color: alpha(c['--ck-track'], 0.75), borderRadius: 7 },
        label: {
          show: true,
          position: 'right' as const,
          color: c['--ck-axis'],
          fontSize: 12,
          formatter: (p: { value: number }) => `${p.value}%`,
        },
      },
    ],
  }
}
