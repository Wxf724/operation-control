import { PanelBox } from '@/components/cockpit-ui'

import { ADJUST_ITEMS } from '../constants'
import type { AdjustItem } from '../types'

/** 第三列：任务调整（AI 给出的逐项调整建议） */
export function TaskAdjustPanel({ className = '' }: { className?: string }) {
  return (
    <PanelBox title="任务调整" className={`flex flex-col ${className}`} extra={<AiAssistButton />}>
      <div className="flex h-full flex-col gap-[9px] px-[28px] pt-[37px] pb-[30px]">
        {ADJUST_ITEMS.map((item, i) => (
          <AdjustCard key={`${item.label}-${i}`} item={item} />
        ))}
      </div>
    </PanelBox>
  )
}

function AiAssistButton() {
  return (
    <button
      type="button"
      className="flex cursor-pointer items-center gap-2 rounded-[3px] px-3 py-[7px] text-[15px] leading-none font-medium text-(--ck-on-solid) transition-opacity hover:opacity-85"
      style={{ background: 'linear-gradient(90deg, var(--ck-btn-from), var(--ck-btn-to))' }}
    >
      <span
        className="flex h-[17px] w-[17px] items-center justify-center rounded-[2px] text-[11px] font-bold"
        style={{ background: 'rgba(255,255,255,0.25)' }}
      >
        AI
      </span>
      AI助手
    </button>
  )
}

/** 一张内嵌卡片：左边青色箭头图标 + 标签，右边内容 */
function AdjustCard({ item }: { item: AdjustItem }) {
  return (
    <div
      className="ck-card flex min-h-0 items-start rounded-[3px] px-[15px] py-[18px]"
      style={{
        flexGrow: item.weight,
        flexBasis: 0,
        marginTop: item.gapBefore ? 32 : undefined,
      }}
    >
      <span className="flex w-[126px] shrink-0 items-center gap-2">
        <DoubleArrow />
        <span className="text-[17px] leading-none whitespace-nowrap text-(--ck-blue)">
          {item.label}
        </span>
      </span>

      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-[12px] gap-y-2">
        {item.prefix ? (
          <span className="text-[17px] leading-none text-(--foreground)">{item.prefix}</span>
        ) : null}

        {item.from ? <ValueChip value={item.from} tone="before" /> : null}
        {item.to ? (
          <ValueChip value={item.to} tone="after" className={item.from ? 'ml-[18px]' : ''} />
        ) : null}

        {item.note ? (
          <span className="text-[17px] leading-none text-(--foreground)">{item.note}</span>
        ) : null}

        {item.text ? (
          <span className="text-[17px] leading-[31px] whitespace-pre-line text-(--foreground)">
            {item.text}
          </span>
        ) : null}
      </div>
    </div>
  )
}

/** 标签前的青色双箭头 */
function DoubleArrow() {
  return (
    <svg width="15" height="11" viewBox="0 0 15 11" fill="none" aria-hidden>
      <path
        d="M1 1.5L5 5.5L1 9.5"
        stroke="var(--ck-marker)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 1.5L12 5.5L8 9.5"
        stroke="var(--ck-marker)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.6"
      />
    </svg>
  )
}

function ValueChip({
  value,
  tone,
  className = '',
}: {
  value: string
  tone: 'before' | 'after'
  className?: string
}) {
  const color = tone === 'before' ? 'var(--ck-blue)' : 'var(--ck-orange)'

  return (
    <span
      className={`rounded-[3px] px-[9px] py-[4px] text-[17px] leading-[17px] whitespace-nowrap ${className}`}
      style={{
        color,
        border: `1px solid color-mix(in srgb, ${color} 45%, transparent)`,
        background: `color-mix(in srgb, ${color} 16%, transparent)`,
      }}
    >
      {value}
    </span>
  )
}
