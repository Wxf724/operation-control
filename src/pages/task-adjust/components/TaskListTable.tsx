import { ProgressBar, SectionTitle, StatusTag } from '@/components/cockpit-ui'

import { TASK_LIST_COLUMNS, TASK_LIST_ROWS } from '../constants'

/** 任务清单表：5 列，进度列是细条 + 百分比，状态列是彩色标签 */
export function TaskListTable({ className = '' }: { className?: string }) {
  return (
    <section className={`flex flex-col ${className}`}>
      <SectionTitle className="mb-[31px] shrink-0">任务清单</SectionTitle>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[3px]">
        <div
          className="grid h-[37px] shrink-0 items-center gap-2 px-3"
          style={{ gridTemplateColumns: COLS, background: 'var(--ck-table-head)' }}
        >
          {TASK_LIST_COLUMNS.map((col) => (
            <span
              key={col}
              className="text-center text-[13px] leading-none font-semibold text-(--ck-title-sub)"
            >
              {col}
            </span>
          ))}
        </div>

        <div className="ck-scroll min-h-0 flex-1 overflow-y-auto">
          {TASK_LIST_ROWS.map((row, i) => (
            <div
              key={`${row.name}-${i}`}
              className="grid h-[36px] items-center gap-2 px-3"
              style={{
                gridTemplateColumns: COLS,
                background: i % 2 === 0 ? 'var(--ck-table-row)' : 'var(--ck-table-row-alt)',
              }}
            >
              <span className="truncate text-center text-[13px] leading-none text-(--foreground)">
                {row.name}
              </span>
              <span className="truncate text-center text-[13px] leading-none text-(--text-secondary)">
                {row.dept}
              </span>
              <span className="text-center text-[13px] leading-none text-(--text-secondary) tabular-nums">
                {row.triggeredAt}
              </span>
              <ProgressBar value={row.progress} tone="blue" />
              <span className="flex justify-center">
                <StatusTag tone={row.statusTone}>{row.status}</StatusTag>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const COLS = '1.45fr 1.27fr 1.27fr 1.42fr 1fr'
