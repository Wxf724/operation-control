import { PanelBox } from '@/components/cockpit-ui'

import { RULE_ITERATION } from './ruleData'
import type { RuleIterationItem } from './ruleData'

const BLUE = 'var(--ck-blue)'
const GREEN = 'var(--ck-green)'

/* ───────────── 右下 · 规则迭代优化管理 ───────────── */

/**
 * 三个迭代指标并排。
 *
 * 每列是一张撑满面板高度的卡片（`h-full` + `justify-between`），
 * 原先用 `items-center` 居中一组裸内容，面板底部会空出近 90px 的白。
 */
export function IterationPanel({ className = '' }: { className?: string }) {
  return (
    <PanelBox title="规则迭代优化管理" className={`flex flex-col ${className}`}>
      <div className="grid h-full grid-cols-3 gap-3 px-3.5 pt-2 pb-3.5">
        {RULE_ITERATION.map((item) => (
          <IterationItem key={item.title} item={item} />
        ))}
      </div>
    </PanelBox>
  )
}

function IterationItem({ item }: { item: RuleIterationItem }) {
  const sum = item.smart + item.manual || 1

  return (
    <div
      className="flex min-h-0 flex-col items-center justify-between gap-4 rounded-[10px] border border-(--ck-card-border) px-3 py-3.5"
      style={{
        background: 'linear-gradient(180deg, var(--ck-card-from) 0%, var(--ck-card-to) 100%)',
        boxShadow: 'var(--ck-card-shadow)',
      }}
    >
      <span className="shrink-0 text-center text-[15px] leading-none font-semibold text-(--ck-title-sub)">
        {item.title}
      </span>

      <DualRing total={item.total} smart={item.smart} manual={item.manual} />

      <div className="flex shrink-0 flex-col gap-2.5">
        <LegendRow color={BLUE} label="智能审核规则" value={item.smart} sum={sum} />
        <LegendRow color={GREEN} label="人工审核规则" value={item.manual} sum={sum} />
      </div>
    </div>
  )
}

/** 双层环：外环为智能审核规则占比，内环为人工审核规则占比 */
function DualRing({ total, smart, manual }: { total: string; smart: number; manual: number }) {
  const sum = smart + manual || 1
  const size = 190
  const c = size / 2

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <RingArc c={c} r={80} w={13} stroke={BLUE} pct={(smart * 100) / sum} />
        <RingArc c={c} r={63} w={11} stroke={GREEN} pct={(manual * 100) / sum} />
      </svg>
      <span className="ck-glow-num absolute inset-0 flex items-center justify-center text-[44px] leading-none font-bold text-(--foreground)">
        {total}
      </span>
    </div>
  )
}

/** 从 12 点方向顺时针绘制的单段圆弧，含底色轨道。c=圆心坐标，w=线宽，pct=填充 0–100 */
export function RingArc({ c, r, w, stroke, pct }: RingArcProps) {
  const circ = 2 * Math.PI * r

  return (
    <>
      <circle cx={c} cy={c} r={r} fill="none" stroke="var(--ck-track)" strokeWidth={w} />
      <circle
        cx={c}
        cy={c}
        r={r}
        fill="none"
        stroke={stroke}
        strokeWidth={w}
        strokeDasharray={`${(circ * pct) / 100} ${circ}`}
        transform={`rotate(-90 ${c} ${c})`}
        strokeLinecap="round"
      />
    </>
  )
}

function LegendRow({
  color,
  label,
  value,
  sum,
}: {
  color: string
  label: string
  value: number
  sum: number
}) {
  return (
    <span className="flex items-center gap-2 whitespace-nowrap">
      <i className="h-[8px] w-[8px] shrink-0 rounded-full" style={{ background: color }} />
      <span className="text-[13px] leading-none text-(--foreground)">{label}</span>
      <span className="text-[20px] leading-none font-bold tabular-nums" style={{ color }}>
        {value}
      </span>
      <span className="text-[12px] leading-none text-(--text-tertiary)">次</span>
      <span className="text-[12px] leading-none text-(--text-secondary) tabular-nums">
        {((value * 100) / sum).toFixed(1)}%
      </span>
    </span>
  )
}

export interface RingArcProps {
  c: number
  r: number
  w: number
  stroke: string
  pct: number
}
