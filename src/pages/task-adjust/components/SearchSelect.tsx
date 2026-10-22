import { useEffect, useMemo, useRef, useState } from 'react'

/**
 * 可搜索下拉框（任务调整页专用）。
 *
 * 输入框 + 浮层候选列表：输入即按关键词过滤，↑↓ 移高亮、Enter 选中、Esc 关闭。
 * 项目里原有的 `DateRangePicker` / `MonthPicker` 是区间 / 月份选择，不含搜索下拉，
 * 所以这里新建一个本页轻量实现，不动共用组件。
 *
 * 配色全部走 CSS 变量，跟随 `theme-cloud-light` 换肤，不硬编码色值。
 */
export interface SearchSelectProps {
  /** 当前值 */
  value: string
  /** 候选项 */
  options: readonly string[]
  /** 选中某一项（点击 / Enter） */
  onPick: (next: string) => void
  /** 输入框内容变化（自由输入也算一次编辑） */
  onInput?: (next: string) => void
  /** Esc 取消 */
  onCancel?: () => void
  /** 自动聚焦（双击进入编辑态时需要） */
  autoFocus?: boolean
  /** 默认展开候选浮层（调试与演示用） */
  placeholder?: string
  className?: string
}

export function SearchSelect({
  value,
  options,
  onPick,
  onInput,
  onCancel,
  autoFocus = false,
  placeholder = '搜索…',
  className = '',
}: SearchSelectProps) {
  const [keyword, setKeyword] = useState(value)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // 过滤：空关键词 / 关键词恰好等于当前值时展示全部，否则按包含匹配
  const filtered = useMemo(() => {
    const kw = keyword.trim()
    if (!kw || kw === value) return [...options]
    return options.filter((o) => o.includes(kw))
  }, [keyword, value, options])

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus()
  }, [autoFocus])

  // 过滤结果变化后把高亮收回到合法范围
  useEffect(() => {
    setActive((i) => (i >= filtered.length ? 0 : i))
  }, [filtered.length])

  // 高亮项滚动进可视区
  useEffect(() => {
    if (!open) return
    const el = listRef.current?.children[active] as HTMLElement | undefined
    el?.scrollIntoView({ block: 'nearest' })
  }, [active, open])

  // 点浮层外部关闭下拉（不取消编辑态，保留当前输入）
  useEffect(() => {
    if (!open) return
    const handlePointerDown = (e: Event) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', handlePointerDown, true)
    return () => document.removeEventListener('pointerdown', handlePointerDown, true)
  }, [open])

  const commit = (next: string) => {
    setKeyword(next)
    setOpen(false)
    onPick(next)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      e.stopPropagation()
      if (open) setOpen(false)
      else onCancel?.()
      return
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      if (!open) {
        setOpen(true)
        return
      }
      if (filtered.length === 0) return
      const delta = e.key === 'ArrowDown' ? 1 : -1
      setActive((i) => (i + delta + filtered.length) % filtered.length)
      return
    }
    if (e.key === 'Enter') {
      e.preventDefault()
      const hit = open ? filtered[active] : undefined
      commit(hit ?? keyword.trim())
    }
  }

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <input
        ref={inputRef}
        value={keyword}
        placeholder={placeholder}
        aria-label="搜索并选择"
        onChange={(e) => {
          setKeyword(e.target.value)
          setOpen(true)
          onInput?.(e.target.value)
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        className="w-full rounded-[3px] border border-(--ck-blue) bg-(--surface) px-[9px] py-[6px] text-[17px] leading-[19px] text-(--foreground) outline-none"
      />

      {open ? (
        <div
          ref={listRef}
          role="listbox"
          className="ck-scroll absolute top-[calc(100%+6px)] left-0 z-[90] max-h-[188px] w-full min-w-[132px] overflow-y-auto rounded-[5px] border border-(--border) bg-(--surface) py-1"
          style={{ boxShadow: 'var(--ck-panel-shadow, 0 10px 28px rgba(0, 0, 0, 0.18))' }}
        >
          {filtered.length === 0 ? (
            <span className="block px-[10px] py-[7px] text-[15px] leading-none text-(--text-tertiary)">
              无匹配项
            </span>
          ) : (
            filtered.map((o, i) => (
              <button
                key={o}
                type="button"
                role="option"
                aria-selected={o === value}
                onMouseEnter={() => setActive(i)}
                onClick={() => commit(o)}
                className={`block w-full cursor-pointer px-[10px] py-[7px] text-left text-[16px] leading-none whitespace-nowrap transition-colors ${
                  i === active
                    ? 'bg-(--accent-light) text-(--ck-cyan)'
                    : o === value
                      ? 'font-medium text-(--ck-blue)'
                      : 'text-(--foreground)'
                }`}
              >
                {o}
              </button>
            ))
          )}
        </div>
      ) : null}
    </div>
  )
}
