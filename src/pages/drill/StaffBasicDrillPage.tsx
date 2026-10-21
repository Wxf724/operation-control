import { useState } from 'react'

import { DrillScreen, DrillTabBar, DrillTable } from './components'
import { StaffDrillHeader } from './components/StaffDrillHeader'
import { StaffMetricPanel } from './components/StaffMetricPanel'
import {
  STAFF_BASIC_ATTENDANCE,
  STAFF_BASIC_COLUMNS,
  STAFF_BASIC_DEFAULT_TAB,
  STAFF_BASIC_ROWS,
  STAFF_BASIC_SKILLS,
  STAFF_BASIC_TABS,
} from './staffBasicData'

/**
 * 钻取明细页 ·「基本情况」（路由 `/drill/staff-basic`）。
 *
 * 结构对齐 `_refs/live/54-钻取-基本情况.png`，配色换成浅蓝白：
 *   顶部条 → 员工出勤（4 指标）→ 员工技能情况（5 指标）→ 页签行（4 个）→ 明细表
 * 页签只负责切换高亮，表格固定展示「实际绩效合同得分-管理单位」这一张。
 */
export function StaffBasicDrillPage() {
  const [activeTab, setActiveTab] = useState(STAFF_BASIC_DEFAULT_TAB)

  return (
    <DrillScreen>
      <StaffDrillHeader title="基本情况" className="h-[58px]" />

      <StaffMetricPanel title="员工出勤" items={STAFF_BASIC_ATTENDANCE} className="h-[118px]" />

      <StaffMetricPanel title="员工技能情况" items={STAFF_BASIC_SKILLS} className="h-[118px]" />

      <DrillTabBar
        tabs={STAFF_BASIC_TABS}
        active={activeTab}
        onChange={setActiveTab}
        className="h-[60px]"
      />

      <DrillTable
        columns={STAFF_BASIC_COLUMNS}
        rows={STAFF_BASIC_ROWS}
        className="min-h-0 flex-1"
      />
    </DrillScreen>
  )
}
