import type { ReactNode } from 'react'

import { TONE_VAR } from '../controlModelTone'
import type { FeedbackBar, ModelRow, StrategyCandidate } from '../types'

/**
 * 单个模型结果卡的外壳：左上角序号/图标 + 标题，下面是内容。
 *
 * 参考稿里感知模型用的是数字「1」，其余三个用图标。
 */
export function ModelCard({
  badge,
  icon,
  title,
  children,
}: {
  badge?: string
  icon?: string
  title: string
  children: ReactNode
}) {
  return (
    <section
      className="flex min-h-0 min-w-0 flex-col gap-1.5 rounded-[8px] px-3 pt-2 pb-2"
      style={{
        border: '1px solid var(--ck-card-border)',
        background: 'linear-gradient(160deg, var(--ck-card-from), var(--ck-card-to))',
        boxShadow: 'var(--ck-card-shadow)',
      }}
    >
      <header className="flex shrink-0 items-center gap-1.5">
        {badge ? (
          <span
            className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[4px] text-[12px] leading-none font-bold text-(--ck-on-solid)"
            style={{ background: 'var(--ck-cyan)' }}
          >
            {badge}
          </span>
        ) : (
          <i className={`${icon} shrink-0 text-[15px] text-(--ck-cyan)`} aria-hidden />
        )}
        <h4 className="text-[13.5px] leading-none font-bold text-(--ck-title)">{title}</h4>
      </header>

      {children}
    </section>
  )
}

/**
 * 模型结果里的一行：左标签 + 右取值。
 *
 * 取值可带图标、单位尾巴、行尾徽标或进度条，四种在参考稿里都出现过。
 */
export function ModelKvRow({ row }: { row: ModelRow }) {
  const color = `var(${TONE_VAR[row.tone ?? 'default']})`

  return (
    <div
      className="flex items-center gap-2 rounded-[3px] px-1.5 py-[2px]"
      style={{ background: 'color-mix(in srgb, var(--ck-panel-inner) 70%, transparent)' }}
    >
      {/*
        标签列固定 92px：「临时调配审核人员」这类 8 字标签在 11.5px 下正好一行放得下，
        窄一档就会折行，把下方的表格/柱图顶出卡外。四张卡统一这一档行距——
        首页右栏只有 718px 高，上排两张卡用宽松行距会溢出。
      */}
      <span className="w-[92px] shrink-0 text-[11.5px] leading-tight text-(--ck-title-sub)">
        {row.label}
      </span>

      <span className="flex min-w-0 flex-1 items-baseline gap-1">
        {row.icon ? (
          <i
            className={`${row.icon} shrink-0 self-center text-[13px]`}
            style={{ color }}
            aria-hidden
          />
        ) : null}

        <span
          className={`leading-tight font-semibold ${row.big ? 'text-[19px]' : 'text-[12.5px]'}`}
          style={{ color }}
        >
          {row.value}
        </span>

        {row.tail ? (
          <span
            className={row.big ? 'text-[15px] leading-tight font-semibold' : 'text-[11.5px] leading-tight'}
            style={{ color: row.big ? color : 'var(--text-tertiary)' }}
          >
            {row.tail}
          </span>
        ) : null}

        {/* 策略执行完成度那一行：取值后面直接跟一条进度 */}
        {row.progress === undefined ? null : (
          <span className="ml-1 h-[6px] min-w-0 flex-1 self-center overflow-hidden rounded-full bg-(--ck-track)">
            <span
              className="block h-full rounded-full"
              style={{
                width: `${Math.max(0, Math.min(100, row.progress))}%`,
                background: 'linear-gradient(90deg, var(--ck-cyan), var(--ck-green))',
              }}
            />
          </span>
        )}
      </span>

      {row.delta ? (
        <span
          className="flex shrink-0 items-center gap-0.5 text-[11.5px] leading-none font-semibold whitespace-nowrap"
          style={{ color: `var(${TONE_VAR[row.delta.tone]})` }}
        >
          {row.delta.icon ? <i className={`${row.delta.icon} text-[12px]`} aria-hidden /> : null}
          {row.delta.text}
        </span>
      ) : null}
    </div>
  )
}

/** 策略模型下方的候选策略表：三列，选中那条带勾且整行高亮 */
export function CandidateTable({
  cols,
  rows,
}: {
  cols: readonly [string, string, string]
  rows: StrategyCandidate[]
}) {
  const grid = '1.5fr 1fr 1.1fr'

  return (
    <div
      className="flex shrink-0 flex-col overflow-hidden rounded-[5px]"
      style={{ border: '1px solid var(--ck-panel-inner-border)' }}
    >
      <div
        className="grid shrink-0 items-center gap-1 px-2 py-[4px]"
        style={{ gridTemplateColumns: grid, background: 'var(--ck-table-head)' }}
      >
        {cols.map((col, i) => (
          <span
            key={col}
            className={`text-[11px] leading-none text-(--ck-title-sub) ${i === 0 ? '' : 'text-center'}`}
          >
            {col}
          </span>
        ))}
      </div>

      {rows.map((row) => (
        <div
          key={row.name}
          className="grid shrink-0 items-center gap-1 px-2 py-[3px]"
          style={{
            gridTemplateColumns: grid,
            background: row.chosen
              ? 'color-mix(in srgb, var(--ck-cyan) 14%, transparent)'
              : 'transparent',
          }}
        >
          <span className="flex min-w-0 items-center gap-1">
            {row.chosen ? (
              <i
                className="ri-checkbox-circle-fill shrink-0 text-[12px] text-(--ck-green)"
                aria-hidden
              />
            ) : null}
            <span
              className="truncate text-[11.5px] leading-none"
              style={{
                color: row.chosen ? 'var(--ck-cyan)' : 'var(--foreground)',
                fontWeight: row.chosen ? 600 : 400,
              }}
            >
              {row.name}
            </span>
          </span>
          <span
            className="text-center text-[11.5px] leading-none tabular-nums"
            style={{
              color: row.chosen ? 'var(--ck-cyan)' : 'var(--text-secondary)',
              fontWeight: row.chosen ? 600 : 400,
            }}
          >
            {row.effect}
          </span>
          <span
            className="text-center text-[11.5px] leading-none tabular-nums"
            style={{
              color: row.chosen ? 'var(--ck-cyan)' : 'var(--text-secondary)',
              fontWeight: row.chosen ? 600 : 400,
            }}
          >
            {row.recoverAt}
          </span>
        </div>
      ))}
    </div>
  )
}

/**
 * 反馈模型下方的三柱对比：调控前 → 调控后 → 目标值。
 *
 * 柱高按 `ratio` 占满可用高度，柱顶压数值、柱底压名称，柱之间用箭头连接。
 */
export function FeedbackChart({ title, bars }: { title: string; bars: FeedbackBar[] }) {
  return (
    <div className="flex min-h-0 shrink-0 flex-col gap-1">
      <span className="flex shrink-0 items-center gap-1">
        <i className="ri-bubble-chart-fill text-[12px] text-(--ck-cyan)" aria-hidden />
        <span className="text-[11.5px] leading-none text-(--ck-title-sub)">{title}</span>
      </span>

      <div className="flex h-[66px] shrink-0 items-end gap-1">
        {bars.map((bar, i) => (
          <span key={bar.label} className="flex h-full min-w-0 flex-1 items-end gap-1">
            {i > 0 ? (
              <i
                className="ri-arrow-right-line shrink-0 self-center text-[12px] text-(--text-tertiary)"
                aria-hidden
              />
            ) : null}

            <span className="flex h-full min-w-0 flex-1 flex-col justify-end gap-0.5">
              <span
                className="text-center text-[12.5px] leading-none font-bold tabular-nums"
                style={{ color: `var(${TONE_VAR[bar.tone]})` }}
              >
                {bar.value}
              </span>
              <span
                className="w-full rounded-t-[2px]"
                style={{
                  height: `${Math.max(4, Math.min(100, bar.ratio)) * 0.36}px`,
                  background:
                    bar.tone === 'default'
                      ? 'color-mix(in srgb, var(--text-tertiary) 40%, transparent)'
                      : `var(${TONE_VAR[bar.tone]})`,
                }}
              />
              <span className="truncate text-center text-[11px] leading-none text-(--text-secondary)">
                {bar.label}
              </span>
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
