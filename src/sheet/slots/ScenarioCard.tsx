import type { SlotComponentProps } from '../registry'
import type { ScenarioLevel } from '../types'

const LEVEL_TEXT: Record<ScenarioLevel, string> = {
  red: '红色场景',
  orange: '橙色场景',
  blue: '蓝色场景',
  green: '常规场景',
}

/** 场景卡：说明当前页面聚焦的业务场景与响应要求 */
export function ScenarioCard({ slot, data }: SlotComponentProps) {
  const level = (slot.props?.level as ScenarioLevel) ?? 'blue'
  const title = (slot.props?.title as string) ?? (data as { title?: string })?.title ?? ''
  const summary =
    (slot.props?.summary as string) ?? (data as { summary?: string })?.summary ?? ''
  const deadline = (slot.props?.deadline as string) | undefined

  const deadlineText = deadline
    ? `响应时限 ${new Date(deadline).toLocaleString('zh-CN', { hour12: false })}`
    : null

  return (
    <div className="rounded-(--ck-panel-radius) border border-(--ck-panel-border) bg-(--ck-panel-bg-strong) px-5 py-4">
      <div className="flex items-center gap-3">
        <span
          className={`inline-block h-2.5 w-2.5 rounded-full ${
            level === 'red'
              ? 'bg-(--ck-red)'
              : level === 'orange'
                ? 'bg-(--ck-warning)'
                : 'bg-(--ck-cyan)'
          }`}
        />
        <span className="text-[15px] font-bold text-(--ck-title)">{title}</span>
        <span className="text-[12px] text-(--ck-title-sub)">{LEVEL_TEXT[level]}</span>
      </div>
      <p className="mt-2 text-[13px] leading-relaxed text-(--text-secondary)">{summary}</p>
      {deadlineText ? (
        <p className="mt-1 text-[12px] font-semibold text-(--ck-red)">{deadlineText}</p>
      ) : null}
    </div>
  )
}
