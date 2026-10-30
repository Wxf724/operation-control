import ReactECharts from 'echarts-for-react'
import { useMemo } from 'react'

import { SectionTitle, useChartColors } from '@/components/cockpit-ui'
import type { ChartVarName } from '@/components/cockpit-ui'

/** 柱图里的一条系列 */
export interface DrillPerfSeries {
  name: string
  /** 取色用的 CSS 变量名，如 `--ck-cyan` */
  colorVar: string
  values: readonly number[]
}

/** 左上角的一条读数 */
export interface DrillPerfStat {
  label: string
  value: string
  unit: string
  colorVar: string
}

/** 明细页「性能分析」页签 */
export interface DrillPerfPanelProps {
  /** 面板小标题，如「各业务环节 RPA 处理效率」 */
  title: string
  /** 横轴分类 */
  stages: readonly string[]
  series: readonly DrillPerfSeries[]
  stats: readonly DrillPerfStat[]
  className?: string
}

const CHART_PROPS = {
  style: { height: '100%', width: '100%' },
  opts: { renderer: 'canvas' as const },
  notMerge: true,
}

/** 给十六进制主题色补透明度通道，canvas 渐变用（解析不了 `var()`） */
function withAlpha(color: string, alpha: number) {
  if (/^#[0-9a-fA-F]{6}$/.test(color)) {
    return `${color}${Math.round(alpha * 255)
      .toString(16)
      .padStart(2, '0')}`
  }
  return color
}

/** 柱体：上实下淡的竖向渐变 + 顶部圆角，与其它柱图同一套语言 */
function barFill(color: string) {
  return {
    borderRadius: [5, 5, 0, 0] as [number, number, number, number],
    color: {
      type: 'linear' as const,
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [
        { offset: 0, color: withAlpha(color, 1) },
        { offset: 1, color: withAlpha(color, 0.42) },
      ],
    },
  }
}

/**
 * 明细页「性能分析」页签的通用版：上面一排读数卡、下面各环节耗时对比柱图。
 *
 * 数据由各页自己传（分类、系列、四条读数），取色走 `useChartColors()`——
 * canvas 不认 CSS 变量。
 */
export function DrillPerfPanel({
  title,
  stages,
  series,
  stats,
  className = '',
}: DrillPerfPanelProps) {
  const c = useChartColors()

  const option = useMemo(() => buildPerfOption(c, stages, series), [c, stages, series])

  return (
    <section
      className={`ck-panel flex min-h-0 flex-col rounded-(--ck-panel-radius) p-4 ${className}`}
    >
      <SectionTitle>{title}</SectionTitle>

      <div className="mt-3 grid shrink-0 grid-cols-4 gap-3">
        {stats.map((item) => (
          <div
            key={item.label}
            className="ck-card flex h-[104px] items-center justify-between rounded-[12px] px-5"
          >
            <span className="flex flex-col gap-2">
              <span className="flex items-center gap-2 text-[14px] leading-none text-(--text-secondary)">
                <span
                  className="block h-[7px] w-[7px] shrink-0 rounded-full"
                  style={{ background: `var(${item.colorVar})` }}
                />
                {item.label}
              </span>
              <span className="flex items-baseline gap-1">
                <span
                  className="ck-glow-num text-[30px] leading-none font-bold"
                  style={{ color: `var(${item.colorVar})` }}
                >
                  {item.value}
                </span>
                <span className="text-[13px] leading-none text-(--text-tertiary)">{item.unit}</span>
              </span>
            </span>

            <i
              className="ri-line-chart-line text-[26px] opacity-70"
              style={{ color: `var(${item.colorVar})` }}
              aria-hidden
            />
          </div>
        ))}
      </div>

      <div className="mt-3 min-h-0 flex-1">
        <ReactECharts option={option} {...CHART_PROPS} />
      </div>
    </section>
  )
}

function buildPerfOption(
  c: Record<ChartVarName, string>,
  stages: readonly string[],
  series: readonly DrillPerfSeries[]
) {
  return {
    animation: false,
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
      valueFormatter: (value: number) => `${value} 分钟`,
    },
    legend: {
      top: 0,
      right: 8,
      icon: 'roundRect',
      itemWidth: 10,
      itemHeight: 10,
      itemGap: 16,
      textStyle: { color: c['--text-secondary'], fontSize: 13 },
    },
    grid: { top: 44, right: 24, bottom: 12, left: 16, containLabel: true },
    xAxis: {
      type: 'category' as const,
      data: [...stages],
      axisTick: { show: false },
      axisLine: { lineStyle: { color: c['--ck-axis'] } },
      axisLabel: { color: c['--text-secondary'], fontSize: 14 },
    },
    yAxis: {
      type: 'value' as const,
      name: '分钟',
      nameTextStyle: { color: c['--text-tertiary'], fontSize: 13, padding: [0, 0, 6, 0] },
      splitLine: { lineStyle: { color: c['--ck-grid'] } },
      axisLabel: { color: c['--text-secondary'], fontSize: 13 },
    },
    series: series.map((item) => ({
      name: item.name,
      type: 'bar' as const,
      barWidth: 26,
      barGap: '40%',
      itemStyle: barFill(c[item.colorVar as ChartVarName] ?? c['--ck-cyan']),
      data: [...item.values],
    })),
  }
}
