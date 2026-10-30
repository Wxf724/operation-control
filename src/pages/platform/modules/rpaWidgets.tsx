import { useId } from 'react'
import type { ReactNode } from 'react'

/* ───────────── 几何工具 ───────────── */

/** 极坐标转屏幕坐标，`deg` 以三点钟方向为 0、顺时针增大 */
function polar(cx: number, cy: number, r: number, deg: number) {
  const a = (deg * Math.PI) / 180
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }
}

/** 顺时针圆弧的 path 字符串 */
function arcPath(cx: number, cy: number, r: number, from: number, to: number) {
  const p1 = polar(cx, cy, r, from)
  const p2 = polar(cx, cy, r, to)
  const large = to - from > 180 ? 1 : 0
  return `M ${p1.x.toFixed(2)} ${p1.y.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`
}

/* ───────────── 小节标题 ───────────── */

export interface PanelSectionTitleProps {
  children: ReactNode
  extra?: ReactNode
  className?: string
}

/**
 * 面板内的二级小节标题。
 *
 * 与公共 `SectionTitle` 的区别：用竖向渐变光条代替菱形标记，
 * 更贴合浅色玻璃主题，字号也比深色大屏大一号。
 */
export function PanelSectionTitle({ children, extra, className = '' }: PanelSectionTitleProps) {
  return (
    <div className={`flex shrink-0 items-center justify-between gap-2 ${className}`}>
      <span className="flex items-center gap-2">
        <i
          className="h-[14px] w-[3px] shrink-0 rounded-full"
          style={{ background: 'linear-gradient(180deg, var(--ck-teal), var(--ck-cyan))' }}
        />
        <span className="text-[15px] leading-none font-semibold text-(--ck-title)">{children}</span>
      </span>
      {extra}
    </div>
  )
}

/* ───────────── 进度环 ───────────── */

export interface RingProps {
  size: number
  stroke: number
  /** 0–100 */
  percent: number
  /** 描边色，传 CSS 变量表达式 */
  color: string
  className?: string
}

/** 圆环进度：轨道取主题 --ck-track，浅色看板下不加发光滤镜 */
export function Ring({ size, stroke, percent, color, className = '' }: RingProps) {
  const r = size / 2 - stroke / 2 - 1
  const circumference = 2 * Math.PI * r
  const pct = Math.max(0, Math.min(100, percent))
  const half = size / 2

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      aria-hidden
    >
      <circle cx={half} cy={half} r={r} fill="none" stroke="var(--ck-track)" strokeWidth={stroke} />
      <circle
        cx={half}
        cy={half}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${(circumference * pct) / 100} ${circumference}`}
        transform={`rotate(-90 ${half} ${half})`}
      />
    </svg>
  )
}

/* ───────────── 数字底座 ───────────── */

/**
 * 数字下方的透视底座（参考稿里「296 笔」「100 笔」下面那块梯形）。
 * 纯装饰，用来把一组数字压住、增加版面的稳定感。
 */
export function Pediment({ width = 88, className = '' }: { width?: number; className?: string }) {
  const h = Math.max(12, Math.round(width * 0.2))
  // 同一页会渲染多个底座，渐变 id 必须每实例唯一，否则互相覆盖
  const fillId = `rpaPediment${useId().replace(/:/g, '')}`

  return (
    <svg width={width} height={h} viewBox={`0 0 ${width} ${h}`} className={className} aria-hidden>
      <defs>
        <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--ck-teal)" stopOpacity="0.46" />
          <stop offset="100%" stopColor="var(--ck-teal)" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <path
        d={`M ${width * 0.12} 0 H ${width * 0.88} L ${width * 0.72} ${h} H ${width * 0.28} Z`}
        fill={`url(#${fillId})`}
      />
      <ellipse
        cx={width / 2}
        cy="1"
        rx={width * 0.38}
        ry="1.8"
        fill="var(--ck-teal)"
        opacity="0.42"
      />
    </svg>
  )
}

/* ───────────── 效率提升贡献率仪表 ───────────── */

const GAUGE_START = 150
const GAUGE_SWEEP = 240
const GAUGE_TICKS = [0, 20, 40, 60, 80, 100]

/** 仪表盘：渐变弧 + 指针 + 刻度 */
export function ContribGauge({ value }: { value: number }) {
  const gradId = `rpaGauge${useId().replace(/:/g, '')}`
  const cx = 88
  const cy = 90
  const r = 62
  const pct = Math.max(0, Math.min(100, value))
  const arcTo = GAUGE_START + (GAUGE_SWEEP * pct) / 100
  const tip = polar(cx, cy, r - 18, arcTo)
  const tail = polar(cx, cy, -8, arcTo)
  const left = polar(cx, cy, 6, arcTo + 90)
  const right = polar(cx, cy, 6, arcTo - 90)

  return (
    <div className="relative" style={{ width: 176, height: 132 }}>
      <svg width="176" height="132" viewBox="0 0 176 132" aria-hidden>
        <defs>
          <linearGradient id={gradId} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--ck-teal)" />
            <stop offset="60%" stopColor="var(--ck-cyan)" />
            <stop offset="100%" stopColor="var(--ck-blue)" />
          </linearGradient>
        </defs>

        <path
          d={arcPath(cx, cy, r, GAUGE_START, GAUGE_START + GAUGE_SWEEP)}
          fill="none"
          stroke="var(--ck-track)"
          strokeWidth="11"
          strokeLinecap="round"
        />
        <path
          d={arcPath(cx, cy, r, GAUGE_START, arcTo)}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth="11"
          strokeLinecap="round"
        />

        {GAUGE_TICKS.map((tick) => {
          const deg = GAUGE_START + (GAUGE_SWEEP * tick) / 100
          const inner = polar(cx, cy, r - 13, deg)
          const outer = polar(cx, cy, r - 6, deg)
          return (
            <line
              key={tick}
              x1={inner.x}
              y1={inner.y}
              x2={outer.x}
              y2={outer.y}
              stroke="var(--ck-axis)"
              strokeOpacity="0.35"
              strokeWidth="1.5"
            />
          )
        })}

        <polygon
          points={`${tip.x},${tip.y} ${left.x},${left.y} ${right.x},${right.y}`}
          fill="var(--ck-cyan)"
        />
        <line
          x1={tail.x}
          y1={tail.y}
          x2={tip.x}
          y2={tip.y}
          stroke="var(--ck-cyan)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r="7.5" fill="var(--ck-panel-bg-strong)" />
        <circle cx={cx} cy={cy} r="3.6" fill="var(--ck-cyan)" />
      </svg>

      <span className="ck-glow-num absolute inset-x-0 bottom-0 text-center text-[28px] leading-none font-bold text-(--ck-title)">
        {value}%
      </span>
    </div>
  )
}

/* ───────────── 页签 ───────────── */

export interface TabGroupProps {
  tabs: readonly string[]
  active: number
  onChange: (index: number) => void
  className?: string
}

/** 面板内的胶囊页签：选中态用主色渐变，未选中为白底细描边 */
export function TabGroup({ tabs, active, onChange, className = '' }: TabGroupProps) {
  return (
    <div className={`flex shrink-0 items-center gap-2 ${className}`}>
      {tabs.map((label, i) => {
        const on = active === i
        return (
          <button
            key={label}
            type="button"
            onClick={() => onChange(i)}
            className={`cursor-pointer rounded-full px-3 py-[6px] text-[12px] leading-none whitespace-nowrap transition-all ${
              on ? 'font-semibold text-white' : 'text-(--text-secondary)'
            }`}
            style={
              on
                ? {
                    background: 'linear-gradient(135deg, var(--ck-btn-from), var(--ck-btn-to))',
                    boxShadow: '0 4px 10px color-mix(in srgb, var(--ck-cyan) 30%, transparent)',
                  }
                : {
                    background: 'var(--ck-panel-inner)',
                    border: '1px solid var(--ck-panel-inner-border)',
                  }
            }
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}

/* ───────────── 数字条目 ───────────── */

export interface StatTileProps {
  label: string
  value: string
  unit: string
  /** 数值颜色，传 CSS 变量表达式 */
  color?: string
}

/** 面板顶部的一枚大数字：数值在上、透视底座在下、口径在最下 */
export function StatTile({ label, value, unit, color = 'var(--ck-title)' }: StatTileProps) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
      <span className="flex items-baseline gap-0.5">
        <span className="ck-glow-num text-[26px] leading-none font-bold" style={{ color }}>
          {value}
        </span>
        <span className="text-[11px] leading-none text-(--text-tertiary)">{unit}</span>
      </span>
      <Pediment width={92} />
      <span className="max-w-full truncate text-[12px] leading-none text-(--text-secondary)">
        {label}
      </span>
    </div>
  )
}

/** 竖分隔线 */
export function VerticalRule({ className = '' }: { className?: string }) {
  return <span className={`w-px shrink-0 self-stretch bg-(--border-light) ${className}`} />
}

/** 「· 节约 200 小时」这样的一行 */
export function DotLine({
  color,
  label,
  value,
  unit,
}: {
  color: string
  label: string
  value: string
  unit?: string
}) {
  return (
    <span className="flex items-baseline gap-1 whitespace-nowrap">
      <i
        className="h-[6px] w-[6px] shrink-0 translate-y-[-1px] rounded-full"
        style={{ background: color }}
      />
      <span className="text-[12px] leading-none text-(--text-secondary)">{label}</span>
      <span className="text-[15px] leading-none font-bold" style={{ color }}>
        {value}
      </span>
      {unit ? (
        <span className="text-[10px] leading-none text-(--text-tertiary)">{unit}</span>
      ) : null}
    </span>
  )
}

/** 细进度条：贡献情况每列底部的效率刻度 */
export function MiniBar({ percent, color }: { percent: number; color: string }) {
  const pct = Math.max(0, Math.min(100, percent))
  return (
    <span className="block h-[5px] w-full overflow-hidden rounded-full bg-(--ck-track)">
      <span
        className="block h-full rounded-full"
        style={{
          width: `${pct}%`,
          background: `linear-gradient(90deg, color-mix(in srgb, ${color} 45%, transparent), ${color})`,
        }}
      />
    </span>
  )
}

/** 带透视底座的图标：规划与覆盖情况左上角的机器人 */
export function PedestalIcon({ icon }: { icon: string }) {
  return (
    <div className="relative flex h-[62px] w-[68px] shrink-0 items-end justify-center">
      <svg className="absolute bottom-0" width="68" height="22" viewBox="0 0 68 22" aria-hidden>
        <ellipse cx="34" cy="10" rx="22" ry="6" fill="var(--ck-cyan)" opacity="0.14" />
        <ellipse
          cx="34"
          cy="10"
          rx="22"
          ry="6"
          fill="none"
          stroke="var(--ck-cyan)"
          strokeOpacity="0.45"
        />
        <ellipse
          cx="34"
          cy="15"
          rx="30"
          ry="7.5"
          fill="none"
          stroke="var(--ck-cyan)"
          strokeOpacity="0.2"
        />
      </svg>
      <span
        className="relative mb-[12px] flex h-[38px] w-[38px] items-center justify-center rounded-full text-[21px] text-(--ck-cyan)"
        style={{
          background: 'linear-gradient(180deg, var(--ck-icon-from), var(--ck-icon-to))',
          boxShadow: 'var(--ck-icon-glow)',
        }}
      >
        <i className={icon} aria-hidden />
      </span>
    </div>
  )
}
