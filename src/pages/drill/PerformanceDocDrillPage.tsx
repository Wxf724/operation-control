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
  PERFORMANCE_DOC_QUERY_KEYS,
  PERFORMANCE_DOC_TABS,
  PERFORMANCE_PERIOD,
} from './performanceConstants'
import {
  QUALITY_WORKORDER_COLUMNS,
  QUALITY_WORKORDER_PERF_SERIES,
  QUALITY_WORKORDER_PERF_STAGES,
  QUALITY_WORKORDER_PERF_STATS,
  QUALITY_WORKORDER_TOTAL,
  getWorkorderRows,
} from './qualityWorkorderData'

/** 每页 500 条：与参考图「显示 500 条数据 / 1 /200」一致 */
const PAGE_SIZE = 500

/**
 * 钻取明细页 ·「单据明细」（路由 `/drill/performance-doc`，对应参考图 4、8）。
 *
 * 效率管理情况的「业务处理效率_企业」表、质量管理情况的任意一行都跳到这里：
 * 顶部条（单据明细 / 性能分析 + 原始查询条件）→ 条件带（按需展开）→ 12 列工单表。
 * 左上角小箭头按 `from` 参数回效率页或质量页。
 */
export function PerformanceDocDrillPage() {
  const [searchParams] = useSearchParams()

  const [activeTab, setActiveTab] = useState<string>(() => {
    const wanted = searchParams.get('tab')
    return PERFORMANCE_DOC_TABS.some((tab) => tab.key === wanted)
      ? (wanted as string)
      : PERFORMANCE_DOC_TABS[0].key
  })

  const [queryOpen, setQueryOpen] = useState(() =>
    PERFORMANCE_DOC_QUERY_KEYS.some(({ key }) => Boolean(searchParams.get(key)))
  )

  const conditions = useMemo<DrillQueryCondition[]>(() => {
    const items: DrillQueryCondition[] = [
      { label: '日期区间', value: `${PERFORMANCE_PERIOD.start} 至 ${PERFORMANCE_PERIOD.end}` },
    ]

    for (const { key, label } of PERFORMANCE_DOC_QUERY_KEYS) {
      const value = searchParams.get(key)
      if (value) items.push({ label, value })
    }

    return items
  }, [searchParams])

  const fromQuality = searchParams.get('from') === 'quality'

  return (
    <DrillScreen>
      <DrillListHeader
        tabs={PERFORMANCE_DOC_TABS}
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
