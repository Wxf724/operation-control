import type { ReactNode } from 'react'

/** 大屏顶栏：中间渐变大标题 + 左右插槽，底部一条发光分隔 */
export interface ScreenHeaderProps {
  /** 主标题，如「运营监控与调控全景座舱」 */
  title: ReactNode
  /** 副标题，渲染为「主标题 丨 副标题」 */
  subtitle?: ReactNode
  left?: ReactNode
  right?: ReactNode
  /** 顶栏高度（px） */
  height?: number
  className?: string
}

export function ScreenHeader({
  title,
  subtitle,
  left,
  right,
  height = 68,
  className = '',
}: ScreenHeaderProps) {
  return (
    <header className={`relative shrink-0 ${className}`} style={{ height }}>
      {/* 顶部光带背景 */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0"
        style={{
          height: height + 16,
          background:
            'radial-gradient(ellipse 42% 150% at 50% 0%, var(--ck-header-glow) 0%, transparent 72%)',
        }}
      />
      {/* 底部分隔线：中间亮两边淡 */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent, var(--ck-header-rule) 30%, var(--ck-header-rule) 70%, transparent)',
        }}
      />

      <div className="relative flex h-full items-center justify-between px-5">
        <div className="z-10 flex min-w-[240px] items-center gap-3">{left}</div>

        <h1 className="ck-main-title pointer-events-none absolute inset-x-0 text-center text-[30px] leading-none font-bold">
          {title}
          {subtitle ? (
            <>
              <span className="mx-2 font-normal opacity-60">丨</span>
              {subtitle}
            </>
          ) : null}
        </h1>

        <div className="z-10 flex min-w-[240px] items-center justify-end gap-3">{right}</div>
      </div>
    </header>
  )
}
