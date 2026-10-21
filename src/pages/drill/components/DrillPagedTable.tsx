import { useMemo, useState } from 'react'

import type { DrillColumn } from '../types'

/** 带分页器的明细表格 */
export interface DrillPagedTableProps {
  /** 除「序号」外的列（「序号」由本组件自动补在最左） */
  columns: readonly DrillColumn[]
  /** 行数据，单元格顺序与 columns 一一对应 */
  rows: readonly string[][]
  /** 每页条数 */
  pageSize?: number
  className?: string
}

/** 「序号」列固定宽度 */
const INDEX_WIDTH = '80px'

/** 默认每页条数（与参考图 57／58 的「167 条 / 2 页」一致） */
const DEFAULT_PAGE_SIZE = 100

type SortState = { key: string; dir: 'asc' | 'desc' }

/**
 * 明细表格（分页版）：浅蓝表头 + 白／浅蓝交替行 + 可滚动表体，
 * 底部左侧「共 N 条数据」、右下角页码输入框 + 「/总页数」+ 上下翻页箭头。
 *
 * 与 `DrillTable` 的区别只在底部多了分页器、表体按页切片；
 * 列排序逻辑一致（数值列剥掉千分位与百分号后按数字比）。
 */
export function DrillPagedTable({
  columns,
  rows,
  pageSize = DEFAULT_PAGE_SIZE,
  className = '',
}: DrillPagedTableProps) {
  const [sort, setSort] = useState<SortState | null>(null)
  const [page, setPage] = useState(1)

  const template = `${INDEX_WIDTH} ${columns.map((col) => col.width).join(' ')}`
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize))
  const current = Math.min(page, pageCount)

  const sorted = useMemo(() => {
    if (!sort) return rows
    const idx = columns.findIndex((col) => col.key === sort.key)
    if (idx < 0) return rows
    const sign = sort.dir === 'asc' ? 1 : -1
    return [...rows].sort((a, b) => sign * compareCell(a[idx], b[idx]))
  }, [rows, columns, sort])

  const start = (current - 1) * pageSize
  const visible = sorted.slice(start, start + pageSize)

  const toggleSort = (key: string) => {
    setSort((prev) =>
      prev?.key === key && prev.dir === 'asc' ? { key, dir: 'desc' } : { key, dir: 'asc' }
    )
    setPage(1)
  }

  const goto = (next: number) => setPage(Math.min(pageCount, Math.max(1, next)))

  return (
    <section
      className={`ck-panel flex min-h-0 flex-col rounded-(--ck-panel-radius) p-3 ${className}`}
    >
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[8px] border border-(--border)">
        {/* 表头 */}
        <div
          className="grid h-[46px] shrink-0 items-center"
          style={{ gridTemplateColumns: template, background: 'var(--ck-table-head)' }}
        >
          <HeadCell title="序号" align="center" />
          {columns.map((col) => (
            <HeadCell
              key={col.key}
              title={col.title}
              align={col.align ?? 'center'}
              sortable={col.sortable}
              sortDir={sort?.key === col.key ? sort.dir : undefined}
              onSort={col.sortable ? () => toggleSort(col.key) : undefined}
            />
          ))}
        </div>

        {/* 表体 */}
        <div className="ck-scroll min-h-0 flex-1 overflow-y-auto">
          {visible.map((row, i) => (
            <div
              key={`${row[0]}-${start + i}`}
              className="grid h-[42px] items-center border-b border-(--border-light) last:border-b-0"
              style={{
                gridTemplateColumns: template,
                background: i % 2 === 0 ? 'var(--ck-table-row)' : 'var(--ck-table-row-alt)',
              }}
            >
              <span className="text-center text-[15px] leading-none text-(--text-secondary) tabular-nums">
                {start + i + 1}
              </span>
              {columns.map((col, ci) => (
                <span
                  key={col.key}
                  className={`truncate px-3 text-[15px] leading-none text-(--foreground) tabular-nums ${
                    (col.align ?? 'center') === 'center' ? 'text-center' : 'text-left'
                  }`}
                >
                  {row[ci]}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <footer className="flex h-[36px] shrink-0 items-center gap-1 pt-2 pl-1 text-[16px] leading-none text-(--ck-title)">
        共<span className="font-bold text-(--ck-title-sub) tabular-nums">{rows.length}</span>
        条数据
        <span className="ml-auto flex items-center gap-1.5">
          <input
            type="text"
            inputMode="numeric"
            aria-label="页码"
            value={String(current)}
            onChange={(e) => {
              const next = Number(e.target.value.replace(/\D/g, ''))
              if (next) goto(next)
            }}
            className="h-[30px] w-[54px] rounded-[5px] border border-(--border) bg-(--surface) text-center text-[15px] leading-none text-(--ck-title) tabular-nums outline-none focus:border-(--accent)"
          />
          <span className="text-[15px] leading-none text-(--text-secondary) tabular-nums">
            /{pageCount}
          </span>
          <PagerButton
            icon="ri-arrow-up-s-line"
            label="上一页"
            disabled={current <= 1}
            onClick={() => goto(current - 1)}
          />
          <PagerButton
            icon="ri-arrow-down-s-line"
            label="下一页"
            disabled={current >= pageCount}
            onClick={() => goto(current + 1)}
            solid
          />
        </span>
      </footer>
    </section>
  )
}

function PagerButton({
  icon,
  label,
  disabled,
  onClick,
  solid = false,
}: {
  icon: string
  label: string
  disabled: boolean
  onClick: () => void
  solid?: boolean
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`flex h-[30px] w-[34px] items-center justify-center rounded-[5px] text-[20px] transition-opacity ${
        disabled ? 'cursor-default opacity-40' : 'cursor-pointer hover:opacity-80'
      } ${solid ? 'text-white' : 'border border-(--border) bg-(--surface) text-(--ck-title-sub)'}`}
      style={
        solid
          ? { background: 'linear-gradient(90deg, var(--ck-btn-from), var(--ck-btn-to))' }
          : undefined
      }
    >
      <i className={icon} aria-hidden />
    </button>
  )
}

function HeadCell({
  title,
  align,
  sortable,
  sortDir,
  onSort,
}: {
  title: string
  align: 'left' | 'center'
  sortable?: boolean
  sortDir?: 'asc' | 'desc'
  onSort?: () => void
}) {
  const base = `flex items-center gap-1 px-3 text-[16px] leading-none font-semibold text-(--ck-title-sub) ${
    align === 'center' ? 'justify-center' : 'justify-start'
  }`

  if (!sortable) {
    return <span className={base}>{title}</span>
  }

  return (
    <button type="button" onClick={onSort} className={`${base} cursor-pointer hover:opacity-80`}>
      {title}
      <i
        className={
          sortDir === 'desc'
            ? 'ri-sort-desc text-[15px]'
            : sortDir === 'asc'
              ? 'ri-sort-asc text-[15px]'
              : 'ri-sort-asc text-[15px] opacity-55'
        }
        aria-hidden
      />
    </button>
  )
}

/** 数值优先按数字比，否则按本地化字符串比 */
function compareCell(a: string, b: string): number {
  const na = Number(String(a).replace(/[,%\s]/g, ''))
  const nb = Number(String(b).replace(/[,%\s]/g, ''))
  if (Number.isFinite(na) && Number.isFinite(nb)) return na - nb
  return String(a).localeCompare(String(b), 'zh-Hans-CN')
}
