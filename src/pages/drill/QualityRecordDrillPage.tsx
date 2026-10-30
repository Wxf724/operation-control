import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { DrillListHeader, DrillQueryPanel, DrillScreen, DrillTable } from './components'
import type { DrillQueryCondition } from './components/DrillQueryPanel'
import {
  QUALITY_CAPTURE_DRILL_PATH,
  QUALITY_PERIOD,
  QUALITY_RECORD_QUERY_KEYS,
  QUALITY_SAMPLING_DRILL_PATH,
} from './qualityConstants'
import { QUALITY_CHECK_VIEW, QUALITY_DOC_VIEW, QUALITY_RECORD_COLUMNS } from './qualityRecordData'

/**
 * 待抽样核查明细（图 9）与单据明细（图 10）共用的实现。
 *
 * 两页版面同构：顶部条（页名 + 原始查询条件开关）→ 条件带（按需展开）→ 单据表。
 * 上一层点下来的岗位／员工／业务类型通过查询串带过来，
 * 左上角的小箭头按 `from` 参数回「抽样覆盖」或「捕获进度」钻取页。
 */
function QualityRecordScreen({ view }: { view: 'check' | 'doc' }) {
  const [searchParams] = useSearchParams()
  const config = view === 'doc' ? QUALITY_DOC_VIEW : QUALITY_CHECK_VIEW

  // 带着条件进来时默认展开条件带，直接打开本页时保持收起
  const [queryOpen, setQueryOpen] = useState(() =>
    QUALITY_RECORD_QUERY_KEYS.some(({ key }) => Boolean(searchParams.get(key)))
  )

  const conditions = useMemo<DrillQueryCondition[]>(() => {
    const items: DrillQueryCondition[] = [
      { label: '日期区间', value: `${QUALITY_PERIOD.start} 至 ${QUALITY_PERIOD.end}` },
    ]

    for (const { key, label } of QUALITY_RECORD_QUERY_KEYS) {
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

      <DrillTable columns={QUALITY_RECORD_COLUMNS} rows={config.rows} className="min-h-0 flex-1" />
    </DrillScreen>
  )
}

/** 钻取明细页 ·「待抽样核查明细」（路由 `/drill/quality-check`，对应参考图 9） */
export function QualityCheckDrillPage() {
  return <QualityRecordScreen view="check" />
}

/** 钻取明细页 ·「单据明细」（路由 `/drill/quality-doc`，对应参考图 10） */
export function QualityDocDrillPage() {
  return <QualityRecordScreen view="doc" />
}
