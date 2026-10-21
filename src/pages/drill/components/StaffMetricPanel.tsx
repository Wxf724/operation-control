import { SectionTitle } from '@/components/cockpit-ui'

import type { DrillMetric } from '../types'

/** 带二级标题的指标卡块 */
export interface StaffMetricPanelProps {
  /** 块标题，如「员工出勤」 */
  title: string
  items: readonly DrillMetric[]
  className?: string
}

/**
 * 「基本情况」钻取页用的指标块：二级标题 + 一行横向均分的「图标 + 标签 + 大数字」。
 *
 * 与 `DrillMetricRow` 的区别只是多了顶上的标题行，
 * 对应参考图 54 的「员工出勤」「员工技能情况」两块。
 */
export function StaffMetricPanel({ title, items, className = '' }: StaffMetricPanelProps) {
  return (
    <section
      className={`ck-panel flex shrink-0 flex-col justify-center gap-3 rounded-(--ck-panel-radius) px-6 py-3 ${className}`}
    >
      <SectionTitle>{title}</SectionTitle>

      <div className="flex items-center">
        {items.map((item) => {
          const tone = `var(${item.colorVar})`
          return (
            <div key={item.label} className="flex min-w-0 flex-1 items-center gap-3">
              <span
                className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[11px] text-[21px] text-white"
                style={{
                  background: `linear-gradient(145deg, color-mix(in srgb, ${tone} 52%, #ffffff) 0%, ${tone} 100%)`,
                  boxShadow: `0 6px 14px color-mix(in srgb, ${tone} 34%, transparent), inset 0 1px 0 rgba(255,255,255,0.5)`,
                }}
              >
                <i className={item.icon} aria-hidden />
              </span>

              <span className="flex min-w-0 items-baseline gap-1.5">
                <span className="truncate text-[16px] leading-none text-(--text-secondary)">
                  {item.label}
                </span>
                <span
                  className="ck-glow-num text-[27px] leading-none font-bold"
                  style={{ color: tone }}
                >
                  {item.value}
                </span>
                {item.unit ? (
                  <span className="text-[14px] leading-none text-(--text-tertiary)">
                    {item.unit}
                  </span>
                ) : null}
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}
