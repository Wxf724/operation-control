import type {
  FeedbackStat,
  StrategyStat,
  TaskFeedbackRow,
  WarningChip,
  WarningDetail,
} from './types'

/** 平台页设计稿尺寸（与任务调整/政策分析两页一致） */
export const PLATFORM_CANVAS = { width: 2400, height: 1080 } as const

export const PERIOD_RANGE = { start: '2026-10-01', end: '2026-10-19' } as const
export const ORG_OPTIONS = [
  '共享公司',
  '驻区服务部',
  '北部中心',
  '东部中心',
  '西部中心',
  '南部中心',
  // 追加在末尾：绩效页按它切到派驻组那组面板，且不打乱前面选项的下标
  '山东公司派驻组',
] as const

/** KPI 卡默认同比 */
export const DEFAULT_DELTA = '+8.00%'

/* ───────────── 右栏 · AI 调控策略（13 个平台页共用） ───────────── */

export const STRATEGY_STATS: StrategyStat[] = [
  { label: '红灯预警', value: '2', tone: 'red' },
  { label: '黄灯预警', value: '8', tone: 'orange' },
  { label: '模型调度个数', value: '15', tone: 'cyan' },
  { label: '模型调度次数', value: '88', tone: 'cyan' },
]

export const WARNING_CHIPS: WarningChip[] = [
  {
    text: '待处理任务积压量过大',
    status: '处理中',
    statusTone: 'orange',
    icon: 'ri-progress-4-line',
  },
  { text: '协同退单偏高', status: '待处理', statusTone: 'red', icon: 'ri-alarm-warning-line' },
  {
    text: '业务处理质量不达标',
    status: '已处理',
    statusTone: 'green',
    icon: 'ri-checkbox-circle-line',
  },
  { text: '问题4', status: '待处理', statusTone: 'red', icon: 'ri-alarm-warning-line' },
  { text: '问题5', status: '已处理', statusTone: 'green', icon: 'ri-checkbox-circle-line' },
  { text: '问题6', status: '处理中', statusTone: 'orange', icon: 'ri-progress-4-line' },
  { text: '问题7', status: '待处理', statusTone: 'red', icon: 'ri-alarm-warning-line' },
]

export const WARNING_DETAILS: WarningDetail[] = [
  { label: '问题编号', value: '0001' },
  { label: '预警等级', value: '黄灯', tone: 'orange' },
  {
    label: '问题描述',
    value: '业务处理质量不达标－业务处理准确率当前为99.2%，业务处理准确率偏低',
  },
  {
    label: 'AI调控策略',
    value:
      '系统自动向相关业务组组长推送"张三 业务处理准确率偏低（当前99.2%）"，提示关注该人员作业质量，组长需进行谈话提醒',
  },
  { label: '建议处理人', value: '张三' },
  { label: '字段6', value: '数据6' },
  { label: '字段7', value: '数据7' },
]

/* ───────────── 右栏 · 调控执行反馈（13 个平台页共用） ───────────── */

export const FEEDBACK_STATS: FeedbackStat[] = [
  { label: '下发任务量', value: '5', icon: 'ri-send-plane-line' },
  { label: '待处理任务量', value: '2', icon: 'ri-user-shared-line' },
  { label: '已执行任务量', value: '3', icon: 'ri-task-line' },
]

export const TASK_FEEDBACK_COLUMNS = [
  '任务编号',
  '问题编号',
  '任务描述',
  '责任人',
  '时限',
  '完成情况',
] as const

export const TASK_FEEDBACK_ROWS: TaskFeedbackRow[] = [
  {
    taskNo: '00001',
    issueNo: '00001',
    description:
      '业务处理质量不达标－系统自动向相关业务组组长推送"张三 业务处理准确率偏低（当前99.2%）"，提示关注该人员作业质量，组长需进行谈话提醒',
    owner: '张三',
    deadline: '2026/05/31',
    status: '待处理',
    statusTone: 'red',
  },
  {
    taskNo: '00002',
    issueNo: '00002',
    description:
      '待办单据堆积偏高－系统自动向个人及分中心运营组组长推送"张三待办单据量较高（当前60笔）"，提示加快处理，组长需在2小时内确认是否需协调资源',
    owner: '张三',
    deadline: '2026/05/31',
    status: '已处理',
    statusTone: 'green',
  },
  {
    taskNo: '00003',
    issueNo: '00003',
    description: '协同退单偏高－当前协同退单率高于标准值，需核查退单原因并反馈改进措施',
    owner: '李四',
    deadline: '2026/05/31',
    status: '已处理',
    statusTone: 'green',
  },
  {
    taskNo: '00004',
    issueNo: '00004',
    description:
      '月末结账延期－系统监测到结账节点较计划延后，已向分中心结账负责人推送催办，需在次日 12:00 前反馈延期原因与补救计划',
    owner: '王五',
    deadline: '2026/06/02',
    status: '待处理',
    statusTone: 'red',
  },
  {
    taskNo: '00005',
    issueNo: '00005',
    description:
      '作业负载过大－当前小组人均在办单据量超出阈值，建议跨中心调配 2 名处理人并下调新单派发权重',
    owner: '赵六',
    deadline: '2026/06/05',
    status: '已处理',
    statusTone: 'green',
  },
  {
    taskNo: '00006',
    issueNo: '00006',
    description:
      '月末结账延期－本期结账进度落后计划 1.5 天，需在今日 18:00 前完成未制证凭证的集中处理',
    owner: '孙七',
    deadline: '2026/06/08',
    status: '处理中',
    statusTone: 'orange',
  },
  {
    taskNo: '00007',
    issueNo: '00007',
    description:
      '报表出具不及时－管理口径主报表出具及时率低于阈值，需核查数据源刷新链路并补发延迟报表',
    owner: '周八',
    deadline: '2026/06/10',
    status: '待处理',
    statusTone: 'red',
  },
  {
    taskNo: '00008',
    issueNo: '00008',
    description:
      '单据操作异常－近 7 日同一账号重复撤回单据 12 次，需核实操作原因并开展规范化操作培训',
    owner: '吴九',
    deadline: '2026/06/12',
    status: '已处理',
    statusTone: 'green',
  },
]
