import { useEffect, useMemo, useRef, useState } from 'react'

/**
 * 通用月份选择器（大屏顶栏账期用）。
 *
 * 结构对齐 `_refs/live/51~52`：
 *   收起态 `2026-09 [日历]`，点一下弹出面板；
 *   面板两个页签 —— 「年月」在年份导航下挑 12 个月（左列 1-6、右列 7-12），
 *   「动态时间」按「相对当前时间」配 `N 年 前/后` + `N 月 前/后`。
 *
 * 与 `DateRangePicker` 的区别：这里选的是**月份**而不是日期，所以没有「年月日」日历网格页签。
 * 配色全部走 CSS 变量，跟随外层主题类（`theme-cloud-light` / `theme-cockpit`）换肤，
 * 不硬编码任何色值。
 */

/** 面板页签 */
export type MonthPickerTab = 'month' | 'dynamic'

/** 相对当前时间的方向 */
export type MonthShiftDirection = 'before' | 'after'

/** 「动态时间」页签的一组配置：年偏移 + 月偏移 */
export interface MonthDynamicValue {
  /** 年偏移量，0 表示本年 */
  years: number
  yearDirection: MonthShiftDirection
  /** 月偏移量，0 表示本月 */
  months: number
  monthDirection: MonthShiftDirection
}

export interface MonthPickerProps {
  /** 受控账期，形如 `2026-09`；空串表示未选择 */
  value: string
  /** 账期变化（点月份格 / 改动态时间配置时即时回填） */
  onChange?: (next: string) => void
  /** 未选择时的占位文案 */
  placeholder?: string
  /** 「本月」基准，默认取系统当月；传入便于静态演示与测试 */
  today?: Date
  /** 是否默认展开面板（仅调试用，默认收起） */
  defaultOpen?: boolean
  /** 面板初始页签 */
  defaultTab?: MonthPickerTab
  className?: string
}

/* ─────────────────────────── 月份工具 ─────────────────────────── */

const MONTH_RE = /^(\d{4})-(\d{1,2})$/

function pad2(n: number) {
  return String(n).padStart(2, '0')
}

/** {年, 月(0-11)} → YYYY-MM */
function toMonthKey(year: number, month: number) {
  return `${year}-${pad2(month + 1)}`
}

/** YYYY-MM → {年, 月(0-11)}（非法输入返回 null） */
function fromMonthKey(s: string): { year: number; month: number } | null {
  const m = MONTH_RE.exec(s.trim())
  if (!m) return null
  const month = Number(m[2]) - 1
  if (month < 0 || month > 11) return null
  return { year: Number(m[1]), month }
}

const DEFAULT_DYNAMIC: MonthDynamicValue = {
  years: 0,
  yearDirection: 'before',
  months: 0,
  monthDirection: 'before',
}

/** 把一组动态时间配置解析成具体月份 */
function resolveDynamic(cfg: MonthDynamicValue, base: { year: number; month: number }) {
  const ySign = cfg.yearDirection === 'before' ? -1 : 1
  const mSign = cfg.monthDirection === 'before' ? -1 : 1
  const d = new Date(base.year + ySign * cfg.years, base.month + mSign * cfg.months, 1)
  return toMonthKey(d.getFullYear(), d.getMonth())
}

/* ─────────────────────────── 主组件 ─────────────────────────── */

export function MonthPicker({
  value,
  onChange,
  placeholder = '选择月份',
  today,
  defaultOpen = false,
  defaultTab = 'month',
  className = '',
}: MonthPickerProps) {
  const [open, setOpen] = useState(defaultOpen)
  const rootRef = useRef<HTMLDivElement>(null)

  // today 可能每次渲染都是新建的 Date，按时间戳收敛成稳定引用
  const todayStamp = today?.getTime()
  const base = useMemo(() => {
    const d = todayStamp === undefined ? new Date() : new Date(todayStamp)
    return { year: d.getFullYear(), month: d.getMonth() }
  }, [todayStamp])

  // 点面板外部 / 按 Esc 关闭
  useEffect(() => {
    if (!open) return
    const handlePointerDown = (e: Event) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', handlePointerDown, true)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, true)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        aria-label="账期"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`flex h-[36px] cursor-pointer items-center gap-2 rounded-[4px] border bg-(--surface) pr-2 pl-3 transition-colors ${
          open ? 'border-(--accent)' : 'border-(--border) hover:border-(--accent)'
        }`}
      >
        <span
          className={`text-[16px] leading-none font-semibold tabular-nums ${
            value ? 'text-(--ck-title-sub)' : 'text-(--text-tertiary)'
          }`}
        >
          {value || placeholder}
        </span>
        <span className="flex h-[26px] w-[26px] items-center justify-center rounded-[3px] bg-(--accent-light)">
          <i className="ri-calendar-2-line text-[16px] text-(--ck-cyan)" aria-hidden />
        </span>
      </button>

      {open ? (
        <MonthPickerPanel
          selected={value}
          base={base}
          defaultTab={defaultTab}
          onPick={(next) => onChange?.(next)}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </div>
  )
}

/* ─────────────────────────── 弹出面板 ─────────────────────────── */

interface MonthPickerPanelProps {
  selected: string
  base: { year: number; month: number }
  defaultTab: MonthPickerTab
  onPick: (next: string) => void
  onClose: () => void
}

function MonthPickerPanel({ selected, base, defaultTab, onPick, onClose }: MonthPickerPanelProps) {
  const [tab, setTab] = useState<MonthPickerTab>(defaultTab)
  const [dynamic, setDynamic] = useState<MonthDynamicValue>(DEFAULT_DYNAMIC)

  // 打开时把视图落到已选月份所在年份，没选过就落到基准年（面板每次打开都重新挂载）
  const [year, setYear] = useState(() => (fromMonthKey(selected) ?? base).year)

  const dynamicKey = resolveDynamic(dynamic, base)

  const patchDynamic = (patch: Partial<MonthDynamicValue>) => {
    const next = { ...dynamic, ...patch }
    setDynamic(next)
    onPick(resolveDynamic(next, base))
  }

  return (
    <div
      className="absolute top-[calc(100%+10px)] right-0 z-50 w-[228px] overflow-hidden rounded-[8px] border border-(--border) bg-(--surface)"
      style={{ boxShadow: 'var(--ck-panel-shadow, 0 10px 28px rgba(0, 0, 0, 0.18))' }}
    >
      {/* 页签：只有「年月」「动态时间」—— 选的是月份，不需要日历网格 */}
      <div className="flex border-b border-(--border) bg-(--ck-panel-inner)">
        <PanelTab label="年月" active={tab === 'month'} onClick={() => setTab('month')} />
        <PanelTab label="动态时间" active={tab === 'dynamic'} onClick={() => setTab('dynamic')} />
      </div>

      <div className="min-h-[214px]">
        {tab === 'month' ? (
          <MonthGridTab
            selected={selected}
            base={base}
            year={year}
            onYearChange={setYear}
            onPick={onPick}
          />
        ) : (
          <DynamicTab value={dynamic} onChange={patchDynamic} />
        )}
      </div>

      {/* 底栏：清除 / 本月（动态页签显示解析结果） / 确定 */}
      <div className="grid grid-cols-3 border-t border-(--border) bg-(--ck-panel-inner) text-[13px] leading-none">
        <button
          type="button"
          onClick={() => onPick('')}
          className="cursor-pointer py-[9px] text-(--ck-cyan) transition-colors hover:bg-(--accent-light)"
        >
          清除
        </button>

        {tab === 'month' ? (
          <button
            type="button"
            onClick={() => {
              setYear(base.year)
              onPick(toMonthKey(base.year, base.month))
            }}
            className="cursor-pointer border-x border-(--border) py-[9px] text-(--text-secondary) transition-colors hover:bg-(--accent-light) hover:text-(--ck-cyan)"
          >
            本月
          </button>
        ) : (
          <span className="border-x border-(--border) py-[9px] text-center text-(--text-tertiary) tabular-nums">
            {dynamicKey}
          </span>
        )}

        <button
          type="button"
          onClick={() => {
            if (tab === 'dynamic') onPick(dynamicKey)
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

/* ───────────────────────── 页签一：年月 ───────────────────────── */

interface MonthGridTabProps {
  selected: string
  base: { year: number; month: number }
  year: number
  onYearChange: (next: number) => void
  onPick: (next: string) => void
}

function MonthGridTab({ selected, base, year, onYearChange, onPick }: MonthGridTabProps) {
  const years = useMemo(() => Array.from({ length: 21 }, (_, i) => base.year - 10 + i), [base.year])
  const picked = fromMonthKey(selected)

  return (
    <div className="px-3 pt-2 pb-2.5">
      {/* 年份导航 */}
      <div className="flex items-center justify-between">
        <StepArrow
          icon="ri-arrow-left-s-line"
          label="上一年"
          onClick={() => onYearChange(year - 1)}
        />
        <MiniSelect
          ariaLabel="年份"
          value={String(year)}
          options={years.map((y) => ({ value: String(y), label: String(y) }))}
          onChange={(v) => onYearChange(Number(v))}
        />
        <StepArrow
          icon="ri-arrow-right-s-line"
          label="下一年"
          onClick={() => onYearChange(year + 1)}
        />
      </div>

      {/* 月份格：按列填充，左列 1-6、右列 7-12 */}
      <div className="mt-1.5 grid grid-flow-col grid-rows-6 gap-x-4 gap-y-1">
        {Array.from({ length: 12 }, (_, i) => i).map((m) => {
          const isSelected = picked?.year === year && picked.month === m
          const isCurrent = !isSelected && base.year === year && base.month === m

          const tone = isSelected
            ? 'bg-(--ck-blue) font-medium text-(--ck-on-solid)'
            : isCurrent
              ? 'font-medium text-(--ck-cyan) ring-1 ring-(--ck-cyan) hover:bg-(--accent-light)'
              : 'text-(--foreground) hover:bg-(--accent-light)'

          return (
            <button
              key={m}
              type="button"
              onClick={() => onPick(toMonthKey(year, m))}
              className={`flex h-[25px] cursor-pointer items-center justify-center rounded-[4px] text-[13px] leading-none tabular-nums transition-colors ${tone}`}
            >
              {m + 1}
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
  value: MonthDynamicValue
  onChange: (patch: Partial<MonthDynamicValue>) => void
}) {
  return (
    <div className="flex flex-col gap-2.5 px-3 pt-2.5 pb-3">
      <span className="text-[13px] leading-none text-(--text-secondary)">相对当前时间</span>

      <ShiftRow
        amountLabel="年偏移量"
        directionLabel="年方向"
        unit="年"
        amount={value.years}
        direction={value.yearDirection}
        onAmountChange={(years) => onChange({ years })}
        onDirectionChange={(yearDirection) => onChange({ yearDirection })}
      />

      <ShiftRow
        amountLabel="月偏移量"
        directionLabel="月方向"
        unit="月"
        amount={value.months}
        direction={value.monthDirection}
        onAmountChange={(months) => onChange({ months })}
        onDirectionChange={(monthDirection) => onChange({ monthDirection })}
      />
    </div>
  )
}

/** 一行「[数字] 单位 [前/后]」 */
function ShiftRow({
  amountLabel,
  directionLabel,
  unit,
  amount,
  direction,
  onAmountChange,
  onDirectionChange,
}: {
  amountLabel: string
  directionLabel: string
  unit: string
  amount: number
  direction: MonthShiftDirection
  onAmountChange: (next: number) => void
  onDirectionChange: (next: MonthShiftDirection) => void
}) {
  return (
    <div className="flex items-center gap-1.5">
      <input
        value={String(amount)}
        inputMode="numeric"
        aria-label={amountLabel}
        onChange={(e) => {
          const digits = e.target.value.replace(/[^0-9]/g, '').slice(0, 3)
          onAmountChange(digits === '' ? 0 : Number(digits))
        }}
        className="w-[62px] rounded-[3px] border border-(--border) bg-(--surface) px-2 py-[6px] text-[13px] leading-none text-(--foreground) tabular-nums outline-none focus:border-(--ck-cyan)"
      />
      <span className="shrink-0 text-[13px] leading-none text-(--foreground)">{unit}</span>
      <FieldSelect
        ariaLabel={directionLabel}
        className="flex-1"
        value={direction}
        options={[
          { value: 'before', label: '前' },
          { value: 'after', label: '后' },
        ]}
        onChange={(v) => onDirectionChange(v as MonthShiftDirection)}
      />
    </div>
  )
}

/* ─────────────────────────── 基础控件 ─────────────────────────── */

interface SelectOption {
  value: string
  label: string
}

/** 年份的紧凑下拉（无边框，贴在导航条中间） */
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
