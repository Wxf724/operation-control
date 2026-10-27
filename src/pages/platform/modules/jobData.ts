/** 作业管理平台的模拟数据（对应 `_refs/live/10-作业管理平台.png`） */

/** 带方形立体图标的数字指标 */
export interface JobIconStat {
  label: string
  value: string
  unit: string
  /** remixicon 类名 */
  icon: string
  /** 数值与图标取色用的 CSS 变量名 */
  colorVar: string
}

/** 月度双折线的一个数据点 */
export interface JobTrendPoint {
  month: string
  received: number
  finished: number
}

/** 柱状图数据项 */
export interface JobBarItem {
  month: string
  value: number
}

/** 月末结账情况的立体底座数字 */
export interface JobPedestalStat {
  label: string
  value: string
  unit: string
}

/** 半圆仪表盘（报表出具情况） */
export interface JobReportGauge {
  label: string
  /** 0–100 */
  rate: number
  issued: string
  pending: string
}

/** 规范情况的一张柱状图 */
export interface JobNormChart {
  title: string
  data: JobBarItem[]
  yMax: number
  yInterval: number
  /** 末柱是否用预警橙高亮 */
  highlightLast: boolean
}

/* ───────────── 第一行 · 作业处理整体情况 ───────────── */

export const JOB_OVERALL_STATS: JobIconStat[] = [
  {
    label: '单据接收量',
    value: '100',
    unit: '笔',
    icon: 'ri-inbox-archive-line',
    colorVar: '--ck-cyan',
  },
  {
    label: '单据完成量',
    value: '160',
    unit: '笔',
    icon: 'ri-file-check-line',
    colorVar: '--ck-green',
  },
]

export const JOB_COMPLETE_TREND: JobTrendPoint[] = [
  { month: '1月', received: 132000, finished: 87000 },
  { month: '2月', received: 108000, finished: 67000 },
  { month: '3月', received: 152000, finished: 110000 },
  { month: '4月', received: 163000, finished: 122000 },
  { month: '5月', received: 169000, finished: 131000 },
  { month: '6月', received: 182000, finished: 139000 },
  { month: '7月', received: 184000, finished: 146000 },
  { month: '8月', received: 173000, finished: 135000 },
  { month: '9月', received: 185000, finished: 144000 },
]

/* ───────────── 第一行 · 作业处理规范情况 ───────────── */

const MONTHS_7 = ['1月', '2月', '3月', '4月', '5月', '6月', '7月']

const toBars = (values: number[]): JobBarItem[] =>
  values.map((value, i) => ({ month: MONTHS_7[i], value }))

export const JOB_NORM_CHARTS: JobNormChart[] = [
  {
    title: '转人工制证的单据量',
    data: toBars([126, 106, 148, 160, 169, 178, 184]),
    yMax: 250,
    yInterval: 50,
    highlightLast: false,
  },
  {
    title: '仅修改凭证未修改单据的单据量',
    data: toBars([63, 53, 74, 80, 84, 89, 92]),
    yMax: 120,
    yInterval: 20,
    highlightLast: true,
  },
  {
    title: '有凭证无单据的凭证量',
    data: toBars([63, 53, 74, 80, 84, 89, 92]),
    yMax: 120,
    yInterval: 20,
    highlightLast: false,
  },
]

/* ───────────── 第二行 · 作业流转处理情况 ───────────── */

export const JOB_TODO_STATS: JobIconStat[] = [
  {
    label: '待处理单据量',
    value: '100',
    unit: '笔',
    icon: 'ri-file-list-3-line',
    colorVar: '--ck-cyan',
  },
  {
    label: '挂起单据量',
    value: '160',
    unit: '笔',
    icon: 'ri-file-forbid-line',
    colorVar: '--ck-red',
  },
]

export const JOB_MONTH_CLOSE: JobPedestalStat[] = [
  { label: '月末结账申请单\n未完成量', value: '296', unit: '笔' },
  { label: '月末结账申请单\n待审核量', value: '296', unit: '笔' },
  { label: '会计期间未关闭\n数量', value: '296', unit: '笔' },
]

export const JOB_REPORT_GAUGES: JobReportGauge[] = [
  { label: '管理口径主报表完成率', rate: 82.1, issued: '800', pending: '200' },
  { label: '其他报表完成率', rate: 82.1, issued: '800', pending: '200' },
  { label: '国资报表完成率', rate: 82.1, issued: '800', pending: '200' },
]

export const JOB_RETURN_CARDS: JobIconStat[] = [
  {
    label: '未完成协同整改的单据量',
    value: '2,496',
    unit: '笔',
    icon: 'ri-file-edit-line',
    colorVar: '--ck-blue',
  },
  {
    label: '已退单未处理的单据量',
    value: '2,496',
    unit: '笔',
    icon: 'ri-file-reduce-line',
    colorVar: '--ck-red',
  },
]

/* ───────────── 第三行 · 作业分配负载情况 ───────────── */

export const JOB_CROSS_CENTER = {
  ringLabel: '跨中心单据调整率',
  ringValue: 80,
  legend: '跨中心调整的单据量',
  yMax: 120,
  yInterval: 20,
  data: toBars([36, 16, 58, 70, 79, 88, 94]),
} as const

export const JOB_LOAD_SATURATION = {
  ringLabel: '单据分配负载率',
  ringValue: 60,
  yMax: 80,
  yInterval: 20,
  data: [
    { month: '1月', value: 22.4 },
    { month: '2月', value: 47.8 },
    { month: '3月', value: 41.5 },
    { month: '4月', value: 45.2 },
    { month: '5月', value: 18.5 },
    { month: '6月', value: 60.8 },
    { month: '7月', value: 39.0 },
    { month: '8月', value: 55.4 },
    { month: '9月', value: 54.5 },
  ] as JobBarItem[],
} as const

export const JOB_EMERGENCY = {
  ringLabel: '应急处理差错率',
  ringValue: 2,
  yMax: 7000,
  yInterval: 1000,
  months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月'],
  standard: [2250, 4820, 4180, 4520, 1880, 6080, 3930, 5580, 5480],
  maximum: [1320, 3620, 1570, 1960, 430, 3570, 1460, 3230, 3120],
  legend: ['标准单据处理量', '最大单据处理量'],
} as const
