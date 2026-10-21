/** 服务管理平台的模拟数据（对应参考截图 `_refs/live/17-服务管理平台.png`） */

/** 各图表共用的月份坐标 */
export const SERVICE_MONTHS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月']

/** 环形容器里的一段弧 */
export interface ServiceRingSlice {
  label: string
  value: number
  /** CSS 颜色表达式，直接给内联 SVG 用 */
  color: string
}

/* ───────────── 服务情况 ───────────── */

/** 完成咨询总量（人工） */
export const SERVICE_CONSULT_TOTAL = 1_000

/** 完成咨询总量（AI 客服） */
export const SERVICE_AI_CONSULT_TOTAL = 950

/** 转人工率 */
export const SERVICE_TRANSFER_RATE = 5

/** AI 客服转人工会话率（个） */
export const SERVICE_TRANSFER_SESSIONS = 50

/** 首次响应超时次数（人工） */
export const SERVICE_TIMEOUT_TIMES = 9

/** 转人工率环形图的两段 */
export const SERVICE_TRANSFER_RING: ServiceRingSlice[] = [
  { label: '转人工率', value: SERVICE_TRANSFER_RATE, color: 'var(--ck-green)' },
  { label: '其余', value: 100 - SERVICE_TRANSFER_RATE, color: 'var(--ck-blue)' },
]

/** 平均问题解决时长（小时） */
export interface ServiceMonthPoint {
  month: string
  value: number
}

/** 平均问题解决时长折线 */
export const SERVICE_RESOLVE_HOURS: ServiceMonthPoint[] = [
  { month: '1月', value: 3.9 },
  { month: '2月', value: 4.2 },
  { month: '3月', value: 5.7 },
  { month: '4月', value: 5.0 },
  { month: '5月', value: 4.4 },
  { month: '6月', value: 4.0 },
  { month: '7月', value: 5.2 },
]

/* ───────────── 服务水平协议履约情况 ───────────── */

/** 服务指标达成量（个） */
export const SERVICE_SLA_ACHIEVED = 263

/** 单项达成率（仪表盘） */
export const SERVICE_SLA_GAUGE = 93.8

/** 综合达成率里的一个分项 */
export interface ServiceRateItem {
  label: string
  value: number
  tone: 'green' | 'blue'
}

/** 两条综合达成率 */
export const SERVICE_SLA_RATES: ServiceRateItem[] = [
  { label: '分项业务处理质量达成率', value: 96, tone: 'green' },
  { label: '业务处理时效综合达成率', value: 95, tone: 'blue' },
]

/** 服务企业数量 */
export const SERVICE_ENTERPRISE_COUNT = 29

/** 当月服务收入金额（万元） */
export const SERVICE_REVENUE_MONTH = 2_200

/** 服务收入同比 */
export const SERVICE_REVENUE_YOY = '+8.00%'

/** 服务收入月度金额（万元） */
export const SERVICE_REVENUE_BARS: ServiceMonthPoint[] = [
  { month: '1月', value: 2_500 },
  { month: '2月', value: 3_000 },
  { month: '3月', value: 2_600 },
  { month: '4月', value: 2_400 },
  { month: '5月', value: 2_200 },
  { month: '6月', value: 2_450 },
  { month: '7月', value: 2_360 },
]

/** 服务收费回款率 */
export const SERVICE_COLLECT_RATE = 88.6

/** 服务收费已回款金额（万元） */
export const SERVICE_COLLECTED = 7_740

/** 服务收入未回款金额（万元） */
export const SERVICE_UNCOLLECTED = 1_000

/** 服务收费回款率环形图的两段 */
export const SERVICE_COLLECT_RING: ServiceRingSlice[] = [
  { label: '已回款', value: SERVICE_COLLECT_RATE, color: 'var(--ck-blue)' },
  { label: '未回款', value: 100 - SERVICE_COLLECT_RATE, color: 'var(--ck-yellow)' },
]

/* ───────────── 客户体验与满意度情况 ───────────── */

/** 随单评价占比（五星评价） */
export const SERVICE_ORDER_RATE = 97

/** 随单评价总量 */
export const SERVICE_ORDER_TOTAL = 1_000

/** 随单评价环形图的两段 */
export const SERVICE_ORDER_RING: ServiceRingSlice[] = [
  { label: '五星评价', value: SERVICE_ORDER_RATE, color: 'var(--ck-cyan)' },
  { label: '其余', value: 100 - SERVICE_ORDER_RATE, color: 'var(--ck-blue)' },
]

/** 工单服务满意度评分里的一档星级 */
export interface ServiceStarRow {
  /** 星数 1–5 */
  stars: number
  count: number
}

/** 工单服务满意度评分：五星到一星的评价量 */
export const SERVICE_STAR_ROWS: ServiceStarRow[] = [
  { stars: 5, count: 970 },
  { stars: 4, count: 20 },
  { stars: 3, count: 6 },
  { stars: 2, count: 2 },
  { stars: 1, count: 2 },
]

/** 非常满意占比 */
export const SERVICE_SATISFIED_RATE = 97

/** 非常满意环形图的两段 */
export const SERVICE_SATISFIED_RING: ServiceRingSlice[] = [
  { label: '非常满意', value: SERVICE_SATISFIED_RATE, color: 'var(--ck-green)' },
  { label: '其余', value: 100 - SERVICE_SATISFIED_RATE, color: 'transparent' },
]

/** 满意度表情分布里的一档 */
export interface ServiceMoodRow {
  /** 表情符号 */
  emoji: string
  count: number
}

/** 工单服务满意度表情分布 */
export const SERVICE_MOOD_ROWS: ServiceMoodRow[] = [
  { emoji: '😍', count: 970 },
  { emoji: '🙂', count: 20 },
  { emoji: '😐', count: 6 },
  { emoji: '☹️', count: 2 },
  { emoji: '😡', count: 2 },
]

/** 客户满意度问卷评分 */
export const SERVICE_SURVEY_SCORE = 96

/** 用户投诉总量 */
export const SERVICE_COMPLAINT_TOTAL = 6

/** 用户投诉月度分布（个） */
export const SERVICE_COMPLAINT_BARS: ServiceMonthPoint[] = [
  { month: '1月', value: 2 },
  { month: '2月', value: 0 },
  { month: '3月', value: 1 },
  { month: '4月', value: 2 },
  { month: '5月', value: 0 },
  { month: '6月', value: 0 },
  { month: '7月', value: 1 },
]
