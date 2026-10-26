import type { ReactElement } from 'react'

import type { TagTone } from '@/components/cockpit-ui'

/** 模块平台页的注册信息 */
export interface PlatformMeta {
  /** 模块 key，与首页 ModuleEntry.key 一致 */
  key: string
  /** 页面大标题，如「员工管理平台」 */
  title: string
  /** 来源 PPT 页码说明，便于后续比对 */
  sourceNote: string
  /** 主题类名，默认深色座舱主题；浅色页传 `theme-cloud-light` */
  theme?: string
  /** 中间业务区的组件；未建设时为空，渲染占位 */
  Content?: (props: PlatformContentProps) => ReactElement
}

/** 中间业务区组件收到的 props：顶栏当前选中的组织范围 */
export interface PlatformContentProps {
  /** 顶栏「组织范围」下拉当前值，按需渲染不同面板组 */
  org?: string
}

/* ───────────── 右栏 · 智能调控模型执行结果 ───────────── */

/** 模型结果里取值的语义色 */
export type ModelTone = 'default' | 'red' | 'green' | 'orange' | 'cyan' | 'blue'

/** 模型结果里的一行：左标签 + 右取值 */
export interface ModelRow {
  label: string
  value: string
  /** 取值右侧的次要文字，如单位或对比基准 */
  tail?: string
  tone?: ModelTone
  /** 取值前的小图标 */
  icon?: string
  /** 大号字，用于「当前值」这类重点行 */
  big?: boolean
  /** 行尾徽标，如「↓ 下降28.1%」 */
  delta?: { text: string; tone: ModelTone; icon?: string }
  /** 0–100，给出时在取值右侧画一条进度条 */
  progress?: number
}

/** 策略模型下方候选策略表的一行 */
export interface StrategyCandidate {
  name: string
  /** 第二列取值（预计消化量 / 预计时延等，列名见 `candidateCols`） */
  effect: string
  /** 第三列取值：预计恢复时间 */
  recoverAt: string
  /** 被选中的那条，左侧带勾、整行高亮 */
  chosen?: boolean
}

/** 反馈模型下方柱状对比的一根柱 */
export interface FeedbackBar {
  label: string
  value: string
  /** 0–100，柱高占比 */
  ratio: number
  tone: ModelTone
}

/** 一个任务对应的四个模型结果 */
export interface TaskModelResult {
  perception: ModelRow[]
  explain: ModelRow[]
  strategy: {
    rows: ModelRow[]
    /** 候选策略表的三个列名 */
    candidateCols: readonly [string, string, string]
    candidates: StrategyCandidate[]
  }
  feedback: {
    rows: ModelRow[]
    /** 柱状对比的标题，如「积压量变化（笔）」 */
    chartTitle: string
    bars: FeedbackBar[]
  }
}

/** 执行任务概览表的一行，点击后下方四个模型切到它的结果 */
export interface ControlTask {
  id: string
  name: string
  owner: string
  time: string
  status: string
  statusTone: ModelTone
  /** 0–100 */
  progress: number
  models: TaskModelResult
}

/** AI 调控策略顶部的四个计数 */
export interface StrategyStat {
  label: string
  value: string
  tone: TagTone
}

/** 预警信息左侧的状态条 */
export interface WarningChip {
  text: string
  status: string
  statusTone: TagTone
  icon: string
}

/** 预警信息右侧的键值明细 */
export interface WarningDetail {
  label: string
  value: string
  tone?: TagTone
}

/** 调控执行反馈顶部的三个计数 */
export interface FeedbackStat {
  label: string
  value: string
  icon: string
}

/** 调控执行反馈表的一行 */
export interface TaskFeedbackRow {
  taskNo: string
  issueNo: string
  description: string
  owner: string
  deadline: string
  status: string
  statusTone: TagTone
}
