import { useId } from 'react'

import { TONE_VAR } from './tone'
import type { DocStat, MetricRow, ReportGaugeItem, SpecialTaskStat } from './types'

/** 面板内的二级标题，左侧带 ◆▸ 双箭头标记 */
export function SubTitle({ text, className = '' }: { text: string; className?: string }) {
  return (
    <span className={`flex shrink-0 items-center gap-1.5 ${className}`}>
      <i className="ri-arrow-right-double-line text-[14px] text-(--ck-cyan)" aria-hidden />
      <span className="text-[15px] leading-none font-semibold text-(--ck-title-sub)">{text}</span>
    </span>
  )
}

/** 发光底座 + 图标，大屏里最常见的数值前缀 */
export function PedestalIcon({ icon, size = 44 }: { icon: string; size?: number }) {
  return (
    <span
      className="relative flex shrink-0 items-end justify-center"
      style={{ width: size, height: size }}
    >
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

/** 个人单据处理情况里的一项：底座图标 + 标签 + 数值 */
export function DocStatItem({ stat }: { stat: DocStat }) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-2">
      <PedestalIcon icon={stat.icon} size={40} />
      <div className="flex min-w-0 flex-col gap-1.5">
        <span className="truncate text-[13px] leading-none text-(--text-secondary)">
          {stat.label}
        </span>
        <span className="flex items-baseline gap-1">
          <span className="ck-glow-num text-[22px] leading-none font-bold text-(--ck-cyan) tabular-nums">
            {stat.value}
          </span>
          <span className="text-[12px] leading-none text-(--text-tertiary)">{stat.unit}</span>
        </span>
      </div>
    </div>
  )
}

/** 个人 / 部门平均水平对比里的一行：标签 + 数值 + 渐变进度条 */
export function MetricBar({ row }: { row: MetricRow }) {
  const color = `var(${TONE_VAR[row.tone] ?? '--ck-cyan'})`

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[13px] leading-none text-(--text-secondary)">{row.label}</span>
        <span className="text-[15px] leading-none font-semibold text-(--foreground) tabular-nums">
          {row.value}
        </span>
      </div>
      <div className="h-[6px] overflow-hidden rounded-full bg-(--ck-track)">
        <div
          className="h-full rounded-full"
          style={{
            width: `${row.ratio}%`,
            background: `linear-gradient(90deg, color-mix(in srgb, ${color} 45%, transparent), ${color})`,
          }}
        />
      </div>
    </div>
  )
}

/**
 * 个人报表出具情况的仪表盘：外圈刻度线 + 红黄绿点阵 + 指针，环心显示完成率。
 *
 * 几何照参考稿量定：半圆直径 128，点阵 34 段，刻度 41 根。
 */
export function ReportGauge({ item }: { item: ReportGaugeItem }) {
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
      <span
        className="absolute inset-x-0 text-center text-[20px] leading-none font-bold text-(--ck-cyan) tabular-nums"
        style={{ top: cy - 26 }}
      >
        {item.rate.toFixed(1)}%
      </span>
    </div>
  )
}

/** 仪表盘下方的「已出具量 / 待出具量」行：标签 + 细进度条 + 数值 */
export function GaugeKvBar({
  label,
  value,
  ratio,
  tone,
}: {
  label: string
  value: number
  ratio: number
  tone: string
}) {
  const color = `var(${TONE_VAR[tone] ?? '--ck-cyan'})`

  return (
    <div className="flex items-center gap-2">
      <span className="w-[62px] shrink-0 text-[12px] leading-none text-(--text-secondary)">
        {label}
      </span>
      <div className="h-[5px] min-w-0 flex-1 overflow-hidden rounded-full bg-(--ck-track)">
        <div
          className="h-full rounded-full"
          style={{
            width: `${ratio}%`,
            background: `linear-gradient(90deg, color-mix(in srgb, ${color} 40%, transparent), ${color})`,
          }}
        />
      </div>
      <span className="w-[46px] shrink-0 text-right text-[13px] leading-none font-semibold text-(--foreground) tabular-nums">
        {value.toLocaleString()}
      </span>
    </div>
  )
}

/** 专项工作总量环：粗环 + 环心数值，参考稿为单色青环缺口在右下 */
export function SpecialRing({
  value,
  label,
  ratio,
}: {
  value: string
  label: string
  ratio: number
}) {
  const size = 92
  const stroke = 11
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const gid = useId()

  return (
    <div className="flex shrink-0 flex-col items-center gap-2">
      <span className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" aria-hidden>
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--ck-cyan)" />
              <stop offset="100%" stopColor="var(--ck-blue)" />
            </linearGradient>
          </defs>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke="var(--ck-track)"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={`url(#${gid})`}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${(circ * ratio) / 100} ${circ}`}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[24px] leading-none font-bold text-(--ck-title) tabular-nums">
          {value}
        </span>
      </span>
      <span className="text-[13px] leading-none text-(--text-secondary)">{label}</span>
    </div>
  )
}

/** 专项任务的数值卡：圆点 + 标签 + 大数字 + 下方点阵进度 */
export function SpecialStatCard({ stat }: { stat: SpecialTaskStat }) {
  const color = `var(${TONE_VAR[stat.tone] ?? '--ck-cyan'})`
  const dots = 26
  const filled = Math.round((dots * stat.ratio) / 100)

  return (
    <div
      className="flex min-w-0 flex-1 flex-col gap-2 rounded-[10px] px-3 py-2.5"
      style={{
        border: '1px solid var(--ck-card-border)',
        background: 'linear-gradient(135deg, var(--ck-card-from), var(--ck-card-to))',
        boxShadow: 'var(--ck-card-shadow)',
      }}
    >
      <span className="flex items-center gap-1.5">
        <span
          className="h-[7px] w-[7px] shrink-0 rounded-full"
          style={{ background: color }}
          aria-hidden
        />
        <span className="truncate text-[13px] leading-none text-(--text-secondary)">
          {stat.label}
        </span>
      </span>
      <span className="ck-glow-num text-[24px] leading-none font-bold text-(--ck-title) tabular-nums">
        {stat.value}
      </span>
      <span className="flex gap-[2px]" aria-hidden>
        {Array.from({ length: dots }, (_, i) => (
          <span
            key={i}
            className="h-[9px] min-w-0 flex-1 rounded-[1px]"
            style={{
              background:
                i < filled ? color : 'color-mix(in srgb, var(--text-tertiary) 22%, transparent)',
            }}
          />
        ))}
      </span>
    </div>
  )
}
