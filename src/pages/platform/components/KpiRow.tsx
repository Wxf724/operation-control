import type { MetricPill } from '@/pages/cockpit/types'

import { DEFAULT_DELTA } from '../constants'

const TONE_VAR: Record<string, string> = {
  cyan: '--ck-cyan',
  blue: '--ck-blue',
  green: '--ck-green',
  orange: '--ck-orange',
  red: '--ck-red',
  purple: '--ck-purple',
  muted: '--text-tertiary',
}

/** 平台页顶部 KPI 卡条（5～7 张，随模块变化），与首页底部指标条同源 */
export function KpiRow({ items, className = '' }: { items: MetricPill[]; className?: string }) {
  return (
    <div className={`grid grid-flow-col auto-cols-fr gap-3 ${className}`}>
      {items.map((kpi) => (
        <KpiCard key={kpi.key} kpi={kpi} />
      ))}
    </div>
  )
}

function KpiCard({ kpi }: { kpi: MetricPill }) {
  const color = `var(${TONE_VAR[kpi.tone ?? 'cyan'] ?? '--ck-cyan'})`
  const delta = kpi.delta ?? DEFAULT_DELTA

  return (
    <div
      className="relative flex items-center gap-3 rounded-(--ck-panel-radius) border px-3.5 py-2.5"
      style={{
        borderColor: 'var(--ck-card-border)',
        background: 'linear-gradient(180deg, var(--ck-card-from) 0%, var(--ck-card-to) 100%)',
        boxShadow: 'var(--ck-card-shadow)',
      }}
    >
      <span
        className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[10px] text-[21px]"
        style={{
          color,
          background: 'linear-gradient(180deg, var(--ck-icon-from), var(--ck-icon-to))',
          border: '1px solid var(--ck-card-border)',
        }}
      >
        <i className={kpi.icon} aria-hidden />
      </span>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <span className="truncate text-[13px] leading-none text-(--text-secondary)">
          {kpi.label}
        </span>

        <span className="flex items-baseline gap-1.5">
          <span
            className="ck-glow-num text-[24px] leading-none font-bold"
            style={{ color: 'var(--ck-kpi-text, var(--ck-title))' }}
          >
            {kpi.value}
          </span>
          {kpi.unit ? (
            <span className="text-[12px] leading-none text-(--text-tertiary)">{kpi.unit}</span>
          ) : null}
          <span
            className="ml-auto flex items-center gap-1 rounded-full px-1.5 py-[3px] text-[11px] leading-none whitespace-nowrap"
            style={{
              color: 'var(--ck-green)',
              background: 'color-mix(in srgb, var(--ck-green) 12%, transparent)',
            }}
          >
            同比 {delta}
            <i className="ri-arrow-up-line text-[10px]" aria-hidden />
          </span>
        </span>
      </div>

      {/* 右上角口径说明，如「截至当日」 */}
      {kpi.asOf ? (
        <span className="absolute top-1.5 right-2 text-[11px] leading-none text-(--text-tertiary)">
          {kpi.asOf}
        </span>
      ) : null}
    </div>
  )
}
