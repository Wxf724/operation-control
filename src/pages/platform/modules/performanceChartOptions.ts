import type { ChartVarName } from '@/components/cockpit-ui'

import { PERF_DOC_TREND, PERF_REPORT_ACCURACY, PERF_TIMELINESS } from './performanceData'

type Colors = Record<ChartVarName, string>

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

const BASE = {
  animation: ANIMATION,
  backgroundColor: 'transparent',
  textStyle: { fontFamily: 'Noto Sans SC, sans-serif' },
}

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

function categoryAxis(c: Colors, months: string[], boundaryGap = true) {
  return {
    type: 'category' as const,
    boundaryGap,
    data: months,
    axisLine: { lineStyle: { color: c['--ck-panel-border'] } },
    axisTick: { show: false },
    axisLabel: { color: c['--ck-axis'], fontSize: 12 },
  }
}

/** 单据接收量/完成量柱状 + 完成率折线的双 Y 轴图 */
export function buildDocTrendOption(c: Colors) {
  return {
    ...BASE,
    tooltip: { trigger: 'axis', ...tooltipSkin(c) },
    legend: {
      top: 0,
      left: 'center',
      itemWidth: 11,
      itemHeight: 11,
      itemGap: 20,
      textStyle: { color: c['--text-secondary'], fontSize: 12 },
      data: [
        { name: '单据接收量', icon: 'rect' },
        { name: '单据完成量', icon: 'rect' },
        { name: '单据完成率', icon: 'circle' },
      ],
    },
    grid: { left: 42, right: 40, top: 34, bottom: 24 },
    xAxis: categoryAxis(
      c,
      PERF_DOC_TREND.map((d) => d.month)
    ),
    yAxis: [
      {
        type: 'value' as const,
        name: '万笔',
        nameTextStyle: { color: c['--text-tertiary'], fontSize: 11, align: 'right' as const },
        min: 0,
        max: 25,
        interval: 5,
        axisLabel: { color: c['--ck-axis'], fontSize: 11 },
        axisLine: { show: false },
        splitLine: { lineStyle: { color: c['--ck-grid'], type: 'dashed' as const } },
      },
      {
        type: 'value' as const,
        min: 80,
        max: 100,
        interval: 5,
        axisLabel: { color: c['--ck-axis'], fontSize: 11 },
        axisLine: { show: false },
        splitLine: { show: false },
      },
    ],
    series: [
      {
        name: '单据接收量',
        type: 'bar' as const,
        barWidth: 11,
        barGap: '10%',
        data: PERF_DOC_TREND.map((d) => d.received),
        itemStyle: { color: verticalFill(c['--ck-cyan'], c['--ck-blue']) },
      },
      {
        name: '单据完成量',
        type: 'bar' as const,
        barWidth: 11,
        data: PERF_DOC_TREND.map((d) => d.completed),
        itemStyle: { color: verticalFill(c['--ck-cyan'], c['--ck-green']) },
      },
      {
        name: '单据完成率',
        type: 'line' as const,
        yAxisIndex: 1,
        symbol: 'circle',
        symbolSize: 7,
        data: PERF_DOC_TREND.map((d) => d.rate),
        lineStyle: { color: c['--ck-purple'], width: 2 },
        itemStyle: { color: c['--ck-purple'] },
      },
    ],
  }
}

/** 月度结账及时率 / 报表出具及时率双折线 */
export function buildTimelinessOption(c: Colors) {
  const months = PERF_TIMELINESS.map((d) => d.month)

  return {
    ...BASE,
    tooltip: { trigger: 'axis', ...tooltipSkin(c) },
    legend: {
      top: 0,
      right: 4,
      itemWidth: 10,
      itemHeight: 10,
      itemGap: 18,
      icon: 'circle',
      textStyle: { color: c['--text-secondary'], fontSize: 12 },
      data: ['月度结账及时率', '报表出具及时率'],
    },
    grid: { left: 40, right: 16, top: 36, bottom: 24 },
    xAxis: categoryAxis(c, months, false),
    yAxis: {
      type: 'value' as const,
      name: '%',
      nameTextStyle: { color: c['--text-tertiary'], fontSize: 11, align: 'right' as const },
      min: 0,
      max: 100,
      interval: 20,
      axisLabel: { color: c['--ck-axis'], fontSize: 11 },
      axisLine: { show: false },
      splitLine: { lineStyle: { color: c['--ck-grid'], type: 'dashed' as const } },
    },
    series: [
      {
        name: '月度结账及时率',
        type: 'line' as const,
        symbol: 'circle',
        symbolSize: 7,
        data: PERF_TIMELINESS.map((d) => d.settle),
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
              { offset: 0, color: alpha(c['--ck-green'], 0.16) },
              { offset: 1, color: alpha(c['--ck-blue'], 0.01) },
            ],
          },
        },
      },
      {
        name: '报表出具及时率',
        type: 'line' as const,
        symbol: 'circle',
        symbolSize: 7,
        data: PERF_TIMELINESS.map((d) => d.report),
        lineStyle: { color: c['--ck-cyan'], width: 2 },
        itemStyle: { color: c['--ck-cyan'] },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: alpha(c['--ck-cyan'], 0.16) },
              { offset: 1, color: alpha(c['--ck-blue'], 0.01) },
            ],
          },
        },
      },
    ],
  }
}

/** 报表编制准确率单折线（带面积） */
export function buildReportAccuracyOption(c: Colors) {
  return {
    ...BASE,
    tooltip: { trigger: 'axis', ...tooltipSkin(c) },
    grid: { left: 42, right: 18, top: 30, bottom: 24 },
    xAxis: categoryAxis(
      c,
      PERF_REPORT_ACCURACY.map((d) => d.month),
      false
    ),
    yAxis: {
      type: 'value' as const,
      name: '%',
      nameTextStyle: { color: c['--text-tertiary'], fontSize: 11, align: 'right' as const },
      min: 0,
      max: 100,
      interval: 20,
      axisLabel: { color: c['--ck-axis'], fontSize: 11 },
      axisLine: { show: false },
      splitLine: { lineStyle: { color: c['--ck-grid'], type: 'dashed' as const } },
    },
    series: [
      {
        name: '报表编制准确率',
        type: 'line' as const,
        symbol: 'circle',
        symbolSize: 7,
        data: PERF_REPORT_ACCURACY.map((d) => d.value),
        lineStyle: { color: c['--ck-cyan'], width: 2 },
        itemStyle: { color: c['--ck-cyan'] },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: alpha(c['--ck-cyan'], 0.28) },
              { offset: 1, color: alpha(c['--ck-blue'], 0.01) },
            ],
          },
        },
      },
    ],
  }
}
