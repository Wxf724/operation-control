import { useState } from 'react'

import { MonthPicker } from '@/components/cockpit-ui'

import { BOARD_ORG_OPTIONS, BOARD_PERIOD } from '../constants'

/** 顶栏左侧：管理单位下拉 */
export function BoardOrgSelect() {
  const [org, setOrg] = useState<string>(BOARD_ORG_OPTIONS[0])

  return (
    <label className="flex items-center gap-2">
      <span className="text-[15px] leading-none whitespace-nowrap text-(--foreground)">
        管理单位：
      </span>

      <span className="relative flex items-center">
        <select
          value={org}
          onChange={(e) => setOrg(e.target.value)}
          className="h-[36px] w-[230px] cursor-pointer appearance-none rounded-[4px] border border-(--border) bg-(--surface) pr-8 pl-3 text-[15px] leading-none text-(--foreground) outline-none focus:border-(--accent)"
        >
          {BOARD_ORG_OPTIONS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <i
          className="ri-arrow-down-s-line pointer-events-none absolute right-2.5 text-[18px] text-(--ck-title-sub)"
          aria-hidden
        />
      </span>
    </label>
  )
}

/**
 * 顶栏右侧：账期月份选择器。
 *
 * 点一下弹出面板，两个页签「年月」/「动态时间」，见 `_refs/live/51~52`。
 */
export function BoardPeriodBadge() {
  const [period, setPeriod] = useState<string>(BOARD_PERIOD)

  return <MonthPicker value={period} onChange={setPeriod} />
}
