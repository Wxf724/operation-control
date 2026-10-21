import { useMemo, useState } from 'react'

import { DateRangePicker } from './DateRangePicker'
import type { DateRangeEdge, DatePickerTab, DateRangeValue } from './DateRangePicker'

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
  orgs: readonly string[]
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
  defaultOrg,
  className = '',
  range,
  onRangeChange,
  onUnitChange,
  onOrgChange,
  today,
  defaultOpenEdge,
  defaultPickerTab,
}: PeriodOrgControlsProps) {
  const [unit, setUnit] = useState<string>(defaultUnit ?? units[0])
  const [org, setOrg] = useState<string>(defaultOrg ?? orgs[0])

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

      <label className="relative flex w-[210px] items-center">
        <select
          value={org}
          onChange={(e) => handleOrgChange(e.target.value)}
          aria-label="组织范围"
          className="w-full cursor-pointer appearance-none rounded-[3px] border border-(--border) bg-(--ck-panel-inner) px-3 py-[7px] text-[14px] leading-none text-(--ck-title-sub) outline-none focus:border-(--ck-cyan)"
        >
          {orgs.map((o) => (
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
