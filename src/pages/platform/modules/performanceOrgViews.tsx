import { useMemo } from 'react'

import { PanelBox, SectionTitle, useChartColors } from '@/components/cockpit-ui'
import { DrillTitleLink } from '@/pages/drill/components'
import {
  PERFORMANCE_EFFICIENCY_DRILL_PATH,
  PERFORMANCE_QUALITY_DRILL_PATH,
  PERFORMANCE_SERVICE_DRILL_PATH,
  PERFORMANCE_SATISFACTION_DRILL_PATH,
} from '@/pages/drill/performanceConstants'

import {
  buildSharedQtyCenterOption,
  buildSharedReportLinesOption,
  SHARED_DUR_MAX,
} from './performanceOrgChartOptions'
import {
  SHARED_DUR_CENTER,
  SHARED_DUR_TEAM,
  SHARED_QTY_CENTER,
  SHARED_QTY_TEAM,
  SHARED_QUAL_CENTER,
  SHARED_QUAL_REPORT_LEGEND,
  SHARED_QUAL_TEAM,
  SHARED_SATISFACTION,
  SHARED_SERVICE,
  PERF_CENTER_TONES,
} from './performanceOrgData'
import {
  OrgChart,
  OrgCountCard,
  OrgDropdown,
  OrgLegendRow,
  OrgPedestal,
  OrgProgressRow,
  OrgRing,
  OrgTable,
} from './performanceOrgWidgets'

/**
 * 绩效管理平台 ▸ 组织 = 共享公司 的中间业务区。
 *
 * 版面对齐用户给的目标稿：效率管理情况（左，最宽）+ 质量管理情况（中）
 * + 服务企业情况 / 服务满意度情况（右，上下各一块）。
 * 宽度按稿面比例换算：业务区 1592 = 2360 − 右栏 756 − gap 12。
 */
export function SharedCompanyView() {
  return (
    <div className="flex min-h-0 min-w-0 flex-1 gap-3">
      <EfficiencyPanel className="w-[716px] shrink-0" />
      <QualityPanel className="w-[432px] shrink-0" />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-3">
        <ServiceEnterprisePanel className="min-h-0 flex-[1.42]" />
        <SatisfactionPanel className="min-h-0 flex-1" />
      </div>
    </div>
  )
}

/* ───────────── 效率管理情况（左栏） ───────────── */

/**
 * 稿面是 2×2：上排「数量情况-中心 / 时长情况-中心」，下排「数量情况-驻企团队 / 时长情况-驻企团队」。
 * 左右两半用一条竖分隔线隔开，上下两半各自成段。
 */
function EfficiencyPanel({ className = '' }: { className?: string }) {
  return (
    <PanelBox
      title={<DrillTitleLink title="效率管理情况" to={PERFORMANCE_EFFICIENCY_DRILL_PATH} />}
      className={`flex flex-col ${className}`}
    >
      <div className="flex h-full min-h-0 gap-3 px-3.5 pt-2.5 pb-3">
        <div className="flex min-h-0 w-[338px] shrink-0 flex-col gap-3">
          <QtyCenterSection className="min-h-0 flex-[1.34]" />
          <QtyTeamSection className="min-h-0 flex-1" />
        </div>

        <span className="w-px shrink-0 self-stretch bg-(--ck-panel-inner-border)" />

        <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-3">
          <DurCenterSection className="min-h-0 flex-[1.34]" />
          <DurTeamSection className="min-h-0 flex-1" />
        </div>
      </div>
    </PanelBox>
  )
}

/** 数量情况-中心：三指标 + 柱折混合图 + 下拉 + 平均单据产能底座与四中心图例 */
function QtyCenterSection({ className = '' }: { className?: string }) {
  const c = useChartColors()
  const option = useMemo(() => buildSharedQtyCenterOption(c), [c])

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <SectionTitle>数量情况-中心</SectionTitle>

      <div className="flex h-[46px] shrink-0">
        {SHARED_QTY_CENTER.cards.map((card) => (
          <OrgCountCard key={card.label} label={card.label} value={card.value} unit={card.unit} />
        ))}
      </div>

      <div className="min-h-0 flex-1">
        <OrgChart option={option} />
      </div>

      <OrgDropdown label={SHARED_QTY_CENTER.dropdown} />

      <div className="flex h-[76px] shrink-0 items-center gap-3">
        <OrgPedestal
          value={SHARED_QTY_CENTER.pedestal.value}
          label={SHARED_QTY_CENTER.pedestal.label}
          width={92}
        />
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5">
          {SHARED_QTY_CENTER.legend.map((row, i) => (
            <OrgLegendRow
              key={row.name}
              name={row.name}
              valueText={row.valueText}
              tone={PERF_CENTER_TONES[i]}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

/** 数量情况-驻企团队：两指标 + 三列明细表 */
function QtyTeamSection({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <SectionTitle>数量情况-驻企团队</SectionTitle>

      <div className="flex h-[46px] shrink-0">
        {SHARED_QTY_TEAM.cards.map((card) => (
          <OrgCountCard key={card.label} label={card.label} value={card.value} unit={card.unit} />
        ))}
      </div>

      <OrgTable head={SHARED_QTY_TEAM.head} rows={SHARED_QTY_TEAM.rows} firstColWidth={128} />
    </div>
  )
}

/** 时长情况-中心：底座 + 四中心图例 / 七项费用条 / 下拉 + 月度结账及时率环 */
function DurCenterSection({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <SectionTitle>时长情况-中心</SectionTitle>

      <div className="flex h-[78px] shrink-0 items-center gap-3">
        <OrgPedestal
          value={SHARED_DUR_CENTER.pedestal.value}
          unit={SHARED_DUR_CENTER.pedestal.unit}
          label={SHARED_DUR_CENTER.pedestal.label}
          width={92}
        />
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5">
          {SHARED_DUR_CENTER.legend.map((row, i) => (
            <OrgLegendRow
              key={row.name}
              name={row.name}
              valueText={row.valueText}
              tone={PERF_CENTER_TONES[i]}
            />
          ))}
        </div>
      </div>

      {/* 七项费用的处理时长条：标签 + 数值 + 进度条，占满剩余高度 */}
      <div className="flex min-h-0 flex-1 flex-col justify-between">
        {SHARED_DUR_CENTER.bars.map((bar) => (
          <OrgProgressRow
            key={bar.label}
            label={bar.label}
            valueText={`${bar.hours.toFixed(1)}小时`}
            percent={Math.round((bar.hours / SHARED_DUR_MAX) * 100)}
          />
        ))}
      </div>

      <OrgDropdown label={SHARED_DUR_CENTER.dropdown} />

      <div className="flex h-[112px] shrink-0 items-center gap-3">
        <OrgRing
          value={SHARED_DUR_CENTER.ring.value}
          label={SHARED_DUR_CENTER.ring.label}
          size={94}
          thickness={9}
          decimals={1}
        />
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5">
          {SHARED_DUR_CENTER.ringLegend.map((row, i) => (
            <OrgLegendRow
              key={row.name}
              name={row.name}
              valueText={row.valueText}
              tone={PERF_CENTER_TONES[i]}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

/** 时长情况-驻企团队：两指标 + 三列明细表 */
function DurTeamSection({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <SectionTitle>时长情况-驻企团队</SectionTitle>

      <div className="flex h-[46px] shrink-0">
        {SHARED_DUR_TEAM.cards.map((card) => (
          <OrgCountCard key={card.label} label={card.label} value={card.value} unit={card.unit} />
        ))}
      </div>

      <OrgTable head={SHARED_DUR_TEAM.head} rows={SHARED_DUR_TEAM.rows} firstColWidth={128} />
    </div>
  )
}

/* ───────────── 质量管理情况（中栏） ───────────── */

/** 稿面自上而下：中心（底座+图例）/ 报表编制准确率（四线图）/ 驻企团队（三环+四列表） */
function QualityPanel({ className = '' }: { className?: string }) {
  const c = useChartColors()
  const option = useMemo(() => buildSharedReportLinesOption(c), [c])

  return (
    <PanelBox
      title={<DrillTitleLink title="质量管理情况" to={PERFORMANCE_QUALITY_DRILL_PATH} />}
      className={`flex flex-col ${className}`}
    >
      <div className="flex h-full min-h-0 flex-col gap-2.5 px-3.5 pt-2.5 pb-3">
        <SectionTitle>中心</SectionTitle>

        <div className="flex h-[92px] shrink-0 items-center gap-3">
          <OrgPedestal
            value={SHARED_QUAL_CENTER.pedestal.value}
            label={SHARED_QUAL_CENTER.pedestal.label}
            width={104}
          />
          <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
            {SHARED_QUAL_CENTER.legend.map((row, i) => (
              <OrgLegendRow
                key={row.name}
                name={row.name}
                valueText={row.valueText}
                tone={PERF_CENTER_TONES[i]}
                percent={row.percent}
              />
            ))}
          </div>
        </div>

        <SectionTitle>报表编制准确率</SectionTitle>

        <div className="min-h-0 flex-[1.1]">
          <OrgChart option={option} />
        </div>

        <SectionTitle>驻企团队</SectionTitle>

        <div className="flex h-[108px] shrink-0 items-start justify-between gap-2">
          {SHARED_QUAL_TEAM.rings.map((ring) => (
            <OrgRing
              key={ring.label}
              value={ring.value}
              label={ring.label}
              size={74}
              thickness={7}
              decimals={1}
            />
          ))}
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          <OrgTable head={SHARED_QUAL_TEAM.head} rows={SHARED_QUAL_TEAM.rows} firstColWidth={104} />
        </div>
      </div>
    </PanelBox>
  )
}

/* ───────────── 服务企业情况 / 服务满意度情况（右栏） ───────────── */

/** 成本费用总额底座 + 四中心图例 / 企业明细表 / 预算执行准确率环 + 四中心图例 */
function ServiceEnterprisePanel({ className = '' }: { className?: string }) {
  return (
    <PanelBox
      title={<DrillTitleLink title="服务企业情况" to={PERFORMANCE_SERVICE_DRILL_PATH} />}
      className={`flex flex-col ${className}`}
    >
      <div className="flex h-full min-h-0 flex-col gap-2.5 px-3.5 pt-2.5 pb-3">
        <div className="flex h-[96px] shrink-0 items-center gap-3">
          <OrgPedestal
            value={SHARED_SERVICE.pedestal.value}
            unit={SHARED_SERVICE.pedestal.unit}
            label={SHARED_SERVICE.pedestal.label}
            width={104}
          />
          <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
            {SHARED_SERVICE.legend.map((row, i) => (
              <OrgLegendRow
                key={row.name}
                name={row.name}
                valueText={row.valueText}
                tone={PERF_CENTER_TONES[i]}
              />
            ))}
          </div>
        </div>

        {/* 企业明细表：稿面只有企业名 + 万元列 + 一个小方块占位 */}
        <div className="ck-scroll flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto pr-1">
          {SHARED_SERVICE.rows.map((name, i) => (
            <div
              key={name}
              className="flex shrink-0 items-center gap-2 rounded-[4px] px-2.5 py-2"
              style={{
                background: i % 2 === 0 ? 'var(--ck-panel-inner)' : 'transparent',
                border: '1px solid var(--ck-panel-inner-border)',
              }}
            >
              <span className="min-w-0 flex-1 truncate text-[12px] leading-none text-(--foreground)">
                {name}
              </span>
              <span className="shrink-0 text-[12px] leading-none text-(--ck-title-sub)">万元</span>
              <i
                className="h-[9px] w-[9px] shrink-0 rounded-[2px]"
                style={{ background: 'var(--ck-title-sub)', opacity: 0.55 }}
                aria-hidden
              />
            </div>
          ))}
        </div>

        <div className="flex h-[122px] shrink-0 items-center gap-3">
          <OrgRing
            value={SHARED_SERVICE.ring.value}
            label={SHARED_SERVICE.ring.label}
            size={100}
            thickness={10}
            decimals={1}
          />
          <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
            {SHARED_SERVICE.ringLegend.map((row, i) => (
              <OrgLegendRow
                key={row.name}
                name={row.name}
                valueText={row.valueText}
                tone={PERF_CENTER_TONES[i]}
              />
            ))}
          </div>
        </div>
      </div>
    </PanelBox>
  )
}

/** 服务满意度情况：问卷评分 / 投诉总量两段，各自底座 + 四中心带条图例 */
function SatisfactionPanel({ className = '' }: { className?: string }) {
  const { score, scoreLegend, complaint, complaintLegend } = SHARED_SATISFACTION

  return (
    <PanelBox
      title={<DrillTitleLink title="服务满意度情况" to={PERFORMANCE_SATISFACTION_DRILL_PATH} />}
      className={`flex flex-col ${className}`}
    >
      <div className="flex h-full min-h-0 flex-col justify-between gap-4 px-3.5 pt-3 pb-3.5">
        <div className="flex min-h-0 flex-1 items-center gap-3">
          <OrgPedestal value={score.value} label={score.label} width={104} />
          <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
            {scoreLegend.map((row, i) => (
              <OrgLegendRow
                key={row.name}
                name={row.name}
                valueText={row.valueText}
                tone={PERF_CENTER_TONES[i]}
                percent={row.percent}
              />
            ))}
          </div>
        </div>

        <div className="flex min-h-0 flex-1 items-center gap-3">
          <OrgPedestal value={complaint.value} label={complaint.label} tone="red" width={104} />
          <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
            {complaintLegend.map((row, i) => (
              <OrgLegendRow
                key={row.name}
                name={row.name}
                valueText={row.valueText}
                tone={PERF_CENTER_TONES[i]}
                percent={row.percent}
              />
            ))}
          </div>
        </div>
      </div>
    </PanelBox>
  )
}
