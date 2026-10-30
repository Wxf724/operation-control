import type { DrillMetric } from '../types'

/** 指标卡：支持单行与多行（多行会合并进同一张卡，按列对齐） */
export interface DrillMetricRowProps {
  /** 单行指标 */
  items?: readonly DrillMetric[]
  /** 多行指标：合并成一张卡里的多行网格，列数取各行最大值 */
  rows?: readonly (readonly DrillMetric[])[]
  /** 强制列数（默认取最长一行的条数） */
  columns?: number
  className?: string
}

/**
 * 指标卡：一张白卡里按网格排开「徽标 + 标签 · 大数字」。
 *
 * 与早期的重型色块样式相比：
 *   · 图标收成一枚 28px 的浅色底小徽标（不再是 46px 的渐变方块 + 投影）；
 *   · 标签与数值同一行排布，行高固定在 56px 上下，多行的整块读作一条指标带；
 *   · 单元格之间用细分隔线，行与行之间加一条横线；末行不满也不会把单元格拉宽。
 */
export function DrillMetricRow({ items, rows, columns, className = '' }: DrillMetricRowProps) {
  const groups = rows && rows.length ? rows : [items ?? []]
  const columnCount = Math.max(columns ?? 0, ...groups.map((group) => group.length), 1)

  return (
    <div
      className={`ck-panel flex shrink-0 flex-col rounded-(--ck-panel-radius) py-1.5 ${className}`}
    >
      {groups.map((group, rowIndex) => (
        <div
          key={rowIndex}
          className={`grid ${rowIndex > 0 ? 'border-t border-(--border-light)' : ''}`}
          style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}
        >
          {group.map((item, index) => {
            const tone = `var(${item.colorVar})`

            return (
              <div
                key={item.label}
                className={`flex min-w-0 items-center gap-2.5 px-5 py-2.5 ${
                  index > 0 ? 'border-l border-(--border-light)' : ''
                }`}
              >
                <span
                  className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-[8px] text-[15px]"
                  style={{
                    color: tone,
                    background: `color-mix(in srgb, ${tone} 12%, transparent)`,
                  }}
                >
                  <i className={item.icon} aria-hidden />
                </span>

                <span className="flex min-w-0 items-baseline gap-1.5">
                  <span className="truncate text-[14px] leading-none text-(--text-secondary)">
                    {item.label}
                  </span>
                  <span
                    className="ck-glow-num text-[23px] leading-none font-bold tabular-nums"
                    style={{ color: tone }}
                  >
                    {item.value}
                  </span>
                  {item.unit ? (
                    <span className="text-[12px] leading-none text-(--text-tertiary)">
                      {item.unit}
                    </span>
                  ) : null}
                  {item.sub ? (
                    <span className="truncate text-[12px] leading-none text-(--text-tertiary)">
                      {item.sub}
                    </span>
                  ) : null}
                </span>
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
