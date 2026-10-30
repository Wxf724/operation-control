import { useMemo, useState } from 'react'

import type { DrillColumn } from '../types'

/** 单据明细表格（按需生成版） */
export interface RpaDocTableProps {
  columns: readonly DrillColumn[]
  /** 明细总条数：4 万行不预生成，翻页时按需取 */
  total: number
  /** 每页条数候选，默认取 200 */
  pageSizes: readonly number[]
  /** 打开时的每页条数，缺省优先 200 */
  defaultPageSize?: number
  /** 取从 start 开始的 count 行 */
  getRows: (start: number, count: number) => readonly string[][]
  className?: string
}

/** 「序号」列固定宽度 */
const INDEX_WIDTH = '80px'

/** 行容器共用的栅格类 */
const ROW_BASE = 'grid h-[42px] items-center border-b border-(--border-light) last:border-b-0'

/**
 * 单据明细表格：表头 + 可按需生成的表体 + 底部「显示 N 条数据」与分页器。
 *
 * 版面照参考图 3：左下角是每页条数下拉，右下角是页码输入框 + 「/总页数」+ 上下翻页箭头。
 * 与 `DrillPagedTable` 的差别在于行数据由 `getRows` 按页生成，
 * 因此 4 万条单据也不会一次性驻留内存。
 */
export function RpaDocTable({
  columns,
  total,
  pageSizes,
  defaultPageSize,
  getRows,
  className = '',
}: RpaDocTableProps) {
  const [pageSize, setPageSize] = useState(() => {
    if (defaultPageSize && pageSizes.includes(defaultPageSize)) return defaultPageSize
    return pageSizes.includes(200) ? 200 : (pageSizes[0] ?? 200)
  })
  const [page, setPage] = useState(1)

  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const current = Math.min(page, pageCount)
  const start = (current - 1) * pageSize

  const rows = useMemo(() => getRows(start, pageSize), [getRows, start, pageSize])

  const template = `${INDEX_WIDTH} ${columns.map((col) => col.width).join(' ')}`

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
            <HeadCell key={col.key} title={col.title} align={col.align ?? 'center'} />
          ))}
        </div>

        {/* 表体 */}
        <div className="ck-scroll min-h-0 flex-1 overflow-y-auto">
          {rows.map((row, i) => (
            <div
              key={`${start + i}`}
              className={ROW_BASE}
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
        <span className="flex items-center gap-1.5">
          显示
          <select
            aria-label="每页条数"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value))
              setPage(1)
            }}
            className="h-[30px] cursor-pointer rounded-[5px] border border-(--border) bg-(--surface) px-1.5 text-[15px] leading-none text-(--ck-title) tabular-nums outline-none focus:border-(--accent)"
          >
            {pageSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          条数据
        </span>

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

function HeadCell({ title, align }: { title: string; align: 'left' | 'center' }) {
  return (
    <span
      className={`flex items-center whitespace-nowrap px-3 text-[15px] leading-none font-semibold text-(--ck-title-sub) ${
        align === 'center' ? 'justify-center' : 'justify-start'
      }`}
    >
      {title}
    </span>
  )
}
