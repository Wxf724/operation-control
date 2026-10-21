import type { ChartVarName } from '@/components/cockpit-ui'

/** 员工管理平台的模拟数据（对应参考截图 11-员工管理平台） */

/** 各图表共用的月份坐标 */
export const STAFF_MONTHS = ['1月', '2月', '3月', '4月', '5月']

/** 作业人员构成环形图的一段 */
export interface StaffHeadcountSlice {
  label: string
  value: number
  /** CSS 颜色表达式，直接给内联 SVG 用 */
  color: string
}

/** 作业人员总数 */
export const STAFF_HEADCOUNT_TOTAL = 174

/** 作业人员构成 */
export const STAFF_HEADCOUNT: StaffHeadcountSlice[] = [
  { label: '在岗', value: 131, color: 'var(--ck-blue)' },
  { label: '休假', value: 17, color: 'var(--ck-cyan)' },
  { label: '出差', value: 20, color: 'var(--ck-green)' },
  { label: '其他', value: 6, color: 'var(--ck-pink)' },
]

/** 各中心人员明细表的一行 */
export interface StaffCenterRow {
  center: string
  onDuty: number
  /** 其中：在岗作业人数 */
  working: number
  leave: number
  trip: number
  other: number
}

/** 各中心人员明细 */
export const STAFF_CENTER_ROWS: StaffCenterRow[] = [
  { center: '东部中心', onDuty: 40, working: 38, leave: 0, trip: 12, other: 8 },
  { center: '西部中心', onDuty: 36, working: 33, leave: 5, trip: 2, other: 2 },
  { center: '南部中心', onDuty: 24, working: 20, leave: 2, trip: 8, other: 1 },
  { center: '北部中心', onDuty: 31, working: 30, leave: 10, trip: 0, other: 3 },
]

/** 人员技能气泡 */
export interface StaffSkillBubble {
  label: string
  value: number
  /** 气泡直径（px） */
  size: number
  /** 相对容器的百分比定位 */
  x: number
  y: number
}

/** 人员技能情况（前 10 大标签数量排名） */
export const STAFF_SKILLS: StaffSkillBubble[] = [
  { label: '费用核算能手', value: 46, size: 74, x: 5, y: 1 },
  { label: '收入核算能手', value: 53, size: 82, x: 32, y: 0 },
  { label: '总账核算能手', value: 46, size: 62, x: 67, y: 4 },
  { label: '成本核算能手', value: 32, size: 80, x: 0, y: 38 },
  { label: '税务核算能手', value: 97, size: 96, x: 28, y: 42 },
  { label: '资产核算能手', value: 82, size: 86, x: 62, y: 34 },
]

/** 业务处理质量的一条折线 */
export interface StaffQualitySeries {
  name: string
  colorVar: ChartVarName
  data: number[]
}

/** 业务处理质量（准确率 %） */
export const STAFF_QUALITY_SERIES: StaffQualitySeries[] = [
  { name: '单据处理准确率', colorVar: '--ck-blue', data: [89, 75, 90, 80, 88] },
  { name: '报表出具准确率', colorVar: '--ck-green', data: [91, 75, 80, 73, 64] },
  { name: '资金支付准确率', colorVar: '--ck-purple', data: [65, 62, 64, 67, 73] },
]

/** 被质量稽核情况的两个整改率 */
export const STAFF_AUDIT_RATES = [
  { label: '问题整改率', value: '80.0%' },
  { label: '问题整改及时率', value: '80.0%' },
]

/** 质量稽核差错率趋势（%） */
export const STAFF_AUDIT_ERROR_TREND = [88, 74, 89, 80, 87]

/** 绩效情况总览 */
export const STAFF_PERFORMANCE = {
  indicatorTotal: '500',
  completionRate: 95,
  reached: '450',
  unreached: '50',
} as const

/** 绩效达标明细的一行 */
export interface StaffPerformanceRow {
  label: string
  value: string
  percent: number
  reached: boolean
}

/** 绩效达标明细（面板只露 4 条，其余手动滚动查看） */
export const STAFF_PERFORMANCE_ROWS: StaffPerformanceRow[] = [
  { label: '服务满意度', value: '80分', percent: 80, reached: true },
  { label: '平均单据产能', value: '500笔', percent: 92, reached: true },
  { label: '数字化任务指标', value: '5个', percent: 76, reached: true },
  { label: '风险平台整改成效', value: '91%', percent: 91, reached: true },
  { label: '运营监控与调控平台建设成效', value: '82%', percent: 82, reached: false },
  { label: '业务处理质量综合达成率', value: '90%', percent: 100, reached: false },
  { label: '单据平均处理时长', value: '10分钟', percent: 85, reached: true },
  { label: '报表出具及时率', value: '98%', percent: 98, reached: true },
]

/** 单据处理情况的一个页签 */
export interface StaffBillTab {
  label: string
  total: string
  /** RPA 处理量 */
  rpa: number
  /** 人工处理量 */
  manual: number
  rpaBars: number[]
  manualBars: number[]
}

/** 单据处理情况（四个页签） */
export const STAFF_BILL_TABS: StaffBillTab[] = [
  {
    label: '单据接收量',
    total: '620',
    rpa: 410,
    manual: 210,
    rpaBars: [1200, 1400, 1700, 1000, 1200],
    manualBars: [1700, 1900, 1200, 1750, 1350],
  },
  {
    label: '单据完成量',
    total: '500',
    rpa: 340,
    manual: 160,
    rpaBars: [1000, 1250, 1550, 850, 1050],
    manualBars: [1550, 1750, 1050, 1600, 1200],
  },
  {
    label: '待处理单据量',
    total: '120',
    rpa: 70,
    manual: 50,
    rpaBars: [300, 350, 280, 320, 260],
    manualBars: [420, 480, 390, 450, 360],
  },
  {
    label: '挂起单据量',
    total: '46',
    rpa: 20,
    manual: 26,
    rpaBars: [120, 160, 140, 110, 130],
    manualBars: [180, 210, 170, 160, 150],
  },
]

/** 报表出具情况的一个半圆仪表盘 */
export interface StaffReportGauge {
  label: string
  value: number
  issued: string
  pending: string
}

/** 报表出具情况 */
export const STAFF_REPORT_GAUGES: StaffReportGauge[] = [
  { label: '管理口径主报表完成率', value: 82.1, issued: '800', pending: '200' },
  { label: '其他报表完成率', value: 82.1, issued: '800', pending: '200' },
  { label: '国资报表完成率', value: 82.1, issued: '800', pending: '200' },
]

/** 专项任务完成情况 */
export const STAFF_SPECIAL_TASK = {
  label: '专项工作',
  total: '240',
  rows: [
    { label: '年度重点工作量', value: '120', percent: 95, tone: 'green' },
    { label: '公司督办类工作量', value: '60', percent: 50, tone: 'blue' },
    { label: '其他综合类工作', value: '60', percent: 42, tone: 'purple' },
  ],
} as const

/** 效率情况的一个页签 */
export interface StaffEfficiencyTab {
  label: string
  value: string
  /** 柱状图 y 轴上限 */
  max: number
  bars: number[]
}

/** 效率情况（四个页签） */
export const STAFF_EFFICIENCY_TABS: StaffEfficiencyTab[] = [
  { label: '单据平均处理时长', value: '10', max: 20, bars: [16, 11, 9, 14, 8] },
  { label: '平均单据产能', value: '300', max: 500, bars: [455, 310, 265, 395, 215] },
  { label: '平均报表出具量', value: '180', max: 300, bars: [260, 190, 165, 240, 140] },
  { label: '人均任务处理量', value: '96', max: 150, bars: [132, 98, 86, 120, 74] },
]

/** 员工个人产能排名的一行 */
export interface StaffRankRow {
  rank: number
  name: string
  value: number
  percent: number
}

/** 员工个人产能排名 */
export const STAFF_RANKS: StaffRankRow[] = [
  { rank: 1, name: '张米粒', value: 430, percent: 100 },
  { rank: 2, name: '李明', value: 400, percent: 93 },
  { rank: 3, name: '张三三', value: 380, percent: 88 },
  { rank: 4, name: '唔一样', value: 330, percent: 77 },
  { rank: 5, name: '李思思', value: 290, percent: 67 },
  { rank: 6, name: '王美丽', value: 272, percent: 63 },
]

/** 服务情况 */
export const STAFF_SERVICE = {
  complaintTotal: '29',
  agreementRate: 91,
} as const
