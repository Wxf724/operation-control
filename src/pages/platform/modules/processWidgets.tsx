import type { ReactNode } from 'react'

import type { ProcessDetailRow, ProcessReportGauge, ProcessStageItem } from './processData'

const TONE_VAR = {
  cyan: 'var(--ck-cyan)',
  blue: 'var(--ck-blue)',
  green: 'var(--ck-green)',
} as const

/** 进度条 / 圆环的色调 */
export type ProcessTone = keyof typeof TONE_VAR

/* ───────────── 标题与页签 ───────────── */

/** 分栏里的三级小标题：实心三角 + 文案，右侧可挂单位说明 */
export function SubTitle({ children, extra }: { children: ReactNode; extra?: ReactNode }) {
  return (
    <div className="flex shrink-0 items-center justify-between gap-2">
      <span className="flex items-center gap-1.5">
        <svg width="7" height="9" viewBox="0 0 7 9" fill="none" aria-hidden="true">
          <path d="M0 0L7 4.5L0 9V0Z" fill="var(--ck-marker)" />
        </svg>
        <span className="text-[13px] leading-none font-semibold text-(--ck-title-sub)">
          {children}
        </span>
      </span>
      {extra ? (
        <span className="text-[12px] leading-none text-(--text-secondary)">{extra}</span>
      ) : null}
    </div>
  )
}

/** 胶囊页签组，对应截图里「单据平均停留时长 / 超期停留单据量」 */
export function TabPills({
  labels,
  active,
  onChange,
}: {
  labels: readonly string[]
  active: number
  onChange: (index: number) => void
}) {
  return (
    <div className="flex shrink-0 items-center gap-1.5">
      {labels.map((label, i) => (
        <button
          key={label}
          type="button"
          onClick={() => onChange(i)}
          className={`cursor-pointer rounded-[4px] border px-2.5 py-[6px] text-[12px] leading-none transition-colors ${
            active === i
              ? 'border-(--ck-cyan) font-semibold text-(--ck-on-solid)'
              : 'border-(--border) text-(--text-secondary)'
          }`}
          style={
            active === i
              ? { background: 'linear-gradient(180deg, var(--ck-btn-from), var(--ck-btn-to))' }
              : { background: 'var(--ck-panel-inner)' }
          }
        >
          {label}
        </button>
      ))}
    </div>
  )
}

/* ───────────── 环节行 ───────────── */

/** 带卡片底的环节行：标签 + 数值 + 整行进度条（企业端 / 驻企团队） */
export function StageCard({ item, tone }: { item: ProcessStageItem; tone: ProcessTone }) {
  return (
    <div className="ck-card flex flex-col gap-2 rounded-[3px] px-3 pt-2.5 pb-2.5">
      <span className="flex items-baseline justify-between gap-2">
        <span className="truncate text-[13px] leading-none text-(--foreground)">{item.label}</span>
        <span className="flex items-baseline gap-0.5 whitespace-nowrap">
          <span className="text-[19px] leading-none font-bold text-(--ck-cyan) tabular-nums">
            {item.value}
          </span>
          <span className="text-[11px] leading-none text-(--text-secondary)">{item.unit}</span>
        </span>
      </span>
      <StageBar pct={item.pct} tone={tone} />
    </div>
  )
}

/** 紧凑环节行：标签 + 数值一行，下方细进度条（分中心两列） */
export function StageLine({ item, tone }: { item: ProcessStageItem; tone: ProcessTone }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="flex items-baseline justify-between gap-2">
        <span className="truncate text-[12px] leading-none text-(--foreground)">{item.label}</span>
        <span className="flex items-baseline gap-0.5 whitespace-nowrap">
          <span className="text-[17px] leading-none font-bold text-(--ck-cyan) tabular-nums">
            {item.value}
          </span>
          <span className="text-[10px] leading-none text-(--text-secondary)">{item.unit}</span>
        </span>
      </span>
      <StageBar pct={item.pct} tone={tone} />
    </div>
  )
}

function StageBar({ pct, tone }: { pct: number; tone: ProcessTone }) {
  const color = TONE_VAR[tone]
  return (
    <div
      className="h-[6px] w-full overflow-hidden rounded-[2px]"
      style={{ background: 'var(--ck-track)' }}
    >
      {/* 白底不做外发光，进度段靠自身渐变区分 */}
      <div
        className="h-full rounded-[2px]"
        style={{
          width: `${Math.max(0, Math.min(100, pct))}%`,
          background: `linear-gradient(90deg, color-mix(in srgb, ${color} 55%, transparent), ${color})`,
        }}
      />
    </div>
  )
}

/* ───────────── 环形图与明细表 ───────────── */

/** 内联 SVG 圆环，环心放大数字，外侧点缀装饰点 */
export function DonutRing({
  total,
  ratio,
  tone,
  size = 96,
  thickness = 11,
}: {
  total: string
  ratio: number
  tone: ProcessTone
  size?: number
  thickness?: number
}) {
  const color = TONE_VAR[tone]
  const c = size / 2
  const r = c - thickness / 2 - 6
  const circ = 2 * Math.PI * r

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
        <circle
          cx={c}
          cy={c}
          r={r}
          fill="none"
          stroke="var(--ck-track)"
          strokeWidth={thickness}
        />
        <circle
          cx={c}
          cy={c}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={`${(circ * ratio) / 100} ${circ}`}
          transform={`rotate(-80 ${c} ${c})`}
        />
        {[35, 155, 250, 320].map((deg, i) => {
          const a = (deg * Math.PI) / 180
          return (
            <circle
              key={deg}
              cx={c + (r + thickness / 2 + 5) * Math.cos(a)}
              cy={c + (r + thickness / 2 + 5) * Math.sin(a)}
              r={i % 2 === 0 ? 2 : 1.4}
              fill={color}
              opacity={0.75}
            />
          )
        })}
      </svg>
      <span className="ck-glow-num absolute inset-0 flex items-center justify-center text-[25px] leading-none font-bold text-(--ck-cyan)">
        {total}
      </span>
    </div>
  )
}

/** 明细列表：隔行底色，右侧高亮数值 */
export function DetailList({ rows, className = '' }: { rows: ProcessDetailRow[]; className?: string }) {
  return (
    <div className={`flex flex-col overflow-hidden rounded-[3px] ${className}`}>
      {rows.map((row, i) => (
        <div
          key={row.label}
          className="flex min-h-0 flex-1 items-center justify-between gap-2 px-2.5 py-[7px]"
          style={{ background: i % 2 === 0 ? 'var(--ck-table-row)' : 'var(--ck-table-row-alt)' }}
        >
          <span className="truncate text-[12px] leading-none text-(--foreground)">{row.label}</span>
          <span className="text-[14px] leading-none font-bold text-(--ck-cyan) tabular-nums">
            {row.value}
          </span>
        </div>
      ))}
    </div>
  )
}

/* ───────────── 数字卡 ───────────── */

/** 发光底座图标 + 标签 + 数值，支持横排（inline）与两行两种排布 */
export function IconStatCard({
  label,
  value,
  unit,
  icon,
  inline = false,
  valueTone = 'cyan',
  className = '',
}: {
  label: string
  value: string
  unit: string
  icon: string
  inline?: boolean
  valueTone?: ProcessTone
  className?: string
}) {
  const color = TONE_VAR[valueTone]

  return (
    <div
      className={`flex items-center gap-3 rounded-[4px] border px-4 py-2.5 ${className}`}
      style={{
        borderColor: 'var(--ck-card-border)',
        background: 'linear-gradient(135deg, var(--ck-card-from) 0%, var(--ck-card-to) 100%)',
        boxShadow: 'var(--ck-card-shadow)',
      }}
    >
      <PedestalIcon icon={icon} />
      <div
        className={`flex min-w-0 ${inline ? 'items-baseline gap-2.5' : 'flex-col gap-2'}`}
      >
        <span className="truncate text-[14px] leading-none text-(--ck-title-sub)">{label}</span>
        <span className="flex items-baseline gap-0.5 whitespace-nowrap">
          <span className="ck-glow-num text-[26px] leading-none font-bold" style={{ color }}>
            {value}
          </span>
          <span className="text-[11px] leading-none text-(--text-secondary)">{unit}</span>
        </span>
      </div>
    </div>
  )
}

/** 大屏里常见的"发光底座 + 图标"组合 */
export function PedestalIcon({ icon, size = 44 }: { icon: string; size?: number }) {
  return (
    <span className="relative flex shrink-0 items-end justify-center" style={{ width: size, height: size }}>
      <span
        className="absolute bottom-0 left-1/2 h-[12px] -translate-x-1/2 rounded-[50%]"
        style={{
          width: size,
          background:
            'radial-gradient(ellipse at center, var(--ck-icon-to) 0%, color-mix(in srgb, var(--ck-icon-to) 45%, transparent) 60%, transparent 75%)',
        }}
      />
      <i
        className={`${icon} relative text-(--ck-cyan)`}
        style={{ fontSize: size * 0.56, marginBottom: size * 0.12 }}
        aria-hidden
      />
    </span>
  )
}

/* ───────────── 仪表盘 ───────────── */

/** 报表出具及时率：外圈刻度 + 红黄绿点状刻度 + 指针，环心显示百分比 */
export function ReportGauge({ item }: { item: ProcessReportGauge }) {
  const w = 128
  const cx = w / 2
  const cy = 66
  const dots = 34
  const needle = (Math.PI * item.rate) / 100

  return (
    <div className="relative" style={{ width: w, height: cy + 6 }}>
      <svg width={w} height={cy + 6} viewBox={`0 0 ${w} ${cy + 6}`} fill="none" aria-hidden>
        {Array.from({ length: 41 }, (_, i) => {
          const a = Math.PI + (Math.PI * i) / 40
          const long = i % 5 === 0
          return (
            <line
              key={`t${i}`}
              x1={cx + 56 * Math.cos(a)}
              y1={cy + 56 * Math.sin(a)}
              x2={cx + (long ? 46 : 50) * Math.cos(a)}
              y2={cy + (long ? 46 : 50) * Math.sin(a)}
              stroke="var(--ck-blue)"
              strokeWidth={long ? 1.6 : 1}
              opacity={long ? 0.85 : 0.45}
            />
          )
        })}

        {Array.from({ length: dots + 1 }, (_, i) => {
          const f = i / dots
          const a = Math.PI + Math.PI * f
          const color =
            f < 0.3 ? 'var(--ck-red)' : f < 0.52 ? 'var(--ck-yellow)' : 'var(--ck-green)'
          return (
            <circle
              key={`d${i}`}
              cx={cx + 41 * Math.cos(a)}
              cy={cy + 41 * Math.sin(a)}
              r={1.9}
              fill={color}
            />
          )
        })}

        <line
          x1={cx - 20}
          y1={cy - 2}
          x2={cx + 30 * Math.cos(Math.PI + needle)}
          y2={cy + 30 * Math.sin(Math.PI + needle)}
          stroke="var(--ck-blue)"
          strokeWidth={2}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute inset-x-0 text-center text-[16px] leading-none font-bold text-(--ck-cyan) tabular-nums" style={{ top: cy - 24 }}>
        {item.rate.toFixed(1)}%
      </span>
    </div>
  )
}

/** 流程标准化率：橙→青粗环半圆仪表盘 + 外圈刻度 + 指针 */
export function ComplianceGauge({ value }: { value: number }) {
  const w = 164
  const cx = w / 2
  const cy = 90
  const r = 56
  const needle = Math.PI + (Math.PI * value) / 100
  const circ = Math.PI * r

  return (
    <svg width={w} height={cy + 8} viewBox={`0 0 ${w} ${cy + 8}`} fill="none" aria-hidden>
      {Array.from({ length: 49 }, (_, i) => {
        const a = Math.PI + (Math.PI * i) / 48
        return (
          <line
            key={i}
            x1={cx + 78 * Math.cos(a)}
            y1={cy + 78 * Math.sin(a)}
            x2={cx + (i % 6 === 0 ? 68 : 72) * Math.cos(a)}
            y2={cy + (i % 6 === 0 ? 68 : 72) * Math.sin(a)}
            stroke="var(--ck-blue)"
            strokeWidth={i % 6 === 0 ? 1.8 : 1}
            opacity={i % 6 === 0 ? 0.85 : 0.4}
          />
        )
      })}

      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        stroke="var(--ck-orange)"
        strokeWidth={17}
        strokeDasharray={`${circ * 0.28} ${circ}`}
      />
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        stroke="var(--ck-green)"
        strokeWidth={17}
        strokeDasharray={`${circ * 0.72} ${circ}`}
        strokeDashoffset={-circ * 0.28}
        opacity={0.85}
      />

      <line
        x1={cx - 14}
        y1={cy - 6}
        x2={cx + 44 * Math.cos(needle)}
        y2={cy + 44 * Math.sin(needle)}
        stroke="var(--ck-cyan)"
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      <circle cx={cx - 14} cy={cy - 6} r={2.6} fill="var(--ck-cyan)" />
    </svg>
  )
}
