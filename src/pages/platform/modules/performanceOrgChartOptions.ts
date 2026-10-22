import type { ChartVarName } from '@/components/cockpit-ui'

import {
  SHANDONG_DEBT_CLEARANCE,
  SHANDONG_QUALITY_TREND,
  SHANDONG_SATISFACTION_LINES,
  SHANDONG_SERVICE_QUALITY_LINES,
  SHARED_DOC_TREND,
  SHARED_RESIDENT_MENTION_RATE,
  SHARED_RESIDENT_REPORT_RATE,
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

/* ───────────── 共享公司 ───────────── */

/** 作业情况·数量情况：双柱 + 完成率折线 */
export function buildSharedDocTrendOption(c: Colors) {
  return {
    ...BASE,
    tooltip: { trigger: 'axis', ...tooltipSkin(c) },
    legend: {
      top: 0,
      left: 'center',
      itemWidth: 11,
      itemHeight: 11,
      itemGap: 18,
      textStyle: { color: c['--text-secondary'], fontSize: 12 },
      data: [
        { name: '单据接收量', icon: 'rect' },
        { name: '单据完成量', icon: 'rect' },
        { name: '单据完成率', icon: 'circle' },
      ],
    },
    grid: { left: 46, right: 44, top: 34, bottom: 26 },
    xAxis: categoryAxis(
      c,
      SHARED_DOC_TREND.map((d) => d.month)
    ),
    yAxis: [
      valueAxis(c, { name: '万笔', min: 0, max: 20, interval: 5 }),
      {
        ...valueAxis(c, { min: 80, max: 100, interval: 5 }),
        splitLine: { show: false },
      },
    ],
    series: [
      {
        name: '单据接收量',
        type: 'bar' as const,
        barWidth: 12,
        barGap: '12%',
        data: SHARED_DOC_TREND.map((d) => d.received),
        itemStyle: { color: verticalFill(c['--ck-cyan'], c['--ck-blue']) },
      },
      {
        name: '单据完成量',
        type: 'bar' as const,
        barWidth: 12,
        data: SHARED_DOC_TREND.map((d) => d.completed),
        itemStyle: { color: verticalFill(c['--ck-cyan'], c['--ck-green']) },
      },
      {
        name: '单据完成率',
        type: 'line' as const,
        yAxisIndex: 1,
        symbol: 'circle',
        symbolSize: 7,
        data: SHARED_DOC_TREND.map((d) => d.rate),
        lineStyle: { color: c['--ck-purple'], width: 2 },
        itemStyle: { color: c['--ck-purple'] },
      },
    ],
  }
}

/** 驻企财务·平均提报率 / 平均提及率柱状图 */
export function buildSharedResidentBarOption(c: Colors, kind: 'report' | 'mention') {
  const rows = kind === 'report' ? SHARED_RESIDENT_REPORT_RATE : SHARED_RESIDENT_MENTION_RATE
  const tone = kind === 'report' ? c['--ck-cyan'] : c['--ck-teal']

  return {
    ...BASE,
    tooltip: { trigger: 'axis', ...tooltipSkin(c) },
    grid: { left: 38, right: 12, top: 18, bottom: 22 },
    xAxis: categoryAxis(
      c,
      rows.map((d) => d.month)
    ),
    yAxis: valueAxis(c, { name: '%', min: 80, max: 100, interval: 5 }),
    series: [
      {
        name: kind === 'report' ? '平均提报率' : '平均提及率',
        type: 'bar' as const,
        barWidth: 13,
        data: rows.map((d) => d.value),
        itemStyle: { color: verticalFill(tone, alpha(tone, 0.18)) },
      },
    ],
  }
}

/* ───────────── 山东公司派驻组 ───────────── */

/** 社金财务服务单位管理处理流程达成统计：双柱 + 折线，最高 25k */
export function buildShandongQualityTrendOption(c: Colors) {
  return {
    ...BASE,
    tooltip: { trigger: 'axis', ...tooltipSkin(c) },
    legend: {
      top: 0,
      left: 'center',
      itemWidth: 11,
      itemHeight: 11,
      itemGap: 16,
      textStyle: { color: c['--text-secondary'], fontSize: 11 },
      data: [
        { name: '处理单量', icon: 'rect' },
        { name: '达成单量', icon: 'rect' },
        { name: '达成率', icon: 'circle' },
      ],
    },
    grid: { left: 52, right: 44, top: 32, bottom: 24 },
    xAxis: categoryAxis(
      c,
      SHANDONG_QUALITY_TREND.map((d) => d.month)
    ),
    yAxis: [
      valueAxis(c, { name: '笔', min: 0, max: 25000, interval: 5000 }),
      {
        ...valueAxis(c, { min: 80, max: 100, interval: 5 }),
        splitLine: { show: false },
      },
    ],
    series: [
      {
        name: '处理单量',
        type: 'bar' as const,
        barWidth: 12,
        barGap: '12%',
        data: SHANDONG_QUALITY_TREND.map((d) => d.bar1),
        itemStyle: { color: verticalFill(c['--ck-blue'], alpha(c['--ck-blue'], 0.2)) },
      },
      {
        name: '达成单量',
        type: 'bar' as const,
        barWidth: 12,
        data: SHANDONG_QUALITY_TREND.map((d) => d.bar2),
        itemStyle: { color: verticalFill(c['--ck-cyan'], alpha(c['--ck-cyan'], 0.2)) },
      },
      {
        name: '达成率',
        type: 'line' as const,
        yAxisIndex: 1,
        symbol: 'circle',
        symbolSize: 7,
        data: SHANDONG_QUALITY_TREND.map((d) => d.line),
        lineStyle: { color: c['--ck-orange'], width: 2 },
        itemStyle: { color: c['--ck-orange'] },
      },
    ],
  }
}

/** 四条折线图：分月服务处理质量达成率 / 服务企业协同满意结绐情况 */
export function buildShandongMultiLineOption(c: Colors, kind: 'quality' | 'satisfaction') {
  const rows = kind === 'quality' ? SHANDONG_SERVICE_QUALITY_LINES : SHANDONG_SATISFACTION_LINES
  const names =
    kind === 'quality'
      ? ['处理质量', '协同质量', '时效质量', '综合质量']
      : ['满意度A', '满意度B', '满意度C', '满意度D']
  const tones = [c['--ck-cyan'], c['--ck-green'], c['--ck-orange'], c['--ck-purple']]
  const keys = ['line1', 'line2', 'line3', 'line4'] as const

  return {
    ...BASE,
    tooltip: { trigger: 'axis', ...tooltipSkin(c) },
    legend: {
      top: 0,
      left: 'center',
      itemWidth: 9,
      itemHeight: 9,
      itemGap: 10,
      icon: 'circle',
      textStyle: { color: c['--text-secondary'], fontSize: 10 },
      data: names,
    },
    grid: { left: 40, right: 14, top: 30, bottom: 22 },
    xAxis: categoryAxis(
      c,
      rows.map((d) => d.month),
      false
    ),
    yAxis: valueAxis(c, { name: '%', min: 80, max: 100, interval: 5 }),
    series: names.map((name, i) => ({
      name,
      type: 'line' as const,
      symbol: 'circle',
      symbolSize: 5,
      data: rows.map((d) => d[keys[i]]),
      lineStyle: { color: tones[i], width: 2 },
      itemStyle: { color: tones[i] },
      ...(i === 0 ? { areaStyle: lineArea(c, tones[i], 0.14) } : {}),
    })),
  }
}

/** 成本费用应答情况柱状图：金额 200 万元 */
export function buildShandongCostBarOption(c: Colors) {
  const labels = ['1月', '2月', '3月', '4月', '5月', '6月']
  const values = [150, 168, 180, 192, 196, 200]

  return {
    ...BASE,
    tooltip: { trigger: 'axis', ...tooltipSkin(c) },
    grid: { left: 42, right: 14, top: 20, bottom: 22 },
    xAxis: categoryAxis(c, labels),
    yAxis: valueAxis(c, { name: '万元', min: 0, max: 250, interval: 50 }),
    series: [
      {
        name: '成本费用金额',
        type: 'bar' as const,
        barWidth: 15,
        data: values,
        itemStyle: { color: verticalFill(c['--ck-green'], alpha(c['--ck-green'], 0.18)) },
      },
    ],
  }
}

/** 清欠情况四列柱状图 */
export function buildShandongDebtBarOption(c: Colors) {
  const rows = SHANDONG_DEBT_CLEARANCE.chartData
  const names = ['本期发生', '本期清收', '期末余额', '计划清收']
  const tones = [c['--ck-blue'], c['--ck-cyan'], c['--ck-orange'], c['--ck-green']]
  const keys = ['bar1', 'bar2', 'bar3', 'bar4'] as const

  return {
    ...BASE,
    tooltip: { trigger: 'axis', ...tooltipSkin(c) },
    legend: {
      top: 0,
      left: 'center',
      itemWidth: 10,
      itemHeight: 10,
      itemGap: 12,
      textStyle: { color: c['--text-secondary'], fontSize: 10 },
      data: names.map((name) => ({ name, icon: 'rect' })),
    },
    grid: { left: 48, right: 14, top: 30, bottom: 24 },
    xAxis: categoryAxis(
      c,
      rows.map((d) => d.category)
    ),
    yAxis: valueAxis(c, { name: '千元', min: 0, max: 5000, interval: 1000 }),
    series: names.map((name, i) => ({
      name,
      type: 'bar' as const,
      barWidth: 9,
      barGap: '16%',
      data: rows.map((d) => d[keys[i]]),
      itemStyle: { color: verticalFill(tones[i], alpha(tones[i], 0.2)) },
    })),
  }
}
