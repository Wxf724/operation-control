import type { DrillColumn, DrillMetric } from './types'

/**
 * 绩效管理平台两张服务类钻取页的静态内容：
 *   服务企业情况（参考图 9）：一张 14 列的企业明细表
 *   服务满意度情况（参考图 10～12）：2 张指标卡 + 中心／个人／小组三个页签
 */

/* ───────────── 服务企业情况（图 9） ───────────── */

/** 服务企业情况表的列（企业名称吃剩余宽度，其余定宽，保证 13 列都能完整显示） */
export const PERFORMANCE_SERVICE_COLUMNS: readonly DrillColumn[] = [
  { key: 'code', title: '企业编码', width: '110px', align: 'left', sortable: true },
  { key: 'name', title: '企业名称', width: 'minmax(0,1fr)', align: 'left' },
  { key: 'total', title: '成本费用单据总量', width: '160px', sortable: true },
  { key: 'execRate', title: '成本费用报销执行准确率', width: '190px' },
  { key: 'correctRate', title: '成本费用报销纠偏率', width: '170px' },
  { key: 'deliverRate', title: '交付支出资金预算准确率', width: '190px' },
  { key: 'messageRate', title: '报文支出资金预算准确率', width: '190px' },
  { key: 'cashRate', title: '非现金收入资金预算准确率', width: '200px' },
  { key: 'budgetRate', title: '资金预算准确率', width: '150px' },
  { key: 'matchRate', title: '报销校验匹配率', width: '140px' },
  { key: 'matchDone', title: '报销校验匹配完成单量', width: '180px' },
  { key: 'matchTodo', title: '报销校验匹配未完成单量', width: '190px' },
  { key: 'deductRate', title: '按收预付金抵扣比', width: '190px' },
]

/** 服务企业情况的企业编号与名称，照参考图 9 */
const SERVICE_ENTERPRISES: readonly (readonly [string, string])[] = [
  ['2300', '华东公司'],
  ['6200', '储运技术公司'],
  ['7500', '甘肃公司'],
  ['7900', '广西公司'],
  ['2800', '新疆煤制天然气外输管道公司'],
  ['2600', '华北公司'],
  ['7000', '东北公司'],
  ['2100', '华南公司'],
  ['7700', '福建公司'],
  ['8100', '山东公司'],
  ['1070', '北京智网数科公司'],
  ['1600', '北方管道公司'],
  ['7200', '浙江省天然气管网公司'],
  ['2200', '华中公司'],
  ['6300', '储能技术公司'],
  ['1000', '集团公司总部'],
  ['1020', '建设项目管理公司'],
  ['7800', '云南公司'],
  ['1060', '研究总院'],
  ['1030', '工程质量监督检验公司'],
]

/** 服务企业情况的行：总量逐行 +1，各准确率按参考图统一填 */
export const PERFORMANCE_SERVICE_ROWS: readonly string[][] = SERVICE_ENTERPRISES.map(
  ([code, name], i) => [
    code,
    name,
    (5000 + i).toLocaleString('en-US'),
    '0.56',
    '0.56',
    '0.56',
    '0.56',
    '0.62',
    '0.79',
    '0.79',
    '0.79',
    '0.79',
    String(65 + i),
  ]
)

/* ───────────── 服务满意度情况（图 10～12） ───────────── */

/** 顶部 2 张指标卡 */
export const PERFORMANCE_SATISFACTION_METRICS: readonly DrillMetric[] = [
  {
    icon: 'ri-user-smile-line',
    label: '客户满意度问卷评分',
    value: '473.7',
    colorVar: '--ck-cyan',
  },
  {
    icon: 'ri-notification-3-line',
    label: '用户投诉总量',
    value: '29',
    colorVar: '--ck-blue',
  },
]

/** 各页签的列 */
export const PERFORMANCE_SATISFACTION_COLUMNS: Record<string, readonly DrillColumn[]> = {
  center: [
    { key: 'code', title: '区域中心编号', width: '340px', align: 'left', sortable: true },
    { key: 'name', title: '区域中心', width: 'minmax(0,1fr)', align: 'left' },
    { key: 'score', title: '客户满意度问卷评分', width: '360px', sortable: true },
    { key: 'complaints', title: '用户投诉总量', width: '340px' },
  ],
  person: [
    { key: 'code', title: '个人编号', width: '340px', align: 'left', sortable: true },
    { key: 'name', title: '个人', width: 'minmax(0,1fr)', align: 'left' },
    { key: 'complaints', title: '用户投诉总量', width: '340px', sortable: true },
  ],
  group: [
    { key: 'code', title: '小组编号', width: '340px', align: 'left', sortable: true },
    { key: 'name', title: '小组', width: 'minmax(0,1fr)', align: 'left' },
    { key: 'complaints', title: '用户投诉总量', width: '340px', sortable: true },
  ],
}

/** 中心页签的行，照参考图 10 */
export const PERFORMANCE_SATISFACTION_CENTER_ROWS: readonly string[][] = [
  ['10001000', '北京总部', '91.2', '10'],
  ['10001001', '东部中心', '94.5', '8'],
  ['10001002', '西部中心', '90.8', '2'],
  ['10001003', '北部中心', '97.1', '6'],
  ['10001004', '南部中心', '98.1', '3'],
]

/** 个人页签的行，照参考图 11 */
export const PERFORMANCE_SATISFACTION_PERSON_ROWS: readonly string[][] = [
  ['A1', '测试1', '10'],
  ['A2', '测试2', '8'],
  ['A3', '测试3', '2'],
  ['A4', '测试4', '6'],
  ['A5', '测试5', '3'],
]

/** 小组页签的行，照参考图 12 */
export const PERFORMANCE_SATISFACTION_GROUP_ROWS: readonly string[][] = [
  ['001', '小组1', '10'],
  ['002', '小组2', '8'],
  ['003', '小组3', '2'],
  ['004', '小组4', '6'],
  ['005', '小组5', '3'],
]

/** 按页签取行 */
export function getSatisfactionRows(tab: string): readonly string[][] {
  if (tab === 'person') return PERFORMANCE_SATISFACTION_PERSON_ROWS
  if (tab === 'group') return PERFORMANCE_SATISFACTION_GROUP_ROWS
  return PERFORMANCE_SATISFACTION_CENTER_ROWS
}
