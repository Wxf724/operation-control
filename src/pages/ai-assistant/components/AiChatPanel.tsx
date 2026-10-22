import {
  AI_AGENT,
  AI_CONCLUSION,
  AI_INPUT_PLACEHOLDER,
  AI_INTRO,
  AI_PANEL_TITLE,
  AI_QUESTION,
  AI_SUGGESTIONS,
  AI_SUGGEST_TITLE,
  AI_SUMMARY_LEAD,
  AI_VERDICT_ROWS,
} from '../constants'
import type { AiVerdictRow } from '../types'

import { AiPanel } from './AiPanel'

/**
 * 第四栏：AI 助手问答。
 *
 * 高度链路：面板 → 内容容器 → 回答区。提问气泡／身份行／底部输入框都是
 * `shrink-0` 常驻，只有中间的回答区 `min-h-0 flex-1 overflow-y-auto`，
 * 内容再长也只在回答区内部滚动，输入框不会被顶出面板。
 */
export function AiChatPanel({ className = '' }: { className?: string }) {
  return (
    <AiPanel title={AI_PANEL_TITLE} marker className={className}>
      <div className="flex min-h-0 flex-1 flex-col px-4 pt-2 pb-4">
        <QuestionBubble />
        <AgentHeader />

        <div className="ck-scroll mt-3 min-h-0 flex-1 overflow-y-auto pr-1.5">
          <AnswerBody />
        </div>

        <InputBar />
      </div>
    </AiPanel>
  )
}

function QuestionBubble() {
  return (
    <div className="flex shrink-0 justify-end pl-6">
      <p
        className="rounded-[10px] px-4 py-3 text-[15px] leading-relaxed text-(--ck-on-solid)"
        style={{ background: 'linear-gradient(135deg, var(--ck-btn-from), var(--ck-btn-to))' }}
      >
        {AI_QUESTION}
      </p>
    </div>
  )
}

function AgentHeader() {
  return (
    <div className="mt-4 flex shrink-0 items-center gap-3">
      <span
        className="h-[44px] w-[44px] shrink-0 overflow-hidden rounded-full"
        style={{ border: '2px solid var(--ck-card-border)' }}
      >
        <img
          src={`${import.meta.env.BASE_URL}avatar-handler.png`}
          alt={AI_AGENT.name}
          className="h-full w-full object-cover"
          draggable={false}
        />
      </span>
      <span className="flex min-w-0 flex-col gap-1.5">
        <span className="text-[16px] leading-none font-semibold text-(--foreground)">
          {AI_AGENT.name}
        </span>
        <span className="text-[13px] leading-none text-(--text-secondary)">{AI_AGENT.status}</span>
      </span>
    </div>
  )
}

function AnswerBody() {
  return (
    <div className="flex flex-col gap-4.5 text-[15px] leading-relaxed text-(--foreground)">
      <p>{AI_INTRO}</p>

      <ul className="flex flex-col gap-3.5">
        {AI_VERDICT_ROWS.map((row) => (
          <VerdictLine key={row.label} row={row} />
        ))}
      </ul>

      <p>{AI_SUMMARY_LEAD}</p>

      <div
        className="flex flex-col gap-2 rounded-[8px] px-3 py-3"
        style={{
          borderLeft: '3px solid var(--ck-cyan)',
          background: 'var(--accent-subtle)',
        }}
      >
        <span className="text-[16px] leading-snug font-bold text-(--foreground)">
          {AI_CONCLUSION.title}
        </span>
        <span className="text-[14px] leading-relaxed text-(--text-secondary)">
          {AI_CONCLUSION.reason}
        </span>
      </div>

      <p className="text-(--text-secondary)">{AI_SUGGEST_TITLE}</p>

      <ol className="flex flex-col gap-3.5">
        {AI_SUGGESTIONS.map((text, i) => (
          <li key={text} className="flex gap-1 pl-1">
            <span className="shrink-0 text-(--ck-title-sub) tabular-nums">{i + 1}.</span>
            <span className="min-w-0">{text}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

function VerdictLine({ row }: { row: AiVerdictRow }) {
  return (
    <li className="flex items-baseline gap-2">
      <i
        className="h-[6px] w-[6px] shrink-0 translate-y-[-3px] rounded-full"
        style={{ background: 'var(--ck-cyan)' }}
        aria-hidden
      />
      <span className="w-[178px] shrink-0">{row.label}：</span>
      <span className="shrink-0 font-semibold text-(--ck-red)">{row.verdict}</span>
      <span className="min-w-0 text-(--text-secondary)">{row.threshold}</span>
    </li>
  )
}

function InputBar() {
  return (
    <form
      className="mt-3 flex shrink-0 items-center gap-2.5 rounded-[10px] px-3 py-2.5"
      style={{
        border: '1px solid var(--border)',
        background: 'var(--surface)',
      }}
      onSubmit={(e) => e.preventDefault()}
    >
      <i className="ri-camera-line shrink-0 text-[20px] text-(--ck-cyan)" aria-hidden />
      <input
        type="text"
        placeholder={AI_INPUT_PLACEHOLDER}
        aria-label={AI_INPUT_PLACEHOLDER}
        className="min-w-0 flex-1 bg-transparent text-[15px] leading-none text-(--foreground) outline-none placeholder:text-(--text-tertiary)"
      />
      <button
        type="submit"
        aria-label="发送"
        className="shrink-0 cursor-pointer text-[20px] leading-none text-(--ck-cyan) transition-opacity hover:opacity-75"
      >
        <i className="ri-send-plane-2-line" aria-hidden />
      </button>
    </form>
  )
}
