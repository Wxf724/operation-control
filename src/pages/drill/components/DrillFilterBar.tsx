import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { DRILL_BACK_PATH, ORG_SCOPES } from '../constants'
import type { OrgScope } from '../types'

/** 钻取页顶部筛选行 */
export interface DrillFilterBarProps {
  /** 页面名称，显示在右侧 */
  title: string
  /** 日期区间默认值（YYYY-MM-DD） */
  defaultStart: string
  defaultEnd: string
  /** 当前口径 */
  scope: OrgScope
  onScopeChange: (scope: OrgScope) => void
  className?: string
}

/**
 * 顶部筛选行：日期区间（起止两个日期框）+ 法人单位 / 管理单位 竖排二选一 + 返回入口。
 *
 * 口径切换做成上下两行的小开关，对齐参考图 `_refs/live/40~42`；
 * 日期用原生 `input[type=date]`，省掉一套自绘日历，且能真的选日期。
 */
export function DrillFilterBar({
  title,
  defaultStart,
  defaultEnd,
  scope,
  onScopeChange,
  className = '',
}: DrillFilterBarProps) {
  const navigate = useNavigate()
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

      <div className="ml-auto flex shrink-0 items-center gap-3">
        <span className="text-[19px] leading-none font-bold text-(--ck-title)">{title}</span>
        <button
          type="button"
          onClick={() => navigate(DRILL_BACK_PATH)}
          className="flex cursor-pointer items-center gap-1.5 rounded-[6px] px-3.5 py-[8px] text-[14px] leading-none font-medium text-white transition-opacity hover:opacity-85"
          style={{
            background: 'linear-gradient(90deg, var(--ck-btn-from), var(--ck-btn-to))',
            boxShadow: '0 3px 8px rgba(42, 102, 232, 0.28)',
          }}
        >
          <i className="ri-arrow-left-line text-[15px]" aria-hidden />
          返回作业管理平台
        </button>
      </div>
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
