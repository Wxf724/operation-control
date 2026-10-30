import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { DrillFilterBar, DrillMetricRow, DrillScreen, DrillTable, DrillTabBar } from './components'
import {
  QUALITY_CAPTURE_TABS,
  QUALITY_CHECK_DRILL_PATH,
  QUALITY_DOC_DRILL_PATH,
  QUALITY_PERIOD,
} from './qualityConstants'
import {
  QUALITY_CAPTURE_VIEWS,
  buildCaptureStaffColumns,
  buildCaptureStageColumns,
} from './qualityCaptureData'

/**
 * 钻取明细页 ·「稽核过程与效率情况」（路由 `/drill/quality-capture`，对应参考图 6／7／8）。
 *
 * 结构：日期区间 → 三个页签（凭证／要素／档案）→ 指标条 5 项
 *      →「XX捕获完成情况-环节」表 →「XX捕获完成情况-个人」表。
 *
 * 行点击按页签分流：凭证／要素的任意一行进「待抽样核查明细」，
 * 档案的任意一行进「单据明细」，并把点到的岗位／员工写进查询串。
 */
export function QualityCaptureDrillPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // `?tab=element` / `?tab=archive` 可直接落在对应页签上，方便外链与截图核对
  const [activeTab, setActiveTab] = useState<string>(() => {
    const wanted = searchParams.get('tab')
    return QUALITY_CAPTURE_TABS.some((tab) => tab.key === wanted)
      ? (wanted as string)
      : QUALITY_CAPTURE_TABS[0].key
  })

  const view = QUALITY_CAPTURE_VIEWS[activeTab] ?? QUALITY_CAPTURE_VIEWS.voucher
  const stageColumns = useMemo(() => buildCaptureStageColumns(view.unit), [view.unit])
  const staffColumns = useMemo(() => buildCaptureStaffColumns(view.unit), [view.unit])

  /** 环节表 / 个人表的行点击：按页签分流到两张明细页之一 */
  const openDetail = (row: readonly string[], kind: 'stage' | 'staff') => {
    const target = view.detail === 'doc' ? QUALITY_DOC_DRILL_PATH : QUALITY_CHECK_DRILL_PATH
    const picked =
      kind === 'stage'
        ? `post=${encodeURIComponent(row[1])}`
        : `staff=${encodeURIComponent(row[1])}`
    navigate(`${target}?from=capture&source=${encodeURIComponent(view.tableTitle)}&${picked}`)
  }

  return (
    <DrillScreen>
      <DrillFilterBar
        title="稽核过程与效率情况"
        defaultStart={QUALITY_PERIOD.start}
        defaultEnd={QUALITY_PERIOD.end}
        className="h-[74px]"
      />

      <DrillTabBar
        tabs={QUALITY_CAPTURE_TABS}
        active={activeTab}
        onChange={setActiveTab}
        className="h-[62px]"
      />

      <DrillMetricRow items={view.metrics} />

      <div className="flex min-h-0 flex-1 flex-col gap-3">
        <DrillTable
          title={`${view.tableTitle}-环节`}
          columns={stageColumns}
          rows={view.stageRows}
          onRowClick={(row) => openDetail(row, 'stage')}
          className="min-h-0 flex-1"
        />

        <DrillTable
          title={`${view.tableTitle}-个人`}
          columns={staffColumns}
          rows={view.staffRows}
          onRowClick={(row) => openDetail(row, 'staff')}
          className="min-h-0 flex-1"
        />
      </div>
    </DrillScreen>
  )
}
