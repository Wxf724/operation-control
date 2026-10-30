import type { DrillColumn, DrillMetric } from './types'

/**
 * 钻取明细页 ·「质量管理情况」的静态内容（参考图 5～6～7）。
 *
 * 6 张指标卡固定不变，三个页签只换表格的维度列：
 *   企业：企业编号／企业      + 协同单据量 / 退回单据量 / 业务问题量 / 内部交易对账准确率
 *   小组：小组编号／小组      + 协同退单率 / 退回单据量
 *   个人：个人编号／个人      + 协同单据量 / 退回单据量 / 协同退单率
 */

/** 指标卡：第一行 4 张、第二行 2 张 */
export const PERFORMANCE_QUALITY_METRICS: readonly (readonly DrillMetric[])[] = [
  [
    {
      icon: 'ri-user-3-line',
      label: '全流程业务处理质量(中心)',
      value: '150.00%',
      colorVar: '--ck-cyan',
    },
    {
      icon: 'ri-money-cny-circle-line',
      label: '资金支付准确率',
      value: '250.00%',
      colorVar: '--ck-blue',
    },
    {
      icon: 'ri-map-pin-2-line',
      label: '协同单据量',
      value: '100',
      colorVar: '--ck-blue',
    },
    {
      icon: 'ri-notification-3-line',
      label: '退回单据量',
      value: '50',
      colorVar: '--ck-blue',
    },
  ],
  [
    {
      icon: 'ri-star-line',
      label: '协同退单率',
      value: '350.00%',
      colorVar: '--ck-blue',
    },
    {
      icon: 'ri-timer-line',
      label: '内部交易对账准确率',
      value: '550.00%',
      colorVar: '--ck-blue',
    },
  ],
]

/** 各页签的列 */
export const PERFORMANCE_QUALITY_COLUMNS: Record<string, readonly DrillColumn[]> = {
  enterprise: [
    { key: 'code', title: '企业编号', width: '280px', align: 'left', sortable: true },
    { key: 'name', title: '企业', width: 'minmax(0,1fr)', align: 'left' },
    { key: 'jointCount', title: '协同单据量', width: '300px', sortable: true },
    { key: 'returnCount', title: '退回单据量', width: '280px' },
    { key: 'issueCount', title: '业务问题量', width: '280px' },
    { key: 'reconcileRate', title: '内部交易对账准确率', width: '320px' },
  ],
  group: [
    { key: 'code', title: '小组编号', width: '280px', align: 'left', sortable: true },
    { key: 'name', title: '小组', width: 'minmax(0,1fr)', align: 'left' },
    { key: 'returnRate', title: '协同退单率', width: '340px' },
    { key: 'returnCount', title: '退回单据量', width: '320px', sortable: true },
  ],
  person: [
    { key: 'code', title: '个人编号', width: '280px', align: 'left', sortable: true },
    { key: 'name', title: '个人', width: 'minmax(0,1fr)', align: 'left' },
    { key: 'jointCount', title: '协同单据量', width: '300px' },
    { key: 'returnCount', title: '退回单据量', width: '300px' },
    { key: 'returnRate', title: '协同退单率', width: '300px' },
  ],
}

const QUALITY_CODES = [
  'A001',
  'A002',
  'A003',
  'A004',
  'A005',
  'A006',
  'A007',
  'A008',
  'A009',
  'A010',
]

/** 企业页签的行，照参考图 5 */
export const PERFORMANCE_QUALITY_ENTERPRISE_ROWS: readonly string[][] = [
  ['A001', '企业甲', '10', '5', '75.00%', '55.00%'],
  ['A002', '企业乙', '10', '5', '75.00%', '55.00%'],
  ['A003', '企业丙', '10', '5', '75.00%', '55.00%'],
  ['A004', '企业丁', '10', '5', '75.00%', '55.00%'],
  ['A005', '企业戊', '10', '5', '75.00%', '55.00%'],
  ['A006', '企业己', '10', '5', '75.00%', '55.00%'],
  ['A007', '企业庚', '10', '5', '75.00%', '55.00%'],
  ['A008', '企业辛', '10', '5', '75.00%', '55.00%'],
  ['A009', '企业壬', '10', '5', '75.00%', '55.00%'],
  ['A010', '企业癸', '10', '5', '75.00%', '55.00%'],
]

/** 小组页签的行，照参考图 6 */
export const PERFORMANCE_QUALITY_GROUP_ROWS: readonly string[][] = QUALITY_CODES.map((code, i) => [
  code,
  `小组${i + 1}`,
  '0.35',
  '5',
])

/** 个人页签的行，照参考图 7 */
const QUALITY_PERSON_NAMES = [
  '张三',
  '李四',
  '王五',
  '赵六',
  '孙七',
  '周八',
  '吴九',
  '郑十',
  '冯十一',
  '陈十二',
]

export const PERFORMANCE_QUALITY_PERSON_ROWS: readonly string[][] = QUALITY_CODES.map((code, i) => [
  code,
  QUALITY_PERSON_NAMES[i],
  '10',
  '5',
  '35.00%',
])

/** 按页签取行 */
export function getQualityRows(tab: string): readonly string[][] {
  if (tab === 'group') return PERFORMANCE_QUALITY_GROUP_ROWS
  if (tab === 'person') return PERFORMANCE_QUALITY_PERSON_ROWS
  return PERFORMANCE_QUALITY_ENTERPRISE_ROWS
}
