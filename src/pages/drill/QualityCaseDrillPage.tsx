import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { DrillListHeader, DrillQueryPanel, DrillScreen, DrillTable } from './components'
import type { DrillQueryCondition } from './components/DrillQueryPanel'
import {
  QUALITY_APPEAL_DETAIL_COLUMNS,
  QUALITY_APPEAL_DETAIL_ROWS,
  QUALITY_DISPUTE_COLUMNS,
  QUALITY_DISPUTE_ROWS,
} from './qualityAppealDetailData'
import { QUALITY_CASE_QUERY_KEYS, QUALITY_PERIOD } from './qualityConstants'

/**
 * 申诉明细（图 11）与争议明细（图 10）共用的实现。
 *
 * 两页同构：顶部条（页名 + 原始查询条件开关）→ 条件带（按需展开）→ 单据级明细表。
 * 上一层「申诉与争议管理情况」里点行、在跳转列菜单里选中的对象通过查询串带过来，
 * 左上角的小箭头回「申诉与争议管理情况」页。
 */
function QualityCaseScreen({ view }: { view: 'appeal' | 'dispute' }) {
  const [searchParams] = useSearchParams()

  const config =
    view === 'dispute'
      ? { title: '争议明细', columns: QUALITY_DISPUTE_COLUMNS, rows: QUALITY_DISPUTE_ROWS }
      : {
          title: '申诉明细',
          columns: QUALITY_APPEAL_DETAIL_COLUMNS,
          rows: QUALITY_APPEAL_DETAIL_ROWS,
        }

  // 带着条件进来时默认展开条件带，直接打开本页时保持收起
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
        title={config.title}
        queryOpen={queryOpen}
        onToggleQuery={() => setQueryOpen((prev) => !prev)}
        className="h-[66px]"
      />

      {queryOpen ? <DrillQueryPanel conditions={conditions} className="min-h-[62px] py-3" /> : null}

      <DrillTable columns={config.columns} rows={config.rows} className="min-h-0 flex-1" />
    </DrillScreen>
  )
}

/** 钻取明细页 ·「申诉明细」（路由 `/drill/quality-appeal-detail`） */
export function QualityAppealDetailDrillPage() {
  return <QualityCaseScreen view="appeal" />
}

/** 钻取明细页 ·「争议明细」（路由 `/drill/quality-dispute`，对应参考图 10） */
export function QualityDisputeDrillPage() {
  return <QualityCaseScreen view="dispute" />
}
