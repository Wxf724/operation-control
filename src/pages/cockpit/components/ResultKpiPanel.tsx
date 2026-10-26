import { PanelBox, DeltaText } from '@/components/cockpit-ui'

import { COMPLETE_RATE, RESULT_KPIS } from '../constants'
import type { ResultKpi } from '../types'

const TONE_VAR: Record<string, string> = {
  cyan: '--ck-cyan',
  blue: '--ck-blue',
  green: '--ck-green',
  orange: '--ck-orange',
  red: '--ck-red',
  purple: '--ck-purple',
}

/** 左栏第一块：运营结果区（5 个 KPI + 任务完成率环） */
export function ResultKpiPanel({ className = '' }: { className?: string }) {
  return (
    <PanelBox title="运营结果区" className={`flex flex-col ${className}`}>
      <div className="flex h-full items-stretch gap-2 px-3 pt-3 pb-3">
        {RESULT_KPIS.map((kpi) => (
          <KpiCard key={kpi.key} kpi={kpi} />
        ))}
        <CompleteRateRing />
      </div>
    </PanelBox>
  )
}

function KpiCard({ kpi }: { kpi: ResultKpi }) {
  const color = `var(${TONE_VAR[kpi.tone] ?? '--ck-cyan'})`

  return (
    <div className="ck-card flex flex-1 flex-col items-center justify-between rounded-[3px] px-2 py-3">
      <span className="text-[15px] leading-none text-(--text-secondary)">{kpi.label}</span>

      <span className="ck-glow-num text-[32px] leading-none font-bold" style={{ color }}>
        {kpi.value}
      </span>

      <DeltaText value={kpi.delta} />

      <Sparkline points={kpi.spark} color={color} />
    </div>
  )
}

/** 迷你折线：用 SVG 直接画，避免为 5 个小图各起一个 ECharts 实例 */
function Sparkline({ points, color }: { points: number[]; color: string }) {
  const w = 120
  const h = 34
  const max = Math.max(...points)
  const min = Math.min(...points)
  const span = max - min || 1

  const coords = points.map((p, i) => {
    const x = (i / (points.length - 1)) * w
    const y = h - ((p - min) / span) * (h - 6) - 3
    return [x, y] as const
  })

  const line = coords.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const area = `0,${h} ${line} ${w},${h}`

  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden>
      <polygon points={area} fill={color} opacity="0.14" />
      <polyline points={line} fill="none" stroke={color} strokeWidth="1.6" opacity="0.95" />
      {coords.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.4" fill={color} />
      ))}
    </svg>
  )
}

/** 任务完成率：刻度环 + 进度弧 */
function CompleteRateRing() {
  const size = 96
  const r = 38
  const c = 2 * Math.PI * r
  const pct = COMPLETE_RATE.value

  return (
    <div className="ck-card flex w-[150px] shrink-0 flex-col items-center justify-center gap-0.5 rounded-[3px] px-2 py-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* 刻度底环 */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r + 8}
            fill="none"
            stroke="var(--ck-blue)"
            strokeWidth="6"
            strokeDasharray="1.5 4.5"
            opacity="0.4"
          />
          {/* 轨道 */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--ck-track)"
            strokeWidth="6"
          />
          {/* 进度弧 */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--ck-cyan)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${(c * pct) / 100} ${c}`}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{
              filter: 'drop-shadow(0 0 5px color-mix(in srgb, var(--ck-cyan) 40%, transparent))',
            }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="ck-glow-num text-[21px] leading-none font-bold text-(--ck-cyan)">
            {pct}%
          </span>
        </div>
      </div>

      <span className="text-[15px] leading-none text-(--text-secondary)">
        {COMPLETE_RATE.label}
      </span>
      <DeltaText value={COMPLETE_RATE.delta} tone="green" />
    </div>
  )
}
