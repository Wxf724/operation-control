import { ProgressBar, StatusTag } from '@/components/cockpit-ui'

import { FEEDBACK_COLUMNS, FEEDBACK_ROWS } from '../constants'

/** 调控执行反馈表 */
export function FeedbackTable({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-col overflow-hidden rounded-[3px] ${className}`}>
      {/* 表头 */}
      <div
        className="grid shrink-0 items-center gap-2 px-2 py-2"
        style={{ gridTemplateColumns: COLS, background: 'var(--ck-table-head)' }}
      >
        {FEEDBACK_COLUMNS.map((col) => (
          <span
            key={col}
            className="text-[14px] leading-none font-semibold text-(--ck-title-sub)"
          >
            {col}
          </span>
        ))}
      </div>

      {/* 表体 */}
      <div className="ck-scroll flex min-h-0 flex-1 flex-col overflow-y-auto">
        {FEEDBACK_ROWS.map((row, i) => (
          <div
            key={row.task}
            className="grid shrink-0 grow basis-0 items-center gap-2 px-2"
            style={{
              gridTemplateColumns: COLS,
              background: i % 2 === 0 ? 'var(--ck-table-row)' : 'var(--ck-table-row-alt)',
            }}
          >
            <span className="truncate text-[14px] leading-none text-(--foreground)">
              {row.task}
            </span>
            <span className="text-[14px] leading-none text-(--text-secondary)">{row.owner}</span>
            <span className="text-[14px] leading-none text-(--text-secondary) tabular-nums">
              {row.startAt}
            </span>
            <ProgressBar value={row.progress} tone={row.statusTone} />
            <StatusTag tone={row.statusTone} variant="plain">
              {row.status}
            </StatusTag>
            <button
              type="button"
              className="cursor-pointer text-left text-[14px] leading-none text-(--ck-cyan) underline-offset-2 hover:underline"
            >
              {row.action}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

/** 六列宽度：任务名称 / 责任人 / 开始时间 / 进度 / 状态 / 操作 */
const COLS = '1.5fr 0.6fr 1fr 1.5fr 0.7fr 0.5fr'
