import type { ReactNode } from 'react'

/** 状态标签色板，对应大屏里的执行中/已完成/高风险等 */
export type TagTone = 'cyan' | 'blue' | 'green' | 'orange' | 'red' | 'purple' | 'muted'

const TONE_VAR: Record<TagTone, string> = {
  cyan: '--ck-cyan',
  blue: '--ck-blue',
  green: '--ck-green',
  orange: '--ck-orange',
  red: '--ck-red',
  purple: '--ck-purple',
  muted: '--text-tertiary',
}

export interface StatusTagProps {
  tone?: TagTone
  /** solid 实心底色；soft 半透明底；plain 纯文字 */
  variant?: 'solid' | 'soft' | 'plain'
  className?: string
  children: ReactNode
}

export function StatusTag({
  tone = 'cyan',
  variant = 'soft',
  className = '',
  children,
}: StatusTagProps) {
  const color = `var(${TONE_VAR[tone]})`

  if (variant === 'plain') {
    return (
      <span className={`text-(length:--ck-fs-tag) leading-none font-medium ${className}`} style={{ color }}>
        {children}
      </span>
    )
  }

  return (
    <span
      className={`inline-flex items-center justify-center rounded-[2px] px-1.5 py-[3px] text-(length:--ck-fs-tag) leading-none font-medium whitespace-nowrap ${className}`}
      style={
        variant === 'solid'
          ? { background: color, color: 'var(--ck-on-solid)' }
          : {
              background: `color-mix(in srgb, ${color} 18%, transparent)`,
              border: `1px solid color-mix(in srgb, ${color} 45%, transparent)`,
              color,
            }
      }
    >
      {children}
    </span>
  )
}

/** 细条进度，大屏表格里的进度列 */
export interface ProgressBarProps {
  /** 0–100 */
  value: number
  tone?: TagTone
  /** 是否在右侧显示百分比文字 */
  showValue?: boolean
  className?: string
  barClassName?: string
}

export function ProgressBar({
  value,
  tone = 'cyan',
  showValue = true,
  className = '',
  barClassName = 'h-[5px]',
}: ProgressBarProps) {
  const color = `var(${TONE_VAR[tone]})`
  const pct = Math.max(0, Math.min(100, value))

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div
        className={`flex-1 overflow-hidden rounded-full ${barClassName}`}
        style={{ background: 'var(--ck-track)' }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, color-mix(in srgb, ${color} 55%, transparent), ${color})`,
            boxShadow: `0 0 8px color-mix(in srgb, ${color} 60%, transparent)`,
          }}
        />
      </div>
      {showValue ? (
        <span className="w-[34px] shrink-0 text-right text-(length:--ck-fs-tag) text-(--text-secondary) tabular-nums">
          {pct}%
        </span>
      ) : null}
    </div>
  )
}

/** 环比涨跌，带箭头 */
export interface DeltaTextProps {
  /** 形如 +12.6% / -5.3% 的文本 */
  value: string
  /** 正向是涨还是跌由调用方决定，这里只管配色 */
  tone?: TagTone
  label?: string
  className?: string
}

export function DeltaText({ value, tone, label = '日环比', className = '' }: DeltaTextProps) {
  const up = value.trim().startsWith('+')
  const resolved: TagTone = tone ?? (up ? 'red' : 'green')

  return (
    <span className={`text-[11px] leading-none whitespace-nowrap ${className}`}>
      <span className="text-(--text-tertiary)">{label} </span>
      <span style={{ color: `var(${TONE_VAR[resolved]})` }}>
        {value}
        <span className="ml-0.5 inline-block">{up ? '▲' : '▼'}</span>
      </span>
    </span>
  )
}
