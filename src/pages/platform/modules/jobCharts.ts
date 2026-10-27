import type { ChartVarName } from '@/components/cockpit-ui'

import { JOB_COMPLETE_TREND, JOB_CROSS_CENTER, JOB_EMERGENCY, JOB_LOAD_SATURATION } from './jobData'
import type { JobNormChart } from './jobData'

/* ═══════════ 作业管理平台的 ECharts 配置（浅蓝白） ═══════════ */

const FONT = { fontFamily: 'Noto Sans SC, sans-serif' }

type Colors = Record<ChartVarName, string>

/**
 * 关掉入场动画。
 *
 * `useChartColors()` 挂载后才解析出真实色值，option 因此会被重建并以 notMerge 重新 setOption；
 * 面板用 flex-1 定高时容器尺寸回调又会再触发一次渲染，动画被反复打回起点，
 * 表现为「只有坐标轴和图例、柱子和折线全部停在 0」。大屏是常驻展示，直接静态出图最稳。
 * 同仓库的 credit / rpa 模块早就这么做了，作业页是唯一的漏网之鱼。
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

/** 浅色主题下的柱体渐变：顶部实色 → 底部淡一档 */
function barFill(c: Colors, varName: ChartVarName) {
  return vGradient(alpha(c[varName], 1), alpha(c[varName], 0.58))
}

/** 提示框皮肤，随主题取色 */
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

/** 柱顶数值标签，随主题取色 */
function barLabel(c: Colors) {
  return { show: true, position: 'top' as const, color: c['--ck-axis'], fontSize: 12 }
}

const BAR_RADIUS = [3, 3, 0, 0] as [number, number, number, number]

function catAxis(c: Colors, data: string[]) {
  return {
    type: 'category' as const,
    data,
    boundaryGap: true,
    axisLine: { lineStyle: { color: c['--ck-panel-border'] } },
    axisTick: { show: false },
    axisLabel: { color: c['--ck-axis'], fontSize: 12, interval: 0, margin: 7 },
  }
}

function valAxis(c: Colors, opts: { max?: number; interval?: number; name?: string } = {}) {
  return {
    type: 'value' as const,
    name: opts.name,
    nameTextStyle: { color: c['--text-tertiary'], fontSize: 11, align: 'right' as const },
    nameGap: 8,
    min: 0,
    max: opts.max,
    interval: opts.interval,
    axisLabel: {
      color: c['--ck-axis'],
      fontSize: 11,
      margin: 6,
      // 线上原件的纵轴不加千分位（200000 而非 200,000）
      formatter: (value: number) => String(value),
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
    right: 2,
    itemWidth: 10,
    itemHeight: 10,
    itemGap: 18,
    icon: 'circle',
    textStyle: { color: c['--text-secondary'], fontSize: 12 },
  }
}

/** 单据接收量 / 单据完成量 双折线 */
export function buildTrendOption(c: Colors) {
  return {
    animation: ANIMATION,
    backgroundColor: 'transparent',
    textStyle: FONT,
    tooltip: tooltip(c),
    legend: legendOf(c, ['单据接收量', '单据完成量']),
    grid: { left: 2, right: 10, top: 26, bottom: 0, containLabel: true },
    xAxis: catAxis(
      c,
      JOB_COMPLETE_TREND.map((d) => d.month)
    ),
    yAxis: valAxis(c, { max: 200000, interval: 50000 }),
    series: [
      {
        name: '单据接收量',
        type: 'line',
        symbol: 'circle',
        symbolSize: 7,
        data: JOB_COMPLETE_TREND.map((d) => d.received),
        lineStyle: { color: c['--ck-blue'], width: 2.2, type: 'dashed' as const },
        itemStyle: { color: c['--ck-blue'] },
      },
      {
        name: '单据完成量',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 7,
        data: JOB_COMPLETE_TREND.map((d) => d.finished),
        lineStyle: { color: c['--ck-green'], width: 2.6 },
        itemStyle: { color: c['--ck-green'] },
        areaStyle: { color: vGradient(alpha(c['--ck-green'], 0.18), alpha(c['--ck-green'], 0.02)) },
      },
    ],
  }
}

/** 作业处理规范情况的三张柱状图（末柱可高亮成预警红） */
export function buildNormOption(c: Colors, chart: JobNormChart) {
  const last = chart.data.length - 1
  const blue = barFill(c, '--ck-cyan')
  const red = barFill(c, '--ck-red')

  return {
    animation: ANIMATION,
    backgroundColor: 'transparent',
    textStyle: FONT,
    tooltip: tooltip(c),
    grid: { left: 0, right: 6, top: 22, bottom: 0, containLabel: true },
    xAxis: catAxis(
      c,
      chart.data.map((d) => d.month)
    ),
    yAxis: valAxis(c, { max: chart.yMax, interval: chart.yInterval }),
    series: [
      {
        type: 'bar',
        barWidth: 14,
        label: barLabel(c),
        data: chart.data.map((d, i) => ({
          value: d.value,
          itemStyle: {
            color: chart.highlightLast && i === last ? red : blue,
            borderRadius: BAR_RADIUS,
          },
        })),
      },
    ],
  }
}

/** 跨中心调整的单据量 */
export function buildCrossCenterOption(c: Colors) {
  return {
    animation: ANIMATION,
    backgroundColor: 'transparent',
    textStyle: FONT,
    tooltip: tooltip(c),
    legend: legendOf(c, [JOB_CROSS_CENTER.legend]),
    grid: { left: 0, right: 6, top: 32, bottom: 0, containLabel: true },
    xAxis: catAxis(
      c,
      JOB_CROSS_CENTER.data.map((d) => d.month)
    ),
    yAxis: valAxis(c, {
      max: JOB_CROSS_CENTER.yMax,
      interval: JOB_CROSS_CENTER.yInterval,
      name: '笔',
    }),
    series: [
      {
        name: JOB_CROSS_CENTER.legend,
        type: 'bar',
        barWidth: 14,
        label: barLabel(c),
        itemStyle: { color: barFill(c, '--ck-blue'), borderRadius: BAR_RADIUS },
        data: JOB_CROSS_CENTER.data.map((d) => d.value),
      },
    ],
  }
}

/** 单据分配负载率趋势（面积折线） */
export function buildSaturationOption(c: Colors) {
  return {
    animation: ANIMATION,
    backgroundColor: 'transparent',
    textStyle: FONT,
    tooltip: tooltip(c),
    grid: { left: 0, right: 14, top: 24, bottom: 0, containLabel: true },
    xAxis: {
      ...catAxis(
        c,
        JOB_LOAD_SATURATION.data.map((d) => d.month)
      ),
      boundaryGap: false,
    },
    yAxis: valAxis(c, {
      max: JOB_LOAD_SATURATION.yMax,
      interval: JOB_LOAD_SATURATION.yInterval,
    }),
    series: [
      {
        type: 'line',
        symbol: 'circle',
        symbolSize: 7,
        data: JOB_LOAD_SATURATION.data.map((d) => d.value),
        label: {
          show: true,
          position: 'top' as const,
          color: c['--ck-axis'],
          fontSize: 12,
          formatter: (p: { value: number }) => p.value.toFixed(1),
        },
        lineStyle: { color: c['--ck-cyan'], width: 2.6 },
        itemStyle: { color: c['--ck-cyan'] },
        areaStyle: { color: vGradient(alpha(c['--ck-blue'], 0.4), alpha(c['--ck-cyan'], 0.02)) },
      },
    ],
  }
}

/** 应急处理情况：标准 / 最大单据处理量分组柱 */
export function buildEmergencyOption(c: Colors) {
  const [standardName, maxName] = JOB_EMERGENCY.legend

  return {
    animation: ANIMATION,
    backgroundColor: 'transparent',
    textStyle: FONT,
    tooltip: tooltip(c),
    legend: legendOf(c, [standardName, maxName]),
    grid: { left: 0, right: 6, top: 32, bottom: 0, containLabel: true },
    xAxis: catAxis(c, [...JOB_EMERGENCY.months]),
    yAxis: valAxis(c, { max: JOB_EMERGENCY.yMax, interval: JOB_EMERGENCY.yInterval, name: '笔' }),
    series: [
      {
        name: standardName,
        type: 'bar',
        barWidth: 9,
        barGap: '18%',
        data: [...JOB_EMERGENCY.standard],
        itemStyle: { color: barFill(c, '--ck-cyan'), borderRadius: BAR_RADIUS },
      },
      {
        name: maxName,
        type: 'bar',
        barWidth: 9,
        data: [...JOB_EMERGENCY.maximum],
        itemStyle: { color: barFill(c, '--ck-blue'), borderRadius: BAR_RADIUS },
      },
    ],
  }
}
