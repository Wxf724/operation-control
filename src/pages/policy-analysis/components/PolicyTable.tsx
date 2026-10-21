import { useState } from 'react'

import { POLICY_COLUMNS, POLICY_ROWS, POLICY_TABS } from '../constants'
import { RowButton, Tag, TabButton } from './common'

/**
 * 政策列表：页签 + 搜索 + 明细表。
 * 目标稿（画布 px）：页签 31 → 间距 10 → 表头 47 → 间距 7 → 12 行占满 546。
 */
export function PolicyTable({ className = '' }: { className?: string }) {
  const [tab, setTab] = useState(0)
  const [keyword, setKeyword] = useState('')

  const rows = keyword.trim()
    ? POLICY_ROWS.filter((r) => r.name.includes(keyword.trim()) || r.org.includes(keyword.trim()))
    : POLICY_ROWS

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex h-[31px] shrink-0 items-center gap-[10px]">
        <div className="flex min-w-0 flex-1 items-center gap-[10px]">
          {POLICY_TABS.map((label, i) => (
            <TabButton key={label} label={label} active={tab === i} onClick={() => setTab(i)} />
          ))}
        </div>

        <label className="relative flex h-[31px] w-[184px] shrink-0 items-center">
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="请输入政策关键词"
            aria-label="政策关键词"
            className="h-full w-full rounded-[4px] border border-(--border) bg-(--ck-panel-inner) px-[10px] pr-[28px] text-[15px] leading-none text-(--foreground) outline-none placeholder:text-(--text-tertiary) focus:border-(--ck-cyan)"
          />
          <i
            className="ri-search-line pointer-events-none absolute right-[9px] text-[16px] text-(--ck-cyan)"
            aria-hidden
          />
        </label>
      </div>

      <div
        className="mt-[10px] grid h-[47px] shrink-0 items-center gap-[8px] rounded-t-[4px] px-[12px]"
        style={{ gridTemplateColumns: COLS, background: 'var(--ck-table-head)' }}
      >
        {POLICY_COLUMNS.map((col) => (
          <span key={col} className="text-[15px] leading-none font-semibold text-(--ck-title-sub)">
            {col}
          </span>
        ))}
      </div>

      <div className="mt-[7px] flex min-h-0 flex-1 flex-col gap-[6px] overflow-hidden">
        {rows.map((row, i) => (
          <div
            key={`${row.name}-${i}`}
            className="grid min-h-0 flex-1 items-center gap-[8px] rounded-[2px] px-[12px]"
            style={{
              gridTemplateColumns: COLS,
              background: i % 2 === 0 ? 'var(--ck-table-row)' : 'var(--ck-table-row-alt)',
            }}
          >
            <span className="text-[15px] leading-none text-(--text-secondary) tabular-nums">
              {row.publishedAt}
            </span>
            <span className="truncate text-[15px] leading-none text-(--foreground)" title={row.name}>
              {row.name}
            </span>
            <span className="truncate text-[15px] leading-none text-(--text-secondary)">
              {row.org}
            </span>
            <span className="truncate text-[15px] leading-none text-(--text-secondary)">
              {row.category}
            </span>
            <Tag tone={row.statusTone} variant="plain">
              {row.status}
            </Tag>
            <span className="flex items-center gap-[6px]">
              <RowButton label="查看" tone="var(--ck-blue)" />
              <RowButton label="收藏" tone="var(--ck-orange)" />
            </span>
          </div>
        ))}

        {rows.length === 0 ? (
          <div className="flex min-h-0 flex-1 items-center justify-center text-[15px] text-(--text-tertiary)">
            没有匹配的政策
          </div>
        ) : null}
      </div>
    </div>
  )
}

const COLS = '0.9fr 2.62fr 1.08fr 0.7fr 0.7fr 1.05fr'
