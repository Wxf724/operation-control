import { useEffect, useMemo, useRef, useState } from 'react'

import { DateRangePicker } from './DateRangePicker'
import type { DateRangeEdge, DatePickerTab, DateRangeValue } from './DateRangePicker'

/** 组织下拉的一个分组，如「共享中心」「驻区服务部」 */
export interface OrgGroup {
  name: string
  orgs: readonly string[]
}

/** 顶栏左侧的日期区间选择 + 粒度切换 + 组织下拉，12 个平台页与任务调整／政策分析共用 */
export interface PeriodOrgControlsProps {
  /**
   * 当前期间文案，如「2026-10-01 至 2026-10-19」或「2026 年 05 月」。
   * 既是非受控时的初始区间来源（会被解析成起止两个日期），
   * 也是 `range` 缺省时的唯一数据入口 —— 保持与改造前相同的调用方式。
   */
  period: string
  /** 日/月/年之类的粒度选项 */
  units: readonly string[]
  defaultUnit?: string
  /** 扁平组织选项（用原生 select 渲染） */
  orgs?: readonly string[]
  /** 分组组织选项：给了就渲成「组名 + 缩进项」的两级下拉，优先于 `orgs` */
  orgGroups?: readonly OrgGroup[]
  defaultOrg?: string
  className?: string

  /** 受控区间；传了就以它为准，不再解析 `period` */
  range?: DateRangeValue
  /** 区间变化回调 */
  onRangeChange?: (next: DateRangeValue) => void
  /** 粒度变化回调 */
  onUnitChange?: (unit: string) => void
  /** 组织变化回调 */
  onOrgChange?: (org: string) => void
  /** 「今天」基准，默认系统当天 */
  today?: Date
  /** 初始展开的一端（默认不展开，留给演示与自查） */
  defaultOpenEdge?: DateRangeEdge
  /** 面板初始页签 */
  defaultPickerTab?: DatePickerTab
  /** 组织下拉默认展开（默认收起，留给演示与自查） */
  defaultOrgOpen?: boolean
}

const ISO_IN_TEXT = /\d{4}-\d{1,2}-\d{1,2}/g
const YEAR_MONTH_IN_TEXT = /(\d{4})\s*年\s*(\d{1,2})\s*月/
const YEAR_IN_TEXT = /(\d{4})\s*年/

function pad2(n: number) {
  return String(n).padStart(2, '0')
}

function toISO(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

function normalizeISO(raw: string) {
  const [y, m, d] = raw.split('-')
  return `${y}-${pad2(Number(m))}-${pad2(Number(d))}`
}

/**
 * 把旧的 `period` 文案解析成起止日期。
 *
 * 三种已在用的写法都要兜住：
 *   「2026-10-01  至  2026-10-19」→ 两个 ISO 日期直接取用
 *   「2026 年 05 月」            → 当月 1 号到月末
 *   「2026 年」                  → 全年
 * 都解析不出来时退回「当月 1 号 ~ 今天」，保证输入框不会空着。
 */
function parsePeriodText(period: string, base: Date): DateRangeValue {
  const isoList = period.match(ISO_IN_TEXT)
  if (isoList && isoList.length >= 2) {
    return { start: normalizeISO(isoList[0]), end: normalizeISO(isoList[1]) }
  }
  if (isoList && isoList.length === 1) {
    const only = normalizeISO(isoList[0])
    return { start: only, end: only }
  }

  const ym = YEAR_MONTH_IN_TEXT.exec(period)
  if (ym) {
    const year = Number(ym[1])
    const month = Number(ym[2]) - 1
    return { start: toISO(new Date(year, month, 1)), end: toISO(new Date(year, month + 1, 0)) }
  }

  const y = YEAR_IN_TEXT.exec(period)
  if (y) {
    const year = Number(y[1])
    return { start: toISO(new Date(year, 0, 1)), end: toISO(new Date(year, 11, 31)) }
  }

  return {
    start: toISO(new Date(base.getFullYear(), base.getMonth(), 1)),
    end: toISO(base),
  }
}

export function PeriodOrgControls({
  period,
  units,
  defaultUnit,
  orgs,
  orgGroups,
  defaultOrg,
  className = '',
  range,
  onRangeChange,
  onUnitChange,
  onOrgChange,
  today,
  defaultOpenEdge,
  defaultPickerTab,
  defaultOrgOpen,
}: PeriodOrgControlsProps) {
  const [unit, setUnit] = useState<string>(defaultUnit ?? units[0])
  const [org, setOrg] = useState<string>(defaultOrg ?? orgGroups?.[0]?.orgs[0] ?? orgs?.[0] ?? '')

  const todayStamp = today?.getTime()
  const baseDate = useMemo(
    () => (todayStamp === undefined ? new Date() : new Date(todayStamp)),
    [todayStamp]
  )

  // 非受控：首次渲染时从 `period` 文案解析出区间，之后由用户交互驱动
  const [innerRange, setInnerRange] = useState<DateRangeValue>(() =>
    parsePeriodText(period, baseDate)
  )
  const value = range ?? innerRange

  const handleRangeChange = (next: DateRangeValue) => {
    if (!range) setInnerRange(next)
    onRangeChange?.(next)
  }

  const handleUnitChange = (next: string) => {
    setUnit(next)
    onUnitChange?.(next)
  }

  const handleOrgChange = (next: string) => {
    setOrg(next)
    onOrgChange?.(next)
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex items-center gap-2 rounded-[3px] border border-(--border) bg-(--ck-panel-inner) px-2 py-[5px]">
        <i className="ri-calendar-2-line text-[14px] text-(--ck-cyan)" aria-hidden />

        <DateRangePicker
          value={value}
          onChange={handleRangeChange}
          today={baseDate}
          defaultOpenEdge={defaultOpenEdge}
          defaultTab={defaultPickerTab}
        />

        <span className="mx-1 h-[14px] w-px bg-(--border)" />

        {units.map((u) => (
          <button
            key={u}
            type="button"
            onClick={() => handleUnitChange(u)}
            className={`cursor-pointer rounded-[2px] px-2 py-[3px] text-[13px] leading-none transition-colors ${
              unit === u
                ? 'bg-(--ck-blue) text-white'
                : 'text-(--text-secondary) hover:text-(--ck-title-sub)'
            }`}
          >
            {u}
          </button>
        ))}
      </div>

      {orgGroups?.length ? (
        <OrgGroupSelect
          groups={orgGroups}
          value={org}
          onChange={handleOrgChange}
          defaultOpen={defaultOrgOpen}
        />
      ) : (
        <label className="relative flex w-[210px] items-center">
          <select
            value={org}
            onChange={(e) => handleOrgChange(e.target.value)}
            aria-label="组织范围"
            className="w-full cursor-pointer appearance-none rounded-[3px] border border-(--border) bg-(--ck-panel-inner) px-3 py-[7px] text-[14px] leading-none text-(--ck-title-sub) outline-none focus:border-(--ck-cyan)"
          >
            {(orgs ?? []).map((o) => (
              <option key={o} value={o} className="bg-(--surface) text-(--foreground)">
                {o}
              </option>
            ))}
          </select>
          <i
            className="ri-arrow-down-s-line pointer-events-none absolute right-2 text-[16px] text-(--ck-cyan)"
            aria-hidden
          />
        </label>
      )}
    </div>
  )
}

/**
 * 两级分组组织下拉：按钮 + 浮层，浮层里先渲染组名（共享中心 / 驻区服务部），
 * 组名下面是缩进的成员项，当前选中项高亮 —— 对齐目标稿的组织树选择器。
 *
 * 默认收起；点按钮开合、点外部或 Esc 关闭、选中即回填并收起。
 * 配色全走 CSS 变量，跟随浅色主题换肤，不硬编码色值。
 */
function OrgGroupSelect({
  groups,
  value,
  onChange,
  defaultOpen = false,
}: {
  groups: readonly OrgGroup[]
  value: string
  onChange: (next: string) => void
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  const rootRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // 点浮层外部关闭
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

  // 展开时把选中项滚进可视区（驻区服务部有 50 项，默认落在顶部会看不到当前值）
  useEffect(() => {
    if (!open) return
    listRef.current
      ?.querySelector<HTMLElement>('[data-selected="true"]')
      ?.scrollIntoView({ block: 'nearest' })
  }, [open])

  return (
    <div ref={rootRef} className="relative w-[210px]">
      <button
        type="button"
        onClick={() => setOpen((cur) => !cur)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="组织范围"
        className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-[3px] border border-(--border) bg-(--ck-panel-inner) px-3 py-[7px] text-left text-[14px] leading-none text-(--ck-title-sub) transition-colors outline-none hover:border-(--ck-cyan)"
      >
        <span className="truncate">{value}</span>
        <i
          className={`ri-arrow-down-s-line shrink-0 text-[16px] text-(--ck-cyan) transition-transform ${
            open ? 'rotate-180' : ''
          }`}
          aria-hidden
        />
      </button>

      {open ? (
        <div
          ref={listRef}
          role="listbox"
          aria-label="组织范围"
          className="ck-scroll absolute top-[calc(100%+5px)] left-0 z-50 flex max-h-[420px] w-[284px] flex-col overflow-y-auto rounded-[5px] border border-(--border) bg-(--surface) py-1.5"
          style={{ boxShadow: 'var(--ck-panel-shadow, 0 10px 28px rgba(0, 0, 0, 0.18))' }}
        >
          {groups.map((group) => (
            <div key={group.name} role="group" aria-label={group.name} className="flex flex-col">
              {/* 组名：左侧带减号方块的层级标记，对齐目标稿 */}
              <span className="flex shrink-0 items-center gap-1.5 px-2.5 pt-2 pb-1.5 text-[13px] leading-none text-(--text-secondary)">
                <i
                  className="ri-checkbox-indeterminate-line text-[13px] text-(--ck-cyan)"
                  aria-hidden
                />
                {group.name}
              </span>

              {group.orgs.map((item) => {
                const selected = item === value
                return (
                  <button
                    key={item}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    data-selected={selected}
                    onClick={() => {
                      onChange(item)
                      setOpen(false)
                    }}
                    className={`ml-[9px] flex cursor-pointer items-center border-l py-[6px] pr-2.5 pl-[9px] text-left text-[13px] leading-none transition-colors ${
                      selected
                        ? 'font-medium text-(--ck-blue)'
                        : 'text-(--ck-title-sub) hover:text-(--ck-blue)'
                    }`}
                    style={{
                      borderColor: 'var(--ck-panel-inner-border)',
                      background: selected ? 'var(--accent-light)' : undefined,
                    }}
                  >
                    <span className="truncate">{item}</span>
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}

/** 返回全景座舱的小箭头按钮 */
export function BackToCockpitButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title="返回全景座舱"
      className="flex h-[30px] w-[30px] shrink-0 cursor-pointer items-center justify-center rounded-[3px] border border-(--border) bg-(--ck-panel-inner) text-[17px] text-(--ck-cyan) transition-colors hover:bg-(--accent-light)"
    >
      <i className="ri-arrow-left-line" aria-hidden />
    </button>
  )
}
