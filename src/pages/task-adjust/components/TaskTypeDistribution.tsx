import { SectionTitle } from '@/components/cockpit-ui'

import { TASK_TYPE_ARCS, TASK_TYPE_COLUMNS, TASK_TYPE_ROWS, TASK_TYPE_TOTAL } from '../constants'

/** 任务类型分布：彩色环形图 + 右侧明细表 */
export function TaskTypeDistribution({ className = '' }: { className?: string }) {
  return (
    <section className={`flex flex-col ${className}`}>
      <SectionTitle className="mb-[26px] shrink-0">任务类型分布</SectionTitle>

      <div className="flex min-h-0 flex-1 items-center gap-[42px]">
        <TypeDonut />
        <TypeTable />
      </div>
    </section>
  )
}

function TypeDonut() {
  const size = 211
  const c = size / 2
  const r = 88 // 环心半径
  const width = 30 // 环宽
  const gap = 5 // 段间留白（度）

  let angle = -90

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* 内圈装饰：浅蓝底 + 两道细环 */}
        <circle cx={c} cy={c} r={r - width / 2 - 2} fill="var(--ck-panel-inner)" />
        <circle
          cx={c}
          cy={c}
          r={r - width / 2 - 2}
          fill="none"
          stroke="var(--ck-blue)"
          strokeOpacity="0.45"
          strokeWidth="1"
        />
        <circle
          cx={c}
          cy={c}
          r={r - width / 2 - 12}
          fill="none"
          stroke="var(--ck-blue)"
          strokeOpacity="0.2"
          strokeWidth="1"
        />

        {TASK_TYPE_ARCS.map((arc, i) => {
          const start = angle + gap / 2
          const end = angle + arc.span - gap / 2
          angle += arc.span

          return (
            <path
              key={`${arc.color}-${i}`}
              d={arcPath(c, c, r, start, end)}
              fill="none"
              stroke={arc.color}
              strokeWidth={width}
            />
          )
        })}
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-[20px]">
        <span className="ck-glow-num text-[33px] leading-none font-semibold text-(--foreground)">
          {TASK_TYPE_TOTAL.value}
        </span>
        <span className="text-[15px] leading-none text-(--text-tertiary)">
          {TASK_TYPE_TOTAL.label}
        </span>
      </div>
    </div>
  )
}

/** 极坐标圆弧路径（角度制，0° 指向 12 点方向前已做 -90 偏移） */
function arcPath(cx: number, cy: number, r: number, from: number, to: number) {
  const p1 = polar(cx, cy, r, from)
  const p2 = polar(cx, cy, r, to)
  const large = to - from > 180 ? 1 : 0

  return `M ${p1.x} ${p1.y} A ${r} ${r} 0 ${large} 1 ${p2.x} ${p2.y}`
}

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function TypeTable() {
  return (
    <div className="flex min-w-0 flex-1 flex-col self-stretch overflow-hidden rounded-[3px]">
      <div
        className="grid h-[31px] shrink-0 items-center gap-2 px-3"
        style={{ gridTemplateColumns: COLS, background: 'var(--ck-table-head)' }}
      >
        {TASK_TYPE_COLUMNS.map((col, i) => (
          <span
            key={col}
            className={`text-[13px] leading-none font-semibold text-(--ck-title-sub) ${
              i === 0 ? '' : 'text-center'
            }`}
          >
            {col}
          </span>
        ))}
      </div>

      <div className="ck-scroll min-h-0 flex-1 overflow-y-auto">
        {TASK_TYPE_ROWS.map((row, i) => (
          <div
            key={row.dimension}
            className="grid h-[28px] items-center gap-2 px-3"
            style={{
              gridTemplateColumns: COLS,
              background: i % 2 === 0 ? 'var(--ck-table-row)' : 'var(--ck-table-row-alt)',
            }}
          >
            <span className="flex min-w-0 items-center gap-2">
              <i
                className="h-[8px] w-[8px] shrink-0 rounded-full"
                style={{ background: row.color }}
              />
              <span className="truncate text-[13px] leading-none text-(--foreground)">
                {row.dimension}
              </span>
            </span>
            <span className="text-center text-[13px] leading-none text-(--text-secondary) tabular-nums">
              {row.count}
            </span>
            <span className="text-center text-[13px] leading-none text-(--text-secondary) tabular-nums">
              {row.ratio}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

const COLS = '1.55fr 0.95fr 0.8fr'
