import { useMemo, useState } from 'react'

import { DrillFilterBar, DrillScreen, DrillTabBar, DrillTable } from './components'
import { FLOW_PERIOD, FLOW_TABS } from './flowData'
import { formatCount, formatYoY } from './format'
import type { DrillColumn, OrgScope } from './types'

/**
 * 钻取明细页 ·「作业流转处理情况」（路由 `/drill/job-flow`）。
 *
 * 结构对齐 `_refs/live/41-钻取-作业流转处理情况.png`：
 *   筛选行 → 页签行（10 个页签，两端带翻页箭头）→ 明细表
 * 本页没有指标卡行；明细表比整体情况页多一列「同比」。
 */
export function JobFlowDrillPage() {
  const [scope, setScope] = useState<OrgScope>('法人单位')
  const [activeTab, setActiveTab] = useState(FLOW_TABS[0].key)

  const tab = FLOW_TABS.find((item) => item.key === activeTab) ?? FLOW_TABS[0]

  const columns = useMemo<DrillColumn[]>(
    () => [
      { key: 'code', title: tab.codeTitle, width: '260px', sortable: true },
      { key: 'name', title: tab.nameTitle, width: '1fr' },
      { key: 'value', title: tab.valueTitle, width: '420px' },
      { key: 'prior', title: '同期', width: '320px' },
      { key: 'yoy', title: '同比', width: '330px' },
    ],
    [tab]
  )

  const rows = useMemo(
    () =>
      tab.rows.map((row) => [
        row.code,
        row.name,
        formatCount(row.value),
        formatCount(row.prior),
        formatYoY(row.value, row.prior),
      ]),
    [tab]
  )

  return (
    <DrillScreen>
      <DrillFilterBar
        title="作业流转处理情况"
        defaultStart={FLOW_PERIOD.start}
        defaultEnd={FLOW_PERIOD.end}
        scope={scope}
        onScopeChange={setScope}
        className="h-[78px]"
      />

      <DrillTabBar
        tabs={FLOW_TABS}
        active={activeTab}
        onChange={setActiveTab}
        arrows
        className="h-[60px]"
      />

      <DrillTable columns={columns} rows={rows} className="min-h-0 flex-1" />
    </DrillScreen>
  )
}
