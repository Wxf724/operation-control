import type { TravelBarRow, TravelRingStat, TravelShareRow } from './travelData'

/** 退票改签 / 逾期未出行发生率的圆环 */
export function TravelRing({ stat, size = 112 }: { stat: TravelRingStat; size?: number }) {
  const stroke = 11
  const r = size / 2 - stroke / 2 - 1
  const circ = 2 * Math.PI * r
  const half = size / 2

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
        <circle
          cx={half}
          cy={half}
          r={r}
          fill="none"
          stroke={`var(${stat.trackTone})`}
          strokeOpacity="0.35"
          strokeWidth={stroke}
        />
        <circle
          cx={half}
          cy={half}
          r={r}
          fill="none"
          stroke={`var(${stat.tone})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${(circ * stat.value) / 100} ${circ}`}
          transform={`rotate(150 ${half} ${half})`}
          style={{ filter: `drop-shadow(0 0 5px var(${stat.tone}))` }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 leading-none">
        <span className="text-[21px] font-bold text-(--ck-title) tabular-nums">{stat.display}</span>
        <span className="text-[11px] text-(--text-secondary)">{stat.lines[0]}</span>
        <span className="text-[11px] text-(--text-secondary)">{stat.lines[1]}</span>
      </div>
    </div>
  )
}

/** 商旅业务整体情况的多色环形图 */
export function TravelDonut({ shares, size = 96 }: { shares: TravelShareRow[]; size?: number }) {
  const stroke = 21
  const r = size / 2 - stroke / 2
  const circ = 2 * Math.PI * r
  const half = size / 2
  let offset = 0

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
      {shares.map((s) => {
        const dash = (circ * s.share) / 100
        const node = (
          <circle
            key={s.label}
            cx={half}
            cy={half}
            r={r}
            fill="none"
            stroke={`var(${s.tone})`}
            strokeWidth={stroke}
            strokeDasharray={`${dash} ${circ - dash}`}
            strokeDashoffset={-offset}
            transform={`rotate(-90 ${half} ${half})`}
          />
        )
        offset += dash
        return node
      })}
    </svg>
  )
}

/** 商旅疑点订单确认率的大环形图 */
export function TravelDoubtRing({ value, size = 156 }: { value: number; size?: number }) {
  const stroke = 15
  const r = size / 2 - stroke / 2 - 1
  const circ = 2 * Math.PI * r
  const half = size / 2
  const done = (circ * value) / 100

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
        <circle
          cx={half}
          cy={half}
          r={r}
          fill="none"
          stroke="var(--ck-orange)"
          strokeWidth={stroke}
        />
        <circle
          cx={half}
          cy={half}
          r={r}
          fill="none"
          stroke="var(--ck-cyan)"
          strokeWidth={stroke}
          strokeDasharray={`${done} ${circ - done}`}
          strokeDashoffset={-(circ * 5) / 100}
          transform={`rotate(-90 ${half} ${half})`}
          style={{ filter: 'drop-shadow(0 0 6px var(--ck-cyan))' }}
        />
        <circle
          cx={half}
          cy={half}
          r={r - stroke / 2 - 4}
          fill="none"
          stroke="var(--ck-cyan)"
          strokeOpacity="0.4"
          strokeWidth="1.5"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 leading-none">
        <span className="ck-glow-num text-[27px] font-bold text-(--ck-title)">
          {value.toFixed(1)}%
        </span>
        <span className="text-[12px] text-(--text-secondary)">商旅疑点订单确认率</span>
      </div>
    </div>
  )
}

/** 透视底座上的大数字，`variant` 决定底座形状 */
export function TravelPlate({
  value,
  unit,
  variant = 'hex',
}: {
  value: string
  unit: string
  variant?: 'hex' | 'slab'
}) {
  const hex = variant === 'hex'

  return (
    <div className="relative flex flex-col items-center">
      <span className="relative z-10 flex items-baseline gap-0.5 leading-none">
        <span className="ck-glow-num text-[28px] font-bold text-(--ck-title)">{value}</span>
        <span className="text-[12px] text-(--text-secondary)">{unit}</span>
      </span>

      <svg width="164" height="46" viewBox="0 0 164 46" className="-mt-2" aria-hidden>
        <defs>
          <linearGradient id={`tv-plate-${variant}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--ck-cyan)" stopOpacity="0.75" />
            <stop offset="100%" stopColor="var(--ck-blue)" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {hex ? (
          <>
            <polygon
              points="40,6 124,6 158,26 82,40 6,26"
              fill="var(--ck-orange)"
              fillOpacity="0.16"
              stroke="var(--ck-orange)"
              strokeOpacity="0.45"
            />
            <polygon
              points="48,10 116,10 142,25 82,34 22,25"
              fill={`url(#tv-plate-${variant})`}
              stroke="var(--ck-cyan)"
              strokeOpacity="0.7"
            />
            <ellipse cx="82" cy="22" rx="30" ry="7" fill="var(--ck-cyan)" fillOpacity="0.45" />
            <circle cx="20" cy="30" r="3" fill="var(--ck-cyan)" />
            <circle cx="144" cy="30" r="3" fill="var(--ck-cyan)" />
          </>
        ) : (
          <>
            <polygon
              points="26,6 160,6 138,34 4,34"
              fill={`url(#tv-plate-${variant})`}
              stroke="var(--ck-cyan)"
              strokeOpacity="0.5"
            />
            <polygon points="26,6 160,6 156,11 22,11" fill="var(--ck-cyan)" fillOpacity="0.55" />
          </>
        )}
      </svg>
    </div>
  )
}

/** 费用超标情况左侧的金色底座图标 */
export function TravelCostIcon() {
  return (
    <div className="relative flex h-[50px] w-[54px] shrink-0 items-end justify-center">
      <svg className="absolute bottom-0" width="54" height="20" viewBox="0 0 54 20" aria-hidden>
        <ellipse cx="27" cy="10" rx="18" ry="6" fill="var(--ck-orange)" fillOpacity="0.3" />
        <ellipse
          cx="27"
          cy="10"
          rx="18"
          ry="6"
          fill="none"
          stroke="var(--ck-orange)"
          strokeOpacity="0.65"
        />
        <ellipse
          cx="27"
          cy="13"
          rx="25"
          ry="6.5"
          fill="none"
          stroke="var(--ck-orange)"
          strokeOpacity="0.22"
        />
      </svg>
      <i
        className="ri-file-text-line relative mb-[10px] text-[24px] text-(--ck-orange)"
        aria-hidden
      />
    </div>
  )
}

/** 「火车 12%」这种带细进度条的一行 */
export function TravelBarList({ rows }: { rows: TravelBarRow[] }) {
  return (
    <div className="flex h-full flex-col justify-center gap-2.5">
      {rows.map((row) => (
        <div key={row.label} className="flex flex-col gap-1.5">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-[13px] leading-none text-(--foreground)">{row.label}</span>
            <span className="text-[13px] leading-none font-semibold text-(--ck-title) tabular-nums">
              {row.value}
            </span>
          </div>
          <div className="h-[5px] w-full rounded-full bg-(--ck-panel-inner)">
            <div
              className="h-full rounded-full"
              style={{
                width: `${row.percent}%`,
                background: `linear-gradient(90deg, color-mix(in srgb, var(${row.tone}) 25%, transparent), var(${row.tone}))`,
                boxShadow: `0 0 6px var(${row.tone})`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
