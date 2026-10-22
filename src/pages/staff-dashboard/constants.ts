import type { MetricPill } from '@/pages/cockpit/types'

import type {
  DocStat,
  PersonalMetric,
  ReportGaugeItem,
  SpecialTaskRow,
  SpecialTaskStat,
  StaffTab,
  TrendSeries,
} from './types'

/** 画布尺寸，与 13 个模块平台页一致 */
export const CANVAS = { width: 2400, height: 1080 }

/** 顶栏期间（与平台页同源） */
export const PERIOD = { start: '2026-09-01', end: '2026-09-21' }

/** 顶部 7 张 KPI，取自参考稿 */
export const DASHBOARD_KPIS: MetricPill[] = [
  { key: 'handled', label: '任务处理量', value: '500', unit: '笔', icon: 'ri-bar-chart-box-line', asOf: '截至当日' },
  { key: 'pending', label: '任务待办量', value: '12', unit: '笔', icon: 'ri-file-list-2-line', asOf: '截至当日' },
  { key: 'perCapita', label: '人均任务处理量', value: '500', unit: '笔/月', icon: 'ri-speed-up-line', asOf: '截至当日' },
  { key: 'quality', label: '业务处理质量综合达成率', value: '99%', unit: '', icon: 'ri-shield-star-line', asOf: '截至当日' },
  { key: 'error', label: '质量稽核差错率', value: '500', unit: '%', icon: 'ri-calculator-line', asOf: '截至当日' },
  { key: 'duration', label: '任务平均处理时长', value: '10', unit: '分钟', icon: 'ri-time-line', asOf: '截至当日' },
  { key: 'complaint', label: '用户投诉总量', value: '6', unit: '起', icon: 'ri-feedback-line', asOf: '截至当日' },
]

/* ───────────── 左栏：员工动态监测 ───────────── */

/** 员工基本信息 */
export const STAFF_INFO = {
  name: '张三',
  post: '六级专员 / 应付核算组',
  onDuty: { label: '在岗天数', value: '259', unit: '天', icon: 'ri-user-follow-line', tone: 'blue' as const },
  vacation: { label: '休假天数', value: '2', unit: '天', icon: 'ri-sun-line', tone: 'orange' as const },
  travel: { label: '出差天数', value: '105', unit: '天', icon: 'ri-suitcase-line', tone: 'red' as const },
}

/** 个人 / 部门平均水平对比的三组指标 */
export const PERSONAL_METRICS: PersonalMetric[] = [
  {
    title: '任务处理量(笔)',
    rows: [
      { label: '个人平均水平', value: '180', ratio: 90, tone: 'cyan' },
      { label: '部门平均水平', value: '160', ratio: 80, tone: 'green' },
    ],
  },
  {
    title: '任务平均处理时长(分钟)',
    rows: [
      { label: '个人平均水平', value: '15', ratio: 75, tone: 'cyan' },
      { label: '部门平均水平', value: '17', ratio: 85, tone: 'green' },
    ],
  },
  {
    title: '单据处理准确率',
    rows: [
      { label: '个人平均水平', value: '96%', ratio: 96, tone: 'cyan' },
      { label: '部门平均水平', value: '95%', ratio: 95, tone: 'green' },
    ],
  },
]

/* ───────────── 左栏：作业趋势监测 ───────────── */

/** 任务平均处理时长（单位：分钟），横轴 05/01 ~ 05/10 */
export const DURATION_TREND: TrendSeries = {
  unit: '单位：分钟',
  axis: ['05/01', '05/02', '05/03', '05/04', '05/05', '05/06', '05/07', '05/08', '05/09', '05/10'],
  lines: [
    { name: '任务平均处理时长', tone: 'cyan', data: [150, 120, 160, 210, 140, 170, 230, 160, 190, 200] },
    { name: '平均值', tone: 'green', data: [170, 170, 170, 170, 170, 170, 170, 170, 170, 170] },
  ],
}

/** 任务量情况（单位：笔），横轴 06/01 ~ 06/30 */
export const VOLUME_TREND: TrendSeries = {
  unit: '单位：笔',
  axis: ['06/01', '06/03', '06/05', '06/09', '06/11', '06/15', '06/17', '06/22', '06/24', '06/26', '06/30'],
  lines: [
    { name: '完成量', tone: 'cyan', data: [7200, 14800, 9600, 8200, 7600, 8400, 7400, 8600, 7800, 9200, 7600] },
    { name: '待办量', tone: 'green', data: [500, 4200, 5200, 4400, 5600, 4800, 5400, 4600, 5200, 4400, 6600] },
  ],
}

/* ───────────── 中栏：页签 ───────────── */

export const STAFF_TABS: StaffTab[] = [
  { key: 'job', label: '作业情况', icon: 'ri-file-list-3-line' },
  { key: 'efficiency', label: '效率情况', icon: 'ri-bar-chart-2-line' },
  { key: 'quality', label: '质量情况', icon: 'ri-shield-check-line' },
  { key: 'service', label: '服务情况', icon: 'ri-customer-service-2-line' },
  { key: 'performance', label: '绩效情况', icon: 'ri-medal-line' },
  { key: 'skill', label: '技能情况', icon: 'ri-stack-line' },
]

/* ───────────── 中栏：个人单据处理情况 ───────────── */

export const DOC_STATS: DocStat[] = [
  { label: '单据接收量', value: '547', unit: '笔', icon: 'ri-inbox-archive-line' },
  { label: '单据完成量', value: '500', unit: '笔', icon: 'ri-file-check-line' },
  { label: '待处理单据量', value: '12', unit: '笔', icon: 'ri-file-list-2-line' },
  { label: '挂起单据量', value: '27', unit: '笔', icon: 'ri-pause-circle-line' },
  { label: '协同退回单据量', value: '8', unit: '笔', icon: 'ri-share-forward-box-line' },
]

/* ───────────── 中栏：个人报表出具情况 ───────────── */

export const REPORT_GAUGES: ReportGaugeItem[] = [
  { label: '管理口径主报表完成率', rate: 73.8, issued: 1000, issuedRatio: 82, pending: 230, pendingRatio: 24 },
  { label: '其他报表完成率', rate: 79.6, issued: 1620, issuedRatio: 88, pending: 580, pendingRatio: 42 },
  { label: '国资报表完成率', rate: 82.1, issued: 1887, issuedRatio: 92, pending: 120, pendingRatio: 14 },
]

/* ───────────── 中栏：个人专项任务工作统计 ───────────── */

export const SPECIAL_TABS = [
  '专项工作总量',
  '工作完成量',
  '待完成工作量',
  '已完成工作逾期量',
  '待完成工作逾期率',
  '工作平均完成进度',
]

/** 环心总量 */
export const SPECIAL_TOTAL = { value: '500', label: '专项工作总量', ratio: 72 }

export const SPECIAL_STATS: SpecialTaskStat[] = [
  { label: '年度重点工作', value: '400', tone: 'cyan', ratio: 80 },
  { label: '公司督办类工作', value: '500', tone: 'green', ratio: 100 },
  { label: '其他综合类工作', value: '120', tone: 'purple', ratio: 24 },
]

export const SPECIAL_ROWS: SpecialTaskRow[] = [
  {
    no: '1',
    content: '发布集团统一收款字典，统一收款入账标准。',
    type: '年度重点',
    deadline: '2026/05/31',
    status: '已完成',
    statusTone: 'green',
  },
  {
    no: '2',
    content: '推进风控平台建设。按计划3月底完成方案制',
    type: '督办任务',
    deadline: '2026/05/31',
    status: '进行中',
    statusTone: 'orange',
  },
]
