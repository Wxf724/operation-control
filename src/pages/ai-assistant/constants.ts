import type {
  AiVerdictRow,
  AltPlan,
  CurrentIssue,
  DiagnosisModel,
  FactorNode,
  FactorTone,
  IssueRow,
  KeyIndicator,
  PlanRow,
} from './types'

/** 画布尺寸与模块平台页保持一致，跨页缩放比相同 */
export const AI_ASSISTANT_CANVAS = { width: 2400, height: 1080 } as const

export const PAGE_TITLE = '智能运营调控'

/* ───────────── 第一栏 · 问题整体展示 ───────────── */

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

/* ───────────── 第二栏 · 问题诊断模型 ───────────── */

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

/* ───────────── 第三栏上 · 模型一因子评价关系图 ───────────── */

export const FACTOR_GRAPH_TITLE = '模型一因子评价关系图'

/** 中心菱形文案 */
export const FACTOR_CENTER = '模型评价'

export const FACTOR_LEGEND: { text: string; tone: FactorTone }[] = [
  { text: '主要因子', tone: 'major' },
  { text: '次要因子', tone: 'minor' },
  { text: '无关因子', tone: 'none' },
]

/**
 * 16 个因子节点，按参考稿的实际落点整理成极坐标。
 *
 * 参考稿的环不是正圆：角度疏密不均、半径也有远近（越近中心表示离主判定越近），
 * 这里逐个记下来，而不是用 `360 / n` 均分，否则画面会失去原稿的节奏。
 * 顺序按屏幕上的顺时针方向，从左上角起。
 */
export const FACTOR_NODES: FactorNode[] = [
  { label: '复杂任务占比', tone: 'none', angle: -117.3, radius: 1.0 },
  { label: 'RPA运行成功率', tone: 'none', angle: -97.4, radius: 1.0 },
  { label: '任务分配规则状态', tone: 'minor', angle: -81.3, radius: 0.77 },
  { label: 'RPA可用数量', tone: 'none', angle: -63.9, radius: 0.97 },
  { label: '任务流入速率', tone: 'major', angle: -44.7, radius: 0.98 },
  { label: '有效作业时长', tone: 'none', angle: -23.7, radius: 1.01 },
  { label: '零时任务占比(协同、挂起等)', tone: 'none', angle: -3.1, radius: 0.94 },
  { label: '人均小时处理量', tone: 'none', angle: 25.1, radius: 0.82 },
  { label: '接口平均响应时间', tone: 'minor', angle: 49.1, radius: 0.8 },
  { label: '退工回流任务量', tone: 'minor', angle: 69.4, radius: 0.76 },
  { label: 'RPA单台小时产能', tone: 'none', angle: 90, radius: 0.89 },
  { label: 'CPU占用率', tone: 'none', angle: 114.4, radius: 0.64 },
  { label: '核心网络可用状态', tone: 'none', angle: 133.7, radius: 0.88 },
  { label: '任务分配不均衡度', tone: 'none', angle: 163.4, radius: 0.87 },
  { label: '实际在岗人数', tone: 'none', angle: 189, radius: 1.0 },
  { label: '内存占用率', tone: 'none', angle: 215.6, radius: 0.98 },
]

/* ───────────── 第三栏下 · 推荐方案 ───────────── */

export const PLAN_TITLE = '推荐方案'
export const PLAN_DETAIL_BUTTON = '模型详情'

export const PLAN_MAIN_TITLE = '智能运营调控推荐方案'
export const PLAN_ALT_TITLE = '智能运营调控备选方案'

/** 推荐方案卡顶部的高亮条 */
export const PLAN_HEADLINE: PlanRow = { label: '具体方案：', value: '增加RPA数量' }

export const PLAN_ROWS: PlanRow[] = [
  { label: '预计效果：', value: '预计处理4,500笔单据' },
  { label: '预警积压值：', value: '13,000笔单据' },
  { label: '管理目标：', value: '12,000笔单据' },
  { label: '策略风险：', value: '中等风险:人工确认后可执行' },
  { label: '策略评分：', value: '综合评分48.15' },
  { label: '系统影响：', value: '低' },
  { label: '其他影响：', value: '无' },
]

const ALT_PLAN_NOTE = '执行系统待确认 · 需要审批'

export const ALT_PLANS: AltPlan[] = ['人员调峰', '人工提效', '延长人工工作时长', '跨中心支援'].map(
  (name, i) => ({ index: i + 1, name, note: ALT_PLAN_NOTE })
)

export const ALT_PLAN_COUNT_TEXT = `${ALT_PLANS.length}个入选策略`

/* ───────────── 第四栏 · AI 助手 ───────────── */

export const AI_PANEL_TITLE = 'AI助手'

export const AI_QUESTION = '请问当前单据积压主要是在哪个业务流程环节？'

export const AI_AGENT = { name: 'AI助手', status: '已思考完毕' } as const

export const AI_INTRO = '根据当前模型诊断结果，待处理单据量>12000笔，且决策树判定如下：'

export const AI_VERDICT_ROWS: AiVerdictRow[] = [
  { label: '待分配单据量', verdict: '异常', threshold: '（>1000笔）' },
  { label: '待处理单据量(总量)', verdict: '异常', threshold: '（>20000笔）' },
  { label: '挂起单据量', verdict: '异常', threshold: '（>50笔）' },
  { label: '动态单据负载率', verdict: '异常', threshold: '（>100%）' },
  { label: '单据分配均衡度', verdict: '异常', threshold: '（<70%）' },
]

export const AI_SUMMARY_LEAD = '综合来看，当前单据积压主要集中在：'

export const AI_CONCLUSION = {
  title: '制证环节(财务处理环节)',
  reason: '原因:制证环节的待处理单据量远超阈值，动态负载率超过100%，是导致整体积压的核心瓶颈环节',
} as const

export const AI_SUGGEST_TITLE = '建议措施：'

export const AI_SUGGESTIONS = [
  '优先调配具备制证技能的人员支援',
  '检查制证规则与系统响应是否正常',
  '必要时启动跨中心制证人员支援机制',
]

export const AI_INPUT_PLACEHOLDER = '请输入信息或上传影像'
