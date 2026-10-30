import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import {
  DrillFilterBar,
  DrillMetricRow,
  DrillPagedTable,
  DrillScreen,
  DrillTabBar,
  QualityIssueDonut,
} from './components'
import {
  QUALITY_BUSINESS_COLUMNS,
  QUALITY_BUSINESS_ISSUES,
  QUALITY_BUSINESS_METRICS,
  QUALITY_BUSINESS_TABS,
  getBusinessRows,
} from './qualityBusinessData'
import { QUALITY_PERIOD, QUALITY_WORKORDER_DRILL_PATH } from './qualityConstants'

/** 每页 100 条：755 条正好 8 页，与参考图右下角的「1 /8」一致 */
const PAGE_SIZE = 100

/**
 * 钻取明细页 ·「业务质量与差错情况」（路由 `/drill/quality-business`，对应参考图 1～5）。
 *
 * 结构：日期区间 → 指标条（5 项，前三项带问题报数量）→ 五个页签
 *      → 左「业务问题构成」环形图 + 右单据明细表（755 条、8 页）。
 *
 * 五个页签只是换维度列（单位／区域／个人／小组／团队），行数据同一批；
 * 任意一行点进「工单明细」页，并把点到的对象写进查询串。
 */
export function QualityBusinessDrillPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // `?tab=region` 等可直接落在对应页签上，方便外链与截图核对
  const [activeTab, setActiveTab] = useState<string>(() => {
    const wanted = searchParams.get('tab')
    return QUALITY_BUSINESS_TABS.some((tab) => tab.key === wanted)
      ? (wanted as string)
      : QUALITY_BUSINESS_TABS[0].key
  })

  const tab =
    QUALITY_BUSINESS_TABS.find((item) => item.key === activeTab) ?? QUALITY_BUSINESS_TABS[0]
  const columns = QUALITY_BUSINESS_COLUMNS[activeTab] ?? QUALITY_BUSINESS_COLUMNS.unit
  const rows = getBusinessRows(activeTab)

  return (
    <DrillScreen>
      <DrillFilterBar
        title="业务质量与差错情况"
        defaultStart={QUALITY_PERIOD.start}
        defaultEnd={QUALITY_PERIOD.end}
        className="h-[74px]"
      />

      <DrillMetricRow items={QUALITY_BUSINESS_METRICS} />

      <DrillTabBar
        tabs={QUALITY_BUSINESS_TABS}
        active={activeTab}
        onChange={setActiveTab}
        className="h-[62px]"
      />

      <div className="flex min-h-0 flex-1 gap-3">
        <QualityIssueDonut segments={QUALITY_BUSINESS_ISSUES} className="w-[520px] shrink-0" />

        <DrillPagedTable
          columns={columns}
          rows={rows}
          pageSize={PAGE_SIZE}
          dense
          onRowClick={(row) =>
            navigate(
              `${QUALITY_WORKORDER_DRILL_PATH}?from=business&source=${encodeURIComponent(tab.label)}&org=${encodeURIComponent(row[0])}`
            )
          }
          className="min-h-0 flex-1"
        />
      </div>
    </DrillScreen>
  )
}
