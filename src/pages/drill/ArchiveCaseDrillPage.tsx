import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import {
  DrillListHeader,
  DrillPerfPanel,
  DrillQueryPanel,
  DrillScreen,
  DrillTable,
} from './components'
import type { DrillQueryCondition } from './components/DrillQueryPanel'
import { ARCHIVE_CASE_TABS, ARCHIVE_PERIOD, ARCHIVE_QUERY_KEYS } from './archiveConstants'
import {
  ARCHIVE_MATCH_COLUMNS,
  ARCHIVE_MATCH_ROWS,
  ARCHIVE_PRINT_COLUMNS,
  ARCHIVE_PRINT_ROWS,
} from './archiveCaseData'
import {
  QUALITY_WORKORDER_PERF_SERIES,
  QUALITY_WORKORDER_PERF_STAGES,
  QUALITY_WORKORDER_PERF_STATS,
} from './qualityWorkorderData'

/**
 * 待打印单据明细（图 9）与待匹配比对单据明细（图 10）共用的实现。
 *
 * 两页同构：顶部条（明细页签 + 原始查询条件开关）→ 条件带（按需展开）→ 24 行单据表，
 * 左上角小箭头回「档案作业情况」页。
 */
function ArchiveCaseScreen({ view }: { view: 'print' | 'match' }) {
  const [searchParams] = useSearchParams()

  const config =
    view === 'match'
      ? {
          title: '待匹配比对单据明细',
          columns: ARCHIVE_MATCH_COLUMNS,
          rows: ARCHIVE_MATCH_ROWS,
        }
      : {
          title: '待打印单据明细',
          columns: ARCHIVE_PRINT_COLUMNS,
          rows: ARCHIVE_PRINT_ROWS,
        }

  const [activeTab, setActiveTab] = useState<string>(() => {
    const wanted = searchParams.get('tab')
    return ARCHIVE_CASE_TABS.some((tab) => tab.key === wanted)
      ? (wanted as string)
      : ARCHIVE_CASE_TABS[0].key
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

  return (
    <DrillScreen>
      <DrillListHeader
        tabs={ARCHIVE_CASE_TABS}
        active={activeTab}
        onChange={setActiveTab}
        queryOpen={queryOpen}
        onToggleQuery={() => setQueryOpen((prev) => !prev)}
        className="h-[66px]"
      />

      {queryOpen ? <DrillQueryPanel conditions={conditions} className="min-h-[62px] py-3" /> : null}

      {activeTab === 'perf' ? (
        <DrillPerfPanel
          title={`${config.title} · 各制单部门处理效率`}
          stages={QUALITY_WORKORDER_PERF_STAGES}
          series={QUALITY_WORKORDER_PERF_SERIES}
          stats={QUALITY_WORKORDER_PERF_STATS}
          className="min-h-0 flex-1"
        />
      ) : (
        <DrillTable columns={config.columns} rows={config.rows} className="min-h-0 flex-1" />
      )}
    </DrillScreen>
  )
}

/** 钻取明细页 ·「待打印单据明细」（路由 `/drill/archive-print`，对应参考图 9） */
export function ArchivePrintDrillPage() {
  return <ArchiveCaseScreen view="print" />
}

/** 钻取明细页 ·「待匹配比对单据明细」（路由 `/drill/archive-match`，对应参考图 10） */
export function ArchiveMatchDrillPage() {
  return <ArchiveCaseScreen view="match" />
}
