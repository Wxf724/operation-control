import type { ReactElement } from 'react'

import type { TagTone } from '@/components/cockpit-ui'

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
