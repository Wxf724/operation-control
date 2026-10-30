import type { DrillTab } from './types'

/** 商旅业务管理平台钻取页的返回入口 */
export const TRAVEL_DRILL_BACK_PATH = '/platform/travel'

/** 钻取明细页 ·「商旅使用情况」（图 1～3） */
export const TRAVEL_USAGE_DRILL_PATH = '/drill/travel-usage'

/** 钻取明细页 ·「商旅出行情况」（图 4） */
export const TRAVEL_TRIP_DRILL_PATH = '/drill/travel-trip'

/** 钻取明细页 ·「商旅报销情况」（图 5） */
export const TRAVEL_EXPENSE_DRILL_PATH = '/drill/travel-expense'

/** 钻取明细页 ·「商旅疑点订单情况」（图 6／7 两个页签） */
export const TRAVEL_DOUBT_DRILL_PATH = '/drill/travel-doubt'

/** 疑点订单再下一层的单据明细（图 8） */
export const TRAVEL_DOC_DRILL_PATH = '/drill/travel-doc'

/** 参考图统一的日期区间 */
export const TRAVEL_PERIOD = { start: '2026-01-01', end: '2026-10-30' } as const

/** 商旅业务整体情况／商旅费用等的三交通工具页签 */
export const TRAVEL_VEHICLE_TABS: readonly DrillTab[] = [
  { key: 'train', label: '火车' },
  { key: 'flight', label: '飞机' },
  { key: 'hotel', label: '酒店' },
]

/** 商旅疑点订单情况的两个页签 */
export const TRAVEL_DOUBT_TABS: readonly DrillTab[] = [
  { key: 'enterprise', label: '企业商旅疑点订单情况' },
  { key: 'person', label: '个人商旅疑点订单情况' },
]

/** 单据明细页的两个页签 */
export const TRAVEL_DOC_TABS: readonly DrillTab[] = [
  { key: 'detail', label: '单据明细' },
  { key: 'perf', label: '性能分析' },
]

/** 单据明细页识别查询条件的参数名 */
export const TRAVEL_DOC_QUERY_KEYS: readonly { key: string; label: string }[] = [
  { key: 'org', label: '企业' },
  { key: 'source', label: '数据来源' },
]
