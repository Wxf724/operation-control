import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import {
  DrillListHeader,
  DrillPerfPanel,
  DrillQueryPanel,
  DrillScreen,
  DrillTable,
  RpaDocTable,
} from './components'
import type { DrillQueryCondition } from './components/DrillQueryPanel'
import {
  QUALITY_CASE_QUERY_KEYS,
  QUALITY_PERIOD,
  QUALITY_RECTIFY_DOC_TABS,
  QUALITY_UNRECTIFIED_TABS,
} from './qualityConstants'
import {
  QUALITY_RECTIFY_DOC_PAGE_SIZES,
  QUALITY_RECTIFY_DOC_TOTAL,
  QUALITY_UNRECTIFIED_COLUMNS,
  QUALITY_UNRECTIFIED_ROWS,
  getRectifyDocRows,
} from './qualityRectifyData'
import {
  QUALITY_WORKORDER_COLUMNS,
  QUALITY_WORKORDER_PERF_SERIES,
  QUALITY_WORKORDER_PERF_STAGES,
  QUALITY_WORKORDER_PERF_STATS,
} from './qualityWorkorderData'

/**
 * 「整改与规则转化情况」再下一层的两张单据级明细页：
 *   单据明细（参考图 6，4 万条按需生成、200 条/页）
 *   未整改明细（参考图 7，24 行）
 *
 * 两页同构：顶部条（页签 + 原始查询条件开关）→ 条件带（按需展开）→ 明细表，
 * 左上角小箭头回「整改与规则转化情况」页。
 */
function RectifyRecordScreen({ view }: { view: 'doc' | 'unrectified' }) {
  const [searchParams] = useSearchParams()

  const tabs = view === 'doc' ? QUALITY_RECTIFY_DOC_TABS : QUALITY_UNRECTIFIED_TABS
  const title = view === 'doc' ? '单据明细' : '未整改明细'

  const [activeTab, setActiveTab] = useState<string>(() => {
    const wanted = searchParams.get('tab')
    return tabs.some((tab) => tab.key === wanted) ? (wanted as string) : tabs[0].key
  })

  const [queryOpen, setQueryOpen] = useState(() =>
    QUALITY_CASE_QUERY_KEYS.some(({ key }) => Boolean(searchParams.get(key)))
  )

  const conditions = useMemo<DrillQueryCondition[]>(() => {
    const items: DrillQueryCondition[] = [
      { label: '日期区间', value: `${QUALITY_PERIOD.start} 至 ${QUALITY_PERIOD.end}` },
    ]

    for (const { key, label } of QUALITY_CASE_QUERY_KEYS) {
      const value = searchParams.get(key)
      if (value) items.push({ label, value })
    }

    return items
  }, [searchParams])

  return (
    <DrillScreen>
      <DrillListHeader
        tabs={tabs}
        active={activeTab}
        onChange={setActiveTab}
        queryOpen={queryOpen}
        onToggleQuery={() => setQueryOpen((prev) => !prev)}
        className="h-[66px]"
      />

      {queryOpen ? <DrillQueryPanel conditions={conditions} className="min-h-[62px] py-3" /> : null}

      {activeTab === 'perf' ? (
        <DrillPerfPanel
          title={`${title} · 各制单部门处理效率`}
          stages={QUALITY_WORKORDER_PERF_STAGES}
          series={QUALITY_WORKORDER_PERF_SERIES}
          stats={QUALITY_WORKORDER_PERF_STATS}
          className="min-h-0 flex-1"
        />
      ) : view === 'doc' ? (
        <RpaDocTable
          columns={QUALITY_WORKORDER_COLUMNS}
          total={QUALITY_RECTIFY_DOC_TOTAL}
          pageSizes={QUALITY_RECTIFY_DOC_PAGE_SIZES}
          getRows={getRectifyDocRows}
          className="min-h-0 flex-1"
        />
      ) : (
        <DrillTable
          columns={QUALITY_UNRECTIFIED_COLUMNS}
          rows={QUALITY_UNRECTIFIED_ROWS}
          className="min-h-0 flex-1"
        />
      )}
    </DrillScreen>
  )
}

/** 钻取明细页 ·「单据明细」（路由 `/drill/quality-rectify-doc`，对应参考图 6） */
export function QualityRectifyDocDrillPage() {
  return <RectifyRecordScreen view="doc" />
}

/** 钻取明细页 ·「未整改明细」（路由 `/drill/quality-unrectified`，对应参考图 7） */
export function QualityUnrectifiedDrillPage() {
  return <RectifyRecordScreen view="unrectified" />
}
