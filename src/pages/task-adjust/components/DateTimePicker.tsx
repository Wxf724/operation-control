import { useEffect, useMemo, useRef, useState } from 'react'

/**
 * 单日期 + 时分选择器（任务调整页专用）。
 *
 * 值的格式跟随目标稿的「完成时限」：`MM/DD HH:mm`，如 `06/18 22:00`。
 * 日历网格沿用 `DateRangePicker` 的思路（固定 6×7、周一打头、邻月淡色），
 * 但那个组件选的是**日期区间**、`MonthPicker` 选的是**月份**，都不带时分，
 * 且分别被 14 个页面和企业看板用着，所以这里本页新建，不改动共用组件。
 *
 * 配色全部走 CSS 变量，跟随 `theme-cloud-light` 换肤，不硬编码色值。
 */
export interface DateTimePickerProps {
  /** 当前值，形如 `06/18 22:00` */
  value: string
  /** 选中后回填 */
  onPick: (next: string) => void
  /** Esc 取消 */
  onCancel?: () => void
  autoFocus?: boolean
  /** 默认展开日历浮层（调试与演示用） */
  /** 年份基准（`MM/DD` 不含年份，日历需要一个年来排星期） */
  year?: number
  className?: string
}

const VALUE_RE = /^(\d{1,2})\/(\d{1,2})\s+(\d{1,2}):(\d{1,2})$/
const WEEK_HEAD = ['一', '二', '三', '四', '五', '六', '日'] as const

function pad2(n: number) {
  return String(n).padStart(2, '0')
}

interface Parsed {
  month: number
  day: number
  hour: number
  minute: number
}

/** `MM/DD HH:mm` → 结构化值（非法输入返回 null） */
function parseValue(s: string): Parsed | null {
  const m = VALUE_RE.exec(s.trim())
  if (!m) return null
  const month = Number(m[1]) - 1
  const day = Number(m[2])
  const hour = Number(m[3])
  const minute = Number(m[4])
  if (month < 0 || month > 11 || day < 1 || day > 31) return null
  if (hour > 23 || minute > 59) return null
  return { month, day, hour, minute }
}

function formatValue(p: Parsed) {
  return `${pad2(p.month + 1)}/${pad2(p.day)} ${pad2(p.hour)}:${pad2(p.minute)}`
}

/** 周一为一周起点时的星期序号（0=周一 … 6=周日） */
function mondayIndex(d: Date) {
  return (d.getDay() + 6) % 7
}

/** 月历网格：固定 6 行 × 7 列 = 42 格，周一打头，含前后补齐的邻月日期 */
function buildMonthCells(year: number, month: number) {
  const lead = mondayIndex(new Date(year, month, 1))
  return Array.from({ length: 42 }, (_, i) => new Date(year, month, 1 - lead + i))
}

export function DateTimePicker({
  value,
  onPick,
  onCancel,
  autoFocus = false,
  year = new Date().getFullYear(),
  className = '',
}: DateTimePickerProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const parsed = useMemo(
    () => parseValue(value) ?? { month: 0, day: 1, hour: 0, minute: 0 },
    [value]
  )
  const [view, setView] = useState({ year, month: parsed.month })

  useEffect(() => {
    if (autoFocus) triggerRef.current?.focus()
  }, [autoFocus])

  // 点浮层外部关闭日历（不取消编辑态，保留当前值）
  useEffect(() => {
    if (!open) return
    const handlePointerDown = (e: Event) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', handlePointerDown, true)
    return () => document.removeEventListener('pointerdown', handlePointerDown, true)
  }, [open])

  const patch = (p: Partial<Parsed>) => onPick(formatValue({ ...parsed, ...p }))

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      e.stopPropagation()
      if (open) setOpen(false)
      else onCancel?.()
      return
    }
    if (e.key === 'Enter' && !open) {
      e.preventDefault()
      setOpen(true)
    }
  }

  const cells = useMemo(() => buildMonthCells(view.year, view.month), [view.year, view.month])

  const step = (delta: number) => {
    const d = new Date(view.year, view.month + delta, 1)
    setView({ year: d.getFullYear(), month: d.getMonth() })
  }

  return (
    <div ref={rootRef} className={`relative ${className}`} onKeyDown={handleKeyDown}>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-label="完成时限"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-[3px] border border-(--ck-blue) bg-(--surface) px-[9px] py-[6px] text-[17px] leading-[19px] text-(--foreground) outline-none"
      >
        <span className="tabular-nums">{value}</span>
        <i className="ri-calendar-2-line text-[17px] text-(--ck-cyan)" aria-hidden />
      </button>

      {open ? (
        <div
          className="absolute top-[calc(100%+6px)] left-0 z-[90] w-[272px] overflow-hidden rounded-[6px] border border-(--border) bg-(--surface)"
          style={{ boxShadow: 'var(--ck-panel-shadow, 0 10px 28px rgba(0, 0, 0, 0.18))' }}
        >
          <div className="px-3 pt-2 pb-2">
            <div className="flex items-center justify-between">
              <StepArrow icon="ri-arrow-left-s-line" label="上一月" onClick={() => step(-1)} />
              <span className="text-[14px] leading-none font-medium text-(--ck-title-sub) tabular-nums">
                {view.year} - {pad2(view.month + 1)}
              </span>
              <StepArrow icon="ri-arrow-right-s-line" label="下一月" onClick={() => step(1)} />
            </div>

            <div className="mt-1.5 grid grid-cols-7">
              {WEEK_HEAD.map((w) => (
                <span
                  key={w}
                  className="py-1 text-center text-[12px] leading-none text-(--text-secondary)"
                >
                  {w}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-y-0.5">
              {cells.map((d) => {
                const inMonth = d.getMonth() === view.month
                const isSelected = inMonth && d.getMonth() === parsed.month && d.getDate() === parsed.day

                return (
                  <button
                    key={`${d.getMonth()}-${d.getDate()}-${d.getTime()}`}
                    type="button"
                    onClick={() => {
                      if (!inMonth) setView({ year: d.getFullYear(), month: d.getMonth() })
                      patch({ month: d.getMonth(), day: d.getDate() })
                    }}
                    className={`mx-auto flex h-[29px] w-[29px] cursor-pointer items-center justify-center rounded-[4px] text-[13px] leading-none tabular-nums transition-colors ${
                      isSelected
                        ? 'bg-(--ck-blue) font-medium text-(--ck-on-solid)'
                        : inMonth
                          ? 'text-(--foreground) hover:bg-(--accent-light)'
                          : 'text-(--text-tertiary) hover:bg-(--accent-light)'
                    }`}
                  >
                    {d.getDate()}
                  </button>
                )
              })}
            </div>
          </div>

          <TimeRow
            hour={parsed.hour}
            minute={parsed.minute}
            onHourChange={(hour) => patch({ hour })}
            onMinuteChange={(minute) => patch({ minute })}
            onDone={() => setOpen(false)}
          />
        </div>
      ) : null}
    </div>
  )
}

function StepArrow({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className="flex h-[22px] w-[22px] cursor-pointer items-center justify-center rounded-[3px] text-[16px] text-(--text-secondary) transition-colors hover:bg-(--accent-light) hover:text-(--ck-cyan)"
    >
      <i className={icon} aria-hidden />
    </button>
  )
}

/** 底栏：时 / 分两个下拉 + 确定 */
function TimeRow({
  hour,
  minute,
  onHourChange,
  onMinuteChange,
  onDone,
}: {
  hour: number
  minute: number
  onHourChange: (next: number) => void
  onMinuteChange: (next: number) => void
  onDone: () => void
}) {
  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), [])
  const minutes = useMemo(() => Array.from({ length: 12 }, (_, i) => i * 5), [])

  return (
    <div className="flex items-center gap-1.5 border-t border-(--border) bg-(--ck-panel-inner) px-3 py-2">
      <span className="text-[13px] leading-none text-(--text-secondary)">时间</span>
      <TimeSelect ariaLabel="时" value={hour} options={hours} onChange={onHourChange} />
      <span className="text-[13px] leading-none text-(--foreground)">:</span>
      <TimeSelect ariaLabel="分" value={minute} options={minutes} onChange={onMinuteChange} />
      <button
        type="button"
        onClick={onDone}
        className="ml-auto cursor-pointer rounded-[3px] px-2.5 py-[5px] text-[13px] leading-none font-medium text-(--ck-cyan) transition-colors hover:bg-(--accent-light)"
      >
        确定
      </button>
    </div>
  )
}

function TimeSelect({
  value,
  options,
  onChange,
  ariaLabel,
}: {
  value: number
  options: number[]
  onChange: (next: number) => void
  ariaLabel: string
}) {
  return (
    <span className="relative flex items-center">
      <select
        value={String(value)}
        aria-label={ariaLabel}
        onChange={(e) => onChange(Number(e.target.value))}
        className="cursor-pointer appearance-none rounded-[3px] border border-(--border) bg-(--surface) py-[5px] pr-5 pl-2 text-[13px] leading-none text-(--foreground) tabular-nums outline-none focus:border-(--ck-cyan)"
      >
        {options.map((o) => (
          <option key={o} value={String(o)}>
            {pad2(o)}
          </option>
        ))}
      </select>
      <i
        className="ri-arrow-down-s-line pointer-events-none absolute right-0.5 text-[14px] text-(--ck-cyan)"
        aria-hidden
      />
    </span>
  )
}
