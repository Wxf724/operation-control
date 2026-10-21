import type { JobIconStat } from './jobData'

/**
 * 风险管理平台的模拟数据（对应 `_refs/live/59-风险管理平台-目标稿.png`）。
 *
 * 目标稿是深色版，这里只取**结构与数值**，配色一律走浅蓝白主题变量。
 */

/** 左栏的大环形指标 */
export interface RiskRingItem {
  label: string
  /** 0–100 */
  value: number
  /** 环形渐变起止色，写成 `var(--ck-*)`，SVG 能直接解析 */
  from: string
  to: string
}

/** 驾驶舱概览数字 */
export interface RiskOverviewStat {
  label: string
  value: string
  unit?: string
  /** 较昨日的变化，已带符号 */
  delta: string
  /** 箭头方向；`up` 画上扬红、`down` 画回落绿 */
  trend: 'up' | 'down'
}

/** 风险类型分布的一条横条 */
export interface RiskTypeItem {
  name: string
  value: string
  /** 占比，0–100 */
  pct: number
  colorVar: string
}

/** 重大风险预警列表的一行 */
export interface RiskAlertRow {
  unit: string
  type: string
  level: '重大风险' | '高风险'
  time: string
}

/** 风险闭环流程总览的一个节点 */
export interface RiskFlowStep {
  label: string
  value: string
  icon: string
}

/* ───────────── 左栏 · 通用系统风险监控 ───────────── */

export const RISK_SYSTEM_RINGS: RiskRingItem[] = [
  { label: '网络连通成功率', value: 89.0, from: 'var(--ck-teal)', to: 'var(--ck-cyan)' },
  { label: '服务可用率', value: 89.0, from: 'var(--ck-blue)', to: 'var(--ck-cyan)' },
]

export const RISK_FAULT_CARDS: JobIconStat[] = [
  {
    label: '系统累计故障时长',
    value: '0.3',
    unit: '小时',
    icon: 'ri-time-line',
    colorVar: '--ck-blue',
  },
  {
    label: '系统累计故障次数',
    value: '2',
    unit: '次',
    icon: 'ri-alarm-warning-line',
    colorVar: '--ck-cyan',
  },
]

/* ───────────── 左栏 · 业务流程风险监控 ───────────── */

/** 偏离率属于负向指标，按目标稿走预警橙 */
export const RISK_PROCESS_RINGS: RiskRingItem[] = [
  { label: '流程配置合规率', value: 98.0, from: 'var(--ck-teal)', to: 'var(--ck-cyan)' },
  { label: '流程偏离率', value: 5.0, from: 'var(--ck-yellow)', to: 'var(--ck-orange)' },
]

/* ───────────── 右栏 · 风险防控平台风险驾驶 ───────────── */

export const RISK_COCKPIT_TITLE = '风险管控与智慧监管驾驶舱'

export const RISK_COCKPIT_TABS = [
  '首页驾驶舱',
  '智慧监管视图',
  '模型运行分析',
  '风险整改闭环',
  '规则中心',
  '六库管理',
]

export const RISK_OVERVIEW_STATS: RiskOverviewStat[] = [
  { label: '风险总量', value: '18,652', unit: '条', delta: '-8.42%', trend: 'down' },
  { label: '重大风险数', value: '236', unit: '条', delta: '+12.04%', trend: 'up' },
  { label: '高风险单位数', value: '87', unit: '家', delta: '+5.45%', trend: 'up' },
  { label: '风险金额', value: '28,642.35', unit: '万元', delta: '-7.38%', trend: 'down' },
  { label: '整改完成率', value: '76.38', unit: '%', delta: '+4.21%', trend: 'up' },
  { label: '逾期整改数', value: '312', unit: '条', delta: '+18.79%', trend: 'up' },
  { label: '监管线索移交数', value: '124', unit: '条', delta: '+9.82%', trend: 'up' },
]

export const RISK_TYPE_DIST: RiskTypeItem[] = [
  { name: '资金风险', value: '6,821', pct: 36.6, colorVar: '--ck-cyan' },
  { name: '税务风险', value: '4,152', pct: 22.3, colorVar: '--ck-blue' },
  { name: '合同风险', value: '3,205', pct: 17.2, colorVar: '--ck-teal' },
  { name: '合规管理风险', value: '2,844', pct: 15.2, colorVar: '--ck-purple' },
  { name: '信用履约风险', value: '1,278', pct: 6.9, colorVar: '--ck-green' },
  { name: '其他风险', value: '270', pct: 1.4, colorVar: '--ck-orange' },
]

/** 风险趋势分析（近 30 天，按 3 日一档取点） */
export const RISK_TREND = {
  days: ['04-14', '04-17', '04-20', '04-23', '04-26', '04-29', '05-02', '05-05', '05-08', '05-13'],
  clues: [5200, 5860, 5410, 6320, 6880, 6410, 7260, 7840, 7320, 8160],
  autoWarn: [3400, 3980, 3620, 4310, 4760, 4420, 5080, 5460, 5120, 5720],
  investigate: [1180, 1420, 1260, 1580, 1740, 1610, 1890, 2060, 1940, 2210],
  legend: ['风险线索数', '自动预警数', '进入调查线索'],
} as const

/** 穿透式监管覆盖情况：逐层级的覆盖率 */
export const RISK_PENETRATION = {
  levels: ['三级及以下单位', '子公司', '分公司', '集团总部'],
  rates: [88.4, 96.2, 100, 100],
} as const

export const RISK_MAJOR_ALERTS: RiskAlertRow[] = [
  { unit: '华北建设集团', type: '资金风险', level: '重大风险', time: '05-13 09:45' },
  { unit: '东部物流公司', type: '合同风险', level: '重大风险', time: '05-13 09:23' },
  { unit: '西部供应链公司', type: '税务风险', level: '高风险', time: '05-13 09:06' },
  { unit: '南方科技发展公司', type: '合规风险', level: '高风险', time: '05-13 08:53' },
  { unit: '中部商贸公司', type: '履约风险', level: '高风险', time: '05-13 08:41' },
]

export const RISK_FLOW_STEPS: RiskFlowStep[] = [
  { label: '风险识别', value: '18,652', icon: 'ri-search-eye-line' },
  { label: '风险评估', value: '15,821', icon: 'ri-scales-3-line' },
  { label: '规则校验', value: '12,743', icon: 'ri-shield-check-line' },
  { label: '预警推送', value: '9,432', icon: 'ri-notification-badge-line' },
  { label: '整改处置', value: '6,321', icon: 'ri-tools-line' },
  { label: '闭环归档', value: '1,832', icon: 'ri-archive-2-line' },
]

export const RISK_COCKPIT_NOTE =
  '示意版面：线上此处为内嵌的第三方「风险管控与智慧监管驾驶舱」，本页仅还原版面比例与关键指标口径，不作明细查询入口。'
