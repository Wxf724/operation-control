import { useMemo, useState } from 'react'

import { DrillMetricRow, DrillPagedTable, DrillScreen, DrillTabBar } from './components'
import { StaffDrillHeader } from './components/StaffDrillHeader'
import { STAFF_ROSTER_ROWS } from './staffRoster'
import { STAFF_SERVICE_METRICS, STAFF_SERVICE_TABS } from './staffServiceData'
import type { DrillColumn } from './types'

/**
 * 钻取明细页 ·「服务情况」（路由 `/drill/staff-service`）。
 *
 * 结构对齐 `_refs/live/58-钻取-服务情况.png`，配色换成浅蓝白：
 *   指标卡行（用户投诉总量 / 服务协议 / 准确性 / 及时性 共 6 个指标）
 *   页签行（7 个页签，可点击切换选中态）
 *   明细表（序号 / 区域中心编号 / 区域中心名称 / 职工编号 / 职工姓名）
 *
 * 页签当前只做选中态切换，各页签共用同一张明细表（按需求先不拆分数据源）。
 */
export function StaffServiceDrillPage() {
  const [activeTab, setActiveTab] = useState(STAFF_SERVICE_TABS[0].key)

  const columns = useMemo<DrillColumn[]>(
    () => [
      { key: 'centerCode', title: '区域中心编号', width: '1fr', sortable: true },
      { key: 'centerName', title: '区域中心名称', width: '1fr' },
      { key: 'staffCode', title: '职工编号', width: '1fr', sortable: true },
      { key: 'staffName', title: '职工姓名', width: '1fr' },
    ],
    []
  )

  const rows = useMemo(
    () =>
      STAFF_ROSTER_ROWS.map((row) => [
        row.centerCode,
        row.centerName,
        row.staffCode,
        row.staffName,
      ]),
    []
  )

  return (
    <DrillScreen>
      <StaffDrillHeader title="服务情况" className="h-[58px]" />

      <DrillMetricRow items={STAFF_SERVICE_METRICS} />

      <DrillTabBar
        tabs={STAFF_SERVICE_TABS}
        active={activeTab}
        onChange={setActiveTab}
        className="h-[60px]"
      />

      <DrillPagedTable columns={columns} rows={rows} className="min-h-0 flex-1" />
    </DrillScreen>
  )
}
