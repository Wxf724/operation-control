import ReactECharts from 'echarts-for-react'
import { useId } from 'react'
import type { ReactNode } from 'react'

import type { ArchiveRing, ArchiveTone } from './archiveData'
import { ARCHIVE_TONE } from './archiveTone'

/* ═══════════ 档案业务管理平台专用的小部件（浅蓝白风格） ═══════════ */

/** React 19 的 `useId()` 形如 `«r0»`，去掉非字母数字再拼 SVG 渐变 id（中文/符号会被正则抹空而撞车） */
function svgId(raw: string) {
  return raw.replace(/[^a-zA-Z0-9]/g, '')
}

/**
 * 内容卡：白→浅蓝竖向渐变的圆角卡片 + 柔和蓝投影。
 *
 * 和作业管理平台的 `Block` 同一套观感（大圆角白卡浮在浅蓝面板上），
 * 保证两页并排看时层次语言一致。档案页的层级靠面板里的 ◆ 小标题区分，
 * 卡片本身不再带标题带。
 */
export function Card({
  className = '',
  bodyClassName = '',
  children,
}: {
  className?: string
  bodyClassName?: string
  children: ReactNode
}) {
  return (
    <section
      className={`flex min-h-0 flex-col overflow-hidden rounded-[10px] border border-(--ck-card-border) ${className}`}
      style={{
        background: 'linear-gradient(180deg, var(--ck-card-from) 0%, var(--ck-card-to) 100%)',
        boxShadow: 'var(--ck-card-shadow)',
      }}
    >
      <div className={`flex min-h-0 flex-1 ${bodyClassName}`}>{children}</div>
    </section>
  )
}

/** 撑满父容器的 ECharts 容器 */
export function Chart({ option }: { option: object }) {
  return (
    <div className="min-h-0 min-w-0 flex-1">
      <ReactECharts
        option={option}
        style={{ height: '100%', width: '100%' }}
        opts={{ renderer: 'canvas' }}
        notMerge
      />
    </div>
  )
}

/**
 * 环形指标：整圈底槽 + 渐变进度弧 + 环心数值，标签在下方。
 *
 * 手写 SVG，不起 ECharts 实例——这类小环图用图表引擎既重又难对齐环心文字。
 */
export function Ring({
  ring,
  size = 96,
  stroke = 10,
  labelWidth = 120,
  icon,
}: {
  ring: ArchiveRing
  size?: number
  stroke?: number
  /** 标签最大宽度，窄栏里把长标签折成两行 */
  labelWidth?: number
  /** 给了就用图标占环心（代打印横幅卡那种纯进度环） */
  icon?: string
}) {
  const gid = svgId(useId())
  const tone = ARCHIVE_TONE[ring.tone]
  const r = size / 2 - stroke / 2 - 1
  const circ = 2 * Math.PI * r
  const valueSize = Math.max(14, Math.round(size * 0.21))

  return (
    <div className="flex shrink-0 flex-col items-center gap-1.5">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
          <defs>
            <linearGradient id={`arc-${gid}`} x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor={tone.from} />
              <stop offset="100%" stopColor={tone.to} />
            </linearGradient>
          </defs>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--ck-track)"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={`url(#arc-${gid})`}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${(circ * ring.ratio) / 100} ${circ}`}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>

        {/* 环心内容：外层负责居中，内层按基线对齐数值与单位 */}
        <span className="absolute inset-0 flex items-center justify-center">
          {icon ? (
            <i
              className={`${icon} leading-none text-(--ck-cyan)`}
              style={{ fontSize: Math.round(size * 0.42) }}
              aria-hidden
            />
          ) : (
            <span className="flex items-baseline gap-[1px]">
              <span
                className="ck-glow-num leading-none font-bold text-(--ck-title)"
                style={{ fontSize: valueSize }}
              >
                {ring.text}
              </span>
              {ring.unit ? (
                <span
                  className="leading-none font-semibold text-(--ck-title)"
                  style={{ fontSize: Math.round(valueSize * 0.56) }}
                >
                  {ring.unit}
                </span>
              ) : null}
            </span>
          )}
        </span>
      </div>

      {ring.label ? (
        <span
          className="text-center text-[12px] leading-[1.3] text-(--text-secondary)"
          style={{ maxWidth: labelWidth }}
        >
          {ring.label}
        </span>
      ) : null}
    </div>
  )
}

/**
 * 立体图标：方形玻璃块 + 底下一圈发光椭圆托盘。
 *
 * 与作业管理平台的立体图标同款，浅蓝白主题不做霓虹发光，靠渐变 + 柔投影撑体积感。
 */
export function PedestalIcon({
  icon,
  tone = 'blue',
  size = 44,
}: {
  icon: string
  tone?: ArchiveTone
  size?: number
}) {
  const color = ARCHIVE_TONE[tone].solid

  return (
    <span
      className="relative flex shrink-0"
      style={{ width: size * 1.3, height: size * 1.2 }}
      aria-hidden
    >
      <span
        className="absolute bottom-0 left-0 rounded-[50%]"
        style={{
          width: size * 1.3,
          height: size * 0.38,
          background: `radial-gradient(ellipse at 50% 50%, color-mix(in srgb, ${color} 55%, #ffffff) 0%, color-mix(in srgb, ${color} 18%, transparent) 70%, transparent 100%)`,
        }}
      />
      <span
        className="absolute top-0 left-1/2 flex items-center justify-center rounded-[12px] text-white"
        style={{
          width: size,
          height: size,
          marginLeft: -size / 2,
          fontSize: size * 0.5,
          background: `linear-gradient(145deg, color-mix(in srgb, ${color} 55%, #ffffff) 0%, ${color} 100%)`,
          boxShadow: `0 6px 14px color-mix(in srgb, ${color} 38%, transparent), inset 0 1px 0 rgba(255,255,255,0.55)`,
        }}
      >
        <i className={icon} />
      </span>
    </span>
  )
}

/** 立体底座上的数字：数值 + 两级椭圆托盘 + 标签 */
export function PedestalStat({
  value,
  unit,
  label,
  tone = 'blue',
}: {
  value: string
  unit: string
  label: string
  tone?: ArchiveTone
}) {
  const gid = svgId(useId())
  const color = ARCHIVE_TONE[tone].solid

  return (
    <div className="flex shrink-0 flex-col items-center gap-1">
      <span className="flex items-baseline gap-0.5">
        <span className="ck-glow-num text-[26px] leading-none font-bold" style={{ color }}>
          {value}
        </span>
        <span className="text-[12px] leading-none text-(--text-tertiary)">{unit}</span>
      </span>

      <svg width="92" height="40" viewBox="0 0 92 40" aria-hidden>
        <defs>
          <linearGradient id={`top-${gid}`} x1="0.1" y1="0" x2="0.9" y2="1">
            <stop offset="0%" stopColor="var(--ck-blue)" />
            <stop offset="100%" stopColor="var(--ck-cyan)" />
          </linearGradient>
          <linearGradient id={`side-${gid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--ck-cyan)" />
            <stop offset="100%" stopColor="var(--ck-cyan)" stopOpacity="0.68" />
          </linearGradient>
        </defs>

        {/* 地面投影 */}
        <ellipse cx="46" cy="34" rx="34" ry="5" fill="var(--ck-cyan)" opacity="0.12" />

        {/* 下层托盘 */}
        <path d="M14 22v6a32 9 0 0 0 64 0v-6Z" fill={`url(#side-${gid})`} />
        <ellipse cx="46" cy="22" rx="32" ry="9" fill={`url(#top-${gid})`} />

        {/* 上层圆柱 */}
        <path d="M28 10v5a18 5 0 0 0 36 0v-5Z" fill={`url(#side-${gid})`} />
        <ellipse cx="46" cy="10" rx="18" ry="5" fill={`url(#top-${gid})`} />
        <ellipse cx="46" cy="9.4" rx="9" ry="2.6" fill="#ffffff" opacity="0.45" />
      </svg>

      <span className="text-center text-[12px] leading-none text-(--text-secondary)">{label}</span>
    </div>
  )
}

/** 色点 + 标签 + 数值的图例行 */
export function LegendNum({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone: ArchiveTone
}) {
  const color = ARCHIVE_TONE[tone].solid

  return (
    <span className="flex items-center gap-2 whitespace-nowrap">
      <i className="h-[7px] w-[7px] shrink-0 rounded-full" style={{ background: color }} />
      <span className="text-[12px] leading-none text-(--text-secondary)">{label}</span>
      <span className="ck-glow-num text-[20px] leading-none font-bold" style={{ color }}>
        {value}
      </span>
    </span>
  )
}

/** 横条数字卡：左标签右数值，右侧可带色点 */
export function StatRow({
  label,
  value,
  unit,
  tone,
  dot = false,
  className = '',
}: {
  label: string
  value: string
  unit: string
  tone: ArchiveTone
  /** 标签前是否加色点（单据签收的两张卡用） */
  dot?: boolean
  className?: string
}) {
  const color = ARCHIVE_TONE[tone].solid

  return (
    <Card className={className} bodyClassName="items-center gap-2 px-3 py-2">
      {dot ? (
        <i className="h-[7px] w-[7px] shrink-0 rounded-full" style={{ background: color }} />
      ) : null}
      <span className="min-w-0 flex-1 truncate text-[13px] leading-none text-(--text-secondary)">
        {label}
      </span>
      <span className="flex shrink-0 items-baseline gap-0.5">
        <span className="ck-glow-num text-[22px] leading-none font-bold" style={{ color }}>
          {value}
        </span>
        <span className="text-[12px] leading-none text-(--text-tertiary)">{unit}</span>
      </span>
    </Card>
  )
}

/** 页签按钮组：只切高亮，不切数据 */
export function TabGroup({
  tabs,
  active,
  onChange,
}: {
  tabs: readonly string[]
  active: number
  onChange: (index: number) => void
}) {
  return (
    <div className="flex items-center gap-1.5">
      {tabs.map((label, i) => (
        <button
          key={label}
          type="button"
          onClick={() => onChange(i)}
          className={`cursor-pointer rounded-[6px] border px-2.5 py-[5px] text-[12px] leading-none transition-colors ${
            i === active
              ? 'border-transparent text-white'
              : 'border-(--ck-card-border) text-(--text-secondary)'
          }`}
          style={
            i === active
              ? {
                  background: 'linear-gradient(90deg, var(--ck-btn-from), var(--ck-btn-to))',
                  boxShadow: '0 3px 8px rgba(42, 102, 232, 0.28)',
                }
              : { background: 'var(--ck-panel-bg-strong)' }
          }
        >
          {label}
        </button>
      ))}
    </div>
  )
}
