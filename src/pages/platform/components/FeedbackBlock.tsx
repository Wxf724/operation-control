import { PanelBox, StatusTag } from '@/components/cockpit-ui'

import { FEEDBACK_STATS, TASK_FEEDBACK_COLUMNS, TASK_FEEDBACK_ROWS } from '../constants'
import type { FeedbackStat, TaskFeedbackRow } from '../types'
import { STATUS_STYLE, type ModuleWarning } from '../moduleWarnings'

/** 右栏下半：调控执行反馈（13 个平台页共用） */
export function FeedbackBlock({ className = '', warnings, counts, visibleRows = 2 }: {
  className?: string
  warnings?: ModuleWarning[]
  counts?: number[]
  visibleRows?: number
}) {
  const tasks: TaskFeedbackRow[] = warnings?.map((issue, i) => ({
    taskNo: String(i + 1).padStart(5, '0'),
    issueNo: String(i + 1).padStart(5, '0'),
    description: `${issue.title}：${issue.task}`,
    owner: issue.owner,
    deadline: issue.deadline ?? (i === 1 ? '1小时内' : '2小时内'),
    status: issue.taskStatus,
    statusTone: STATUS_STYLE[issue.taskStatus].statusTone,
  })) ?? TASK_FEEDBACK_ROWS
  return (
    <PanelBox
      title="调控执行反馈"
      className={`flex flex-col ${className}`}
      extra={
        <button
          type="button"
          className="flex cursor-pointer items-center gap-1.5 rounded-full border border-(--border) bg-(--ck-panel-inner) px-2.5 py-[6px] text-[12px] leading-none text-(--ck-title-sub) transition-colors hover:border-(--ck-cyan) hover:text-(--ck-cyan)"
        >
          <i className="ri-table-line text-[13px] text-(--ck-cyan)" aria-hidden />
          任务大表
        </button>
      }
    >
      <div className="flex h-full min-h-0 flex-col gap-3 px-3.5 pt-3 pb-3.5">
        <div className="grid shrink-0 grid-cols-3 gap-2.5">
          {FEEDBACK_STATS.map((stat, index) => (
            <StatBox key={stat.label} stat={counts ? { ...stat, value: String(counts[index]) } : stat} />
          ))}
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[12px]">
          <div
            className="grid shrink-0 items-center gap-2 px-2.5 py-2"
            style={{ gridTemplateColumns: COLS, background: 'var(--ck-table-head)' }}
          >
            {TASK_FEEDBACK_COLUMNS.map((col) => (
              <span
                key={col}
                className="text-[12px] leading-none font-semibold text-(--ck-title-sub)"
              >
                {col}
              </span>
            ))}
          </div>

          {/* 按模块展示两行或三行，余下的任务在表内滚动。 */}
          <div
            className="ck-scroll flex min-h-0 flex-1 flex-col overflow-y-auto"
            style={{ maxHeight: ROW_H * VISIBLE_ROWS }}
          >
            {tasks.map((row, i) => (
              <TaskRow key={row.taskNo} row={row} even={i % 2 === 0} visibleRows={visibleRows} />
            ))}
          </div>
        </div>
      </div>
    </PanelBox>
  )
}

function StatBox({ stat }: { stat: FeedbackStat }) {
  return (
    <div
      className="flex items-center justify-center gap-2.5 rounded-[12px] px-2 py-[7px]"
      style={{ background: 'var(--ck-panel-inner)' }}
    >
      <span
        className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[10px] text-[19px] text-(--ck-cyan)"
        style={{
          background: 'linear-gradient(180deg, var(--ck-icon-from), var(--ck-icon-to))',
          boxShadow: 'var(--ck-icon-glow)',
        }}
      >
        <i className={stat.icon} aria-hidden />
      </span>
      <div className="flex flex-col gap-1.5">
        <span className="text-[13px] leading-none text-(--ck-title-sub)">{stat.label}</span>
        <span className="flex items-baseline gap-0.5">
          <span className="ck-glow-num text-[22px] leading-none font-bold text-(--ck-cyan)">
            {stat.value}
          </span>
          <span className="text-[11px] leading-none text-(--text-tertiary)">个</span>
        </span>
      </div>
    </div>
  )
}

function TaskRow({ row, even, visibleRows }: { row: TaskFeedbackRow; even: boolean; visibleRows: number }) {
  return (
    <div
      className="grid shrink-0 items-center gap-2 px-2.5 py-2"
      style={{
        height: `calc(100% / ${visibleRows})`,
        gridTemplateColumns: COLS,
        background: even ? 'var(--ck-table-row)' : 'var(--ck-table-row-alt)',
      }}
    >
      <span className="text-[12px] leading-snug text-(--text-secondary) tabular-nums">
        {row.taskNo}
      </span>
      <span className="text-[12px] leading-snug text-(--text-secondary) tabular-nums">
        {row.issueNo}
      </span>
      <span className="text-[12px] leading-snug text-(--foreground)">
        <span title={row.description}>{row.description}</span>
      </span>
      <span className="text-[12px] leading-snug text-(--text-secondary)">{row.owner}</span>
      <span className="text-[12px] leading-snug text-(--text-secondary) tabular-nums">
        {row.deadline}
      </span>
      <StatusTag tone={row.statusTone} variant="plain">
        {row.status}
      </StatusTag>
    </div>
  )
}

/** 单行高度（px）——不放大字号，改用加大行高把列表撑开 */
const ROW_H = 132

/** 固定展示的行数，第 3 行起需手动滚动 */
const VISIBLE_ROWS = 2

const COLS = '0.7fr 0.7fr 4.4fr 0.6fr 1fr 0.8fr'
