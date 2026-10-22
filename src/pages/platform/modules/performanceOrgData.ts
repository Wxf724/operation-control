/** 绩效管理平台组织切换数据：共享公司、山东公司派驻组 */

/* ───────────── 共享公司组（深色主题） ───────────── */

/** 作业情况·数量情况：1～7月单据接收量、完成量、完成率 */
export const SHARED_DOC_TREND = [
  { month: '1月', received: 8.5, completed: 8.1, rate: 95.3 },
  { month: '2月', received: 9.2, completed: 8.8, rate: 95.7 },
  { month: '3月', received: 10.0, completed: 9.6, rate: 96.0 },
  { month: '4月', received: 11.5, completed: 11.0, rate: 95.7 },
  { month: '5月', received: 12.8, completed: 12.5, rate: 97.7 },
  { month: '6月', received: 13.5, completed: 13.2, rate: 97.8 },
  { month: '7月', received: 14.0, completed: 13.8, rate: 98.6 },
]

/** 作业情况·平均天数：六条进度 */
export interface SharedDurationItem {
  label: string
  /** 小时 */
  value: number
}

export const SHARED_DURATION_ITEMS: SharedDurationItem[] = [
  { label: '最迟响应服务', value: 2.0 },
  { label: '资产业务', value: 1.5 },
  { label: '成本业务', value: 1.0 },
  { label: '费用业务', value: 1.2 },
  { label: '资金业务', value: 1.8 },
  { label: '收入业务', value: 1.6 },
]

/** 作业质量情况·驻企财务：平均提报率、平均提及率两图各7月 + 月结数据汇总三行 */
export const SHARED_RESIDENT_REPORT_RATE = [
  { month: '1月', value: 91.5 },
  { month: '2月', value: 92.3 },
  { month: '3月', value: 93.0 },
  { month: '4月', value: 94.2 },
  { month: '5月', value: 95.0 },
  { month: '6月', value: 95.8 },
  { month: '7月', value: 96.5 },
]

export const SHARED_RESIDENT_MENTION_RATE = [
  { month: '1月', value: 88.0 },
  { month: '2月', value: 89.5 },
  { month: '3月', value: 90.2 },
  { month: '4月', value: 91.8 },
  { month: '5月', value: 92.5 },
  { month: '6月', value: 93.0 },
  { month: '7月', value: 94.2 },
]

export const SHARED_MONTH_SUMMARY = [
  { label: '平均提报率', value: '240', unit: '笔' },
  { label: '平均不及格人数', value: '240', unit: '笔' },
  { label: '卷首中心', value: '240', unit: '笔' },
]

/** 作业质量情况·时长情况：月度通过达标率环70% + 下方四块带百分比 */
export const SHARED_QUALITY_PASS_RATE = 70

export interface SharedDurationBlock {
  label: string
  value: string
  percent: number
}

export const SHARED_DURATION_BLOCKS: SharedDurationBlock[] = [
  { label: '审批时长', value: '5', percent: 85 },
  { label: '处理时长', value: '5', percent: 92 },
  { label: '响应时长', value: '5', percent: 78 },
  { label: '结算时长', value: '5', percent: 88 },
]

/** 作业质量情况·驻企情况：九宫格三行，各三列99.0%/98.5%/99.2% */
export interface SharedResidentRow {
  title: string
  col1: number
  col2: number
  col3: number
}

export const SHARED_RESIDENT_GRID: SharedResidentRow[] = [
  { title: '黄金超程方案', col1: 99.0, col2: 98.5, col3: 99.2 },
  { title: '分类报备方案', col1: 98.8, col2: 99.0, col3: 98.7 },
  { title: '客户验货方案', col1: 99.1, col2: 98.9, col3: 99.3 },
]

/* ───────────── 山东公司派驻组（浅色主题） ───────────── */

/** 作业质量管理情况·双柱+折线：1～7月，最高25k */
export const SHANDONG_QUALITY_TREND = [
  { month: '1月', bar1: 18000, bar2: 16500, line: 91.7 },
  { month: '2月', bar1: 19500, bar2: 17800, line: 91.3 },
  { month: '3月', bar1: 21000, bar2: 19200, line: 91.4 },
  { month: '4月', bar1: 22500, bar2: 20800, line: 92.4 },
  { month: '5月', bar1: 24000, bar2: 22500, line: 93.8 },
  { month: '6月', bar1: 23500, bar2: 22000, line: 93.6 },
  { month: '7月', bar1: 25000, bar2: 23800, line: 95.2 },
]

/** 作业质量管理情况·三环：申报通关量100% / 处报通关量100% / 提单通过率100% */
export const SHANDONG_THREE_RINGS = [
  { label: '月末申报通关量', value: 100 },
  { label: '月处报通关量', value: 100 },
  { label: '服务提单通过率', value: 100 },
]

/** 作业质量管理情况（续）·两个多线图：分月服务处理质量达成率 + 服务企业协同满意结绐情况，各1～7月四条线 */
export const SHANDONG_SERVICE_QUALITY_LINES = [
  { month: '1月', line1: 88.5, line2: 90.2, line3: 89.8, line4: 91.0 },
  { month: '2月', line1: 89.0, line2: 90.8, line3: 90.5, line4: 91.5 },
  { month: '3月', line1: 90.5, line2: 91.5, line3: 91.0, line4: 92.0 },
  { month: '4月', line1: 91.2, line2: 92.0, line3: 91.8, line4: 92.8 },
  { month: '5月', line1: 92.0, line2: 93.0, line3: 92.5, line4: 93.5 },
  { month: '6月', line1: 92.8, line2: 93.5, line3: 93.0, line4: 94.0 },
  { month: '7月', line1: 93.5, line2: 94.2, line3: 93.8, line4: 94.5 },
]

export const SHANDONG_SATISFACTION_LINES = [
  { month: '1月', line1: 85.0, line2: 87.5, line3: 86.2, line4: 88.0 },
  { month: '2月', line1: 86.5, line2: 88.0, line3: 87.0, line4: 89.0 },
  { month: '3月', line1: 87.5, line2: 89.5, line3: 88.5, line4: 90.0 },
  { month: '4月', line1: 88.0, line2: 90.0, line3: 89.0, line4: 90.5 },
  { month: '5月', line1: 89.5, line2: 91.0, line3: 90.0, line4: 91.5 },
  { month: '6月', line1: 90.0, line2: 91.5, line3: 90.5, line4: 92.0 },
  { month: '7月', line1: 91.0, line2: 92.5, line3: 91.5, line4: 93.0 },
]

/** 作业质量管理情况（续）·四环：市场增收量2.00% / 在工场格服务量2.00% / 在工雷改功2.00% / 杂务2.00% */
export const SHANDONG_FOUR_RINGS = [
  { label: '市场增收量', value: 2.0 },
  { label: '在工场格服务量', value: 2.0 },
  { label: '在工雷改功', value: 2.0 },
  { label: '杂务：住宅、鲁术等', value: 2.0 },
]

/** 报表税收兑现情况·成本费用应答情况：柱状图金额200万元绿色95.0% + 两个进度条 */
export const SHANDONG_COST_RESPONSE = {
  amount: 200,
  percent: 95.0,
  progressBars: [
    { label: '成本费用項税落实率', value: 95.0 },
    { label: '各类目指标验货率', value: 95.0 },
  ],
}

/** 报表税收兑现情况·信值税成兑现情况：环形98.00% + 三块卡片 */
export const SHANDONG_VAT_REALIZATION = {
  ringValue: 98.0,
  cards: [
    { label: '费银宽环验所总量', value: '370', unit: '笔' },
    { label: '费目夹实兑现验所', value: '250', unit: '笔' },
    { label: '夹目整成', value: '20', unit: '笔' },
  ],
}

/** 报表税收兑现情况·银行客户情况：两个立体座 + 环形仪表盘91% */
export const SHANDONG_BANK_CUSTOMER = {
  pedestals: [
    { label: '银行账户资薪数', value: '100', unit: '笔' },
    { label: '银行账户广告金', value: '20', unit: '笔' },
  ],
  gauge: { label: '资金直查率', value: 91 },
}

/** 清欠情况：本企费用总金额2,000万元 + 六行卡片（无需中心等）+ 四列柱状图 */
export const SHANDONG_DEBT_CLEARANCE = {
  totalAmount: '2,000',
  centers: [
    { name: '无需中心', amount: '5,000.0' },
    { name: '西部中心', amount: '5,000.0' },
    { name: '南部中心', amount: '5,000.0' },
    { name: '北部中心', amount: '5,000.0' },
    { name: '云指中心', amount: '5,000.0' },
    { name: '外部中心', amount: '5,000.0' },
  ],
  chartData: [
    { category: '类别1', bar1: 3500, bar2: 4200, bar3: 3800, bar4: 4500 },
    { category: '类别2', bar1: 4000, bar2: 3800, bar3: 4200, bar4: 3900 },
    { category: '类别3', bar1: 3200, bar2: 4500, bar3: 3600, bar4: 4100 },
    { category: '类别4', bar1: 4500, bar2: 3500, bar3: 4300, bar4: 3700 },
  ],
}
