import type { ChartVarName } from '@/components/cockpit-ui'

import {
  PERF_MONTHS,
  SHANDONG_EFF_APPROVAL,
  SHANDONG_LATE_FEE,
  SHANDONG_QUAL_RECONCILE,
  SHANDONG_QUAL_SUBITEM,
  SHARED_DUR_CENTER,
} from './performanceOrgData'

type Colors = Record<ChartVarName, string>

/** 大屏常驻展示，关掉入场动画，避免 option 重建时图形被打回起点只剩坐标轴 */
const ANIMATION = false

/** canvas 解析不了 color-mix()/var()，统一转成 rgba */
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

  return `rgba(42, 102, 232, ${a})`
}

function tooltipSkin(c: Colors) {
  return {
    backgroundColor: c['--ck-panel-bg-strong'],
    borderColor: c['--ck-panel-border'],
    borderWidth: 1,
    textStyle: { color: c['--foreground'], fontSize: 12 },
    extraCssText: 'box-shadow: 0 6px 18px rgba(42,102,232,0.16); border-radius: 8px;',
  }
}

const BASE = {
  animation: ANIMATION,
  backgroundColor: 'transparent',
  textStyle: { fontFamily: 'Noto Sans SC, sans-serif' },
}

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

function categoryAxis(c: Colors, labels: string[], boundaryGap = true) {
  return {
    type: 'category' as const,
    boundaryGap,
    data: labels,
    axisLine: { lineStyle: { color: c['--ck-panel-border'] } },
    axisTick: { show: false },
    axisLabel: { color: c['--ck-axis'], fontSize: 11 },
  }
}

function valueAxis(c: Colors, opts: { name?: string; min?: number; max?: number; interval?: number }) {
  return {
    type: 'value' as const,
    name: opts.name,
    nameTextStyle: { color: c['--text-tertiary'], fontSize: 11, align: 'right' as const },
    min: opts.min,
    max: opts.max,
    interval: opts.interval,
    axisLabel: { color: c['--ck-axis'], fontSize: 11 },
    axisLine: { show: false },
    splitLine: { lineStyle: { color: c['--ck-grid'], type: 'dashed' as const } },
  }
}

function lineArea(c: Colors, color: string, top = 0.2) {
  return {
    color: {
      type: 'linear',
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [
        { offset: 0, color: alpha(color, top) },
        { offset: 1, color: alpha(c['--ck-blue'], 0.01) },
      ],
    },
  }
}

const MONTHS = [...PERF_MONTHS]

/* ───────────── 共享公司 ───────────── */

/**
 * 效率管理情况 ▸ 数量情况-中心：双柱（单据接收量 / 单据完成量）+ 右轴完成率折线。
 * 左轴 0–25「万笔」、右轴 80–100「%」，与稿面两侧刻度一致。
 */
export function buildSharedQtyCenterOption(c: Colors) {
  const received = [10, 12, 14, 15, 17, 19, 20]
  const finished = [8, 10, 12, 13, 15, 17, 18]
  const rate = [82, 85, 88, 90, 92, 94, 95]

  return {
    ...BASE,
    tooltip: { trigger: 'axis', ...tooltipSkin(c) },
    legend: {
      data: ['单据接收量', '单据完成量', '单据完成率'],
      top: 0,
      itemWidth: 9,
      itemHeight: 9,
      itemGap: 12,
      textStyle: { color: c['--text-secondary'], fontSize: 11 },
    },
    grid: { left: 2, right: 2, top: 28, bottom: 2, containLabel: true },
    xAxis: categoryAxis(c, MONTHS),
    yAxis: [
      valueAxis(c, { name: '万笔', min: 0, max: 25, interval: 5 }),
      { ...valueAxis(c, { min: 80, max: 100, interval: 5 }), splitLine: { show: false } },
    ],
    series: [
      {
        name: '单据接收量',
        type: 'bar',
        barWidth: 8,
        barGap: '30%',
        itemStyle: { color: verticalFill(alpha(c['--ck-cyan'], 1), alpha(c['--ck-cyan'], 0.3)) },
        data: received,
      },
      {
        name: '单据完成量',
        type: 'bar',
        barWidth: 8,
        itemStyle: { color: verticalFill(alpha(c['--ck-green'], 1), alpha(c['--ck-green'], 0.3)) },
        data: finished,
      },
      {
        name: '单据完成率',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        lineStyle: { width: 2, color: c['--ck-purple'] },
        itemStyle: { color: c['--ck-purple'] },
        data: rate,
      },
    ],
  }
}

/**
 * 质量管理情况 ▸ 报表编制准确率：四中心四条折线。
 * 稿面纵轴 80–100，起伏才看得出来，所以不从 0 起。
 */
export function buildSharedReportLinesOption(c: Colors) {
  const tones = [c['--ck-cyan'], c['--ck-green'], c['--ck-purple'], c['--ck-blue']]
  const data = [
    [88, 97, 92, 95, 90, 93, 98],
    [95, 90, 96, 91, 94, 89, 92],
    [85, 93, 88, 96, 87, 94, 90],
    [91, 86, 94, 89, 96, 91, 95],
  ]

  return {
    ...BASE,
    tooltip: { trigger: 'axis', ...tooltipSkin(c) },
    legend: {
      data: ['东部中心', '西部中心', '南部中心', '北部中心'],
      top: 0,
      itemWidth: 9,
      itemHeight: 9,
      itemGap: 16,
      textStyle: { color: c['--text-secondary'], fontSize: 11 },
    },
    grid: { left: 2, right: 10, top: 28, bottom: 2, containLabel: true },
    xAxis: categoryAxis(c, MONTHS, false),
    yAxis: valueAxis(c, { min: 80, max: 100, interval: 5 }),
    series: ['东部中心', '西部中心', '南部中心', '北部中心'].map((name, i) => ({
      name,
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 5,
      lineStyle: { width: 2, color: tones[i] },
      itemStyle: { color: tones[i] },
      data: data[i],
    })),
  }
}

/** 时长情况-中心的七项费用条用的最大值（画条长用） */
export const SHARED_DUR_MAX = Math.max(...SHARED_DUR_CENTER.bars.map((b) => b.hours))

/* ───────────── 山东公司派驻组 ───────────── */

/**
 * 作业效率管理情况 ▸ 驻企财务审批单据情况统计。
 * 单柱（单据完成量，左轴 0–20000 笔）+ 折线（单据平均处理时长，右轴 0–20 小时）。
 */
export function buildShandongApprovalOption(c: Colors) {
  const { resident, rate } = SHANDONG_EFF_APPROVAL

  return {
    ...BASE,
    tooltip: { trigger: 'axis', ...tooltipSkin(c) },
    legend: {
      data: ['单据完成量', '单据平均处理时长'],
      top: 0,
      itemWidth: 9,
      itemHeight: 9,
      itemGap: 14,
      textStyle: { color: c['--text-secondary'], fontSize: 11 },
    },
    grid: { left: 2, right: 2, top: 28, bottom: 2, containLabel: true },
    xAxis: categoryAxis(c, MONTHS),
    yAxis: [
      valueAxis(c, { name: '笔', min: 0, max: 20000, interval: 5000 }),
      {
        ...valueAxis(c, { name: '小时', min: 0, max: 20, interval: 5 }),
        splitLine: { show: false },
      },
    ],
    series: [
      {
        name: '单据完成量',
        type: 'bar',
        barWidth: 14,
        itemStyle: { color: verticalFill(alpha(c['--ck-cyan'], 1), alpha(c['--ck-cyan'], 0.25)) },
        data: resident.map((v) => v * 800),
      },
      {
        name: '单据平均处理时长',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        lineStyle: { width: 2, color: c['--ck-green'] },
        itemStyle: { color: c['--ck-green'] },
        data: rate,
      },
    ],
  }
}

/**
 * 稿面上山东组那几张「拐点带百分比标签」的折线共用一个构造器。
 * 分项业务处理质量达成率 / 内部交易对账准确率 / 资金预算准确率都是这一种。
 */
function labelledLineOption(c: Colors, data: readonly number[], opts: { area?: boolean } = {}) {
  return {
    ...BASE,
    tooltip: { trigger: 'axis', ...tooltipSkin(c) },
    grid: { left: 2, right: 12, top: 24, bottom: 2, containLabel: true },
    xAxis: categoryAxis(c, MONTHS, false),
    yAxis: valueAxis(c, { min: 70, max: 100, interval: 5 }),
    series: [
      {
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { width: 2, color: c['--ck-green'] },
        itemStyle: { color: c['--ck-green'] },
        areaStyle: opts.area ? lineArea(c, c['--ck-green'], 0.2) : undefined,
        label: {
          show: true,
          position: 'top' as const,
          color: c['--foreground'],
          fontSize: 11,
          formatter: (p: { value: number }) => `${p.value.toFixed(1)}%`,
        },
        data: [...data],
      },
    ],
  }
}

/** 作业质量管理情况 ▸ 分项业务处理质量达成率 */
export function buildShandongSubitemLineOption(c: Colors) {
  return labelledLineOption(c, SHANDONG_QUAL_SUBITEM.data)
}

/** 作业质量管理情况 ▸ 内部交易对账准确率 */
export function buildShandongReconcileLineOption(c: Colors) {
  return labelledLineOption(c, SHANDONG_QUAL_RECONCILE.data)
}

/** 服务企业情况 ▸ 公司资金预算执行情况：资金预算准确率折线 */
export function buildShandongFundLineOption(c: Colors) {
  return labelledLineOption(c, [90.0, 86.0, 91.0, 96.0, 89.0, 88.0, 94.0], { area: true })
}

/** 服务企业情况 ▸ 成本费用预算执行准确率：柱顶常显百分比 */
export function buildShandongCostBarOption(c: Colors) {
  const data = [90.0, 86.0, 91.0, 96.0, 89.0, 88.0, 94.0]

  return {
    ...BASE,
    tooltip: { trigger: 'axis', ...tooltipSkin(c) },
    grid: { left: 2, right: 6, top: 24, bottom: 2, containLabel: true },
    xAxis: categoryAxis(c, MONTHS),
    yAxis: valueAxis(c, { min: 70, max: 100, interval: 5 }),
    series: [
      {
        type: 'bar',
        barWidth: 13,
        itemStyle: { color: verticalFill(alpha(c['--ck-cyan'], 1), alpha(c['--ck-cyan'], 0.25)) },
        label: {
          show: true,
          position: 'top' as const,
          color: c['--foreground'],
          fontSize: 11,
          formatter: (p: { value: number }) => `${p.value.toFixed(1)}%`,
        },
        data,
      },
    ],
  }
}

/**
 * 滞纳金情况 ▸ 本企业税收滞纳金（含罚款）。
 *
 * 柱顶常显千分位金额（稿面如此），纵轴 0–25000 万元、每格 5000。
 * 与页面上其余柱图同一套配色与柱宽，只是量纲大一档。
 */
export function buildShandongLateFeeOption(c: Colors) {
  const data = [...SHANDONG_LATE_FEE.monthly]

  return {
    ...BASE,
    tooltip: {
      trigger: 'axis',
      ...tooltipSkin(c),
      valueFormatter: (v: number) => `${v.toLocaleString()} 万元`,
    },
    grid: { left: 2, right: 6, top: 22, bottom: 2, containLabel: true },
    xAxis: categoryAxis(c, MONTHS),
    yAxis: valueAxis(c, { min: 0, max: 25000, interval: 5000 }),
    series: [
      {
        type: 'bar',
        barWidth: 11,
        itemStyle: { color: verticalFill(alpha(c['--ck-cyan'], 1), alpha(c['--ck-cyan'], 0.25)) },
        label: {
          show: true,
          position: 'top' as const,
          color: c['--foreground'],
          fontSize: 10,
          formatter: (p: { value: number }) => p.value.toLocaleString(),
        },
        data,
      },
    ],
  }
}
