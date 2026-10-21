import { useMemo } from 'react'

import { PanelBox, SectionTitle, useChartColors } from '@/components/cockpit-ui'

import {
  QualityManagementPanel,
  SatisfactionPanel,
  ServiceEnterprisePanel,
} from './PerformanceBottomPanels'
import {
  PERF_AVG_DURATION,
  PERF_BASE_STATS,
  PERF_COUNT_CARDS,
  PERF_DURATION_MAX,
  PERF_DURATION_ROWS,
} from './performanceData'
import { buildDocTrendOption, buildTimelinessOption } from './performanceChartOptions'
import { Chart, CountCard, DurationRow, Pedestal, PlateStat } from './performanceWidgets'

/** 绩效管理平台的中间业务区（对应 `_refs/live/18-绩效管理平台.png`） */
export function PerformancePlatformContent() {
  return (
    <div className="flex min-h-0 flex-1 gap-2.5">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-2.5">
        <EfficiencyPanel className="h-[458px] shrink-0" />

        <div className="flex min-h-0 flex-1 gap-2.5">
          <QualityManagementPanel className="w-[706px] shrink-0" />
          <ServiceEnterprisePanel className="w-[438px] shrink-0" />
          <SatisfactionPanel className="min-w-0 flex-1" />
        </div>
      </div>
    </div>
  )
}

/* ───────────── 效率管理情况 ───────────── */

function EfficiencyPanel({ className = '' }: { className?: string }) {
  return (
    <PanelBox title="效率管理情况" className={`flex flex-col ${className}`}>
      <div className="flex h-full gap-2.5 px-3 pt-2 pb-2">
        <QuantitySection className="w-[752px] shrink-0" />
        <span className="w-px shrink-0 self-stretch bg-(--ck-panel-inner-border)" />
        <DurationSection className="min-w-0 flex-1" />
      </div>
    </PanelBox>
  )
}

/** 左半：数量情况 */
function QuantitySection({ className = '' }: { className?: string }) {
  const c = useChartColors()
  const option = useMemo(() => buildDocTrendOption(c), [c])

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <SectionTitle>数量情况</SectionTitle>

      <div className="flex h-[54px] shrink-0 gap-2.5">
        {PERF_COUNT_CARDS.map((card) => (
          <CountCard key={card.label} label={card.label} value={card.value} unit={card.unit} />
        ))}
      </div>

      <div className="min-h-0 flex-1">
        <Chart option={option} />
      </div>

      <div className="flex h-[92px] shrink-0 gap-2">
        {PERF_BASE_STATS.map((stat) => (
          <PlateStat
            key={stat.label}
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
            unit={stat.unit}
          />
        ))}
      </div>
    </div>
  )
}

/** 右半：时长情况 */
function DurationSection({ className = '' }: { className?: string }) {
  const c = useChartColors()
  const option = useMemo(() => buildTimelinessOption(c), [c])

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <SectionTitle>时长情况</SectionTitle>

      <div className="flex min-h-0 flex-1 gap-3">
        <div className="flex w-[384px] shrink-0 flex-col">
          <div className="flex h-[76px] shrink-0 items-center justify-center gap-2">
            <span className="text-[14px] leading-none text-(--foreground)">单据平均处理时长</span>
            <Pedestal value={PERF_AVG_DURATION} unit="小时" />
          </div>

          <div className="flex min-h-0 flex-1 flex-col justify-between">
            {PERF_DURATION_ROWS.map((row, i) => (
              <DurationRow
                key={row.label}
                label={row.label}
                hours={row.hours}
                percent={Math.round((row.hours / PERF_DURATION_MAX) * 100)}
                striped={i % 2 === 0}
              />
            ))}
          </div>
        </div>

        <div className="min-h-0 min-w-0 flex-1">
          <Chart option={option} />
        </div>
      </div>
    </div>
  )
}
