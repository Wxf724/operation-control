import { DIFF_COLUMNS, DIFF_ROWS, DIFF_STATS, SUGGESTION_CARDS, toneColor } from '../constants'
import type { DiffRow, DiffStat, SuggestionCard } from '../types'
import { GhostButton, RowButton, SubTitle, Tag } from './common'

/**
 * 与集团制度差异比对 + AI 生成建议（右栏右半，603 x 641）。
 * 目标稿（画布 px）：标题 32 / 统计卡 74 / 小标题 21 / 表格 293 /
 * 小标题 32 / 建议卡撑满剩余，合计 641。
 */
export function DiffComparePanel({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-col ${className}`}>
      <SubTitle
        className="h-[32px] shrink-0"
        extra={<GhostButton icon="ri-file-text-line" label="查看详情" />}
      >
        与集团制度差异比对
      </SubTitle>

      <div className="mt-[9px] grid h-[74px] shrink-0 grid-cols-4 gap-[12px]">
        {DIFF_STATS.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      <SubTitle className="mt-[40px] h-[21px] shrink-0">差异明细TOP5</SubTitle>

      <div className="mt-[14px] flex h-[293px] shrink-0 flex-col">
        <div
          className="grid h-[42px] shrink-0 items-center gap-[8px] rounded-t-[4px] px-[11px]"
          style={{ gridTemplateColumns: COLS, background: 'var(--ck-table-head)' }}
        >
          {DIFF_COLUMNS.map((col) => (
            <span key={col} className="text-[15px] leading-none font-semibold text-(--ck-title-sub)">
              {col}
            </span>
          ))}
        </div>

        <div className="mt-[6px] flex min-h-0 flex-1 flex-col gap-[6px]">
          {DIFF_ROWS.map((row, i) => (
            <DiffLine key={row.index} row={row} even={i % 2 === 0} />
          ))}
        </div>
      </div>

      <SubTitle
        className="mt-[23px] h-[32px] shrink-0"
        extra={<GhostButton icon="ri-file-chart-line" label="生成报告" />}
      >
        AI生成建议
      </SubTitle>

      <div className="mt-[14px] grid min-h-0 flex-1 grid-cols-3 gap-[12px]">
        {SUGGESTION_CARDS.map((card) => (
          <SuggestionBlock key={card.title} card={card} />
        ))}
      </div>
    </div>
  )
}

function StatCard({ stat }: { stat: DiffStat }) {
  const color = toneColor(stat.tone)

  return (
    <div
      className="flex min-w-0 flex-col justify-center gap-[10px] rounded-[4px] border px-[11px]"
      style={{
        borderColor: `color-mix(in srgb, ${color} 45%, transparent)`,
        background: `linear-gradient(180deg, color-mix(in srgb, ${color} 22%, transparent), transparent)`,
      }}
    >
      <span className="text-[15px] leading-none whitespace-nowrap" style={{ color }}>
        {stat.label}
      </span>
      <span className="flex items-baseline gap-[7px]">
        <span className="ck-glow-num text-[28px] leading-none font-bold" style={{ color }}>
          {stat.value}
        </span>
        {stat.sub ? (
          <span className="text-[14px] leading-none whitespace-nowrap text-(--text-tertiary)">
            {stat.sub}
          </span>
        ) : null}
      </span>
    </div>
  )
}

function DiffLine({ row, even }: { row: DiffRow; even: boolean }) {
  return (
    <div
      className="grid min-h-0 flex-1 items-center gap-[8px] rounded-[2px] px-[11px]"
      style={{
        gridTemplateColumns: COLS,
        background: even ? 'var(--ck-table-row)' : 'var(--ck-table-row-alt)',
      }}
    >
      <span className="text-[15px] leading-none text-(--text-secondary) tabular-nums">
        {row.index}
      </span>
      <span className="truncate text-[15px] leading-none text-(--foreground)" title={row.item}>
        {row.item}
      </span>
      <Tag tone={row.levelTone} variant="plain">
        {row.level}
      </Tag>
      <span className="truncate text-[15px] leading-none text-(--text-secondary)">
        {row.system}
      </span>
      <RowButton label="查看" tone="var(--ck-blue)" />
    </div>
  )
}

function SuggestionBlock({ card }: { card: SuggestionCard }) {
  const color = toneColor(card.tone)

  return (
    <div
      className="flex min-w-0 flex-col justify-center gap-[10px] rounded-[4px] border px-[11px] py-[10px]"
      style={{
        borderColor: `color-mix(in srgb, ${color} 42%, transparent)`,
        background: 'var(--ck-panel-inner)',
      }}
    >
      <span className="flex items-center gap-[7px]">
        <i className={`${card.icon} shrink-0 text-[18px]`} style={{ color }} aria-hidden />
        <span className="truncate text-[15px] leading-none font-semibold" style={{ color }}>
          {card.title}
        </span>
      </span>
      <div className="flex flex-col gap-[5px]">
        {card.lines.map((line) => (
          <span key={line} className="truncate text-[14px] leading-snug text-(--text-tertiary)">
            {line}
          </span>
        ))}
      </div>
    </div>
  )
}

const COLS = '0.5fr 2.3fr 1fr 1.2fr 0.72fr'
