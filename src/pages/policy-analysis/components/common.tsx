import type { ReactNode } from 'react'

import { SectionTitle } from '@/components/cockpit-ui'
import type { TagTone } from '@/components/cockpit-ui'

import { toneColor } from '../constants'

/**
 * 本页的二级小标题。
 * 共享 `SectionTitle` 内部写死 14px，这里用子元素覆盖成目标稿的 17px
 * （子元素字号优先于父元素，不依赖 Tailwind 的样式表顺序）。
 */
export function SubTitle({
  children,
  className = '',
  extra,
}: {
  children: ReactNode
  className?: string
  extra?: ReactNode
}) {
  return (
    <SectionTitle className={className} extra={extra}>
      <span className="text-[17px] leading-none">{children}</span>
    </SectionTitle>
  )
}

/** 放大一档的状态标签（共享 StatusTag 固定 12px，这里按目标稿放大） */
export function Tag({
  tone = 'cyan',
  variant = 'soft',
  className = '',
  children,
}: {
  tone?: TagTone
  variant?: 'solid' | 'soft' | 'plain'
  className?: string
  children: ReactNode
}) {
  const color = toneColor(tone)

  if (variant === 'plain') {
    return (
      <span className={`text-[15px] leading-none font-medium ${className}`} style={{ color }}>
        {children}
      </span>
    )
  }

  return (
    <span
      className={`inline-flex items-center justify-center rounded-[3px] px-2 py-[5px] text-[15px] leading-none font-medium whitespace-nowrap ${className}`}
      style={
        variant === 'solid'
          ? { background: color, color: 'var(--ck-on-solid)' }
          : {
              background: `color-mix(in srgb, ${color} 18%, transparent)`,
              border: `1px solid color-mix(in srgb, ${color} 45%, transparent)`,
              color,
            }
      }
    >
      {children}
    </span>
  )
}

/** 小标题右侧的次级按钮 */
export function GhostButton({ icon, label }: { icon: string; label: string }) {
  return (
    <button
      type="button"
      className="flex h-[32px] cursor-pointer items-center gap-2 rounded-[4px] border border-(--border) bg-(--ck-panel-inner) px-3 text-[15px] leading-none text-(--ck-title-sub) transition-colors hover:border-(--ck-cyan) hover:text-(--ck-cyan)"
    >
      <i className={`${icon} text-[17px] text-(--ck-cyan)`} aria-hidden />
      {label}
    </button>
  )
}

/** 行内小按钮（表格「查看 / 收藏」） */
export function RowButton({ label, tone }: { label: string; tone: string }) {
  return (
    <button
      type="button"
      className="shrink-0 cursor-pointer rounded-[3px] px-[7px] py-[5px] text-[14px] leading-none whitespace-nowrap transition-opacity hover:opacity-80"
      style={{
        color: tone,
        border: `1px solid color-mix(in srgb, ${tone} 45%, transparent)`,
        background: `color-mix(in srgb, ${tone} 14%, transparent)`,
      }}
    >
      {label}
    </button>
  )
}

/** 页签按钮 */
export function TabButton({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-[31px] shrink-0 cursor-pointer rounded-[4px] border px-[11px] text-[15px] leading-none whitespace-nowrap transition-colors ${
        active
          ? 'border-(--ck-cyan) bg-(--ck-cyan) text-(--ck-on-solid)'
          : 'border-(--border-light) bg-(--ck-panel-inner) text-(--text-secondary) hover:text-(--ck-title-sub)'
      }`}
    >
      {label}
    </button>
  )
}
