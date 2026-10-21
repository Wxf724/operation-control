import type { ChartVarName } from '@/components/cockpit-ui'

import { CREDIT_APPEAL_TOTAL, CREDIT_DEDUCT_TREND } from './creditData'
import type { CreditAppealPoint } from './creditData'

type Colors = Record<ChartVarName, string>

const FONT = 'Noto Sans SC, sans-serif'
/**
 * 关掉入场动画。
 *
 * `useChartColors()` 每次渲染都返回新对象，option 因此被重建并以 notMerge 重新 setOption；
 * 面板用 flex-1 定高时容器尺寸回调又会再触发一次渲染，动画会被反复打回起点，
 * 表现为柱子和折线停在 0 的位置。大屏是常驻展示，直接静态出图最稳。
 */
const ANIMATION = false

/**
 * 把主题变量解析出的颜色转成带透明度的 rgba。
 *
 * canvas 解析不了 `var()` 和 `color-mix()`，渐变 colorStop 必须是具体色值；
 * 主题里既有 `--ck-cyan: var(--cl-primary)` 这类间接引用，也有本身就带 alpha 的 rgba，
 * 两种都要能吃进来，解析失败时退回中性主蓝而不是把非法字符串交给 ECharts。
 */
function alpha(color: string, a: number) {
  const raw = (color || '').trim()

  const hex = /^#([0-9a-f]{3})([0-9a-f]{3})?$/i.exec(raw)
  if (hex) {
    const body = hex[2] ? hex[1] + hex[2] : [...hex[1]].map((ch) => ch + ch).join('')
    const n = Number.parseInt(body, 16)
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`
  }

  const rgb = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i.exec(raw)
  if (rgb) {
    const [r, g, b] = [rgb[1], rgb[2], rgb[3]].map((v) => Math.round(Number(v)))
    return `rgba(${r}, ${g}, ${b}, ${a})`
  }

  return `rgba(42, 102, 232, ${a})`
}

/** 提示框皮肤：白底卡片 + 柔和蓝投影，跟浅蓝白主题一致 */
function tooltip(c: Colors) {
  return {
    trigger: 'axis' as const,
    backgroundColor: c['--ck-panel-bg-strong'],
    borderColor: c['--ck-panel-border'],
    borderWidth: 1,
    textStyle: { color: c['--foreground'], fontSize: 12 },
    extraCssText: 'box-shadow: 0 6px 18px rgba(42,102,232,0.16); border-radius: 8px;',
  }
}

function axisLabel(c: Colors, fontSize = 11) {
  return { color: c['--ck-axis'], fontSize }
}

function splitLine(c: Colors) {
  return { lineStyle: { color: c['--ck-grid'], type: 'dashed' as const } }
}

function categoryAxis(c: Colors, data: readonly string[]) {
  return {
    type: 'category' as const,
    data: [...data],
    boundaryGap: true,
    axisLine: { lineStyle: { color: c['--ck-panel-border'] } },
    axisTick: { show: false },
    axisLabel: axisLabel(c, 12),
  }
}

/** 左栏下方：员工出行/物资采购/服务业务堆叠柱 + 扣分单据比例折线，双 Y 轴 */
export function buildDeductOption(c: Colors) {
  const months = CREDIT_DEDUCT_TREND.map((d) => d.month)

  const bar = (name: string, key: 'travel' | 'purchase' | 'service', color: string) => ({
    name,
    type: 'bar' as const,
    stack: 'doc',
    barWidth: 22,
    data: CREDIT_DEDUCT_TREND.map((d) => d[key]),
    itemStyle: { color },
  })

  return {
    animation: ANIMATION,
    backgroundColor: 'transparent',
    textStyle: { fontFamily: FONT },
    tooltip: tooltip(c),
    grid: { left: 34, right: 32, top: 14, bottom: 26 },
    xAxis: categoryAxis(c, months),
    yAxis: [
      {
        type: 'value' as const,
        min: 0,
        max: 140,
        interval: 20,
        axisLabel: axisLabel(c),
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: splitLine(c),
      },
      {
        type: 'value' as const,
        min: 0,
        max: 20,
        interval: 5,
        axisLabel: axisLabel(c),
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
      },
    ],
    series: [
      bar('员工出行', 'travel', c['--ck-blue']),
      bar('物资采购', 'purchase', c['--ck-green']),
      bar('服务业务', 'service', c['--ck-cyan']),
      {
        name: '扣分单据比例',
        type: 'line' as const,
        yAxisIndex: 1,
        symbol: 'circle',
        symbolSize: 8,
        data: CREDIT_DEDUCT_TREND.map((d) => d.rate),
        lineStyle: { color: c['--ck-purple'], width: 2 },
        itemStyle: {
          color: c['--ck-purple'],
          borderColor: c['--ck-panel-bg-strong'],
          borderWidth: 1.5,
        },
      },
    ],
  }
}

/** 中栏上方：申诉发起总量柱状图，柱顶带白色数值标签 */
export function buildAppealBarOption(c: Colors) {
  return {
    animation: ANIMATION,
    backgroundColor: 'transparent',
    textStyle: { fontFamily: FONT },
    tooltip: tooltip(c),
    grid: { left: 34, right: 18, top: 24, bottom: 26 },
    xAxis: categoryAxis(
      c,
      CREDIT_APPEAL_TOTAL.map((d) => d.month)
    ),
    yAxis: {
      type: 'value' as const,
      min: 0,
      max: 80,
      interval: 20,
      axisLabel: axisLabel(c),
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: splitLine(c),
    },
    series: [
      {
        name: '申诉发起总量',
        type: 'bar' as const,
        barWidth: 20,
        data: CREDIT_APPEAL_TOTAL.map((d) => d.value),
        itemStyle: {
          color: {
            type: 'linear' as const,
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: alpha(c['--ck-cyan'], 1) },
              { offset: 1, color: alpha(c['--ck-blue'], 0.62) },
            ],
          },
          borderRadius: [3, 3, 0, 0] as [number, number, number, number],
        },
        label: {
          show: true,
          position: 'top' as const,
          distance: 6,
          color: c['--ck-axis'],
          fontSize: 14,
          fontWeight: 'bold' as const,
        },
      },
    ],
  }
}

/** 中栏下方两段折线的配置项 */
export interface AppealLineConfig {
  data: CreditAppealPoint[]
  /** 左轴最大值 */
  max: number
  /** 左轴刻度间隔 */
  interval: number
  /** 折线主色 */
  color: string
  /** 是否铺面积；渐变由折线主色推导，避免把字面深色塞进来 */
  area?: boolean
  /** 标签小数位 */
  digits: number
}

/** 中栏：申诉通过数量 / 申诉通过率折线，带百分比标签与可选面积 */
export function buildAppealLineOption(c: Colors, cfg: AppealLineConfig) {
  return {
    animation: ANIMATION,
    backgroundColor: 'transparent',
    textStyle: { fontFamily: FONT },
    tooltip: tooltip(c),
    grid: { left: 36, right: 24, top: 26, bottom: 26 },
    xAxis: {
      ...categoryAxis(
        c,
        cfg.data.map((d) => d.month)
      ),
      boundaryGap: false,
    },
    yAxis: {
      type: 'value' as const,
      min: 0,
      max: cfg.max,
      interval: cfg.interval,
      axisLabel: axisLabel(c),
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: splitLine(c),
    },
    series: [
      {
        type: 'line' as const,
        symbol: 'circle',
        symbolSize: 8,
        data: cfg.data.map((d, i) => ({
          value: d.value,
          label: {
            position: d.labelPosition,
            distance: 10,
            // 首点正落在网格左边缘，标签居中会压到纵轴刻度上，横向推回网格内
            offset: i === 0 ? [24, 0] : [0, 0],
          },
        })),
        lineStyle: { color: cfg.color, width: 2.5 },
        itemStyle: { color: cfg.color },
        areaStyle: cfg.area
          ? {
              color: {
                type: 'linear' as const,
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: alpha(cfg.color, 0.38) },
                  { offset: 1, color: alpha(cfg.color, 0) },
                ],
              },
            }
          : undefined,
        label: {
          show: true,
          color: c['--ck-axis'],
          fontSize: 13,
          fontWeight: 'bold' as const,
          formatter: (p: { value: number }) => `${p.value.toFixed(cfg.digits)}%`,
        },
      },
    ],
  }
}
