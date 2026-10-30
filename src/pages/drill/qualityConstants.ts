import type { DrillTab } from './types'

/** 质量管理平台钻取页的返回入口 */
export const QUALITY_DRILL_BACK_PATH = '/platform/quality'

/** 钻取明细页 ·「稽核覆盖与抽样情况」（图 3／4／5 三个页签） */
export const QUALITY_SAMPLING_DRILL_PATH = '/drill/quality-sampling'

/** 钻取明细页 ·「稽核过程与效率情况」（图 6／7／8 三个页签） */
export const QUALITY_CAPTURE_DRILL_PATH = '/drill/quality-capture'

/** 钻取明细页 ·「待抽样核查明细」（凭证／要素两张表的行都跳这里，图 9） */
export const QUALITY_CHECK_DRILL_PATH = '/drill/quality-check'

/** 钻取明细页 ·「单据明细」（档案表的行跳这里，图 10） */
export const QUALITY_DOC_DRILL_PATH = '/drill/quality-doc'

/** 参考图 3~10 统一的日期区间 */
export const QUALITY_PERIOD = { start: '2026-08-01', end: '2026-08-31' } as const

/** 抽样覆盖与抽样情况的三个页签（凭证／报表／档案） */
export const QUALITY_SAMPLING_TABS: readonly DrillTab[] = [
  { key: 'voucher', label: '凭证抽样覆盖与抽样情况' },
  { key: 'report', label: '报表抽样覆盖与抽样情况' },
  { key: 'archive', label: '档案抽样覆盖与抽样情况' },
]

/** 捕获进度与效率的三个页签（凭证／要素／档案） */
export const QUALITY_CAPTURE_TABS: readonly DrillTab[] = [
  { key: 'voucher', label: '凭证捕获进度与效率' },
  { key: 'element', label: '要素捕获进度与效率' },
  { key: 'archive', label: '档案捕获进度与效率' },
]

/**
 * 两张明细页（待抽样核查明细 / 单据明细）的查询条件参数名。
 *
 * 上一层点下来时把点到的对象写进 URL，明细页的「原始查询条件」按这张表翻成中文。
 */
export const QUALITY_RECORD_QUERY_KEYS: readonly { key: string; label: string }[] = [
  { key: 'stage', label: '业务环节' },
  { key: 'type', label: '业务类型' },
  { key: 'post', label: '岗位' },
  { key: 'staff', label: '员工' },
  { key: 'source', label: '数据来源' },
]

/* ───────────── 业务质量与差错情况（图 1～6） ───────────── */

/** 钻取明细页 ·「业务质量与差错情况」（图 1～5 五个页签） */
export const QUALITY_BUSINESS_DRILL_PATH = '/drill/quality-business'

/** 钻取明细页 ·「工单明细」（业务质量页的行都跳这里，图 6） */
export const QUALITY_WORKORDER_DRILL_PATH = '/drill/quality-workorder'

/** 工单明细页的两个页签 */
export const QUALITY_WORKORDER_TABS: readonly DrillTab[] = [
  { key: 'detail', label: '单据明细' },
  { key: 'perf', label: '性能分析' },
]

/** 工单明细页识别查询条件的参数名 */
export const QUALITY_WORKORDER_QUERY_KEYS: readonly { key: string; label: string }[] = [
  { key: 'org', label: '组织机构' },
  { key: 'type', label: '业务类型' },
  { key: 'source', label: '数据来源' },
]

/* ───────────── 申诉与争议管理情况（图 7～11） ───────────── */

/** 钻取明细页 ·「申诉与争议管理情况」（图 7／8 两个页签） */
export const QUALITY_APPEAL_DRILL_PATH = '/drill/quality-appeal'

/** 行点击弹出「跳转列」后的两条去向：申诉明细、争议明细 */
export const QUALITY_APPEAL_DETAIL_PATH = '/drill/quality-appeal-detail'
export const QUALITY_DISPUTE_DRILL_PATH = '/drill/quality-dispute'

/** 两张单据级明细页识别查询条件的参数名 */
export const QUALITY_CASE_QUERY_KEYS: readonly { key: string; label: string }[] = [
  { key: 'name', label: '维度对象' },
  { key: 'type', label: '类型' },
  { key: 'source', label: '数据来源' },
]

/* ───────────── 整改与规则转化情况（图 1～7） ───────────── */

/** 钻取明细页 ·「整改与规则转化情况」（图 1～4 四个页签） */
export const QUALITY_RECTIFY_DRILL_PATH = '/drill/quality-rectify'

/** 行点击弹出「跳转列」后的两条去向：单据明细、未整改明细 */
export const QUALITY_RECTIFY_DOC_PATH = '/drill/quality-rectify-doc'
export const QUALITY_UNRECTIFIED_PATH = '/drill/quality-unrectified'

/** 单据明细页的两个页签 */
export const QUALITY_RECTIFY_DOC_TABS: readonly DrillTab[] = [
  { key: 'detail', label: '单据明细' },
  { key: 'perf', label: '性能分析' },
]

/** 未整改明细页的两个页签 */
export const QUALITY_UNRECTIFIED_TABS: readonly DrillTab[] = [
  { key: 'detail', label: '未整改明细' },
  { key: 'perf', label: '性能分析' },
]
