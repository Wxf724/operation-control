import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { SectionTitle } from '@/components/cockpit-ui'

import {
  DrillFilterBar,
  DrillMetricRow,
  DrillPagedTable,
  DrillScreen,
  DrillTabBar,
} from './components'
import { QUALITY_DOC_DRILL_PATH, QUALITY_PERIOD, QUALITY_SAMPLING_TABS } from './qualityConstants'
import {
  QUALITY_SAMPLING_COLUMNS,
  QUALITY_SAMPLING_ROWS,
  QUALITY_SAMPLING_VIEWS,
} from './qualitySamplingData'

/** 每页 100 条：141 行正好两页，与参考图右下角的「1 /2」一致 */
const PAGE_SIZE = 100

/**
 * 钻取明细页 ·「稽核覆盖与抽样情况」（路由 `/drill/quality-sampling`，对应参考图 3／4／5）。
 *
 * 结构：日期区间 → 三个页签（凭证／报表／档案）→ 指标条 3 项
 *      → 小标题 + 业务类型明细表（141 行、2 页）。
 * 任意一行点进「单据明细」页，并把业务类型写进查询串。
 */
export function QualitySamplingDrillPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // `?tab=report` / `?tab=archive` 可直接落在对应页签上，方便外链与截图核对
  const [activeTab, setActiveTab] = useState<string>(() => {
    const wanted = searchParams.get('tab')
    return QUALITY_SAMPLING_TABS.some((tab) => tab.key === wanted)
      ? (wanted as string)
      : QUALITY_SAMPLING_TABS[0].key
  })

  const view = QUALITY_SAMPLING_VIEWS[activeTab] ?? QUALITY_SAMPLING_VIEWS.voucher

  return (
    <DrillScreen>
      <DrillFilterBar
        title="稽核覆盖与抽样情况"
        defaultStart={QUALITY_PERIOD.start}
        defaultEnd={QUALITY_PERIOD.end}
        className="h-[74px]"
      />

      <DrillTabBar
        tabs={QUALITY_SAMPLING_TABS}
        active={activeTab}
        onChange={setActiveTab}
        className="h-[62px]"
      />

      <DrillMetricRow items={view.metrics} />

      <section className="flex min-h-0 flex-1 flex-col gap-2">
        <SectionTitle className="shrink-0 px-1">{view.tableTitle}</SectionTitle>

        <DrillPagedTable
          columns={QUALITY_SAMPLING_COLUMNS}
          rows={QUALITY_SAMPLING_ROWS}
          pageSize={PAGE_SIZE}
          onRowClick={(row) =>
            navigate(
              `${QUALITY_DOC_DRILL_PATH}?from=sampling&source=${encodeURIComponent(view.tableTitle)}&type=${encodeURIComponent(row[1])}`
            )
          }
          className="min-h-0 flex-1"
        />
      </section>
    </DrillScreen>
  )
}
