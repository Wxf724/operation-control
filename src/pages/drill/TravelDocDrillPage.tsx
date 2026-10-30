import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import {
  DrillListHeader,
  DrillPerfPanel,
  DrillQueryPanel,
  DrillScreen,
  RpaDocTable,
} from './components'
import type { DrillQueryCondition } from './components/DrillQueryPanel'
import {
  QUALITY_WORKORDER_COLUMNS,
  QUALITY_WORKORDER_PERF_SERIES,
  QUALITY_WORKORDER_PERF_STAGES,
  QUALITY_WORKORDER_PERF_STATS,
  QUALITY_WORKORDER_TOTAL,
  getWorkorderRows,
} from './qualityWorkorderData'
import { TRAVEL_DOC_QUERY_KEYS, TRAVEL_DOC_TABS, TRAVEL_PERIOD } from './travelConstants'

/** 每页 500 条：与参考图「显示 500 条数据」一致 */
const PAGE_SIZE = 500

/**
 * 钻取明细页 ·「单据明细」（路由 `/drill/travel-doc`，对应参考图 8）。
 *
 * 商旅疑点订单情况里的任意一行都跳到这里：
 * 顶部条（单据明细 / 性能分析 + 原始查询条件）→ 条件带（按需展开）→ 12 列工单表。
 */
export function TravelDocDrillPage() {
  const [searchParams] = useSearchParams()

  const [activeTab, setActiveTab] = useState<string>(() => {
    const wanted = searchParams.get('tab')
    return TRAVEL_DOC_TABS.some((tab) => tab.key === wanted)
      ? (wanted as string)
      : TRAVEL_DOC_TABS[0].key
  })

  const [queryOpen, setQueryOpen] = useState(() =>
    TRAVEL_DOC_QUERY_KEYS.some(({ key }) => Boolean(searchParams.get(key)))
  )

  const conditions = useMemo<DrillQueryCondition[]>(() => {
    const items: DrillQueryCondition[] = [
      { label: '日期区间', value: `${TRAVEL_PERIOD.start} 至 ${TRAVEL_PERIOD.end}` },
    ]

    for (const { key, label } of TRAVEL_DOC_QUERY_KEYS) {
      const value = searchParams.get(key)
      if (value) items.push({ label, value })
    }

    return items
  }, [searchParams])

  return (
    <DrillScreen>
      <DrillListHeader
        tabs={TRAVEL_DOC_TABS}
        active={activeTab}
        onChange={setActiveTab}
        queryOpen={queryOpen}
        onToggleQuery={() => setQueryOpen((prev) => !prev)}
        className="h-[66px]"
      />

      {queryOpen ? <DrillQueryPanel conditions={conditions} className="min-h-[62px] py-3" /> : null}

      {activeTab === 'perf' ? (
        <DrillPerfPanel
          title="各制单部门单据处理效率"
          stages={QUALITY_WORKORDER_PERF_STAGES}
          series={QUALITY_WORKORDER_PERF_SERIES}
          stats={QUALITY_WORKORDER_PERF_STATS}
          className="min-h-0 flex-1"
        />
      ) : (
        <RpaDocTable
          columns={QUALITY_WORKORDER_COLUMNS}
          total={QUALITY_WORKORDER_TOTAL}
          pageSizes={[100, 200, 500]}
          defaultPageSize={PAGE_SIZE}
          getRows={getWorkorderRows}
          className="min-h-0 flex-1"
        />
      )}
    </DrillScreen>
  )
}
