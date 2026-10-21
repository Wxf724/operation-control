import ReactECharts from 'echarts-for-react'
import { useId } from 'react'

import type { ReactNode } from 'react'

import type { ServiceRingSlice } from './serviceData'

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

/** 内联 SVG 环形图：外环分段 + 可选内描边细环 + 居中内容 */
export function Donut({
  slices,
  size = 128,
  thickness = 18,
  gap = 0,
  innerRing = false,
  center,
  className = '',
}: {
  slices: ServiceRingSlice[]
  size?: number
  thickness?: number
  /** 段与段之间的留白（弧长 px），0 表示首尾相接 */
  gap?: number
  /** 是否在内侧再画一圈细描边环 */
  innerRing?: boolean
  center?: ReactNode
  className?: string
}) {
  const r = (size - thickness) / 2
  const circumference = 2 * Math.PI * r
  const total = slices.reduce((sum, s) => sum + s.value, 0) || 1
  const innerR = Math.max(r - thickness / 2 - 7, 8)
  let acc = 0

  return (
    <div className={`relative shrink-0 ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
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
              strokeDasharray={`${Math.max(len - gap, 0)} ${circumference}`}
              strokeDashoffset={offset}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          )
        })}
        {innerRing ? (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={innerR}
            fill="none"
            stroke="var(--ck-panel-border)"
            strokeWidth={1.5}
          />
        ) : null}
      </svg>
      {center ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center">{center}</div>
      ) : null}
    </div>
  )
}

/** 带色点的图例行：点 + 标签 + 数值 + 单位 */
export function LegendRow({
  color,
  label,
  value,
  unit,
  stacked = false,
  valueClassName = 'text-[17px]',
}: {
  color: string
  label: string
  value: string
  unit?: string
  /** 数值换行显示在标签下方 */
  stacked?: boolean
  valueClassName?: string
}) {
  const num = (
    <span className="flex items-baseline gap-0.5 whitespace-nowrap">
      <span className={`leading-none font-bold text-(--foreground) ${valueClassName}`}>
        {value}
      </span>
      {unit ? (
        <span className="text-[11px] leading-none text-(--text-secondary)">{unit}</span>
      ) : null}
    </span>
  )

  if (stacked) {
    return (
      <div className="flex flex-col gap-1.5">
        <span className="flex items-center gap-1.5 whitespace-nowrap">
          <i className="h-[7px] w-[7px] shrink-0 rounded-full" style={{ background: color }} />
          <span className="text-[12px] leading-none text-(--text-secondary)">{label}</span>
        </span>
        <span className="pl-[14px]">{num}</span>
      </div>
    )
  }

  return (
    <span className="flex items-center gap-1.5 whitespace-nowrap">
      <i className="h-[7px] w-[7px] shrink-0 rounded-full" style={{ background: color }} />
      <span className="text-[12px] leading-none text-(--text-secondary)">{label}</span>
      {num}
    </span>
  )
}

/** 刻度式弧形仪表盘，对应「93.8% 达成率」 */
export function ArcGauge({
  value,
  label,
  width = 150,
}: {
  value: number
  label: string
  width?: number
}) {
  const cx = width / 2
  const cy = width * 0.56
  const rIn = width * 0.3
  const rOut = width * 0.38
  const ticks = 40
  /** 弧段覆盖 220°，从 200° 起顺时针 */
  const start = (200 * Math.PI) / 180
  const span = (220 * Math.PI) / 180
  const lit = Math.round((value / 100) * ticks)

  return (
    <div className="relative shrink-0" style={{ width, height: cy + 26 }}>
      <svg
        width={width}
        height={cy + 26}
        viewBox={`0 0 ${width} ${cy + 26}`}
        fill="none"
        aria-hidden
      >
        {Array.from({ length: ticks + 1 }, (_, i) => {
          const a = start + (span * i) / ticks
          const on = i <= lit
          return (
            <line
              key={i}
              x1={cx + rIn * Math.cos(a)}
              y1={cy + rIn * Math.sin(a)}
              x2={cx + rOut * Math.cos(a)}
              y2={cy + rOut * Math.sin(a)}
              stroke={on ? 'var(--ck-cyan)' : 'var(--ck-panel-inner-border)'}
              strokeWidth={2}
              opacity={on ? 0.9 : 0.8}
            />
          )
        })}
        {Array.from({ length: ticks + 1 }, (_, i) => {
          if (i % 2 !== 0) return null
          const a = start + (span * i) / ticks
          const rr = rOut + 5
          return (
            <circle
              key={`d${i}`}
              cx={cx + rr * Math.cos(a)}
              cy={cy + rr * Math.sin(a)}
              r={1.3}
              fill={i <= lit ? 'var(--ck-cyan)' : 'var(--ck-panel-inner-border)'}
            />
          )
        })}
      </svg>

      <div className="absolute inset-x-0 flex flex-col items-center" style={{ top: cy - 32 }}>
        <span className="ck-glow-num text-[27px] leading-none font-bold text-(--ck-cyan)">
          {value.toFixed(1)}%
        </span>
        <span className="mt-2 text-[14px] leading-none text-(--ck-title-sub)">{label}</span>
      </div>
    </div>
  )
}

/** 托盘式数字：数值 + 椭圆光盘底座 */
export function PlateNumber({
  value,
  unit,
  tone = 'cyan',
  valueTone,
  width = 128,
  className = '',
}: {
  value: string
  unit?: string
  /** 底座光盘配色 */
  tone?: 'cyan' | 'blue' | 'orange' | 'red'
  /** 数字配色，省略则用白色 */
  valueTone?: 'cyan' | 'blue' | 'orange' | 'red'
  width?: number
  className?: string
}) {
  const color = `var(--ck-${tone})`

  return (
    <div className={`relative flex shrink-0 flex-col items-center ${className}`} style={{ width }}>
      <span className="flex items-baseline gap-0.5">
        <span
          className="ck-glow-num text-[30px] leading-none font-bold"
          style={{ color: valueTone ? `var(--ck-${valueTone})` : 'var(--foreground)' }}
        >
          {value}
        </span>
        {unit ? (
          <span className="text-[13px] leading-none text-(--text-secondary)">{unit}</span>
        ) : null}
      </span>
      <svg
        width={width}
        height="34"
        viewBox={`0 0 ${width} 34`}
        fill="none"
        className="-mt-1"
        aria-hidden
      >
        <ellipse cx={width / 2} cy="18" rx={width * 0.33} ry="9" fill={color} opacity="0.3" />
        <ellipse
          cx={width / 2}
          cy="18"
          rx={width * 0.33}
          ry="9"
          stroke={color}
          strokeOpacity="0.75"
        />
        <ellipse cx={width / 2} cy="25" rx={width * 0.45} ry="7" fill={color} opacity="0.12" />
        <ellipse
          cx={width / 2}
          cy="25"
          rx={width * 0.45}
          ry="7"
          stroke={color}
          strokeOpacity="0.3"
        />
      </svg>
    </div>
  )
}

/** 立体圆环底座 + 上方数字，对应「服务企业数量 29」 */
export function PedestalRing({
  label,
  value,
  width = 150,
}: {
  label: string
  value: string
  width?: number
}) {
  return (
    <div className="flex shrink-0 flex-col items-center gap-1.5" style={{ width }}>
      <span className="text-[13px] leading-none text-(--ck-title-sub)">{label}</span>
      <span className="ck-glow-num text-[32px] leading-none font-bold text-(--foreground)">
        {value}
      </span>
      <svg
        width={width}
        height="54"
        viewBox={`0 0 ${width} 54`}
        fill="none"
        className="-mt-2"
        aria-hidden
      >
        <ellipse
          cx={width / 2}
          cy="22"
          rx={width * 0.26}
          ry="11"
          fill="var(--ck-cyan)"
          opacity="0.16"
        />
        <ellipse
          cx={width / 2}
          cy="22"
          rx={width * 0.26}
          ry="11"
          stroke="var(--ck-cyan)"
          strokeOpacity="0.85"
          strokeWidth="2.5"
        />
        <ellipse
          cx={width / 2}
          cy="34"
          rx={width * 0.38}
          ry="14"
          fill="var(--ck-blue)"
          opacity="0.2"
        />
        <ellipse
          cx={width / 2}
          cy="34"
          rx={width * 0.38}
          ry="14"
          stroke="var(--ck-blue)"
          strokeOpacity="0.55"
        />
      </svg>
    </div>
  )
}

/** 光束讲台式评分，对应「客户满意度问卷评分 96」 */
export function PodiumScore({ label, value }: { label: string; value: string }) {
  const beamId = `svc-beam${useId().replace(/:/g, '')}`

  return (
    <div className="flex shrink-0 flex-col items-center">
      <span className="text-[15px] leading-none font-medium text-(--ck-title-sub)">{label}</span>
      <div className="relative mt-2 h-[132px] w-[200px]">
        <svg width="200" height="132" viewBox="0 0 200 132" fill="none" aria-hidden>
          <defs>
            <linearGradient id={beamId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--ck-cyan)" stopOpacity="0.02" />
              <stop offset="100%" stopColor="var(--ck-cyan)" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <path d="M52 4 L148 4 L124 76 L76 76 Z" fill={`url(#${beamId})`} />
          <ellipse cx="100" cy="80" rx="34" ry="11" fill="var(--ck-blue)" opacity="0.55" />
          <path
            d="M66 80 L66 92 A34 11 0 0 0 134 92 L134 80 Z"
            fill="var(--ck-blue)"
            opacity="0.35"
          />
          <ellipse cx="100" cy="92" rx="34" ry="11" fill="var(--ck-blue)" opacity="0.5" />
          <ellipse cx="100" cy="104" rx="56" ry="17" fill="var(--ck-blue)" opacity="0.18" />
          <ellipse cx="100" cy="104" rx="56" ry="17" stroke="var(--ck-blue)" strokeOpacity="0.45" />
        </svg>
        <span className="ck-glow-num absolute top-[14px] left-1/2 -translate-x-1/2 text-[52px] leading-none font-bold text-(--foreground)">
          {value}
        </span>
      </div>
    </div>
  )
}

/** 一行星级（实心星数量 = stars） */
export function StarRow({ stars, count }: { stars: number; count: number }) {
  return (
    <div className="flex items-center justify-end gap-2">
      <span className="flex items-center gap-[3px]">
        {Array.from({ length: stars }, (_, i) => (
          <i
            key={i}
            className="ri-star-fill text-[19px] leading-none text-(--ck-orange)"
            aria-hidden
          />
        ))}
      </span>
      <span className="w-[46px] shrink-0 text-right text-[16px] leading-none font-semibold text-(--foreground) tabular-nums">
        {count}
      </span>
    </div>
  )
}

/** 一行表情评价：表情 + 数量 + 占比细条 */
export function MoodRow({
  emoji,
  count,
  ratio,
  color,
}: {
  emoji: string
  count: number
  /** 0–100 的占比 */
  ratio: number
  color: string
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="w-[24px] shrink-0 text-[18px] leading-none" aria-hidden>
        {emoji}
      </span>
      <span className="w-[42px] shrink-0 text-[15px] leading-none font-semibold text-(--foreground) tabular-nums">
        {count}
      </span>
      <span
        className="relative h-[8px] min-w-0 flex-1 overflow-hidden rounded-full"
        style={{ background: 'var(--ck-track)' }}
      >
        <i
          className="absolute top-0 left-0 h-full rounded-full"
          style={{
            width: `${Math.max(ratio, 2)}%`,
            background: `linear-gradient(90deg, color-mix(in srgb, ${color} 45%, transparent), ${color})`,
          }}
        />
      </span>
    </div>
  )
}
