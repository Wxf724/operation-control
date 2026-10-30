import ReactECharts from 'echarts-for-react'
import { useMemo } from 'react'

import { useChartColors } from '@/components/cockpit-ui'
import type { ChartVarName } from '@/components/cockpit-ui'

/** 环形图的一块 */
export interface IssueDonutSegment {
  label: string
  value: number
  /** 取色用的 CSS 变量名 */
  colorVar: string
}

/** 业务问题构成环形图 */
export interface QualityIssueDonutProps {
  segments: readonly IssueDonutSegment[]
  className?: string
}

const CHART_PROPS = {
  style: { height: '100%', width: '100%' },
  opts: { renderer: 'canvas' as const },
  notMerge: true,
}

/**
 * 业务质量钻取页左下角的构成环形图（参考图 1）。
 *
 * 上方一排图例胶囊（业务问题 / 财务调整 / 资金支付错误），下方是环形图，
 * 数值直接标在扇区外侧。取色走 `useChartColors()`，canvas 不认 CSS 变量。
 */
export function QualityIssueDonut({ segments, className = '' }: QualityIssueDonutProps) {
  const c = useChartColors()
  const option = useMemo(() => buildOption(c, segments), [c, segments])

  return (
    <div className={`ck-panel flex min-h-0 flex-col rounded-(--ck-panel-radius) p-4 ${className}`}>
      <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-2">
        {segments.map((segment) => (
          <span key={segment.label} className="flex items-center gap-1.5">
            <span
              className="block h-[9px] w-[9px] shrink-0 rounded-[2px]"
              style={{ background: `var(${segment.colorVar})` }}
            />
            <span className="text-[14px] leading-none text-(--text-secondary)">
              {segment.label}
            </span>
            <span className="text-[14px] leading-none font-semibold text-(--ck-title) tabular-nums">
              {segment.value.toLocaleString('en-US')}
            </span>
          </span>
        ))}
      </div>

      <div className="mt-2 min-h-0 flex-1">
        <ReactECharts option={option} {...CHART_PROPS} />
      </div>
    </div>
  )
}

function buildOption(c: Record<ChartVarName, string>, segments: readonly IssueDonutSegment[]) {
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
      formatter: '{b}<br/>{c}',
    },
    series: [
      {
        type: 'pie' as const,
        radius: ['46%', '72%'],
        center: ['50%', '52%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderColor: c['--ck-panel-bg-strong'],
          borderWidth: 3,
        },
        label: {
          show: true,
          color: c['--text-secondary'],
          fontSize: 14,
          formatter: '{c}',
        },
        labelLine: {
          length: 10,
          length2: 14,
          lineStyle: { color: c['--ck-axis'] },
        },
        data: segments.map((segment) => ({
          name: segment.label,
          value: segment.value,
          itemStyle: { color: c[segment.colorVar as ChartVarName] ?? c['--ck-cyan'] },
        })),
      },
    ],
  }
}
