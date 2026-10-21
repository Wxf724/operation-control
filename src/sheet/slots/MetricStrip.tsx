import type { SlotComponentProps } from '../registry'

interface MetricItem {
  label: string
  value: string | number
  unit?: string
  delta?: string
  tone?: 'up' | 'down' | 'flat'
}

/** 指标条：一排关键数字 */
export function MetricStrip({ slot, data }: SlotComponentProps) {
  const items = (data as { items?: MetricItem[] })?.items ?? []

  return (
    <div className="grid h-full grid-cols-4 gap-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex flex-col justify-center rounded-(--ck-panel-radius) border border-(--ck-panel-inner-border) bg-(--ck-panel-inner) px-4 py-3"
        >
          <span className="text-[12px] text-(--text-tertiary)">{item.label}</span>
          <span className="mt-1 font-mono text-[22px] leading-none font-bold text-(--ck-kpi-text)">
            {item.value}
            {item.unit ? (
              <span className="ml-1 text-[12px] font-normal text-(--text-secondary)">
                {item.unit}
              </span>
            ) : null}
          </span>
          {item.delta ? (
            <span
              className={`mt-1 text-[12px] ${
                item.tone === 'up'
                  ? 'text-(--danger)'
                  : item.tone === 'down'
                    ? 'text-(--success)'
                    : 'text-(--text-tertiary)'
              }`}
            >
              {item.delta}
            </span>
          ) : null}
        </div>
      ))}
    </div>
  )
}
