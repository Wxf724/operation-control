import { useNavigate } from 'react-router-dom'

import { PanelBox } from '@/components/cockpit-ui'

import { STRATEGY_STATS, WARNING_CHIPS, WARNING_DETAILS } from '../constants'
import type { StrategyStat, WarningChip, WarningDetail } from '../types'

/** 预警详情固定展示的字段行数，第 7 行起需手动滚动 */
const DETAIL_VISIBLE = 6

const TONE_VAR: Record<string, string> = {
  cyan: '--ck-cyan',
  blue: '--ck-blue',
  green: '--ck-green',
  orange: '--ck-orange',
  red: '--ck-red',
  purple: '--ck-purple',
  muted: '--text-tertiary',
}

/** 右栏上半：AI 调控策略（13 个平台页共用） */
export function AiStrategyBlock({ className = '' }: { className?: string }) {
  return (
    <PanelBox
      title={<span className="italic">AI 调控策略</span>}
      className={`flex flex-col ${className}`}
      extra={<AiAssistButton />}
    >
      <div className="flex h-full min-h-0 flex-col gap-3 px-3.5 pt-3 pb-3.5">
        <div className="grid shrink-0 grid-cols-4 gap-2.5">
          {STRATEGY_STATS.map((stat) => (
            <StatBox key={stat.label} stat={stat} />
          ))}
        </div>

        <span className="shrink-0 text-[14px] leading-none font-medium text-(--ck-title-sub)">
          预警信息
        </span>

        {/*
          预警信息区：左列条目 + 右侧明细，两边都撑满面板剩余高度并各自纵向滚动。
          链路上每一层都带 `min-h-0`，否则 flex 子项会被内容撑开、滚动条永远不出现。
        */}
        <div className="flex min-h-0 flex-1 gap-2.5">
          <div className="ck-scroll flex min-h-0 w-[196px] shrink-0 flex-col gap-2.5 overflow-y-auto pr-1">
            {WARNING_CHIPS.map((chip) => (
              <ChipCard key={chip.text} chip={chip} />
            ))}
          </div>

          <div className="ck-card relative flex min-h-0 min-w-0 flex-1 flex-col rounded-[12px] px-3 py-2.5">
            <Avatar />
            {/*
              固定展示 DETAIL_VISIBLE 行且撑满卡片：
              滚动容器本身 `flex-1` 占满卡片高度，行高用 `calc` 取容器高度的
              1/DETAIL_VISIBLE —— 于是前 6 行正好铺满、第 7 行落在可视区外，
              交给 `overflow-y-auto` 滚动。
              （不能用 `grow basis-0`：那样行会一直均分容器高度、永远不溢出，滚动失效。）
            */}
            <div className="ck-scroll flex min-h-0 flex-1 flex-col overflow-y-auto pr-1">
              {WARNING_DETAILS.map((row) => (
                <DetailRow key={row.label} row={row} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </PanelBox>
  )
}

function AiAssistButton() {
  const navigate = useNavigate()

  return (
    <button
      type="button"
      onClick={() => navigate('/ai-assistant')}
      className="flex cursor-pointer items-center gap-1.5 rounded-full px-2.5 py-[6px] text-[13px] leading-none font-medium text-white transition-opacity hover:opacity-85"
      style={{ background: 'linear-gradient(90deg, var(--ck-btn-from), var(--ck-btn-to))' }}
    >
      <span
        className="flex h-[15px] w-[15px] items-center justify-center rounded-[4px] text-[10px] font-bold"
        style={{ background: 'rgba(255,255,255,0.25)' }}
      >
        AI
      </span>
      AI助手
    </button>
  )
}

function StatBox({ stat }: { stat: StrategyStat }) {
  const color = `var(${TONE_VAR[stat.tone] ?? '--ck-cyan'})`

  return (
    <div
      className="flex flex-col items-center gap-2 rounded-[12px] px-2 py-3"
      style={{
        border: '1px solid var(--ck-panel-inner-border)',
        background: `linear-gradient(180deg, color-mix(in srgb, ${color} 10%, transparent) 0%, var(--ck-panel-inner) 100%)`,
      }}
    >
      <span className="text-center text-[13px] leading-none text-(--ck-title-sub)">
        {stat.label}
      </span>
      <span className="ck-glow-num text-[26px] leading-none font-bold" style={{ color }}>
        {stat.value}
      </span>
    </div>
  )
}

function ChipCard({ chip }: { chip: WarningChip }) {
  const color = `var(${TONE_VAR[chip.statusTone] ?? '--ck-cyan'})`

  return (
    <div
      className="flex shrink-0 items-center gap-2.5 rounded-[12px] px-2.5 py-2.5"
      style={{
        border: '1px solid var(--ck-card-border)',
        borderLeft: `3px solid ${color}`,
        background: 'linear-gradient(135deg, var(--ck-card-from), var(--ck-card-to))',
        boxShadow: 'var(--ck-card-shadow)',
      }}
    >
      <i className={`${chip.icon} shrink-0 text-[16px]`} style={{ color }} aria-hidden />
      <div className="flex min-w-0 flex-col gap-1.5">
        <span className="text-[12px] leading-tight text-(--ck-title-sub)">{chip.text}</span>
        <span className="text-[12px] leading-none font-semibold" style={{ color }}>
          {chip.status}
        </span>
      </div>
    </div>
  )
}

function DetailRow({ row }: { row: WarningDetail }) {
  return (
    <div
      className="grid shrink-0 items-center gap-2"
      style={{
        gridTemplateColumns: '86px 1fr',
        height: `calc(100% / ${DETAIL_VISIBLE})`,
      }}
    >
      <span className="flex items-center gap-1 text-[12px] leading-snug text-(--ck-cyan)">
        <i className="ri-arrow-right-s-line text-[13px]" aria-hidden />
        {row.label}
      </span>
      <span
        className="text-[12px] leading-snug"
        style={{ color: row.tone ? `var(${TONE_VAR[row.tone]})` : 'var(--foreground)' }}
      >
        {row.value}
      </span>
    </div>
  )
}

/** 右上角的建议处理人头像（取自线上原件） */
function Avatar() {
  return (
    <span
      className="absolute top-2 right-2 h-[46px] w-[46px] overflow-hidden rounded-full"
      style={{ border: '2px solid var(--ck-card-border)' }}
    >
      <img
        src={`${import.meta.env.BASE_URL}avatar-handler.png`}
        alt="建议处理人"
        className="h-full w-full object-cover"
        draggable={false}
      />
    </span>
  )
}
