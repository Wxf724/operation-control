import { useRef } from 'react'

import type { DrillTab } from '../types'

/** 页签行 */
export interface DrillTabBarProps {
  tabs: readonly DrillTab[]
  /** 选中页签的 key */
  active: string
  onChange: (key: string) => void
  /** 页签过多时在两端显示翻页箭头（作业流转页有 10 个页签） */
  arrows?: boolean
  className?: string
}

/** 一次翻页滚动的距离（px） */
const SCROLL_STEP = 460

/**
 * 页签行：选中态是主蓝渐变实心胶囊，其余为纯文字。
 *
 * `arrows` 打开时两端各一个箭头按钮，按钮横向滚动页签容器，
 * 对应参考图 `41-钻取-作业流转处理情况.png` 的「‹ … ›」。
 */
export function DrillTabBar({
  tabs,
  active,
  onChange,
  arrows = false,
  className = '',
}: DrillTabBarProps) {
  const trackRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: -1 | 1) => {
    trackRef.current?.scrollBy({ left: dir * SCROLL_STEP, behavior: 'smooth' })
  }

  return (
    <div
      className={`ck-panel flex shrink-0 items-center gap-2 rounded-(--ck-panel-radius) px-4 ${className}`}
    >
      {arrows ? (
        <ArrowButton icon="ri-arrow-left-s-line" label="上一组页签" onClick={() => scroll(-1)} />
      ) : null}

      <div
        ref={trackRef}
        className="ck-scroll flex min-w-0 flex-1 items-center gap-2 overflow-x-auto scroll-smooth"
      >
        {tabs.map((tab) => {
          const on = tab.key === active
          return (
            <button
              key={tab.key}
              type="button"
              aria-pressed={on}
              onClick={() => onChange(tab.key)}
              className={`shrink-0 cursor-pointer rounded-[6px] px-4 py-[9px] text-[16px] leading-none whitespace-nowrap transition-colors ${
                on
                  ? 'font-semibold text-white'
                  : 'text-(--text-secondary) hover:text-(--ck-title-sub)'
              }`}
              style={
                on
                  ? {
                      background: 'linear-gradient(90deg, var(--ck-btn-from), var(--ck-btn-to))',
                      boxShadow: '0 3px 8px rgba(42, 102, 232, 0.26)',
                    }
                  : undefined
              }
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {arrows ? (
        <ArrowButton icon="ri-arrow-right-s-line" label="下一组页签" onClick={() => scroll(1)} />
      ) : null}
    </div>
  )
}

function ArrowButton({
  icon,
  label,
  onClick,
}: {
  icon: string
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className="flex h-[30px] w-[26px] shrink-0 cursor-pointer items-center justify-center rounded-[5px] text-[20px] text-(--ck-cyan) transition-colors hover:bg-(--accent-light)"
    >
      <i className={icon} aria-hidden />
    </button>
  )
}
