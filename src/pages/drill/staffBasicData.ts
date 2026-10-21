import { DRILL_LOAD_ORG_ROWS } from './drillOrgs'
import { staffJitter } from './staffConstants'
import type { DrillColumn, DrillMetric, DrillTab } from './types'

/** 「员工出勤」指标块（数值照抄参考图 54） */
export const STAFF_BASIC_ATTENDANCE: DrillMetric[] = [
  {
    icon: 'ri-hourglass-2-line',
    label: '在岗天数',
    value: '302',
    unit: '天',
    colorVar: '--ck-cyan',
  },
  { icon: 'ri-sun-line', label: '休假天数', value: '12', unit: '天', colorVar: '--ck-blue' },
  { icon: 'ri-map-pin-line', label: '出差天数', value: '240', unit: '天', colorVar: '--ck-purple' },
  { icon: 'ri-user-3-line', label: '在岗人数', value: '45', unit: '人', colorVar: '--ck-green' },
]

/** 「员工技能情况」指标块（数值照抄参考图 54） */
export const STAFF_BASIC_SKILLS: DrillMetric[] = [
  {
    icon: 'ri-timer-line',
    label: '平均处理时长',
    value: '0.78',
    unit: '天',
    colorVar: '--ck-cyan',
  },
  { icon: 'ri-bar-chart-2-line', label: '历史处理质量', value: '99%', colorVar: '--ck-blue' },
  {
    icon: 'ri-file-list-3-line',
    label: '单据处理量',
    value: '2,700',
    unit: '笔',
    colorVar: '--ck-purple',
  },
  { icon: 'ri-award-line', label: '资质证书完备度', value: '89%', colorVar: '--ck-green' },
  {
    icon: 'ri-bookmark-3-line',
    label: '实际绩效合同得分',
    value: '80',
    unit: '分',
    colorVar: '--ck-orange',
  },
]

/**
 * 4 个页签，顺序与参考图 54 一致，默认选中第 4 个。
 *
 * 按需求只保留一张明细表：页签只切高亮，表格内容不随页签变。
 */
export const STAFF_BASIC_TABS: readonly DrillTab[] = [
  { key: 'duration', label: '平均处理时长-业务类型' },
  { key: 'quality', label: '历史处理质量-业务类型' },
  { key: 'bill', label: '单据处理量-业务类型' },
  { key: 'score', label: '实际绩效合同得分-管理单位' },
]

/** 参考图 54 高亮的是「实际绩效合同得分-管理单位」 */
export const STAFF_BASIC_DEFAULT_TAB = 'score'

/** 明细表列：管理单位编号 / 管理单位 / 实际绩效合同得分 */
export const STAFF_BASIC_COLUMNS: readonly DrillColumn[] = [
  { key: 'code', title: '管理单位编号', width: '560px', sortable: true },
  { key: 'name', title: '管理单位', width: '1fr' },
  { key: 'score', title: '实际绩效合同得分', width: '680px' },
]

/** 31 家管理单位 × 实际绩效合同得分（参考图统一是 80，这里按单位编号确定性地浮动一点） */
export const STAFF_BASIC_ROWS: readonly string[][] = DRILL_LOAD_ORG_ROWS.map((row) => [
  row.code,
  row.name,
  String(76 + Math.round(staffJitter(row.code, 13) * 20)),
])
