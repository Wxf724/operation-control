import ReactECharts from 'echarts-for-react'
import { useMemo } from 'react'

import { useChartColors } from '@/components/cockpit-ui'
import type { ChartVarName } from '@/components/cockpit-ui'

/** 环形图的一段 */
export interface DrillDonutSegment {
  label: string
  value: number
  /** 取色用的 CSS 变量名 */
  colorVar: string
}

/** 环形图（可带中心读数） */
export interface DrillDonutProps {
  segments: readonly DrillDonutSegment[]
  /** 中心上方的说明文字 */
  centerLabel?: string
  /** 中心的大数字 */
  centerValue?: string
  /** 是否在底部画图例胶囊 */
  legend?: boolean
  className?: string
}

const CHART_PROPS = {
  style: { height: '100%', width: '100%' },
  opts: { renderer: 'canvas' as const },
  notMerge: true,
}

/**
 * 通用环形图：左侧（或下方）图例胶囊 + 环形本体 + 可选中心读数。
 *
 * 取色走 `useChartColors()`——canvas 不认 CSS 变量。
 */
export function DrillDonut({
  segments,
  centerLabel,
  centerValue,
  legend = true,
  className = '',
}: DrillDonutProps) {
  const c = useChartColors()
  const option = useMemo(() => buildOption(c, segments), [c, segments])
  const total = segments.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className={`flex min-h-0 flex-col gap-2 ${className}`}>
      {legend ? (
        <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-1.5">
          {segments.map((segment) => (
            <span key={segment.label} className="flex items-center gap-1.5">
              <span
                className="block h-[8px] w-[8px] shrink-0 rounded-[2px]"
                style={{ background: `var(${segment.colorVar})` }}
              />
              <span className="text-[13px] leading-none text-(--text-secondary)">
                {segment.label}
              </span>
              <span className="text-[13px] leading-none font-semibold text-(--ck-title) tabular-nums">
                {total ? `${((segment.value / total) * 100).toFixed(1)}%` : '0%'}
              </span>
            </span>
          ))}
        </div>
      ) : null}

      <div className="relative min-h-0 flex-1">
        <ReactECharts option={option} {...CHART_PROPS} />

        {centerValue ? (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1">
            {centerLabel ? (
              <span className="text-[12px] leading-none text-(--text-secondary)">
                {centerLabel}
              </span>
            ) : null}
            <span className="ck-glow-num text-[22px] leading-none font-bold text-(--ck-title)">
              {centerValue}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  )
}

function buildOption(c: Record<ChartVarName, string>, segments: readonly DrillDonutSegment[]) {
  return {
    animation: false,
    backgroundColor: 'transparent',
    textStyle: { fontFamily: 'Noto Sans SC, sans-serif' },
    tooltip: {
      trigger: 'item' as const,
      backgroundColor: c['--ck-tooltip-bg'],
      borderWidth: 0,
      padding: [8, 12],
      textStyle: { color: c['--ck-tooltip-text'], fontSize: 12 },
      extraCssText: 'border-radius:10px;',
      formatter: '{b}<br/>{c}（{d}%）',
    },
    series: [
      {
        type: 'pie' as const,
        radius: ['48%', '74%'],
        center: ['50%', '52%'],
        avoidLabelOverlap: true,
        itemStyle: { borderColor: c['--ck-panel-bg-strong'], borderWidth: 2 },
        label: { show: false },
        labelLine: { show: false },
        data: segments.map((segment) => ({
          name: segment.label,
          value: segment.value,
          itemStyle: { color: c[segment.colorVar as ChartVarName] ?? c['--ck-cyan'] },
        })),
      },
    ],
  }
}
