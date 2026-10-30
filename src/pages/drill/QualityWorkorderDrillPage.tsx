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
  QUALITY_PERIOD,
  QUALITY_WORKORDER_QUERY_KEYS,
  QUALITY_WORKORDER_TABS,
} from './qualityConstants'
import {
  QUALITY_WORKORDER_COLUMNS,
  QUALITY_WORKORDER_PAGE_SIZES,
  QUALITY_WORKORDER_PERF_SERIES,
  QUALITY_WORKORDER_PERF_STAGES,
  QUALITY_WORKORDER_PERF_STATS,
  QUALITY_WORKORDER_TOTAL,
  getWorkorderRows,
} from './qualityWorkorderData'

/**
 * 钻取明细页 ·「工单明细」（路由 `/drill/quality-workorder`，对应参考图 6）。
 *
 * 业务质量与差错情况页里的任意一行都跳到这里：
 * 顶部条（单据明细 / 性能分析 + 原始查询条件）→ 条件带（按需展开）→ 工单表（4 万条、200 条/页）。
 */
export function QualityWorkorderDrillPage() {
  const [searchParams] = useSearchParams()

  const [activeTab, setActiveTab] = useState<string>(() => {
    const wanted = searchParams.get('tab')
    return QUALITY_WORKORDER_TABS.some((tab) => tab.key === wanted)
      ? (wanted as string)
      : QUALITY_WORKORDER_TABS[0].key
  })

  const [queryOpen, setQueryOpen] = useState(() =>
    QUALITY_WORKORDER_QUERY_KEYS.some(({ key }) => Boolean(searchParams.get(key)))
  )

  const conditions = useMemo<DrillQueryCondition[]>(() => {
    const items: DrillQueryCondition[] = [
      { label: '日期区间', value: `${QUALITY_PERIOD.start} 至 ${QUALITY_PERIOD.end}` },
    ]

    for (const { key, label } of QUALITY_WORKORDER_QUERY_KEYS) {
      const value = searchParams.get(key)
      if (value) items.push({ label, value })
    }

    return items
  }, [searchParams])

  return (
    <DrillScreen>
      <DrillListHeader
        tabs={QUALITY_WORKORDER_TABS}
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
          pageSizes={QUALITY_WORKORDER_PAGE_SIZES}
          getRows={getWorkorderRows}
          className="min-h-0 flex-1"
        />
      )}
    </DrillScreen>
  )
}
