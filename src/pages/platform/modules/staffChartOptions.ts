import type { ChartVarName } from '@/components/cockpit-ui'

import { STAFF_AUDIT_ERROR_TREND, STAFF_MONTHS, STAFF_QUALITY_SERIES } from './staffData'
import type { StaffBillTab, StaffEfficiencyTab } from './staffData'

/**
 * 关掉入场动画。
 *
 * `useChartColors()` 挂载后才解析出真实色值，option 因此被重建并以 notMerge 重新 setOption；
 * 面板用 flex-1 定高时容器尺寸回调又会再触发一次渲染，动画被反复打回起点，
 * 表现为「只有坐标轴、没有柱子也没有折线」。大屏常驻展示，直接静态出图最稳。
 */
const ANIMATION = false

/** 各图表共用的底色、提示框与月份 X 轴 */
function axisBase(c: Record<ChartVarName, string>) {
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
    xAxis: {
      type: 'category' as const,
      data: STAFF_MONTHS,
      axisLine: { lineStyle: { color: c['--ck-panel-border'] } },
      axisTick: { show: false },
      axisLabel: { color: c['--ck-axis'], fontSize: 12 },
    },
  }
}

/** 把主题变量解析出的颜色转成 rgba —— canvas 解析不了 `var()` 和 `color-mix()` */
function alpha(color: string, a: number) {
  const raw = (color || '').trim()

  const hex = /^#([0-9a-f]{3,8})$/i.exec(raw)
  if (hex) {
    const body = hex[1]
    const full =
      body.length === 3 || body.length === 4 ? expandShortHex(body.slice(0, 3)) : body.slice(0, 6)
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

/** 柱体渐变：顶部实色 → 底部淡一档，和作业管理平台保持同一套柱体语言 */
function barFill(color: string, bottomAlpha = 0.58) {
  return {
    type: 'linear' as const,
    x: 0,
    y: 0,
    x2: 0,
    y2: 1,
    colorStops: [
      { offset: 0, color: alpha(color, 1) },
      { offset: 1, color: alpha(color, bottomAlpha) },
    ],
  }
}

/** 数值轴通用配置 */
function valueAxis(c: Record<ChartVarName, string>, extra: Record<string, unknown> = {}) {
  return {
    type: 'value' as const,
    axisLabel: { color: c['--ck-axis'], fontSize: 10 },
    axisLine: { show: false },
    splitLine: { lineStyle: { color: c['--ck-grid'], type: 'dashed' as const } },
    ...extra,
  }
}

/** 业务处理质量：三条准确率折线 */
export function buildQualityOption(c: Record<ChartVarName, string>) {
  return {
    ...axisBase(c),
    legend: {
      top: 0,
      left: 'center',
      itemWidth: 9,
      itemHeight: 9,
      itemGap: 14,
      textStyle: { color: c['--text-secondary'], fontSize: 11 },
    },
    grid: { left: 44, right: 14, top: 32, bottom: 24 },
    yAxis: valueAxis(c, {
      min: 50,
      max: 100,
      interval: 10,
      axisLabel: { color: c['--ck-axis'], fontSize: 10, formatter: '{value}%' },
    }),
    series: STAFF_QUALITY_SERIES.map((s) => ({
      name: s.name,
      type: 'line' as const,
      symbol: 'circle',
      symbolSize: 7,
      data: s.data,
      lineStyle: { color: c[s.colorVar], width: 2 },
      itemStyle: { color: c[s.colorVar] },
    })),
  }
}

/** 质量稽核差错率折线 */
export function buildAuditOption(c: Record<ChartVarName, string>) {
  return {
    ...axisBase(c),
    grid: { left: 44, right: 16, top: 26, bottom: 22 },
    yAxis: valueAxis(c, {
      min: 50,
      max: 110,
      interval: 20,
      axisLabel: { color: c['--ck-axis'], fontSize: 10, formatter: '{value}%' },
    }),
    series: [
      {
        name: '质量稽核差错率',
        type: 'line' as const,
        symbol: 'circle',
        symbolSize: 7,
        data: STAFF_AUDIT_ERROR_TREND,
        label: {
          show: true,
          position: 'top' as const,
          color: c['--text-secondary'],
          fontSize: 11,
          formatter: '{c}.0%',
        },
        lineStyle: { color: c['--ck-blue'], width: 2 },
        itemStyle: { color: c['--ck-blue'] },
      },
    ],
  }
}

/** 单据处理情况：RPA / 人工堆叠柱 */
export function buildBillOption(c: Record<ChartVarName, string>, d: StaffBillTab) {
  return {
    ...axisBase(c),
    grid: { left: 48, right: 12, top: 18, bottom: 24 },
    yAxis: valueAxis(c),
    series: [
      {
        name: 'RPA处理单据量',
        type: 'bar' as const,
        stack: 'bill',
        barWidth: 22,
        data: d.rpaBars,
        itemStyle: { color: barFill(c['--ck-blue'], 0.72) },
      },
      {
        name: '人工处理单据完成量',
        type: 'bar' as const,
        stack: 'bill',
        barWidth: 22,
        data: d.manualBars,
        itemStyle: {
          color: barFill(c['--ck-green'], 0.72),
          borderRadius: [3, 3, 0, 0] as [number, number, number, number],
        },
      },
    ],
  }
}

/** 效率情况柱状图 */
export function buildEfficiencyOption(c: Record<ChartVarName, string>, d: StaffEfficiencyTab) {
  return {
    ...axisBase(c),
    grid: { left: 42, right: 12, top: 18, bottom: 24 },
    yAxis: valueAxis(c, { min: 0, max: d.max, interval: d.max / 5 }),
    series: [
      {
        name: d.label,
        type: 'bar' as const,
        barWidth: 18,
        data: d.bars,
        itemStyle: {
          color: barFill(c['--ck-green']),
          borderRadius: [3, 3, 0, 0] as [number, number, number, number],
        },
      },
    ],
  }
}
