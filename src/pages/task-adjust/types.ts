import type { TagTone } from '@/components/cockpit-ui'

/** 顶部三个任务状态统计 */
export interface TaskStat {
  key: string
  label: string
  value: number
  tone: TagTone
}

/** 任务类型分布的一行 */
export interface TaskTypeRow {
  dimension: string
  count: number
  ratio: string
  color: string
}

/** 环形图的一段装饰弧 */
export interface DonutArc {
  color: string
  /** 角度跨度（度） */
  span: number
}

/** 任务清单的一行 */
export interface TaskListRow {
  name: string
  dept: string
  triggeredAt: string
  progress: number
  status: string
  statusTone: TagTone
}

/** 原任务详情的键值行 */
export interface DetailRow {
  label: string
  value: string
  /** 值的强调色 */
  tone?: TagTone
}

/**
 * 卡片「调整后」值的编辑控件类型：
 * - `employee` / `department`：可搜索下拉框，从候选列表里挑
 * - `datetime`：单日期 + 时分选择器
 * - `textarea` / `input`：多行 / 单行纯文本
 */
export type AdjustEditor = 'employee' | 'department' | 'datetime' | 'textarea' | 'input'

/** 任务调整项：一条调整建议 */
export interface AdjustItem {
  label: string
  /** 纯文本描述（与 from/to 二选一） */
  text?: string
  /** 调整前后对照 */
  from?: string
  to?: string
  /** 前缀说明，如「负责人」「完成时限」 */
  prefix?: string
  /** 附注，如「(增加负责人直管)」 */
  note?: string
  /** 卡片高度权重（按目标稿实测比例分配面板高度） */
  weight: number
  /** 与上一张卡片之间是否留出更大的间距 */
  gapBefore?: boolean
  /** 双击进入编辑态时使用的控件 */
  editor: AdjustEditor
}

/** 调整影响确认的一行 */
export interface ImpactRow {
  icon: string
  label: string
  /** 有 from/to 则渲染为前后对照胶囊 */
  from?: string
  to?: string
  fromTone?: TagTone
  toTone?: TagTone
  /** 否则渲染为多行文本 */
  lines?: string[]
}

/** 调整前后对比表的一行 */
export interface CompareRow {
  label: string
  before: string
  after: string
  afterTone?: TagTone
}
