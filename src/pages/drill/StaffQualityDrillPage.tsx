import { useState } from 'react'

import { DrillMetricRow, DrillScreen, DrillTabBar, DrillTable } from './components'
import { StaffDrillHeader } from './components/StaffDrillHeader'
import {
  STAFF_QUALITY_COLUMNS,
  STAFF_QUALITY_DEFAULT_TAB,
  STAFF_QUALITY_METRICS,
  STAFF_QUALITY_ROWS,
  STAFF_QUALITY_TABS,
} from './staffQualityData'

/**
 * 钻取明细页 ·「质量情况」（路由 `/drill/staff-quality`）。
 *
 * 结构对齐 `_refs/live/55-钻取-质量情况.png`，配色换成浅蓝白：
 *   顶部条 → 指标卡行（6 张）→ 页签行（4 个）→ 明细表（5 个区域中心）
 * 页签只负责切换高亮，表格固定展示「被质量稽核情况-区域中心」这一张。
 */
export function StaffQualityDrillPage() {
  const [activeTab, setActiveTab] = useState(STAFF_QUALITY_DEFAULT_TAB)

  return (
    <DrillScreen>
      <StaffDrillHeader title="质量情况" className="h-[58px]" />

      <DrillMetricRow items={STAFF_QUALITY_METRICS} />

      <DrillTabBar
        tabs={STAFF_QUALITY_TABS}
        active={activeTab}
        onChange={setActiveTab}
        className="h-[60px]"
      />

      <DrillTable
        columns={STAFF_QUALITY_COLUMNS}
        rows={STAFF_QUALITY_ROWS}
        className="min-h-0 flex-1"
      />
    </DrillScreen>
  )
}
