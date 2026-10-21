/** 信用管理监控平台的模拟数据（对应线上截图 `_refs/live/16-信用管理监控平台.png`） */

/** 员工信用分布的一个分档 */
export interface CreditTierItem {
  /** 分档名称，如「高信用人员数量」 */
  label: string
  /** 人数展示文本 */
  value: string
  /** 占比展示文本，带百分号 */
  ratio: string
  /** 环形图上该段实际绘制的弧长占比（照抄截图比例，与 ratio 并不相等） */
  arc: number
  /** 取色用的 CSS 变量名后缀 */
  tone: 'blue' | 'cyan' | 'orange' | 'red'
  /** 是否为高亮选中卡片 */
  active?: boolean
}

/** 扣分单据比例的一个月度数据点 */
export interface CreditDeductPoint {
  month: string
  /** 员工出行单据数 */
  travel: number
  /** 物资采购单据数 */
  purchase: number
  /** 服务业务单据数 */
  service: number
  /** 右轴折线，扣分单据比例，单位 % */
  rate: number
}

/** 申诉趋势的一个月度数据点 */
export interface CreditAppealPoint {
  month: string
  value: number
  /** 数值标签相对折线的位置 */
  labelPosition: 'top' | 'bottom'
}

/** 信用规则变动情况的发光球体 */
export interface CreditRuleSphere {
  /** 数字部分，如「16」 */
  value: string
  /** 单位，如「个」「次」 */
  unit: string
  label: string
  /** 圆心横坐标，基于 520×300 的布局坐标系 */
  cx: number
  /** 圆心纵坐标，基于 520×300 的布局坐标系 */
  cy: number
  /** 半径 */
  r: number
  /** 数字字号 */
  fontSize: number
  /** 是否为中间带底座与环轨的主球 */
  primary?: boolean
}

/** 信用规则明细表的一行 */
export interface CreditRuleRow {
  seq: number
  /** 规则类型，仅在合并区的中间行给出文本 */
  category?: string
  name: string
  /** 优化次数 */
  times: number
}

/* ───────────── 左栏 · 员工信用分布 ───────────── */

/** 环心的严重失信人员占比 */
export const CREDIT_CORE_RATIO = {
  value: '0.57%',
  label: '严重失信人员占比',
} as const

export const CREDIT_TIERS: CreditTierItem[] = [
  { label: '高信用人员数量', value: '1,200', ratio: '68.18%', arc: 54, tone: 'blue' },
  { label: '中信用人员数量', value: '500', ratio: '28.41%', arc: 30, tone: 'cyan' },
  { label: '低信用人员数量', value: '50', ratio: '2.84%', arc: 12, tone: 'orange' },
  { label: '严重失信人员数量', value: '10', ratio: '0.57%', arc: 4, tone: 'red', active: true },
]

/** 环形图自 12 点方向顺时针的绘制顺序：中 → 高 → 严重 → 低 */
export const CREDIT_RING_ORDER: readonly CreditTierItem['tone'][] = [
  'cyan',
  'blue',
  'red',
  'orange',
]

/* ───────────── 左栏 · 扣分单据比例 ───────────── */

/** 面板右上角的单据类型下拉选项 */
export const CREDIT_DEDUCT_FILTERS = ['单据类型', '员工出行', '物资采购', '服务业务'] as const

export const CREDIT_DEDUCT_TREND: CreditDeductPoint[] = [
  { month: '1月', travel: 45, purchase: 34, service: 45, rate: 18 },
  { month: '2月', travel: 45, purchase: 38, service: 45, rate: 16 },
  { month: '3月', travel: 34, purchase: 45, service: 27, rate: 17 },
  { month: '4月', travel: 46, purchase: 34, service: 45, rate: 13 },
  { month: '5月', travel: 56, purchase: 23, service: 10, rate: 14 },
  { month: '6月', travel: 34, purchase: 43, service: 20, rate: 10 },
  { month: '7月', travel: 28, purchase: 33, service: 52, rate: 15 },
]

/* ───────────── 中栏 · 申诉处理情况 ───────────── */

/** 申诉发起总量，单位：个 */
export const CREDIT_APPEAL_TOTAL: CreditAppealPoint[] = [
  { month: '1月', value: 50, labelPosition: 'top' },
  { month: '2月', value: 60, labelPosition: 'top' },
  { month: '3月', value: 40, labelPosition: 'top' },
  { month: '4月', value: 50, labelPosition: 'top' },
  { month: '5月', value: 60, labelPosition: 'top' },
  { month: '6月', value: 70, labelPosition: 'top' },
  { month: '7月', value: 20, labelPosition: 'top' },
]

/** 申诉通过数量，单位：% */
export const CREDIT_APPEAL_PASSED: CreditAppealPoint[] = [
  { month: '1月', value: 0.7, labelPosition: 'bottom' },
  { month: '2月', value: 0.92, labelPosition: 'top' },
  { month: '3月', value: 0.96, labelPosition: 'top' },
  { month: '4月', value: 0.94, labelPosition: 'top' },
  { month: '5月', value: 0.92, labelPosition: 'top' },
  { month: '6月', value: 0.89, labelPosition: 'top' },
  { month: '7月', value: 0.97, labelPosition: 'top' },
]

/** 申诉通过率，单位：% */
export const CREDIT_APPEAL_RATE: CreditAppealPoint[] = [
  { month: '1月', value: 0.24, labelPosition: 'bottom' },
  { month: '2月', value: 0.29, labelPosition: 'top' },
  { month: '3月', value: 0.33, labelPosition: 'top' },
  { month: '4月', value: 0.31, labelPosition: 'top' },
  { month: '5月', value: 0.29, labelPosition: 'top' },
  { month: '6月', value: 0.23, labelPosition: 'bottom' },
  { month: '7月', value: 0.3, labelPosition: 'top' },
]

/* ───────────── 右栏 · 信用规则全生命周期管理 ───────────── */

export const CREDIT_RULE_SPHERES: CreditRuleSphere[] = [
  { value: '4', unit: '个', label: '规则停用数', cx: 256, cy: 70, r: 50, fontSize: 24 },
  { value: '16', unit: '个', label: '规则在用数', cx: 98, cy: 146, r: 52, fontSize: 24 },
  {
    value: '5',
    unit: '个',
    label: '规则新增数',
    cx: 254,
    cy: 172,
    r: 73,
    fontSize: 30,
    primary: true,
  },
  { value: '6', unit: '次', label: '规则优化次数', cx: 414, cy: 170, r: 52, fontSize: 24 },
]

/** 规则明细表右上角的下拉选项 */
export const CREDIT_RULE_FILTERS = [
  '半年内规则优化次数',
  '一年内规则优化次数',
  '全部规则优化次数',
] as const

export const CREDIT_RULE_COLUMNS = ['序号', '规则类型', '规则名称', '优化次数'] as const

/** 明细表顶部的总量行 */
export const CREDIT_RULE_TOTAL = { label: '总量', value: '2400' } as const

export const CREDIT_RULE_ROWS: CreditRuleRow[] = [
  { seq: 1, name: '发票信息错误', times: 6 },
  { seq: 2, name: '发票信息缺失', times: 9 },
  { seq: 3, name: '发票缺失签章或签章不正确', times: 10 },
  { seq: 4, name: '发票漏传', times: 12 },
  { seq: 5, category: '发票问题', name: '发票错传', times: 5 },
  { seq: 6, name: '发票重传导致结算金额错误', times: 6 },
  { seq: 7, name: '发票影像模糊、遮盖等', times: 1 },
  { seq: 8, name: '电子增值税专票非OFD格式', times: 2 },
  { seq: 9, name: '电子普通发票非原件', times: 6 },
]

/** 明细表进度条的满格基准 */
export const CREDIT_RULE_TIMES_MAX = 12
