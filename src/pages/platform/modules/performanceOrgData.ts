/**
 * 绩效管理平台「共享公司」「山东公司派驻组」两组视图的静态数据。
 *
 * 字段与数值逐格对照参考稿填写，稿面上留空的单元格这里也保持空串。
 */

/** 两组视图的折线/柱图统一用 1–7 月 */
export const PERF_MONTHS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月'] as const

/** 四个中心在图例里的固定顺序与配色 */
export const PERF_CENTERS = ['东部中心', '西部中心', '南部中心', '北部中心'] as const
export const PERF_CENTER_TONES = ['cyan', 'green', 'purple', 'blue'] as const
export type CenterTone = (typeof PERF_CENTER_TONES)[number]

/** 带色点的图例行：名称 + 数值文本 +（可选）右侧迷你条占比 */
export interface LegendRow {
  name: string
  valueText: string
  /** 0–100，给出时在右侧画一截竖纹迷你条 */
  percent?: number
}

/** 四个中心配同一个数值时的图例快捷构造 */
function centerLegend(values: readonly string[], percents?: readonly number[]): LegendRow[] {
  return PERF_CENTERS.map((name, i) => ({
    name,
    valueText: values[i] ?? '',
    percent: percents?.[i],
  }))
}

/* ═══════════════════ 共享公司 ═══════════════════ */

/** 效率管理情况 ▸ 数量情况-中心：三个指标 + 月度混合图 + 平均单据产能底座 */
export const SHARED_QTY_CENTER = {
  cards: [
    { label: '单据接收量', value: '39', unit: '万笔' },
    { label: '单据完成量', value: '39', unit: '万笔' },
    { label: '单据完成率', value: '80.0%', unit: '' },
  ],
  dropdown: '平均单据产能',
  pedestal: { label: '平均单据产能', value: '240', unit: '' },
  legend: centerLegend(['240', '240', '240', '240']),
} as const

/** 效率管理情况 ▸ 数量情况-驻企团队：两个指标 + 三列表 */
export const SHARED_QTY_TEAM = {
  cards: [
    { label: '单据完成量', value: '40,500', unit: '笔' },
    { label: '月末结账申请单待提交量', value: '27', unit: '笔' },
  ],
  head: ['驻企团队名称', '单据完成量', '结账申请单据数量'],
  rows: [
    { label: '汇总', cells: ['40,500', '27'] },
    { label: '山东公司派驻组', cells: ['', ''] },
    { label: '北方管道公司派驻组', cells: ['', ''] },
    { label: '东北公司派驻组', cells: ['', ''] },
  ],
} as const

/** 效率管理情况 ▸ 时长情况-中心：底座 + 七项费用条 + 月度结账及时率环 */
export const SHARED_DUR_CENTER = {
  pedestal: { label: '单据平均处理时长', value: '2', unit: '小时' },
  legend: centerLegend(['2.0 小时', '2.0 小时', '2.0 小时', '2.0 小时']),
  bars: [
    { label: '物资采购', hours: 1.0 },
    { label: '员工福利及劳务', hours: 2.0 },
    { label: '燃动力及水电气', hours: 1.5 },
    { label: '党工团活动', hours: 1.5 },
    { label: '会议、培训、集中办公', hours: 1.5 },
    { label: '员工出行', hours: 1.5 },
    { label: '场地设备等租赁', hours: 1.5 },
  ],
  dropdown: '月度结账及时率',
  ring: { label: '月度结账及时率', value: 70.0 },
  ringLegend: centerLegend(['80.0%', '60.0%', '60.0%', '60.0%']),
} as const

/** 效率管理情况 ▸ 时长情况-驻企团队：两个指标 + 三列表 */
export const SHARED_DUR_TEAM = {
  cards: [
    { label: '单据平均处理时长', value: '5', unit: '小时' },
    { label: '报表出具及时率', value: '95.0%', unit: '' },
  ],
  head: ['驻企团队名称', '单据流转时长', '报表上报及时率'],
  rows: [
    { label: '平均', cells: ['5', '95.0%'] },
    { label: '山东公司派驻组', cells: ['5', '95.0%'] },
    { label: '北方管道公司派驻组', cells: ['5', '95.0%'] },
    { label: '东北公司派驻组', cells: ['5', '95.0%'] },
  ],
} as const

/** 质量管理情况 ▸ 中心：全流程业务处理质量底座 + 四中心带条图例 */
export const SHARED_QUAL_CENTER = {
  pedestal: { label: '全流程业务处理质量', value: '90.0%', unit: '' },
  legend: centerLegend(['80.0%', '60.0%', '60.0%', '60.0%'], [80, 60, 60, 60]),
} as const

/** 质量管理情况 ▸ 报表编制准确率：四中心折线（数据在 chartOptions 里） */
export const SHARED_QUAL_REPORT_LEGEND = [...PERF_CENTERS] as const

/** 质量管理情况 ▸ 驻企团队：三环 + 四列表 */
export const SHARED_QUAL_TEAM = {
  rings: [
    { label: '全流程业务处理质量', value: 99.0 },
    { label: '分项业务处理质量达成率', value: 98.5 },
    { label: '业务跨期量', value: 99.2 },
  ],
  head: ['驻企团队名称', '全流程业务处理质量', '业务处理准确率', '业务跨期挂报率'],
  rows: [
    { label: '平均', cells: ['99.0%', '98.5%', '99.2%'] },
    { label: '山东公司派驻组', cells: ['99.0%', '98.5%', '99.2%'] },
    { label: '北方管道公司派驻组', cells: ['99.0%', '98.5%', '99.2%'] },
    { label: '东北公司派驻组', cells: ['99.0%', '98.5%', '99.2%'] },
  ],
} as const

/** 服务企业情况：成本费用总额底座 + 企业明细表 + 预算执行准确率环 */
export const SHARED_SERVICE = {
  pedestal: { label: '成本费用总额', value: '20,000.0', unit: '万元' },
  legend: centerLegend(['5,000.0 万元', '5,000.0 万元', '5,000.0 万元', '5,000.0 万元']),
  head: ['', '万元', ''],
  rows: [
    '山东公司派驻组',
    '北方管道公司派驻组',
    '东北公司派驻组',
    '东部原油储运有限公司…',
    '建设项目管理公司派驻…',
    '华中公司派驻组',
  ],
  ring: { label: '成本费用预算执行准确率', value: 70.0 },
  ringLegend: centerLegend(['80.0%', '60.0%', '60.0%', '60.0%']),
} as const

/** 服务满意度情况：问卷评分底座 + 四中心条 / 投诉总量底座 + 四中心条 */
export const SHARED_SATISFACTION = {
  score: { label: '客户满意度问卷评分', value: '95', unit: '' },
  scoreLegend: centerLegend(['95', '80', '75', '90'], [95, 80, 75, 90]),
  complaint: { label: '用户投诉总量', value: '10', unit: '' },
  complaintLegend: centerLegend(['1', '4', '2', '3'], [25, 100, 50, 75]),
} as const

/* ═══════════════ 山东公司派驻组 ═══════════════ */

/** 作业效率管理情况 ▸ 驻企财务审批单据情况统计（柱+折线，数据在 chartOptions） */
export const SHANDONG_EFF_APPROVAL = {
  resident: [11, 14, 16, 18, 19, 20, 21],
  rate: [14, 15, 16, 17, 18, 18.5, 19],
} as const

/** 作业效率管理情况 ▸ 驻企财务管理团队结账处理时长：待提交量 + 三环 */
export const SHANDONG_EFF_TEAM = {
  banner: { label: '月末结账申请单待提交量', value: '1', unit: '笔' },
  rings: [
    { label: '月末结账申请单提交完成率', value: 100 },
    { label: '月末结账申请单提交及时率', value: 100 },
    { label: '报表出具及时率', value: 100 },
  ],
} as const

/** 作业质量管理情况 ▸ 服务企业业务处理质量：分项达成率折线 */
export const SHANDONG_QUAL_SUBITEM = {
  title: '分项业务处理质量达成率',
  data: [90.0, 86.0, 91.0, 96.0, 89.0, 88.0, 94.0],
} as const

/** 作业质量管理情况 ▸ 服务企业跨年制单情况：环 + 五项费用 */
export const SHANDONG_QUAL_CROSS_YEAR = {
  ring: { label: '业务跨期量', value: 2.0 },
  rows: [
    { label: '物资采购', valueText: '2.00%' },
    { label: '员工福利及劳务', valueText: '2.00%' },
    { label: '燃动力及水电气', valueText: '2.00%' },
    { label: '党工团活动', valueText: '2.00%' },
    { label: '会议、培训、集中办公、公务招待', valueText: '2.00%' },
  ],
} as const

/** 作业质量管理情况 ▸ 服务企业协同退单情况：环 + 两张小卡 */
export const SHANDONG_QUAL_RETURN = {
  ring: { label: '协同退单率', value: 2.0 },
  cards: [
    { label: '协同单据量', value: '150', unit: '张' },
    { label: '退回单据量', value: '20', unit: '张' },
  ],
} as const

/** 作业质量管理情况 ▸ 服务企业内部交易对账情况：准确率折线 */
export const SHANDONG_QUAL_RECONCILE = {
  title: '内部交易对账准确率',
  data: [90.0, 86.0, 91.0, 96.0, 89.0, 88.0, 94.0],
} as const

/** 服务企业情况 ▸ 公司成本预算执行情况：两个指标 + 准确率柱图 */
export const SHANDONG_COST_BUDGET = {
  cards: [
    { label: '成本费用总额', value: '200', unit: '万元' },
    { label: '成本费用预算完成率', value: '95.0%', unit: '' },
  ],
  chartTitle: '成本费用预算执行准确率',
} as const

/** 服务企业情况 ▸ 增值税退税完成情况：环 + 两张小卡 */
export const SHANDONG_VAT = {
  ring: { label: '增值税退税完成率', value: 98.0 },
  cards: [
    { label: '增值税退税预算完成率', value: '98.0%' },
    { label: '增值税应退尽退完成率', value: '98.0%' },
  ],
} as const

/** 服务企业情况 ▸ 公司资金预算执行情况：资金预算准确率折线 + 悬浮三项 */
export const SHANDONG_FUND_BUDGET = {
  chartTitle: '资金预算准确率',
  tooltip: [
    { label: '经营支出资金预算准确率', value: '96.8%' },
    { label: '投资支出资金预算准确率', value: '96.8%' },
    { label: '经营流入资金预算准确率', value: '96.8%' },
  ],
} as const

/**
 * 服务企业情况 ▸ 滞纳金情况：处罚笔数 + 本企业滞纳金（含罚款）月度金额。
 *
 * 稿面原图此处是「图形没有数据」的空状态，现按 1–7 月补齐金额序列（单位：万元）。
 */
export const SHANDONG_LATE_FEE = {
  banner: { label: '税收滞纳金处罚', value: '1', unit: '笔' },
  detail: { label: '本企业税收滞纳金（含罚款）', unit: '万元' },
  /** 本企业税收滞纳金（含罚款）逐月金额，单位万元，柱顶标数值 */
  monthly: [12584.0, 10607.0, 14818.0, 16007.0, 16853.0, 17760.0, 18404.0],
} as const

/** 服务企业情况 ▸ 银行账户管控情况：四项图标卡 + 银企直联率仪表 */
export const SHANDONG_BANK = {
  stats: [
    { icon: 'ri-bank-card-line', label: '银行账户新增数量', value: '100', unit: '家' },
    { icon: 'ri-close-circle-line', label: '银行账户销户数量', value: '20', unit: '家' },
    { icon: 'ri-bank-line', label: '银行账户数量', value: '1,000', unit: '家' },
    { icon: 'ri-time-line', label: '180天以上无动态银行账户数量', value: '20', unit: '家' },
  ],
  gauge: { label: '银企直联率', value: 91 },
} as const
