import type {
  AdjustItem,
  CompareRow,
  DetailRow,
  DonutArc,
  ImpactRow,
  TaskListRow,
  TaskStat,
  TaskTypeRow,
} from './types'

/** 设计稿尺寸 */
export const TASK_CANVAS = { width: 2400, height: 1080 } as const

/**
 * 四栏骨架：按目标稿（1800 宽）实测边界换算到 2400 画布（系数 1.3333）。
 * 40 + 641 + 21 + 540 + 21 + 551 + 21 + 541 + 23 = 2399
 */
export const TASK_LAYOUT = {
  /** 标题区高度（画布顶 → 面板顶） */
  headerHeight: 79,
  /** 四个面板等高 */
  panelHeight: 972,
  columns: '641px 540px 551px 541px',
  columnGap: 21,
  padLeft: 40,
  padRight: 23,
} as const

export const PLATFORM_TITLE = '共享运营调控平台'
export const PAGE_TITLE = '任务调整'

export const PERIOD = '2026 年 05 月'
export const PERIOD_UNITS = ['日', '月', '年'] as const
export const DEFAULT_PERIOD_UNIT = '月'
export const ORG_OPTIONS = [
  '共享公司',
  '驻区服务部',
  '北部中心',
  '东部中心',
  '西部中心',
  '南部中心',
] as const

/* ───────────────── 当前任务总览 ───────────────── */

export const TASK_STATS: TaskStat[] = [
  { key: 'new', label: '新增', value: 85, tone: 'blue' },
  { key: 'doing', label: '处理中', value: 67, tone: 'orange' },
  { key: 'done', label: '已完成', value: 800, tone: 'green' },
]

export const TASK_TYPE_TOTAL = { value: '1,000', label: '问题总数' } as const

export const TASK_TYPE_ROWS: TaskTypeRow[] = [
  { dimension: '作业管理', count: 100, ratio: '10.0%', color: 'var(--ck-red)' },
  { dimension: '员工管理', count: 100, ratio: '10.0%', color: 'var(--ck-yellow)' },
  { dimension: '员工个人管理', count: 100, ratio: '10.0%', color: 'var(--ck-green)' },
  { dimension: 'RPA管理', count: 100, ratio: '10.0%', color: 'var(--ck-cyan)' },
  { dimension: '规则管理', count: 100, ratio: '10.0%', color: 'var(--ck-blue)' },
  { dimension: '风险管理', count: 100, ratio: '10.0%', color: 'var(--ck-green)' },
  { dimension: '标准流程管理', count: 100, ratio: '10.0%', color: 'var(--ck-cyan)' },
  { dimension: '质量管理', count: 100, ratio: '10.0%', color: 'var(--ck-blue)' },
]

/** 环形图的分段（目标稿是装饰性色环，角度与明细表不等宽） */
export const TASK_TYPE_ARCS: DonutArc[] = [
  { color: 'var(--ck-red)', span: 98 },
  { color: 'var(--ck-yellow)', span: 52 },
  { color: 'var(--ck-green)', span: 78 },
  { color: 'var(--ck-cyan)', span: 38 },
  { color: 'var(--ck-blue)', span: 30 },
  { color: 'var(--ck-purple)', span: 34 },
]

export const TASK_TYPE_COLUMNS = ['管理维度', '任务数量', '占比'] as const

export const TASK_LIST_COLUMNS = ['任务名称', '责任部门', '任务触发时间', '进度', '状态'] as const

export const TASK_LIST_ROWS: TaskListRow[] = [
  {
    name: '待处理单据积压',
    dept: '北部中心运营组',
    triggeredAt: '06-28 18:00',
    progress: 68,
    status: '调整中',
    statusTone: 'blue',
  },
  {
    name: '月末结账延期',
    dept: '总账报表组',
    triggeredAt: '06-29 10:00',
    progress: 42,
    status: '待调整',
    statusTone: 'orange',
  },
  {
    name: '报表出具延迟',
    dept: '报表编制组',
    triggeredAt: '06-29 12:00',
    progress: 55,
    status: '待确认',
    statusTone: 'orange',
  },
  {
    name: '协同退回处理不及时',
    dept: '驻企财务团队',
    triggeredAt: '07-01 18:00',
    progress: 33,
    status: '处理中',
    statusTone: 'cyan',
  },
  {
    name: '单据分配异常',
    dept: '运营管理岗',
    triggeredAt: '06-28 16:00',
    progress: 74,
    status: '已完成',
    statusTone: 'green',
  },
  {
    name: '连续超负荷作业',
    dept: '北部中心',
    triggeredAt: '06-28 20:00',
    progress: 61,
    status: '高风险',
    statusTone: 'red',
  },
  {
    name: '单据分配异常',
    dept: '驻企财务团队',
    triggeredAt: '06-28 20:00',
    progress: 68,
    status: '已完成',
    statusTone: 'green',
  },
  {
    name: '报表出具延迟',
    dept: '总账报表组',
    triggeredAt: '06-28 20:00',
    progress: 68,
    status: '已完成',
    statusTone: 'green',
  },
]

/* ───────────────── 原任务详情 ───────────────── */

export const ORIGIN_DETAIL: DetailRow[] = [
  { label: '任务名称', value: '北部中心待处理单据积压应急处置' },
  { label: '关联事项', value: '待处理单据积压(红灯)' },
  { label: '关联指标', value: '待处理单据量 4982笔(预警阈值4500笔)' },
  { label: '任务来源', value: '待处理单据积压红灯预警' },
  { label: '事件等级', value: '高' },
  { label: '当前影响', value: '北部中心初审环节积压，影响当日作业时效' },
  { label: '创建时间', value: '06-28 08:30' },
  { label: '原始要求', value: '2小时内完成跨中心资源协调及人力急支授' },
]

export const ORIGIN_OWNER: DetailRow[] = [
  { label: '牵头中心', value: '北部中心' },
  { label: '牵头部门', value: '运营组' },
  { label: '负责人', value: '张昊' },
  { label: '协同单位', value: '东部中心、西部中心' },
  { label: '原计划完成时间', value: '06-28 18:00' },
]

export const ORIGIN_PROGRESS = { label: '当前完成率', value: 68 } as const

/* ───────────────── 任务调整 ───────────────── */

export const ADJUST_ITEMS: AdjustItem[] = [
  { label: '责任调整', prefix: '负责人', from: '张昊', to: '李晨', weight: 60 },
  { label: '牵头部门', prefix: '运营部门', to: '运营组', note: '(增加负责人直管)', weight: 60 },
  { label: '协同调整', text: '无', weight: 59 },
  { label: '时间调整', prefix: '完成时限', from: '06/18 18:00', to: '06/18 22:00', weight: 61 },
  {
    label: '范围调整',
    text: '由"全部4982笔"调整为\n优先处理高风险1870笔+待分配1052笔',
    weight: 116,
    gapBefore: true,
  },
  {
    label: '反馈要求',
    text: '每2小时反馈一次进展，\n22:00前提交处置结果与复盘',
    weight: 96,
  },
  {
    label: '调整依据',
    text: '当前任务范围过大，资源与时限不匹配，\n宜优先保障高风险任务清零',
    weight: 115,
  },
]

/* ───────────────── 调整影响确认 ───────────────── */

export const IMPACT_ROWS: ImpactRow[] = [
  {
    icon: 'ri-file-list-3-line',
    label: '预计待处理单据量',
    from: '4982',
    to: '2100',
    fromTone: 'red',
    toTone: 'green',
  },
  {
    icon: 'ri-pie-chart-line',
    label: '预计今日处理完成率',
    from: '68%',
    to: '94%',
    fromTone: 'red',
    toTone: 'green',
  },
  {
    icon: 'ri-alarm-warning-line',
    label: '预计风险等级',
    from: '高',
    to: '中',
    fromTone: 'red',
    toTone: 'orange',
  },
  {
    icon: 'ri-group-line',
    label: '资源变化',
    lines: ['新增工作人员 3人'],
  },
  {
    icon: 'ri-node-tree',
    label: '上下游影响',
    lines: ['降低待分配池压力；', '缓解连续起负荷作业；', '不影响月末结账主线'],
  },
]

export const RISK_TIP = '若22:00后仍高于2500笔，建议自动转"升级额办"'

export const COMPARE_COLUMNS = ['对比项', '调整前', '调整后'] as const

export const COMPARE_ROWS: CompareRow[] = [
  { label: '负责人', before: '张昊', after: '李晨', afterTone: 'green' },
  { label: '完成时限', before: '06/18 18:00', after: '06/18 22:00', afterTone: 'green' },
  { label: '优先级', before: '重要', after: '紧急', afterTone: 'red' },
  {
    label: '任务范围',
    before: '全部4982笔',
    after: '高风险1870笔+待分配1052笔',
    afterTone: 'green',
  },
  {
    label: '反馈要求',
    before: '无明确要求',
    after: '每2小时反馈，22:00前提交结果与复盘',
    afterTone: 'green',
  },
]
