import type { TagTone } from '@/components/cockpit-ui'

/** 中栏顶部的页签 */
export interface StaffTab {
  key: string
  label: string
  icon: string
}

/** 个人 / 部门平均水平对比里的一行 */
export interface MetricRow {
  label: string
  value: string
  /** 进度条填充比例，0 ~ 100 */
  ratio: number
  tone: TagTone
}

/** 个人 / 部门平均水平对比的一组 */
export interface PersonalMetric {
  title: string
  rows: MetricRow[]
}

/** 折线图里的一条线 */
export interface TrendLine {
  name: string
  tone: TagTone
  data: number[]
}

/** 作业趋势监测里的一张折线图 */
export interface TrendSeries {
  /** 右上角单位说明，如「单位：分钟」 */
  unit: string
  axis: string[]
  lines: TrendLine[]
}

/** 个人单据处理情况里的一个底座图标数 */
export interface DocStat {
  label: string
  value: string
  unit: string
  icon: string
}

/** 个人报表出具情况里的一个仪表盘 */
export interface ReportGaugeItem {
  label: string
  /** 指针值与环心百分比 */
  rate: number
  /** 已出具量 */
  issued: number
  /** 已出具量进度条比例，0 ~ 100 */
  issuedRatio: number
  /** 待出具量 */
  pending: number
  /** 待出具量进度条比例，0 ~ 100 */
  pendingRatio: number
}

/** 专项任务统计里的一个带进度条的数值 */
export interface SpecialTaskStat {
  label: string
  value: string
  tone: TagTone
  /** 下方点阵进度比例，0 ~ 100 */
  ratio: number
}

/** 专项任务明细表的一行 */
export interface SpecialTaskRow {
  no: string
  content: string
  type: string
  deadline: string
  status: string
  statusTone: TagTone
}
