import ReactECharts from 'echarts-for-react'

import { splitLabelLines } from '@/utils'

/** 绩效管理平台组织切换视图共用的小部件（卡、环、底座、图例、表、仪表、下拉） */

/**
 * 长标签折行渲染：按个数切成 1–2 行，每行一个 `span`。
 *
 * 直接交给浏览器折行会出现「……达成 / 率」这种孤字尾行，所以先按中点分好。
 */
function LabelLines({
  text,
  maxChars,
  className = '',
}: {
  text: string
  /** 一行最多几个字，超过就折两行 */
  maxChars: number
  className?: string
}) {
  const lines = splitLabelLines(text, maxChars)

  return (
    <span className={`flex flex-col items-center ${className}`}>
      {lines.map((line, i) => (
        <span key={i} className="block whitespace-nowrap">
          {line}
        </span>
      ))}
    </span>
  )
}

/** ECharts 容器 */
export function OrgChart({ option }: { option: object }) {
  return (
    <ReactECharts
      option={option}
      style={{ height: '100%', width: '100%' }}
      opts={{ renderer: 'canvas' }}
      notMerge
    />
  )
}

/** 描边指标卡：标题 + 大号数值 + 单位 */
export function OrgCountCard({
  label,
  value,
  unit,
}: {
  label: string
  value: string
  unit?: string
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-2 px-1.5">
      <span className="w-full truncate text-center text-[13px] leading-none text-(--ck-title-sub)">
        {label}
      </span>
      <span className="flex items-baseline gap-0.5">
        <span className="ck-glow-num text-[27px] leading-none font-bold text-(--ck-cyan)">
          {value}
        </span>
        {unit ? (
          <span className="text-[12px] leading-none text-(--ck-title-sub)">{unit}</span>
        ) : null}
      </span>
    </div>
  )
}

/** 下拉框样式的筛选条（静态展示，稿面上只作视觉占位） */
export function OrgDropdown({ label }: { label: string }) {
  return (
    <span
      className="flex h-[30px] shrink-0 items-center justify-between gap-2 rounded-[4px] px-2.5"
      style={{
        border: '1px solid var(--ck-panel-inner-border)',
        background: 'var(--ck-panel-inner)',
      }}
    >
      <span className="truncate text-[13px] leading-none text-(--foreground)">{label}</span>
      <i className="ri-arrow-down-s-line shrink-0 text-[15px] text-(--ck-title-sub)" aria-hidden />
    </span>
  )
}

/** 环形进度：描边环 + 中心数值，下方可带说明 */
export function OrgRing({
  value,
  label,
  size = 100,
  thickness = 8,
  tone = 'cyan',
  suffix = '%',
  decimals,
}: {
  value: number
  label?: string
  size?: number
  thickness?: number
  tone?: 'cyan' | 'green' | 'orange' | 'purple' | 'blue'
  suffix?: string
  decimals?: number
}) {
  const r = (size - thickness) / 2
  const circ = 2 * Math.PI * r
  const dash = (Math.max(0, Math.min(100, value)) / 100) * circ
  const color = `var(--ck-${tone})`
  const digits = decimals ?? (value % 1 === 0 ? 0 : 2)

  return (
    <div className="flex min-w-0 flex-col items-center gap-2">
      <span className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--ck-track)"
            strokeWidth={thickness}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={thickness}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circ}`}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>
        <span
          className="absolute inset-0 flex items-center justify-center text-[19px] leading-none font-bold tabular-nums"
          style={{ color }}
        >
          {value.toFixed(digits)}
          {suffix}
        </span>
      </span>
      {label ? (
        // 128px 宽、12px 字：一行最多 10 字，再长就按中点折两行
        <LabelLines
          text={label}
          maxChars={10}
          className="max-w-[128px] text-center text-[12px] leading-tight text-(--ck-title-sub)"
        />
      ) : null}
    </div>
  )
}

/** 立体底座：椭圆盘 + 光锥 + 浮在盘上的数字 */
export function OrgPedestal({
  value,
  unit,
  label,
  tone = 'cyan',
  width = 96,
}: {
  value: string
  unit?: string
  label?: string
  tone?: 'cyan' | 'red'
  width?: number
}) {
  const h = Math.round(width * 0.62)

  return (
    <span className="flex min-w-0 flex-col items-center gap-1.5">
      <span
        className="relative flex shrink-0 items-start justify-center"
        style={{ width, height: h }}
      >
        <svg
          className="absolute inset-0"
          width={width}
          height={h}
          viewBox="0 0 96 60"
          fill="none"
          preserveAspectRatio="none"
          aria-hidden
        >
          <ellipse cx="48" cy="42" rx="31" ry="10" fill="var(--ck-blue)" opacity="0.45" />
          <ellipse cx="48" cy="42" rx="31" ry="10" stroke="var(--ck-cyan)" strokeOpacity="0.7" />
          <ellipse cx="48" cy="48" rx="31" ry="10" fill="var(--ck-blue)" opacity="0.22" />
          <ellipse cx="48" cy="42" rx="16" ry="5" fill="var(--ck-screen-base)" opacity="0.45" />
          <ellipse cx="48" cy="54" rx="40" ry="6" fill="var(--ck-blue)" opacity="0.12" />
        </svg>
        <span className="relative flex items-baseline gap-0.5 pt-0.5">
          <span
            className="ck-glow-num text-[28px] leading-none font-bold"
            style={{ color: `var(--ck-${tone})` }}
          >
            {value}
          </span>
          {unit ? (
            <span className="text-[11px] leading-none text-(--ck-title-sub)">{unit}</span>
          ) : null}
        </span>
      </span>
      {label ? (
        <span className="max-w-[120px] text-center text-[12px] leading-tight text-(--ck-title-sub)">
          {label}
        </span>
      ) : null}
    </span>
  )
}

/** 色点图例一行：圆点 + 名称 + 数值 +（可选）右侧竖纹迷你条 */
export function OrgLegendRow({
  name,
  valueText,
  tone,
  percent,
}: {
  name: string
  valueText: string
  tone: string
  /** 0–100，给出时在右侧画一截竖纹条 */
  percent?: number
}) {
  return (
    <div className="flex items-center gap-2">
      <i
        className="h-[7px] w-[7px] shrink-0 rounded-full"
        style={{ background: `var(--ck-${tone})` }}
        aria-hidden
      />
      <span className="min-w-0 flex-1 truncate text-[12px] leading-none text-(--ck-title-sub)">
        {name}
      </span>
      <span className="shrink-0 text-right text-[12px] leading-none text-(--foreground) tabular-nums">
        {valueText}
      </span>
      {percent === undefined ? null : (
        <span className="relative h-[9px] w-[46px] shrink-0 overflow-hidden">
          <span
            className="absolute inset-y-0 left-0"
            style={{
              width: `${Math.max(0, Math.min(100, percent))}%`,
              background: `repeating-linear-gradient(90deg, var(--ck-${tone}) 0 2px, transparent 2px 4px)`,
            }}
          />
        </span>
      )}
    </div>
  )
}

/** 细进度条一行：名称 + 数值 + 蓝色条 + 圆头游标 */
export function OrgProgressRow({
  label,
  valueText,
  percent,
}: {
  label: string
  valueText: string
  /** 0–100 */
  percent: number
}) {
  const pct = Math.max(0, Math.min(100, percent))

  return (
    <div className="flex items-center gap-2">
      <span className="w-[112px] shrink-0 truncate text-[13px] leading-none text-(--foreground)">
        {label}
      </span>
      <span className="w-[58px] shrink-0 text-right text-[13px] leading-none text-(--foreground) tabular-nums">
        {valueText}
      </span>
      <span className="relative flex h-[7px] min-w-0 flex-1 items-center">
        <span
          className="absolute inset-0 rounded-full"
          style={{ background: 'color-mix(in srgb, var(--ck-blue) 20%, transparent)' }}
        />
        <span
          className="absolute top-0 left-0 h-full rounded-full"
          style={{
            width: `${pct}%`,
            background:
              'linear-gradient(90deg, color-mix(in srgb, var(--ck-blue) 35%, transparent), var(--ck-blue))',
          }}
        />
      </span>
    </div>
  )
}

/** 斑马纹表：首行表头，其余为数据行，空串单元格留空（稿面本身就有空格） */
export function OrgTable({
  head,
  rows,
  firstColWidth = 120,
}: {
  head: readonly string[]
  rows: readonly { label: string; cells: readonly (string | number)[] }[]
  firstColWidth?: number
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div
        className="flex shrink-0 items-center gap-1 rounded-t-[3px] px-2 py-2"
        style={{ background: 'var(--ck-table-head)' }}
      >
        <span
          className="shrink-0 truncate text-[12px] leading-none text-(--ck-title-sub)"
          style={{ width: firstColWidth }}
        >
          {head[0]}
        </span>
        {head.slice(1).map((h) => (
          // 表头列宽只有 80~100px，超过 7 字就按中点折两行，避免只剩一个字
          <LabelLines
            key={h}
            text={h}
            maxChars={7}
            className="min-w-0 flex-1 text-center text-[12px] leading-tight text-(--ck-title-sub)"
          />
        ))}
      </div>

      {rows.map((row, i) => (
        <div
          key={`${row.label}-${i}`}
          className="flex min-h-0 flex-1 items-center gap-1 px-2"
          style={{ background: i % 2 === 0 ? 'transparent' : 'var(--ck-table-row)' }}
        >
          <span
            className="shrink-0 truncate text-[12px] leading-none text-(--foreground)"
            style={{ width: firstColWidth }}
          >
            {row.label}
          </span>
          {row.cells.map((cell, j) => (
            <span
              key={j}
              className="min-w-0 flex-1 text-center text-[13px] leading-none font-semibold text-(--ck-cyan) tabular-nums"
            >
              {cell === '' ? '' : cell}
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}

/**
 * 银企直联率仪表：240° 刻度盘。
 *
 * 外圈 41 根刻度（每 5 根加长并标数值），内圈是橙→青→蓝三段淡色轨道，
 * 指示值用一条亮弧压在轨道上、末端带圆头游标，环心压大号百分比。
 * 与 `processWidgets` 里的 `ReportGauge` 同一套做法，保证全站仪表观感一致。
 */
export function OrgGauge({ value, label }: { value: number; label: string }) {
  const w = 168
  const h = 124
  const cx = w / 2
  const cy = 80
  const rTrack = 56
  const pct = Math.max(0, Math.min(100, value))

  /**
   * 盘面张角 240°，缺口朝下。
   *
   * SVG 的 y 轴朝下，所以直接用 `cx + r·cosθ` / `cy + r·sinθ`：
   * θ=150° 落在左下、θ=270° 落在正上、θ=390°(=30°) 落在右下，
   * θ 递增正好是顺时针，与 A 指令的 sweep-flag=1 一致。
   */
  const START = (Math.PI * 5) / 6
  const SWEEP = (Math.PI * 4) / 3
  const at = (f: number) => START + SWEEP * f
  const pt = (f: number, r: number): [number, number] => [
    cx + r * Math.cos(at(f)),
    cy + r * Math.sin(at(f)),
  ]

  /** large-arc-flag 看的是实际圆心角：跨度超过 240°×0.75 = 180° 才置 1 */
  const arcPath = (from: number, to: number, r: number) => {
    const [x1, y1] = pt(from, r)
    const [x2, y2] = pt(to, r)
    return `M ${x1} ${y1} A ${r} ${r} 0 ${to - from > 0.75 ? 1 : 0} 1 ${x2} ${y2}`
  }

  const bands = [
    { from: 0, to: 0.3, color: 'var(--ck-orange)' },
    { from: 0.3, to: 0.65, color: 'var(--ck-cyan)' },
    { from: 0.65, to: 1, color: 'var(--ck-blue)' },
  ]
  const [dotX, dotY] = pt(pct / 100, rTrack)

  return (
    <div className="flex shrink-0 flex-col items-center gap-1">
      <span className="relative" style={{ width: w, height: h }}>
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none" aria-hidden>
          {/* 外圈刻度：41 根，每 5 根加长 */}
          {Array.from({ length: 41 }, (_, i) => {
            const f = i / 40
            const major = i % 5 === 0
            const [x1, y1] = pt(f, 70)
            const [x2, y2] = pt(f, major ? 62 : 65)
            return (
              <line
                key={`t${i}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="var(--ck-blue)"
                strokeWidth={major ? 1.6 : 1}
                opacity={major ? 0.8 : 0.4}
              />
            )
          })}

          {/* 橙→青→蓝三段淡色轨道 */}
          {bands.map((band) => (
            <path
              key={band.color}
              d={arcPath(band.from, band.to, rTrack)}
              stroke={band.color}
              strokeWidth={9}
              strokeOpacity={0.26}
            />
          ))}

          <path
            d={arcPath(0, pct / 100, rTrack)}
            stroke="var(--ck-cyan)"
            strokeWidth={9}
            strokeLinecap="round"
          />

          <circle
            cx={dotX}
            cy={dotY}
            r={4.5}
            fill="var(--ck-cyan)"
            stroke="var(--surface)"
            strokeWidth={2}
          />

          {[0, 20, 40, 60, 80, 100].map((n) => {
            const [x, y] = pt(n / 100, 80)
            return (
              <text
                key={n}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={8}
                fill="var(--text-tertiary)"
              >
                {n}
              </text>
            )
          })}
        </svg>

        <span
          className="absolute inset-x-0 text-center text-[26px] leading-none font-bold text-(--ck-cyan) tabular-nums"
          style={{ top: cy - 14 }}
        >
          {pct}%
        </span>
      </span>
      <span className="text-[12px] leading-none text-(--ck-title-sub)">{label}</span>
    </div>
  )
}

/** 图标 + 名称 + 数值的横向小卡，对应「银行账户新增数量 100 家」 */
export function OrgIconStat({
  icon,
  label,
  value,
  unit,
}: {
  icon: string
  label: string
  value: string
  unit: string
}) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-2.5">
      <span
        className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[9px] text-[21px] text-(--ck-cyan)"
        style={{
          background: 'linear-gradient(180deg, var(--ck-icon-from), var(--ck-icon-to))',
          border: '1px solid var(--ck-card-border)',
        }}
      >
        <i className={icon} aria-hidden />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-1.5">
        <span className="truncate text-[12px] leading-tight text-(--ck-title-sub)">{label}</span>
        <span className="flex items-baseline gap-0.5">
          <span className="ck-glow-num text-[22px] leading-none font-bold text-(--ck-cyan)">
            {value}
          </span>
          <span className="text-[11px] leading-none text-(--ck-title-sub)">{unit}</span>
        </span>
      </span>
    </div>
  )
}

/**
 * 居中的胶囊横条：图标 + 文案 + 大号数值 + 单位，下方一条渐隐细线。
 * 稿面上「月末结账申请单待提交量 1 笔」「税收滞纳金处罚 1 笔」用的是这个。
 */
export function OrgBanner({
  icon,
  label,
  value,
  unit,
}: {
  icon: string
  label: string
  value: string
  unit?: string
}) {
  return (
    <span className="flex shrink-0 flex-col items-center gap-1 self-center">
      <span className="flex items-center gap-2">
        <i className={`${icon} text-[17px] text-(--ck-cyan)`} aria-hidden />
        <span className="text-[13px] leading-none text-(--ck-title-sub)">{label}</span>
        <span className="ck-glow-num text-[21px] leading-none font-bold text-(--ck-cyan)">
          {value}
        </span>
        {unit ? (
          <span className="text-[12px] leading-none text-(--ck-title-sub)">{unit}</span>
        ) : null}
      </span>
      {/* 两端渐隐的下划线，和稿面一致 */}
      <span
        className="h-px w-full"
        style={{
          background:
            'linear-gradient(90deg, transparent, var(--ck-panel-inner-border) 20%, var(--ck-panel-inner-border) 80%, transparent)',
        }}
        aria-hidden
      />
    </span>
  )
}

/** 带左侧圆点的小描边卡：一行说明 + 一行数值（可带单位） */
export function OrgDotCard({
  label,
  value,
  unit,
  tone = 'cyan',
}: {
  label: string
  value: string
  unit?: string
  tone?: string
}) {
  return (
    <div
      className="flex min-w-0 flex-col gap-2 rounded-[6px] px-3 py-2.5"
      style={{
        border: '1px solid var(--ck-panel-inner-border)',
        background: 'var(--ck-panel-inner)',
      }}
    >
      <span className="flex min-w-0 items-center gap-1.5">
        <i
          className="h-[6px] w-[6px] shrink-0 rounded-full"
          style={{ background: `var(--ck-${tone})` }}
          aria-hidden
        />
        <span className="min-w-0 flex-1 truncate text-[12px] leading-none text-(--ck-title-sub)">
          {label}
        </span>
      </span>
      <span className="flex items-baseline gap-0.5 pl-3">
        <span className="ck-glow-num text-[19px] leading-none font-bold text-(--foreground)">
          {value}
        </span>
        {unit ? (
          <span className="text-[11px] leading-none text-(--ck-title-sub)">{unit}</span>
        ) : null}
      </span>
    </div>
  )
}

/**
 * 单行点标卡：圆点 + 名称在左、数值在右，整行一行高。
 *
 * 用在需要并排塞 5 行以上的窄列里（如「服务企业跨年制单情况」的五项费用）——
 * `OrgDotCard` 是两行版，五行会把半栏撑破。
 */
export function OrgDotRow({
  label,
  value,
  tone = 'orange',
}: {
  label: string
  value: string
  tone?: string
}) {
  return (
    <div
      className="flex min-w-0 shrink-0 items-center gap-1.5 rounded-[6px] px-2.5 py-[7px]"
      style={{
        border: '1px solid var(--ck-panel-inner-border)',
        background: 'var(--ck-panel-inner)',
      }}
    >
      <i
        className="h-[6px] w-[6px] shrink-0 rounded-full"
        style={{ background: `var(--ck-${tone})` }}
        aria-hidden
      />
      <span className="min-w-0 flex-1 truncate text-[12px] leading-none text-(--ck-title-sub)">
        {label}
      </span>
      <span className="ck-glow-num shrink-0 text-[14px] leading-none font-bold text-(--foreground)">
        {value}
      </span>
    </div>
  )
}
