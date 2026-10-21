/** 全业务流程展示页的节点与面板数据结构 */

/** 色带颜色档位：由节点完成率换算 */
export type FlowTone = 'green' | 'yellow' | 'red'

/** 节点下面的一行指标，如「待提交单据量 5,000 笔」 */
export interface FlowMetric {
  label: string
  value: string
  unit: string
}

/** 流程上的一个业务节点 */
export interface FlowNodeData {
  /** 节点编号：02 ~ 23 */
  id: number
  /** 节点名称，如「共享初审」 */
  name: string
  /** 待办量类指标 */
  volume: FlowMetric
  /** 完成率类指标 */
  rate: FlowMetric
  /** 完成率数值，用于换算色带颜色 */
  rateValue: number
}

/** 右侧详情面板的一格指标 */
export interface ReviewStat {
  label: string
  value: string
  unit: string
}

/** 右侧详情面板底部的问题 / 方案 / 督办条目 */
export interface ReviewNote {
  label: string
  value: string
}
