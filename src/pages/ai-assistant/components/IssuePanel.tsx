import { useMemo, useState } from 'react'

import { ISSUE_COLUMNS, ISSUE_ROWS, LEVEL_FILTER_OPTIONS } from '../constants'
import type { IssueRow, WarnLevel } from '../types'

import { AiPanel } from './AiPanel'

/** 预警等级 → 主题变量；红灯/黄灯/绿灯三色圆点 */
const LEVEL_VAR: Record<WarnLevel, string> = {
  red: '--ck-red',
  yellow: '--ck-yellow',
  green: '--ck-green',
}

const COLS = '0.9fr 1fr 1.6fr 28px'

/** 左栏：问题整体展示 */
export function IssuePanel({ className = '' }: { className?: string }) {
  const [level, setLevel] = useState<string>(LEVEL_FILTER_OPTIONS[0])
  const [activeNo, setActiveNo] = useState(ISSUE_ROWS[0]?.no ?? '')

  const rows = useMemo(
    () =>
      level === LEVEL_FILTER_OPTIONS[0]
        ? ISSUE_ROWS
        : ISSUE_ROWS.filter((row) => row.levelText === level),
    [level]
  )

  return (
    <AiPanel
      title="问题整体展示"
      subtitle={`所有问题（共${ISSUE_ROWS.length}条）`}
      extra={<LevelSelect value={level} onChange={setLevel} />}
      className={className}
    >
      <div className="flex min-h-0 flex-1 flex-col px-4 pt-3 pb-4">
        <div
          className="grid shrink-0 items-center gap-2 px-3 pb-3"
          style={{ gridTemplateColumns: COLS }}
        >
          {ISSUE_COLUMNS.map((col, i) => (
            <span
              key={col}
              className={`text-[15px] leading-none font-medium text-(--text-secondary) ${
                i === 2 ? 'text-center' : ''
              }`}
            >
              {col}
            </span>
          ))}
          <span />
        </div>

        <div className="ck-scroll flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto pr-1">
          {rows.map((row) => (
            <IssueRowItem
              key={row.no}
              row={row}
              active={row.no === activeNo}
              onSelect={() => setActiveNo(row.no)}
            />
          ))}
        </div>
      </div>
    </AiPanel>
  )
}

function LevelSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <label className="relative flex items-center">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="预警等级筛选"
        className="w-[132px] cursor-pointer appearance-none rounded-[8px] border border-(--border) bg-(--ck-panel-inner) py-[8px] pr-7 pl-3 text-[14px] leading-none text-(--ck-title-sub) outline-none focus:border-(--ck-cyan)"
      >
        {LEVEL_FILTER_OPTIONS.map((o) => (
          <option key={o} value={o} className="bg-(--surface) text-(--foreground)">
            {o}
          </option>
        ))}
      </select>
      <i
        className="ri-arrow-down-s-line pointer-events-none absolute right-2 text-[16px] text-(--ck-cyan)"
        aria-hidden
      />
    </label>
  )
}

function IssueRowItem({
  row,
  active,
  onSelect,
}: {
  row: IssueRow
  active: boolean
  onSelect: () => void
}) {
  const color = `var(${LEVEL_VAR[row.level]})`

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={active ? 'true' : undefined}
      className="grid shrink-0 cursor-pointer items-center gap-2 rounded-[8px] px-3 py-[17px] text-left transition-colors"
      style={{
        gridTemplateColumns: COLS,
        border: `1px solid ${active ? 'var(--ck-cyan)' : 'transparent'}`,
        background: active ? 'var(--accent-light)' : 'transparent',
      }}
    >
      <span className="text-[16px] leading-none text-(--foreground) tabular-nums">{row.no}</span>
      <span className="flex items-center gap-2 text-[16px] leading-none text-(--foreground)">
        <i className="h-[11px] w-[11px] shrink-0 rounded-full" style={{ background: color }} />
        {row.levelText}
      </span>
      <span className="text-center text-[16px] leading-none text-(--foreground)">{row.scene}</span>
      <i
        className={`ri-arrow-right-s-line justify-self-end text-[18px] leading-none text-(--ck-cyan) ${
          active ? '' : 'opacity-0'
        }`}
        aria-hidden
      />
    </button>
  )
}
