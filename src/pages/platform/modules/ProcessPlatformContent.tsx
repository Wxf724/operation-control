import { useState } from 'react'

import { PanelBox, SectionTitle } from '@/components/cockpit-ui'

import { CenterColumn, TeamColumn } from './processColumns'
import {
  COMPLIANCE_ITEMS,
  COMPLIANCE_RATE,
  CENTER_UNPOSTED_BLOCK,
  ENTERPRISE_STAGE_TABS,
  ENTERPRISE_SUBMIT_BLOCK,
  ENTERPRISE_UNPOSTED_BLOCK,
  PERIOD_CLOSE_CARD,
  PROCESS_STAGE_TAB_LABELS,
  REPORT_GAUGES,
} from './processData'
import type { ProcessDonutBlock, ProcessReportGauge } from './processData'
import {
  ComplianceGauge,
  DetailList,
  DonutRing,
  IconStatCard,
  PedestalIcon,
  ReportGauge,
  StageCard,
  SubTitle,
  TabPills,
} from './processWidgets'

/** 标准流程管理平台的中间业务区（对应 `_refs/live/14-标准流程管理平台.png`） */
export function ProcessPlatformContent() {
  return (
    <div className="flex min-h-0 flex-1 gap-2.5">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-2.5">
        <TimelinessPanel className="min-h-0 flex-1" />
        <CompliancePanel className="h-[138px] shrink-0" />
      </div>
    </div>
  )
}

/* ───────────── 上块 · 标准流程时效性情况 ───────────── */

function TimelinessPanel({ className = '' }: { className?: string }) {
  return (
    <PanelBox title="标准流程时效性情况" className={`flex flex-col ${className}`}>
      <div className="flex h-full gap-4 px-4 pt-2.5 pb-3">
        <EnterpriseColumn className="w-[414px] shrink-0" />
        <TeamColumn className={`${DIVIDER} w-[320px] shrink-0`} />
        <CenterColumn className={`${DIVIDER} w-[322px] shrink-0`} />
        <RightColumn className={`${DIVIDER} min-w-0 flex-1`} />
      </div>
    </PanelBox>
  )
}

const DIVIDER = 'border-l border-(--border-light) pl-4'

/* ───────────── 第一列 · 企业端业务处理情况 ───────────── */

function EnterpriseColumn({ className = '' }: { className?: string }) {
  const [tab, setTab] = useState(0)
  const items = ENTERPRISE_STAGE_TABS[tab].items

  return (
    <div className={`flex min-h-0 flex-col gap-2.5 ${className}`}>
      <SectionTitle className="shrink-0">企业端业务处理情况</SectionTitle>
      <TabPills labels={PROCESS_STAGE_TAB_LABELS} active={tab} onChange={setTab} />

      <div className="flex shrink-0 flex-col gap-2">
        {items.map((item) => (
          <StageCard key={item.label} item={item} tone="blue" />
        ))}
      </div>

      <DonutDetailBlock block={ENTERPRISE_SUBMIT_BLOCK} className="min-h-0 flex-1" />
      <DonutDetailBlock block={ENTERPRISE_UNPOSTED_BLOCK} className="min-h-0 flex-1" />
    </div>
  )
}

/** 小标题 + 左环形右明细的组合块 */
function DonutDetailBlock({
  block,
  className = '',
}: {
  block: ProcessDonutBlock
  className?: string
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <SubTitle>{block.title}</SubTitle>

      <div className="flex min-h-0 flex-1 items-center gap-2">
        <div className="flex w-[112px] shrink-0 flex-col items-center gap-1">
          <span className="text-[12px] leading-none text-(--text-secondary)">{block.unit}</span>
          <DonutRing total={block.total} ratio={block.ratio} tone={block.tone} />
        </div>

        <DetailList rows={block.rows} className="min-h-0 min-w-0 flex-1 self-stretch" />
      </div>
    </div>
  )
}

/* ───────────── 第四列 · 会计期间 / 报表及时率 / 结账未制证 ───────────── */

function RightColumn({ className = '' }: { className?: string }) {
  return (
    <div className={`flex min-h-0 flex-col gap-2.5 ${className}`}>
      <IconStatCard
        className="shrink-0 justify-center"
        inline
        label={PERIOD_CLOSE_CARD.label}
        value={PERIOD_CLOSE_CARD.value}
        unit={PERIOD_CLOSE_CARD.unit}
        icon={PERIOD_CLOSE_CARD.icon}
      />

      <div className="grid shrink-0 grid-cols-3 gap-3">
        {REPORT_GAUGES.map((item) => (
          <ReportGaugeCell key={item.label} item={item} />
        ))}
      </div>

      <SubTitle extra={CENTER_UNPOSTED_BLOCK.unit}>{CENTER_UNPOSTED_BLOCK.title}</SubTitle>

      <div className="flex shrink-0 justify-center">
        <DonutRing
          total={CENTER_UNPOSTED_BLOCK.total}
          ratio={CENTER_UNPOSTED_BLOCK.ratio}
          tone={CENTER_UNPOSTED_BLOCK.tone}
          size={112}
          thickness={13}
        />
      </div>

      <DetailList rows={CENTER_UNPOSTED_BLOCK.rows} className="min-h-0 flex-1" />
    </div>
  )
}

/** 单个报表及时率：仪表盘 + 名称 + 完成率 + 进度条 */
function ReportGaugeCell({ item }: { item: ProcessReportGauge }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <ReportGauge item={item} />

      <span className="w-full truncate text-center text-[12px] leading-none text-(--foreground)">
        {item.label}
      </span>

      <span className="flex w-full items-baseline justify-between gap-1">
        <span className="text-[13px] leading-none text-(--ck-title-sub)">完成率</span>
        <span className="text-[19px] leading-none font-bold text-(--ck-cyan) tabular-nums">
          {item.done}%
        </span>
      </span>

      <div
        className="h-[7px] w-full overflow-hidden rounded-[2px]"
        style={{ background: 'var(--ck-track)' }}
      >
        <div
          className="h-full rounded-[2px]"
          style={{
            width: `${item.done}%`,
            background: 'linear-gradient(90deg, var(--ck-blue), var(--ck-cyan))',
          }}
        />
      </div>
    </div>
  )
}

/* ───────────── 下块 · 标准流程合规性情况 ───────────── */

function CompliancePanel({ className = '' }: { className?: string }) {
  return (
    <PanelBox title="标准流程合规性情况" className={`flex flex-col ${className}`}>
      <div className="grid h-full grid-cols-3 items-center gap-4 px-4 pt-1 pb-2">
        <div className="flex items-center justify-center gap-6">
          <ComplianceGauge value={COMPLIANCE_RATE.value} />
          <span className="flex flex-col items-center gap-2.5">
            <span className="text-[15px] leading-none text-(--ck-title-sub)">
              {COMPLIANCE_RATE.label}
            </span>
            <span className="flex items-baseline gap-0.5">
              <span className="ck-glow-num text-[30px] leading-none font-bold text-(--ck-cyan)">
                {COMPLIANCE_RATE.value}
              </span>
              <span className="text-[13px] leading-none text-(--text-secondary)">%</span>
            </span>
          </span>
        </div>

        {COMPLIANCE_ITEMS.map((item) => (
          <div
            key={item.label}
            className="flex h-[76px] items-center justify-center gap-5 rounded-[4px] border"
            style={{
              borderColor: 'var(--ck-card-border)',
              background: 'linear-gradient(135deg, var(--ck-card-from) 0%, var(--ck-card-to) 100%)',
              boxShadow: 'var(--ck-card-shadow)',
            }}
          >
            <PedestalIcon icon={item.icon} size={48} />
            <span className="flex flex-col items-center gap-2.5">
              <span className="text-[15px] leading-none text-(--ck-title-sub)">{item.label}</span>
              <span className="flex items-baseline gap-0.5">
                <span className="ck-glow-num text-[28px] leading-none font-bold text-(--ck-cyan)">
                  {item.value}
                </span>
                <span className="text-[12px] leading-none text-(--text-secondary)">
                  {item.unit}
                </span>
              </span>
            </span>
          </div>
        ))}
      </div>
    </PanelBox>
  )
}
