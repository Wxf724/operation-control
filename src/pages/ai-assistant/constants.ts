import type { CurrentIssue, DiagnosisModel, IssueRow, KeyIndicator, TreeBranch } from './types'

/** 画布尺寸与模块平台页保持一致，跨页缩放比相同 */
export const AI_ASSISTANT_CANVAS = { width: 2400, height: 1080 } as const

export const PAGE_TITLE = '智能运营调控'

/* ───────────── 左栏 · 问题整体展示 ───────────── */

export const LEVEL_FILTER_OPTIONS = ['全部等级', '红灯', '黄灯', '绿灯'] as const

export const ISSUE_COLUMNS = ['问题编号', '预警等级', '监控场景'] as const

export const ISSUE_ROWS: IssueRow[] = [
  { no: '0001', level: 'red', levelText: '红灯', scene: '待办单据积压' },
  { no: '0002', level: 'yellow', levelText: '黄灯', scene: '月末结账延期' },
  { no: '0003', level: 'yellow', levelText: '黄灯', scene: '报表出具不及时' },
  { no: '0004', level: 'yellow', levelText: '黄灯', scene: '协同退单长期搁置' },
  { no: '0005', level: 'yellow', levelText: '黄灯', scene: '单据操作异常' },
  { no: '0006', level: 'yellow', levelText: '黄灯', scene: '任务分配异常' },
  { no: '0007', level: 'yellow', levelText: '黄灯', scene: '作业负载过大' },
]

/* ───────────── 中栏 · 问题诊断模型 ───────────── */

export const CURRENT_ISSUE: CurrentIssue = {
  no: '00001',
  level: 'red',
  levelText: '红灯',
  description: '代办单据积压，待处理单据量>12000笔',
}

export const DIAGNOSIS_MODEL: DiagnosisModel = {
  name: '各环节待处理任务积压量异常预警模型',
  code: 'M-OPR-02-001',
  version: 'V2.1',
  icon: 'ri-robot-2-line',
}

export const MODEL_DEFINITION =
  '通过监控财务各业务环节的分配单据量、待处理单据量及其趋势维度，计具单位时间内的任务长率与处理效率，识别待处理任务是否存在异常积压现象。'

export const KEY_INDICATORS: KeyIndicator[] = [
  { label: '待分配单据量较处理单据量比率偏高度', icon: 'ri-pie-chart-2-line' },
  { label: '人均小时产量', icon: 'ri-speed-up-line' },
  { label: '当前在岗人数比率', icon: 'ri-group-line' },
  { label: '剩余有效处理时长', icon: 'ri-timer-2-line' },
]

export const MODEL_SCORE = '92.3分'
export const MODEL_VERDICT = '代办单据积压'

/* ───────────── 右栏 · 模型决策树 ───────────── */

export const TREE_LEGEND = [
  { text: '正常', tone: 'normal' },
  { text: '预警', tone: 'warn' },
  { text: '异常', tone: 'abnormal' },
] as const

export const TREE_ROOT = {
  title: '代办单据积压',
  sub: '(待处理单据量>12000 笔)',
} as const

const CONDITION = '是否超时\n预警阈值?'

/** 5 条分支：指标节点 → 菱形判断 → 否/是 两条路径 → 判定结果 */
export const TREE_BRANCHES: TreeBranch[] = [
  '待分配单据量',
  '待处理单据量\n(总量)',
  '挂起单据量',
  '动态单据负债率',
  '单据分配均衡度',
].map((label, i) => ({
  label,
  condition: CONDITION,
  leaves: [
    {
      branch: '否',
      threshold: '(<=1000笔)',
      verdictTitle: `判定${i + 1}:`,
      verdictText: '单据量正常',
      tone: 'normal',
    },
    {
      branch: '是',
      threshold: '(>1000笔)',
      verdictTitle: `判定${i + 1}:`,
      verdictText: '单据量异常',
      tone: 'abnormal',
    },
  ],
}))
