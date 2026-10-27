import { useEffect, useMemo, useRef, useState } from 'react'

/**
 * 通用日期区间选择器（大屏顶栏用）。
 *
 * 结构对齐 `_refs/live/46~48`：
 *   收起态 `起始日期 [日历] 至 结束日期 [日历]`，点任一输入框弹出面板；
 *   面板两个页签 —— 「年月日」挑静态日期，「动态时间」配相对当前时间的滚动区间。
 *
 * 配色全部走 CSS 变量，跟随外层主题类（`theme-cloud-light` / `theme-cockpit`）换肤，
 * 不硬编码任何色值。
 */

/** 区间值，ISO 日期串（YYYY-MM-DD）；空串表示未选择 */
export interface DateRangeValue {
  /** 区间起点 */
  start: string
  /** 区间终点 */
  end: string
}

/** 区间的哪一端 */
export type DateRangeEdge = 'start' | 'end'

/** 面板页签 */
export type DatePickerTab = 'calendar' | 'dynamic'

/** 动态时间的粒度 */
export type DynamicUnit = 'year' | 'quarter' | 'month' | 'week' | 'day'

/** 动态时间的方向：相对当前时间往前 / 往后 */
export type DynamicDirection = 'before' | 'after'

/** 动态时间落点：所在周期的当天 / 期初 / 期末 */
export type DynamicAnchor = 'current' | 'start' | 'end'

/** 「动态时间」页签的一组配置 */
export interface DynamicTimeValue {
  unit: DynamicUnit
  /** 偏移量，0 表示本期 */
  amount: number
  direction: DynamicDirection
  anchor: DynamicAnchor
}

export interface DateRangePickerProps {
  /** 受控区间值 */
  value: DateRangeValue
  /** 区间变化（点日期格 / 改动态时间配置时即时回填） */
  onChange?: (next: DateRangeValue) => void
  /** 两个输入框之间的连接词 */
  separator?: string
  /** 未选择时的占位文案 */
  placeholder?: string
  /** 「今天」基准，默认取系统当天；传入便于静态演示与测试 */
  today?: Date
  /** 初始展开的一端（默认不展开） */
  defaultOpenEdge?: DateRangeEdge
  /** 面板初始页签 */
  defaultTab?: DatePickerTab
  /** 弹出面板对齐方向；顶栏右侧使用 right，避免超出画布 */
  panelAlign?: 'left' | 'right'
  className?: string
}

/* ─────────────────────────── 日期工具 ─────────────────────────── */

const ISO_RE = /^(\d{4})-(\d{2})-(\d{2})$/

function pad2(n: number) {
  return String(n).padStart(2, '0')
}

/** Date → YYYY-MM-DD */
function toISO(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

/** YYYY-MM-DD → Date（非法输入返回 null） */
function fromISO(s: string): Date | null {
  const m = ISO_RE.exec(s.trim())
  if (!m) return null
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
  return Number.isNaN(d.getTime()) ? null : d
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

/** 周一为一周起点时的星期序号（0=周一 … 6=周日） */
function mondayIndex(d: Date) {
  return (d.getDay() + 6) % 7
}

/**
 * 月历网格：固定 6 行 × 7 列 = 42 格，周一打头。
 * 前后补齐的邻月日期也一并返回，由调用方按「是否本月」渲染成淡色。
 */
function buildMonthCells(year: number, month: number) {
  const lead = mondayIndex(new Date(year, month, 1))
  const cells: Date[] = []
  for (let i = 0; i < 42; i += 1) {
    cells.push(new Date(year, month, 1 - lead + i))
  }
  return cells
}

/* ───────────────────────── 动态时间解析 ───────────────────────── */

const DYNAMIC_UNITS: ReadonlyArray<{ key: DynamicUnit; label: string }> = [
  { key: 'year', label: '年' },
  { key: 'quarter', label: '季' },
  { key: 'month', label: '月' },
  { key: 'week', label: '周' },
  { key: 'day', label: '天' },
]

/** 不同粒度下「期初 / 期末」的中文说法 */
const ANCHOR_LABELS: Record<DynamicUnit, { start: string; end: string }> = {
  year: { start: '年初', end: '年末' },
  quarter: { start: '季初', end: '季末' },
  month: { start: '月初', end: '月末' },
  week: { start: '周初', end: '周末' },
  day: { start: '当天', end: '当天' },
}

const DEFAULT_DYNAMIC: DynamicTimeValue = {
  unit: 'year',
  amount: 0,
  direction: 'before',
  anchor: 'current',
}

/** 按粒度把基准日平移 offset 个单位 */
function shiftByUnit(base: Date, unit: DynamicUnit, offset: number) {
  const y = base.getFullYear()
  const m = base.getMonth()
  const d = base.getDate()
  if (unit === 'year') return new Date(y + offset, m, d)
  if (unit === 'quarter') return new Date(y, m + offset * 3, d)
  if (unit === 'month') return new Date(y, m + offset, d)
  if (unit === 'week') return new Date(y, m, d + offset * 7)
  return new Date(y, m, d + offset)
}

/** 取平移后所在周期的端点 */
function anchorOfUnit(d: Date, unit: DynamicUnit, anchor: DynamicAnchor) {
  if (anchor === 'current' || unit === 'day') return d
  const y = d.getFullYear()
  const m = d.getMonth()
  const atStart = anchor === 'start'

  if (unit === 'year') return atStart ? new Date(y, 0, 1) : new Date(y, 11, 31)
  if (unit === 'quarter') {
    const qm = Math.floor(m / 3) * 3
    return atStart ? new Date(y, qm, 1) : new Date(y, qm + 3, 0)
  }
  if (unit === 'month') return atStart ? new Date(y, m, 1) : new Date(y, m + 1, 0)

  // 周：周一到周日
  const monday = new Date(y, m, d.getDate() - mondayIndex(d))
  return atStart ? monday : new Date(y, m, monday.getDate() + 6)
}

/** 把一组动态时间配置解析成具体日期 */
function resolveDynamic(cfg: DynamicTimeValue, base: Date) {
  const amount = Number.isFinite(cfg.amount) ? cfg.amount : 0
  const offset = (cfg.direction === 'before' ? -1 : 1) * amount
  return anchorOfUnit(shiftByUnit(startOfDay(base), cfg.unit, offset), cfg.unit, cfg.anchor)
}

/* ─────────────────────────── 主组件 ─────────────────────────── */

const WEEK_HEAD = ['一', '二', '三', '四', '五', '六', '日'] as const

export function DateRangePicker({
  value,
  onChange,
  separator = '至',
  placeholder = '选择日期',
  today,
  defaultOpenEdge,
  defaultTab = 'calendar',
  panelAlign = 'left',
  className = '',
}: DateRangePickerProps) {
  const [openEdge, setOpenEdge] = useState<DateRangeEdge | null>(defaultOpenEdge ?? null)
  const rootRef = useRef<HTMLDivElement>(null)

  // today 可能每次渲染都是新建的 Date，按时间戳收敛成稳定引用
  const todayStamp = today?.getTime()
  const baseDate = useMemo(
    () => startOfDay(todayStamp === undefined ? new Date() : new Date(todayStamp)),
    [todayStamp]
  )

  // 点面板外部 / 按 Esc 关闭
  useEffect(() => {
    if (!openEdge) return
    const handlePointerDown = (e: Event) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpenEdge(null)
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenEdge(null)
    }
    document.addEventListener('pointerdown', handlePointerDown, true)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, true)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [openEdge])

  /** 回填一端；起点晚于终点时把另一端一起带过去，保证区间始终合法 */
  const commit = (edge: DateRangeEdge, iso: string) => {
    let start = value.start
    let end = value.end
    if (edge === 'start') {
      start = iso
      if (iso && end && iso > end) end = iso
    } else {
      end = iso
      if (iso && start && iso < start) start = iso
    }
    onChange?.({ start, end })
  }

  const renderEdge = (edge: DateRangeEdge) => {
    const text = value[edge]
    const open = openEdge === edge
    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpenEdge(open ? null : edge)}
          aria-label={edge === 'start' ? '起始日期' : '结束日期'}
          aria-expanded={open}
          className={`flex cursor-pointer items-center gap-1.5 rounded-[3px] px-1.5 py-[3px] transition-colors ${
            open ? 'bg-(--accent-light)' : 'hover:bg-(--accent-light)'
          }`}
        >
          <span
            className={`text-[14px] leading-none font-medium whitespace-nowrap tabular-nums ${
              text ? 'text-(--ck-title-sub)' : 'text-(--text-tertiary)'
            }`}
          >
            {text || placeholder}
          </span>
          <i className="ri-calendar-line text-[14px] text-(--ck-cyan)" aria-hidden />
        </button>

        {open ? (
          <DatePickerPanel
            key={edge}
            selected={text}
            baseDate={baseDate}
            defaultTab={defaultTab}
            align={panelAlign}
            onPick={(iso) => commit(edge, iso)}
            onClose={() => setOpenEdge(null)}
          />
        ) : null}
      </div>
    )
  }

  return (
    <div ref={rootRef} className={`flex items-center gap-1 ${className}`}>
      {renderEdge('start')}
      <span className="px-0.5 text-[13px] leading-none text-(--text-secondary)">{separator}</span>
      {renderEdge('end')}
    </div>
  )
}

/* ─────────────────────────── 弹出面板 ─────────────────────────── */

interface DatePickerPanelProps {
  selected: string
  baseDate: Date
  defaultTab: DatePickerTab
  align: 'left' | 'right'
  onPick: (iso: string) => void
  onClose: () => void
}

function DatePickerPanel({
  selected,
  baseDate,
  defaultTab,
  align,
  onPick,
  onClose,
}: DatePickerPanelProps) {
  const [tab, setTab] = useState<DatePickerTab>(defaultTab)
  const [dynamic, setDynamic] = useState<DynamicTimeValue>(DEFAULT_DYNAMIC)

  // 打开时把视图落到已选日期所在月份，没选过就落到基准日（面板每次打开都重新挂载）
  const [view, setView] = useState(() => {
    const anchor = fromISO(selected) ?? baseDate
    return { year: anchor.getFullYear(), month: anchor.getMonth() }
  })

  const dynamicISO = toISO(resolveDynamic(dynamic, baseDate))

  const patchDynamic = (patch: Partial<DynamicTimeValue>) => {
    const next = { ...dynamic, ...patch }
    setDynamic(next)
    onPick(toISO(resolveDynamic(next, baseDate)))
  }

  return (
    <div
      className={`absolute top-[calc(100%+10px)] z-50 w-[276px] overflow-hidden rounded-[8px] border border-(--border) bg-(--surface) ${align === 'right' ? 'right-0' : 'left-0'}`}
      style={{ boxShadow: 'var(--ck-panel-shadow, 0 10px 28px rgba(0, 0, 0, 0.18))' }}
    >
      {/* 页签 */}
      <div className="flex border-b border-(--border) bg-(--ck-panel-inner)">
        <PanelTab label="年月日" active={tab === 'calendar'} onClick={() => setTab('calendar')} />
        <PanelTab label="动态时间" active={tab === 'dynamic'} onClick={() => setTab('dynamic')} />
      </div>

      <div className="min-h-[236px]">
        {tab === 'calendar' ? (
          <CalendarTab
            selected={selected}
            baseDate={baseDate}
            view={view}
            onViewChange={setView}
            onPick={onPick}
          />
        ) : (
          <DynamicTab value={dynamic} onChange={patchDynamic} />
        )}
      </div>

      {/* 底栏：清除 / 今天（动态页签显示解析结果） / 确定 */}
      <div className="grid grid-cols-3 border-t border-(--border) bg-(--ck-panel-inner) text-[13px] leading-none">
        <button
          type="button"
          onClick={() => onPick('')}
          className="cursor-pointer py-[9px] text-(--ck-cyan) transition-colors hover:bg-(--accent-light)"
        >
          清除
        </button>

        {tab === 'calendar' ? (
          <button
            type="button"
            onClick={() => {
              setView({ year: baseDate.getFullYear(), month: baseDate.getMonth() })
              onPick(toISO(baseDate))
            }}
            className="cursor-pointer border-x border-(--border) py-[9px] text-(--text-secondary) transition-colors hover:bg-(--accent-light) hover:text-(--ck-cyan)"
          >
            今天
          </button>
        ) : (
          <span className="border-x border-(--border) py-[9px] text-center text-(--text-tertiary) tabular-nums">
            {dynamicISO}
          </span>
        )}

        <button
          type="button"
          onClick={() => {
            if (tab === 'dynamic') onPick(dynamicISO)
            onClose()
          }}
          className="cursor-pointer py-[9px] font-medium text-(--ck-cyan) transition-colors hover:bg-(--accent-light)"
        >
          确定
        </button>
      </div>
    </div>
  )
}

function PanelTab({
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
      className={`relative flex-1 cursor-pointer py-[9px] text-[13px] leading-none transition-colors ${
        active
          ? 'font-medium text-(--ck-cyan)'
          : 'text-(--text-secondary) hover:text-(--ck-title-sub)'
      }`}
    >
      {label}
      {active ? (
        <span className="absolute inset-x-3 -bottom-px h-[2px] rounded-full bg-(--ck-cyan)" />
      ) : null}
    </button>
  )
}

/* ───────────────────────── 页签一：年月日 ───────────────────────── */

interface CalendarTabProps {
  selected: string
  baseDate: Date
  view: { year: number; month: number }
  onViewChange: (next: { year: number; month: number }) => void
  onPick: (iso: string) => void
}

function CalendarTab({ selected, baseDate, view, onViewChange, onPick }: CalendarTabProps) {
  const cells = useMemo(() => buildMonthCells(view.year, view.month), [view.year, view.month])
  const years = useMemo(() => {
    const center = baseDate.getFullYear()
    return Array.from({ length: 21 }, (_, i) => center - 10 + i)
  }, [baseDate])
  const todayISO = toISO(baseDate)

  const step = (delta: number) => {
    const d = new Date(view.year, view.month + delta, 1)
    onViewChange({ year: d.getFullYear(), month: d.getMonth() })
  }

  return (
    <div className="px-3 pt-2 pb-2.5">
      {/* 年月导航 */}
      <div className="flex items-center justify-between">
        <StepArrow icon="ri-arrow-left-s-line" label="上一月" onClick={() => step(-1)} />
        <div className="flex items-center gap-1">
          <MiniSelect
            ariaLabel="年份"
            value={String(view.year)}
            options={years.map((y) => ({ value: String(y), label: String(y) }))}
            onChange={(v) => onViewChange({ year: Number(v), month: view.month })}
          />
          <MiniSelect
            ariaLabel="月份"
            value={String(view.month)}
            options={Array.from({ length: 12 }, (_, i) => ({
              value: String(i),
              label: pad2(i + 1),
            }))}
            onChange={(v) => onViewChange({ year: view.year, month: Number(v) })}
          />
        </div>
        <StepArrow icon="ri-arrow-right-s-line" label="下一月" onClick={() => step(1)} />
      </div>

      {/* 星期表头 */}
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

      {/* 日期格 */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((d) => {
          const iso = toISO(d)
          const inMonth = d.getMonth() === view.month
          const isSelected = iso === selected
          const isToday = iso === todayISO && !isSelected

          const tone = isSelected
            ? 'bg-(--ck-blue) font-medium text-(--ck-on-solid)'
            : isToday
              ? 'font-medium text-(--ck-cyan) ring-1 ring-(--ck-cyan) hover:bg-(--accent-light)'
              : inMonth
                ? 'text-(--foreground) hover:bg-(--accent-light)'
                : 'text-(--text-tertiary) hover:bg-(--accent-light)'

          return (
            <button
              key={iso}
              type="button"
              onClick={() => {
                if (!inMonth) onViewChange({ year: d.getFullYear(), month: d.getMonth() })
                onPick(iso)
              }}
              className={`mx-auto flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-[4px] text-[13px] leading-none tabular-nums transition-colors ${tone}`}
            >
              {d.getDate()}
            </button>
          )
        })}
      </div>
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

/* ──────────────────────── 页签二：动态时间 ──────────────────────── */

function DynamicTab({
  value,
  onChange,
}: {
  value: DynamicTimeValue
  onChange: (patch: Partial<DynamicTimeValue>) => void
}) {
  const unitLabel = DYNAMIC_UNITS.find((u) => u.key === value.unit)?.label ?? ''
  const anchorText = ANCHOR_LABELS[value.unit]
  const anchorOptions =
    value.unit === 'day'
      ? [{ value: 'current', label: '当天' }]
      : [
          { value: 'current', label: '当天' },
          { value: 'start', label: anchorText.start },
          { value: 'end', label: anchorText.end },
        ]

  return (
    <div className="flex flex-col gap-2.5 px-3 pt-2.5 pb-3">
      <span className="text-[13px] leading-none text-(--text-secondary)">相对当前时间</span>

      {/* 粒度：外观是复选框，同一时间只有一个生效 */}
      <div className="flex items-center justify-between">
        {DYNAMIC_UNITS.map((u) => {
          const checked = value.unit === u.key
          return (
            <label
              key={u.key}
              className="flex cursor-pointer items-center gap-1 text-[13px] leading-none text-(--foreground)"
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onChange({ unit: u.key, anchor: 'current' })}
                className="sr-only"
              />
              <span
                className={`flex h-[14px] w-[14px] items-center justify-center rounded-[2px] border transition-colors ${
                  checked ? 'border-(--ck-blue) bg-(--ck-blue)' : 'border-(--border) bg-(--surface)'
                }`}
              >
                {checked ? (
                  <i className="ri-check-line text-[11px] text-(--ck-on-solid)" aria-hidden />
                ) : null}
              </span>
              {u.label}
            </label>
          )
        })}
      </div>

      {/* 偏移量 + 单位 + 前/后 */}
      <div className="flex items-center gap-1.5">
        <input
          value={String(value.amount)}
          inputMode="numeric"
          aria-label="偏移量"
          onChange={(e) => {
            const digits = e.target.value.replace(/[^0-9]/g, '').slice(0, 3)
            onChange({ amount: digits === '' ? 0 : Number(digits) })
          }}
          className="w-[62px] rounded-[3px] border border-(--border) bg-(--surface) px-2 py-[6px] text-[13px] leading-none text-(--foreground) tabular-nums outline-none focus:border-(--ck-cyan)"
        />
        <span className="shrink-0 text-[13px] leading-none text-(--foreground)">{unitLabel}</span>
        <FieldSelect
          ariaLabel="方向"
          className="flex-1"
          value={value.direction}
          options={[
            { value: 'before', label: '前' },
            { value: 'after', label: '后' },
          ]}
          onChange={(v) => onChange({ direction: v as DynamicDirection })}
        />
      </div>

      {/* 落点 */}
      <FieldSelect
        ariaLabel="落点"
        value={value.anchor}
        options={anchorOptions}
        onChange={(v) => onChange({ anchor: v as DynamicAnchor })}
      />
    </div>
  )
}

/* ─────────────────────────── 基础控件 ─────────────────────────── */

interface SelectOption {
  value: string
  label: string
}

/** 年 / 月 的紧凑下拉（无边框，贴在日历头部） */
function MiniSelect({
  value,
  options,
  onChange,
  ariaLabel,
}: {
  value: string
  options: SelectOption[]
  onChange: (value: string) => void
  ariaLabel: string
}) {
  return (
    <span className="relative flex items-center">
      <select
        value={value}
        aria-label={ariaLabel}
        onChange={(e) => onChange(e.target.value)}
        className="cursor-pointer appearance-none rounded-[3px] bg-transparent py-[3px] pr-5 pl-1.5 text-[13px] leading-none font-medium text-(--ck-title-sub) tabular-nums outline-none hover:bg-(--accent-light)"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
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

/** 整行带边框的下拉 */
function FieldSelect({
  value,
  options,
  onChange,
  ariaLabel,
  className = '',
}: {
  value: string
  options: SelectOption[]
  onChange: (value: string) => void
  ariaLabel: string
  className?: string
}) {
  return (
    <span className={`relative flex items-center ${className}`}>
      <select
        value={value}
        aria-label={ariaLabel}
        onChange={(e) => onChange(e.target.value)}
        className="w-full cursor-pointer appearance-none rounded-[3px] border border-(--border) bg-(--surface) py-[6px] pr-6 pl-2 text-[13px] leading-none text-(--foreground) outline-none focus:border-(--ck-cyan)"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <i
        className="ri-arrow-down-s-line pointer-events-none absolute right-1.5 text-[15px] text-(--ck-cyan)"
        aria-hidden
      />
    </span>
  )
}
