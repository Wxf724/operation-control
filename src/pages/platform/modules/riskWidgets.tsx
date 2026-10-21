import { useId } from 'react'
import type { ReactNode } from 'react'

import { RISK_COCKPIT_TABS, RISK_COCKPIT_TITLE } from './riskData'
import type { RiskAlertRow, RiskFlowStep, RiskOverviewStat, RiskTypeItem } from './riskData'

/* ═══════════ 风险管理平台专用小部件（浅蓝白风格） ═══════════ */

/** React 19 的 `useId()` 形如 `«r0»`，去掉非字母数字再拼 SVG 渐变 id */
function svgId(raw: string) {
  return raw.replace(/[^a-zA-Z0-9]/g, '')
}

/**
 * 整圆进度环（左栏四个大环形图）。
 *
 * 手写内联 SVG，不起 ECharts 实例：这里只有一个百分比，
 * 起实例既要等容器尺寸回调、又要走色值解析，纯属给自己挖坑。
 * 渐变 id 用 `useId()` 生成，避免多个环互相覆盖。
 */
export function RiskRing({
  value,
  label,
  from,
  to,
  size = 112,
  /** 环心是否铺一层淡色底（目标稿上半两个环是实心感） */
  filled = false,
}: {
  value: number
  label: string
  from: string
  to: string
  size?: number
  filled?: boolean
}) {
  const gid = svgId(useId())
  const stroke = 15
  const r = size / 2 - stroke / 2 - 1
  const circ = 2 * Math.PI * r

  return (
    <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-2">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
        <defs>
          <linearGradient id={`rring-${gid}`} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
        </defs>

        {filled ? (
          <circle cx={size / 2} cy={size / 2} r={r - stroke / 2} fill={from} opacity="0.16" />
        ) : null}

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
          stroke={`url(#rring-${gid})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${(circ * value) / 100} ${circ}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <text
          x={size / 2}
          y={size / 2 + 8}
          textAnchor="middle"
          fontSize="23"
          fontWeight="700"
          fill="var(--ck-title)"
          fontFamily="Noto Sans SC, sans-serif"
        >
          {value.toFixed(1)}%
        </text>
      </svg>

      <span className="text-center text-[14px] leading-tight text-(--text-secondary)">{label}</span>
    </div>
  )
}

/**
 * 「风险防控平台风险驾驶」胶囊标题。
 *
 * 目标稿里这块的标题不是常规面板标题，而是一枚描边胶囊，所以单独做一个部件，
 * 外层 PanelBox 不传 `title`。
 */
export function CapsuleTitle({ children }: { children: ReactNode }) {
  return (
    <span
      className="inline-flex shrink-0 items-center rounded-[8px] border px-4 py-[8px] text-[16px] leading-none font-semibold text-(--ck-title)"
      style={{
        borderColor: 'var(--ck-marker)',
        background: 'linear-gradient(90deg, rgba(42,102,232,0.14), rgba(93,147,255,0.05))',
      }}
    >
      {children}
    </span>
  )
}

/** 内嵌驾驶舱的「系统标题栏」：圆形标识 + 系统名 + 页签 + 右侧状态 */
export function CockpitChrome() {
  return (
    <header
      className="flex h-[38px] shrink-0 items-center gap-3 rounded-t-[10px] border-b px-3"
      style={{
        background: 'linear-gradient(90deg, rgba(42,102,232,0.16), rgba(42,102,232,0.04))',
        borderColor: 'var(--ck-card-border)',
      }}
    >
      <span className="flex items-center gap-2">
        <i
          className="ri-shield-cross-line flex h-[22px] w-[22px] items-center justify-center rounded-full text-[13px] text-white"
          style={{ background: 'linear-gradient(135deg, var(--ck-blue), var(--ck-cyan))' }}
          aria-hidden
        />
        <span className="text-[14px] leading-none font-semibold text-(--ck-title)">
          {RISK_COCKPIT_TITLE}
        </span>
      </span>

      <nav className="flex min-w-0 flex-1 items-center gap-1.5">
        {RISK_COCKPIT_TABS.map((tab, i) => (
          <span
            key={tab}
            className="rounded-[6px] px-2.5 py-[5px] text-[13px] leading-none"
            style={
              i === 0
                ? { background: 'var(--ck-marker)', color: 'var(--ck-on-solid)' }
                : { color: 'var(--text-secondary)' }
            }
          >
            {tab}
          </span>
        ))}
      </nav>

      <span className="flex shrink-0 items-center gap-3 text-[12px] leading-none text-(--text-tertiary)">
        <span>数据截止 2026-10-21 15:29</span>
        <span className="flex items-center gap-1">
          <i className="ri-user-3-line" aria-hidden />
          管理员
        </span>
      </span>
    </header>
  )
}

/** 驾驶舱概览数字：标签 + 大数字 + 较昨日变化 */
export function OverviewTile({ item }: { item: RiskOverviewStat }) {
  const up = item.trend === 'up'

  return (
    <div
      className="flex min-w-0 flex-1 flex-col justify-center gap-2 rounded-[8px] border px-3 py-2"
      style={{ background: 'var(--job-inset-bg)', borderColor: 'var(--job-inset-border)' }}
    >
      <span className="truncate text-[13px] leading-none text-(--text-secondary)">
        {item.label}
      </span>

      <span className="flex items-baseline gap-0.5">
        <span className="ck-glow-num truncate text-[22px] leading-none font-bold text-(--ck-cyan)">
          {item.value}
        </span>
        {item.unit ? (
          <span className="shrink-0 text-[12px] leading-none text-(--text-tertiary)">
            {item.unit}
          </span>
        ) : null}
      </span>

      <span
        className="flex items-center gap-1 text-[12px] leading-none"
        style={{ color: up ? 'var(--ck-red)' : 'var(--ck-green)' }}
      >
        <i className={up ? 'ri-arrow-up-s-fill' : 'ri-arrow-down-s-fill'} aria-hidden />
        较昨日 {item.delta}
      </span>
    </div>
  )
}

/** 风险类型分布的一条横条：名称 + 进度条 + 数量/占比 */
export function TypeBar({ item }: { item: RiskTypeItem }) {
  const tone = `var(${item.colorVar})`

  return (
    <div className="flex min-h-0 flex-1 flex-col justify-center gap-1.5">
      <span className="flex items-baseline justify-between gap-2">
        <span className="truncate text-[13px] leading-none text-(--text-secondary)">
          {item.name}
        </span>
        <span className="shrink-0 text-[13px] leading-none font-semibold text-(--ck-title)">
          {item.value}
          <span className="pl-1 text-[12px] font-normal text-(--text-tertiary)">
            {item.pct.toFixed(1)}%
          </span>
        </span>
      </span>

      <span
        className="h-[7px] w-full overflow-hidden rounded-full"
        style={{ background: 'var(--ck-track)' }}
      >
        <span
          className="block h-full rounded-full"
          style={{
            width: `${Math.max(item.pct, 2)}%`,
            background: `linear-gradient(90deg, ${tone}, ${tone})`,
            opacity: 0.92,
          }}
        />
      </span>
    </div>
  )
}

/** 重大风险预警列表的表头 */
export function AlertHead() {
  return (
    <div
      className="flex shrink-0 items-center gap-2 rounded-[6px] px-2 py-[6px] text-[12px] leading-none text-(--text-secondary)"
      style={{ background: 'var(--ck-table-head)' }}
    >
      <span className="min-w-0 flex-1">风险单位</span>
      <span className="w-[76px] shrink-0">风险类型</span>
      <span className="w-[58px] shrink-0">等级</span>
      <span className="w-[76px] shrink-0 text-right">预警时间</span>
    </div>
  )
}

/** 重大风险预警列表的一行 */
export function AlertRow({ row, odd }: { row: RiskAlertRow; odd: boolean }) {
  const major = row.level === '重大风险'

  return (
    <div
      className="flex min-h-0 flex-1 items-center gap-2 rounded-[6px] px-2 text-[12px] leading-none"
      style={{ background: odd ? 'var(--ck-table-row-alt)' : 'transparent' }}
    >
      <span className="min-w-0 flex-1 truncate text-(--text-secondary)">{row.unit}</span>
      <span className="w-[76px] shrink-0 truncate text-(--text-secondary)">{row.type}</span>
      <span
        className="w-[58px] shrink-0 font-semibold"
        style={{ color: major ? 'var(--ck-red)' : 'var(--ck-orange)' }}
      >
        {row.level}
      </span>
      <span className="w-[76px] shrink-0 text-right text-(--text-tertiary)">{row.time}</span>
    </div>
  )
}

/** 风险闭环流程总览的一个节点：圆形图标 + 名称 + 数量 */
export function FlowStep({ step, last }: { step: RiskFlowStep; last: boolean }) {
  return (
    <>
      <div className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
        <span
          className="flex h-[42px] w-[42px] items-center justify-center rounded-full text-[19px] text-white"
          style={{
            background: 'linear-gradient(145deg, var(--ck-blue), var(--ck-cyan))',
            boxShadow: '0 4px 10px rgba(42, 102, 232, 0.26)',
          }}
          aria-hidden
        >
          <i className={step.icon} />
        </span>
        <span className="truncate text-[13px] leading-none text-(--text-secondary)">
          {step.label}
        </span>
        <span className="ck-glow-num text-[18px] leading-none font-bold text-(--ck-cyan)">
          {step.value}
        </span>
      </div>

      {last ? null : (
        <i
          className="ri-arrow-right-line shrink-0 self-start pt-[11px] text-[18px] text-(--ck-marker) opacity-55"
          aria-hidden
        />
      )}
    </>
  )
}
