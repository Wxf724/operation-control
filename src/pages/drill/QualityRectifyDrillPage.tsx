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
  QualityIssueDonut,
} from './components'
import type { DrillRowMenuOption } from './components/DrillRowMenu'
import {
  QUALITY_RECTIFY_COLUMNS,
  QUALITY_RECTIFY_ISSUES,
  QUALITY_RECTIFY_METRICS,
  QUALITY_RECTIFY_TABS,
  getRectifyRows,
} from './qualityRectifyData'
import {
  QUALITY_PERIOD,
  QUALITY_RECTIFY_DOC_PATH,
  QUALITY_UNRECTIFIED_PATH,
} from './qualityConstants'

/** 「跳转列」菜单的两条去向 */
const ROW_MENU_OPTIONS: readonly DrillRowMenuOption[] = [
  { key: 'doc', label: '单据明细', icon: 'ri-file-list-3-line' },
  { key: 'unrectified', label: '未整改明细', icon: 'ri-error-warning-line' },
]

/** 弹出菜单的位置与所点的行 */
interface RowMenuState {
  x: number
  y: number
  name: string
}

/**
 * 钻取明细页 ·「整改与规则转化情况」（路由 `/drill/quality-rectify`，对应参考图 1～5）。
 *
 * 结构：日期区间 → 指标条（4 张 + 2 张两行）→ 四个页签（单位／区域中心／个人／小组）
 *      → 左「问题构成」环形图 + 右整改明细表（14 行）。
 * 点任意一行在鼠标处弹出「跳转列」菜单（参考图 5），可选「单据明细」或「未整改明细」。
 */
export function QualityRectifyDrillPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [activeTab, setActiveTab] = useState<string>(() => {
    const wanted = searchParams.get('tab')
    return QUALITY_RECTIFY_TABS.some((tab) => tab.key === wanted)
      ? (wanted as string)
      : QUALITY_RECTIFY_TABS[0].key
  })

  const [menu, setMenu] = useState<RowMenuState | null>(null)

  const tab = QUALITY_RECTIFY_TABS.find((item) => item.key === activeTab) ?? QUALITY_RECTIFY_TABS[0]
  const columns = QUALITY_RECTIFY_COLUMNS[activeTab] ?? QUALITY_RECTIFY_COLUMNS.unit
  const rows = getRectifyRows(activeTab)
  const segments = QUALITY_RECTIFY_ISSUES[activeTab] ?? QUALITY_RECTIFY_ISSUES.unit

  const openMenu = (
    row: readonly string[],
    _index: number,
    event: MouseEvent<HTMLButtonElement>
  ) => {
    setMenu({ x: event.clientX, y: event.clientY, name: row[1] })
  }

  const pickMenu = (key: string) => {
    if (!menu) return
    const target = key === 'unrectified' ? QUALITY_UNRECTIFIED_PATH : QUALITY_RECTIFY_DOC_PATH
    const query = `from=rectify&source=${encodeURIComponent(tab.label)}&name=${encodeURIComponent(menu.name)}`
    setMenu(null)
    navigate(`${target}?${query}`)
  }

  return (
    <DrillScreen>
      <DrillFilterBar
        title="整改与规则转化情况"
        defaultStart={QUALITY_PERIOD.start}
        defaultEnd={QUALITY_PERIOD.end}
        className="h-[74px]"
      />

      <DrillMetricRow rows={QUALITY_RECTIFY_METRICS} />

      <DrillTabBar
        tabs={QUALITY_RECTIFY_TABS}
        active={activeTab}
        onChange={setActiveTab}
        className="h-[62px]"
      />

      <div className="flex min-h-0 flex-1 gap-3">
        <QualityIssueDonut segments={segments} className="w-[520px] shrink-0" />

        <DrillTable
          columns={columns}
          rows={rows}
          dense
          onRowClick={openMenu}
          className="min-h-0 flex-1"
        />
      </div>

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
