import type { DrillMetric } from '../types'

/** 指标卡行 */
export interface DrillMetricRowProps {
  items: readonly DrillMetric[]
  className?: string
}

/**
 * 指标卡行：一张白卡里横向均分若干「图标 + 标签 + 大数字 + 单位」。
 *
 * 对应参考图顶部的「接收单据量 1,243,058 笔」那一条。
 */
export function DrillMetricRow({ items, className = '' }: DrillMetricRowProps) {
  return (
    <div
      className={`ck-panel flex shrink-0 items-center rounded-(--ck-panel-radius) px-7 ${className}`}
    >
      {items.map((item) => {
        const tone = `var(${item.colorVar})`
        return (
          <div key={item.label} className="flex min-w-0 flex-1 items-center gap-3">
            <span
              className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-[12px] text-[23px] text-white"
              style={{
                background: `linear-gradient(145deg, color-mix(in srgb, ${tone} 52%, #ffffff) 0%, ${tone} 100%)`,
                boxShadow: `0 6px 14px color-mix(in srgb, ${tone} 34%, transparent), inset 0 1px 0 rgba(255,255,255,0.5)`,
              }}
            >
              <i className={item.icon} aria-hidden />
            </span>

            <span className="flex min-w-0 items-baseline gap-1.5">
              <span className="truncate text-[17px] leading-none text-(--text-secondary)">
                {item.label}
              </span>
              <span
                className="ck-glow-num text-[30px] leading-none font-bold"
                style={{ color: tone }}
              >
                {item.value}
              </span>
              {item.unit ? (
                <span className="text-[15px] leading-none text-(--text-tertiary)">{item.unit}</span>
              ) : null}
            </span>
          </div>
        )
      })}
    </div>
  )
}
