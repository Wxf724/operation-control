/** 标准流程管理平台的模拟数据（对应线上截图 `_refs/live/14-标准流程管理平台.png`） */

/** 单个业务环节：停留时长或超期单据量 */
export interface ProcessStageItem {
  label: string
  value: number
  unit: string
  /** 进度条填充比例 0–100 */
  pct: number
}

/** 一个页签下的全部环节 */
export interface ProcessStageTab {
  label: string
  items: ProcessStageItem[]
}

/** 环形图旁的明细行 */
export interface ProcessDetailRow {
  label: string
  value: number
}

/** 环形图 + 明细列表的组合块 */
export interface ProcessDonutBlock {
  title: string
  /** 环心数字 */
  total: string
  /** 圆环填充比例 0–100 */
  ratio: number
  tone: 'green' | 'blue' | 'cyan'
  unit: string
  rows: ProcessDetailRow[]
}

/** 带底座图标的数字卡 */
export interface ProcessStatCard {
  label: string
  value: string
  unit: string
  icon: string
}

/** 折线图里的一条序列 */
export interface ProcessSeries {
  name: string
  tone: 'cyan' | 'green'
  data: number[]
}

/** 报表出具及时率的半圆仪表盘 */
export interface ProcessReportGauge {
  label: string
  /** 指针值，单位 % */
  rate: number
  /** 下方完成率，单位 % */
  done: number
}

/** 合规性情况里的一项 */
export interface ProcessComplianceItem {
  label: string
  value: string
  unit: string
  icon: string
}

/** 三个折线图共用的月份轴 */
export const PROCESS_MONTHS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月'] as const

/** 三块业务处理情况共用的页签文案 */
export const PROCESS_STAGE_TAB_LABELS = ['单据平均停留时长', '超期停留单据量'] as const

/* ───────────── 第一列 · 企业端业务处理情况 ───────────── */

export const ENTERPRISE_STAGE_TABS: ProcessStageTab[] = [
  {
    label: '单据平均停留时长',
    items: [
      { label: '单据填报', value: 10, unit: '分钟', pct: 52 },
      { label: '业务审核', value: 12, unit: '分钟', pct: 57 },
      { label: '档案邮寄', value: 11, unit: '分钟', pct: 55 },
    ],
  },
  {
    label: '超期停留单据量',
    items: [
      { label: '单据填报', value: 18, unit: '笔', pct: 45 },
      { label: '业务审核', value: 26, unit: '笔', pct: 65 },
      { label: '档案邮寄', value: 12, unit: '笔', pct: 30 },
    ],
  },
]

export const ENTERPRISE_SUBMIT_BLOCK: ProcessDonutBlock = {
  title: '月末结账申请单待提交量',
  total: '350',
  ratio: 68,
  tone: 'green',
  unit: '单位（笔）',
  rows: [
    { label: '其中：资产业务账务未处理单据量', value: 30 },
    { label: '成本费用业务账务未处理单据量', value: 16 },
    { label: '资金业务账务未处理单据量', value: 20 },
    { label: '收入业务账务未处理单据量', value: 32 },
    { label: '税务业务账务未处理单据量', value: 20 },
    { label: '总账业务账务未处理单据量', value: 18 },
  ],
}

export const ENTERPRISE_UNPOSTED_BLOCK: ProcessDonutBlock = {
  title: '结账未制证待处理单据量',
  total: '350',
  ratio: 72,
  tone: 'blue',
  unit: '单位（笔）',
  rows: [
    { label: '其中：资产业务账务未处理单据量', value: 17 },
    { label: '成本费用业务账务未处理单据量', value: 10 },
    { label: '资金业务账务未处理单据量', value: 16 },
    { label: '收入业务账务未处理单据量', value: 12 },
    { label: '税务业务账务未处理单据量', value: 18 },
    { label: '总账业务账务未处理单据量', value: 20 },
  ],
}

/* ───────────── 第二列 · 驻企财务管理团队业务处理情况 ───────────── */

export const TEAM_STAGE_TABS: ProcessStageTab[] = [
  {
    label: '单据平均停留时长',
    items: [{ label: '单据审核', value: 10, unit: '分钟', pct: 45 }],
  },
  {
    label: '超期停留单据量',
    items: [{ label: '单据审核', value: 22, unit: '笔', pct: 60 }],
  },
]

export const TEAM_SUBMIT_CARD: ProcessStatCard = {
  label: '月末结账申请单待提交量',
  value: '86',
  unit: '笔',
  icon: 'ri-file-list-3-line',
}

export const TEAM_SUBMIT_SERIES: ProcessSeries[] = [
  { name: '月末结账申请单提交及时率', tone: 'cyan', data: [54, 76, 49, 56, 67, 59, 80] },
  { name: '月末结账申请单提交完成率', tone: 'green', data: [67, 87, 76, 83, 90, 79, 69] },
]

/* ───────────── 第三列 · 分中心业务处理情况 ───────────── */

export const CENTER_STAGE_TABS: ProcessStageTab[] = [
  {
    label: '单据平均停留时长',
    items: [
      { label: '单据待分配', value: 3, unit: '分钟', pct: 25 },
      { label: '凭证审核', value: 8, unit: '分钟', pct: 55 },
      { label: '共享初审', value: 10, unit: '分钟', pct: 62 },
      { label: '代付节点', value: 12, unit: '分钟', pct: 66 },
      { label: '共享复审', value: 5, unit: '分钟', pct: 32 },
      { label: '资金支付A', value: 9, unit: '分钟', pct: 52 },
      { label: '凭证制证', value: 7, unit: '分钟', pct: 46 },
      { label: '资金支付C', value: 4, unit: '分钟', pct: 24 },
    ],
  },
  {
    label: '超期停留单据量',
    items: [
      { label: '单据待分配', value: 6, unit: '笔', pct: 20 },
      { label: '凭证审核', value: 15, unit: '笔', pct: 50 },
      { label: '共享初审', value: 21, unit: '笔', pct: 70 },
      { label: '代付节点', value: 18, unit: '笔', pct: 60 },
      { label: '共享复审', value: 9, unit: '笔', pct: 30 },
      { label: '资金支付A', value: 14, unit: '笔', pct: 47 },
      { label: '凭证制证', value: 11, unit: '笔', pct: 37 },
      { label: '资金支付C', value: 5, unit: '笔', pct: 17 },
    ],
  },
]

export const CENTER_AUDIT_CARD: ProcessStatCard = {
  label: '月末结账申请单待审核量',
  value: '37',
  unit: '笔',
  icon: 'ri-user-follow-line',
}

export const CENTER_AUDIT_SERIES: ProcessSeries[] = [
  { name: '月末结账申请单审核完成率', tone: 'green', data: [67, 87, 76, 83, 90, 79, 69] },
]

/* ───────────── 第四列 · 会计期间与结账未制证 ───────────── */

export const PERIOD_CLOSE_CARD: ProcessStatCard = {
  label: '会计期间待关闭数量',
  value: '10',
  unit: '个',
  icon: 'ri-calendar-check-line',
}

export const REPORT_GAUGES: ProcessReportGauge[] = [
  { label: '管理口径报表出具及时率', rate: 98, done: 88 },
  { label: '其他报表出具及时率', rate: 98, done: 90 },
  { label: '国资报表出具及时率', rate: 98, done: 91 },
]

export const CENTER_UNPOSTED_BLOCK: ProcessDonutBlock = {
  title: '结账未制证待处理单据量',
  total: '400',
  ratio: 70,
  tone: 'cyan',
  unit: '单位（笔）',
  rows: [
    { label: '其中：资产业务账务未处理单据量', value: 17 },
    { label: '成本费用业务账务未处理单据量', value: 10 },
    { label: '资金业务账务未处理单据量', value: 16 },
    { label: '收入业务账务未处理单据量', value: 12 },
    { label: '税务业务账务未处理单据量', value: 18 },
    { label: '总账业务账务未处理单据量', value: 20 },
    { label: '内部交易业务账务未处理单据量', value: 18 },
  ],
}

/* ───────────── 下块 · 标准流程合规性情况 ───────────── */

/** 流程标准化率仪表盘 */
export const COMPLIANCE_RATE = { label: '流程标准化率', value: 95 } as const

export const COMPLIANCE_ITEMS: ProcessComplianceItem[] = [
  { label: '非标准化的流程数量', value: '7', unit: '个', icon: 'ri-calendar-close-line' },
  { label: '标准化的流程数量', value: '30', unit: '个', icon: 'ri-shield-check-line' },
]
