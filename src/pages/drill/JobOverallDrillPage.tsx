import { useMemo, useState } from 'react'

import { DrillFilterBar, DrillMetricRow, DrillScreen, DrillTabBar, DrillTable } from './components'
import { formatCount } from './format'
import { OVERALL_METRICS, OVERALL_PERIOD, OVERALL_TABS } from './overallData'
import type { DrillColumn, OrgScope } from './types'

/**
 * 钻取明细页 ·「作业处理整体情况」（路由 `/drill/job-overall`）。
 *
 * 结构对齐 `_refs/live/40-钻取-作业处理整体情况.png`，配色换成浅蓝白：
 *   筛选行（日期区间 + 法人/管理单位）
 *   指标卡行（接收单据量 / 完成单据量 / 单据完成率）
 *   页签行（6 个页签）
 *   明细表（序号 / 单位编号 / 单位 / 数值列 / 同期，共 N 条数据）
 */
export function JobOverallDrillPage() {
  const [scope, setScope] = useState<OrgScope>('管理单位')
  const [activeTab, setActiveTab] = useState(OVERALL_TABS[0].key)

  const tab = OVERALL_TABS.find((item) => item.key === activeTab) ?? OVERALL_TABS[0]

  const columns = useMemo<DrillColumn[]>(
    () => [
      { key: 'code', title: tab.codeTitle, width: '280px', sortable: true },
      { key: 'name', title: tab.nameTitle, width: '1fr' },
      { key: 'value', title: tab.valueTitle, width: '520px' },
      { key: 'prior', title: '同期', width: '440px' },
    ],
    [tab]
  )

  const rows = useMemo(
    () =>
      tab.rows.map((row) => [row.code, row.name, formatCount(row.value), formatCount(row.prior)]),
    [tab]
  )

  return (
    <DrillScreen>
      <DrillFilterBar
        title="作业处理整体情况"
        defaultStart={OVERALL_PERIOD.start}
        defaultEnd={OVERALL_PERIOD.end}
        scope={scope}
        onScopeChange={setScope}
        className="h-[78px]"
      />

      <DrillMetricRow items={OVERALL_METRICS} className="h-[92px]" />

      <DrillTabBar
        tabs={OVERALL_TABS}
        active={activeTab}
        onChange={setActiveTab}
        className="h-[60px]"
      />

      <DrillTable columns={columns} rows={rows} className="min-h-0 flex-1" />
    </DrillScreen>
  )
}
