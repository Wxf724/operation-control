import type { DrillTab } from './types'

/** RPA 三个钻取页的返回入口：都从 RPA 管理平台的面板标题进来 */
export const RPA_DRILL_BACK_PATH = '/platform/rpa'

/** 返回按钮文案（与 DrillFilterBar 的默认文案区分开） */
export const RPA_DRILL_BACK_LABEL = '返回RPA管理平台'

/** 运行情况钻取页：点 RPA 页「运行情况」面板标题进来，对应参考图 1、2 */
export const RPA_RUN_DRILL_PATH = '/drill/rpa-run'

/** 贡献情况钻取页：点 RPA 页「贡献情况」面板标题进来，对应参考图 4 */
export const RPA_CONTRIB_DRILL_PATH = '/drill/rpa-contrib'

/** 单据明细钻取页：运行情况／贡献情况里的表格标题与数据行都跳这里，对应参考图 3 */
export const RPA_DOC_DRILL_PATH = '/drill/rpa-doc'

/** 参考图统一的日期区间 */
export const RPA_PERIOD = { start: '2026-01-01', end: '2026-09-01' } as const

/** 运行情况钻取页的页签 */
export const RPA_RUN_VIEW_TABS: readonly DrillTab[] = [
  { key: 'running', label: 'RPA运行情况' },
  { key: 'idle', label: 'RPA资源闲置' },
]

/** 单据明细钻取页的页签 */
export const RPA_DOC_TABS: readonly DrillTab[] = [
  { key: 'detail', label: '单据明细' },
  { key: 'perf', label: '性能分析' },
]

/**
 * 单据明细页的查询条件参数名。
 *
 * 上一层的表格标题／数据行点下来时把点到的对象写进 URL，
 * 单据明细页的「原始查询条件」按这张表把参数翻成中文条件。
 */
export const RPA_DOC_QUERY_KEYS: readonly { key: string; label: string }[] = [
  { key: 'stage', label: '业务环节' },
  { key: 'type', label: '业务类型' },
  { key: 'source', label: '数据来源' },
]
