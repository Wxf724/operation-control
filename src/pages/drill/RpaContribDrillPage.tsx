import { useNavigate } from 'react-router-dom'

import { SectionTitle } from '@/components/cockpit-ui'

import { DrillFilterBar, DrillMetricRow, DrillPagedTable, DrillScreen } from './components'
import { RPA_CONTRIB_METRICS, RPA_CONTRIB_ROWS } from './rpaContribData'
import { RPA_DOC_DRILL_PATH, RPA_PERIOD } from './rpaConstants'
import type { DrillColumn } from './types'

const COLUMNS: readonly DrillColumn[] = [
  { key: 'bizCode', title: '业务类型编码', width: '320px', sortable: true },
  { key: 'bizName', title: '业务类型名称', width: 'minmax(0,1fr)', align: 'left' },
  { key: 'duration', title: 'RPA任务平均处理时长', width: '420px', sortable: true },
  { key: 'prior', title: '去年同期', width: '320px' },
  { key: 'yoy', title: '同比', width: '320px', sortable: true },
]

/** 每页 100 条：141 行正好两页，与参考图右下角的「1 /2」一致 */
const PAGE_SIZE = 100

/**
 * 钻取明细页 ·「贡献情况」（路由 `/drill/rpa-contrib`，对应参考图 4）。
 *
 * 结构：
 *   筛选行（日期区间）
 *   指标卡行（平均处理时长 / 自动化率 × 4）
 *   小标题「RPA任务平均处理时长」+ 明细表（141 行、2 页）
 *
 * 任意一行点进「单据明细」页，并把业务类型写进查询串。
 */
export function RpaContribDrillPage() {
  const navigate = useNavigate()

  return (
    <DrillScreen>
      <DrillFilterBar
        title="贡献情况"
        defaultStart={RPA_PERIOD.start}
        defaultEnd={RPA_PERIOD.end}
        className="h-[74px]"
      />

      <DrillMetricRow items={RPA_CONTRIB_METRICS} />

      <section className="flex min-h-0 flex-1 flex-col gap-2">
        <SectionTitle className="shrink-0 px-1">RPA任务平均处理时长</SectionTitle>

        <DrillPagedTable
          columns={COLUMNS}
          rows={RPA_CONTRIB_ROWS}
          pageSize={PAGE_SIZE}
          onRowClick={(row) =>
            navigate(
              `${RPA_DOC_DRILL_PATH}?source=${encodeURIComponent('贡献情况')}&type=${encodeURIComponent(row[1])}`
            )
          }
          className="min-h-0 flex-1"
        />
      </section>
    </DrillScreen>
  )
}
