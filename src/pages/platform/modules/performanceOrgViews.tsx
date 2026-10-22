import { useMemo } from 'react'
import ReactECharts from 'echarts-for-react'

import { PanelBox, SectionTitle, useChartColors } from '@/components/cockpit-ui'

import {
  buildSharedDocTrendOption,
  buildSharedResidentBarOption,
  buildShandongCostBarOption,
  buildShandongDebtBarOption,
  buildShandongMultiLineOption,
  buildShandongQualityTrendOption,
} from './performanceOrgChartOptions'
import {
  SHANDONG_BANK_CUSTOMER,
  SHANDONG_COST_RESPONSE,
  SHANDONG_DEBT_CLEARANCE,
  SHANDONG_FOUR_RINGS,
  SHANDONG_THREE_RINGS,
  SHANDONG_VAT_REALIZATION,
  SHARED_DURATION_BLOCKS,
  SHARED_DURATION_ITEMS,
  SHARED_MONTH_SUMMARY,
  SHARED_QUALITY_PASS_RATE,
  SHARED_RESIDENT_GRID,
} from './performanceOrgData'
import {
  OrgBigNumber,
  OrgCenterRow,
  OrgGauge,
  OrgGridTable,
  OrgPedestal,
  OrgProgressRow,
  OrgRing,
  OrgStatCard,
} from './performanceOrgWidgets'
import { ServiceEnterprisePanel } from './PerformanceBottomPanels'

/** ECharts 容器 */
function OrgChart({ option }: { option: object }) {
  return (
    <ReactECharts
      option={option}
      style={{ height: '100%', width: '100%' }}
      opts={{ renderer: 'canvas' }}
      notMerge
    />
  )
}

/* ───────────── 共享公司视图（深色主题） ───────────── */

export function SharedCompanyView() {
  return (
    <div className="flex min-h-0 flex-1 gap-3.5">
      <div className="flex min-h-0 w-[1160px] shrink-0 flex-col gap-3">
        <SharedWorkPanel className="min-h-0 flex-1" />
        <SharedQualityPanel className="min-h-0 flex-1" />
      </div>
      <ServiceEnterprisePanel className="min-w-0 flex-1" />
    </div>
  )
}

/** 作业情况：数量情况（双柱+折线） + 平均天数（六行进度） */
function SharedWorkPanel({ className = '' }: { className?: string }) {
  const c = useChartColors()
  const trendOption = useMemo(() => buildSharedDocTrendOption(c), [c])

  return (
    <PanelBox title="作业情况" className={`flex flex-col ${className}`}>
      <div className="flex h-full gap-2 px-4 pt-2 pb-2">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <SectionTitle>数量情况</SectionTitle>
          <div className="min-h-0 flex-1">
            <OrgChart option={trendOption} />
          </div>
        </div>

        <span className="w-px shrink-0 self-stretch bg-(--ck-panel-inner-border)" />

        <div className="flex w-[286px] shrink-0 flex-col gap-1">
          <SectionTitle>平均天数</SectionTitle>
          <div className="flex min-h-0 flex-1 flex-col justify-around px-2">
            {SHARED_DURATION_ITEMS.map((item) => (
              <OrgProgressRow
                key={item.label}
                label={item.label}
                valueText={`${item.value.toFixed(1)}小时`}
                percent={(item.value / 2.5) * 100}
              />
            ))}
          </div>
        </div>
      </div>
    </PanelBox>
  )
}

/** 作业质量情况：驻企财务 + 时长情况 + 驻企情况 */
function SharedQualityPanel({ className = '' }: { className?: string }) {
  const c = useChartColors()
  const reportOpt = useMemo(() => buildSharedResidentBarOption(c, 'report'), [c])
  const mentionOpt = useMemo(() => buildSharedResidentBarOption(c, 'mention'), [c])

  return (
    <PanelBox title="作业质量情况" className={`flex flex-col ${className}`}>
      <div className="flex h-full gap-3 px-3 pt-2 pb-2">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <SectionTitle>驻企财务 · 驻企团队</SectionTitle>
          <div className="flex min-h-0 flex-1 flex-col gap-2">
            <div className="min-h-0 flex-1">
              <OrgChart option={reportOpt} />
            </div>
            <div className="min-h-0 flex-1">
              <OrgChart option={mentionOpt} />
            </div>
          </div>
          <div className="flex h-[62px] shrink-0 gap-2">
            {SHARED_MONTH_SUMMARY.map((item) => (
              <OrgStatCard
                key={item.label}
                label={item.label}
                value={item.value}
                unit={item.unit}
              />
            ))}
          </div>
        </div>

        <span className="w-px shrink-0 self-stretch bg-(--ck-panel-inner-border)" />

        <div className="flex w-[220px] shrink-0 flex-col gap-1">
          <SectionTitle>时长情况 · 驻企团队</SectionTitle>
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-2 px-2">
            <OrgRing
              value={SHARED_QUALITY_PASS_RATE}
              label="月度通过达标率"
              size={96}
              tone="green"
            />
            <div className="flex w-full shrink-0 flex-wrap gap-1.5">
              {SHARED_DURATION_BLOCKS.map((blk, i) => (
                <div
                  key={i}
                  className="flex min-w-0 basis-[calc(50%-4px)] flex-col items-center gap-0.5 rounded-[2px] px-2 py-1.5"
                  style={{
                    background: 'color-mix(in srgb, var(--ck-blue) 18%, transparent)',
                    border: '1px solid var(--ck-panel-inner-border)',
                  }}
                >
                  <span className="text-[11px] leading-none text-(--ck-title-sub)">
                    {blk.label}
                  </span>
                  <span className="text-[16px] leading-none font-bold text-(--ck-cyan) tabular-nums">
                    {blk.value} 小时
                  </span>
                  <span className="text-[11px] leading-none text-(--ck-cyan)">{blk.percent}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <span className="w-px shrink-0 self-stretch bg-(--ck-panel-inner-border)" />

        <div className="flex w-[260px] shrink-0 flex-col gap-1 px-2">
          <SectionTitle>驻企情况 · 驻全团队</SectionTitle>
          <OrgGridTable
            rows={SHARED_RESIDENT_GRID}
            columns={['标准A', '标准B', '标准C'] as const}
          />
        </div>
      </div>
    </PanelBox>
  )
}

/* ───────────── 山东公司派驻组视图（浅色主题） ───────────── */

export function ShandongGroupView() {
  return (
    <div className="flex min-h-0 flex-1 gap-3.5">
      <div className="flex min-h-0 w-[1360px] shrink-0 flex-col gap-3">
        <ShandongQualityTopPanel className="min-h-0 flex-1" />
        <ShandongQualityBottomPanel className="min-h-0 flex-1" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <ShandongReportTaxPanel className="min-h-0 flex-[1.4]" />
        <ShandongDebtPanel className="min-h-0 flex-1" />
      </div>
    </div>
  )
}

/** 作业质量管理情况（上）：双柱+折线 + 三环 */
function ShandongQualityTopPanel({ className = '' }: { className?: string }) {
  const c = useChartColors()
  const trendOpt = useMemo(() => buildShandongQualityTrendOption(c), [c])

  return (
    <PanelBox title="作业质量管理情况" className={`flex flex-col ${className}`}>
      <div className="flex h-full gap-2 px-4 pt-2 pb-2">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <SectionTitle>社金财务服务单位管理处理流程达成统计</SectionTitle>
          <div className="min-h-0 flex-1">
            <OrgChart option={trendOpt} />
          </div>
        </div>

        <span className="w-px shrink-0 self-stretch bg-(--ck-panel-inner-border)" />

        <div className="flex w-[340px] shrink-0 flex-col gap-1">
          <SectionTitle>社金财务服务单位标准处理通知率</SectionTitle>
          <div className="flex min-h-0 flex-1 items-center justify-around gap-1 px-2">
            {SHANDONG_THREE_RINGS.map((ring) => (
              <OrgRing key={ring.label} value={ring.value} label={ring.label} size={88} />
            ))}
          </div>
        </div>
      </div>
    </PanelBox>
  )
}

/** 作业质量管理情况（续）：两个多线图 + 四环 */
function ShandongQualityBottomPanel({ className = '' }: { className?: string }) {
  const c = useChartColors()
  const qualityOpt = useMemo(() => buildShandongMultiLineOption(c, 'quality'), [c])
  const satisfactionOpt = useMemo(() => buildShandongMultiLineOption(c, 'satisfaction'), [c])

  return (
    <PanelBox title="作业质量管理情况（续）" className={`flex flex-col ${className}`}>
      <div className="flex h-full gap-2 px-4 pt-2 pb-2">
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex min-h-0 flex-1 flex-col gap-0.5">
            <SectionTitle>服务企业处理年检情况</SectionTitle>
            <div className="flex min-h-0 flex-1 gap-2">
              <div className="min-h-0 min-w-0 flex-1">
                <OrgChart option={qualityOpt} />
              </div>
              <div className="min-h-0 min-w-0 flex-1">
                <OrgChart option={satisfactionOpt} />
              </div>
            </div>
          </div>
        </div>

        <span className="w-px shrink-0 self-stretch bg-(--ck-panel-inner-border)" />

        <div className="flex w-[200px] shrink-0 flex-col gap-1">
          <SectionTitle>服务企业影响年指标情况</SectionTitle>
          <div className="flex min-h-0 flex-1 flex-wrap content-around gap-2 px-1">
            {SHANDONG_FOUR_RINGS.map((ring) => (
              <OrgRing
                key={ring.label}
                value={ring.value}
                label={ring.label}
                size={76}
                tone="cyan"
              />
            ))}
          </div>
        </div>
      </div>
    </PanelBox>
  )
}

/** 报表税收兑现情况：成本费用应答 + 信值税成兑现 + 银行客户 */
function ShandongReportTaxPanel({ className = '' }: { className?: string }) {
  const c = useChartColors()
  const costOpt = useMemo(() => buildShandongCostBarOption(c), [c])

  return (
    <PanelBox title="报表税收兑现情况" className={`flex flex-col ${className}`}>
      <div className="flex h-full flex-col gap-2 px-4 pt-2 pb-2">
        <div className="flex min-h-0 flex-1 gap-2">
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <SectionTitle>成本费用应答情况</SectionTitle>
            <div className="flex min-h-0 flex-1 gap-2">
              <div className="min-h-0 w-[220px] shrink-0">
                <OrgChart option={costOpt} />
              </div>
              <div className="flex min-h-0 min-w-0 flex-1 flex-col items-center justify-center gap-1.5">
                <div
                  className="flex w-full flex-1 flex-col items-center justify-center gap-1 rounded-[3px] px-2"
                  style={{
                    background:
                      'linear-gradient(180deg, color-mix(in srgb, var(--ck-green) 14%, transparent), transparent)',
                    border: '1px solid var(--ck-panel-inner-border)',
                  }}
                >
                  <span className="text-[11px] leading-none text-(--ck-title-sub)">
                    成本费用金额
                  </span>
                  <span className="flex items-baseline gap-0.5">
                    <span className="text-[22px] leading-none font-bold text-(--ck-green) tabular-nums">
                      {SHANDONG_COST_RESPONSE.amount}
                    </span>
                    <span className="text-[11px] leading-none text-(--ck-title-sub)">万元</span>
                  </span>
                  <span className="text-[16px] leading-none font-bold text-(--ck-green) tabular-nums">
                    {SHANDONG_COST_RESPONSE.percent.toFixed(1)}%
                  </span>
                </div>

                {SHANDONG_COST_RESPONSE.progressBars.map((pb) => (
                  <div
                    key={pb.label}
                    className="flex w-full shrink-0 flex-col gap-1 rounded-[2px] px-2 py-1.5"
                    style={{
                      background: 'color-mix(in srgb, var(--ck-green) 12%, transparent)',
                      border: '1px solid var(--ck-panel-inner-border)',
                    }}
                  >
                    <div className="flex items-baseline justify-between gap-1">
                      <span className="truncate text-[11px] leading-none text-(--foreground)">
                        {pb.label}
                      </span>
                      <span className="text-[13px] leading-none font-semibold text-(--ck-green) tabular-nums">
                        {pb.value.toFixed(1)}%
                      </span>
                    </div>
                    <div className="relative h-[5px] w-full rounded-full bg-(--ck-track)">
                      <div
                        className="absolute top-0 left-0 h-full rounded-full bg-(--ck-green)"
                        style={{ width: `${pb.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <span className="w-px shrink-0 self-stretch bg-(--ck-panel-inner-border)" />

          <div className="flex w-[340px] shrink-0 flex-col gap-1">
            <SectionTitle>信值税成兑现情况</SectionTitle>
            <div className="flex min-h-0 flex-1 items-center justify-around gap-2 px-2">
              <OrgRing
                value={SHANDONG_VAT_REALIZATION.ringValue}
                label="消费税成兑现"
                size={92}
                tone="purple"
              />
              <div className="flex min-h-0 min-w-0 flex-1 flex-col justify-center gap-1.5">
                {SHANDONG_VAT_REALIZATION.cards.map((card) => (
                  <OrgStatCard
                    key={card.label}
                    label={card.label}
                    value={card.value}
                    unit={card.unit}
                    tone="cyan"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <span className="h-px w-full shrink-0 bg-(--ck-panel-inner-border)" />

        <div className="flex h-[80px] shrink-0 items-center justify-center gap-4 px-2">
          <SectionTitle>银行客户情况</SectionTitle>
          <div className="flex items-center gap-4">
            {SHANDONG_BANK_CUSTOMER.pedestals.map((ped) => (
              <OrgPedestal key={ped.label} label={ped.label} value={ped.value} unit={ped.unit} />
            ))}
            <span className="mx-2 h-[52px] w-px shrink-0 bg-(--ck-panel-inner-border)" />
            <OrgGauge
              value={SHANDONG_BANK_CUSTOMER.gauge.value}
              label={SHANDONG_BANK_CUSTOMER.gauge.label}
            />
          </div>
        </div>
      </div>
    </PanelBox>
  )
}

/** 清欠情况：本企费用总金额 + 六行中心卡片 + 四列柱状图 */
function ShandongDebtPanel({ className = '' }: { className?: string }) {
  const c = useChartColors()
  const barOpt = useMemo(() => buildShandongDebtBarOption(c), [c])

  return (
    <PanelBox title="清欠情况" className={`flex flex-col ${className}`}>
      <div className="flex h-full gap-2 px-4 pt-2 pb-2">
        <div className="flex w-[440px] shrink-0 flex-col gap-1.5 px-2">
          <div className="flex shrink-0 items-center justify-between gap-2">
            <span className="text-[12px] leading-none text-(--ck-title-sub)">单位：千</span>
          </div>
          <OrgBigNumber
            label="本企费用总金额"
            value={SHANDONG_DEBT_CLEARANCE.totalAmount}
            unit="万元"
          />
          <div className="flex min-h-0 flex-1 flex-col justify-around gap-0.5">
            {SHANDONG_DEBT_CLEARANCE.centers.map((ctr, i) => (
              <OrgCenterRow
                key={ctr.name}
                name={ctr.name}
                amount={ctr.amount}
                striped={i % 2 === 0}
              />
            ))}
          </div>
        </div>

        <span className="w-px shrink-0 self-stretch bg-(--ck-panel-inner-border)" />

        <div className="min-h-0 min-w-0 flex-1">
          <OrgChart option={barOpt} />
        </div>
      </div>
    </PanelBox>
  )
}
