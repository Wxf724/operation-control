import type { DrillTab } from './types'

/** 档案业务管理平台钻取页的返回入口 */
export const ARCHIVE_DRILL_BACK_PATH = '/platform/archive'

/** 钻取明细页 ·「档案收集情况」（图 1） */
export const ARCHIVE_COLLECT_DRILL_PATH = '/drill/archive-collect'

/** 钻取明细页 ·「档案作业情况」（图 3～6 四个页签） */
export const ARCHIVE_WORK_DRILL_PATH = '/drill/archive-work'

/** 作业情况行点击弹出「跳转列」后的三条去向（图 8／9／10） */
export const ARCHIVE_DOC_DRILL_PATH = '/drill/archive-doc'
export const ARCHIVE_PRINT_DRILL_PATH = '/drill/archive-print'
export const ARCHIVE_MATCH_DRILL_PATH = '/drill/archive-match'

/** 参考图统一的日期区间 */
export const ARCHIVE_PERIOD = { start: '2026-01-01', end: '2026-10-30' } as const

/** 档案作业情况的四个页签 */
export const ARCHIVE_WORK_TABS: readonly DrillTab[] = [
  { key: 'region', label: '档案作业-区域中心' },
  { key: 'enterprise', label: '档案作业-企业' },
  { key: 'person', label: '档案作业-个人' },
  { key: 'group', label: '档案作业-小组' },
]

/** 两张单据级明细页的页签 */
export const ARCHIVE_CASE_TABS: readonly DrillTab[] = [
  { key: 'detail', label: '单据明细' },
  { key: 'perf', label: '性能分析' },
]

/** 单据明细页（图 8）的两个页签 */
export const ARCHIVE_DOC_TABS: readonly DrillTab[] = [
  { key: 'detail', label: '单据明细' },
  { key: 'perf', label: '性能分析' },
]

/** 明细页识别查询条件的参数名 */
export const ARCHIVE_QUERY_KEYS: readonly { key: string; label: string }[] = [
  { key: 'dim', label: '维度对象' },
  { key: 'source', label: '数据来源' },
]
