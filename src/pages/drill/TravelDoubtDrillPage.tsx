import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { DrillFilterBar, DrillScreen, DrillTabBar, DrillTable } from './components'
import { TRAVEL_DOC_DRILL_PATH, TRAVEL_DOUBT_TABS, TRAVEL_PERIOD } from './travelConstants'
import {
  TRAVEL_DOUBT_ENTERPRISE_COLUMNS,
  TRAVEL_DOUBT_ENTERPRISE_ROWS,
  TRAVEL_DOUBT_PERSON_COLUMNS,
  TRAVEL_DOUBT_PERSON_ROWS,
} from './travelDoubtData'
import type { OrgScope } from './types'

/**
 * 钻取明细页 ·「商旅疑点订单情况」（路由 `/drill/travel-doubt`，对应参考图 6／7）。
 *
 * 结构：日期区间 + 口径开关 → 两个页签（企业／个人）→ 疑点订单表（各 24 行）。
 * 任意一行点进「单据明细」页，并把点到的企业／员工写进查询串。
 */
export function TravelDoubtDrillPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [scope, setScope] = useState<OrgScope>('法人单位')

  const [activeTab, setActiveTab] = useState<string>(() => {
    const wanted = searchParams.get('tab')
    return TRAVEL_DOUBT_TABS.some((tab) => tab.key === wanted)
      ? (wanted as string)
      : TRAVEL_DOUBT_TABS[0].key
  })

  const isPerson = activeTab === 'person'
  const columns = isPerson ? TRAVEL_DOUBT_PERSON_COLUMNS : TRAVEL_DOUBT_ENTERPRISE_COLUMNS
  const rows = isPerson ? TRAVEL_DOUBT_PERSON_ROWS : TRAVEL_DOUBT_ENTERPRISE_ROWS
  const tab = TRAVEL_DOUBT_TABS.find((item) => item.key === activeTab) ?? TRAVEL_DOUBT_TABS[0]

  return (
    <DrillScreen>
      <DrillFilterBar
        title="商旅疑点订单情况"
        defaultStart={TRAVEL_PERIOD.start}
        defaultEnd={TRAVEL_PERIOD.end}
        scope={scope}
        onScopeChange={setScope}
        className="h-[70px]"
      />

      <DrillTabBar
        tabs={TRAVEL_DOUBT_TABS}
        active={activeTab}
        onChange={setActiveTab}
        className="h-[58px]"
      />

      <DrillTable
        columns={columns}
        rows={rows}
        dense
        onRowClick={(row) =>
          navigate(
            `${TRAVEL_DOC_DRILL_PATH}?from=doubt&source=${encodeURIComponent(tab.label)}&org=${encodeURIComponent(row[1])}`
          )
        }
        className="min-h-0 flex-1"
      />
    </DrillScreen>
  )
}
