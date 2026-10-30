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
  ARCHIVE_DOC_DRILL_PATH,
  ARCHIVE_MATCH_DRILL_PATH,
  ARCHIVE_PERIOD,
  ARCHIVE_PRINT_DRILL_PATH,
  ARCHIVE_WORK_TABS,
} from './archiveConstants'
import { ARCHIVE_WORK_COLUMNS, ARCHIVE_WORK_METRICS, getArchiveWorkRows } from './archiveWorkData'
import type { OrgScope } from './types'

/** 「跳转列」菜单的三条去向（参考图 7） */
const ROW_MENU_OPTIONS: readonly DrillRowMenuOption[] = [
  { key: 'doc', label: '单据明细', icon: 'ri-file-list-3-line' },
  { key: 'print', label: '待打印单据明细', icon: 'ri-printer-line' },
  { key: 'match', label: '待匹配比对单据明细', icon: 'ri-list-check-2' },
]

interface RowMenuState {
  x: number
  y: number
  name: string
}

/**
 * 钻取明细页 ·「档案作业情况」（路由 `/drill/archive-work`，对应参考图 3～6）。
 *
 * 结构：日期区间 + 口径开关 → 11 张指标卡（4 + 4 + 3 三行）→ 四个页签
 *      （区域中心／企业／个人／小组）→ 15 列明细表（33 行）。
 * 点任意一行在鼠标处弹出「跳转列」菜单（参考图 7），可选单据明细／待打印单据明细／待匹配比对单据明细。
 */
export function ArchiveWorkDrillPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [scope, setScope] = useState<OrgScope>('法人单位')

  const [activeTab, setActiveTab] = useState<string>(() => {
    const wanted = searchParams.get('tab')
    return ARCHIVE_WORK_TABS.some((tab) => tab.key === wanted)
      ? (wanted as string)
      : ARCHIVE_WORK_TABS[0].key
  })

  const [menu, setMenu] = useState<RowMenuState | null>(null)

  const tab = ARCHIVE_WORK_TABS.find((item) => item.key === activeTab) ?? ARCHIVE_WORK_TABS[0]
  const columns = ARCHIVE_WORK_COLUMNS[activeTab] ?? ARCHIVE_WORK_COLUMNS.region
  const rows = getArchiveWorkRows(activeTab)

  const openMenu = (
    row: readonly string[],
    _index: number,
    event: MouseEvent<HTMLButtonElement>
  ) => {
    const name = activeTab === 'region' ? row[0] : row[1]
    setMenu({ x: event.clientX, y: event.clientY, name })
  }

  const pickMenu = (key: string) => {
    if (!menu) return
    const target =
      key === 'print'
        ? ARCHIVE_PRINT_DRILL_PATH
        : key === 'match'
          ? ARCHIVE_MATCH_DRILL_PATH
          : ARCHIVE_DOC_DRILL_PATH
    const query = `from=work&source=${encodeURIComponent(tab.label)}&dim=${encodeURIComponent(menu.name)}`
    setMenu(null)
    navigate(`${target}?${query}`)
  }

  return (
    <DrillScreen>
      <DrillFilterBar
        title="档案作业情况"
        defaultStart={ARCHIVE_PERIOD.start}
        defaultEnd={ARCHIVE_PERIOD.end}
        scope={scope}
        onScopeChange={setScope}
        className="h-[70px]"
      />

      <DrillMetricRow rows={ARCHIVE_WORK_METRICS} />

      <DrillTabBar
        tabs={ARCHIVE_WORK_TABS}
        active={activeTab}
        onChange={setActiveTab}
        className="h-[58px]"
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
