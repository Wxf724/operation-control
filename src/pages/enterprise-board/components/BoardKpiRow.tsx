import { BOARD_KPIS } from '../constants'
import type { BoardKpi } from '../types'

/**
 * 顶部 8 张 KPI 卡。
 *
 * 每张卡上半是「标签 + 大数字 + 单位」，下半是「同期 / 同比」两列对照，
 * 同比按方向着色：上行红（`--ck-red`）、下行绿（`--ck-green`）。
 */
export function BoardKpiRow({ className = '' }: { className?: string }) {
  return (
    <div className={`grid grid-cols-8 gap-2.5 ${className}`}>
      {BOARD_KPIS.map((kpi) => (
        <BoardKpiCard key={kpi.key} kpi={kpi} />
      ))}
    </div>
  )
}

function BoardKpiCard({ kpi }: { kpi: BoardKpi }) {
  const up = kpi.direction === 'up'
  const deltaColor = up ? 'var(--ck-red)' : 'var(--ck-green)'

  return (
    <div
      className="flex min-w-0 flex-col justify-between rounded-(--ck-panel-radius) border px-3 py-2.5"
      style={{
        borderColor: 'var(--ck-card-border)',
        background: 'linear-gradient(180deg, var(--ck-card-from) 0%, var(--ck-card-to) 100%)',
        boxShadow: 'var(--ck-card-shadow)',
      }}
    >
      <div className="flex items-start justify-between gap-1.5">
        <div className="flex min-w-0 flex-col gap-2">
          <span className="truncate text-[14px] leading-none font-semibold text-(--ck-title)">
            {kpi.label}
          </span>
          <span className="flex items-baseline gap-1">
            <span className="ck-glow-num text-[25px] leading-none font-bold text-(--ck-title-sub)">
              {kpi.value}
            </span>
            {kpi.unit ? (
              <span className="text-[12px] leading-none text-(--text-tertiary)">{kpi.unit}</span>
            ) : null}
          </span>
        </div>

        <span
          className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[8px] text-[15px] text-(--ck-cyan)"
          style={{
            background: 'linear-gradient(180deg, var(--ck-icon-from), var(--ck-icon-to))',
            border: '1px solid var(--ck-card-border)',
          }}
        >
          <i className={kpi.icon} aria-hidden />
        </span>
      </div>

      <div className="mt-2 h-px w-full bg-(--border-light)" />

      <div className="mt-1.5 grid grid-cols-2 gap-1">
        <div className="flex min-w-0 flex-col gap-1.5">
          <span className="text-[11px] leading-none text-(--text-tertiary)">同期</span>
          <span className="flex items-baseline gap-[3px]">
            <span className="text-[14px] leading-none font-semibold text-(--foreground) tabular-nums">
              {kpi.priorValue}
            </span>
            {kpi.priorUnit ? (
              <span className="text-[11px] leading-none text-(--text-tertiary)">
                {kpi.priorUnit}
              </span>
            ) : null}
          </span>
        </div>

        <div className="flex min-w-0 flex-col gap-1.5">
          <span className="text-[11px] leading-none text-(--text-tertiary)">同比</span>
          <span
            className="flex items-center gap-[2px] text-[14px] leading-none font-semibold tabular-nums"
            style={{ color: deltaColor }}
          >
            <i
              className={`text-[12px] ${up ? 'ri-arrow-up-line' : 'ri-arrow-down-line'}`}
              aria-hidden
            />
            {kpi.yoy}
          </span>
        </div>
      </div>
    </div>
  )
}
