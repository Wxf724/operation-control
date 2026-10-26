import type { ModuleEntry } from '../types'

export interface ModuleNavProps {
  items: ModuleEntry[]
  activeKey: string
  /** 单击：切换高亮并联动底部指标 */
  onSelect: (key: string) => void
  /** 双击：进入该模块的平台页 */
  onOpen: (item: ModuleEntry) => void
  className?: string
}

/** 中部左右两列的业务模块入口：单击切换，双击进入平台 */
export function ModuleNav({ items, activeKey, onSelect, onOpen, className = '' }: ModuleNavProps) {
  return (
    <nav className={`flex flex-col gap-3 ${className}`}>
      {items.map((item) => (
        <ModuleButton
          key={item.key}
          item={item}
          active={item.key === activeKey}
          onClick={() => onSelect(item.key)}
          onDoubleClick={() => onOpen(item)}
        />
      ))}
    </nav>
  )
}

function ModuleButton({
  item,
  active,
  onClick,
  onDoubleClick,
}: {
  item: ModuleEntry
  active: boolean
  onClick: () => void
  onDoubleClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      title={`双击进入${item.label}平台`}
      className="group relative flex min-h-0 flex-1 cursor-pointer items-center gap-3.5 rounded-[4px] border px-5 transition-all duration-200 select-none"
      style={{
        borderColor: active ? 'var(--ck-cyan)' : 'var(--ck-panel-inner-border)',
        background: active
          ? 'linear-gradient(90deg, color-mix(in srgb, var(--ck-cyan) 14%, transparent) 0%, var(--ck-panel-inner) 100%)'
          : 'linear-gradient(90deg, var(--ck-card-from) 0%, var(--ck-card-to) 100%)',
        boxShadow: active
          ? 'inset 0 0 26px color-mix(in srgb, var(--ck-cyan) 12%, transparent), var(--ck-card-shadow)'
          : 'var(--ck-card-shadow)',
      }}
    >
      <span
        className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[4px] text-[21px]"
        style={{
          color: active ? 'var(--ck-cyan)' : 'var(--ck-blue)',
          background: 'linear-gradient(180deg, var(--ck-icon-from), var(--ck-icon-to))',
          boxShadow: active ? 'var(--ck-icon-glow)' : undefined,
        }}
      >
        <i className={item.icon} aria-hidden />
      </span>

      <span
        className="text-[20px] leading-none font-semibold tracking-wide whitespace-nowrap transition-colors"
        style={{ color: active ? 'var(--ck-cyan)' : 'var(--ck-title-sub)' }}
      >
        {item.label}
      </span>

      {/* 选中态左侧亮条 */}
      {active ? (
        <span
          className="pointer-events-none absolute inset-y-[8px] left-0 w-[3px] rounded-full"
          style={{ background: 'var(--ck-cyan)', boxShadow: '0 0 10px var(--ck-cyan)' }}
        />
      ) : null}
    </button>
  )
}
