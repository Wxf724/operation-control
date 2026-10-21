import { HEADLINE } from '../constants'

/** 中部顶端的今日运行播报条 */
export function AlertBanner({ className = '' }: { className?: string }) {
  return (
    <div
      className={`relative flex items-center gap-2.5 rounded-[3px] px-4 py-2.5 ${className}`}
      style={{
        background:
          'linear-gradient(90deg, transparent 0%, var(--accent-soft) 18%, var(--accent-soft) 82%, transparent 100%)',
      }}
    >
      <span className="ck-pulse-dot shrink-0 text-[15px] text-(--ck-cyan)">
        <i className="ri-volume-up-line" aria-hidden />
      </span>

      <p className="text-[16px] leading-none text-(--ck-title-sub)">
        {HEADLINE.prefix}
        <span className="font-semibold text-(--ck-orange)">{HEADLINE.highlight}</span>
        {HEADLINE.middle}
        <span className="font-semibold text-(--ck-orange)">{HEADLINE.time}</span>
        {HEADLINE.suffix}
      </p>
    </div>
  )
}
