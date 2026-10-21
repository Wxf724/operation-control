import { formatPercent } from './format'
import { STAFF_DRILL_CENTERS, staffJitter } from './staffConstants'
import type { DrillColumn, DrillMetric, DrillTab } from './types'

/** 顶部指标卡（数值照抄参考图 55） */
export const STAFF_QUALITY_METRICS: DrillMetric[] = [
  { icon: 'ri-pie-chart-line', label: '单据处理准确率', value: '80%', colorVar: '--ck-cyan' },
  { icon: 'ri-file-chart-line', label: '报表编制准确率', value: '80%', colorVar: '--ck-blue' },
  { icon: 'ri-database-2-line', label: '资金支付准确率', value: '80%', colorVar: '--ck-purple' },
  { icon: 'ri-shield-check-line', label: '质量稽核差错率', value: '85%', colorVar: '--ck-green' },
  { icon: 'ri-map-pin-line', label: '质量稽核问题整改率', value: '4.5', colorVar: '--ck-orange' },
  {
    icon: 'ri-timer-flash-line',
    label: '质量稽核问题整改及时率',
    value: '70%',
    colorVar: '--ck-red',
  },
]

/**
 * 4 个页签，顺序与参考图 55 一致，默认选中第 3 个。
 *
 * 按需求只保留一张明细表：页签只切高亮，表格内容不随页签变。
 */
export const STAFF_QUALITY_TABS: readonly DrillTab[] = [
  { key: 'biz-center', label: '业务处理质量-区域中心' },
  { key: 'biz-staff', label: '业务处理质量-在岗人员' },
  { key: 'audit-center', label: '被质量稽核情况-区域中心' },
  { key: 'audit-staff', label: '被质量稽核情况-在岗人员' },
]

/** 参考图 55 高亮的是「被质量稽核情况-区域中心」 */
export const STAFF_QUALITY_DEFAULT_TAB = 'audit-center'

/** 明细表列：区域中心 + 6 个稽核整改口径 */
export const STAFF_QUALITY_COLUMNS: readonly DrillColumn[] = [
  { key: 'code', title: '区域中心编号', width: '220px', sortable: true },
  { key: 'center', title: '区域中心', width: '160px' },
  { key: 'errorRate', title: '质量稽核差错率', width: '1fr' },
  { key: 'total', title: '应整改质量稽核问题总量', width: '1.2fr' },
  { key: 'done', title: '已整改完毕的质量稽核问题数量', width: '1.4fr' },
  { key: 'fixRate', title: '质量稽核问题整改率', width: '1.1fr' },
  { key: 'overdue', title: '逾期未整改问题数', width: '1fr' },
  { key: 'inTimeRate', title: '质量稽核问题整改及时率', width: '1.3fr' },
]

/** 5 个区域中心 × 被质量稽核情况（参考图里几行数值相同，这里按编号确定性地浮动） */
export const STAFF_QUALITY_ROWS: readonly string[][] = STAFF_DRILL_CENTERS.map((center) => {
  const errorRate = 82 + staffJitter(center.code, 5) * 6
  const total = 16 + Math.round(staffJitter(center.code, 17) * 10)
  const done = Math.round(total * (0.84 + staffJitter(center.code, 29) * 0.12))
  const overdue = Math.max(1, total - done + Math.round(staffJitter(center.code, 37) * 4))
  const inTimeRate = 66 + staffJitter(center.code, 43) * 12
  return [
    center.code,
    center.name,
    formatPercent(errorRate),
    String(total),
    String(done),
    formatPercent((done / total) * 100),
    String(overdue),
    formatPercent(inTimeRate),
  ]
})
