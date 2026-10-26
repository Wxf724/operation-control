import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { PanelBox } from '@/components/cockpit-ui'

import {
  CENTER_METRIC_ROWS,
  CENTER_STATUS,
  CENTER_TABS,
  TEAM_LINK_COLUMNS,
  TEAM_LINK_HEADS,
} from '../constants'
import type { CenterStatus, TeamLinkRow } from '../types'

/** 左栏第二块：各中心 / 各驻企财务团队核心数据运行情况 */
export function CenterStatusPanel({ className = '' }: { className?: string }) {
  const [tab, setTab] = useState(0)

  return (
    <PanelBox
      title="各中心核心数据运行情况"
      className={`flex flex-col ${className}`}
      extra={
        <div className="flex items-center gap-1">
          {CENTER_TABS.map((label, i) => (
            <button
              key={label}
              type="button"
              onClick={() => setTab(i)}
              className={`cursor-pointer rounded-[2px] border px-2.5 py-[5px] text-[12px] leading-none transition-colors ${
                tab === i
                  ? 'border-(--ck-cyan) bg-(--accent-soft) text-(--ck-cyan)'
                  : 'border-(--border-light) text-(--text-secondary) hover:text-(--ck-title-sub)'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      }
    >
      {tab === 0 ? <CenterCardGrid /> : <TeamLinkBoard />}
    </PanelBox>
  )
}

/* ───────────── 页签一：各中心运行情况卡片 ───────────── */

function CenterCardGrid() {
  return (
    <div className="grid h-full grid-cols-5 gap-2.5 px-3 pt-2.5 pb-3">
      {CENTER_STATUS.map((item) => (
        <CenterCard key={item.name} data={item} />
      ))}
    </div>
  )
}

function CenterCard({ data }: { data: CenterStatus }) {
  const accent = data.danger ? 'var(--ck-red)' : 'var(--ck-cyan)'

  return (
    <div
      className="flex flex-col rounded-[3px] border px-2.5 py-2"
      style={{
        borderColor: data.danger ? 'var(--ck-red)' : 'var(--ck-panel-inner-border)',
        background: data.danger ? 'var(--danger-light)' : 'var(--ck-panel-inner)',
        boxShadow: data.danger ? 'inset 0 0 20px var(--danger-soft)' : undefined,
      }}
    >
      <div className="flex items-center justify-between gap-1 pb-1.5">
        <span className="text-[16px] leading-none font-semibold" style={{ color: accent }}>
          {data.name}
        </span>
        <span
          className="rounded-[2px] px-1.5 py-[3px] text-[12px] leading-none"
          style={{
            color: accent,
            border: `1px solid color-mix(in srgb, ${accent} 50%, transparent)`,
            background: `color-mix(in srgb, ${accent} 14%, transparent)`,
          }}
        >
          {data.status}
        </span>
      </div>

      <div
        className="mb-1.5 h-px w-full"
        style={{ background: `color-mix(in srgb, ${accent} 30%, transparent)` }}
      />

      <div className="flex flex-1 flex-col justify-between gap-0.5">
        {CENTER_METRIC_ROWS.map((row) => (
          <div key={row.key} className="flex items-baseline justify-between gap-1">
            <span
              className="text-[13.5px] leading-tight"
              style={{ color: data.danger ? 'var(--ck-red)' : 'var(--text-tertiary)' }}
            >
              {row.label}
            </span>
            <span
              className="text-[15px] leading-tight font-semibold tabular-nums"
              style={{ color: data.danger ? 'var(--ck-red)' : 'var(--ck-green)' }}
            >
              {data[row.key]}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ───────────── 页签二：驻企财务团队的企业链接列表 ───────────── */

/**
 * 两列并排的链接表，每列一张「驻企财务团队 / 页面链接」两列表格。
 * 链接列是蓝色带下划线的文本，点击走 `react-router` 跳企业数据看板，
 * 不走真实外链（外链地址只作展示）。
 */
function TeamLinkBoard() {
  const navigate = useNavigate()

  return (
    <div className="grid h-full grid-cols-2 gap-3 px-3 pt-2.5 pb-3">
      {TEAM_LINK_COLUMNS.map((rows, i) => (
        <TeamLinkTable key={i} rows={rows} onOpen={(row) => navigate(row.to)} />
      ))}
    </div>
  )
}

function TeamLinkTable({
  rows,
  onOpen,
}: {
  rows: TeamLinkRow[]
  onOpen: (row: TeamLinkRow) => void
}) {
  return (
    <table className="h-full w-full table-fixed border-collapse">
      <thead>
        <tr className="bg-(--ck-table-head)">
          {TEAM_LINK_HEADS.map((head) => (
            <th
              key={head}
              className="border border-(--border) px-2 py-[7px] text-center text-[13px] leading-none font-semibold text-(--ck-title-sub)"
            >
              {head}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {rows.map((row, i) => (
          <tr key={row.name} className={i % 2 ? 'bg-(--ck-table-row-alt)' : 'bg-(--ck-table-row)'}>
            <td className="border border-(--border) px-2 py-[6px] text-center text-[13px] leading-none text-(--foreground)">
              {row.name}
            </td>
            <td className="border border-(--border) px-2 py-[6px] text-center">
              <button
                type="button"
                onClick={() => onOpen(row)}
                title={`${row.name} · 企业数据看板`}
                className="block w-full cursor-pointer truncate text-[12px] leading-none text-(--ck-blue) underline underline-offset-2 transition-colors hover:text-(--ck-cyan)"
              >
                {row.url}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
