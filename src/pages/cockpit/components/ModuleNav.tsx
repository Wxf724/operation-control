import type { MouseEvent } from 'react'

import type { ModuleEntry } from '../types'

/** 特殊业务入口的主色变量，未指定时沿用主题蓝 */
const TONE_VAR = {
  green: '--ck-green',
  purple: '--ck-purple',
} as const

export interface ModuleNavProps {
  items: ModuleEntry[]
  activeKey: string
  /** 单击：切换高亮并联动底部指标 */
  onSelect: (key: string) => void
  /** 双击：进入该模块的平台页（仅已接入平台页的入口） */
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
          /* 双击的第二击不再切换高亮与指标，避免进入平台页前多一次无谓重渲染 */
          onClick={(event) => {
            if (event.detail === 1) onSelect(item.key)
          }}
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
  onClick: (event: MouseEvent<HTMLButtonElement>) => void
  onDoubleClick: () => void
}) {
  const toneVar = item.tone ? TONE_VAR[item.tone] : null
  const accent = toneVar ? `var(${toneVar})` : 'var(--ck-cyan)'

  /*
    绿／紫入口沿用白卡片骨架，只在图标、文字、描边和亮条上换色：
    文字用主色与前景色混合出深一档，保证浅底上的可读性；
    默认蓝色入口的取值与原来完全一致，不受此处影响。
  */
  const ink = toneVar
    ? `color-mix(in srgb, var(${toneVar}) 72%, var(--foreground))`
    : null
  const iconColor = toneVar ? ink : active ? 'var(--ck-cyan)' : 'var(--ck-blue)'
  const labelColor = toneVar ? ink : active ? 'var(--ck-cyan)' : 'var(--ck-title-sub)'

  const iconBg = toneVar
    ? `linear-gradient(180deg, color-mix(in srgb, var(${toneVar}) 18%, var(--ck-panel-bg)), color-mix(in srgb, var(${toneVar}) 34%, var(--ck-panel-bg)))`
    : 'linear-gradient(180deg, var(--ck-icon-from), var(--ck-icon-to))'
  const cardBg = toneVar
    ? `linear-gradient(90deg, color-mix(in srgb, var(${toneVar}) 14%, var(--ck-card-from)) 0%, var(--ck-card-to) 100%)`
    : 'linear-gradient(90deg, var(--ck-card-from) 0%, var(--ck-card-to) 100%)'
  const idleBorder = toneVar
    ? `color-mix(in srgb, var(${toneVar}) 48%, var(--ck-panel-inner-border))`
    : 'var(--ck-panel-inner-border)'

  return (
    <button
      type="button"
      data-tour-module={item.key}
      onClick={onClick}
      onDoubleClick={() => {
        if (item.route) onDoubleClick()
      }}
      title={item.route ? `双击进入${item.label}平台` : item.label}
      className="ck-module-button ck-motion-enter group relative flex min-h-0 flex-1 cursor-pointer items-center gap-3.5 rounded-[4px] border px-5 transition-all duration-200 select-none"
      style={{
        borderColor: active ? accent : idleBorder,
        background: active
          ? `linear-gradient(90deg, color-mix(in srgb, ${accent} 14%, transparent) 0%, var(--ck-panel-inner) 100%)`
          : cardBg,
        boxShadow: active
          ? `inset 0 0 26px color-mix(in srgb, ${accent} 12%, transparent), var(--ck-card-shadow)`
          : 'var(--ck-card-shadow)',
      }}
    >
      <span
        className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[4px] text-[21px]"
        style={{
          color: iconColor ?? undefined,
          background: iconBg,
          boxShadow: active ? 'var(--ck-icon-glow)' : undefined,
        }}
      >
        <i className={item.icon} aria-hidden />
      </span>

      <span
        className="text-[20px] leading-none font-semibold tracking-wide whitespace-nowrap transition-colors"
        style={{ color: labelColor ?? undefined }}
      >
        {item.label}
      </span>

      {/* 选中态左侧亮条 */}
      {active ? (
        <span
          className="pointer-events-none absolute inset-y-[8px] left-0 w-[3px] rounded-full"
          style={{ background: accent, boxShadow: `0 0 10px ${accent}` }}
        />
      ) : null}
    </button>
  )
}
