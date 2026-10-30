import type { DrillMetric, DrillTab } from '../types'

/** 「页签 + 指标条」合成一行的顶部带 */
export interface RpaMetricTabBarProps {
  tabs: readonly DrillTab[]
  /** 选中页签的 key */
  active: string
  onChange: (key: string) => void
  /** 右侧均分排开的指标（参考图 1 三个、图 2 四个） */
  metrics: readonly DrillMetric[]
  className?: string
}

/**
 * 页签与指标合成一条横向带：左侧页签胶囊，右侧图标 + 标签 + 大数字。
 *
 * 对应参考图 1、2 顶部那一条——页签在最左的浅蓝底托里，
 * 指标沿整行均分排开，和下面两张表的左右分栏无关。
 */
export function RpaMetricTabBar({
  tabs,
  active,
  onChange,
  metrics,
  className = '',
}: RpaMetricTabBarProps) {
  return (
    <div
      className={`ck-panel flex shrink-0 items-center gap-5 rounded-(--ck-panel-radius) px-5 ${className}`}
    >
      <div
        role="tablist"
        aria-label="RPA 视图页签"
        className="flex shrink-0 items-center gap-2 rounded-[9px] p-1"
        style={{ background: 'var(--ck-panel-inner)' }}
      >
        {tabs.map((tab) => {
          const on = tab.key === active
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => onChange(tab.key)}
              className={`cursor-pointer rounded-[6px] px-4 py-[7px] text-[16px] leading-none whitespace-nowrap transition-colors ${
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

      <span className="h-[32px] w-px shrink-0 bg-(--border)" />

      <div className="flex min-w-0 flex-1 items-center">
        {metrics.map((item) => {
          const tone = `var(${item.colorVar})`
          return (
            <div key={item.label} className="flex min-w-0 flex-1 items-center gap-2.5">
              <span
                className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[9px] text-[16px]"
                style={{
                  color: tone,
                  background: `color-mix(in srgb, ${tone} 12%, transparent)`,
                }}
              >
                <i className={item.icon} aria-hidden />
              </span>

              <span className="flex min-w-0 flex-col gap-1.5">
                <span className="truncate text-[13px] leading-none text-(--text-secondary)">
                  {item.label}
                </span>
                <span className="flex items-baseline gap-1">
                  <span
                    className="ck-glow-num text-[24px] leading-none font-bold tabular-nums"
                    style={{ color: tone }}
                  >
                    {item.value}
                  </span>
                  {item.unit ? (
                    <span className="text-[12px] leading-none text-(--text-tertiary)">
                      {item.unit}
                    </span>
                  ) : null}
                </span>
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
