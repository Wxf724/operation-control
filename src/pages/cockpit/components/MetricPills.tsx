import type { CSSProperties } from 'react'

import type { MetricPill } from '../types'

export interface MetricPillsProps {
  /** 当前模块对应的指标，数量随模块变化（6～7 个） */
  items: MetricPill[]
  className?: string
  style?: CSSProperties
}

/** 地图下方的核心指标药丸，内容随选中模块切换 */
export function MetricPills({ items, className = '', style }: MetricPillsProps) {
  return (
    <div className={`grid grid-flow-col auto-cols-fr gap-3 ${className}`} style={style}>
      {items.map((pill) => (
        <PillItem key={pill.key} pill={pill} />
      ))}
    </div>
  )
}

function PillItem({ pill }: { pill: MetricPill }) {
  const color = `var(${TONE_VAR[pill.tone ?? 'cyan'] ?? '--ck-cyan'})`

  return (
    <div
      className="relative flex items-center gap-2.5 rounded-[6px] border px-3 py-2"
      style={{
        borderColor: 'var(--ck-card-border)',
        background: 'linear-gradient(180deg, var(--ck-card-from) 0%, var(--ck-card-to) 100%)',
        boxShadow: 'var(--ck-card-shadow)',
      }}
    >
      <span
        className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[5px] text-[20px] text-(--ck-cyan)"
        style={{
          background: 'linear-gradient(180deg, var(--ck-icon-from), var(--ck-icon-to))',
          boxShadow: 'var(--ck-icon-glow)',
        }}
      >
        <i className={pill.icon} aria-hidden />
      </span>

      <div className="flex min-w-0 flex-col gap-1.5">
        <span className="truncate text-[14px] leading-none text-(--text-secondary)">
          {pill.label}
        </span>
        <span className="flex items-baseline gap-0.5">
          <span className="ck-glow-num text-[21px] leading-none font-bold" style={{ color }}>
            {pill.value}
          </span>
          {pill.unit ? (
            <span className="text-[12px] leading-none text-(--text-tertiary)">{pill.unit}</span>
          ) : null}
        </span>
      </div>
    </div>
  )
}

const TONE_VAR: Record<string, string> = {
  cyan: '--ck-cyan',
  blue: '--ck-blue',
  green: '--ck-green',
  orange: '--ck-orange',
  red: '--ck-red',
  purple: '--ck-purple',
  muted: '--text-tertiary',
}
