import { useId } from 'react'
import type { CSSProperties } from 'react'

import { FLOW_GEOMETRY, svgId } from './flowTheme'

export interface TurnArcProps {
  /** 掉头在哪一侧：右侧接住第一条线、左侧接住第二条线 */
  side: 'right' | 'left'
  /** 上端对齐的上一条色带顶部 y */
  top: number
  /** 下端对齐的下一条色带顶部 y */
  bottom: number
  /** 上端颜色（进入掉头时的节点色） */
  from: string
  /** 下端颜色（掉头后第一个节点的色） */
  to: string
}

/**
 * 蛇形流程的掉头段：一圈 U 形色带，两端水平接上/下两条色带，
 * 用 SVG 描边画（CSS 边框在拐弯处续不上，border-radius 会收成尖角）。
 */
export function TurnArc({ side, top, bottom, from, to }: TurnArcProps) {
  const rawId = useId()
  const gradientId = `flow-arc-${svgId(rawId)}`

  const width = FLOW_GEOMETRY.arcWidth
  const band = FLOW_GEOMETRY.bandHeight
  const half = band / 2
  const radius = 46
  const height = bottom + band - top

  const path =
    side === 'right'
      ? `M 0 ${half} H ${width - radius - half} A ${radius} ${radius} 0 0 1 ${width - half} ${radius + half} V ${height - radius - half} A ${radius} ${radius} 0 0 1 ${width - radius - half} ${height - half} H 0`
      : `M ${width} ${half} H ${radius + half} A ${radius} ${radius} 0 0 0 ${half} ${radius + half} V ${height - radius - half} A ${radius} ${radius} 0 0 0 ${radius + half} ${height - half} H ${width}`

  const style: CSSProperties =
    side === 'right' ? { top, right: 0, width, height } : { top, left: 0, width, height }

  return (
    <svg
      className="pointer-events-none absolute"
      style={style}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>
      <path
        d={path}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth={band}
        strokeLinecap="butt"
      />
    </svg>
  )
}
