/** 规则管理平台的模拟数据（对应线上截图 `_refs/live/13-规则管理平台.png`） */

/** 带底座图标的数字卡 */
export interface RuleStatCard {
  label: string
  value: string
  unit: string
  icon: string
}

/** 带进度条的比率项 */
export interface RuleRateItem {
  label: string
  /** 进度条取值 0–100 */
  value: number
  /** 展示文本，带百分号 */
  display: string
  tone: 'blue' | 'green'
}

/** 业务场景明细行：序号 / 业务大类 / 业务场景 / 智能 / 人工 */
export interface RuleSceneRow {
  seq: number
  category: string
  scene: string
  smart: number
  manual: number
}

/** 柱+折线的月度数据点 */
export interface RuleTrendPoint {
  month: string
  /** 下方亮色柱 */
  primary: number
  /** 上方深色柱（堆叠增量） */
  secondary: number
  /** 右轴折线，单位 % */
  rate: number
}

/** 零触发规则场景分布 */
export interface RuleZeroScene {
  label: string
  value: number
}

/** 迭代优化的双环指标 */
export interface RuleIterationItem {
  title: string
  total: string
  smart: number
  manual: number
}

/* ───────────── 规则覆盖度管理 ───────────── */

export const RULE_COVERAGE_STATS: RuleStatCard[] = [
  { label: '智能审核规则数', value: '200', unit: '个', icon: 'ri-file-list-3-line' },
  { label: '人工审核规则数', value: '1,200', unit: '个', icon: 'ri-pie-chart-2-line' },
  { label: '规则停用数', value: '80', unit: '个', icon: 'ri-file-forbid-line' },
]

export const RULE_COVERAGE_RATES: RuleRateItem[] = [
  { label: '智能审核规则占比', value: 83.3, display: '83.3%', tone: 'blue' },
  { label: '审核规则有效命中率', value: 90, display: '90%', tone: 'green' },
]

export const RULE_COVERAGE_COLUMNS = [
  '序号',
  '业务大类',
  '业务场景',
  '智能审核规则数',
  '人工审核规则数',
] as const

export const RULE_COVERAGE_ROWS: RuleSceneRow[] = [
  { seq: 1, category: '费用', scene: '员工出行', smart: 32, manual: 30 },
  { seq: 2, category: '费用', scene: '员工福利及劳务', smart: 40, manual: 38 },
  { seq: 3, category: '费用', scene: '物资采购', smart: 27, manual: 25 },
  { seq: 4, category: '资金', scene: '收款业务', smart: 26, manual: 24 },
  { seq: 5, category: '资金', scene: '资产变更', smart: 30, manual: 28 },
  { seq: 6, category: '税费', scene: '税金计算', smart: 49, manual: 45 },
]

/* ───────────── 规则调用情况 ───────────── */

export const RULE_CALL_STATS: RuleStatCard[] = [
  { label: '智能审核规则调用次数', value: '1,000', unit: '次', icon: 'ri-file-search-line' },
  { label: '人工审核规则调用次数', value: '320', unit: '次', icon: 'ri-user-search-line' },
]

export const RULE_CALL_COLUMNS = [
  '序号',
  '业务大类',
  '业务场景',
  '智能审核规则调用次数',
  '人工审核规则调用次数',
] as const

export const RULE_CALL_ROWS: RuleSceneRow[] = [
  { seq: 1, category: '费用', scene: '员工出行', smart: 32, manual: 8 },
  { seq: 2, category: '费用', scene: '员工福利及劳务', smart: 40, manual: 10 },
  { seq: 3, category: '费用', scene: '物资采购', smart: 27, manual: 7 },
  { seq: 4, category: '资金', scene: '收款业务', smart: 26, manual: 12 },
  { seq: 5, category: '资金', scene: '资产变更', smart: 30, manual: 9 },
  { seq: 6, category: '税费', scene: '税金计算', smart: 49, manual: 5 },
]

export const RULE_ZERO_TRIGGER = {
  label: '半年内零触发规则数',
  value: '50',
  /** 环形填充比例 0–100 */
  ratio: 50,
  scenes: [
    { label: '员工出行', value: 8 },
    { label: '员工福利及劳务', value: 5 },
    { label: '物资采购', value: 9 },
    { label: '收款业务', value: 7 },
  ] as RuleZeroScene[],
} as const

/* ───────────── 规则命中有效性管理 ───────────── */

/** 审核规则有效命中率：智能/人工命中次数堆叠柱 + 有效命中率折线 */
export const RULE_HIT_EFFECT: RuleTrendPoint[] = [
  { month: '1月', primary: 95, secondary: 17, rate: 95 },
  { month: '2月', primary: 93, secondary: 73, rate: 93 },
  { month: '3月', primary: 93, secondary: 63, rate: 94 },
  { month: '4月', primary: 97, secondary: 23, rate: 98 },
  { month: '5月', primary: 94, secondary: 52, rate: 95 },
]

/** 审核规则命中场景覆盖率：命中场景数/业务场景数堆叠柱 + 覆盖率折线 */
export const RULE_SCENE_COVERAGE: RuleTrendPoint[] = [
  { month: '1月', primary: 3, secondary: 12, rate: 30 },
  { month: '2月', primary: 8, secondary: 12, rate: 8 },
  { month: '3月', primary: 5, secondary: 40, rate: 11 },
  { month: '4月', primary: 5, secondary: 30, rate: 12 },
  { month: '5月', primary: 6, secondary: 59, rate: 9 },
]

/* ───────────── 规则迭代优化管理 ───────────── */

export const RULE_ITERATION: RuleIterationItem[] = [
  { title: '规则优化次数', total: '30', smart: 23, manual: 7 },
  { title: '半年内规则优化次数', total: '20', smart: 15, manual: 5 },
  { title: '规则停用后异常触发次数', total: '5', smart: 4, manual: 1 },
]
