import type { ChartVarName } from '@/components/cockpit-ui'

/** 商旅钻取页图表共用的系列定义 */
export interface TravelSeries {
  name: string
  /** 取色用的 CSS 变量名，如 `--ck-cyan` */
  colorVar: string
  values: readonly number[]
}

/** 给十六进制主题色补透明度通道，canvas 渐变用（解析不了 `var()`） */
export function withAlpha(color: string, alpha: number) {
  if (/^#[0-9a-fA-F]{6}$/.test(color)) {
    return `${color}${Math.round(alpha * 255)
      .toString(16)
      .padStart(2, '0')}`
  }
  return color
}

/** 图表通用外壳：透明底、统一字体、浅色提示框 */
function base(c: Record<ChartVarName, string>) {
  return {
    animation: false,
    backgroundColor: 'transparent',
    textStyle: { fontFamily: 'Noto Sans SC, sans-serif' },
    tooltip: {
      trigger: 'axis' as const,
      backgroundColor: c['--ck-tooltip-bg'],
      borderWidth: 0,
      padding: [8, 12],
      textStyle: { color: c['--ck-tooltip-text'], fontSize: 12 },
      extraCssText: 'border-radius:10px;',
    },
    legend: {
      top: 0,
      right: 8,
      icon: 'roundRect',
      itemWidth: 10,
      itemHeight: 10,
      itemGap: 14,
      textStyle: { color: c['--text-secondary'], fontSize: 12 },
    },
  }
}

/** 柱图（可多系列并排），`stack` 为真时改为堆叠 */
export function buildBarOption(
  c: Record<ChartVarName, string>,
  categories: readonly string[],
  series: readonly TravelSeries[],
  stack = false
) {
  return {
    ...base(c),
    grid: { top: 34, right: 16, bottom: 10, left: 8, containLabel: true },
    xAxis: {
      type: 'category' as const,
      data: [...categories],
      axisTick: { show: false },
      axisLine: { lineStyle: { color: c['--ck-axis'] } },
      axisLabel: { color: c['--text-secondary'], fontSize: 11, interval: 0, rotate: 24 },
    },
    yAxis: {
      type: 'value' as const,
      splitLine: { lineStyle: { color: c['--ck-grid'] } },
      axisLabel: { color: c['--text-secondary'], fontSize: 11 },
    },
    series: series.map((item) => {
      const tone = c[item.colorVar as ChartVarName] ?? c['--ck-cyan']
      return {
        name: item.name,
        type: 'bar' as const,
        stack: stack ? 'total' : undefined,
        barMaxWidth: 18,
        itemStyle: {
          borderRadius: stack ? undefined : [4, 4, 0, 0],
          color: {
            type: 'linear' as const,
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: withAlpha(tone, 1) },
              { offset: 1, color: withAlpha(tone, 0.45) },
            ],
          },
        },
        data: [...item.values],
      }
    }),
  }
}

/** 折线图（可多系列） */
export function buildLineOption(
  c: Record<ChartVarName, string>,
  categories: readonly string[],
  series: readonly TravelSeries[]
) {
  return {
    ...base(c),
    grid: { top: 34, right: 16, bottom: 10, left: 8, containLabel: true },
    xAxis: {
      type: 'category' as const,
      boundaryGap: false,
      data: [...categories],
      axisTick: { show: false },
      axisLine: { lineStyle: { color: c['--ck-axis'] } },
      axisLabel: { color: c['--text-secondary'], fontSize: 11 },
    },
    yAxis: {
      type: 'value' as const,
      splitLine: { lineStyle: { color: c['--ck-grid'] } },
      axisLabel: { color: c['--text-secondary'], fontSize: 11 },
    },
    series: series.map((item) => {
      const tone = c[item.colorVar as ChartVarName] ?? c['--ck-cyan']
      return {
        name: item.name,
        type: 'line' as const,
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { color: tone, width: 2 },
        itemStyle: { color: tone },
        data: [...item.values],
      }
    }),
  }
}

/** 雷达图（单个系列，六个维度） */
export function buildRadarOption(
  c: Record<ChartVarName, string>,
  indicators: readonly string[],
  values: readonly number[],
  max: number
) {
  const tone = c['--ck-cyan']
  return {
    ...base(c),
    legend: { show: false },
    tooltip: { ...base(c).tooltip, trigger: 'item' as const },
    radar: {
      center: ['50%', '54%'],
      radius: '66%',
      indicator: indicators.map((name) => ({ name, max })),
      axisName: { color: c['--text-secondary'], fontSize: 11 },
      splitLine: { lineStyle: { color: c['--ck-grid'] } },
      splitArea: { areaStyle: { color: ['transparent', withAlpha(tone, 0.04)] } },
      axisLine: { lineStyle: { color: c['--ck-grid'] } },
    },
    series: [
      {
        type: 'radar' as const,
        symbolSize: 5,
        lineStyle: { color: tone, width: 2 },
        itemStyle: { color: tone },
        areaStyle: { color: withAlpha(tone, 0.18) },
        data: [{ value: [...values], name: '出差城市分布' }],
      },
    ],
  }
}
