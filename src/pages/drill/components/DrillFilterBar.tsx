import { useState } from 'react'

import { ORG_SCOPES } from '../constants'
import type { OrgScope } from '../types'

/** 钻取页顶部筛选行 */
export interface DrillFilterBarProps {
  /** 页面名称，显示在右侧 */
  title: string
  /** 日期区间默认值（YYYY-MM-DD） */
  defaultStart: string
  defaultEnd: string
  /** 当前口径；不传就不显示「法人单位／管理单位」开关（RPA / 规则 / 质量的钻取页没有这一项） */
  scope?: OrgScope
  onScopeChange?: (scope: OrgScope) => void
  className?: string
}

/**
 * 顶部筛选行：日期区间（起止两个日期框）+ 可选的口径开关 + 页面名称。
 *
 * 口径切换做成上下两行的小开关，对齐参考图 `_refs/live/40~42`；
 * 日期用原生 `input[type=date]`，省掉一套自绘日历，且能真的选日期。
 *
 * 钻取页是独立页面，不放任何返回入口，往回走用浏览器后退。
 */
export function DrillFilterBar({
  title,
  defaultStart,
  defaultEnd,
  scope,
  onScopeChange,
  className = '',
}: DrillFilterBarProps) {
  const [start, setStart] = useState(defaultStart)
  const [end, setEnd] = useState(defaultEnd)

  return (
    <div
      className={`ck-panel flex shrink-0 items-center gap-3 rounded-(--ck-panel-radius) px-5 ${className}`}
    >
      <span className="shrink-0 text-[17px] leading-none font-semibold text-(--ck-title)">
        日期区间：
      </span>

      <DateField value={start} onChange={setStart} label="开始日期" />
      <span className="shrink-0 text-[15px] leading-none text-(--text-tertiary)">-</span>
      <DateField value={end} onChange={setEnd} label="结束日期" />

      {scope && onScopeChange ? (
        <div
          role="radiogroup"
          aria-label="统计口径"
          className="ml-7 flex w-[128px] shrink-0 flex-col overflow-hidden rounded-[6px] border border-(--border) bg-(--surface)"
        >
          {ORG_SCOPES.map((item) => {
            const on = item === scope
            return (
              <button
                key={item}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => onScopeChange(item)}
                className={`cursor-pointer px-3 py-[7px] text-[14px] leading-none transition-colors ${
                  on
                    ? 'bg-(--accent-light) font-semibold text-(--ck-title-sub)'
                    : 'text-(--text-secondary) hover:bg-(--bg-hover)'
                }`}
              >
                {item}
              </button>
            )
          })}
        </div>
      ) : null}

      <span className="ml-auto shrink-0 text-[19px] leading-none font-bold text-(--ck-title)">
        {title}
      </span>
    </div>
  )
}

function DateField({
  value,
  onChange,
  label,
}: {
  value: string
  onChange: (next: string) => void
  label: string
}) {
  return (
    <span className="flex h-[36px] w-[230px] shrink-0 items-center gap-2 rounded-[6px] border border-(--border) bg-(--surface) px-2.5">
      <i className="ri-time-line shrink-0 text-[16px] text-(--ck-cyan)" aria-hidden />
      <input
        type="date"
        value={value}
        aria-label={label}
        onChange={(e) => onChange(e.target.value)}
        className="min-w-0 flex-1 cursor-pointer bg-transparent text-[15px] leading-none text-(--ck-title) tabular-nums outline-none"
      />
    </span>
  )
}
