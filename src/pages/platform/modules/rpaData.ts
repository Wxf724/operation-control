/** RPA 管理平台中间业务区的模拟数据（对应线上截图 `_refs/live/12-RPA管理平台.png`） */

/* ───────────── 规划与覆盖情况 ───────────── */

/** 「RPA数量」里的单个数字 */
export interface RpaCountStat {
  label: string
  value: string
  unit: string
}

/** RPA 总数 / 领用机器人 / 定时机器人 */
export const RPA_COUNTS: RpaCountStat[] = [
  { label: 'RPA总数', value: '263', unit: '个' },
  { label: '领用机器人数量', value: '39', unit: '个' },
  { label: '定时机器人数量', value: '224', unit: '个' },
]

/** 按业务环节拆分的机器人数量（分组柱状图一条） */
export interface RpaStageBotRow {
  stage: string
  /** 领用机器人数量 */
  claimed: number
  /** 定时机器人数量 */
  scheduled: number
}

/** 各环节领用 / 定时机器人数量，单位：个 */
export const RPA_STAGE_BOTS: RpaStageBotRow[] = [
  { stage: '初审', claimed: 65, scheduled: 88 },
  { stage: '复审', claimed: 60, scheduled: 117 },
  { stage: '制证', claimed: 140, scheduled: 60 },
  { stage: '审核', claimed: 69, scheduled: 30 },
  { stage: '资金A点', claimed: 99, scheduled: 20 },
  { stage: '资金C点', claimed: 144, scheduled: 40 },
]

/** 「RPA上线类型分布」表格一行 */
export interface RpaTypeRow {
  index: number
  /** 作业 / 非作业 */
  type: string
  /** 业务大类 */
  category: string
  /** 业务场景 */
  scene: string
  count: string
  taskVolume: string
  autoRate: string
}

/** RPA 上线类型分布明细 */
export const RPA_TYPE_ROWS: RpaTypeRow[] = [
  {
    index: 1,
    type: '作业',
    category: '资金',
    scene: '收款业务',
    count: '500',
    taskVolume: '23,000',
    autoRate: '89%',
  },
  {
    index: 2,
    type: '非作业',
    category: '资金',
    scene: '资产变更',
    count: '500',
    taskVolume: '23,000',
    autoRate: '89%',
  },
  {
    index: 3,
    type: '作业',
    category: '资金',
    scene: '员工福利及劳务',
    count: '500',
    taskVolume: '23,000',
    autoRate: '89%',
  },
  {
    index: 4,
    type: '作业',
    category: '费用',
    scene: '资产变更',
    count: '500',
    taskVolume: '23,000',
    autoRate: '89%',
  },
  {
    index: 5,
    type: '非作业',
    category: '费用',
    scene: '员工福利及劳务',
    count: '500',
    taskVolume: '23,000',
    autoRate: '89%',
  },
  {
    index: 6,
    type: '作业',
    category: '费用',
    scene: '员工出行',
    count: '500',
    taskVolume: '23,000',
    autoRate: '89%',
  },
]

/* ───────────── 运行情况 ───────────── */

/** RPA 运行状态月度趋势 */
export interface RpaRunTrendPoint {
  month: string
  /** RPA 在线运行数量，单位：个 */
  online: number
  /** RPA 启用率，单位：% */
  enableRate: number
}

/** 近 5 个月 RPA 在线运行数量与启用率 */
export const RPA_RUN_TREND: RpaRunTrendPoint[] = [
  { month: '1月', online: 540, enableRate: 90 },
  { month: '2月', online: 490, enableRate: 82 },
  { month: '3月', online: 640, enableRate: 95 },
  { month: '4月', online: 390, enableRate: 90 },
  { month: '5月', online: 490, enableRate: 95 },
]

/** 运行状态下方的三个切换页签 */
export const RPA_RUN_TABS = ['RPA在线运行数量', 'RPA异常停用数量', '待处理单据量'] as const

/** 环形小卡：某个环节的一个数值 */
export interface RpaStageRing {
  stage: string
  value: number
  /** CSS 变量名，用于环的描边色 */
  tone: string
}

/** 三个页签各自对应的 6 个环节环形小卡 */
export const RPA_RUN_RINGS: RpaStageRing[][] = [
  [
    { stage: '初审', value: 42, tone: '--ck-green' },
    { stage: '复审', value: 42, tone: '--ck-blue' },
    { stage: '制证', value: 63, tone: '--ck-pink' },
    { stage: '审核', value: 61, tone: '--ck-blue' },
    { stage: '付款A点', value: 1, tone: '--ck-yellow' },
    { stage: '付款C点', value: 2, tone: '--ck-blue' },
  ],
  [
    { stage: '初审', value: 6, tone: '--ck-green' },
    { stage: '复审', value: 4, tone: '--ck-blue' },
    { stage: '制证', value: 9, tone: '--ck-pink' },
    { stage: '审核', value: 7, tone: '--ck-blue' },
    { stage: '付款A点', value: 1, tone: '--ck-yellow' },
    { stage: '付款C点', value: 1, tone: '--ck-blue' },
  ],
  [
    { stage: '初审', value: 128, tone: '--ck-green' },
    { stage: '复审', value: 96, tone: '--ck-blue' },
    { stage: '制证', value: 143, tone: '--ck-pink' },
    { stage: '审核', value: 131, tone: '--ck-blue' },
    { stage: '付款A点', value: 12, tone: '--ck-yellow' },
    { stage: '付款C点', value: 16, tone: '--ck-blue' },
  ],
]

/** RPA 作业情况月度趋势 */
export interface RpaTaskTrendPoint {
  month: string
  /** RPA 执行成功单据量 */
  success: number
  /** RPA 执行失败单据量 */
  fail: number
  /** RPA 单据处理成功率，单位：% */
  rate: number
}

/** 近 5 个月 RPA 单据执行结果与成功率 */
export const RPA_TASK_TREND: RpaTaskTrendPoint[] = [
  { month: '1月', success: 35000, fail: 17000, rate: 82 },
  { month: '2月', success: 44000, fail: 23000, rate: 88 },
  { month: '3月', success: 35000, fail: 18000, rate: 80 },
  { month: '4月', success: 33000, fail: 15500, rate: 78 },
  { month: '5月', success: 36500, fail: 18000, rate: 85 },
]

/** RPA 转人工率大环形图及其旁边的两个数字 */
export const RPA_MANUAL = {
  /** 转人工率，单位：% */
  rate: 5,
  handled: '50',
  untouched: '1,000',
} as const

/* ───────────── 贡献情况 ───────────── */

/** 贡献情况的两个切换页签 */
export const RPA_CONTRIB_TABS = ['RPA作业任务处理量', 'RPA非作业任务处理量'] as const

/** 效率提升贡献率仪表盘读数，单位：% */
export const RPA_CONTRIB_GAUGE = 91

/** 某个环节的节约工时与效率提升 */
export interface RpaContribStage {
  stage: string
  /** 节约工时，单位：小时 */
  hours: string
  /** 提升效率，单位：% */
  efficiency: string
}

/** 两个页签各自对应的 6 个环节贡献明细 */
export const RPA_CONTRIB_STAGES: RpaContribStage[][] = [
  [
    { stage: '初审', hours: '200', efficiency: '80.0%' },
    { stage: '复审', hours: '200', efficiency: '80.0%' },
    { stage: '制证', hours: '200', efficiency: '80.0%' },
    { stage: '审核', hours: '200', efficiency: '80.0%' },
    { stage: '付款A点', hours: '200', efficiency: '80.0%' },
    { stage: '付款C点', hours: '200', efficiency: '80.0%' },
  ],
  [
    { stage: '初审', hours: '150', efficiency: '72.0%' },
    { stage: '复审', hours: '160', efficiency: '74.0%' },
    { stage: '制证', hours: '180', efficiency: '76.0%' },
    { stage: '审核', hours: '140', efficiency: '70.0%' },
    { stage: '付款A点', hours: '120', efficiency: '66.0%' },
    { stage: '付款C点', hours: '130', efficiency: '68.0%' },
  ],
]

/** 贡献情况底部箭头色带的分段配色（CSS 变量名） */
export const RPA_CONTRIB_BAND_TONES = [
  '--ck-cyan',
  '--ck-cyan',
  '--ck-blue',
  '--ck-blue',
  '--ck-purple',
  '--ck-purple',
] as const
