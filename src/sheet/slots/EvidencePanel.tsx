import type { SlotComponentProps } from '../registry'

interface EvidenceItem {
  label: string
  value: string
  ok: boolean
}

/** 证据面板：把关结论与数据时效，支撑「任何内容可反查来源」 */
export function EvidencePanel({ slot, data }: SlotComponentProps) {
  const items = (data as { items?: EvidenceItem[] })?.items ?? []
  const caliber = (slot.props?.caliber as string) ?? ''

  return (
    <div className="flex h-full flex-col gap-2">
      {caliber ? (
        <p className="shrink-0 rounded-sm bg-(--accent-subtle) px-3 py-2 text-[12px] leading-relaxed text-(--text-secondary)">
          {caliber}
        </p>
      ) : null}
      <ul className="min-h-0 flex-1 overflow-auto">
        {items.map((item) => (
          <li
            key={item.label}
            className="flex items-center justify-between gap-2 border-b border-(--ck-panel-inner-border) px-1 py-2 last:border-b-0"
          >
            <span className="text-[12px] text-(--text-secondary)">{item.label}</span>
            <span
              className={`text-[12px] font-semibold ${
                item.ok ? 'text-(--success)' : 'text-(--danger)'
              }`}
            >
              {item.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
