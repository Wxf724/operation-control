import { PanelBox, SectionTitle, StatusTag } from '@/components/cockpit-ui'

import { REMINDERS, STRATEGY_CARDS, STRATEGY_PROGRESS } from '../constants'
import type { ReminderItem, StrategyCard } from '../types'
import { FeedbackTable } from './FeedbackTable'

/** 右栏主面板：提醒事项 + AI调控策略 + 调控执行反馈 */
export function AiStrategyPanel({ className = '' }: { className?: string }) {
  return (
    <PanelBox title="AI调控策略与调控执行反馈区" className={`flex flex-col ${className}`}>
      <div className="flex h-full flex-col gap-3 px-4 pt-3 pb-3">
        <section className="shrink-0">
          <SectionTitle className="mb-2">提醒事项</SectionTitle>
          <div className="grid grid-cols-4 gap-2">
            {REMINDERS.map((item) => (
              <ReminderCard key={item.label} item={item} />
            ))}
          </div>
        </section>

        <section className="shrink-0">
          <SectionTitle className="mb-2">AI调控策略</SectionTitle>
          <div className="grid grid-cols-4 gap-2">
            {STRATEGY_CARDS.map((card) => (
              <StrategyBlock key={card.title} card={card} />
            ))}
            <ExecutionDonut />
          </div>
        </section>

        <section className="flex min-h-0 flex-1 flex-col">
          <SectionTitle className="mb-2">调控执行反馈</SectionTitle>
          <FeedbackTable className="min-h-0 flex-1" />
        </section>
      </div>
    </PanelBox>
  )
}

function ReminderCard({ item }: { item: ReminderItem }) {
  const color = item.tone === 'muted' ? 'var(--text-tertiary)' : 'var(--ck-cyan)'

  return (
    <div
      className="flex flex-col items-center gap-1.5 rounded-[3px] border px-2 py-2"
      style={{
        borderColor: 'var(--ck-panel-inner-border)',
        background: 'linear-gradient(180deg, var(--ck-card-from) 0%, var(--ck-card-to) 100%)',
        boxShadow: 'var(--ck-card-shadow)',
      }}
    >
      <span className="text-center text-[13px] leading-tight text-(--text-secondary)">
        {item.label}
      </span>
      <span className="ck-glow-num text-[22px] leading-none font-bold" style={{ color }}>
        {item.value}
      </span>
    </div>
  )
}

function StrategyBlock({ card }: { card: StrategyCard }) {
  return (
    <div className="ck-card flex flex-col gap-1.5 rounded-[3px] px-2 py-2">
      <div className="flex items-center justify-between gap-1">
        <span className="text-[13px] leading-none font-semibold text-(--ck-title-sub)">
          {card.title}
        </span>
        <StatusTag tone={card.tone} className="scale-90">
          {card.badge}
        </StatusTag>
      </div>
      <div className="flex flex-col gap-0.5">
        {card.lines.map((line) => (
          <span key={line} className="text-[12px] leading-snug text-(--text-tertiary)">
            {line}
          </span>
        ))}
      </div>
    </div>
  )
}

/** 策略执行状态：三段环形 */
function ExecutionDonut() {
  const { done, doing, todo } = STRATEGY_PROGRESS
  const segments = [
    { label: '已完成', value: done, color: 'var(--ck-cyan)' },
    { label: '执行中', value: doing, color: 'var(--ck-purple)' },
    { label: '待执行', value: todo, color: 'var(--ck-orange)' },
  ]

  const size = 62
  const r = 24
  const circumference = 2 * Math.PI * r

  let offset = 0
  const arcs = segments.map((seg) => {
    const len = (circumference * seg.value) / 100
    const arc = { ...seg, dash: `${len} ${circumference - len}`, offset: -offset }
    offset += len
    return arc
  })

  return (
    <div className="ck-card flex flex-col gap-1 rounded-[3px] px-2 py-2">
      <span className="text-[13px] leading-none font-semibold text-(--ck-title-sub)">
        策略执行状态
      </span>

      <div className="flex items-center gap-1.5">
        <div className="relative shrink-0" style={{ width: size, height: size }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
              {arcs.map((arc) => (
                <circle
                  key={arc.label}
                  cx={size / 2}
                  cy={size / 2}
                  r={r}
                  fill="none"
                  stroke={arc.color}
                  strokeWidth="7"
                  strokeDasharray={arc.dash}
                  strokeDashoffset={arc.offset}
                />
              ))}
            </g>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
            <span className="text-[9px] text-(--text-tertiary)">执行中</span>
            <span className="text-[13px] font-bold text-(--ck-cyan)">{done}%</span>
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-[3px]">
          {segments.map((seg) => (
            <span key={seg.label} className="flex items-center gap-1 whitespace-nowrap">
              <i className="h-[6px] w-[6px] shrink-0 rounded-full" style={{ background: seg.color }} />
              <span className="text-[12px] leading-none text-(--text-tertiary)">{seg.label}</span>
              <span className="text-[12px] leading-none font-semibold" style={{ color: seg.color }}>
                {seg.value}%
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
