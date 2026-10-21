import { useMemo } from 'react'

import { PanelBox, SectionTitle, useChartColors } from '@/components/cockpit-ui'

import {
  PERF_BUDGET_ACCURACY,
  PERF_COST_TOTAL,
  PERF_PROCESS_QUALITY,
  PERF_SATISFACTION,
} from './performanceData'
import { buildReportAccuracyOption } from './performanceChartOptions'
import { Chart, LabelBand, Pedestal, QualityOrb, SegmentBar } from './performanceWidgets'

/** 质量管理情况：全流程业务处理质量环 + 报表编制准确率折线 */
export function QualityManagementPanel({ className = '' }: { className?: string }) {
  const c = useChartColors()
  const option = useMemo(() => buildReportAccuracyOption(c), [c])

  return (
    <PanelBox title="质量管理情况" className={`flex flex-col ${className}`}>
      <div className="flex h-full gap-2 px-3 pt-2 pb-2">
        <div className="flex w-[292px] shrink-0 flex-col gap-1">
          <SectionTitle>全流程业务处理质量</SectionTitle>
          <div className="flex min-h-0 flex-1 items-center justify-center">
            <QualityOrb value={PERF_PROCESS_QUALITY} />
          </div>
        </div>

        <span className="w-px shrink-0 self-stretch bg-(--ck-panel-inner-border)" />

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <SectionTitle>报表编制准确率</SectionTitle>
          <div className="min-h-0 flex-1">
            <Chart option={option} />
          </div>
        </div>
      </div>
    </PanelBox>
  )
}

/** 服务企业情况：成本费用总额 + 成本费用预算执行准确率 */
export function ServiceEnterprisePanel({ className = '' }: { className?: string }) {
  return (
    <PanelBox title="服务企业情况" className={`flex flex-col ${className}`}>
      <div className="flex h-full flex-col px-4 pt-3 pb-4">
        <div className="flex flex-col items-center gap-2">
          <span className="text-[14px] leading-none text-(--ck-title-sub)">成本费用总额</span>
          <span className="flex items-baseline gap-1">
            <span className="ck-glow-num text-[38px] leading-none font-bold text-(--ck-cyan)">
              {PERF_COST_TOTAL.value}
            </span>
            <span className="text-[14px] leading-none text-(--ck-title-sub)">
              {PERF_COST_TOTAL.unit}
            </span>
          </span>
          <span
            className="h-[3px] w-full"
            style={{
              background:
                'linear-gradient(90deg, transparent, color-mix(in srgb, var(--ck-cyan) 60%, transparent), transparent)',
              filter: 'blur(1px)',
            }}
          />
        </div>

        <span className="mt-4 h-px w-full shrink-0 bg-(--ck-panel-inner-border)" />

        <div className="flex min-h-0 flex-1 items-center">
          <div className="ck-card flex w-full flex-col gap-3 rounded-[3px] px-4 py-3.5">
            <div className="flex items-baseline justify-between gap-2">
              <span className="flex items-center gap-1.5">
                <i className="h-[5px] w-[5px] shrink-0 rotate-45 bg-(--ck-cyan)" />
                <span className="text-[14px] leading-none text-(--foreground)">
                  成本费用预算执行准确率
                </span>
              </span>
              <span className="text-[24px] leading-none font-bold text-(--foreground) tabular-nums">
                {PERF_BUDGET_ACCURACY.toFixed(1)}%
              </span>
            </div>
            <SegmentBar value={PERF_BUDGET_ACCURACY} />
          </div>
        </div>
      </div>
    </PanelBox>
  )
}

/** 服务满意度情况：客户满意度问卷评分 + 用户投诉总量 */
export function SatisfactionPanel({ className = '' }: { className?: string }) {
  return (
    <PanelBox title="服务满意度情况" className={`flex flex-col ${className}`}>
      <div className="flex h-full flex-col justify-around px-4 py-2">
        {PERF_SATISFACTION.map((item) => (
          <div key={item.label} className="flex flex-col items-center gap-1">
            <LabelBand>{item.label}</LabelBand>
            <div className="flex items-center gap-3">
              <span className="relative flex h-[46px] w-[46px] items-center justify-center">
                <span
                  className="absolute inset-0 rounded-[8px]"
                  style={{
                    background: `color-mix(in srgb, var(--ck-${item.tone}) 14%, transparent)`,
                    border: `1px solid color-mix(in srgb, var(--ck-${item.tone}) 38%, transparent)`,
                  }}
                />
                <i
                  className={`${item.icon} relative text-[26px]`}
                  style={{ color: `var(--ck-${item.tone})` }}
                  aria-hidden
                />
              </span>
              <Pedestal value={item.value} tone={item.tone} size="sm" />
            </div>
          </div>
        ))}
      </div>
    </PanelBox>
  )
}
