import type { CSSProperties } from 'react'

import {
  LINE_ONE,
  LINE_THREE,
  LINE_TWO,
  TURN_LEFT_NODES,
  TURN_RIGHT_NODES,
  getNode,
} from '../constants'
import type { FlowNodeData } from '../types'

import { FlowNode } from './FlowNode'
import { TrackBand } from './TrackBand'
import { TurnArc } from './TurnArc'
import { FLOW_GEOMETRY, toneVar } from './flowTheme'

const { arcWidth, bandHeight, rows, turnLeftTop, turnRightTop, turnNodeWidth } = FLOW_GEOMETRY

/**
 * 业务流程图板。
 *
 * 线路是一条蛇形：02→07（左到右）→ 右侧掉头（08、09）→ 10→14（右到左）
 * → 左侧掉头（15、16）→ 17→23（左到右）。
 * 掉头段要与上下两条色带的边缘精确相接，所以整块用绝对定位 + 固定像素排布。
 */
export function FlowBoard({ className = '' }: { className?: string }) {
  return (
    <div className={`relative ${className}`} style={{ height: rows[2].bandY + bandHeight }}>
      {/* 极淡的点阵底纹：给蛇形流程之间的大片留白一点工程感，不抢内容 */}
      <span
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          backgroundImage: 'radial-gradient(rgba(53, 224, 255, 0.16) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
          maskImage: 'radial-gradient(ellipse 62% 58% at 50% 46%, #000 12%, transparent 76%)',
          WebkitMaskImage: 'radial-gradient(ellipse 62% 58% at 50% 46%, #000 12%, transparent 76%)',
        }}
      />

      <PhaseTag text="01 单据处理环节" style={{ top: rows[0].textY - 26, left: 0 }} />
      <Track index={0} ids={LINE_ONE} insetLeft={0} insetRight={arcWidth} />

      <PhaseTag text="02 财务处理环节" style={{ top: rows[1].textY - 26, right: arcWidth }} />
      <Track
        index={1}
        ids={LINE_TWO}
        reverse
        insetLeft={arcWidth}
        insetRight={arcWidth}
      />

      <PhaseTag text="03 报表处理环节" style={{ top: rows[2].textY - 26, left: arcWidth }} />
      <PhaseTag text="04 档案处理环节" style={{ top: rows[2].textY - 26, right: 0 }} />
      <Track index={2} ids={LINE_THREE} insetLeft={arcWidth} insetRight={0} />

      {/* 右侧掉头：07 → 08 / 09 → 10 */}
      <TurnNodes ids={TURN_RIGHT_NODES} top={turnRightTop} side="right" />
      <TurnArc
        side="right"
        top={rows[0].bandY}
        bottom={rows[1].bandY}
        from={toneVar(getNode(9).rateValue)}
        to={toneVar(getNode(10).rateValue)}
      />

      {/* 左侧掉头：14 → 15 / 16 → 17 */}
      <TurnNodes ids={TURN_LEFT_NODES} top={turnLeftTop} side="left" />
      <TurnArc
        side="left"
        top={rows[1].bandY}
        bottom={rows[2].bandY}
        from={toneVar(getNode(14).rateValue)}
        to={toneVar(getNode(17).rateValue)}
      />
    </div>
  )
}

/* ───────────── 一条主线：节点文字 + 一条主色带 ───────────── */

function Track({
  index,
  ids,
  reverse = false,
  insetLeft,
  insetRight,
}: {
  index: number
  ids: number[]
  reverse?: boolean
  insetLeft: number
  insetRight: number
}) {
  const { textY, bandY } = rows[index]
  const flowNodes = ids.map(getNode)
  /** 反向线（10→14）在视觉上从右往左排，色带也跟着从右往左走 */
  const visual = reverse ? [...flowNodes].reverse() : flowNodes

  return (
    <>
      <div
        className="absolute flex items-start gap-6"
        style={{ top: textY, left: insetLeft, right: insetRight }}
      >
        {visual.map((node) => (
          <FlowNode key={node.id} node={node} />
        ))}
      </div>

      <div className="absolute" style={{ top: bandY, left: insetLeft, right: insetRight }}>
        <TrackBand nodes={visual} />
      </div>
    </>
  )
}

/* ───────────── 掉头区里的紧凑节点 ───────────── */

function TurnNodes({
  ids,
  top,
  side,
}: {
  ids: number[]
  top: number
  side: 'left' | 'right'
}) {
  const nodes: FlowNodeData[] = ids.map(getNode)
  const style: CSSProperties =
    side === 'right'
      ? { top, right: arcWidth + 40, width: turnNodeWidth }
      : { top, left: arcWidth + 40, width: turnNodeWidth }

  return (
    <div className="absolute flex flex-col gap-8" style={style}>
      {nodes.map((node) => (
        <div key={node.id} className="flex flex-col gap-2.5">
          <FlowNode node={node} compact />
          <div className="w-[168px]">
            <TrackBand nodes={[node]} />
          </div>
        </div>
      ))}
    </div>
  )
}

/* ───────────── 环节小标题 ───────────── */

function PhaseTag({ text, style }: { text: string; style: CSSProperties }) {
  return (
    <span
      className="absolute flex items-center gap-1 text-[15px] leading-none font-semibold text-(--ck-cyan) italic"
      style={style}
    >
      <i className="ri-arrow-right-s-fill text-[15px]" aria-hidden />
      {text}
    </span>
  )
}
