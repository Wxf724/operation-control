import ReactECharts from 'echarts-for-react'

import type { ReactNode } from 'react'

import type { StaffHeadcountSlice } from './staffData'

/** ECharts 容器，统一 canvas 渲染与尺寸 */
export function Chart({ option }: { option: object }) {
  return (
    <ReactECharts
      option={option}
      style={{ height: '100%', width: '100%' }}
      opts={{ renderer: 'canvas' }}
      notMerge
    />
  )
}

/** 内联 SVG 环形图，支持任意分段 + 居中内容 */
export function Donut({
  slices,
  size = 120,
  thickness = 18,
  center,
}: {
  slices: StaffHeadcountSlice[]
  size?: number
  thickness?: number
  center?: ReactNode
}) {
  const r = (size - thickness) / 2
  const circumference = 2 * Math.PI * r
  const total = slices.reduce((sum, s) => sum + s.value, 0) || 1
  let acc = 0

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--ck-track)"
          strokeWidth={thickness}
        />
        {slices.map((s) => {
          const len = (circumference * s.value) / total
          const offset = -(circumference * acc) / total
          acc += s.value
          return (
            <circle
              key={s.label}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth={thickness}
              strokeDasharray={`${Math.max(len - 1.5, 0)} ${circumference}`}
              strokeDashoffset={offset}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          )
        })}
      </svg>
      {center ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center">{center}</div>
      ) : null}
    </div>
  )
}

/** 环形图外围的「标签 + 数值」引线文字 */
export function DonutLabel({
  className,
  label,
  value,
}: {
  className: string
  label: string
  value: string
}) {
  return (
    <span className={`absolute flex items-baseline gap-1 whitespace-nowrap ${className}`}>
      <span className="text-[12px] leading-none text-(--ck-title-sub)">{label}</span>
      <span className="text-[17px] leading-none font-bold text-(--ck-title)">{value}</span>
    </span>
  )
}

/** 刻度式半圆仪表盘 */
export function HalfGauge({ value }: { value: number }) {
  const size = 112
  const cx = size / 2
  const cy = 54
  const rIn = 34
  const rOut = 46
  const ticks = 34
  const lit = Math.round((value / 100) * ticks)

  return (
    <div className="relative" style={{ width: size, height: cy + 8 }}>
      <svg width={size} height={cy + 8} viewBox={`0 0 ${size} ${cy + 8}`} fill="none" aria-hidden>
        {Array.from({ length: ticks + 1 }, (_, i) => {
          const a = Math.PI + (Math.PI * i) / ticks
          const on = i <= lit
          return (
            <line
              key={i}
              x1={cx + rIn * Math.cos(a)}
              y1={cy + rIn * Math.sin(a)}
              x2={cx + rOut * Math.cos(a)}
              y2={cy + rOut * Math.sin(a)}
              stroke={on ? 'var(--ck-cyan)' : 'var(--ck-panel-inner-border)'}
              strokeWidth={1.6}
              opacity={on ? 0.95 : 0.7}
            />
          )
        })}
        {[0, 0.2, 0.4, 0.6, 0.8, 1].map((f) => {
          const a = Math.PI + Math.PI * f
          return (
            <text
              key={f}
              x={cx + 27 * Math.cos(a)}
              y={cy + 27 * Math.sin(a) + 3}
              textAnchor="middle"
              fontSize="8"
              fill="var(--text-tertiary)"
            >
              {f === 0 || f === 1 ? f : f.toFixed(1)}
            </text>
          )
        })}
      </svg>
      <span className="absolute inset-x-0 bottom-0 text-center text-[17px] leading-none font-bold text-(--ck-title)">
        {value.toFixed(1)}%
      </span>
    </div>
  )
}

/** 270° 刻度环形仪表盘 */
export function RingGauge({ value, label }: { value: number; label: string }) {
  const size = 164
  const cx = size / 2
  const r = 56
  const circumference = 2 * Math.PI * r
  const innerR = r - 13
  const sweep = 0.75

  return (
    <div className="relative flex flex-col items-center" style={{ width: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
        <circle
          cx={cx}
          cy={cx}
          r={r}
          stroke="var(--ck-track)"
          strokeWidth={13}
          strokeDasharray={`${circumference * sweep} ${circumference}`}
          transform={`rotate(135 ${cx} ${cx})`}
        />
        <circle
          cx={cx}
          cy={cx}
          r={r}
          stroke="var(--ck-cyan)"
          strokeWidth={13}
          strokeLinecap="round"
          strokeDasharray={`${circumference * sweep * (value / 100)} ${circumference}`}
          transform={`rotate(135 ${cx} ${cx})`}
        />
        <circle
          cx={cx}
          cy={cx}
          r={innerR}
          stroke="color-mix(in srgb, var(--ck-blue) 32%, transparent)"
          strokeWidth={3}
          strokeDasharray={`${2 * Math.PI * innerR * sweep} ${2 * Math.PI * innerR}`}
          transform={`rotate(135 ${cx} ${cx})`}
        />
        {[0, 20, 40, 60, 80, 100].map((t) => {
          const a = ((135 + 270 * (t / 100)) * Math.PI) / 180
          return (
            <text
              key={t}
              x={cx + (r + 16) * Math.cos(a)}
              y={cx + (r + 16) * Math.sin(a) + 3}
              textAnchor="middle"
              fontSize="9"
              fill="var(--text-tertiary)"
            >
              {t}
            </text>
          )
        })}
      </svg>

      <span className="absolute inset-x-0 bottom-[10px] text-center text-[26px] leading-none font-bold text-(--ck-green)">
        {value}%
      </span>
      <span className="mt-1 text-center text-[13px] leading-tight text-(--ck-title-sub)">
        {label}
      </span>
    </div>
  )
}

/** 带透视底盘的图标数字 */
export function PlateStat({
  icon,
  label,
  value,
  stacked = false,
}: {
  icon: string
  label: string
  value: string
  /** 图标在上、文字在下的纵向排布 */
  stacked?: boolean
}) {
  return (
    <div className={`flex items-center gap-2 ${stacked ? 'flex-col text-center' : ''}`}>
      <span className="relative flex h-[46px] w-[48px] shrink-0 items-end justify-center">
        <svg
          className="absolute bottom-0 left-0"
          width="48"
          height="16"
          viewBox="0 0 48 16"
          fill="none"
          aria-hidden
        >
          <ellipse cx="24" cy="8" rx="21" ry="6" fill="var(--ck-blue)" opacity="0.22" />
          <ellipse cx="24" cy="8" rx="21" ry="6" stroke="var(--ck-blue)" strokeOpacity="0.45" />
        </svg>
        <i className={`${icon} relative mb-[2px] text-[26px] text-(--ck-cyan)`} aria-hidden />
      </span>

      <span className={`flex min-w-0 flex-col gap-1.5 ${stacked ? 'items-center' : ''}`}>
        <span className="truncate text-[12px] leading-none text-(--ck-title-sub)">{label}</span>
        <span className="ck-glow-num text-[22px] leading-none font-bold text-(--ck-cyan)">
          {value}
        </span>
      </span>
    </div>
  )
}

/** 带底座光效的大数字 */
export function PedestalStat({
  topLabel,
  value,
  label,
  tone = 'cyan',
  big = false,
}: {
  topLabel?: string
  value: string
  label?: string
  tone?: 'cyan' | 'blue' | 'green'
  big?: boolean
}) {
  const color = `var(--ck-${tone})`

  return (
    <div className="flex shrink-0 flex-col items-center gap-1.5">
      {topLabel ? (
        <span className="text-[13px] leading-none text-(--ck-title-sub)">{topLabel}</span>
      ) : null}
      <span
        className={`ck-glow-num leading-none font-bold ${big ? 'text-[32px]' : 'text-[26px]'}`}
        style={{ color }}
      >
        {value}
      </span>
      <svg width="92" height="32" viewBox="0 0 92 32" fill="none" aria-hidden>
        <ellipse cx="46" cy="13" rx="26" ry="7" fill={color} opacity="0.14" />
        <ellipse cx="46" cy="13" rx="26" ry="7" stroke={color} strokeOpacity="0.6" />
        <ellipse cx="46" cy="22" rx="38" ry="9" fill="var(--ck-blue)" opacity="0.14" />
        <ellipse cx="46" cy="22" rx="38" ry="9" stroke="var(--ck-blue)" strokeOpacity="0.3" />
      </svg>
      {label ? (
        <span className="text-center text-[12px] leading-tight text-(--text-secondary)">
          {label}
        </span>
      ) : null}
    </div>
  )
}

/** 带色点的图例数字 */
export function LegendNum({
  color,
  label,
  value,
}: {
  color: string
  label: string
  value: string
}) {
  return (
    <span className="flex items-center gap-1.5 whitespace-nowrap">
      <i className="h-[7px] w-[7px] shrink-0 rounded-full" style={{ background: color }} />
      <span className="flex-1 truncate text-[12px] leading-none text-(--text-secondary)">
        {label}
      </span>
      <span className="text-[17px] leading-none font-bold" style={{ color }}>
        {value}
      </span>
    </span>
  )
}

/** 面板内的小键值块，如「已出具量 800」 */
export function MiniKv({ label, value }: { label: string; value: string }) {
  return (
    <span className="ck-card flex w-full items-center gap-1 rounded-[3px] px-1.5 py-1">
      <i className="h-[5px] w-[5px] shrink-0 rotate-45 bg-(--ck-cyan)" />
      <span className="flex-1 truncate text-[11px] leading-none text-(--text-secondary)">
        {label}
      </span>
      <span className="text-[13px] leading-none font-bold text-(--foreground)">{value}</span>
    </span>
  )
}

/** 页签按钮组 */
export function TabRow({
  items,
  active,
  onChange,
  className = '',
}: {
  items: string[]
  active: number
  onChange: (i: number) => void
  className?: string
}) {
  return (
    <div className={`flex shrink-0 items-center ${className}`}>
      {items.map((label, i) => (
        <button
          key={label}
          type="button"
          onClick={() => onChange(i)}
          className={`cursor-pointer border px-2 py-[5px] text-[11px] leading-none transition-colors ${
            active === i
              ? 'border-(--ck-cyan) bg-(--ck-panel-inner) font-medium text-(--ck-cyan)'
              : 'border-(--ck-panel-inner-border) bg-(--ck-table-row) text-(--text-tertiary)'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
