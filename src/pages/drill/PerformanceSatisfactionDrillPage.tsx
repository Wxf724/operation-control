import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { DrillFilterBar, DrillMetricRow, DrillScreen, DrillTabBar, DrillTable } from './components'
import { PERFORMANCE_PERIOD, PERFORMANCE_SATISFACTION_TABS } from './performanceConstants'
import {
  PERFORMANCE_SATISFACTION_COLUMNS,
  PERFORMANCE_SATISFACTION_METRICS,
  getSatisfactionRows,
} from './performanceServiceData'

/**
 * 钻取明细页 ·「服务满意度情况」（路由 `/drill/performance-satisfaction`，对应参考图 10～12）。
 *
 * 结构：日期区间 → 2 张指标卡 → 三个页签（中心／个人／小组）→ 明细表（各 5 行）。
 */
export function PerformanceSatisfactionDrillPage() {
  const [searchParams] = useSearchParams()

  const [activeTab, setActiveTab] = useState<string>(() => {
    const wanted = searchParams.get('tab')
    return PERFORMANCE_SATISFACTION_TABS.some((tab) => tab.key === wanted)
      ? (wanted as string)
      : PERFORMANCE_SATISFACTION_TABS[0].key
  })

  const columns =
    PERFORMANCE_SATISFACTION_COLUMNS[activeTab] ?? PERFORMANCE_SATISFACTION_COLUMNS.center
  const rows = getSatisfactionRows(activeTab)

  return (
    <DrillScreen>
      <DrillFilterBar
        title="服务满意度情况"
        defaultStart={PERFORMANCE_PERIOD.start}
        defaultEnd={PERFORMANCE_PERIOD.end}
        className="h-[74px]"
      />

      <DrillMetricRow items={PERFORMANCE_SATISFACTION_METRICS} />

      <DrillTabBar
        tabs={PERFORMANCE_SATISFACTION_TABS}
        active={activeTab}
        onChange={setActiveTab}
        className="h-[62px]"
      />

      <DrillTable columns={columns} rows={rows} className="min-h-0 flex-1" />
    </DrillScreen>
  )
}
