import { useMemo } from 'react'

import { PanelBox, SectionTitle, useChartColors } from '@/components/cockpit-ui'

import {
  buildShandongApprovalOption,
  buildShandongCostBarOption,
  buildShandongFundLineOption,
  buildShandongLateFeeOption,
  buildShandongReconcileLineOption,
  buildShandongSubitemLineOption,
} from './performanceOrgChartOptions'
import {
  SHANDONG_BANK,
  SHANDONG_COST_BUDGET,
  SHANDONG_EFF_TEAM,
  SHANDONG_FUND_BUDGET,
  SHANDONG_LATE_FEE,
  SHANDONG_QUAL_CROSS_YEAR,
  SHANDONG_QUAL_RECONCILE,
  SHANDONG_QUAL_RETURN,
  SHANDONG_QUAL_SUBITEM,
  SHANDONG_VAT,
} from './performanceOrgData'
import {
  OrgBanner,
  OrgChart,
  OrgCountCard,
  OrgDotCard,
  OrgDotRow,
  OrgGauge,
  OrgIconStat,
  OrgRing,
} from './performanceOrgWidgets'

/* ═══════════════ 山东公司派驻组 ═══════════════ */

/**
 * 组织 = 山东公司派驻组 的中间业务区。
 *
 * 版面对齐目标稿：左栏上下两块（作业效率管理情况 / 作业质量管理情况，
 * 后者更高），右栏一整块服务企业情况（内部再分左右两列）。
 */
export function ShandongGroupView() {
  return (
    <div className="flex min-h-0 min-w-0 flex-1 gap-3">
      <div className="flex min-h-0 w-[628px] shrink-0 flex-col gap-3">
        <SdEfficiencyPanel className="min-h-0 flex-1" />
        <SdQualityPanel className="min-h-0 flex-[1.52]" />
      </div>

      <SdServicePanel className="min-h-0 min-w-0 flex-1" />
    </div>
  )
}

/** 作业效率管理情况：左「驻企财务审批单据情况统计」柱折图 / 右「结账处理时长」横幅 + 三环 */
function SdEfficiencyPanel({ className = '' }: { className?: string }) {
  const c = useChartColors()
  const option = useMemo(() => buildShandongApprovalOption(c), [c])
  const { banner, rings } = SHANDONG_EFF_TEAM

  return (
    <PanelBox title="作业效率管理情况" className={`flex flex-col ${className}`}>
      <div className="flex h-full min-h-0 gap-3 px-3.5 pt-2.5 pb-3">
        <div className="flex min-h-0 w-[300px] shrink-0 flex-col gap-2">
          <SectionTitle>驻企财务审批单据情况统计</SectionTitle>
          <div className="min-h-0 flex-1">
            <OrgChart option={option} />
          </div>
        </div>

        <span className="w-px shrink-0 self-stretch bg-(--ck-panel-inner-border)" />

        <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-3">
          <SectionTitle>驻企财务管理团队结账处理时长</SectionTitle>

          <OrgBanner
            icon="ri-file-list-3-line"
            label={banner.label}
            value={banner.value}
            unit={banner.unit}
          />

          <div className="flex min-h-0 flex-1 items-center justify-between gap-2">
            {rings.map((ring) => (
              <OrgRing key={ring.label} value={ring.value} label={ring.label} size={80} thickness={8} />
            ))}
          </div>
        </div>
      </div>
    </PanelBox>
  )
}

/** 作业质量管理情况：2×2 四段（业务处理质量 / 协同退单 / 跨年制单 / 内部交易对账） */
function SdQualityPanel({ className = '' }: { className?: string }) {
  const c = useChartColors()
  const subitemOption = useMemo(() => buildShandongSubitemLineOption(c), [c])
  const reconcileOption = useMemo(() => buildShandongReconcileLineOption(c), [c])

  return (
    <PanelBox title="作业质量管理情况" className={`flex flex-col ${className}`}>
      <div className="flex h-full min-h-0 gap-3 px-3.5 pt-2.5 pb-3">
        <div className="flex min-h-0 w-[300px] shrink-0 flex-col gap-3">
          <div className="flex min-h-0 flex-1 flex-col gap-2">
            <SectionTitle>服务企业业务处理质量</SectionTitle>
            <span className="shrink-0 text-[12px] leading-none text-(--ck-title-sub)">
              {SHANDONG_QUAL_SUBITEM.title}
            </span>
            <div className="min-h-0 flex-1">
              <OrgChart option={subitemOption} />
            </div>
          </div>

          {/*
            跨年制单：左环 + 右侧五项费用占比。
            五行用单行版 `OrgDotRow`（两行版的 `OrgDotCard` 在这个半栏高度里塞不下
            五行，会压到上方图表并溢出面板底边）。
          */}
          <div className="flex min-h-0 flex-1 flex-col gap-2">
            <SectionTitle>服务企业跨年制单情况</SectionTitle>
            <div className="flex min-h-0 flex-1 items-center gap-2.5">
              <OrgRing
                value={SHANDONG_QUAL_CROSS_YEAR.ring.value}
                label={SHANDONG_QUAL_CROSS_YEAR.ring.label}
                size={86}
                thickness={9}
                tone="purple"
                suffix="%"
                decimals={2}
              />
              <div className="ck-scroll flex min-h-0 min-w-0 flex-1 flex-col gap-1.5 overflow-y-auto pr-0.5">
                {SHANDONG_QUAL_CROSS_YEAR.rows.map((row) => (
                  <OrgDotRow key={row.label} label={row.label} value={row.valueText} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <span className="w-px shrink-0 self-stretch bg-(--ck-panel-inner-border)" />

        <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-3">
          {/* 协同退单：左环 + 右两张小卡 */}
          <div className="flex min-h-0 flex-1 flex-col gap-2">
            <SectionTitle>服务企业协同退单情况</SectionTitle>
            <div className="flex min-h-0 flex-1 items-center gap-3">
              <OrgRing
                value={SHANDONG_QUAL_RETURN.ring.value}
                label={SHANDONG_QUAL_RETURN.ring.label}
                size={96}
                thickness={10}
                tone="cyan"
                suffix="%"
                decimals={2}
              />
              <div className="flex min-w-0 flex-1 flex-col gap-2.5">
                {SHANDONG_QUAL_RETURN.cards.map((card) => (
                  <OrgDotCard
                    key={card.label}
                    label={card.label}
                    value={card.value}
                    unit={card.unit}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col gap-2">
            <SectionTitle>服务企业内部交易对账情况</SectionTitle>
            <span className="shrink-0 text-[12px] leading-none text-(--ck-title-sub)">
              {SHANDONG_QUAL_RECONCILE.title}
            </span>
            <div className="min-h-0 flex-1">
              <OrgChart option={reconcileOption} />
            </div>
          </div>
        </div>
      </div>
    </PanelBox>
  )
}

/**
 * 服务企业情况：稿面内部按三行排。
 *
 * 第一行：公司成本预算执行情况 ｜ 公司资金预算执行情况
 * 第二行：增值税退税完成情况   ｜ 滞纳金情况（左右两块顶部对齐）
 * 第三行：银行账户管控情况（横跨整栏，不再缩在增值税下方）
 */
function SdServicePanel({ className = '' }: { className?: string }) {
  return (
    <PanelBox title="服务企业情况" className={`flex flex-col ${className}`}>
      <div className="flex h-full min-h-0 flex-col gap-3 px-3.5 pt-2.5 pb-3">
        <div className="flex min-h-0 flex-[1.12] gap-3.5">
          <CostBudgetSection className="min-h-0 min-w-0 flex-1" />
          <span className="w-px shrink-0 self-stretch bg-(--ck-panel-inner-border)" />
          <FundBudgetSection className="min-h-0 min-w-0 flex-1" />
        </div>

        <span className="h-px w-full shrink-0 bg-(--ck-panel-inner-border)" />

        <div className="flex min-h-0 flex-1 gap-3.5">
          <VatSection className="min-h-0 min-w-0 flex-1" />
          <span className="w-px shrink-0 self-stretch bg-(--ck-panel-inner-border)" />
          <LateFeeSection className="min-h-0 min-w-0 flex-1" />
        </div>

        <span className="h-px w-full shrink-0 bg-(--ck-panel-inner-border)" />

        <BankSection className="min-h-0 flex-[0.72]" />
      </div>
    </PanelBox>
  )
}

/** 公司成本预算执行情况：两指标 + 预算执行准确率柱图 */
function CostBudgetSection({ className = '' }: { className?: string }) {
  const c = useChartColors()
  const option = useMemo(() => buildShandongCostBarOption(c), [c])

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <SectionTitle>公司成本预算执行情况</SectionTitle>

      <div className="flex h-[52px] shrink-0">
        {SHANDONG_COST_BUDGET.cards.map((card) => (
          <OrgCountCard key={card.label} label={card.label} value={card.value} unit={card.unit} />
        ))}
      </div>

      <span className="shrink-0 text-[12px] leading-none text-(--ck-title-sub)">
        {SHANDONG_COST_BUDGET.chartTitle}
      </span>

      <div className="min-h-0 flex-1">
        <OrgChart option={option} />
      </div>
    </div>
  )
}

/** 增值税退税完成情况：左环 + 右两张小卡 */
function VatSection({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <SectionTitle>增值税退税完成情况</SectionTitle>

      <div className="flex min-h-0 flex-1 items-center gap-3">
        <OrgRing
          value={SHANDONG_VAT.ring.value}
          label={SHANDONG_VAT.ring.label}
          size={104}
          thickness={11}
          suffix="%"
          decimals={2}
        />
        <div className="flex min-w-0 flex-1 flex-col gap-2.5">
          {SHANDONG_VAT.cards.map((card) => (
            <OrgDotCard key={card.label} label={card.label} value={card.value} />
          ))}
        </div>
      </div>
    </div>
  )
}

/** 银行账户管控情况：横跨整栏 —— 四张图标卡一行排开 + 右侧银企直联率仪表 */
function BankSection({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <SectionTitle>银行账户管控情况</SectionTitle>

      {/*
        四张账户数按 2×2 排，不并成一横排：
        「180天以上无动态银行账户数量」在四分之一栏宽下会被截断成「180天以上无动态银…」。
      */}
      <div className="flex min-h-0 flex-1 items-center gap-4">
        <div className="grid min-h-0 min-w-0 flex-1 grid-cols-2 gap-x-4 gap-y-3">
          {SHANDONG_BANK.stats.map((stat) => (
            <OrgIconStat
              key={stat.label}
              icon={stat.icon}
              label={stat.label}
              value={stat.value}
              unit={stat.unit}
            />
          ))}
        </div>

        <span className="h-[86px] w-px shrink-0 self-center bg-(--ck-panel-inner-border)" />

        <div className="shrink-0">
          <OrgGauge value={SHANDONG_BANK.gauge.value} label={SHANDONG_BANK.gauge.label} />
        </div>
      </div>
    </div>
  )
}

/** 公司资金预算执行情况：资金预算准确率折线（稿面右上角那组悬浮数值另起一块） */
function FundBudgetSection({ className = '' }: { className?: string }) {
  const c = useChartColors()
  const option = useMemo(() => buildShandongFundLineOption(c), [c])

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <SectionTitle>公司资金预算执行情况</SectionTitle>

      <div className="flex shrink-0 items-start justify-between gap-2">
        <span className="text-[12px] leading-none text-(--ck-title-sub)">
          {SHANDONG_FUND_BUDGET.chartTitle}
        </span>

        {/* 稿面右上角那组三项准确率，这里做成常显小卡（原稿是 tooltip 悬浮态） */}
        <div
          className="flex shrink-0 flex-col gap-1.5 rounded-[6px] px-2.5 py-2"
          style={{
            background: 'var(--ck-panel-inner)',
            border: '1px solid var(--ck-panel-inner-border)',
          }}
        >
          {SHANDONG_FUND_BUDGET.tooltip.map((row) => (
            <div key={row.label} className="flex items-center gap-1.5 whitespace-nowrap">
              <i
                className="h-[5px] w-[5px] shrink-0 rounded-full"
                style={{ background: 'var(--ck-cyan)' }}
                aria-hidden
              />
              <span className="text-[11px] leading-none text-(--ck-title-sub)">{row.label}</span>
              <span className="text-[11px] leading-none font-semibold text-(--foreground)">
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1">
        <OrgChart option={option} />
      </div>
    </div>
  )
}

/** 滞纳金情况：处罚笔数横幅 + 本企业滞纳金一行 + 空状态（保持稿面原样，仅缩小占位） */
function LateFeeSection({ className = '' }: { className?: string }) {
  const c = useChartColors()
  const option = useMemo(() => buildShandongLateFeeOption(c), [c])

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <SectionTitle>滞纳金情况</SectionTitle>

      <OrgBanner
        icon="ri-money-cny-circle-line"
        label={SHANDONG_LATE_FEE.banner.label}
        value={SHANDONG_LATE_FEE.banner.value}
        unit={SHANDONG_LATE_FEE.banner.unit}
      />

      {/* 本企业税收滞纳金（含罚款）：左标题 + 右单位，下面挂逐月柱图 */}
      <div className="flex shrink-0 items-center gap-2">
        <i className="ri-arrow-right-s-line text-[14px] text-(--ck-cyan)" aria-hidden />
        <span className="min-w-0 flex-1 text-[13px] leading-none text-(--foreground)">
          {SHANDONG_LATE_FEE.detail.label}
        </span>
        <span className="shrink-0 text-[12px] leading-none text-(--ck-title-sub)">
          {SHANDONG_LATE_FEE.detail.unit}
        </span>
      </div>

      <div className="min-h-0 flex-1">
        <OrgChart option={option} />
      </div>
    </div>
  )
}
