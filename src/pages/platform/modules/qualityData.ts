/** 质量管理平台的模拟数据（对应 `_refs/live/15-质量管理平台.png`） */

/** 月度「抽样总量 + 抽样比率」双轴数据的一个分页签 */
export interface SamplingTab {
  /** 页签文案，如「凭证」 */
  label: string
  /** 月度数据：总量（笔）与抽样比率（%） */
  data: { month: string; total: number; rate: number }[]
}

/** 稽核覆盖与抽样情况：凭证 / 报表 / 档案 三个页签 */
export const QUALITY_SAMPLING_TABS: SamplingTab[] = [
  {
    label: '凭证',
    data: [
      { month: '1月', total: 19200, rate: 67 },
      { month: '2月', total: 19000, rate: 78 },
      { month: '3月', total: 18900, rate: 75 },
      { month: '4月', total: 19000, rate: 85 },
      { month: '5月', total: 19200, rate: 83 },
      { month: '6月', total: 20100, rate: 89 },
      { month: '7月', total: 21000, rate: 71 },
    ],
  },
  {
    label: '报表',
    data: [
      { month: '1月', total: 9800, rate: 55 },
      { month: '2月', total: 10500, rate: 60 },
      { month: '3月', total: 11200, rate: 58 },
      { month: '4月', total: 10800, rate: 66 },
      { month: '5月', total: 11500, rate: 64 },
      { month: '6月', total: 12200, rate: 70 },
      { month: '7月', total: 12800, rate: 62 },
    ],
  },
  {
    label: '档案',
    data: [
      { month: '1月', total: 6200, rate: 42 },
      { month: '2月', total: 6800, rate: 47 },
      { month: '3月', total: 7100, rate: 45 },
      { month: '4月', total: 6900, rate: 52 },
      { month: '5月', total: 7400, rate: 50 },
      { month: '6月', total: 7800, rate: 56 },
      { month: '7月', total: 8100, rate: 48 },
    ],
  },
]

/** 稽核过程与效率情况的一个分页签 */
export interface EfficiencyTab {
  /** 页签文案，如「凭证稽核完成量」 */
  label: string
  /** 左上角单位说明 */
  unit: string
  /** Y 轴最大值 */
  max: number
  /** Y 轴刻度间隔 */
  interval: number
  /** 月度数值 */
  data: { month: string; value: number }[]
}

/** 稽核过程与效率情况：凭证稽核完成量 / 稽核平均处理时长 */
export const QUALITY_EFFICIENCY_TABS: EfficiencyTab[] = [
  {
    label: '凭证稽核完成量',
    unit: '单位：笔',
    max: 1200,
    interval: 200,
    data: [
      { month: '1月', value: 790 },
      { month: '2月', value: 820 },
      { month: '3月', value: 910 },
      { month: '4月', value: 918 },
      { month: '5月', value: 840 },
      { month: '6月', value: 820 },
      { month: '7月', value: 960 },
    ],
  },
  {
    label: '稽核平均处理时长',
    unit: '单位：分钟',
    max: 12,
    interval: 2,
    data: [
      { month: '1月', value: 7.2 },
      { month: '2月', value: 6.8 },
      { month: '3月', value: 6.1 },
      { month: '4月', value: 5.6 },
      { month: '5月', value: 5.9 },
      { month: '6月', value: 5.2 },
      { month: '7月', value: 5 },
    ],
  },
]

/** 业务处理质量情况：大环形 + 三行数量明细 */
export const QUALITY_BUSINESS = {
  /** 全流程业务处理质量（%） */
  qualityRate: 90,
  /** 明细列的表头单位 */
  unitLabel: '数量（笔）',
  rows: [
    { label: '业务跨期量', value: '500' },
    { label: '账务调整量', value: '100' },
    { label: '资金支付错误单据量', value: '32' },
  ],
} as const

/** 业务处理差错情况：问题凭证数量大环形 + 分类明细 */
export const QUALITY_ERROR = {
  /** 环心数值：问题凭证数量 */
  total: '340',
  /** 环形填充比例（%） */
  ratio: 76,
  /** 分类明细，`active` 为截图里高亮的那一行 */
  items: [
    { label: '物资采购', value: '52', active: true },
    { label: '生产物料', value: '10', active: false },
    { label: '办公用品', value: '12', active: false },
    { label: '劳保用品', value: '8', active: false },
    { label: '工具、电器及其他物品（2000元以下）', value: '6', active: false },
    { label: '医疗用品', value: '2', active: false },
    { label: '专业技术图书资料、报刊杂志', value: '5', active: false },
    { label: '其他低值易耗品', value: '3', active: false },
  ],
} as const

/** 申诉与争议：月度堆叠柱（已解决 / 未解决）+ 解决率折线 */
export const QUALITY_APPEAL_TREND = [
  { month: '1月', resolved: 78, unresolved: 10, rate: 68 },
  { month: '2月', resolved: 70, unresolved: 13, rate: 86 },
  { month: '3月', resolved: 103, unresolved: 6, rate: 67 },
  { month: '4月', resolved: 78, unresolved: 4, rate: 73 },
  { month: '5月', resolved: 58, unresolved: 22, rate: 87 },
  { month: '6月', resolved: 68, unresolved: 8, rate: 70 },
  { month: '7月', resolved: 80, unresolved: 8, rate: 85 },
]

/** 申诉与争议管理情况的汇总指标 */
export const QUALITY_APPEAL = {
  /** 申诉平均处理时长 */
  avgDuration: '8',
  avgDurationUnit: '分钟',
  /** 申诉通过率（%） */
  passRate: 5.71,
  /** 三个数字卡 */
  cards: [
    { label: '申诉发起总量', value: '370', color: 'var(--ck-purple)' },
    { label: '申诉未通过量', value: '250', color: 'var(--ck-blue)' },
    { label: '申诉通过量', value: '20', color: 'var(--ck-green)' },
  ],
  /** 底部申诉驳回量条 */
  reject: { label: '申诉驳回量', value: '245', percent: 66 },
} as const

/** 整改与规则转化情况 */
export const QUALITY_RECTIFY = {
  stats: [
    { label: '按期整改完成单据数量', value: '200', color: 'var(--ck-blue)' },
    { label: '超期未整改问题数量', value: '30', color: 'var(--ck-orange)' },
  ],
  /** 问题整改及时率（%） */
  timelyRate: 80,
  /** 规则转化率（%） */
  convertRate: '90.0',
  /** 右下角圆形按钮文案 */
  buttonLabel: '整改率',
} as const
