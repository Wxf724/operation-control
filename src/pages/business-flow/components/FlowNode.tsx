import type { FlowNodeData } from '../types'

import { pad2, toneVar } from './flowTheme'

export interface FlowNodeProps {
  node: FlowNodeData
  /** 转折区用的紧凑版：字号略小 */
  compact?: boolean
  className?: string
}

/** 流程上的单个业务节点：编号 + 名称 + 待办量 + 完成率 */
export function FlowNode({ node, compact = false, className = '' }: FlowNodeProps) {
  const rateColor = toneVar(node.rateValue)
  const titleSize = compact ? 'text-[14px]' : 'text-[15px]'
  const metricSize = compact ? 'text-[11px]' : 'text-[12px]'

  return (
    <div className={`flex min-w-0 flex-col gap-1.5 ${className}`}>
      <div className="flex items-baseline gap-1.5">
        <span className="ck-glow-num text-[15px] leading-none font-bold text-(--ck-cyan) italic">
          {pad2(node.id)}
        </span>
        <span className={`truncate leading-none font-semibold text-(--ck-title) ${titleSize}`}>
          {node.name}
        </span>
      </div>

      <div className={`flex flex-col gap-1.5 leading-none whitespace-nowrap ${metricSize}`}>
        <span className="flex items-baseline gap-1">
          <span className="truncate text-(--text-secondary)">{node.volume.label}</span>
          <span className="ck-glow-num font-bold text-(--ck-cyan)">{node.volume.value}</span>
          {node.volume.unit ? (
            <span className="text-(--text-tertiary)">{node.volume.unit}</span>
          ) : null}
        </span>

        <span className="flex items-baseline gap-1">
          <span className="truncate text-(--text-secondary)">{node.rate.label}</span>
          <span className="font-bold" style={{ color: rateColor }}>
            {node.rate.value}
          </span>
        </span>
      </div>
    </div>
  )
}
