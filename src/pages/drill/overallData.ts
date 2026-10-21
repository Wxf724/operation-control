import {
  DRILL_CENTER_ROWS,
  DRILL_ORG_ROWS,
  DRILL_SCENE_ROWS,
  DRILL_STEP_ROWS,
  scaleRows,
} from './drillOrgs'
import type { DrillMetric, DrillOrgRow, DrillTab } from './types'

/** 「作业处理整体情况」的一个页签：换一套机构清单 + 换列名 */
export interface OverallTab extends DrillTab {
  /** 第二列表头，如「单位编号」「中心编号」 */
  codeTitle: string
  /** 第三列表头，如「单位」「区域中心」 */
  nameTitle: string
  /** 数值列表头，如「单据接收量」 */
  valueTitle: string
  rows: DrillOrgRow[]
}

/** 顶部指标卡（数值照抄参考图 40） */
export const OVERALL_METRICS: DrillMetric[] = [
  {
    icon: 'ri-file-list-3-line',
    label: '接收单据量',
    value: '1,243,058',
    unit: '笔',
    colorVar: '--ck-cyan',
  },
  {
    icon: 'ri-calendar-check-line',
    label: '完成单据量',
    value: '1,218,197',
    unit: '笔',
    colorVar: '--ck-blue',
  },
  { icon: 'ri-database-2-line', label: '单据完成率', value: '98.0%', colorVar: '--ck-green' },
]

/** 6 个页签，顺序与参考图 40 一致 */
export const OVERALL_TABS: OverallTab[] = [
  {
    key: 'recv-unit',
    label: '单据接收量-单位',
    codeTitle: '单位编号',
    nameTitle: '单位',
    valueTitle: '单据接收量',
    rows: DRILL_ORG_ROWS,
  },
  {
    key: 'recv-center',
    label: '单据接收量-区域中心',
    codeTitle: '中心编号',
    nameTitle: '区域中心',
    valueTitle: '单据接收量',
    rows: DRILL_CENTER_ROWS,
  },
  {
    key: 'done-unit',
    label: '单据完成量-单位',
    codeTitle: '单位编号',
    nameTitle: '单位',
    valueTitle: '单据完成量',
    rows: scaleRows(DRILL_ORG_ROWS, 0.98),
  },
  {
    key: 'done-center',
    label: '单据完成量-区域中心',
    codeTitle: '中心编号',
    nameTitle: '区域中心',
    valueTitle: '单据完成量',
    rows: scaleRows(DRILL_CENTER_ROWS, 0.98),
  },
  {
    key: 'done-scene',
    label: '单据完成量-业务场景',
    codeTitle: '场景编号',
    nameTitle: '业务场景',
    valueTitle: '单据完成量',
    rows: DRILL_SCENE_ROWS,
  },
  {
    key: 'done-step',
    label: '单据完成量-业务环节',
    codeTitle: '环节编号',
    nameTitle: '业务环节',
    valueTitle: '单据完成量',
    rows: DRILL_STEP_ROWS,
  },
]

/** 日期区间默认值（参考图 40） */
export const OVERALL_PERIOD = { start: '2026-01-01', end: '2026-10-21' } as const
