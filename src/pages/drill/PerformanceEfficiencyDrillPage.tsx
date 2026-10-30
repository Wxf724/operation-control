import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import {
  DrillFilterBar,
  DrillMetricRow,
  DrillPagedTable,
  DrillScreen,
  DrillTabBar,
  DrillTable,
} from './components'
import {
  PERFORMANCE_CARRYOVER_COLUMNS,
  PERFORMANCE_CARRYOVER_METRICS,
  PERFORMANCE_CARRYOVER_ROWS,
  PERFORMANCE_EFFICIENCY_ENTERPRISE_COLUMNS,
  PERFORMANCE_EFFICIENCY_ENTERPRISE_ROWS,
  PERFORMANCE_EFFICIENCY_GROUP_COLUMNS,
  PERFORMANCE_EFFICIENCY_GROUP_ROWS,
  PERFORMANCE_EFFICIENCY_METRICS,
  PERFORMANCE_EFFICIENCY_PERSON_COLUMNS,
  PERFORMANCE_EFFICIENCY_PERSON_ROWS,
  PERFORMANCE_REPORT_COLUMNS,
  PERFORMANCE_REPORT_HEADLINE,
  PERFORMANCE_REPORT_METRICS,
  PERFORMANCE_REPORT_ROWS,
} from './performanceEfficiencyData'
import {
  PERFORMANCE_DOC_DRILL_PATH,
  PERFORMANCE_EFFICIENCY_TABS,
  PERFORMANCE_PERIOD,
} from './performanceConstants'

/** 结转/报表两张表每页 20 条：24 行正好两页，与参考图的「1 /2」一致 */
const PAGE_SIZE = 20

/**
 * 钻取明细页 ·「效率管理情况」（路由 `/drill/performance-efficiency`，对应参考图 1～3）。
 *
 * 三个页签：
 *   业务处理效率：7 张指标卡 + 企业/小组两张并排小表 + 通栏「个人」表
 *   结转业务处理情况：4 张指标卡 + 企业表（24 行、2 页）
 *   报表出具情况：及时率 + 3 列 × 3 行读数 + 企业表（24 行、2 页）
 *
 * 「业务处理效率_企业」表里的任意一行点进「单据明细」页。
 */
export function PerformanceEfficiencyDrillPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [activeTab, setActiveTab] = useState<string>(() => {
    const wanted = searchParams.get('tab')
    return PERFORMANCE_EFFICIENCY_TABS.some((tab) => tab.key === wanted)
      ? (wanted as string)
      : PERFORMANCE_EFFICIENCY_TABS[0].key
  })

  const openDoc = (name: string, source: string) =>
    navigate(
      `${PERFORMANCE_DOC_DRILL_PATH}?from=efficiency&source=${encodeURIComponent(source)}&org=${encodeURIComponent(name)}`
    )

  return (
    <DrillScreen>
      <DrillFilterBar
        title="效率管理情况"
        defaultStart={PERFORMANCE_PERIOD.start}
        defaultEnd={PERFORMANCE_PERIOD.end}
        className="h-[74px]"
      />

      <DrillTabBar
        tabs={PERFORMANCE_EFFICIENCY_TABS}
        active={activeTab}
        onChange={setActiveTab}
        className="h-[62px]"
      />

      {activeTab === 'carryover' ? (
        <CarryoverView />
      ) : activeTab === 'report' ? (
        <ReportView />
      ) : (
        <EfficiencyView onRowClick={openDoc} />
      )}
    </DrillScreen>
  )
}

/* ───────────── 页签一：业务处理效率 ───────────── */

function EfficiencyView({ onRowClick }: { onRowClick: (name: string, source: string) => void }) {
  return (
    <>
      <DrillMetricRow rows={PERFORMANCE_EFFICIENCY_METRICS} />

      <div className="flex min-h-0 flex-1 gap-3">
        <DrillTable
          title="业务处理效率_企业"
          columns={PERFORMANCE_EFFICIENCY_ENTERPRISE_COLUMNS}
          rows={PERFORMANCE_EFFICIENCY_ENTERPRISE_ROWS}
          dense
          onRowClick={(row) => onRowClick(row[1], '业务处理效率_企业')}
          className="min-h-0 flex-1"
        />
        <DrillTable
          title="业务处理效率_小组"
          columns={PERFORMANCE_EFFICIENCY_GROUP_COLUMNS}
          rows={PERFORMANCE_EFFICIENCY_GROUP_ROWS}
          dense
          className="min-h-0 flex-1"
        />
      </div>

      <DrillTable
        title="业务处理效率_个人"
        columns={PERFORMANCE_EFFICIENCY_PERSON_COLUMNS}
        rows={PERFORMANCE_EFFICIENCY_PERSON_ROWS}
        dense
        className="min-h-0 flex-1"
      />
    </>
  )
}

/* ───────────── 页签二：结转业务处理情况 ───────────── */

function CarryoverView() {
  return (
    <>
      <DrillMetricRow items={PERFORMANCE_CARRYOVER_METRICS} />

      <section className="flex min-h-0 flex-1 flex-col gap-2">
        <SectionHeading>结转业务处理情况_企业</SectionHeading>
        <DrillPagedTable
          columns={PERFORMANCE_CARRYOVER_COLUMNS}
          rows={PERFORMANCE_CARRYOVER_ROWS}
          pageSize={PAGE_SIZE}
          dense
          className="min-h-0 flex-1"
        />
      </section>
    </>
  )
}

/* ───────────── 页签三：报表出具情况 ───────────── */

function ReportView() {
  return (
    <>
      <div className="ck-panel flex h-[132px] shrink-0 items-center gap-5 rounded-(--ck-panel-radius) px-6">
        <div className="flex w-[300px] shrink-0 items-center gap-3">
          <span
            className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-[12px] text-[23px] text-white"
            style={{
              background:
                'linear-gradient(145deg, color-mix(in srgb, var(--ck-cyan) 52%, #ffffff) 0%, var(--ck-cyan) 100%)',
              boxShadow: '0 6px 14px color-mix(in srgb, var(--ck-cyan) 34%, transparent)',
            }}
          >
            <i className="ri-file-chart-line" aria-hidden />
          </span>
          <span className="flex min-w-0 flex-col gap-1.5">
            <span className="truncate text-[16px] leading-none text-(--text-secondary)">
              {PERFORMANCE_REPORT_HEADLINE.label}
            </span>
            <span className="ck-glow-num text-[28px] leading-none font-bold text-(--ck-cyan)">
              {PERFORMANCE_REPORT_HEADLINE.value}
            </span>
          </span>
        </div>

        <span className="h-[80px] w-px shrink-0 bg-(--border-light)" />

        <div className="grid min-w-0 flex-1 grid-flow-col grid-cols-3 grid-rows-3 gap-x-6 gap-y-1.5">
          {PERFORMANCE_REPORT_METRICS.map((item) => (
            <span key={item.label} className="flex min-w-0 items-center gap-2">
              <i
                className={`${item.icon} text-[16px]`}
                style={{ color: `var(${item.colorVar})` }}
                aria-hidden
              />
              <span className="truncate text-[14px] leading-none text-(--text-secondary)">
                {item.label}
              </span>
              <span
                className="shrink-0 text-[17px] leading-none font-bold tabular-nums"
                style={{ color: `var(${item.colorVar})` }}
              >
                {item.value}
              </span>
            </span>
          ))}
        </div>
      </div>

      <section className="flex min-h-0 flex-1 flex-col gap-2">
        <SectionHeading>报表出具情况_企业</SectionHeading>
        <DrillPagedTable
          columns={PERFORMANCE_REPORT_COLUMNS}
          rows={PERFORMANCE_REPORT_ROWS}
          pageSize={PAGE_SIZE}
          dense
          className="min-h-0 flex-1"
        />
      </section>
    </>
  )
}

/** 卡片外的小标题（「▸ 某某_企业」） */
function SectionHeading({ children }: { children: string }) {
  return (
    <span className="flex shrink-0 items-center gap-1 px-1">
      <i className="ri-arrow-right-s-fill text-[15px] leading-none text-(--ck-cyan)" aria-hidden />
      <span className="text-[15px] leading-none font-semibold text-(--ck-title-sub)">
        {children}
      </span>
    </span>
  )
}
