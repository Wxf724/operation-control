import type { FlowNodeData } from '../types'

import { FLOW_GEOMETRY, toneVar } from './flowTheme'

export interface TrackBandProps {
  nodes: FlowNodeData[]
  className?: string
}

/**
 * 流程主色带：按节点等分，每段用完成率换算的颜色，段与段之间是硬边。
 *
 * 上面再叠一层等距竖纹，做出线上那版「分段刻度」的观感。
 */
export function TrackBand({ nodes, className = '' }: TrackBandProps) {
  const count = Math.max(1, nodes.length)
  const stops = nodes.flatMap((node, i) => {
    const color = toneVar(node.rateValue)
    return [`${color} ${(i / count) * 100}%`, `${color} ${((i + 1) / count) * 100}%`]
  })

  return (
    <div
      className={`relative w-full overflow-hidden rounded-full ${className}`}
      style={{ height: FLOW_GEOMETRY.bandHeight }}
    >
      <span
        className="block h-full w-full"
        style={{ background: `linear-gradient(90deg, ${stops.join(', ')})` }}
      />
      <span
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'repeating-linear-gradient(90deg, transparent 0 15px, rgba(3,18,38,0.52) 15px 18px)',
        }}
      />
    </div>
  )
}
