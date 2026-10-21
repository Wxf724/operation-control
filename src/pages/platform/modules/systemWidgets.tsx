import ReactECharts from 'echarts-for-react'
import { useId } from 'react'

import type { SystemPedestalStat, SystemPlateStat, SystemRateItem } from './systemData'

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

/** 指标下方的说明文字，支持 `\n` 换行 */
function RateCaption({ label }: { label: string }) {
  return (
    <span className="mt-1.5 text-center text-[13px] leading-[1.35] whitespace-pre-line text-(--ck-title-sub)">
      {label}
    </span>
  )
}

/** 整圈环形图：网络连通成功率这类 */
export function RingStat({ item, size = 84 }: { item: SystemRateItem; size?: number }) {
  const thickness = 13
  const r = (size - thickness) / 2
  const circumference = 2 * Math.PI * r
  const gradientId = `ck-sys-ring${useId().replace(/:/g, '')}`

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={`var(${item.colorVar})`} stopOpacity="1" />
              <stop offset="100%" stopColor={`var(${item.colorVar})`} stopOpacity="0.45" />
            </linearGradient>
          </defs>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke="var(--ck-track)"
            strokeWidth={thickness}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={`url(#${gradientId})`}
            strokeWidth={thickness}
            strokeDasharray={`${(circumference * item.value) / 100} ${circumference}`}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[18px] leading-none font-bold text-(--foreground)">
          {item.display}
        </span>
      </div>
      <RateCaption label={item.label} />
    </div>
  )
}

/** 底部开口的进度圆环：核心功能操作稳定性第一排 */
export function ArcGauge({ item, size = 84 }: { item: SystemRateItem; size?: number }) {
  const thickness = 11
  const sweep = 0.78
  const r = (size - thickness) / 2
  const circumference = 2 * Math.PI * r
  const rotate = 90 + 360 * ((1 - sweep) / 2)
  const color = `var(${item.colorVar})`

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke="var(--ck-track)"
            strokeWidth={thickness}
            strokeLinecap="round"
            strokeDasharray={`${circumference * sweep} ${circumference}`}
            transform={`rotate(${rotate} ${size / 2} ${size / 2})`}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={color}
            strokeWidth={thickness}
            strokeLinecap="round"
            strokeDasharray={`${circumference * sweep * (item.value / 100)} ${circumference}`}
            transform={`rotate(${rotate} ${size / 2} ${size / 2})`}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[16px] leading-none font-bold text-(--foreground)">
          {item.display}
        </span>
      </div>
      <RateCaption label={item.label} />
    </div>
  )
}

/** 液面填充球：核心功能操作稳定性第二排 */
export function LiquidBall({ item, size = 80 }: { item: SystemRateItem; size?: number }) {
  const r = size / 2 - 3
  const cx = size / 2
  const level = size / 2 - r + 2 * r * (1 - item.value / 100)
  const clipId = `ck-sys-ball${useId().replace(/:/g, '')}`
  const color = `var(${item.colorVar})`
  const wave = `M0 ${level} q ${size / 4} -5 ${size / 2} 0 t ${size / 2} 0 V ${size} H0 Z`

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
          <defs>
            <clipPath id={clipId}>
              <circle cx={cx} cy={cx} r={r} />
            </clipPath>
          </defs>
          <circle cx={cx} cy={cx} r={r} fill="var(--ck-panel-inner)" />
          <g clipPath={`url(#${clipId})`}>
            {/* 浅色主题下液面压淡，中间的深色数字才有对比 */}
            <rect x={0} y={level} width={size} height={size} fill={color} opacity="0.5" />
            <path d={wave} fill={color} opacity="0.3" />
          </g>
          <circle
            cx={cx}
            cy={cx}
            r={r}
            stroke={color}
            strokeWidth={2}
          />
        </svg>
        <span
          className="absolute inset-0 flex items-center justify-center text-[15px] leading-none font-bold"
          style={{ color: 'var(--foreground)' }}
        >
          {item.display}
        </span>
      </div>
      <RateCaption label={item.label} />
    </div>
  )
}

/** 刻度带取色：红 → 橙 → 黄 → 绿 */
function rampColor(t: number) {
  const stops = ['--ck-red', '--ck-orange', '--ck-yellow', '--ck-green']
  const span = stops.length - 1
  const seg = Math.min(Math.floor(t * span), span - 1)
  const local = Math.round((t * span - seg) * 100)
  return `color-mix(in srgb, var(${stops[seg + 1]}) ${local}%, var(${stops[seg]}))`
}

/** 彩色半圆仪表盘：资源承载率 / 业务承载率 */
export function ColorHalfGauge({ label, value }: { label: string; value: number }) {
  const width = 196
  const cx = width / 2
  const cy = 104
  const bandIn = 60
  const bandOut = 76
  const segments = 48
  const ticks = 40
  const needle = Math.PI + (Math.PI * value) / 100

  return (
    <div className="flex flex-col items-center">
      <svg width={width} height={cy + 8} viewBox={`0 0 ${width} ${cy + 8}`} fill="none">
        {Array.from({ length: ticks + 1 }, (_, i) => {
          const a = Math.PI + (Math.PI * i) / ticks
          const long = i % 5 === 0
          return (
            <line
              key={`t${i}`}
              x1={cx + (bandOut + 4) * Math.cos(a)}
              y1={cy + (bandOut + 4) * Math.sin(a)}
              x2={cx + (bandOut + (long ? 13 : 8)) * Math.cos(a)}
              y2={cy + (bandOut + (long ? 13 : 8)) * Math.sin(a)}
              stroke="var(--ck-blue)"
              strokeWidth={long ? 2.4 : 1.4}
              opacity={long ? 0.85 : 0.45}
            />
          )
        })}

        {Array.from({ length: segments }, (_, i) => {
          const a0 = Math.PI + (Math.PI * i) / segments
          const a1 = Math.PI + (Math.PI * (i + 0.86)) / segments
          const d = [
            `M ${cx + bandOut * Math.cos(a0)} ${cy + bandOut * Math.sin(a0)}`,
            `A ${bandOut} ${bandOut} 0 0 1 ${cx + bandOut * Math.cos(a1)} ${cy + bandOut * Math.sin(a1)}`,
            `L ${cx + bandIn * Math.cos(a1)} ${cy + bandIn * Math.sin(a1)}`,
            `A ${bandIn} ${bandIn} 0 0 0 ${cx + bandIn * Math.cos(a0)} ${cy + bandIn * Math.sin(a0)}`,
            'Z',
          ].join(' ')
          return <path key={`b${i}`} d={d} fill={rampColor(i / (segments - 1))} opacity="0.95" />
        })}

        {Array.from({ length: segments }, (_, i) => {
          const a = Math.PI + (Math.PI * (i + 0.5)) / segments
          return (
            <circle
              key={`d${i}`}
              cx={cx + (bandIn - 7) * Math.cos(a)}
              cy={cy + (bandIn - 7) * Math.sin(a)}
              r={1.6}
              fill={rampColor(i / (segments - 1))}
              opacity="0.9"
            />
          )
        })}

        <line
          x1={cx}
          y1={cy}
          x2={cx + (bandIn - 4) * Math.cos(needle)}
          y2={cy + (bandIn - 4) * Math.sin(needle)}
          stroke="var(--ck-blue)"
          strokeWidth={2.4}
          strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r={5} fill="var(--ck-blue)" />
        <circle cx={cx} cy={cy} r={8.5} stroke="var(--ck-blue)" strokeOpacity="0.4" />
      </svg>

      <span className="ck-glow-num -mt-1 text-[32px] leading-none font-bold text-(--ck-cyan)">
        {value}%
      </span>
      <span className="mt-2 text-[15px] leading-none text-(--foreground)">{label}</span>
    </div>
  )
}

/** 图标 + 发光底盘 */
function IconPlate({ icon }: { icon: string }) {
  return (
    <span className="relative flex h-[42px] w-[46px] shrink-0 items-end justify-center">
      <svg
        className="absolute bottom-0 left-0"
        width="46"
        height="15"
        viewBox="0 0 46 15"
        fill="none"
        aria-hidden
      >
        <ellipse cx="23" cy="7.5" rx="20" ry="6" fill="var(--ck-blue)" opacity="0.26" />
        <ellipse cx="23" cy="7.5" rx="20" ry="6" stroke="var(--ck-cyan)" strokeOpacity="0.5" />
      </svg>
      <i className={`${icon} relative mb-[3px] text-[24px] text-(--ck-cyan)`} aria-hidden />
    </span>
  )
}

/** 图标 + 标签 + 数字的卡片，`stacked` 时标签在上、数字在下 */
export function PlateCard({
  stat,
  stacked = false,
  className = '',
}: {
  stat: SystemPlateStat
  stacked?: boolean
  className?: string
}) {
  return (
    <div
      className={`flex items-center gap-2.5 rounded-[10px] border border-(--ck-card-border) px-3 ${className}`}
      style={{
        background: 'linear-gradient(180deg, var(--ck-card-from) 0%, var(--ck-card-to) 100%)',
        boxShadow: 'var(--ck-card-shadow)',
      }}
    >
      <IconPlate icon={stat.icon} />
      {stacked ? (
        <span className="flex min-w-0 flex-col gap-2.5">
          <span className="truncate text-[15px] leading-none text-(--foreground)">
            {stat.label}
          </span>
          <span className="flex items-baseline gap-1">
            <span className="ck-glow-num text-[26px] leading-none font-bold text-(--ck-cyan)">
              {stat.value}
            </span>
            <span className="text-[12px] text-(--text-secondary)">{stat.unit}</span>
          </span>
        </span>
      ) : (
        <span className="flex min-w-0 items-baseline gap-1.5">
          <span className="truncate text-[15px] leading-none text-(--foreground)">
            {stat.label}
          </span>
          <span className="ck-glow-num text-[24px] leading-none font-bold text-(--ck-cyan)">
            {stat.value}
          </span>
          <span className="text-[12px] text-(--text-secondary)">{stat.unit}</span>
        </span>
      )}
    </div>
  )
}

/** 标题在上、玻璃底座上托一个数字 */
export function PedestalStat({
  stat,
  icon = 'ri-time-line',
}: {
  stat: SystemPedestalStat
  icon?: string
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-center text-[14px] leading-[1.35] whitespace-pre-line text-(--ck-title-sub)">
        {stat.label}
      </span>
      <span className="flex items-center gap-1.5">
        <IconPlate icon={icon} />
        <span className="ck-glow-num text-[26px] leading-none font-bold text-(--foreground)">
          {stat.value}
        </span>
        <span className="text-[13px] text-(--ck-cyan)">{stat.unit}</span>
      </span>
      <span
        className="h-[6px] w-[150px] rounded-full"
        style={{
          background:
            'linear-gradient(90deg, transparent, var(--ck-panel-border) 25%, var(--ck-panel-border) 75%, transparent)',
        }}
      />
    </div>
  )
}
