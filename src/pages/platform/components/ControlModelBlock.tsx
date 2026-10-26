import { useState } from 'react'

import { PanelBox } from '@/components/cockpit-ui'

import {
  CONTROL_TASK_COLUMNS,
  CONTROL_TASKS,
  MODEL_CLOSURE,
  MODEL_SUMMARY,
} from '../controlModelData'
import { TONE_VAR } from '../controlModelTone'
import type { ControlTask, ModelRow } from '../types'
import { CandidateTable, FeedbackChart, ModelCard, ModelKvRow } from './controlModelCards'

/** 任务概览表的列宽，与 `CONTROL_TASK_COLUMNS` 一一对应 */
const TASK_COLS = '2.1fr 1fr 1.4fr 0.9fr 1.8fr'

/**
 * 右栏：智能调控模型执行结果（13 个平台页 + 员工个人看板共用）。
 *
 * 自上而下：统计条 → 执行任务概览 → 感知/解释/策略/反馈四个模型结果。
 * 任务概览在上、四个模型在下，点击任务行时下方四个模型整体切到该任务的结果。
 */
export function ControlModelBlock({ className = '' }: { className?: string }) {
  const [activeId, setActiveId] = useState(CONTROL_TASKS[0].id)
  const task = CONTROL_TASKS.find((t) => t.id === activeId) ?? CONTROL_TASKS[0]
  const { perception, explain, strategy, feedback } = task.models

  return (
    <PanelBox
      title={<span className="italic">智能调控模型执行结果</span>}
      className={`flex flex-col ${className}`}
    >
      <div className="flex h-full min-h-0 flex-col gap-2.5 px-3.5 pt-2.5 pb-3">
        <SummaryStrip />

        <TaskOverview activeId={activeId} onSelect={setActiveId} />

        {/*
          四个模型结果：2×2，整体随选中任务切换。
          下排两张卡除键值行外还各挂一块表格／柱图，上排只有键值行，
          所以行高按 0.40 : 0.60 分而不是等分。比例按首页右栏实测定：
          该槽位只有 718px 高（比平台页矮 170px），等分时上排会溢出、
          下排的策略卡末行会被候选策略表压住。
        */}
        <div
          className="grid min-h-0 flex-1 grid-cols-2 gap-2.5"
          style={{ gridTemplateRows: '0.30fr 0.70fr' }}
        >
          <ModelCard badge="1" title="感知模型结果">
            <RowList rows={perception} columns={2} />
          </ModelCard>

          <ModelCard icon="ri-search-line" title="解释模型结果">
            <RowList rows={explain} columns={2} />
          </ModelCard>

          <ModelCard icon="ri-lightbulb-line" title="策略模型结果">
            <RowList rows={strategy.rows} />
            <CandidateTable cols={strategy.candidateCols} rows={strategy.candidates} />
          </ModelCard>

          <ModelCard icon="ri-bar-chart-2-line" title="反馈模型结果">
            <RowList rows={feedback.rows} />
            <FeedbackChart title={feedback.chartTitle} bars={feedback.bars} />
          </ModelCard>
        </div>
      </div>
    </PanelBox>
  )
}

/**
 * 键值行列表。
 *
 * 一律 `justify-between`：行只占内容高度，富余空间均摊到行间，
 * 下排两张卡的表格／柱图因此始终贴着卡底，行与行之间也不会留出一整块空档。
 *
 * `columns=2` 时排成两列：感知 / 解释两张卡只有键值行、卡又很宽，
 * 排一列会让右半边整块空着，排两列正好把卡铺满。
 */
function RowList({ rows, columns = 1 }: { rows: ModelRow[]; columns?: number }) {
  if (columns === 2) {
    return (
      <div className="grid min-h-0 flex-1 grid-cols-2 content-between gap-x-4">
        {rows.map((row) => (
          <ModelKvRow key={row.label} row={row} />
        ))}
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col justify-between">
      {rows.map((row) => (
        <ModelKvRow key={row.label} row={row} />
      ))}
    </div>
  )
}

/**
 * 顶部统计条：今日识别异常 / 完成诊断 / 生成策略 / 闭环 · 执行中 · 待协调。
 *
 * 六项等宽分散铺满整行（不再靠左挤成一坨），每项自带图标与色调，
 * 项与项之间用竖线分隔。
 */
function SummaryStrip() {
  const items = [...MODEL_SUMMARY, ...MODEL_CLOSURE]

  return (
    <div
      className="flex shrink-0 items-stretch gap-1 rounded-[8px] px-2 py-1.5"
      style={{
        border: '1px solid var(--ck-card-border)',
        background: 'linear-gradient(90deg, var(--ck-card-from), var(--ck-card-to))',
      }}
    >
      {items.map((item, i) => (
        <span key={item.label} className="flex min-w-0 flex-1 items-center">
          {i > 0 ? <Divider /> : null}

          <span className="flex min-w-0 flex-1 items-center justify-center gap-2">
            <i
              className={`${item.icon} shrink-0 text-[17px]`}
              style={{ color: `var(${item.tone})` }}
              aria-hidden
            />
            <span className="flex items-baseline gap-1 whitespace-nowrap">
              <span className="text-[14px] leading-none text-(--ck-title-sub)">{item.label}</span>
              <span
                className="ck-glow-num text-[19px] leading-none font-bold"
                style={{ color: `var(${item.tone})` }}
              >
                {item.value}
              </span>
              <span className="text-[12.5px] leading-none text-(--text-tertiary)">{item.unit}</span>
            </span>
          </span>
        </span>
      ))}
    </div>
  )
}

function Divider() {
  return <span className="mx-1 h-[16px] w-px shrink-0 bg-(--ck-panel-inner-border)" aria-hidden />
}

/** 执行任务概览：表头 + 四行可点任务，点中的一行左侧亮条 + 高亮底 */
function TaskOverview({
  activeId,
  onSelect,
}: {
  activeId: string
  onSelect: (id: string) => void
}) {
  return (
    <div className="flex shrink-0 flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5">
          <i className="ri-list-check-2 text-[16px] text-(--ck-cyan)" aria-hidden />
          <span className="text-[16px] leading-none font-semibold text-(--ck-title)">
            执行任务概览
          </span>
        </span>
        <button
          type="button"
          className="cursor-pointer text-[13.5px] leading-none text-(--ck-title-sub) transition-colors hover:text-(--ck-cyan)"
        >
          查看更多
        </button>
      </div>

      <div
        className="flex flex-col overflow-hidden rounded-[6px]"
        style={{ border: '1px solid var(--ck-card-border)' }}
      >
        <div
          className="grid shrink-0 items-center gap-2 px-3 py-[6px]"
          style={{ gridTemplateColumns: TASK_COLS, background: 'var(--ck-table-head)' }}
        >
          {CONTROL_TASK_COLUMNS.map((col, i) => (
            <span
              key={col}
              className={`text-[13.5px] leading-none font-semibold text-(--ck-title-sub) ${
                i === 0 ? '' : 'text-center'
              }`}
            >
              {col}
            </span>
          ))}
        </div>

        {CONTROL_TASKS.map((t, i) => (
          <TaskRow
            key={t.id}
            task={t}
            active={t.id === activeId}
            odd={i % 2 === 1}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  )
}

function TaskRow({
  task,
  active,
  odd,
  onSelect,
}: {
  task: ControlTask
  active: boolean
  odd: boolean
  onSelect: (id: string) => void
}) {
  const statusColor = `var(${TONE_VAR[task.statusTone]})`

  return (
    <button
      type="button"
      onClick={() => onSelect(task.id)}
      aria-pressed={active}
      className="relative grid cursor-pointer items-center gap-2 px-3 py-[6px] text-left transition-colors"
      style={{
        gridTemplateColumns: TASK_COLS,
        background: active
          ? 'color-mix(in srgb, var(--ck-cyan) 13%, var(--ck-table-row))'
          : odd
            ? 'var(--ck-table-row-alt)'
            : 'var(--ck-table-row)',
      }}
    >
      {/* 选中行左侧的亮条 */}
      <span
        className="absolute inset-y-0 left-0 w-[3px]"
        style={{ background: active ? 'var(--ck-cyan)' : 'transparent' }}
        aria-hidden
      />

      <span
        className="truncate text-[14px] leading-none"
        style={{
          color: active ? 'var(--ck-cyan)' : 'var(--foreground)',
          fontWeight: active ? 600 : 400,
        }}
      >
        {task.name}
      </span>
      <span className="truncate text-center text-[13.5px] leading-none text-(--text-secondary)">
        {task.owner}
      </span>
      <span className="text-center text-[13.5px] leading-none text-(--text-secondary) tabular-nums">
        {task.time}
      </span>
      <span
        className="text-center text-[13.5px] leading-none font-semibold"
        style={{ color: statusColor }}
      >
        {task.status}
      </span>

      <span className="flex items-center gap-1.5">
        <span className="h-[8px] min-w-0 flex-1 overflow-hidden rounded-full bg-(--ck-track)">
          <span
            className="block h-full rounded-full"
            style={{ width: `${task.progress}%`, background: statusColor }}
          />
        </span>
        <span
          className="w-[38px] shrink-0 text-right text-[13.5px] leading-none font-semibold tabular-nums"
          style={{ color: statusColor }}
        >
          {task.progress}%
        </span>
      </span>
    </button>
  )
}
