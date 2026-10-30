import ReactECharts from 'echarts-for-react'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { SectionTitle, useChartColors } from '@/components/cockpit-ui'

import { DrillDonut, DrillFilterBar, DrillScreen, DrillTabBar, DrillTable } from './components'
import { TRAVEL_PERIOD, TRAVEL_VEHICLE_TABS } from './travelConstants'
import { buildBarOption } from './travelChartOptions'
import {
  TRAVEL_COST_DONUT,
  TRAVEL_ENTERPRISE_FEE_COLUMNS,
  TRAVEL_ENTERPRISE_FEE_ROWS,
  TRAVEL_EXPENSE_MONTHS,
  TRAVEL_EXPENSE_PERSONS,
  TRAVEL_OVERDUE_SERIES,
  TRAVEL_PENDING_SERIES,
  TRAVEL_PERSON_FEE_COLUMNS,
  TRAVEL_PERSON_FEE_ROWS,
  TRAVEL_PERSON_OVERDUE_SERIES,
  TRAVEL_REIMBURSE_COLUMNS,
  TRAVEL_REIMBURSE_ROWS,
} from './travelExpenseData'

const CHART_PROPS = {
  style: { height: '100%', width: '100%' },
  opts: { renderer: 'canvas' as const },
  notMerge: true,
}

/**
 * 钻取明细页 ·「商旅报销情况」（路由 `/drill/travel-expense`，对应参考图 5）。
 *
 * 结构：日期区间 → 企业/个人交通住宿费用（各带三页签表）｜ 商旅成本入账率环形
 *      → 商旅报销表 ｜ 企业超期待报销情况（堆叠柱）
 *      → 企业待报销情况 ｜ 个人超期待报销情况（堆叠柱）
 */
export function TravelExpenseDrillPage() {
  const c = useChartColors()
  const [searchParams] = useSearchParams()

  const [enterpriseTab, setEnterpriseTab] = useState<string>(() => {
    const wanted = searchParams.get('tab')
    return TRAVEL_VEHICLE_TABS.some((tab) => tab.key === wanted)
      ? (wanted as string)
      : TRAVEL_VEHICLE_TABS[0].key
  })
  const [personTab, setPersonTab] = useState<string>(TRAVEL_VEHICLE_TABS[0].key)

  const overdueOption = useMemo(
    () => buildBarOption(c, TRAVEL_EXPENSE_MONTHS, TRAVEL_OVERDUE_SERIES, true),
    [c]
  )
  const pendingOption = useMemo(
    () => buildBarOption(c, TRAVEL_EXPENSE_MONTHS, TRAVEL_PENDING_SERIES, true),
    [c]
  )
  const personOverdueOption = useMemo(
    () => buildBarOption(c, TRAVEL_EXPENSE_PERSONS, TRAVEL_PERSON_OVERDUE_SERIES, true),
    [c]
  )

  return (
    <DrillScreen>
      <DrillFilterBar
        title="商旅报销情况"
        defaultStart={TRAVEL_PERIOD.start}
        defaultEnd={TRAVEL_PERIOD.end}
        className="h-[70px]"
      />

      <div className="flex min-h-0 flex-[1.1] gap-3">
        <section className="ck-panel flex min-h-0 flex-1 flex-col rounded-(--ck-panel-radius) p-3">
          <div className="flex shrink-0 items-center justify-between gap-2 pb-1.5">
            <SectionTitle>商旅费用 — 企业交通住宿费用</SectionTitle>
            <DrillTabBar
              tabs={TRAVEL_VEHICLE_TABS}
              active={enterpriseTab}
              onChange={setEnterpriseTab}
              className="h-[40px]"
            />
          </div>
          <DrillTable
            bare
            columns={TRAVEL_ENTERPRISE_FEE_COLUMNS}
            rows={TRAVEL_ENTERPRISE_FEE_ROWS}
            dense
            className="min-h-0 flex-1"
          />
        </section>

        <section className="ck-panel flex min-h-0 flex-1 flex-col rounded-(--ck-panel-radius) p-3">
          <div className="flex shrink-0 items-center justify-between gap-2 pb-1.5">
            <SectionTitle>商旅费用 — 个人交通住宿费用</SectionTitle>
            <DrillTabBar
              tabs={TRAVEL_VEHICLE_TABS}
              active={personTab}
              onChange={setPersonTab}
              className="h-[40px]"
            />
          </div>
          <DrillTable
            bare
            columns={TRAVEL_PERSON_FEE_COLUMNS}
            rows={TRAVEL_PERSON_FEE_ROWS}
            dense
            className="min-h-0 flex-1"
          />
        </section>

        <section className="ck-panel flex min-h-0 w-[360px] shrink-0 flex-col rounded-(--ck-panel-radius) p-3">
          <SectionTitle>商旅成本入账率</SectionTitle>
          <DrillDonut segments={TRAVEL_COST_DONUT} className="mt-1 min-h-0 flex-1" />
        </section>
      </div>

      <div className="flex min-h-0 flex-1 gap-3">
        <DrillTable
          title="商旅报销"
          columns={TRAVEL_REIMBURSE_COLUMNS}
          rows={TRAVEL_REIMBURSE_ROWS}
          dense
          className="min-h-0 flex-1"
        />

        <section className="ck-panel flex min-h-0 flex-1 flex-col rounded-(--ck-panel-radius) p-3">
          <SectionTitle>商旅报销 — 企业超期待报销情况</SectionTitle>
          <div className="mt-1 min-h-0 flex-1">
            <ReactECharts option={overdueOption} {...CHART_PROPS} />
          </div>
        </section>
      </div>

      <div className="flex min-h-0 flex-1 gap-3">
        <section className="ck-panel flex min-h-0 flex-1 flex-col rounded-(--ck-panel-radius) p-3">
          <SectionTitle>商旅报销 — 企业待报销情况</SectionTitle>
          <div className="mt-1 min-h-0 flex-1">
            <ReactECharts option={pendingOption} {...CHART_PROPS} />
          </div>
        </section>

        <section className="ck-panel flex min-h-0 flex-1 flex-col rounded-(--ck-panel-radius) p-3">
          <SectionTitle>商旅报销 — 个人超期待报销情况</SectionTitle>
          <div className="mt-1 min-h-0 flex-1">
            <ReactECharts option={personOverdueOption} {...CHART_PROPS} />
          </div>
        </section>
      </div>
    </DrillScreen>
  )
}
