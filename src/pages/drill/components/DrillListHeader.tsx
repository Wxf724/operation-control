import type { DrillTab } from '../types'

/** 明细列表页顶部条（页名 + 下划线页签 + 原始查询条件开关） */
export interface DrillListHeaderProps {
  /** 页面名称；与页签可同时出现（页名在前） */
  title?: string
  /** 页签，可不传 */
  tabs?: readonly DrillTab[]
  /** 选中页签的 key */
  active?: string
  onChange?: (key: string) => void
  /** 「原始查询条件」是否展开 */
  queryOpen: boolean
  onToggleQuery: () => void
  className?: string
}

/**
 * 明细列表页顶部条：左侧页名与下划线页签，右侧「原始查询条件」开关。
 *
 * 版面对齐参考图 3、9、10——页签贴着底边、选中态用主色下划线，
 * 而不是其它钻取页那种实心胶囊。返回到上一层统一走画布左上角的小箭头，
 * 这里不再放大按钮。
 */
export function DrillListHeader({
  title,
  tabs,
  active,
  onChange,
  queryOpen,
  onToggleQuery,
  className = '',
}: DrillListHeaderProps) {
  return (
    <div
      className={`ck-panel flex shrink-0 items-stretch gap-7 rounded-(--ck-panel-radius) px-5 ${className}`}
    >
      {title ? (
        <span className="flex shrink-0 items-center gap-2 text-[19px] leading-none font-bold text-(--ck-title)">
          <i className="ri-file-list-3-line text-[20px] text-(--ck-cyan)" aria-hidden />
          {title}
        </span>
      ) : null}

      {tabs && tabs.length && onChange ? (
        <div className="flex shrink-0 items-stretch gap-7">
          {tabs.map((tab) => {
            const on = tab.key === active
            return (
              <button
                key={tab.key}
                type="button"
                aria-pressed={on}
                onClick={() => onChange(tab.key)}
                className={`flex cursor-pointer items-center border-b-[3px] px-1 text-[18px] leading-none whitespace-nowrap transition-colors ${
                  on
                    ? 'border-(--accent) font-semibold text-(--ck-title)'
                    : 'border-transparent text-(--text-secondary) hover:text-(--ck-title-sub)'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      ) : null}

      <div className="ml-auto flex shrink-0 items-center gap-2.5">
        <button
          type="button"
          aria-pressed={queryOpen}
          onClick={onToggleQuery}
          className={`flex cursor-pointer items-center gap-1.5 rounded-[6px] border px-3.5 py-[8px] text-[14px] leading-none font-medium transition-colors ${
            queryOpen
              ? 'border-(--accent) bg-(--accent-light) text-(--ck-title-sub)'
              : 'border-(--border) bg-(--surface) text-(--text-secondary) hover:bg-(--bg-hover)'
          }`}
        >
          <i className="ri-filter-3-line text-[15px]" aria-hidden />
          原始查询条件
          <i
            className={
              queryOpen ? 'ri-arrow-up-s-line text-[15px]' : 'ri-arrow-down-s-line text-[15px]'
            }
            aria-hidden
          />
        </button>
      </div>
    </div>
  )
}
