import { TRAVEL_GAUGE_TICKS, arcPath, polar } from './travelCharts'

/** 商旅平台使用情况的半圆刻度仪表盘（火车 / 飞机 / 酒店） */
export function TravelSemiGauge({
  value,
  tone,
  label,
}: {
  value: number
  tone: string
  label: string
}) {
  const cx = 52
  const cy = 52
  const r = 42
  const ticks = 37
  const dots = 25
  const filled = Math.round((dots * value) / 100)
  const needle = polar(cx, cy, r - 17, 180 + value * 1.8)

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="104" height="58" viewBox="0 0 104 58" aria-hidden>
        {Array.from({ length: ticks }, (_, i) => {
          const deg = 180 + (i * 180) / (ticks - 1)
          const a = polar(cx, cy, r, deg)
          const b = polar(cx, cy, r - 6, deg)
          return (
            <line
              key={`tick-${i}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="var(--ck-blue)"
              strokeOpacity={0.45}
              strokeWidth="1.5"
            />
          )
        })}

        {Array.from({ length: dots }, (_, i) => {
          const deg = 180 + (i * 180) / (dots - 1)
          const p = polar(cx, cy, r - 11, deg)
          const on = i < filled
          return (
            <circle
              key={`dot-${i}`}
              cx={p.x}
              cy={p.y}
              r="1.6"
              fill={on ? `var(${tone})` : 'var(--ck-blue)'}
              fillOpacity={on ? 1 : 0.3}
            />
          )
        })}

        <line
          x1={cx}
          y1={cy}
          x2={needle.x}
          y2={needle.y}
          stroke={`var(${tone})`}
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <circle cx={needle.x} cy={needle.y} r="2" fill={`var(${tone})`} />

        <text
          x={cx}
          y="49"
          textAnchor="middle"
          fontSize="17"
          fontWeight="700"
          fill="var(--ck-title)"
        >
          {value.toFixed(1)}%
        </text>
      </svg>

      <span className="text-[12px] leading-none text-(--text-secondary)">{label}</span>
    </div>
  )
}

/** 费用超标比率的虚线半圆仪表盘 */
export function TravelDashGauge({ value, caption }: { value: number; caption: string }) {
  const cx = 54
  const cy = 54
  const r = 44
  const outer = 41
  const dashes = 30
  const filled = Math.round((dashes * value) / 100)

  return (
    <div className="flex flex-col items-center">
      <svg width="108" height="60" viewBox="0 0 108 60" aria-hidden>
        {Array.from({ length: outer }, (_, i) => {
          const deg = 180 + (i * 180) / (outer - 1)
          const a = polar(cx, cy, r, deg)
          const b = polar(cx, cy, r - 5, deg)
          return (
            <line
              key={`out-${i}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="var(--ck-cyan)"
              strokeOpacity={0.28}
              strokeWidth="1.3"
            />
          )
        })}

        {Array.from({ length: dashes }, (_, i) => {
          const deg = 180 + (i * 180) / (dashes - 1)
          const a = polar(cx, cy, r - 10, deg)
          const b = polar(cx, cy, r - 16, deg)
          return (
            <line
              key={`dash-${i}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="var(--ck-orange)"
              strokeOpacity={i < filled ? 1 : 0.32}
              strokeWidth="2.4"
            />
          )
        })}

        <polygon
          points={`${cx - 4},${cy} ${cx + 4},${cy} ${cx},${cy - 9}`}
          fill="var(--ck-orange)"
          opacity="0.9"
        />

        <text
          x={cx}
          y="46"
          textAnchor="middle"
          fontSize="18"
          fontWeight="700"
          fill="var(--ck-title)"
        >
          {value.toFixed(1)}%
        </text>
      </svg>

      <span className="-mt-1 text-[11px] leading-none text-(--text-secondary)">{caption}</span>
    </div>
  )
}

/** 商旅成本入账率 / 报销及时率的 240° 彩色仪表盘 */
export function TravelBigGauge({
  value,
  caption,
  gradientId,
}: {
  value: number
  caption: string
  gradientId: string
}) {
  const cx = 80
  const cy = 80
  const r = 58
  const angle = (v: number) => 150 + v * 2.4
  const tip = polar(cx, cy, r - 22, angle(value))
  const zero = polar(cx, cy, r + 3, 150)
  const full = polar(cx, cy, r + 3, 390)

  return (
    <div className="flex flex-col items-center gap-0.5">
      <svg width="160" height="124" viewBox="0 0 160 124" aria-hidden>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--ck-yellow)" />
            <stop offset="30%" stopColor="var(--ck-green)" />
            <stop offset="65%" stopColor="var(--ck-cyan)" />
            <stop offset="100%" stopColor="var(--ck-blue)" />
          </linearGradient>
        </defs>

        <path
          d={arcPath(cx, cy, r, 150, 390)}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="15"
        />
        <path
          d={arcPath(cx, cy, r - 14, 150, 390)}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeOpacity="0.4"
          strokeWidth="11"
        />
        <path
          d={arcPath(cx, cy, r - 24, 150, 390)}
          fill="none"
          stroke="var(--ck-cyan)"
          strokeOpacity="0.3"
          strokeWidth="1.5"
        />

        {TRAVEL_GAUGE_TICKS.map((v) => {
          const p = polar(cx, cy, r - 7, angle(v))
          return (
            <text
              key={v}
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="9"
              fill="var(--ck-title)"
              fillOpacity="0.8"
            >
              {v}
            </text>
          )
        })}

        <text x={zero.x} y={zero.y + 8} textAnchor="middle" fontSize="9" fill="var(--ck-title)">
          0
        </text>
        <text x={full.x} y={full.y + 8} textAnchor="middle" fontSize="9" fill="var(--ck-title)">
          100
        </text>

        <line
          x1={cx}
          y1={cy + 10}
          x2={tip.x}
          y2={tip.y}
          stroke="var(--ck-cyan)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <circle cx={cx} cy={cy + 10} r="3.2" fill="var(--ck-cyan)" />

        <text
          x={cx}
          y={cy + 2}
          textAnchor="middle"
          fontSize="30"
          fontWeight="700"
          fill="var(--ck-title)"
        >
          {value}%
        </text>
      </svg>

      <span className="text-[13px] leading-none text-(--ck-title-sub)">{caption}</span>
    </div>
  )
}
