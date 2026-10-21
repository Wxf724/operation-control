import { useNavigate } from 'react-router-dom'

import { PanelBox } from '@/components/cockpit-ui'

import { COMPARE_COLUMNS, COMPARE_ROWS, IMPACT_ROWS, RISK_TIP } from '../constants'
import type { CompareRow, ImpactRow } from '../types'

const TONE_VAR: Record<string, string> = {
  cyan: '--ck-cyan',
  orange: '--ck-orange',
  green: '--ck-green',
  red: '--ck-red',
  blue: '--ck-blue',
  purple: '--ck-purple',
  muted: '--text-tertiary',
}

/** 影响行左侧标签列宽（图标 + 文案），与目标稿实测一致 */
const LABEL_COL = '243px'

/** 第四列：调整影响确认 */
export function ImpactConfirmPanel({ className = '' }: { className?: string }) {
  const navigate = useNavigate()

  return (
    <PanelBox title="调整影响确认" className={`flex flex-col ${className}`}>
      <div className="flex h-full flex-col px-[29px] pt-[35px] pb-[30px]">
        <div className="flex h-[348px] shrink-0 flex-col">
          {IMPACT_ROWS.map((row, i) => (
            <ImpactLine key={row.label} row={row} weight={IMPACT_WEIGHTS[i]} />
          ))}
        </div>

        <RiskTip className="mt-[10px]" />

        <CompareTable className="mt-[22px] min-h-0 flex-1" />

        <div className="mt-[30px] flex shrink-0 items-center justify-end gap-[15px]">
          <ActionButton icon="ri-checkbox-circle-line" label="确认调整" primary />
          <ActionButton
            icon="ri-inbox-unarchive-line"
            label="返回任务池"
            onClick={() => navigate('/')}
          />
        </div>
      </div>
    </PanelBox>
  )
}

/** 5 行影响项的高度权重（目标稿：前 3 行等高，资源变化稍高，上下游影响为三行文本） */
const IMPACT_WEIGHTS = [58, 58, 58, 67, 103]

function ImpactLine({ row, weight }: { row: ImpactRow; weight: number }) {
  return (
    <div
      className="grid items-center gap-3 border-b last:border-b-0"
      style={{
        gridTemplateColumns: `${LABEL_COL} 1fr`,
        height: weight,
        borderColor: 'var(--border-light)',
      }}
    >
      <span className="flex items-center gap-3">
        <i className={`${row.icon} w-[23px] text-[20px] text-(--ck-blue)`} aria-hidden />
        <span className="text-[17px] leading-none text-(--foreground)">{row.label}</span>
      </span>

      {row.lines ? (
        <span className="flex flex-col gap-[14px]">
          {row.lines.map((line) => (
            <span key={line} className="text-[17px] leading-none text-(--foreground)">
              {line}
            </span>
          ))}
        </span>
      ) : (
        <span className="flex items-center gap-[9px]">
          <ValueChip value={row.from ?? ''} tone={row.fromTone ?? 'red'} />
          <i className="ri-arrow-right-line text-[17px] text-(--ck-green)" aria-hidden />
          <ValueChip value={row.to ?? ''} tone={row.toTone ?? 'green'} />
        </span>
      )}
    </div>
  )
}

function ValueChip({ value, tone }: { value: string; tone: string }) {
  const color = `var(${TONE_VAR[tone] ?? '--ck-cyan'})`

  return (
    <span
      className="min-w-[77px] rounded-[3px] px-2 py-[6px] text-center text-[17px] leading-[17px] font-medium"
      style={{
        color,
        border: `1px solid color-mix(in srgb, ${color} 45%, transparent)`,
        background: `color-mix(in srgb, ${color} 16%, transparent)`,
      }}
    >
      {value}
    </span>
  )
}

/** 风险提示条：橙色警告图标 + 淡橙底，浅色主题下不做发光 */
function RiskTip({ className = '' }: { className?: string }) {
  return (
    <div
      className={`flex h-[80px] shrink-0 items-center gap-[18px] rounded-[3px] border px-[22px] ${className}`}
      style={{
        borderColor: 'color-mix(in srgb, var(--ck-orange) 42%, transparent)',
        background:
          'linear-gradient(180deg, color-mix(in srgb, var(--ck-orange) 8%, #ffffff), color-mix(in srgb, var(--ck-orange) 16%, #ffffff))',
        boxShadow: 'var(--ck-card-shadow)',
      }}
    >
      <i className="ri-alert-fill shrink-0 text-[34px] text-(--ck-orange)" aria-hidden />
      <span className="shrink-0 text-[17px] leading-none font-medium whitespace-nowrap text-(--ck-orange)">
        风险提示
      </span>
      <span className="text-[17px] leading-[26px] text-(--foreground)">{RISK_TIP}</span>
    </div>
  )
}

function CompareTable({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-col overflow-hidden rounded-[3px] ${className}`}>
      <div
        className="grid h-[48px] shrink-0 items-center"
        style={{ gridTemplateColumns: COLS, background: 'var(--ck-table-head)' }}
      >
        <span className="text-center text-[17px] leading-none font-medium text-(--foreground)">
          {COMPARE_COLUMNS[0]}
        </span>
        <span className="text-center text-[17px] leading-none font-medium text-(--foreground)">
          {COMPARE_COLUMNS[1]}
        </span>
        <span />
        <span className="text-center text-[17px] leading-none font-medium text-(--foreground)">
          {COMPARE_COLUMNS[2]}
        </span>
      </div>

      <div className="ck-scroll min-h-0 flex-1 overflow-y-auto">
        {COMPARE_ROWS.map((row, i) => (
          <CompareLine key={row.label} row={row} even={i % 2 === 0} />
        ))}
      </div>
    </div>
  )
}

function CompareLine({ row, even }: { row: CompareRow; even: boolean }) {
  return (
    <div
      className="grid h-[56px] items-center"
      style={{
        gridTemplateColumns: COLS,
        background: even ? 'var(--ck-table-row)' : 'var(--ck-table-row-alt)',
      }}
    >
      <span className="text-center text-[15px] leading-snug text-(--foreground)">{row.label}</span>
      <span className="text-center text-[15px] leading-snug text-(--foreground)">{row.before}</span>
      <i className="ri-arrow-right-line text-center text-[15px] text-(--ck-green)" aria-hidden />
      <span
        className="text-center text-[15px] leading-snug"
        style={{ color: `var(${TONE_VAR[row.afterTone ?? 'green']})` }}
      >
        {row.after}
      </span>
    </div>
  )
}

function ActionButton({
  icon,
  label,
  primary = false,
  onClick,
}: {
  icon: string
  label: string
  primary?: boolean
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-[37px] cursor-pointer items-center gap-2 rounded-[3px] border px-[22px] text-[17px] leading-none transition-opacity hover:opacity-85"
      style={
        primary
          ? {
              borderColor: 'transparent',
              background: 'linear-gradient(90deg, var(--ck-btn-from), var(--ck-btn-to))',
              color: 'var(--ck-on-solid)',
              boxShadow: 'var(--ck-card-shadow)',
            }
          : {
              borderColor: 'var(--ck-card-border)',
              background: 'var(--ck-panel-inner)',
              color: 'var(--ck-cyan)',
              boxShadow: 'var(--ck-card-shadow)',
            }
      }
    >
      <i className={`${icon} text-[19px]`} aria-hidden />
      {label}
    </button>
  )
}

const COLS = '107px 113px 33px 1fr'
