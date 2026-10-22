import ReactECharts from 'echarts-for-react'

/** ECharts 容器，统一 canvas 渲染与尺寸 */
export function Chart({ option }: { option: object }) {
  return (
    <ReactECharts
      option={option}
      style={{ height: '100%', width: '100%' }}
      opts={{ renderer: 'canvas' }}
      notMerge
    />
  )
}

/** 「单据接收量 39 万笔」这类描边指标卡 */
export function CountCard({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div
      className="flex min-w-0 flex-1 flex-col items-center justify-center gap-1.5 rounded-[3px] py-2"
      style={{
        background:
          'linear-gradient(180deg, color-mix(in srgb, var(--ck-blue) 16%, transparent), transparent)',
        border: '1px solid var(--ck-panel-inner-border)',
      }}
    >
      <span className="truncate text-[14px] leading-none text-(--ck-title-sub)">{label}</span>
      <span className="flex items-baseline gap-0.5">
        <span className="ck-glow-num text-[25px] leading-none font-bold text-(--ck-cyan)">
          {value}
        </span>
        {unit ? (
          <span className="text-[12px] leading-none text-(--ck-title-sub)">{unit}</span>
        ) : null}
      </span>
    </div>
  )
}

/** 标题小条：文字居中，下方一道两端渐隐的高光线 */
export function LabelBand({ children }: { children: string }) {
  return (
    <span className="flex shrink-0 flex-col items-center gap-1">
      <span className="text-[13px] leading-none whitespace-nowrap text-(--ck-title-sub)">
        {children}
      </span>
      <span
        className="h-px w-[132px]"
        style={{
          background:
            'linear-gradient(90deg, transparent, color-mix(in srgb, var(--ck-cyan) 70%, transparent), transparent)',
        }}
      />
    </span>
  )
}

/** 圆盘底座 + 上方光锥，数字浮在光锥里 */
export function Pedestal({
  value,
  unit,
  tone = 'cyan',
  size = 'md',
}: {
  value: string
  unit?: string
  tone?: 'cyan' | 'red'
  /** md 对应面板内常规尺寸，sm 用于并排的小底座 */
  size?: 'md' | 'sm'
}) {
  const color = `var(--ck-${tone})`
  const w = size === 'md' ? 104 : 92
  const h = size === 'md' ? 66 : 58

  return (
    <span
      className="relative flex shrink-0 items-start justify-center"
      style={{ width: w, height: h }}
    >
      <svg
        className="absolute inset-0"
        width={w}
        height={h}
        viewBox="0 0 104 66"
        fill="none"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <linearGradient id="ck-perf-beam" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--ck-cyan)" stopOpacity="0" />
            <stop offset="100%" stopColor="var(--ck-cyan)" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <path d="M36 2 L68 2 L84 42 L20 42 Z" fill="url(#ck-perf-beam)" />
        <ellipse cx="52" cy="46" rx="33" ry="11" fill="var(--ck-blue)" opacity="0.5" />
        <ellipse cx="52" cy="46" rx="33" ry="11" stroke="var(--ck-cyan)" strokeOpacity="0.75" />
        <ellipse cx="52" cy="52" rx="33" ry="11" fill="var(--ck-blue)" opacity="0.26" />
        <ellipse cx="52" cy="46" rx="17" ry="5.5" fill="var(--ck-screen-base)" opacity="0.5" />
        <ellipse cx="52" cy="58" rx="42" ry="7" fill="var(--ck-blue)" opacity="0.14" />
      </svg>

      <span className="relative flex items-baseline gap-0.5 pt-1">
        <span
          className={`ck-glow-num leading-none font-bold ${
            size === 'md' ? 'text-[34px]' : 'text-[29px]'
          }`}
          style={{ color }}
        >
          {value}
        </span>
        {unit ? (
          <span className="text-[12px] leading-none text-(--ck-title-sub)">{unit}</span>
        ) : null}
      </span>
    </span>
  )
}

/** 梯形托盘 + 图标 + 数字，对应「人均任务处理量 240 笔」 */
export function PlateStat({
  icon,
  label,
  value,
  unit,
}: {
  icon: string
  label: string
  value: string
  unit: string
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
      <LabelBand>{label}</LabelBand>

      <div className="relative flex w-full flex-1 items-center justify-center">
        <svg
          className="absolute inset-x-2 bottom-0 h-[34px] w-auto"
          viewBox="0 0 180 34"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden
        >
          <path
            d="M34 1 L146 1 L179 33 L1 33 Z"
            fill="color-mix(in srgb, var(--ck-blue) 14%, transparent)"
            stroke="color-mix(in srgb, var(--ck-blue) 42%, transparent)"
          />
        </svg>

        <span className="relative flex items-center gap-2 pb-2">
          <span className="relative flex h-[38px] w-[40px] items-end justify-center">
            <svg
              className="absolute bottom-0"
              width="40"
              height="14"
              viewBox="0 0 40 14"
              fill="none"
              aria-hidden
            >
              <ellipse cx="20" cy="7" rx="17" ry="5" fill="var(--ck-blue)" opacity="0.3" />
              <ellipse cx="20" cy="7" rx="17" ry="5" stroke="var(--ck-cyan)" strokeOpacity="0.5" />
            </svg>
            <i className={`${icon} relative mb-[3px] text-[22px] text-(--ck-cyan)`} aria-hidden />
          </span>
          <span className="flex items-baseline gap-0.5">
            <span className="ck-glow-num text-[31px] leading-none font-bold text-(--ck-cyan)">
              {value}
            </span>
            <span className="text-[12px] leading-none text-(--ck-title-sub)">{unit}</span>
          </span>
        </span>
      </div>
    </div>
  )
}

/** 时长列表里的一行：业务名 + 小时数 + 细进度条 */
export function DurationRow({
  label,
  hours,
  percent,
  striped,
}: {
  label: string
  hours: number
  /** 0–100 */
  percent: number
  /** 斑马纹底色 */
  striped: boolean
}) {
  return (
    <div
      className="flex h-[34px] items-center gap-2 rounded-[2px] px-3"
      style={{ background: striped ? 'var(--ck-table-row)' : 'transparent' }}
    >
      <span className="w-[126px] shrink-0 truncate text-[14px] leading-none text-(--foreground)">
        {label}
      </span>
      <span className="w-[68px] shrink-0 text-center text-[14px] leading-none text-(--foreground) tabular-nums">
        {hours.toFixed(1)} 小时
      </span>
      <span className="relative flex h-[7px] min-w-0 flex-1 items-center">
        <span
          className="absolute inset-0 rounded-full"
          style={{ background: 'color-mix(in srgb, var(--ck-blue) 22%, transparent)' }}
        />
        <span
          className="absolute top-0 left-0 h-full rounded-full"
          style={{
            width: `${percent}%`,
            background:
              'linear-gradient(90deg, color-mix(in srgb, var(--ck-blue) 30%, transparent), var(--ck-blue))',
          }}
        />
        <span
          className="absolute top-1/2 h-[10px] w-[10px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-(--ck-blue)"
          style={{ left: `${percent}%`, boxShadow: '0 0 0 2px var(--surface)' }}
        />
      </span>
    </div>
  )
}

/** 全流程业务处理质量：实心绿圆 + 白环 + 外圈涟漪与散点 */
export function QualityOrb({ value }: { value: number }) {
  const size = 196
  const cx = size / 2
  const dots = [
    { x: 34, y: 54, r: 4, color: 'var(--ck-green)' },
    { x: 20, y: 92, r: 3, color: 'var(--ck-green)' },
    { x: 128, y: 48, r: 3, color: 'var(--ck-cyan)' },
    { x: 142, y: 96, r: 3, color: 'var(--ck-cyan)' },
    { x: 112, y: 16, r: 2.5, color: 'var(--ck-cyan)' },
    { x: 118, y: 140, r: 4, color: 'var(--ck-green)' },
    { x: 46, y: 136, r: 3, color: 'var(--ck-cyan)' },
  ]

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" aria-hidden>
        {[78, 70, 64].map((r, i) => (
          <circle
            key={r}
            cx={cx}
            cy={cx}
            r={r}
            stroke="var(--ck-cyan)"
            strokeOpacity={0.1 + i * 0.07}
          />
        ))}
        <circle
          cx={cx}
          cy={cx}
          r={54}
          fill="var(--ck-green)"
        />
        <circle cx={cx} cy={cx} r={56} stroke="var(--ck-panel-bg)" strokeWidth={3} />
        {dots.map((d) => (
          <circle key={`${d.x}-${d.y}`} cx={d.x} cy={d.y} r={d.r} fill={d.color} opacity={0.85} />
        ))}
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center text-[30px] leading-none font-bold"
        style={{ color: 'var(--ck-screen-base)' }}
      >
        {value.toFixed(1)}%
      </span>
    </div>
  )
}

/** 竖条纹进度条，对应「成本费用预算执行准确率」下方的刻度条 */
export function SegmentBar({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(100, value))
  const track = 'color-mix(in srgb, var(--text-tertiary) 45%, transparent)'

  return (
    <div className="relative h-[19px] w-full overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: `repeating-linear-gradient(90deg, ${track} 0 3px, transparent 3px 6px)`,
        }}
      />
      <div
        className="absolute inset-y-0 left-0"
        style={{
          width: `${pct}%`,
          background: 'repeating-linear-gradient(90deg, var(--ck-cyan) 0 3px, transparent 3px 6px)',
        }}
      />
    </div>
  )
}
