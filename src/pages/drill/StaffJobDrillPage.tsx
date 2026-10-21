import { useState } from 'react'

import { SectionTitle } from '@/components/cockpit-ui'

import { DrillMetricRow, DrillScreen, DrillTabBar, DrillTable } from './components'
import { StaffDrillHeader } from './components/StaffDrillHeader'
import {
  STAFF_JOB_COLUMNS,
  STAFF_JOB_METRICS,
  STAFF_JOB_ROWS,
  STAFF_JOB_SCENE_DEFAULT_TAB,
  STAFF_JOB_SCENE_TABS,
  STAFF_JOB_TABLE_TITLE,
  STAFF_JOB_TYPE_TABS,
} from './staffJobData'

/**
 * 钻取明细页 ·「作业情况」（路由 `/drill/staff-job`）。
 *
 * 结构对齐 `_refs/live/56-钻取-作业情况.png`，配色换成浅蓝白：
 *   顶部条 → 场景页签行（3 个，在指标卡**之上**）→ 指标卡行（6 张）
 *   → 工作类型页签行（4 个）→ 小标题「专项任务-在岗人员」→ 明细表（167 行）
 * 两行页签都只负责切换高亮，表格固定展示「专项任务-在岗人员」这一张。
 */
export function StaffJobDrillPage() {
  const [sceneTab, setSceneTab] = useState(STAFF_JOB_SCENE_DEFAULT_TAB)
  const [typeTab, setTypeTab] = useState(STAFF_JOB_TYPE_TABS[0].key)

  return (
    <DrillScreen>
      <StaffDrillHeader title="作业情况" className="h-[58px]" />

      <DrillTabBar
        tabs={STAFF_JOB_SCENE_TABS}
        active={sceneTab}
        onChange={setSceneTab}
        className="h-[56px]"
      />

      <DrillMetricRow items={STAFF_JOB_METRICS} className="h-[92px]" />

      <DrillTabBar
        tabs={STAFF_JOB_TYPE_TABS}
        active={typeTab}
        onChange={setTypeTab}
        className="h-[56px]"
      />

      <section className="flex min-h-0 flex-1 flex-col gap-2">
        <SectionTitle className="shrink-0 px-1">{STAFF_JOB_TABLE_TITLE}</SectionTitle>
        <DrillTable columns={STAFF_JOB_COLUMNS} rows={STAFF_JOB_ROWS} className="min-h-0 flex-1" />
      </section>
    </DrillScreen>
  )
}
