import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { DrillFilterBar, DrillMetricRow, DrillScreen, DrillTabBar, DrillTable } from './components'
import {
  PERFORMANCE_DOC_DRILL_PATH,
  PERFORMANCE_PERIOD,
  PERFORMANCE_QUALITY_TABS,
} from './performanceConstants'
import {
  PERFORMANCE_QUALITY_COLUMNS,
  PERFORMANCE_QUALITY_METRICS,
  getQualityRows,
} from './performanceQualityData'

/**
 * 钻取明细页 ·「质量管理情况」（路由 `/drill/performance-quality`，对应参考图 5～7）。
 *
 * 结构：日期区间 → 6 张指标卡（4 + 2 两行）→ 三个页签（企业／小组／个人）→ 明细表（各 10 行）。
 * 任意一行点进「单据明细」页，并把点到的企业写进查询串。
 */
export function PerformanceQualityDrillPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [activeTab, setActiveTab] = useState<string>(() => {
    const wanted = searchParams.get('tab')
    return PERFORMANCE_QUALITY_TABS.some((tab) => tab.key === wanted)
      ? (wanted as string)
      : PERFORMANCE_QUALITY_TABS[0].key
  })

  const tab =
    PERFORMANCE_QUALITY_TABS.find((item) => item.key === activeTab) ?? PERFORMANCE_QUALITY_TABS[0]
  const columns = PERFORMANCE_QUALITY_COLUMNS[activeTab] ?? PERFORMANCE_QUALITY_COLUMNS.enterprise
  const rows = getQualityRows(activeTab)

  return (
    <DrillScreen>
      <DrillFilterBar
        title="质量管理情况"
        defaultStart={PERFORMANCE_PERIOD.start}
        defaultEnd={PERFORMANCE_PERIOD.end}
        className="h-[74px]"
      />

      <DrillMetricRow rows={PERFORMANCE_QUALITY_METRICS} />

      <DrillTabBar
        tabs={PERFORMANCE_QUALITY_TABS}
        active={activeTab}
        onChange={setActiveTab}
        className="h-[62px]"
      />

      <DrillTable
        columns={columns}
        rows={rows}
        dense
        onRowClick={(row) =>
          navigate(
            `${PERFORMANCE_DOC_DRILL_PATH}?from=quality&source=${encodeURIComponent(tab.label)}&org=${encodeURIComponent(row[1])}`
          )
        }
        className="min-h-0 flex-1"
      />
    </DrillScreen>
  )
}
