import { useState } from 'react'

import { DrillFilterBar, DrillMetricRow, DrillScreen, DrillTabBar, DrillTable } from './components'
import { LOAD_PERIOD, LOAD_TABS } from './loadData'
import type { OrgScope } from './types'

/**
 * 钻取明细页 ·「作业分配负载情况」（路由 `/drill/job-load`）。
 *
 * 结构对齐 `_refs/live/42-钻取-作业分配负载情况.png`：
 *   筛选行 → 页签行（3 个页签，在指标卡**之上**）→ 指标卡行（4 张）→ 明细表
 * 三个页签各带一整套指标卡与表格列。
 */
export function JobLoadDrillPage() {
  const [scope, setScope] = useState<OrgScope>('管理单位')
  const [activeTab, setActiveTab] = useState(LOAD_TABS[0].key)

  const tab = LOAD_TABS.find((item) => item.key === activeTab) ?? LOAD_TABS[0]

  return (
    <DrillScreen>
      <DrillFilterBar
        title="作业分配负载情况"
        defaultStart={LOAD_PERIOD.start}
        defaultEnd={LOAD_PERIOD.end}
        scope={scope}
        onScopeChange={setScope}
        className="h-[78px]"
      />

      <DrillTabBar
        tabs={LOAD_TABS}
        active={activeTab}
        onChange={setActiveTab}
        className="h-[60px]"
      />

      <DrillMetricRow items={tab.metrics} />

      <DrillTable columns={tab.columns} rows={tab.rows} className="min-h-0 flex-1" />
    </DrillScreen>
  )
}
