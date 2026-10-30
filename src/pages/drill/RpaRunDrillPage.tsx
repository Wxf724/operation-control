import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { DrillFilterBar, DrillScreen, DrillTable, RpaMetricTabBar } from './components'
import { RPA_DOC_DRILL_PATH, RPA_PERIOD, RPA_RUN_VIEW_TABS } from './rpaConstants'
import { RPA_RUN_VIEWS } from './rpaRunData'

/**
 * 钻取明细页 ·「运行情况」（路由 `/drill/rpa-run`，对应参考图 1、2）。
 *
 * 结构：
 *   筛选行（日期区间）
 *   页签 + 指标带（RPA运行情况 / RPA资源闲置，指标随页签切换）
 *   明细表（运行情况页签两张并排，资源闲置页签一张通栏）
 *
 * 表格标题和任意一行都能点进「单据明细」页，并把点到的业务环节／业务类型
 * 写进 URL 查询串，单据明细页的「原始查询条件」据此还原条件。
 */
export function RpaRunDrillPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // `?tab=idle` 可直接落在「RPA资源闲置」页签上，方便外链与截图核对
  const [activeTab, setActiveTab] = useState<string>(() => {
    const wanted = searchParams.get('tab')
    return RPA_RUN_VIEW_TABS.some((tab) => tab.key === wanted)
      ? (wanted as string)
      : RPA_RUN_VIEW_TABS[0].key
  })

  const view = RPA_RUN_VIEWS[activeTab] ?? RPA_RUN_VIEWS.running

  const openDocDetail = (query: string) => navigate(`${RPA_DOC_DRILL_PATH}?${query}`)

  return (
    <DrillScreen>
      <DrillFilterBar
        title="运行情况"
        defaultStart={RPA_PERIOD.start}
        defaultEnd={RPA_PERIOD.end}
        className="h-[74px]"
      />

      <RpaMetricTabBar
        tabs={RPA_RUN_VIEW_TABS}
        active={activeTab}
        onChange={setActiveTab}
        metrics={view.metrics}
        className="h-[76px]"
      />

      <div className="flex min-h-0 flex-1 gap-3">
        {view.tables.map((table) => (
          <DrillTable
            key={table.key}
            title={table.title}
            onTitleClick={() => openDocDetail(table.titleQuery)}
            columns={table.columns}
            rows={table.rows}
            onRowClick={(row) =>
              openDocDetail(`${table.rowQueryKey}=${encodeURIComponent(row[0])}`)
            }
            className="min-h-0 flex-1"
          />
        ))}
      </div>
    </DrillScreen>
  )
}
