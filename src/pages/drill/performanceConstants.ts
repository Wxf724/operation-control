import type { DrillTab } from './types'

/** 绩效管理平台钻取页的返回入口 */
export const PERFORMANCE_DRILL_BACK_PATH = '/platform/performance'

/** 钻取明细页 ·「效率管理情况」（图 1～3 三个页签） */
export const PERFORMANCE_EFFICIENCY_DRILL_PATH = '/drill/performance-efficiency'

/** 钻取明细页 ·「质量管理情况」（图 5～7 三个页签） */
export const PERFORMANCE_QUALITY_DRILL_PATH = '/drill/performance-quality'

/** 钻取明细页 ·「服务企业情况」（图 9） */
export const PERFORMANCE_SERVICE_DRILL_PATH = '/drill/performance-service'

/** 钻取明细页 ·「服务满意度情况」（图 10～12 三个页签） */
export const PERFORMANCE_SATISFACTION_DRILL_PATH = '/drill/performance-satisfaction'

/** 效率／质量两条链再下一层的单据明细页（图 4／8） */
export const PERFORMANCE_DOC_DRILL_PATH = '/drill/performance-doc'

/** 参考图统一的日期区间 */
export const PERFORMANCE_PERIOD = { start: '2026-01-01', end: '2026-09-30' } as const

/** 效率管理情况的三个页签 */
export const PERFORMANCE_EFFICIENCY_TABS: readonly DrillTab[] = [
  { key: 'efficiency', label: '业务处理效率' },
  { key: 'carryover', label: '结转业务处理情况' },
  { key: 'report', label: '报表出具情况' },
]

/** 质量管理情况的三个页签 */
export const PERFORMANCE_QUALITY_TABS: readonly DrillTab[] = [
  { key: 'enterprise', label: '作业质量管理情况-企业' },
  { key: 'group', label: '作业质量管理情况-小组' },
  { key: 'person', label: '作业质量管理情况-个人' },
]

/** 服务满意度情况的三个页签 */
export const PERFORMANCE_SATISFACTION_TABS: readonly DrillTab[] = [
  { key: 'center', label: '服务满意度情况-中心' },
  { key: 'person', label: '服务满意度情况-个人' },
  { key: 'group', label: '服务满意度情况-小组' },
]

/** 单据明细页的两个页签 */
export const PERFORMANCE_DOC_TABS: readonly DrillTab[] = [
  { key: 'detail', label: '单据明细' },
  { key: 'perf', label: '性能分析' },
]

/** 单据明细页识别查询条件的参数名 */
export const PERFORMANCE_DOC_QUERY_KEYS: readonly { key: string; label: string }[] = [
  { key: 'org', label: '组织机构' },
  { key: 'source', label: '数据来源' },
]
