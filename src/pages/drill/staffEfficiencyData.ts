import type { DrillMetric, DrillTab } from './types'

/**
 * 钻取明细页 ·「效率情况」的静态内容。
 *
 * 指标卡与页签照抄 `_refs/live/57-钻取-效率情况.png`；
 * 明细表各页签共用同一张表（本期只做页签切换交互，不切数据源）。
 */

/** 顶部指标卡 */
export const STAFF_EFFICIENCY_METRICS: DrillMetric[] = [
  {
    icon: 'ri-bar-chart-2-line',
    label: '单据处理平均时长',
    value: '0.11',
    unit: '天',
    colorVar: '--ck-cyan',
  },
  {
    icon: 'ri-stack-line',
    label: '加急单据处理平均时长',
    value: '0.11',
    unit: '天',
    colorVar: '--ck-blue',
  },
  {
    icon: 'ri-database-2-line',
    label: '单据处理时长异常总量',
    value: '28',
    unit: '笔',
    colorVar: '--ck-orange',
  },
  {
    icon: 'ri-bar-chart-box-line',
    label: '平均单据产能',
    value: '240',
    unit: '笔/天',
    colorVar: '--ck-green',
  },
  {
    icon: 'ri-building-line',
    label: '平均任务处理量',
    value: '240',
    unit: '个/天',
    colorVar: '--ck-purple',
  },
]

/** 5 个页签，顺序与参考图 57 一致 */
export const STAFF_EFFICIENCY_TABS: readonly DrillTab[] = [
  { key: 'duration', label: '单据处理平均时长' },
  { key: 'urgent', label: '加急单据处理平均时长' },
  { key: 'abnormal', label: '单据处理时长异常量' },
  { key: 'capacity', label: '平均单据产能' },
  { key: 'task', label: '平均任务处理量' },
]
