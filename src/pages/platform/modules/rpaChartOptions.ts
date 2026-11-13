import type { ChartVarName } from '@/components/cockpit-ui'

import { RPA_MANUAL, RPA_RUN_TREND, RPA_STAGE_BOTS, RPA_TASK_TREND } from './rpaData'

/** `useChartColors()` 解析出来的主题色表 */
export type ChartColors = Record<ChartVarName, string>

/** 大屏首屏一次成型：关闭入场动画，避免刷新时柱体从 0 长出来导致画面跳动 */
const NO_ANIMATION = { animation: false as const }

/** 给十六进制主题色补一个透明度通道，canvas 渐变用 */
function withAlpha(color: string, alpha: number) {
  const hex = /^#[0-9a-fA-F]{6}$/
  if (hex.test(color)) return `${color}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`
  return color
}

/** 柱体样式：上实下淡的竖向渐变 + 顶部圆角 */
function barFill(
  color: string,
  round: [number, number, number, number] = [5, 5, 0, 0],
  bottomAlpha = 0.42
) {
  return {
    borderRadius: round,
    color: {
      type: 'linear' as const,
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [
        { offset: 0, color: withAlpha(color, 1) },
        { offset: 1, color: withAlpha(color, bottomAlpha) },
      ],
    },
  }
}

/** 三张图共用的外壳：透明底、统一字体、浅色提示框、顶部图例 */
function chartBase(
  c: ChartColors,
  legend: { right?: number; left?: 'center' | number; fontSize?: number; gap?: number }
) {
  return {
    ...NO_ANIMATION,
    backgroundColor: 'transparent',
    textStyle: { fontFamily: 'Noto Sans SC, sans-serif' },
    tooltip: {
      trigger: 'axis' as const,
      axisPointer: { type: 'shadow' as const, shadowStyle: { color: c['--ck-grid'] } },
      backgroundColor: c['--ck-tooltip-bg'],
      borderWidth: 0,
      padding: [8, 12],
      textStyle: { color: c['--ck-tooltip-text'], fontSize: 12 },
      extraCssText: 'border-radius:10px;',
    },
    legend: {
      top: 0,
      right: legend.right,
      left: legend.left,
      icon: 'roundRect',
      itemWidth: 10,
      itemHeight: 10,
      itemGap: legend.gap ?? 16,
      textStyle: { color: c['--text-secondary'], fontSize: legend.fontSize ?? 12 },
    },
  }
}

/** 月份 / 环节类目轴 */
function catAxis(c: ChartColors, data: string[]) {
  return {
    type: 'category' as const,
    data,
    axisTick: { show: false },
    axisLine: { show: false },
    axisLabel: { color: c['--ck-axis'], fontSize: 12, margin: 10 },
  }
}

/** 数值轴；`side` 决定轴名对齐方向以及是否画横向分隔线 */
function valAxis(
  c: ChartColors,
  name: string,
  max: number,
  interval: number,
  side: 'left' | 'right' = 'left'
) {
  return {
    type: 'value' as const,
    name,
    max,
    interval,
    nameTextStyle: {
      color: c['--text-tertiary'],
      fontSize: 10,
      align: side === 'left' ? ('right' as const) : ('left' as const),
    },
    axisLabel: { color: c['--ck-axis'], fontSize: 11 },
    axisLine: { show: false },
    axisTick: { show: false },
    splitLine: {
      show: side === 'left',
      lineStyle: { color: c['--ck-grid'], type: 'dashed' as const },
    },
  }
}

/** 挂在右侧百分比轴上的折线；带淡渐变面积与数值标签 */
function rateLine(c: ChartColors, name: string, data: number[], label = true) {
  const color = c['--ck-green']

  return {
    name,
    type: 'line' as const,
    yAxisIndex: 1,
    smooth: true,
    symbol: 'circle',
    symbolSize: 7,
    z: 6,
    data,
    lineStyle: { color, width: 2.4 },
    itemStyle: { color, borderColor: c['--ck-panel-bg-strong'], borderWidth: 1.5 },
    areaStyle: {
      color: {
        type: 'linear' as const,
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          { offset: 0, color: withAlpha(color, 0.14) },
          { offset: 1, color: withAlpha(color, 0) },
        ],
      },
    },
    label: label
      ? { show: true, position: 'top' as const, color, fontSize: 10, formatter: '{c}%' }
      : { show: false },
  }
}

/** 柱顶数值标签 */
const topLabel = (c: ChartColors) => ({
  show: true,
  position: 'top' as const,
  color: c['--text-secondary'],
  fontSize: 11,
})

/** 规划与覆盖情况：各环节领用 / 定时机器人数量分组柱状图 */
export function buildStageBotOption(c: ChartColors) {
  return {
    ...chartBase(c, { right: 2, fontSize: 12 }),
    grid: { left: 42, right: 12, top: 40, bottom: 28 },
    xAxis: catAxis(
      c,
      RPA_STAGE_BOTS.map((d) => d.stage)
    ),
    yAxis: valAxis(c, '单位：个', 200, 50),
    series: [
      {
        name: '领用机器人数量',
        type: 'bar' as const,
        barWidth: 14,
        barGap: '50%',
        data: RPA_STAGE_BOTS.map((d) => d.claimed),
        label: topLabel(c),
        itemStyle: barFill(c['--ck-cyan']),
      },
      {
        name: '定时机器人数量',
        type: 'bar' as const,
        barWidth: 14,
        data: RPA_STAGE_BOTS.map((d) => d.scheduled),
        label: topLabel(c),
        itemStyle: barFill(c['--ck-teal']),
      },
    ],
  }
}

/** 运行情况：RPA 在线运行数量柱 + 启用率折线双轴图 */
export function buildRunStatusOption(c: ChartColors) {
  return {
    ...chartBase(c, { right: 0, fontSize: 12 }),
    grid: { left: 46, right: 44, top: 44, bottom: 28 },
    xAxis: catAxis(
      c,
      RPA_RUN_TREND.map((d) => d.month)
    ),
    yAxis: [valAxis(c, '单位：个', 700, 100), valAxis(c, '单位：%', 100, 20, 'right')],
    series: [
      {
        name: 'RPA在线运行数量',
        type: 'bar' as const,
        barWidth: 20,
        data: RPA_RUN_TREND.map((d) => d.online),
        itemStyle: barFill(c['--ck-blue']),
      },
      rateLine(
        c,
        'RPA启用率',
        RPA_RUN_TREND.map((d) => d.enableRate)
      ),
    ],
  }
}

/** 运行情况：RPA 执行成功 / 失败单据量堆叠柱 + 处理成功率折线 */
export function buildTaskOption(c: ChartColors) {
  return {
    ...chartBase(c, { left: 'center', fontSize: 11, gap: 12 }),
    grid: { left: 56, right: 44, top: 46, bottom: 28 },
    xAxis: catAxis(
      c,
      RPA_TASK_TREND.map((d) => d.month)
    ),
    yAxis: [valAxis(c, '单位：个', 80000, 20000), valAxis(c, '单位：%', 100, 20, 'right')],
    series: [
      {
        name: 'RPA执行成功单据量',
        type: 'bar' as const,
        stack: 'doc',
        barWidth: 26,
        data: RPA_TASK_TREND.map((d) => d.success),
        itemStyle: barFill(c['--ck-blue'], [0, 0, 0, 0], 0.85),
      },
      {
        name: 'RPA执行失败单据量',
        type: 'bar' as const,
        stack: 'doc',
        barWidth: 26,
        data: RPA_TASK_TREND.map((d) => d.fail),
        itemStyle: barFill(c['--ck-orange'], [6, 6, 0, 0], 0.9),
      },
      rateLine(
        c,
        'RPA单据处理成功率',
        RPA_TASK_TREND.map((d) => d.rate),
        false
      ),
    ],
  }
}


/* ───────────── 运行情况 · RPA作业情况 · 转人工占比 ───────────── */

/**
 * 转人工占比双层环。
 *
 * 数据只有 `RPA_MANUAL` 里原有的转人工率与两个单据量，没有额外指标：
 * 外层厚环按「转人工 / 未人工干预」两段分，内层细环同一组数据做底衬，
 * 两层叠出层次感，解决原来单层 1px 细弧视觉过轻的问题。
 * 中心汇总数字由 React 侧覆盖一层 DOM 绘制。
 *
 * 色值都已由 `useChartColors()` 解析成具体颜色，这里不能再出现
 * `var()` 或 `color-mix()`：canvas 渲染解析不了。
 */
export function buildManualRingOption(c: ChartColors) {
  const split = [
    { name: '转人工处理单据量', value: RPA_MANUAL.rate, color: c['--ck-cyan'] },
    { name: '未人工干预单据量', value: 100 - RPA_MANUAL.rate, color: c['--ck-track'] },
  ]

  /** 两层共用的扇区定义，只有配色深浅不同 */
  const slices = (dim: boolean) =>
    split.map((d) => ({
      name: d.name,
      value: d.value,
      itemStyle: { color: d.color, opacity: dim ? 0.38 : 1 },
    }))

  return {
    ...NO_ANIMATION,
    backgroundColor: 'transparent',
    textStyle: { fontFamily: 'Noto Sans SC, sans-serif' },
    tooltip: {
      trigger: 'item' as const,
      backgroundColor: c['--ck-tooltip-bg'],
      borderWidth: 0,
      padding: [8, 12],
      textStyle: { color: c['--ck-tooltip-text'], fontSize: 12 },
      extraCssText: 'border-radius:10px;',
      valueFormatter: (v: number) => `${v}%`,
    },
    series: [
      {
        // 内层细环：同一组数据的底衬，只负责加一层厚度
        name: '转人工占比',
        type: 'pie' as const,
        center: ['50%', '50%'],
        radius: ['42%', '52%'],
        silent: true,
        label: { show: false },
        labelLine: { show: false },
        itemStyle: { borderColor: c['--ck-panel-bg-strong'], borderWidth: 2 },
        data: slices(true),
      },
      {
        // 外层主环：加粗、圆角、扇区间留缝
        name: '转人工占比',
        type: 'pie' as const,
        center: ['50%', '50%'],
        radius: ['58%', '84%'],
        minAngle: 6,
        padAngle: 2,
        label: { show: false },
        labelLine: { show: false },
        itemStyle: {
          borderColor: c['--ck-panel-bg-strong'],
          borderWidth: 1.5,
          borderRadius: 4,
        },
        emphasis: {
          scale: true,
          scaleSize: 6,
          itemStyle: { shadowBlur: 12, shadowColor: c['--ck-grid'] },
        },
        data: slices(false),
      },
    ],
  }
}
