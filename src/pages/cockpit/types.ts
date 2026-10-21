import type { TagTone } from '@/components/cockpit-ui'

/** 运营结果区的单个 KPI 卡 */
export interface ResultKpi {
  key: string
  label: string
  value: string
  /** 形如 +12.6% */
  delta: string
  tone: TagTone
  /** 迷你折线的数据点 */
  spark: number[]
}

/** 各中心 / 各驻企团队的运行情况卡 */
export interface CenterStatus {
  name: string
  status: string
  /** 待处理任务量 */
  pending: number
  /** 累计超时任务量 */
  overtime: number
  /** 平均负载率 */
  load: string
  /** 健康度 */
  health: string
  /** 是否告警态（整卡转红） */
  danger: boolean
}

/** 近 10 日运行趋势的一天 */
export interface TrendPoint {
  date: string
  /** 单据接收量 */
  received: number
  /** 待处理单据量 */
  pending: number
  /** 单据完成量 */
  finished: number
  /** 单据完成率（%） */
  rate: number
}

/** 中部左右两列的业务模块入口 */
export interface ModuleEntry {
  key: string
  label: string
  icon: string
  /** 双击跳转的模块平台页路由 */
  route: string
}

/** 地图上的节点城市 */
export interface MapNode {
  name: string
  /** [经度, 纬度] */
  coord: [number, number]
  /** 节点权重，影响光点大小 */
  weight: number
  /** 是否重点标注（显示名称） */
  primary?: boolean
}

/** 地图下方的指标药丸，同时用作各模块平台页顶部的 KPI 卡 */
export interface MetricPill {
  key: string
  label: string
  value: string
  unit: string
  icon: string
  /** 数值配色，默认 cyan；原件里「单据分配负载率 90%」是黄色预警态 */
  tone?: TagTone
  /** 同比，默认 +8.00% */
  delta?: string
  /** 卡片右上角的口径说明，如「截至当日」 */
  asOf?: string
}

/** 右侧「提醒事项」小卡 */
export interface ReminderItem {
  label: string
  value: string
  tone: TagTone
}

/** 右侧「AI调控策略」小卡 */
export interface StrategyCard {
  title: string
  badge: string
  tone: TagTone
  lines: string[]
}

/** 策略执行状态环 */
export interface StrategyProgress {
  done: number
  doing: number
  todo: number
}

/** 调控执行反馈表的一行 */
export interface FeedbackRow {
  task: string
  owner: string
  startAt: string
  progress: number
  status: string
  statusTone: TagTone
  action: string
}

/** 智能操作面板按钮 */
export interface QuickAction {
  key: string
  label: string
  icon: string
  /** 有值则点击跳转该路由 */
  to?: string
}

/** 「各驻企财务团队运行情况」页签里的一行：企业 + 其数据看板入口 */
export interface TeamLinkRow {
  /** 驻企财务团队所在企业 */
  name: string
  /** 展示用的链接文本（截断前的完整地址） */
  url: string
  /** 点击后跳转的站内路由 */
  to: string
}
