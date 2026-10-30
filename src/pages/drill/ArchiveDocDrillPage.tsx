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
import { ARCHIVE_DOC_TABS, ARCHIVE_PERIOD, ARCHIVE_QUERY_KEYS } from './archiveConstants'
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
 * 钻取明细页 ·「单据明细」（路由 `/drill/archive-doc`，对应参考图 2、8）。
 *
 * 档案收集情况与档案作业情况（跳转列 → 单据明细）都跳到这里：
 * 顶部条（单据明细 / 性能分析 + 原始查询条件）→ 条件带（按需展开）→ 12 列工单表。
 * 左上角小箭头按 `from` 参数回收集页或作业页。
 */
export function ArchiveDocDrillPage() {
  const [searchParams] = useSearchParams()

  const [activeTab, setActiveTab] = useState<string>(() => {
    const wanted = searchParams.get('tab')
    return ARCHIVE_DOC_TABS.some((tab) => tab.key === wanted)
      ? (wanted as string)
      : ARCHIVE_DOC_TABS[0].key
  })

  const [queryOpen, setQueryOpen] = useState(() =>
    ARCHIVE_QUERY_KEYS.some(({ key }) => Boolean(searchParams.get(key)))
  )

  const conditions = useMemo<DrillQueryCondition[]>(() => {
    const items: DrillQueryCondition[] = [
      { label: '日期区间', value: `${ARCHIVE_PERIOD.start} 至 ${ARCHIVE_PERIOD.end}` },
    ]

    for (const { key, label } of ARCHIVE_QUERY_KEYS) {
      const value = searchParams.get(key)
      if (value) items.push({ label, value })
    }

    return items
  }, [searchParams])

  const fromCollect = searchParams.get('from') === 'collect'

  return (
    <DrillScreen>
      <DrillListHeader
        tabs={ARCHIVE_DOC_TABS}
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
