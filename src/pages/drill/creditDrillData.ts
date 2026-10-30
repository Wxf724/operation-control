import type { DrillColumn } from './types'

/**
 * 信用管理监控平台两张钻取页的静态内容（参考图 8、9）。
 *
 * 图 8「信用整体情况」：日期区间 + 口径开关 + 一张按单位的扣分单据量明细表；
 * 图 9「申诉处理情况」：日期区间 + 5 张指标卡 + 一张按管理单位的申诉明细表。
 */

/* ───────────── 信用整体情况（图 8） ───────────── */

/** 报销信用扣分单据量表的列 */
export const CREDIT_OVERALL_COLUMNS: readonly DrillColumn[] = [
  { key: 'account', title: '单位账号', width: '320px', sortable: true },
  { key: 'name', title: '单位名称', width: 'minmax(0,1fr)', align: 'left' },
  { key: 'count', title: '报销信用扣分单据数量', width: '420px', sortable: true },
]

/** 图 8 的 20 行：单位账号 / 单位名称 / 报销信用扣分单据数量 */
export const CREDIT_OVERALL_ROWS: readonly string[][] = [
  ['1000', '集团公司总部', '240'],
  ['1010', '油气调控中心', '240'],
  ['1020', '建设项目管理公司', '240'],
  ['1030', '工程质量监督检验公司', '240'],
  ['1050', '工程技术创新公司', '240'],
  ['1060', '研究总院', '240'],
  ['1070', '北京智网数科公司', '240'],
  ['1080', '共享运营公司', '240'],
  ['1200', '西部管道公司', '240'],
  ['1500', '西南管道公司', '240'],
  ['1600', '北方管道公司', '240'],
  ['1700', '西气东输公司', '240'],
  ['1800', '北京管道公司', '240'],
  ['2100', '华南公司', '240'],
  ['2200', '华中公司', '240'],
  ['2300', '华东公司', '240'],
  ['2600', '华北公司', '240'],
  ['2700', '东部原油储运公司', '240'],
  ['2800', '新疆煤制天然气外输管道公司', '240'],
  ['3000', '液化天然气接收站管理公司', '240'],
]

/* ───────────── 申诉处理情况（图 9） ───────────── */

/** 申诉处理情况表的列 */
export const CREDIT_APPEAL_COLUMNS: readonly DrillColumn[] = [
  { key: 'code', title: '管理单位编号', width: '200px', align: 'left', sortable: true },
  { key: 'name', title: '管理单位名称', width: 'minmax(0,1fr)', align: 'left' },
  { key: 'appealTotal', title: '申诉发起数量', width: '190px', sortable: true },
  { key: 'appealPass', title: '申诉通过数量', width: '190px' },
  { key: 'appealRate', title: '申诉通过率', width: '170px' },
  { key: 'disputeTotal', title: '异议申诉发起量', width: '190px' },
  { key: 'disputeRate', title: '异议申诉发起率', width: '190px' },
  { key: 'disputePass', title: '异议申诉通过量', width: '190px' },
  { key: 'disputePassRate', title: '异议申诉通过比率', width: '200px' },
  { key: 'timelyRate', title: '申诉处理及时率', width: '190px' },
]

/** 图 9 的管理单位行（编号 / 名称），数值列统一按参考图填 */
const CREDIT_APPEAL_UNITS: readonly (readonly [string, string])[] = [
  ['1000', '集团公司总部'],
  ['1010', '油气调控中心'],
  ['1020', '建设项目管理公司'],
  ['1030', '工程质量监督检验公司'],
  ['1050', '工程技术创新公司'],
  ['1060', '研究总院'],
  ['1070', '北京智网数科公司'],
  ['1080', '共享运营公司'],
  ['1200', '西部管道公司'],
  ['1500', '西南管道公司'],
  ['1600', '北方管道公司'],
  ['1700', '西气东输公司'],
  ['1800', '北京管道公司'],
  ['2100', '华南公司'],
  ['2200', '华中公司'],
  ['2300', '华东公司'],
  ['2600', '华北公司'],
  ['2700', '东部原油储运公司'],
  ['2800', '新疆煤制天然气外输管道公司'],
  ['3000', '液化天然气接收站管理公司'],
]

/** 每个单位共用的 8 个数值，照抄参考图 9 */
const CREDIT_APPEAL_VALUES: readonly string[] = [
  '120',
  '80',
  '66.67%',
  '64',
  '53.33%',
  '24',
  '37.50%',
  '98.00%',
]

/** 图 9 的表格行 */
export const CREDIT_APPEAL_ROWS: readonly string[][] = CREDIT_APPEAL_UNITS.map(([code, name]) => [
  code,
  name,
  ...CREDIT_APPEAL_VALUES,
])
