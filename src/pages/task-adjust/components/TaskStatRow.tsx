import { useId } from 'react'

import { TASK_STATS } from '../constants'
import type { TaskStat } from '../types'

const TONE_VAR: Record<string, string> = {
  cyan: '--ck-cyan',
  orange: '--ck-orange',
  green: '--ck-green',
  blue: '--ck-blue',
  red: '--ck-red',
  purple: '--ck-purple',
  muted: '--text-tertiary',
}

/** 底座统一用主蓝（与目标稿一致，不随数字色变化） */
const BASE_COLOR = 'var(--ck-cyan)'

/** 当前任务总览顶部：新增 / 处理中 / 已完成 三个带立体阶梯底座的数字 */
export function TaskStatRow({ className = '' }: { className?: string }) {
  return (
    <div className={`grid grid-cols-3 ${className}`}>
      {TASK_STATS.map((stat) => (
        <StatBlock key={stat.key} stat={stat} />
      ))}
    </div>
  )
}

function StatBlock({ stat }: { stat: TaskStat }) {
  const color = `var(${TONE_VAR[stat.tone] ?? '--ck-cyan'})`

  return (
    <div className="flex flex-col items-center">
      <span className="flex items-center gap-2.5 text-[17px] leading-none text-(--text-secondary)">
        <Wing side="left" />
        {stat.label}
        <Wing side="right" />
      </span>

      <span className="ck-glow-num mt-[14px] text-[25px] leading-none font-bold" style={{ color }}>
        {stat.value}
      </span>

      <Pedestal className="mt-[6px]" />
    </div>
  )
}

/** 标签两侧的小箭羽装饰 */
function Wing({ side }: { side: 'left' | 'right' }) {
  return (
    <svg
      width="26"
      height="11"
      viewBox="0 0 26 11"
      fill="none"
      aria-hidden
      style={{ transform: side === 'left' ? 'scaleX(-1)' : undefined }}
    >
      <path d="M0 5.5L7 0.5V10.5L0 5.5Z" fill={BASE_COLOR} opacity="0.9" />
      <path d="M9 5.5L15.5 1.5V9.5L9 5.5Z" fill={BASE_COLOR} opacity="0.55" />
      <path d="M17.5 5.5L23 2.5V8.5L17.5 5.5Z" fill={BASE_COLOR} opacity="0.28" />
    </svg>
  )
}

/**
 * 数字下方的蓝色立体阶梯底座（浅蓝玻璃质感）：
 * 上层是半透明的透视托盘（白色高光面 + 主蓝收口轨），中间一排指示短杠，
 * 下层是主蓝→深蓝的实心台阶 + 网点收口，底部用落地投影代替深色主题的外发光。
 */
function Pedestal({ className = '' }: { className?: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const plate = `ped-plate-${uid}`
  const shadow = `ped-shadow-${uid}`
  const step = `ped-step-${uid}`

  return (
    <svg
      width="150"
      height="73"
      viewBox="0 0 150 73"
      fill="none"
      aria-hidden
      className={className}
    >
      <defs>
        {/* 托盘：顶部化进白底 → 底部收到浅蓝玻璃 */}
        <linearGradient id={plate} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="60%" stopColor="var(--ck-blue)" stopOpacity="0.16" />
          <stop offset="100%" stopColor="var(--ck-blue)" stopOpacity="0.4" />
        </linearGradient>
        {/* 落地投影：取代深色主题的中央辉光 */}
        <radialGradient id={shadow} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="var(--ck-cyan)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="var(--ck-cyan)" stopOpacity="0" />
        </radialGradient>
        {/* 台阶：高亮蓝 → 主蓝 → 深蓝，在白底上才有体积感 */}
        <linearGradient id={step} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--ck-blue)" />
          <stop offset="55%" stopColor="var(--ck-cyan)" />
          <stop offset="100%" stopColor="var(--foreground)" stopOpacity="0.88" />
        </linearGradient>
      </defs>

      {/* 上层托盘：上宽下窄的透视面 */}
      <path
        d="M2 2 L148 2 L128 33 L22 33 Z"
        fill={`url(#${plate})`}
        stroke={BASE_COLOR}
        strokeOpacity="0.3"
        strokeWidth="1"
      />
      {/* 托盘内侧的斜向高光 */}
      <path d="M10 6 L26 30" stroke="var(--ck-blue)" strokeOpacity="0.4" strokeWidth="1" />
      <path d="M140 6 L124 30" stroke="var(--ck-blue)" strokeOpacity="0.4" strokeWidth="1" />
      {/* 托盘底边收口轨 */}
      <rect x="22" y="31.5" width="106" height="3" rx="1.5" fill={BASE_COLOR} opacity="0.85" />

      {/* 中间一排指示短杠 */}
      <g fill="var(--ck-blue)">
        <rect x="26" y="41" width="6" height="4" rx="1" opacity="0.6" />
        <rect x="36" y="41" width="6" height="4" rx="1" opacity="0.6" />
        <rect x="66" y="40" width="18" height="5" rx="1.5" opacity="0.9" />
        <rect x="108" y="41" width="6" height="4" rx="1" opacity="0.6" />
        <rect x="118" y="41" width="6" height="4" rx="1" opacity="0.6" />
      </g>

      {/* 下层台阶：实心透视块 + 顶面白色高光 */}
      <path d="M12 51 L138 51 L124 65 L26 65 Z" fill={`url(#${step})`} />
      <rect x="12" y="50" width="126" height="2.5" rx="1" fill="#ffffff" opacity="0.6" />

      {/* 落地投影 */}
      <ellipse cx="75" cy="68" rx="62" ry="6" fill={`url(#${shadow})`} />

      {/* 网点收口 */}
      <g fill="var(--ck-blue)">
        {[0, 1, 2].map((row) =>
          Array.from({ length: 24 }, (_, i) => (
            <rect
              key={`${row}-${i}`}
              x={20 + i * 4.6 + (row % 2 ? 2.3 : 0)}
              y={66 + row * 2.6}
              width="2"
              height="1.6"
              opacity={0.45 - row * 0.13}
            />
          )),
        )}
      </g>
    </svg>
  )
}
