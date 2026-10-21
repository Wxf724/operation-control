import type { ChartVarName } from '@/components/cockpit-ui'

/** 折线图的一条序列：名称 + 取色变量 + 七个月的数值 */
export interface SystemLineSeries {
  name: string
  colorVar: ChartVarName
  data: number[]
}

/** 环形/球形指标：标签（`\n` 换行）、百分比值、展示文本、取色变量 */
export interface SystemRateItem {
  label: string
  value: number
  display: string
  colorVar: string
}

/** 图标 + 数字 + 单位的横向卡片 */
export interface SystemPlateStat {
  icon: string
  label: string
  value: string
  unit: string
}

/** 「标题在上、数字在下」的底座数字 */
export interface SystemPedestalStat {
  label: string
  value: string
  unit: string
}

/** 彩色半圆仪表盘 */
export interface SystemSupportGauge {
  label: string
  value: number
}

/** 两个折线图共用的 X 轴月份 */
export const SYSTEM_MONTHS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月'] as const

/* ───────────── 系统基础资源监控 ───────────── */

/** 网络连通成功率 / 数据库连接池使用率 */
export const SYSTEM_RESOURCE_RINGS: SystemRateItem[] = [
  { label: '网络连通\n成功率', value: 99, display: '99.0%', colorVar: '--ck-green' },
  { label: '数据库连接池\n使用率', value: 80, display: '80.0%', colorVar: '--ck-green' },
]

/** 慢 SQL 数与网络往返时延 */
export const SYSTEM_RESOURCE_STATS: SystemPlateStat[] = [
  { icon: 'ri-database-2-line', label: '数据库慢SQL数', value: '1', unit: '条' },
  { icon: 'ri-global-line', label: '网络往返时延', value: '10', unit: 'ms' },
]

/** 服务器 CPU / 磁盘 / 内存使用率趋势 */
export const SYSTEM_RESOURCE_SERIES: SystemLineSeries[] = [
  {
    name: '服务器CPU使用率',
    colorVar: '--ck-green',
    data: [0.5, 0.58, 0.54, 0.65, 0.72, 0.8, 0.71],
  },
  {
    name: '服务器磁盘使用率',
    colorVar: '--ck-blue',
    data: [0.64, 0.6, 0.69, 0.75, 0.71, 0.64, 0.8],
  },
  {
    name: '服务器内存使用率',
    colorVar: '--ck-purple',
    data: [0.7, 0.65, 0.72, 0.84, 0.8, 0.74, 0.78],
  },
]

/* ───────────── 业务操作功能管理 ───────────── */

/** 用户操作体验情况 */
export const SYSTEM_EXPERIENCE_STATS: SystemPedestalStat[] = [
  { label: '凭证打开平均时长', value: '1', unit: '分钟' },
  { label: '司库平台待付节点单据\n打开平均耗时', value: '1', unit: '分钟' },
]

/** 核心功能操作稳定性 · 第一排开口圆环 */
export const SYSTEM_CORE_ARCS: SystemRateItem[] = [
  { label: '表单保存接口\n成功率', value: 99, display: '99.0%', colorVar: '--ck-green' },
  { label: '附件上传成功率', value: 100, display: '100.0%', colorVar: '--ck-green' },
  { label: '纸电比对接口\n成功率', value: 99, display: '99.0%', colorVar: '--ck-green' },
  { label: '发票查验接口\n可用率', value: 100, display: '100.0%', colorVar: '--ck-blue' },
]

/** 核心功能操作稳定性 · 第二排液面球 */
export const SYSTEM_CORE_BALLS: SystemRateItem[] = [
  { label: '发票查验接口回\n包延迟率', value: 100, display: '100.0%', colorVar: '--ck-green' },
  { label: '司库A点接口\n成功率', value: 99, display: '99.0%', colorVar: '--ck-blue' },
  { label: '司库C点接口\n成功率', value: 100, display: '100.0%', colorVar: '--ck-cyan' },
]

/** 银行回单延迟（第二排最后一格） */
export const SYSTEM_BANK_DELAY: SystemPedestalStat = {
  label: '银行回单延迟',
  value: '1',
  unit: '分钟',
}

/* ───────────── 关键作业功能监控 ───────────── */

/** 业务办理功能稳定情况：四条成功率折线 */
export const SYSTEM_BIZ_SERIES: SystemLineSeries[] = [
  { name: '凭证审核服务可用率', colorVar: '--ck-green', data: [89, 82, 86, 94, 90, 82, 88] },
  { name: '凭证引擎规则执行成功率', colorVar: '--ck-blue', data: [92, 88, 80, 72, 78, 84, 90] },
  { name: '申请调单功能发起成功率', colorVar: '--ck-purple', data: [80, 72, 78, 90, 84, 98, 92] },
  { name: '报表出具成功率', colorVar: '--ck-cyan', data: [90, 84, 88, 94, 89, 84, 80] },
]

/** 作业分配功能稳定情况：四个数字卡 */
export const SYSTEM_JOB_STATS: SystemPlateStat[] = [
  { icon: 'ri-stack-line', label: '任务分配队列堆积量', value: '60', unit: '条' },
  { icon: 'ri-swap-line', label: '作业处理吞吐量', value: '2,000', unit: '笔' },
  { icon: 'ri-file-copy-2-line', label: '作业人均处理量', value: '35', unit: '笔' },
  { icon: 'ri-clipboard-line', label: '批处理作业成功率', value: '99%', unit: '' },
]

/* ───────────── 系统对业务支撑管理 ───────────── */

/** 资源承载率 / 业务承载率 */
export const SYSTEM_SUPPORT_GAUGES: SystemSupportGauge[] = [
  { label: '资源承载率', value: 90 },
  { label: '业务承载率', value: 97 },
]
