import ReactECharts from 'echarts-for-react'
import { useMemo } from 'react'

import { PanelBox, SectionTitle, useChartColors } from '@/components/cockpit-ui'

import {
  buildAppealBarOption,
  buildAppealLineOption,
  buildDeductOption,
} from './creditChartOptions'
import {
  CREDIT_APPEAL_PASSED,
  CREDIT_APPEAL_RATE,
  CREDIT_CORE_RATIO,
  CREDIT_DEDUCT_FILTERS,
  CREDIT_RING_ORDER,
  CREDIT_TIERS,
} from './creditData'
import type { CreditTierItem } from './creditData'
import { CreditRuleBody, CreditSelect } from './creditRuleWidgets'

/** 信用管理监控平台的中间业务区（对应 `_refs/live/16-信用管理监控平台.png`） */
export function CreditPlatformContent() {
  return (
    <div className="flex min-h-0 flex-1 gap-2.5">
      <OverviewPanel className="w-[516px] shrink-0" />
      <AppealPanel className="w-[516px] shrink-0" />

      <PanelBox
        title="信用规则全生命周期管理"
        className="flex min-w-0 flex-1 flex-col"
        bodyClassName="flex min-h-0 flex-1 flex-col"
      >
        <CreditRuleBody />
      </PanelBox>
    </div>
  )
}

/* ───────────── 左栏 · 信用整体情况 ───────────── */

function OverviewPanel({ className = '' }: { className?: string }) {
  const c = useChartColors()
  const deductOption = useMemo(() => buildDeductOption(c), [c])

  return (
    <PanelBox
      title="信用整体情况"
      className={`flex flex-col ${className}`}
      bodyClassName="flex min-h-0 flex-1 flex-col"
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2 px-3 pt-2 pb-3">
        <SectionTitle className="shrink-0">员工信用分布</SectionTitle>

        <div className="flex h-[228px] shrink-0 items-center justify-center">
          <CreditDonut />
        </div>

        <div className="grid shrink-0 grid-cols-2 gap-2">
          {CREDIT_TIERS.map((tier) => (
            <TierCard key={tier.label} tier={tier} />
          ))}
        </div>

        <SectionTitle
          className="shrink-0 pt-1"
          extra={<CreditSelect options={CREDIT_DEDUCT_FILTERS} label="单据类型" />}
        >
          扣分单据比例
        </SectionTitle>

        <DeductLegend />

        <div className="min-h-0 flex-1">
          <ReactECharts
            option={deductOption}
            style={{ height: '100%', width: '100%' }}
            opts={{ renderer: 'canvas' }}
            notMerge
          />
        </div>
      </div>
    </PanelBox>
  )
}

/** 员工信用分布多色环，内嵌严重失信人员占比 */
function CreditDonut() {
  const size = 188
  const half = size / 2
  const r = 78
  const width = 24
  const circ = 2 * Math.PI * r

  let offset = 0
  const segments = CREDIT_RING_ORDER.map((tone) => {
    const tier = CREDIT_TIERS.find((t) => t.tone === tone)
    const arc = tier?.arc ?? 0
    const seg = { tone, arc, start: offset }
    offset += arc
    return seg
  })

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={half}
          cy={half}
          r={r}
          fill="none"
          stroke="var(--ck-track)"
          strokeWidth={width}
        />

        {segments.map((seg) => (
          <circle
            key={seg.tone}
            cx={half}
            cy={half}
            r={r}
            fill="none"
            stroke={`var(--ck-${seg.tone})`}
            strokeWidth={width}
            strokeDasharray={`${(circ * seg.arc) / 100} ${circ}`}
            strokeDashoffset={-(circ * seg.start) / 100}
            transform={`rotate(-90 ${half} ${half})`}
          />
        ))}

        <circle
          cx={half}
          cy={half}
          r={r - width / 2 - 5}
          fill="var(--ck-panel-bg-strong)"
          stroke="var(--ck-card-border)"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
        <span className="ck-glow-num text-[30px] leading-none font-bold text-(--foreground)">
          {CREDIT_CORE_RATIO.value}
        </span>
        <span className="text-[13px] leading-none text-(--ck-title-sub)">
          {CREDIT_CORE_RATIO.label}
        </span>
      </div>
    </div>
  )
}

/** 分档人数卡片，严重失信那张为高亮态 */
function TierCard({ tier }: { tier: CreditTierItem }) {
  return (
    <div
      className="flex flex-col gap-2.5 rounded-[3px] px-3 py-2.5"
      style={
        tier.active
          ? {
              background: 'linear-gradient(135deg, var(--ck-icon-from), var(--ck-icon-to))',
              border: '1px solid var(--ck-blue)',
              boxShadow: 'var(--ck-card-shadow)',
            }
          : {
              background: 'var(--ck-panel-inner)',
              border: '1px solid var(--ck-panel-inner-border)',
            }
      }
    >
      <span className="flex items-center gap-1.5">
        <i
          className="h-[7px] w-[7px] shrink-0 rounded-full"
          style={{ background: `var(--ck-${tier.tone})` }}
        />
        <span className="text-[13px] leading-none text-(--ck-title-sub)">{tier.label}</span>
      </span>

      <span className="flex items-baseline gap-1">
        <span className="text-[20px] leading-none font-bold text-(--ck-cyan) tabular-nums">
          {tier.value}
        </span>
        <span className="text-[11px] leading-none text-(--text-tertiary)">人.</span>
        <span className="text-[12px] leading-none text-(--text-secondary)">占比</span>
        <span className="text-[16px] leading-none font-bold text-(--ck-cyan) tabular-nums">
          {tier.ratio}
        </span>
      </span>
    </div>
  )
}

/** 扣分单据比例图表上方的单位与图例行 */
function DeductLegend() {
  const items: { label: string; tone: string; shape: 'bar' | 'dot' }[] = [
    { label: '员工出行', tone: '--ck-blue', shape: 'bar' },
    { label: '物资采购', tone: '--ck-green', shape: 'bar' },
    { label: '服务业务', tone: '--ck-cyan', shape: 'bar' },
    { label: '扣分单据比例', tone: '--ck-purple', shape: 'dot' },
  ]

  return (
    <div className="flex shrink-0 items-center justify-between gap-1 pl-1 text-[11px] leading-none whitespace-nowrap text-(--text-secondary)">
      <span>单位：个</span>

      {items.map((item) => (
        <span key={item.label} className="flex items-center gap-1">
          {item.shape === 'bar' ? (
            <i
              className="h-[9px] w-[9px] shrink-0 rounded-[1px]"
              style={{ background: `var(${item.tone})` }}
            />
          ) : (
            <i
              className="h-[9px] w-[9px] shrink-0 rounded-full border-2 border-(--ck-panel-bg-strong)"
              style={{ background: `var(${item.tone})` }}
            />
          )}
          <span className="text-(--foreground)">{item.label}</span>
        </span>
      ))}

      <span>单位：%</span>
    </div>
  )
}

/* ───────────── 中栏 · 申诉处理情况 ───────────── */

function AppealPanel({ className = '' }: { className?: string }) {
  const c = useChartColors()

  const barOption = useMemo(() => buildAppealBarOption(c), [c])

  const passedOption = useMemo(
    () =>
      buildAppealLineOption(c, {
        data: CREDIT_APPEAL_PASSED,
        max: 1.2,
        interval: 0.2,
        color: c['--ck-blue'],
        digits: 2,
      }),
    [c]
  )

  const rateOption = useMemo(
    () =>
      buildAppealLineOption(c, {
        data: CREDIT_APPEAL_RATE,
        max: 0.4,
        interval: 0.1,
        color: c['--ck-green'],
        area: true,
        digits: 2,
      }),
    [c]
  )

  return (
    <PanelBox
      title="申诉处理情况"
      className={`flex flex-col ${className}`}
      bodyClassName="flex min-h-0 flex-1 flex-col"
    >
      <div className="flex min-h-0 flex-1 flex-col gap-1 px-3 pt-2 pb-3">
        <AppealBlock title="申诉发起总量" unit="个" option={barOption} />
        <AppealBlock title="申诉通过数量" unit="%" option={passedOption} />
        <AppealBlock title="申诉通过率" unit="%" option={rateOption} />
      </div>
    </PanelBox>
  )
}

function AppealBlock({
  title,
  unit,
  option,
}: {
  title: string
  unit: string
  option: Record<string, unknown>
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-1">
      <SectionTitle className="shrink-0">{title}</SectionTitle>
      <span className="shrink-0 pl-1 text-[11px] leading-none text-(--text-secondary)">
        单位：{unit}
      </span>
      <div className="min-h-0 flex-1">
        <ReactECharts
          option={option}
          style={{ height: '100%', width: '100%' }}
          opts={{ renderer: 'canvas' }}
          notMerge
        />
      </div>
    </div>
  )
}
