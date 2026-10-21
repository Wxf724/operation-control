import type { ChartVarName } from '@/components/cockpit-ui'

import {
  TRAVEL_FLIGHT_DISCOUNTS,
  TRAVEL_HOTEL_PRICES,
  TRAVEL_MONTHS,
  TRAVEL_ORDER_AMOUNTS,
  TRAVEL_PRICE_SERIES,
} from './travelData'

/** `useChartColors()` 解析出来的主题色表 */
export type TravelChartColors = Record<ChartVarName, string>

/** 提示框皮肤：白卡片 + 柔和蓝投影，随主题取色（canvas 解析不了 `var()`） */
function tooltip(c: TravelChartColors) {
  return {
    trigger: 'axis' as const,
    backgroundColor: c['--ck-panel-bg-strong'],
    borderColor: c['--ck-panel-border'],
    borderWidth: 1,
    textStyle: { color: c['--foreground'], fontSize: 12 },
    extraCssText: 'box-shadow: 0 6px 18px rgba(42,102,232,0.16); border-radius: 8px;',
  }
}

/** 四张图共用的外壳：透明底、统一字体、统一 tooltip */
function chartBase(c: TravelChartColors) {
  return {
    /**
     * 关掉入场动画。
     *
     * `useChartColors()` 挂载后才解析出真实色值，option 因此被重建并以 notMerge 重新 setOption；
     * 面板用 flex-1 定高时容器尺寸回调又会再触发一次渲染，动画被反复打回起点，
     * 表现为「只有坐标轴、没有柱子和折线」。
     */
    animation: false,
    backgroundColor: 'transparent',
    textStyle: { fontFamily: 'Noto Sans SC, sans-serif' },
    tooltip: tooltip(c),
  }
}

/** 月份类目轴；`sparse` 为真时隔一个月显示一次刻度文字 */
function monthAxis(c: TravelChartColors, sparse = false) {
  return {
    type: 'category' as const,
    data: TRAVEL_MONTHS,
    boundaryGap: true,
    axisTick: { show: false },
    axisLine: { lineStyle: { color: c['--ck-panel-border'] } },
    axisLabel: {
      color: c['--ck-axis'],
      fontSize: 11,
      interval: sparse ? 1 : 0,
    },
  }
}

/** 数值轴，带虚线分隔 */
function valueAxis(c: TravelChartColors, max: number, interval: number) {
  return {
    type: 'value' as const,
    max,
    interval,
    axisLabel: { color: c['--ck-axis'], fontSize: 10 },
    axisLine: { show: false },
    axisTick: { show: false },
    splitLine: { lineStyle: { color: c['--ck-grid'], type: 'dashed' as const } },
  }
}

/** 给十六进制主题色补透明通道，canvas 渐变用 */
function fade(color: string, alpha: string) {
  return color.startsWith('#') && color.length === 7 ? `${color}${alpha}` : color
}

/* ───────────── 商旅业务整体情况：预订订单总金额柱状图 ───────────── */

/** 商旅预订订单总金额柱状图，单位：万元 */
export function buildOrderAmountOption(c: TravelChartColors) {
  return {
    ...chartBase(c),
    grid: { left: 40, right: 8, top: 12, bottom: 22 },
    xAxis: monthAxis(c),
    yAxis: valueAxis(c, 6000, 2000),
    series: [
      {
        name: '商旅预订订单总金额',
        type: 'bar' as const,
        barWidth: 13,
        data: TRAVEL_ORDER_AMOUNTS,
        itemStyle: {
          borderRadius: [2, 2, 0, 0] as [number, number, number, number],
          color: {
            type: 'linear' as const,
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: c['--ck-cyan'] },
              { offset: 1, color: c['--ck-blue'] },
            ],
          },
        },
      },
    ],
  }
}

/* ───────────── 商旅价格波动情况：三线折线图 ───────────── */

/** 火车 / 飞机 / 酒店日均预定张数折线图 */
export function buildPriceTrendOption(c: TravelChartColors) {
  return {
    ...chartBase(c),
    legend: {
      top: 0,
      left: 'center' as const,
      itemWidth: 9,
      itemHeight: 9,
      itemGap: 16,
      textStyle: { color: c['--text-secondary'], fontSize: 11 },
    },
    grid: { left: 34, right: 8, top: 26, bottom: 20 },
    xAxis: monthAxis(c, true),
    yAxis: valueAxis(c, 600, 200),
    series: TRAVEL_PRICE_SERIES.map((s) => ({
      name: s.name,
      type: 'line' as const,
      smooth: false,
      symbol: 'circle',
      symbolSize: 5,
      data: s.data,
      lineStyle: { width: 2, color: c[s.tone as ChartVarName] },
      itemStyle: { color: c[s.tone as ChartVarName] },
    })),
  }
}

/* ───────────── 常住酒店价格浮动情况 / 常飞航线综合折扣率 ───────────── */

/** 折线上的数值标签：谷底放到线下方，其余放上方 */
function labeledPoints(values: number[], color: string) {
  return values.map((v, i) => {
    const prev = values[i - 1]
    const next = values[i + 1]
    const valley = (prev === undefined || v <= prev) && (next === undefined || v <= next) && i !== 0
    return {
      value: v,
      label: {
        show: true,
        position: (valley ? 'bottom' : 'top') as 'top' | 'bottom',
        color,
        fontSize: 11,
        fontWeight: 'bold' as const,
      },
    }
  })
}

/** 单条带数值标签的折线图外壳；`labelColor` 由调用方从 `--foreground` 解析后传入 */
function singleLineOption(
  c: TravelChartColors,
  tone: ChartVarName,
  values: number[],
  max: number,
  interval: number,
  area: boolean,
  labelColor: string
) {
  const color = c[tone]
  return {
    ...chartBase(c),
    grid: { left: 34, right: 10, top: 20, bottom: 20 },
    xAxis: monthAxis(c, true),
    yAxis: valueAxis(c, max, interval),
    series: [
      {
        type: 'line' as const,
        symbol: 'circle',
        symbolSize: 6,
        data: labeledPoints(values, labelColor),
        lineStyle: { width: 2, color },
        itemStyle: { color },
        areaStyle: area
          ? {
              color: {
                type: 'linear' as const,
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: fade(color, '4d') },
                  { offset: 1, color: fade(color, '00') },
                ],
              },
            }
          : undefined,
      },
    ],
  }
}

/** 常住酒店价格浮动情况，单位：元 */
export function buildHotelPriceOption(c: TravelChartColors, labelColor: string) {
  return singleLineOption(c, '--ck-green', TRAVEL_HOTEL_PRICES, 600, 200, true, labelColor)
}

/** 常飞航线综合折扣率，单位：折 */
export function buildDiscountOption(c: TravelChartColors, labelColor: string) {
  return singleLineOption(c, '--ck-cyan', TRAVEL_FLIGHT_DISCOUNTS, 6, 2, false, labelColor)
}

/* ───────────── 手写 SVG 用的极坐标工具 ───────────── */

/** 极坐标转屏幕坐标，`deg` 以三点钟方向为 0、顺时针增大 */
export function polar(cx: number, cy: number, r: number, deg: number) {
  const a = (deg * Math.PI) / 180
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }
}

/** 顺时针圆弧的 path 字符串 */
export function arcPath(cx: number, cy: number, r: number, from: number, to: number) {
  const p1 = polar(cx, cy, r, from)
  const p2 = polar(cx, cy, r, to)
  const large = to - from > 180 ? 1 : 0
  return `M ${p1.x.toFixed(2)} ${p1.y.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`
}

/** 大仪表盘的刻度数字与所在百分比位置 */
export const TRAVEL_GAUGE_TICKS = [20, 40, 60, 80]
