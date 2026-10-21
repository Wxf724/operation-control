/** 绩效管理平台的模拟数据（对应 `_refs/live/18-绩效管理平台.png`） */

/** 「数量情况」顶部的三个指标卡 */
export interface PerfCountCard {
  label: string
  value: string
  /** 数值后的小号单位，百分比类指标留空 */
  unit?: string
}

/** 单据接收量 / 完成量 / 完成率的月度趋势 */
export interface PerfDocTrendPoint {
  month: string
  /** 单据接收量，万笔 */
  received: number
  /** 单据完成量，万笔 */
  completed: number
  /** 单据完成率，% */
  rate: number
}

/** 带底座的图标数字（人均任务处理量等） */
export interface PerfBaseStat {
  /** remixicon 类名 */
  icon: string
  label: string
  value: string
  unit: string
}

/** 按业务分类的单据平均处理时长 */
export interface PerfDurationRow {
  label: string
  /** 小时 */
  hours: number
}

/** 月度结账及时率 / 报表出具及时率的双折线 */
export interface PerfTimelinessPoint {
  month: string
  /** 月度结账及时率，% */
  settle: number
  /** 报表出具及时率，% */
  report: number
}

/** 单指标的月度折线点 */
export interface PerfRatePoint {
  month: string
  value: number
}

/** 服务满意度情况里的两个底座数字 */
export interface PerfSatisfactionItem {
  /** remixicon 类名 */
  icon: string
  label: string
  value: string
  /** 图标与数字的取色变量名 */
  tone: 'cyan' | 'red'
}

/* ───────────── 效率管理情况 · 数量情况 ───────────── */

/** 单据接收量 / 完成量 / 完成率 */
export const PERF_COUNT_CARDS: PerfCountCard[] = [
  { label: '单据接收量', value: '39', unit: '万笔' },
  { label: '单据完成量', value: '39', unit: '万笔' },
  { label: '单据完成率', value: '80.0%' },
]

/** 1—7 月单据接收量、完成量与完成率 */
export const PERF_DOC_TREND: PerfDocTrendPoint[] = [
  { month: '1月', received: 13.7, completed: 12.8, rate: 92.6 },
  { month: '2月', received: 11.8, completed: 10.7, rate: 91.5 },
  { month: '3月', received: 16.0, completed: 15.0, rate: 93.7 },
  { month: '4月', received: 17.2, completed: 16.1, rate: 94.2 },
  { month: '5月', received: 18.0, completed: 17.0, rate: 94.5 },
  { month: '6月', received: 18.8, completed: 18.0, rate: 94.7 },
  { month: '7月', received: 19.5, completed: 18.5, rate: 95.0 },
]

/** 数量情况底部的三个底座数字 */
export const PERF_BASE_STATS: PerfBaseStat[] = [
  { icon: 'ri-file-list-3-line', label: '人均任务处理量', value: '240', unit: '笔' },
  { icon: 'ri-time-line', label: '平均单据产能', value: '280', unit: '笔' },
  { icon: 'ri-file-chart-line', label: '待出具报表量', value: '50', unit: '笔' },
]

/* ───────────── 效率管理情况 · 时长情况 ───────────── */

/** 单据平均处理时长（小时） */
export const PERF_AVG_DURATION = '7'

/** 进度条换算用的时长上限（小时） */
export const PERF_DURATION_MAX = 2.1

/** 各业务分类的单据平均处理时长 */
export const PERF_DURATION_ROWS: PerfDurationRow[] = [
  { label: '资产和使用权资产', hours: 2.0 },
  { label: '成本业务', hours: 1.0 },
  { label: '费用业务', hours: 1.0 },
  { label: '资金业务', hours: 1.5 },
  { label: '收入业务', hours: 2.0 },
  { label: '税务业务', hours: 2.0 },
  { label: '总账业务', hours: 2.0 },
]

/** 月度结账及时率与报表出具及时率 */
export const PERF_TIMELINESS: PerfTimelinessPoint[] = [
  { month: '1月', settle: 90.2, report: 94.2 },
  { month: '2月', settle: 90.1, report: 86.0 },
  { month: '3月', settle: 91.6, report: 81.9 },
  { month: '4月', settle: 96.4, report: 90.2 },
  { month: '5月', settle: 89.4, report: 96.4 },
  { month: '6月', settle: 88.5, report: 89.4 },
  { month: '7月', settle: 94.5, report: 84.1 },
]

/* ───────────── 质量管理情况 ───────────── */

/** 全流程业务处理质量，% */
export const PERF_PROCESS_QUALITY = 96.0

/** 报表编制准确率月度走势 */
export const PERF_REPORT_ACCURACY: PerfRatePoint[] = [
  { month: '1月', value: 93.5 },
  { month: '2月', value: 90.0 },
  { month: '3月', value: 81.1 },
  { month: '4月', value: 90.0 },
  { month: '5月', value: 95.2 },
  { month: '6月', value: 90.1 },
  { month: '7月', value: 83.9 },
]

/* ───────────── 服务企业情况 ───────────── */

/** 成本费用总额 */
export const PERF_COST_TOTAL = { value: '20,000.0', unit: '万元' }

/** 成本费用预算执行准确率，% */
export const PERF_BUDGET_ACCURACY = 70.0

/* ───────────── 服务满意度情况 ───────────── */

/** 客户满意度问卷评分与用户投诉总量 */
export const PERF_SATISFACTION: PerfSatisfactionItem[] = [
  { icon: 'ri-survey-line', label: '客户满意度问卷评分', value: '95', tone: 'cyan' },
  { icon: 'ri-folder-warning-line', label: '用户投诉总量', value: '10', tone: 'red' },
]
