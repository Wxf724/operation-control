import { useState } from 'react'
import type { MouseEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import {
  DrillFilterBar,
  DrillMetricRow,
  DrillRowMenu,
  DrillScreen,
  DrillTabBar,
  DrillTable,
} from './components'
import type { DrillRowMenuOption } from './components/DrillRowMenu'
import {
  QUALITY_APPEAL_COLUMNS,
  QUALITY_APPEAL_METRICS,
  QUALITY_APPEAL_ROWS,
  QUALITY_APPEAL_TABS,
} from './qualityAppealData'
import {
  QUALITY_APPEAL_DETAIL_PATH,
  QUALITY_DISPUTE_DRILL_PATH,
  QUALITY_PERIOD,
} from './qualityConstants'

/** 「跳转列」菜单的两条去向 */
const ROW_MENU_OPTIONS: readonly DrillRowMenuOption[] = [
  { key: 'appeal', label: '申诉明细', icon: 'ri-file-text-line' },
  { key: 'dispute', label: '争议明细', icon: 'ri-file-shield-2-line' },
]

/** 弹出菜单的位置与所点的行 */
interface RowMenuState {
  x: number
  y: number
  name: string
}

/**
 * 钻取明细页 ·「申诉与争议管理情况」（路由 `/drill/quality-appeal`，对应参考图 7／8／9）。
 *
 * 结构：日期区间 → 8 张指标卡（两行各 4 张）→ 两个页签（区域中心／个人）→ 明细表。
 * 点任意一行在鼠标处弹出「跳转列」菜单（参考图 9），可选「申诉明细」或「争议明细」，
 * 分别跳到 `/drill/quality-appeal-detail` 与 `/drill/quality-dispute`。
 */
export function QualityAppealDrillPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [activeTab, setActiveTab] = useState<string>(() => {
    const wanted = searchParams.get('tab')
    return QUALITY_APPEAL_TABS.some((tab) => tab.key === wanted)
      ? (wanted as string)
      : QUALITY_APPEAL_TABS[0].key
  })

  const [menu, setMenu] = useState<RowMenuState | null>(null)

  const tab = QUALITY_APPEAL_TABS.find((item) => item.key === activeTab) ?? QUALITY_APPEAL_TABS[0]
  const columns = QUALITY_APPEAL_COLUMNS[activeTab] ?? QUALITY_APPEAL_COLUMNS.region
  const rows = QUALITY_APPEAL_ROWS[activeTab] ?? QUALITY_APPEAL_ROWS.region

  const openMenu = (
    row: readonly string[],
    _index: number,
    event: MouseEvent<HTMLButtonElement>
  ) => {
    setMenu({ x: event.clientX, y: event.clientY, name: row[1] })
  }

  const pickMenu = (key: string) => {
    if (!menu) return
    const target = key === 'dispute' ? QUALITY_DISPUTE_DRILL_PATH : QUALITY_APPEAL_DETAIL_PATH
    const query = `from=appeal&source=${encodeURIComponent(tab.label)}&name=${encodeURIComponent(menu.name)}`
    setMenu(null)
    navigate(`${target}?${query}`)
  }

  return (
    <DrillScreen>
      <DrillFilterBar
        title="申诉与争议管理情况"
        defaultStart={QUALITY_PERIOD.start}
        defaultEnd={QUALITY_PERIOD.end}
        className="h-[74px]"
      />

      <DrillMetricRow rows={QUALITY_APPEAL_METRICS} />

      <DrillTabBar
        tabs={QUALITY_APPEAL_TABS}
        active={activeTab}
        onChange={setActiveTab}
        className="h-[62px]"
      />

      <DrillTable
        columns={columns}
        rows={rows}
        dense
        onRowClick={openMenu}
        className="min-h-0 flex-1"
      />

      {menu ? (
        <DrillRowMenu
          x={menu.x}
          y={menu.y}
          options={ROW_MENU_OPTIONS}
          onPick={pickMenu}
          onClose={() => setMenu(null)}
        />
      ) : null}
    </DrillScreen>
  )
}
