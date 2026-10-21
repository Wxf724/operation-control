import { useMemo, useState } from 'react'

import { DrillMetricRow, DrillPagedTable, DrillScreen, DrillTabBar } from './components'
import { StaffDrillHeader } from './components/StaffDrillHeader'
import { STAFF_EFFICIENCY_METRICS, STAFF_EFFICIENCY_TABS } from './staffEfficiencyData'
import { STAFF_ROSTER_ROWS } from './staffRoster'
import type { DrillColumn } from './types'

/**
 * 钻取明细页 ·「效率情况」（路由 `/drill/staff-efficiency`）。
 *
 * 结构对齐 `_refs/live/57-钻取-效率情况.png`，配色换成浅蓝白：
 *   指标卡行（单据处理平均时长 / 加急 / 异常总量 / 平均单据产能 / 平均任务处理量）
 *   页签行（5 个页签，可点击切换选中态）
 *   明细表（表头蓝底 + 表体滚动 + 共 N 条数据 + 右下角分页器）
 *
 * 页签当前只做选中态切换，各页签共用同一张明细表（按需求先不拆分数据源）。
 */
export function StaffEfficiencyDrillPage() {
  const [activeTab, setActiveTab] = useState(STAFF_EFFICIENCY_TABS[0].key)

  const columns = useMemo<DrillColumn[]>(
    () => [
      { key: 'centerCode', title: '区域中心编号', width: '280px', sortable: true },
      { key: 'centerName', title: '区域中心', width: '180px' },
      { key: 'postCode', title: '岗位编号', width: '300px', sortable: true },
      { key: 'postName', title: '岗位名称', width: '1fr' },
      { key: 'staffCode', title: '职工编号', width: '240px' },
      { key: 'staffName', title: '职工姓名', width: '200px' },
      { key: 'duration', title: '单据处理平均时长（天）', width: '340px' },
    ],
    []
  )

  const rows = useMemo(
    () =>
      STAFF_ROSTER_ROWS.map((row) => [
        row.centerCode,
        row.centerName,
        row.postCode,
        row.postName,
        row.staffCode,
        row.staffName,
        row.duration,
      ]),
    []
  )

  return (
    <DrillScreen>
      <StaffDrillHeader title="效率情况" className="h-[58px]" />

      <DrillMetricRow items={STAFF_EFFICIENCY_METRICS} className="h-[92px]" />

      <DrillTabBar
        tabs={STAFF_EFFICIENCY_TABS}
        active={activeTab}
        onChange={setActiveTab}
        className="h-[60px]"
      />

      <DrillPagedTable columns={columns} rows={rows} className="min-h-0 flex-1" />
    </DrillScreen>
  )
}
