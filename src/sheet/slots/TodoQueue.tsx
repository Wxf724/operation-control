import type { SlotComponentProps } from '../registry'

interface TodoItem {
  id: string
  label: string
  priority: 'high' | 'normal'
  meta?: string
}

/** 待办队列：按紧迫度排队，附办理动作 */
export function TodoQueue({ slot, data, onAction }: SlotComponentProps) {
  const items = (data as { items?: TodoItem[] })?.items ?? []
  const emptyText = (slot.props?.emptyText as string) ?? '当前无待办事项'

  return (
    <div className="flex h-full flex-col">
      <ul className="min-h-0 flex-1 overflow-auto">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between gap-3 border-b border-(--ck-panel-inner-border) px-1 py-2.5 last:border-b-0"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                {item.priority === 'high' ? (
                  <span className="shrink-0 rounded-sm bg-(--danger-soft) px-1.5 py-0.5 text-[11px] font-semibold text-(--danger)">
                    紧急
                  </span>
                ) : null}
                <span className="truncate text-[13px] text-(--ck-title)">{item.label}</span>
              </div>
              {item.meta ? (
                <div className="mt-0.5 pl-1 text-[12px] text-(--text-tertiary)">
                  {item.meta}
                </div>
              ) : null}
            </div>
          </li>
        ))}
        {items.length === 0 ? (
          <li className="px-1 py-6 text-center text-[13px] text-(--text-tertiary)">
            {emptyText}
          </li>
        ) : null}
      </ul>

      {slot.actions?.length ? (
        <div className="mt-2 flex shrink-0 gap-2">
          {slot.actions.map((action) => (
            <button
              key={action.key}
              type="button"
              onClick={() => onAction?.(action.key, action.target)}
              className={
                action.kind === 'primary'
                  ? 'rounded-sm bg-(--accent) px-3 py-1.5 text-[12px] font-semibold text-(--accent-foreground) transition-colors hover:bg-(--accent-hover)'
                  : 'rounded-sm border border-(--ck-panel-border) px-3 py-1.5 text-[12px] text-(--text-secondary) transition-colors hover:bg-(--bg-hover)'
              }
            >
              {action.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
