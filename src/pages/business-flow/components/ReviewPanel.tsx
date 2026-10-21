import { PanelBox } from '@/components/cockpit-ui'

import { REVIEW_NOTES, REVIEW_STATS, REVIEW_TITLE } from '../constants'

/** 流程色带的完成率档位图例 */
const RATE_LEGEND = [
  { label: '达标', range: '完成率 ≥ 85%', tone: 'var(--ck-green)' },
  { label: '关注', range: '75% ~ 84%', tone: 'var(--ck-yellow)' },
  { label: '预警', range: '完成率 < 75%', tone: 'var(--ck-red)' },
]

/** 右栏：当前聚焦节点（10 共享初审）的明细面板 */
export function ReviewPanel({ className = '' }: { className?: string }) {
  return (
    <PanelBox
      title={<span className="italic">{REVIEW_TITLE}</span>}
      className={`flex flex-col ${className}`}
      bodyClassName="flex min-h-0 flex-1 flex-col gap-3 px-3.5 pt-3 pb-4"
    >
      <div className="grid shrink-0 grid-cols-3 gap-2.5">
        {REVIEW_STATS.map((stat) => (
          <div
            key={stat.label}
            className="ck-card flex h-[94px] flex-col items-center justify-center gap-2.5 rounded-[4px] px-2"
          >
            <span className="text-center text-[12px] leading-none text-(--ck-title-sub)">
              {stat.label}
            </span>
            <span className="flex items-baseline gap-0.5">
              <span className="ck-glow-num text-[25px] leading-none font-bold text-(--ck-cyan)">
                {stat.value}
              </span>
              <span className="text-[11px] leading-none text-(--text-tertiary)">{stat.unit}</span>
            </span>
          </div>
        ))}
      </div>

      {/* 色带图例：说明流程色带的三档含义 */}
      <div className="ck-card shrink-0 rounded-[4px] px-3.5 py-3">
        <span className="text-[13px] leading-none font-semibold text-(--ck-title-sub)">
          完成率档位
        </span>
        <div className="mt-3 flex flex-col gap-2.5">
          {RATE_LEGEND.map((item) => (
            <div key={item.label} className="flex items-center gap-2.5">
              <span
                className="h-[10px] w-[22px] shrink-0 rounded-[2px]"
                style={{ background: item.tone, boxShadow: `0 0 8px ${item.tone}` }}
              />
              <span className="text-[12px] leading-none text-(--ck-title)">
                {item.label}
              </span>
              <span className="ml-auto text-[12px] leading-none text-(--text-tertiary)">
                {item.range}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col justify-around pt-1">
        {REVIEW_NOTES.map((note) => (
          <div key={note.label} className="flex items-center gap-2.5 px-1">
            <i className="ri-arrow-right-s-fill text-[15px] text-(--ck-cyan)" aria-hidden />
            <span className="text-[13px] leading-none text-(--ck-cyan)">{note.label}</span>
            <span className="ml-auto text-[13px] leading-none text-(--text-secondary)">
              {note.value}
            </span>
          </div>
        ))}
      </div>
    </PanelBox>
  )
}
