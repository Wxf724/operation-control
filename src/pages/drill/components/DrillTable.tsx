import { useMemo, useState } from 'react'
import type { MouseEvent } from 'react'

import type { DrillColumn } from '../types'

/** 明细表格 */
export interface DrillTableProps {
  /** 除「序号」外的列（「序号」由本组件自动补在最左） */
  columns: readonly DrillColumn[]
  /** 行数据，单元格顺序与 columns 一一对应 */
  rows: readonly string[][]
  /** 卡片左上角的小标题，如参考图 1、2 里每张表的「▸ RPA运行情况」 */
  title?: string
  /** 填了就把小标题变成可点的钻取入口 */
  onTitleClick?: () => void
  /** 行点击：跳到更细一层的明细页（如单据明细）；第三个参数带上鼠标事件，便于就地弹跳转菜单 */
  onRowClick?: (row: readonly string[], index: number, event: MouseEvent<HTMLButtonElement>) => void
  /** 紧凑模式：13px 字号 + 40px 行高，用来塞下十几列的宽表 */
  dense?: boolean
  /** 裸表模式：不再自绘 ck-panel 外壳，用于嵌进别的面板里 */
  bare?: boolean
  className?: string
}

/** 「序号」列固定宽度 */
const INDEX_WIDTH = '80px'

/** 行容器共用的栅格类 */
const ROW_BASE = 'grid items-center border-b border-(--border-light) last:border-b-0'

type SortState = { key: string; dir: 'asc' | 'desc' }

/**
 * 明细表格：浅蓝表头 + 白／浅蓝交替行 + 可滚动表体 + 底部「共 N 条数据」。
 *
 * 标了 `sortable` 的列表头带排序图标，点击在升序／降序间切换；
 * 数值列按数字比较（先剥掉千分位逗号和百分号），文本列按本地化字符串比较。
 *
 * 传了 `title` 就在卡片内画一条小标题（点标题可下钻），
 * 传了 `onRowClick` 则整行可点，鼠标移上去有浅蓝底色提示；
 * `dense` 给十几列的宽表用，字号与行高各收一档。
 */
export function DrillTable({
  columns,
  rows,
  title,
  onTitleClick,
  onRowClick,
  dense = false,
  bare = false,
  className = '',
}: DrillTableProps) {
  const [sort, setSort] = useState<SortState | null>(null)

  const template = `${INDEX_WIDTH} ${columns.map((col) => col.width).join(' ')}`
  const rowHeight = dense ? 'h-[40px]' : 'h-[42px]'

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
      className={`flex min-h-0 flex-col ${
        bare ? '' : 'ck-panel rounded-(--ck-panel-radius) p-3'
      } ${className}`}
    >
      {title ? <TableCaption title={title} onClick={onTitleClick} /> : null}

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[8px] border border-(--border)">
        {/* 表头 */}
        <div
          className="grid h-[46px] shrink-0 items-center"
          style={{ gridTemplateColumns: template, background: 'var(--ck-table-head)' }}
        >
          <HeadCell title="序号" align="center" dense={dense} />
          {columns.map((col) => (
            <HeadCell
              key={col.key}
              title={col.title}
              align={col.align ?? 'center'}
              sortable={col.sortable}
              sortDir={sort?.key === col.key ? sort.dir : undefined}
              onSort={col.sortable ? () => toggleSort(col.key) : undefined}
              dense={dense}
            />
          ))}
        </div>

        {/* 表体 */}
        <div className="ck-scroll min-h-0 flex-1 overflow-y-auto">
          {sorted.map((row, i) => {
            const background = i % 2 === 0 ? 'var(--ck-table-row)' : 'var(--ck-table-row-alt)'

            if (onRowClick) {
              return (
                <button
                  type="button"
                  key={`${row[0]}-${i}`}
                  title="查看明细"
                  onClick={(event) => onRowClick(row, i, event)}
                  className={`${ROW_BASE} ${rowHeight} w-full cursor-pointer text-left transition-colors hover:bg-(--accent-light)`}
                  style={{ gridTemplateColumns: template, background }}
                >
                  <RowCells row={row} columns={columns} index={i + 1} dense={dense} />
                </button>
              )
            }

            return (
              <div
                key={`${row[0]}-${i}`}
                className={`${ROW_BASE} ${rowHeight}`}
                style={{ gridTemplateColumns: template, background }}
              >
                <RowCells row={row} columns={columns} index={i + 1} dense={dense} />
              </div>
            )
          })}
        </div>
      </div>

      <footer className="flex h-[34px] shrink-0 items-center gap-1 pt-2 pl-1 text-[16px] leading-none text-(--ck-title)">
        共<span className="font-bold text-(--ck-title-sub) tabular-nums">{rows.length}</span>
        条数据
        {onRowClick ? (
          <span className="ml-auto flex items-center gap-1 text-[13px] leading-none text-(--text-tertiary)">
            <i className="ri-cursor-line text-[14px]" aria-hidden />
            点击任意一行查看明细
          </span>
        ) : null}
      </footer>
    </section>
  )
}

/** 卡片内的小标题（「▸ 标题」），配了 onTitleClick 就能点进明细页 */
function TableCaption({ title, onClick }: { title: string; onClick?: () => void }) {
  return (
    <header className="flex h-[26px] shrink-0 items-center gap-1 pb-1.5 pl-0.5">
      <i className="ri-arrow-right-s-fill text-[15px] leading-none text-(--ck-cyan)" aria-hidden />
      {onClick ? (
        <button
          type="button"
          title={`查看${title}明细`}
          onClick={onClick}
          className="cursor-pointer text-[15px] leading-none font-semibold text-(--ck-title-sub) underline-offset-[3px] transition-opacity hover:underline hover:opacity-80"
        >
          {title}
        </button>
      ) : (
        <span className="text-[15px] leading-none font-semibold text-(--ck-title-sub)">
          {title}
        </span>
      )}
    </header>
  )
}

/** 一行里的单元格：序号 + 各列，行容器是 div 还是 button 都复用这一份 */
function RowCells({
  row,
  columns,
  index,
  dense,
}: {
  row: readonly string[]
  columns: readonly DrillColumn[]
  index: number
  dense: boolean
}) {
  const textClass = dense ? 'text-[13px]' : 'text-[15px]'

  return (
    <>
      <span
        className={`text-center ${textClass} leading-none text-(--text-secondary) tabular-nums`}
      >
        {index}
      </span>
      {columns.map((col, ci) => (
        <span
          key={col.key}
          className={`truncate px-3 ${textClass} leading-none text-(--foreground) tabular-nums ${
            (col.align ?? 'center') === 'center' ? 'text-center' : 'text-left'
          } ${dense ? 'px-2' : ''}`}
        >
          {row[ci]}
        </span>
      ))}
    </>
  )
}

function HeadCell({
  title,
  align,
  sortable,
  sortDir,
  onSort,
  dense = false,
}: {
  title: string
  align: 'left' | 'center'
  sortable?: boolean
  sortDir?: 'asc' | 'desc'
  onSort?: () => void
  dense?: boolean
}) {
  const base = `flex items-center gap-1 whitespace-nowrap px-3 ${dense ? 'text-[14px]' : 'text-[16px]'} leading-none font-semibold text-(--ck-title-sub) ${
    align === 'center' ? 'justify-center' : 'justify-start'
  } ${dense ? 'px-2' : ''}`

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
