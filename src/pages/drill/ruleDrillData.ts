import type { DrillColumn } from './types'

/**
 * 钻取明细页 ·「规则迭代优化管理」的列与行（参考图 2）。
 *
 * 版面只有一条日期区间 + 一张业务类型明细表，没有指标卡与页签，
 * 数值照抄参考图（7 个业务类型 × 三个优化口径）。
 */

/** 明细表列 */
export const RULE_ITERATION_COLUMNS: readonly DrillColumn[] = [
  { key: 'bizType', title: '业务类型', width: 'minmax(0,1fr)', align: 'left' },
  { key: 'totalTimes', title: '整体优化次数', width: '420px' },
  { key: 'ruleTimes', title: '单个规则优化次数（半年内）', width: '440px' },
  { key: 'retriggerTimes', title: '非规则规则停用再触发次数', width: '440px' },
]

/** 明细表行 */
export const RULE_ITERATION_ROWS: readonly string[][] = [
  ['员工出行', '10', '200', '5'],
  ['员工差旅及劳务', '10', '200', '5'],
  ['物资采购', '10', '200', '5'],
  ['收款业务', '10', '200', '5'],
  ['资产变更', '10', '200', '5'],
  ['税金计算', '10', '200', '5'],
  ['税金缴纳', '10', '200', '5'],
]
