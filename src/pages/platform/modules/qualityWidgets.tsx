import type { ReactNode } from 'react'

/** 面板标题右侧的页签组 */
export interface TabGroupProps {
  /** 页签文案 */
  labels: string[]
  /** 当前选中的下标 */
  active: number
  onChange: (index: number) => void
}

/** 面板标题右侧的页签组 */
export function TabGroup({ labels, active, onChange }: TabGroupProps) {
  return (
    <div className="flex items-center gap-1.5">
      {labels.map((label, i) => (
        <button
          key={label}
          type="button"
          onClick={() => onChange(i)}
          className={`cursor-pointer rounded-[3px] border px-2.5 py-[5px] text-[12px] leading-none transition-colors ${
            active === i
              ? 'border-(--ck-cyan) bg-(--ck-blue) font-semibold text-(--ck-on-solid)'
              : 'border-(--border) bg-(--ck-panel-inner) text-(--text-secondary)'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

/** 内联 SVG 环形图：支持多段着色、环心填色与外圈装饰 */
export interface DonutStatProps {
  /** 外径（px） */
  size: number
  /** 圆环粗细（px） */
  thickness: number
  /** 各段占比（%），从 12 点方向顺时针依次排布 */
  segments: { value: number; color: string }[]
  /** 未覆盖部分的底环色 */
  trackColor?: string
  /** 环心实心填充色，对应截图里 90.0% 那种蓝色圆饼 */
  centerFill?: string
  /** 环心底盘填充（浅色主题下是白卡片底，不是深色底盘） */
  innerFill?: string
  /** 是否绘制最外侧细装饰圈 */
  halo?: boolean
  /** 环心内容 */
  children: ReactNode
}

/** 内联 SVG 环形图 */
export function DonutStat({
  size,
  thickness,
  segments,
  trackColor = 'var(--ck-track)',
  centerFill,
  innerFill,
  halo = false,
  children,
}: DonutStatProps) {
  const pad = halo ? 4 : 0
  const radius = size / 2 - thickness / 2 - pad
  const circ = 2 * Math.PI * radius
  let acc = 0

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
        {halo ? (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 1}
            fill="none"
            stroke="color-mix(in srgb, var(--ck-blue) 40%, transparent)"
            strokeWidth="1.5"
          />
        ) : null}

        {centerFill || innerFill ? (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius - thickness / 2}
            fill={centerFill ?? innerFill}
          />
        ) : null}

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={thickness}
        />

        {segments.map((seg) => {
          const dash = (circ * seg.value) / 100
          const offset = -(circ * acc) / 100
          acc += seg.value
          return (
            <circle
              key={`${seg.color}-${seg.value}`}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={thickness}
              strokeDasharray={`${dash} ${circ - dash}`}
              strokeDashoffset={offset}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          )
        })}
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  )
}
