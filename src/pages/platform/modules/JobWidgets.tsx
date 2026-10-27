import ReactECharts from 'echarts-for-react'
import { useId } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

import type { JobIconStat, JobPedestalStat, JobReportGauge } from './jobData'

/* ═══════════ 作业管理平台专用的小部件（浅蓝白风格） ═══════════ */

/** React 19 的 `useId()` 形如 `«r0»`，去掉非字母数字再拼 SVG 渐变 id */
function svgId(raw: string) {
  return raw.replace(/[^a-zA-Z0-9]/g, '')
}

/**
 * 子区块卡：浅蓝底的圆角卡片，顶部是一条蓝色标题带。
 *
 * 「共享财务」面板内的每个三级区块（单据完成量／月末结账情况 …）都用它包一层，
 * 白卡片浮在浅蓝面板上，分栏边界清楚，也对上浅蓝白参考图的层次。
 */
export function Block({
  title,
  extra,
  className = '',
  bodyClassName = '',
  children,
}: {
  title?: ReactNode
  extra?: ReactNode
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
      {title ? (
        <header
          className="flex shrink-0 items-center justify-between gap-2 px-2.5 py-[6px]"
          style={{
            background: 'linear-gradient(90deg, var(--job-head-from) 0%, var(--job-head-to) 86%)',
            borderBottom: '1px solid var(--job-head-rule)',
          }}
        >
          <span className="flex min-w-0 items-center gap-1.5">
            <i
              className="h-[14px] w-[3px] shrink-0 rounded-full"
              style={{ background: 'linear-gradient(180deg, var(--ck-blue), var(--ck-cyan))' }}
              aria-hidden
            />
            <span className="truncate text-[14px] leading-none font-semibold text-(--ck-title)">
              {title}
            </span>
          </span>
          {extra}
        </header>
      ) : null}

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

/** 「全业务流程」胶囊按钮（主色渐变实心），跳转到业务流程大屏 */
export function FullFlowButton() {
  const navigate = useNavigate()

  return (
    <button
      type="button"
      onClick={() => navigate('/business-flow')}
      className="flex cursor-pointer items-center gap-1.5 rounded-[6px] px-3 py-[6px] text-[13px] leading-none font-medium text-white transition-opacity hover:opacity-85"
      style={{
        background: 'linear-gradient(90deg, var(--ck-btn-from), var(--ck-btn-to))',
        boxShadow: '0 3px 8px rgba(42, 102, 232, 0.28)',
      }}
    >
      <i className="ri-organization-chart text-[14px]" aria-hidden />
      全业务流程
    </button>
  )
}

/**
 * 立体图标：方形玻璃块 + 底下一圈发光椭圆托盘。
 *
 * 对应目标稿里数字左侧那颗「悬浮在光盘上的小方块」。
 * 浅蓝白主题不做霓虹发光，靠渐变 + 柔投影撑出体积感。
 */
function PedestalIcon({ icon, tone, size }: { icon: string; tone: string; size: number }) {
  return (
    <span
      className="relative flex shrink-0"
      style={{ width: size * 1.3, height: size * 1.2 }}
      aria-hidden
    >
      {/* 底座光盘 */}
      <span
        className="absolute bottom-0 left-0 rounded-[50%]"
        style={{
          width: size * 1.3,
          height: size * 0.38,
          background: `radial-gradient(ellipse at 50% 50%, color-mix(in srgb, ${tone} 55%, #ffffff) 0%, color-mix(in srgb, ${tone} 18%, transparent) 70%, transparent 100%)`,
        }}
      />
      {/* 方形图标块 */}
      <span
        className="absolute top-0 left-1/2 flex items-center justify-center rounded-[12px] text-white"
        style={{
          width: size,
          height: size,
          marginLeft: -size / 2,
          fontSize: size * 0.5,
          background: `linear-gradient(145deg, color-mix(in srgb, ${tone} 55%, #ffffff) 0%, ${tone} 100%)`,
          boxShadow: `0 6px 14px color-mix(in srgb, ${tone} 38%, transparent), inset 0 1px 0 rgba(255,255,255,0.55)`,
        }}
      >
        <i className={icon} />
      </span>
    </span>
  )
}

/** 带立体图标的数字指标（单据接收量 / 待处理单据量 …） */
export function IconStat({ item }: { item: JobIconStat }) {
  const tone = `var(${item.colorVar})`

  return (
    <div className="flex items-center gap-3">
      <PedestalIcon icon={item.icon} tone={tone} size={44} />

      <span className="flex min-w-0 flex-col gap-2">
        <span className="truncate text-[14px] leading-none text-(--text-secondary)">
          {item.label}
        </span>
        <span className="flex items-baseline gap-0.5">
          <span className="ck-glow-num text-[32px] leading-none font-bold" style={{ color: tone }}>
            {item.value}
          </span>
          <span className="text-[13px] leading-none text-(--text-tertiary)">{item.unit}</span>
        </span>
      </span>
    </div>
  )
}

/**
 * 月末结账情况：标题 + 数值 + 倒锥形光束落在立体圆柱底座上。
 *
 * 目标稿这里是「光锥 / 漏斗」而不是扁圆盘：
 * 上宽下窄的光束把视线收到底座上，底座是两级圆柱（上柱 + 下托盘）。
 */
export function PedestalStat({ item }: { item: JobPedestalStat }) {
  const gid = svgId(useId())

  return (
    <div className="flex min-w-0 flex-1 flex-col items-center">
      <span className="text-center text-[13px] leading-[1.45] whitespace-pre-line text-(--text-secondary)">
        {item.label}
      </span>

      <span className="flex items-baseline gap-0.5 pt-1.5">
        <span className="ck-glow-num text-[30px] leading-none font-bold text-(--ck-cyan)">
          {item.value}
        </span>
        <span className="text-[13px] leading-none text-(--text-tertiary)">{item.unit}</span>
      </span>

      <svg
        viewBox="0 0 128 100"
        className="mt-1 w-full max-w-[132px] min-h-0 flex-1"
        preserveAspectRatio="xMidYMax meet"
        aria-hidden
      >
        <defs>
          {/* 光锥：顶部化进卡片底色 → 底部收到主蓝 */}
          <linearGradient id={`cone-${gid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--ck-teal)" stopOpacity="0.28" />
            <stop offset="48%" stopColor="var(--ck-blue)" stopOpacity="0.62" />
            <stop offset="100%" stopColor="var(--ck-cyan)" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id={`top-${gid}`} x1="0.1" y1="0" x2="0.9" y2="1">
            <stop offset="0%" stopColor="var(--job-pedestal-top)" />
            <stop offset="100%" stopColor="var(--ck-cyan)" />
          </linearGradient>
          <linearGradient id={`side-${gid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--job-pedestal-side)" />
            <stop offset="100%" stopColor="var(--ck-cyan)" stopOpacity="0.72" />
          </linearGradient>
        </defs>

        {/* 地面投影 */}
        <ellipse cx="64" cy="93" rx="50" ry="6" fill="var(--ck-cyan)" opacity="0.12" />

        {/* 倒锥光束：上宽下窄，正好收束落在上层圆柱的中心 */}
        <path d="M16 4 L112 4 L78 59 L50 59 Z" fill={`url(#cone-${gid})`} />
        <path
          d="M16 4 L50 59 M112 4 L78 59"
          stroke="var(--ck-teal)"
          strokeWidth="1.5"
          opacity="0.9"
          fill="none"
        />

        {/* 下层托盘（实心，承托整个造型） */}
        <path d="M22 78v8a42 11 0 0 0 84 0v-8Z" fill={`url(#side-${gid})`} />
        <ellipse cx="64" cy="78" rx="42" ry="11" fill={`url(#top-${gid})`} />

        {/* 上层圆柱 */}
        <path d="M40 60v9a24 7 0 0 0 48 0v-9Z" fill={`url(#side-${gid})`} />
        <ellipse cx="64" cy="60" rx="24" ry="7" fill={`url(#top-${gid})`} />
        <ellipse cx="64" cy="59" rx="13" ry="3.6" fill="#ffffff" opacity="0.45" />
      </svg>
    </div>
  )
}

const GAUGE_SCALE = ['0', '0.2', '0.4', '0.6', '0.8', '1']
const TICK_COUNT = 41

/** 报表出具情况：半圆刻度仪表盘（0–1 刻度 + 指针）+ 出具量明细 */
export function ReportGauge({ item }: { item: JobReportGauge }) {
  const completedTone = 'var(--ck-green)'
  const cx = 84
  const cy = 86
  const active = Math.round((item.rate / 100) * (TICK_COUNT - 1))
  const needleDeg = 180 - 1.8 * item.rate
  const hub = polar(cx, cy, 13, needleDeg)
  const tip = polar(cx, cy, 52, needleDeg)

  return (
    <div className="flex min-w-0 flex-1 flex-col items-center">
      <div className="relative h-[96px] w-[168px] shrink-0">
        <svg viewBox="0 0 168 96" className="h-full w-full" aria-hidden>
          {Array.from({ length: TICK_COUNT }, (_, i) => {
            const major = i % 5 === 0
            const a = 180 - i * (180 / (TICK_COUNT - 1))
            const p1 = polar(cx, cy, major ? 66 : 71, a)
            const p2 = polar(cx, cy, 79, a)
            return (
              <line
                key={i}
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke={i <= active ? completedTone : 'var(--ck-track)'}
                strokeWidth={major ? 2.8 : 1.5}
                strokeLinecap="round"
              />
            )
          })}

          {/* 进度弧：目标稿是点状弧，不是实线 */}
          <path
            d={arcPath(cx, cy, 57, 180, 0)}
            fill="none"
            stroke="var(--ck-track)"
            strokeWidth="3.6"
            strokeLinecap="round"
            strokeDasharray="0.1 6"
          />
          <path
            d={arcPath(cx, cy, 57, 180, needleDeg)}
            fill="none"
            stroke="var(--ck-blue)"
            strokeWidth="3.6"
            strokeLinecap="round"
            strokeDasharray="0.1 6"
          />

          {GAUGE_SCALE.map((text, i) => {
            const p = polar(cx, cy, 44, 180 - i * 36)
            return (
              <text
                key={text}
                x={p.x}
                y={p.y + 4}
                textAnchor="middle"
                fontSize="10"
                fill="var(--text-tertiary)"
              >
                {text}
              </text>
            )
          })}

          {/* 指针：细线，根部从圆心让开，避免压住中间的数值 */}
          <line
            x1={hub.x}
            y1={hub.y}
            x2={tip.x}
            y2={tip.y}
            stroke={completedTone}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>

        <span className="absolute inset-x-0 bottom-0 text-center text-[24px] leading-none font-bold text-(--ck-title)">
          {item.rate.toFixed(1)}%
        </span>
      </div>

      <span className="w-full truncate pt-2 text-center text-[13px] leading-none text-(--text-secondary)">
        {item.label}
      </span>

      <div className="flex w-full flex-col gap-1.5 pt-2">
        <GaugeRow label="已出具量" value={item.issued} tone={completedTone} />
        <GaugeRow label="待出具量" value={item.pending} tone="var(--ck-red)" />
      </div>
    </div>
  )
}

function GaugeRow({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <span
      className="flex items-center gap-1.5 rounded-[6px] border border-(--job-inset-border) px-2 py-[7px]"
      style={{ background: 'var(--job-inset-bg)' }}
    >
      <i className="h-[7px] w-[7px] shrink-0 rounded-full" style={{ background: tone }} />
      <span className="flex-1 truncate text-[13px] leading-none text-(--text-secondary)">
        {label}
      </span>
      <span className="ck-glow-num text-[15px] leading-none font-semibold text-(--ck-title)">
        {value}
      </span>
    </span>
  )
}

/** 协同退回情况的横条卡：立体图标 + 大数字 */
export function ReturnCard({ item }: { item: JobIconStat }) {
  const tone = `var(${item.colorVar})`

  return (
    <div
      className="flex min-h-0 flex-1 items-center gap-3 rounded-[10px] border border-(--job-inset-border) px-3"
      style={{ background: 'var(--job-inset-bg)' }}
    >
      <PedestalIcon icon={item.icon} tone={tone} size={44} />

      <span className="flex min-w-0 flex-col gap-2">
        <span className="truncate text-[14px] leading-none text-(--text-secondary)">
          {item.label}
        </span>
        <span className="flex items-baseline gap-0.5">
          <span className="ck-glow-num text-[30px] leading-none font-bold" style={{ color: tone }}>
            {item.value}
          </span>
          <span className="text-[13px] leading-none text-(--text-tertiary)">{item.unit}</span>
        </span>
      </span>
    </div>
  )
}

/** 底部开口 270° 进度圆环 */
export function RingGauge({
  value,
  label,
  from,
  to,
  size = 126,
}: {
  value: number
  label: string
  from: string
  to: string
  size?: number
}) {
  const gid = svgId(useId())
  const stroke = 13
  const r = size / 2 - stroke / 2 - 1
  const circ = 2 * Math.PI * r
  const sweep = circ * 0.75

  return (
    <div className="flex shrink-0 flex-col items-center gap-1.5" style={{ width: size + 8 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
        <defs>
          <linearGradient id={`ring-${gid}`} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--ck-track)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${sweep} ${circ}`}
          transform={`rotate(135 ${size / 2} ${size / 2})`}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#ring-${gid})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${(sweep * value) / 100} ${circ}`}
          transform={`rotate(135 ${size / 2} ${size / 2})`}
        />
        <text
          x={size / 2}
          y={size / 2 + 9}
          textAnchor="middle"
          fontSize="25"
          fontWeight="700"
          fill="var(--ck-title)"
          fontFamily="Noto Sans SC, sans-serif"
        >
          {value.toFixed(1)}%
        </text>
      </svg>

      <span className="text-center text-[13px] leading-tight text-(--text-secondary)">{label}</span>
    </div>
  )
}

/* ───────────── 几何小工具 ───────────── */

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) }
}

function arcPath(cx: number, cy: number, r: number, fromDeg: number, toDeg: number) {
  const a = polar(cx, cy, r, fromDeg)
  const b = polar(cx, cy, r, toDeg)
  const large = Math.abs(fromDeg - toDeg) > 180 ? 1 : 0
  return `M${a.x} ${a.y}A${r} ${r} 0 ${large} 1 ${b.x} ${b.y}`
}
