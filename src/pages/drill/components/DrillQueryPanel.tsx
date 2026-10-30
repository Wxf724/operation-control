/** 一条查询条件 */
export interface DrillQueryCondition {
  label: string
  value: string
}

/** 明细页展开的「原始查询条件」 */
export interface DrillQueryPanelProps {
  conditions: readonly DrillQueryCondition[]
  className?: string
}

/**
 * 「原始查询条件」展开条：把上一层点下来时带的参数翻成中文条件。
 *
 * 参考图里这个面板是点按钮后才出现的，所以默认收起；
 * 展开后是一条横向的条件胶囊带，日期区间永远显示。
 */
export function DrillQueryPanel({ conditions, className = '' }: DrillQueryPanelProps) {
  return (
    <div
      className={`ck-panel flex shrink-0 flex-wrap items-center gap-x-5 gap-y-1 rounded-(--ck-panel-radius) px-5 ${className}`}
    >
      <span className="flex shrink-0 items-center gap-1.5 text-[15px] leading-none font-semibold text-(--ck-title)">
        <i className="ri-filter-3-line text-[16px] text-(--ck-cyan)" aria-hidden />
        当前生效的查询条件
      </span>

      {conditions.map((item) => (
        <span key={item.label} className="flex shrink-0 items-center gap-1.5">
          <span className="text-[14px] leading-none text-(--text-secondary)">{item.label}</span>
          <span className="rounded-[5px] bg-(--accent-light) px-2 py-[4px] text-[14px] leading-none font-medium text-(--ck-title-sub)">
            {item.value}
          </span>
        </span>
      ))}
    </div>
  )
}
