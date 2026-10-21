import type { ChartVarName } from '@/components/cockpit-ui'

import {
  ADJUST_TREND,
  ARCHIVE_TREND,
  DURATION_TREND,
  REJECT_TREND,
  SUBMIT_TREND,
  TRAVEL_TREND,
} from './boardData'

/* ═══════════ 企业数据看板的 ECharts 配置（浅蓝白） ═══════════ */

const FONT = { fontFamily: 'Noto Sans SC, sans-serif' }

type Colors = Record<ChartVarName, string>

/**
 * 关掉入场动画。
 *
 * `useChartColors()` 挂载后才解析出真实色值，option 因此会被重建并以 notMerge 重新 setOption；
 * 面板用 flex-1 定高时容器尺寸回调又会再触发一次渲染，动画被反复打回起点，
 * 表现为「只有坐标轴和图例、柱子和折线全部停在 0」。大屏是常驻展示，直接静态出图最稳。
 */
const ANIMATION = false

/**
 * 把主题变量解析出的颜色转成带透明度的 rgba —— canvas 解析不了 `color-mix()` 和 `var()`。
 *
 * 主题里既有 `--ck-cyan: var(--cl-primary)` 这类间接引用，
 * 也有 `--ck-grid: rgba(...)` 这种本来就带透明度的值，两种都要兜住；
 * 解析不出来时绝不能把非法字符串塞进 colorStop，否则整条序列都画不出来。
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

/** 浅色主题下的柱体渐变：顶部实色 → 底部淡一档 */
function barFill(c: Colors, varName: ChartVarName) {
  return vGradient(alpha(c[varName], 1), alpha(c[varName], 0.58))
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

const BAR_RADIUS = [3, 3, 0, 0] as [number, number, number, number]

function catAxis(c: Colors, data: readonly string[]) {
  return {
    type: 'category' as const,
    data: [...data],
    boundaryGap: true,
    axisLine: { lineStyle: { color: c['--ck-panel-border'] } },
    axisTick: { show: false },
    axisLabel: { color: c['--ck-axis'], fontSize: 11, interval: 0, margin: 6 },
  }
}

interface ValAxisOptions {
  min?: number
  max?: number
  interval?: number
  percent?: boolean
  show?: boolean
}

function valAxis(c: Colors, opts: ValAxisOptions = {}) {
  return {
    type: 'value' as const,
    min: opts.min ?? 0,
    max: opts.max,
    interval: opts.interval,
    axisLabel: {
      show: opts.show ?? true,
      color: c['--ck-axis'],
      fontSize: 11,
      margin: 6,
      formatter: (value: number) =>
        opts.percent ? `${Math.round(value)}%` : String(Number(value.toFixed(2))),
    },
    axisLine: { show: false },
    axisTick: { show: false },
    splitLine: { lineStyle: { color: c['--ck-grid'], type: 'dashed' as const } },
  }
}

function legendOf(c: Colors, data: string[]) {
  return {
    data,
    top: 0,
    left: 'center' as const,
    itemWidth: 10,
    itemHeight: 10,
    itemGap: 14,
    icon: 'roundRect',
    textStyle: { color: c['--text-secondary'], fontSize: 11 },
  }
}

const GRID = { left: 4, right: 12, top: 34, bottom: 2, containLabel: true }

/* ───────────── 上行 1 · 单据提报量 ───────────── */

export function buildSubmitOption(c: Colors) {
  const names = ['本年单据完成量', '去年单据完成量', '本年人均产能', '去年人均产能']

  return {
    animation: ANIMATION,
    backgroundColor: 'transparent',
    textStyle: FONT,
    tooltip: tooltip(c),
    legend: legendOf(c, names),
    grid: GRID,
    xAxis: catAxis(c, SUBMIT_TREND.months),
    yAxis: [
      valAxis(c, { max: SUBMIT_TREND.yMax, interval: SUBMIT_TREND.yInterval }),
      valAxis(c, { max: SUBMIT_TREND.yMax, interval: SUBMIT_TREND.yInterval, show: false }),
    ],
    series: [
      {
        name: names[0],
        type: 'bar',
        barWidth: 9,
        barGap: '16%',
        data: [...SUBMIT_TREND.thisYearBar],
        itemStyle: { color: barFill(c, '--ck-teal'), borderRadius: BAR_RADIUS },
      },
      {
        name: names[1],
        type: 'bar',
        barWidth: 9,
        data: [...SUBMIT_TREND.lastYearBar],
        itemStyle: { color: barFill(c, '--ck-blue'), borderRadius: BAR_RADIUS },
      },
      {
        name: names[2],
        type: 'line',
        yAxisIndex: 1,
        symbol: 'circle',
        symbolSize: 6,
        data: [...SUBMIT_TREND.thisYearRate],
        lineStyle: { color: c['--ck-orange'], width: 2.2 },
        itemStyle: { color: c['--ck-orange'] },
        label: {
          show: true,
          position: 'top' as const,
          color: c['--ck-axis'],
          fontSize: 10,
          formatter: (p: { value: number }) => p.value.toFixed(2),
        },
      },
      {
        name: names[3],
        type: 'line',
        yAxisIndex: 1,
        symbol: 'circle',
        symbolSize: 6,
        data: [...SUBMIT_TREND.lastYearRate],
        lineStyle: { color: c['--ck-yellow'], width: 2, type: 'dashed' as const },
        itemStyle: { color: c['--ck-yellow'] },
      },
    ],
  }
}

/* ───────────── 上行 2 · 单据流转时长 ───────────── */

export function buildDurationOption(c: Colors) {
  const names = ['本年共享端', '本年业务财经', '去年共享端', '去年业务财经']

  /** 堆叠柱的总量标签挂在顶部那条序列上，值取自预先算好的合计 */
  const stackLabel = (totals: readonly (number | null)[], bold: boolean) => ({
    show: true,
    position: 'top' as const,
    color: bold ? c['--foreground'] : c['--ck-axis'],
    fontSize: 10,
    fontWeight: bold ? ('bold' as const) : ('normal' as const),
    formatter: (p: { dataIndex: number }) => {
      const v = totals[p.dataIndex]
      return v == null ? '' : v.toFixed(2)
    },
  })

  return {
    animation: ANIMATION,
    backgroundColor: 'transparent',
    textStyle: FONT,
    tooltip: tooltip(c),
    legend: legendOf(c, names),
    grid: GRID,
    xAxis: catAxis(c, DURATION_TREND.months),
    yAxis: valAxis(c, { max: DURATION_TREND.yMax, interval: DURATION_TREND.yInterval }),
    series: [
      {
        name: names[0],
        type: 'bar',
        stack: 'this',
        barWidth: 11,
        barGap: '18%',
        data: [...DURATION_TREND.thisShare],
        itemStyle: { color: barFill(c, '--ck-yellow') },
      },
      {
        name: names[1],
        type: 'bar',
        stack: 'this',
        barWidth: 11,
        data: [...DURATION_TREND.thisBiz],
        itemStyle: { color: barFill(c, '--ck-cyan'), borderRadius: BAR_RADIUS },
        label: stackLabel(DURATION_TREND.thisTotal, true),
      },
      {
        name: names[2],
        type: 'bar',
        stack: 'last',
        barWidth: 11,
        data: [...DURATION_TREND.lastShare],
        itemStyle: { color: barFill(c, '--ck-orange') },
      },
      {
        name: names[3],
        type: 'bar',
        stack: 'last',
        barWidth: 11,
        data: [...DURATION_TREND.lastBiz],
        itemStyle: { color: barFill(c, '--ck-blue'), borderRadius: BAR_RADIUS },
        label: stackLabel(DURATION_TREND.lastTotal, false),
      },
    ],
  }
}

/* ───────────── 上行 4 · 协同退单情况 ───────────── */

export function buildRejectOption(c: Colors) {
  const names = ['本年协同退单量', '去年协同退单量', '本年协同退单率', '去年协同退单率']

  const rateLabel = (position: 'top' | 'bottom') => ({
    show: true,
    position,
    color: c['--ck-axis'],
    fontSize: 10,
    formatter: (p: { value: number }) => `${p.value.toFixed(1)}%`,
  })

  return {
    animation: ANIMATION,
    backgroundColor: 'transparent',
    textStyle: FONT,
    tooltip: tooltip(c),
    legend: legendOf(c, names),
    grid: GRID,
    xAxis: catAxis(c, REJECT_TREND.months),
    yAxis: [
      valAxis(c, { max: REJECT_TREND.yMax, interval: REJECT_TREND.yInterval }),
      valAxis(c, { max: REJECT_TREND.rateMax, show: false }),
    ],
    series: [
      {
        name: names[0],
        type: 'bar',
        barWidth: 8,
        barGap: '16%',
        data: [...REJECT_TREND.thisYear],
        itemStyle: { color: barFill(c, '--ck-teal'), borderRadius: BAR_RADIUS },
      },
      {
        name: names[1],
        type: 'bar',
        barWidth: 8,
        data: [...REJECT_TREND.lastYear],
        itemStyle: { color: barFill(c, '--ck-blue'), borderRadius: BAR_RADIUS },
      },
      {
        name: names[2],
        type: 'line',
        yAxisIndex: 1,
        symbol: 'circle',
        symbolSize: 6,
        data: [...REJECT_TREND.thisRate],
        lineStyle: { color: c['--ck-orange'], width: 2.2 },
        itemStyle: { color: c['--ck-orange'] },
        label: rateLabel('bottom'),
      },
      {
        name: names[3],
        type: 'line',
        yAxisIndex: 1,
        symbol: 'circle',
        symbolSize: 6,
        data: [...REJECT_TREND.lastRate],
        lineStyle: { color: c['--ck-yellow'], width: 2, type: 'dashed' as const },
        itemStyle: { color: c['--ck-yellow'] },
        label: rateLabel('top'),
      },
    ],
  }
}

/* ───────────── 下行 1 · 商旅预订及报销情况 ───────────── */

export function buildTravelOption(c: Colors) {
  const names = ['报销率', '去年报销率', '本年平均预订率', '去年平均预订率']

  return {
    animation: ANIMATION,
    backgroundColor: 'transparent',
    textStyle: FONT,
    tooltip: tooltip(c),
    legend: legendOf(c, names),
    grid: GRID,
    xAxis: catAxis(c, TRAVEL_TREND.months),
    yAxis: valAxis(c, {
      max: TRAVEL_TREND.yMax,
      interval: TRAVEL_TREND.yInterval,
      percent: true,
    }),
    series: [
      {
        name: names[0],
        type: 'bar',
        barWidth: 8,
        barGap: '16%',
        data: [...TRAVEL_TREND.thisYear],
        itemStyle: { color: barFill(c, '--ck-teal'), borderRadius: BAR_RADIUS },
      },
      {
        name: names[1],
        type: 'bar',
        barWidth: 8,
        data: [...TRAVEL_TREND.lastYear],
        itemStyle: { color: barFill(c, '--ck-blue'), borderRadius: BAR_RADIUS },
      },
      {
        name: names[2],
        type: 'line',
        /*
          数值标签挂在 symbol 上，`symbol: 'none'` 会连标签一起吞掉，
          所以这里保留一个 1px 的点（肉眼不可见）把 97.5% 这排标签带出来；
          均值线贴着 100% 跑，标签在线上方会被 grid 顶边裁掉，再关掉 clip。
        */
        symbol: 'circle',
        symbolSize: 1,
        clip: false,
        data: [...TRAVEL_TREND.thisAvg],
        lineStyle: { color: c['--ck-orange'], width: 2, type: 'dashed' as const },
        itemStyle: { color: c['--ck-orange'] },
        label: {
          show: true,
          position: 'top' as const,
          color: c['--ck-axis'],
          fontSize: 10,
          formatter: (p: { value: number }) => `${p.value.toFixed(1)}%`,
        },
      },
      {
        name: names[3],
        type: 'line',
        symbol: 'none',
        clip: false,
        data: [...TRAVEL_TREND.lastAvg],
        lineStyle: { color: c['--ck-yellow'], width: 2, type: 'dashed' as const },
        itemStyle: { color: c['--ck-yellow'] },
      },
    ],
  }
}

/* ───────────── 下行 2 · 档案邮寄率 ───────────── */

export function buildArchiveOption(c: Colors) {
  const names = ['去年邮寄率', '本年邮寄率', '本年平均邮寄率']

  const pctLabel = (position: 'top' | 'bottom') => ({
    show: true,
    position,
    color: c['--ck-axis'],
    fontSize: 10,
    formatter: (p: { value: number | null }) => (p.value == null ? '' : `${Math.round(p.value)}%`),
  })

  return {
    animation: ANIMATION,
    backgroundColor: 'transparent',
    textStyle: FONT,
    tooltip: tooltip(c),
    legend: legendOf(c, names),
    grid: GRID,
    xAxis: { ...catAxis(c, ARCHIVE_TREND.months), boundaryGap: false },
    yAxis: valAxis(c, {
      min: ARCHIVE_TREND.yMin,
      max: ARCHIVE_TREND.yMax,
      interval: ARCHIVE_TREND.yInterval,
      percent: true,
    }),
    series: [
      {
        name: names[0],
        type: 'line',
        symbol: 'rect',
        symbolSize: 6,
        data: [...ARCHIVE_TREND.lastYear],
        lineStyle: { color: c['--ck-orange'], width: 2.2, type: 'dashed' as const },
        itemStyle: { color: c['--ck-orange'] },
        label: pctLabel('bottom'),
      },
      {
        name: names[1],
        type: 'line',
        symbol: 'circle',
        symbolSize: 6,
        data: [...ARCHIVE_TREND.thisYear],
        lineStyle: { color: c['--ck-teal'], width: 2.4 },
        itemStyle: { color: c['--ck-teal'] },
        label: pctLabel('top'),
      },
      {
        name: names[2],
        type: 'line',
        symbol: 'none',
        smooth: true,
        data: [...ARCHIVE_TREND.thisAvg],
        lineStyle: { color: c['--ck-red'], width: 2.2 },
        itemStyle: { color: c['--ck-red'] },
      },
    ],
  }
}

/* ───────────── 下行 4 · 企业调账情况 ───────────── */

export function buildAdjustOption(c: Colors) {
  const names = ['本年企业调账数量', '去年企业调账数量']

  return {
    animation: ANIMATION,
    backgroundColor: 'transparent',
    textStyle: FONT,
    tooltip: tooltip(c),
    legend: legendOf(c, names),
    grid: GRID,
    xAxis: catAxis(c, ADJUST_TREND.months),
    yAxis: valAxis(c, { max: ADJUST_TREND.yMax, interval: ADJUST_TREND.yInterval }),
    series: [
      {
        name: names[0],
        type: 'bar',
        barWidth: 9,
        barGap: '16%',
        data: [...ADJUST_TREND.thisYear],
        itemStyle: { color: barFill(c, '--ck-teal'), borderRadius: BAR_RADIUS },
        label: {
          show: true,
          position: 'top' as const,
          color: c['--ck-axis'],
          fontSize: 10,
          formatter: (p: { value: number }) => (p.value ? p.value.toLocaleString('en-US') : ''),
        },
      },
      {
        name: names[1],
        type: 'bar',
        barWidth: 9,
        data: [...ADJUST_TREND.lastYear],
        itemStyle: { color: barFill(c, '--ck-blue'), borderRadius: BAR_RADIUS },
      },
    ],
  }
}
