/** 绩效管理平台组织切换视图用到的卡片、进度条、环形与立体座组件 */

/** 细进度条一行：业务名 + 小时数 + 蓝色条 */
export function OrgProgressRow({
  label,
  valueText,
  percent,
}: {
  label: string
  valueText: string
  /** 0–100 */
  percent: number
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-[104px] shrink-0 truncate text-[13px] leading-none text-(--foreground)">
        {label}
      </span>
      <span className="w-[56px] shrink-0 text-right text-[13px] leading-none text-(--ck-cyan) tabular-nums">
        {valueText}
      </span>
      <span className="relative flex h-[6px] min-w-0 flex-1 items-center">
        <span
          className="absolute inset-0 rounded-full"
          style={{ background: 'color-mix(in srgb, var(--ck-blue) 20%, transparent)' }}
        />
        <span
          className="absolute top-0 left-0 h-full rounded-full"
          style={{
            width: `${Math.max(0, Math.min(100, percent))}%`,
            background:
              'linear-gradient(90deg, color-mix(in srgb, var(--ck-blue) 35%, transparent), var(--ck-blue))',
          }}
        />
      </span>
    </div>
  )
}

/** 环形进度：SVG 描边环 + 中心百分比 */
export function OrgRing({
  value,
  label,
  size = 96,
  tone = 'cyan',
  suffix = '%',
  thickness = 7,
}: {
  value: number
  label?: string
  size?: number
  tone?: 'cyan' | 'green' | 'orange' | 'purple' | 'blue'
  suffix?: string
  thickness?: number
}) {
  const r = (size - thickness) / 2
  const circ = 2 * Math.PI * r
  const dash = (Math.max(0, Math.min(100, value)) / 100) * circ
  const color = `var(--ck-${tone})`

  return (
    <div className="flex min-w-0 flex-col items-center gap-1.5">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--ck-track)"
            strokeWidth={thickness}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={thickness}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circ}`}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>
        <span
          className="absolute inset-0 flex items-center justify-center text-[17px] leading-none font-bold tabular-nums"
          style={{ color }}
        >
          {value.toFixed(value % 1 === 0 ? 0 : 2)}
          {suffix}
        </span>
      </div>
      {label ? (
        <span className="max-w-[112px] text-center text-[12px] leading-tight text-(--ck-title-sub)">
          {label}
        </span>
      ) : null}
    </div>
  )
}

/** 半圆仪表盘：对应「资金直查率 91%」 */
export function OrgGauge({ value, label }: { value: number; label: string }) {
  const w = 146
  const h = 82
  const r = 58
  const cx = w / 2
  const cy = h - 10
  const pct = Math.max(0, Math.min(100, value))
  const arc = Math.PI * r
  const dash = (pct / 100) * arc

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: w, height: h }}>
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none" aria-hidden>
          <path
            d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
            stroke="var(--ck-track)"
            strokeWidth={10}
            strokeLinecap="round"
          />
          <path
            d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
            stroke="var(--ck-cyan)"
            strokeWidth={10}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${arc}`}
          />
        </svg>
        <span className="absolute inset-x-0 bottom-[6px] flex flex-col items-center gap-0.5">
          <span className="text-[24px] leading-none font-bold text-(--ck-cyan) tabular-nums">
            {pct}%
          </span>
        </span>
      </div>
      <span className="text-[12px] leading-none text-(--ck-title-sub)">{label}</span>
    </div>
  )
}

/** 立体座：椭圆底盘 + 数字，对应「银行账户资薪数 100 笔」 */
export function OrgPedestal({
  label,
  value,
  unit,
}: {
  label: string
  value: string
  unit: string
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-1">
      <span className="text-center text-[12px] leading-tight text-balance text-(--ck-title-sub)">
        {label}
      </span>
      <span className="relative flex h-[54px] w-[90px] shrink-0 items-start justify-center">
        <svg
          className="absolute inset-0"
          width="90"
          height="54"
          viewBox="0 0 90 54"
          fill="none"
          preserveAspectRatio="none"
          aria-hidden
        >
          <ellipse cx="45" cy="38" rx="29" ry="9" fill="var(--ck-blue)" opacity="0.45" />
          <ellipse cx="45" cy="38" rx="29" ry="9" stroke="var(--ck-cyan)" strokeOpacity="0.7" />
          <ellipse cx="45" cy="44" rx="29" ry="9" fill="var(--ck-blue)" opacity="0.22" />
          <ellipse cx="45" cy="49" rx="37" ry="6" fill="var(--ck-blue)" opacity="0.12" />
        </svg>
        <span className="relative flex items-baseline gap-0.5 pt-1">
          <span className="ck-glow-num text-[26px] leading-none font-bold text-(--ck-cyan)">
            {value}
          </span>
          <span className="text-[11px] leading-none text-(--ck-title-sub)">{unit}</span>
        </span>
      </span>
    </div>
  )
}

/** 描边小卡：标题 + 数值 + 单位 */
export function OrgStatCard({
  label,
  value,
  unit,
  tone = 'cyan',
}: {
  label: string
  value: string
  unit?: string
  tone?: 'cyan' | 'green' | 'orange'
}) {
  return (
    <div
      className="flex min-w-0 flex-1 flex-col items-center justify-center gap-1.5 rounded-[3px] px-2 py-2"
      style={{
        background: `linear-gradient(180deg, color-mix(in srgb, var(--ck-${tone}) 15%, transparent), transparent)`,
        border: '1px solid var(--ck-panel-inner-border)',
      }}
    >
      <span className="w-full truncate text-center text-[12px] leading-none text-(--ck-title-sub)">
        {label}
      </span>
      <span className="flex items-baseline gap-0.5">
        <span
          className="ck-glow-num text-[22px] leading-none font-bold"
          style={{ color: `var(--ck-${tone})` }}
        >
          {value}
        </span>
        {unit ? (
          <span className="text-[11px] leading-none text-(--ck-title-sub)">{unit}</span>
        ) : null}
      </span>
    </div>
  )
}

/** 九宫格表：三行，每行标题 + 三个百分比 */
export function OrgGridTable({
  rows,
  columns,
}: {
  rows: { title: string; col1: number; col2: number; col3: number }[]
  columns: readonly string[]
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-1">
      <div className="flex shrink-0 items-center gap-1">
        <span className="w-[92px] shrink-0" />
        {columns.map((col) => (
          <span
            key={col}
            className="min-w-0 flex-1 truncate text-center text-[11px] leading-none text-(--ck-title-sub)"
          >
            {col}
          </span>
        ))}
      </div>

      {rows.map((row, i) => (
        <div
          key={row.title}
          className="flex shrink-0 items-center gap-1 rounded-[2px] px-1 py-2.5"
          style={{
            background: i % 2 === 0 ? 'var(--ck-table-row)' : 'transparent',
            borderBottom: i < rows.length - 1 ? '1px solid var(--ck-divider)' : 'none',
          }}
        >
          <span className="w-[92px] shrink-0 truncate text-[12px] leading-none text-(--foreground)">
            {row.title}
          </span>
          {[row.col1, row.col2, row.col3].map((v, j) => (
            <span
              key={j}
              className="min-w-0 flex-1 text-center text-[14px] leading-none font-semibold text-(--ck-cyan) tabular-nums"
            >
              {v.toFixed(1)}%
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}

/** 清欠情况里的中心金额行 */
export function OrgCenterRow({
  name,
  amount,
  unit = '万元',
  striped,
}: {
  name: string
  amount: string
  unit?: string
  striped: boolean
}) {
  return (
    <div
      className="flex min-h-0 flex-1 items-center justify-between gap-2 rounded-[2px] px-3"
      style={{ background: striped ? 'var(--ck-table-row)' : 'transparent' }}
    >
      <span className="flex items-center gap-1.5">
        <i className="h-[5px] w-[5px] shrink-0 rotate-45 bg-(--ck-cyan)" />
        <span className="text-[13px] leading-none text-(--foreground)">{name}</span>
      </span>
      <span className="flex items-baseline gap-0.5">
        <span className="text-[17px] leading-none font-bold text-(--ck-cyan) tabular-nums">
          {amount}
        </span>
        <span className="text-[11px] leading-none text-(--ck-title-sub)">{unit}</span>
      </span>
    </div>
  )
}

/** 大号居中数字，带单位与下方高光线 */
export function OrgBigNumber({
  label,
  value,
  unit,
}: {
  label: string
  value: string
  unit: string
}) {
  return (
    <div className="flex shrink-0 flex-col items-center gap-1.5">
      <span className="text-[13px] leading-none text-(--ck-title-sub)">{label}</span>
      <span className="flex items-baseline gap-1">
        <span className="ck-glow-num text-[32px] leading-none font-bold text-(--ck-cyan)">
          {value}
        </span>
        <span className="text-[13px] leading-none text-(--ck-title-sub)">{unit}</span>
      </span>
      <span
        className="h-[3px] w-full"
        style={{
          background:
            'linear-gradient(90deg, transparent, color-mix(in srgb, var(--ck-cyan) 60%, transparent), transparent)',
          filter: 'blur(1px)',
        }}
      />
    </div>
  )
}
