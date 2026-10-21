import { PanelBox, ProgressBar } from '@/components/cockpit-ui'

import { ORIGIN_DETAIL, ORIGIN_OWNER, ORIGIN_PROGRESS } from '../constants'
import type { DetailRow } from '../types'

const TONE_VAR: Record<string, string> = {
  cyan: '--ck-cyan',
  orange: '--ck-orange',
  green: '--ck-green',
  red: '--ck-red',
  blue: '--ck-blue',
  purple: '--ck-purple',
  muted: '--text-tertiary',
}

/** 第二列：原任务详情（两个独立内嵌框） */
export function OriginalTaskPanel({ className = '' }: { className?: string }) {
  return (
    <PanelBox title="原任务详情" className={`flex flex-col ${className}`}>
      <div className="flex h-full flex-col px-[28px] pt-[37px] pb-[30px]">
        <DetailBox rows={ORIGIN_DETAIL} labelWidth={93} className="h-[477px] shrink-0" />

        <DetailBox rows={ORIGIN_OWNER} labelWidth={150} className="mt-[27px] min-h-0 flex-1">
          <div
            className="grid flex-1 items-center gap-3"
            style={{ gridTemplateColumns: '150px 1fr' }}
          >
            <span className="text-[17px] leading-none text-(--ck-cyan)">
              {ORIGIN_PROGRESS.label}
            </span>
            <div className="flex items-center gap-3">
              <span className="text-[17px] leading-none text-(--foreground) tabular-nums">
                {ORIGIN_PROGRESS.value}%
              </span>
              <ProgressBar
                value={ORIGIN_PROGRESS.value}
                tone="blue"
                showValue={false}
                barClassName="h-[9px]"
                className="w-[150px]"
              />
            </div>
          </div>
        </DetailBox>
      </div>
    </PanelBox>
  )
}

function DetailBox({
  rows,
  labelWidth,
  className = '',
  children,
}: {
  rows: DetailRow[]
  labelWidth: number
  className?: string
  children?: React.ReactNode
}) {
  const cols = `${labelWidth}px 1fr`

  return (
    <div className={`ck-card flex flex-col rounded-[3px] px-[24px] py-[12px] ${className}`}>
      {rows.map((row) => (
        <div
          key={row.label}
          className="grid flex-1 items-center gap-3"
          style={{ gridTemplateColumns: cols }}
        >
          <span className="text-[17px] leading-snug text-(--ck-cyan)">{row.label}</span>
          <span
            className="text-[17px] leading-snug"
            style={{ color: row.tone ? `var(${TONE_VAR[row.tone]})` : 'var(--foreground)' }}
          >
            {row.value}
          </span>
        </div>
      ))}
      {children}
    </div>
  )
}
