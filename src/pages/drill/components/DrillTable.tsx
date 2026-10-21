import { useMemo, useState } from 'react'

import type { DrillColumn } from '../types'

/** 明细表格 */
export interface DrillTableProps {
  /** 除「序号」外的列（「序号」由本组件自动补在最左） */
  columns: readonly DrillColumn[]
  /** 行数据，单元格顺序与 columns 一一对应 */
  rows: readonly string[][]
  className?: string
}

/** 「序号」列固定宽度 */
const INDEX_WIDTH = '80px'

type SortState = { key: string; dir: 'asc' | 'desc' }

/**
 * 明细表格：浅蓝表头 + 白／浅蓝交替行 + 可滚动表体 + 底部「共 N 条数据」。
 *
 * 标了 `sortable` 的列表头带排序图标，点击在升序／降序间切换；
 * 数值列按数字比较（先剥掉千分位逗号和百分号），文本列按本地化字符串比较。
 */
export function DrillTable({ columns, rows, className = '' }: DrillTableProps) {
  const [sort, setSort] = useState<SortState | null>(null)

  const template = `${INDEX_WIDTH} ${columns.map((col) => col.width).join(' ')}`

  const sorted = useMemo(() => {
    if (!sort) return rows
    const idx = columns.findIndex((col) => col.key === sort.key)
    if (idx < 0) return rows
    const sign = sort.dir === 'asc' ? 1 : -1
    return [...rows].sort((a, b) => sign * compareCell(a[idx], b[idx]))
  }, [rows, columns, sort])

  const toggleSort = (key: string) => {
    setSort((prev) =>
      prev?.key === key && prev.dir === 'asc' ? { key, dir: 'desc' } : { key, dir: 'asc' }
    )
  }

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
          {sorted.map((row, i) => (
            <div
              key={`${row[0]}-${i}`}
              className="grid h-[42px] items-center border-b border-(--border-light) last:border-b-0"
              style={{
                gridTemplateColumns: template,
                background: i % 2 === 0 ? 'var(--ck-table-row)' : 'var(--ck-table-row-alt)',
              }}
            >
              <span className="text-center text-[15px] leading-none text-(--text-secondary) tabular-nums">
                {i + 1}
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

      <footer className="flex h-[34px] shrink-0 items-center gap-1 pt-2 pl-1 text-[16px] leading-none text-(--ck-title)">
        共<span className="font-bold text-(--ck-title-sub) tabular-nums">{rows.length}</span>
        条数据
      </footer>
    </section>
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
