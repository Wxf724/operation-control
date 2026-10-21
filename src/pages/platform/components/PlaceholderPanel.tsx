import { PanelBox } from '@/components/cockpit-ui'

/** 中间业务区尚未建设时的占位，明确标出对应的 PPT 页 */
export function PlaceholderPanel({
  title,
  sourceNote,
  className = '',
}: {
  title: string
  sourceNote: string
  className?: string
}) {
  return (
    <PanelBox title={title} className={`flex flex-col ${className}`}>
      <div className="flex h-full flex-col items-center justify-center gap-3 px-6">
        <i className="ri-layout-masonry-line text-[44px] text-(--ck-blue) opacity-60" aria-hidden />

        <span className="text-[16px] leading-none font-semibold text-(--ck-title-sub)">
          业务区待建设
        </span>

        <p className="max-w-[460px] text-center text-[13px] leading-relaxed text-(--text-tertiary)">
          本页顶部 KPI 条与右侧「AI 调控策略」「调控执行反馈」已按原件还原；
          中间业务区对应 <span className="text-(--ck-cyan)">{sourceNote}</span>，待按该页逐块复刻。
        </p>
      </div>
    </PanelBox>
  )
}
