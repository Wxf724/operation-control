import type { TagTone } from '@/components/cockpit-ui'

/** 顶部政策来源卡 */
export interface PolicySource {
  key: string
  name: string
  count: string
  today: string
}

/** 政策分类侧栏的一项 */
export interface PolicyCategory {
  name: string
  count: string
  icon: string
  /** 是否为「全部政策」这类高亮项 */
  highlight?: boolean
}

/** 政策状态条 */
export interface PolicyStatusBar {
  name: string
  count: string
  /** 条形占比 0–100 */
  percent: number
  tone: TagTone
}

/** 政策列表的一行 */
export interface PolicyRow {
  publishedAt: string
  name: string
  org: string
  category: string
  status: string
  statusTone: TagTone
}

/** 智能分析五步流程的一步 */
export interface AnalysisStep {
  key: string
  title: string
  icon: string
  lines: string[]
}

/** 政策详情里的四个信息卡 */
export interface PolicyMetaCard {
  icon: string
  label: string
  value: string
}

/** 差异比对的统计卡 */
export interface DiffStat {
  label: string
  value: string
  sub?: string
  tone: TagTone
}

/** 差异明细表的一行 */
export interface DiffRow {
  index: number
  item: string
  level: string
  levelTone: TagTone
  system: string
}

/** AI 生成建议卡 */
export interface SuggestionCard {
  icon: string
  title: string
  tone: TagTone
  lines: string[]
}
