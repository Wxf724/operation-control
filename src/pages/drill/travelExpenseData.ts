import type { DrillColumn } from './types'
import type { TravelSeries } from './travelChartOptions'

/**
 * 钻取明细页 ·「商旅报销情况」的静态内容（参考图 5）。
 *
 * 六块：企业交通住宿费用（三页签表）、个人交通住宿费用（三页签表）、商旅成本入账率环形、
 * 商旅报销表、企业超期待报销堆叠柱、企业待报销 + 个人超期待报销堆叠柱。
 */

/** 企业交通住宿费用表的列 */
export const TRAVEL_ENTERPRISE_FEE_COLUMNS: readonly DrillColumn[] = [
  { key: 'code', title: '企业编码', width: '120px', align: 'left', sortable: true },
  { key: 'name', title: '企业名称', width: 'minmax(0,1fr)', align: 'left' },
  { key: 'count', title: '交通预订报销订单量', width: '160px', sortable: true },
  { key: 'rate', title: '交通预订报销率', width: '140px' },
  { key: 'amount', title: '交通预订报销总金额', width: '170px', sortable: true },
  { key: 'avg', title: '交通预订平均报销金额', width: '170px' },
]

export const TRAVEL_ENTERPRISE_FEE_ROWS: readonly string[][] = [
  ['2300', '华东公司', '73', '36.59%', '41,732', '36.81'],
  ['6200', '储运技术公司', '41', '74.71%', '41,732', '14.27'],
  ['7500', '甘肃公司', '18', '18.95%', '36,436', '29.45'],
  ['7900', '广西公司', '18', '52.78%', '26,289', '32.68'],
  ['2800', '新疆煤制天然气外输管道公司', '19', '31.66%', '36,289', '47.52'],
  ['2600', '华北公司', '87', '87.64%', '36,816', '47.93'],
  ['7000', '东北公司', '8', '41.61%', '47,732', '41.59'],
  ['8100', '山东公司', '41', '41.59%', '41,732', '41.79'],
]

/** 个人交通住宿费用表的列 */
export const TRAVEL_PERSON_FEE_COLUMNS: readonly DrillColumn[] = [
  { key: 'code', title: '员工编号', width: '150px', align: 'left', sortable: true },
  { key: 'name', title: '员工姓名', width: 'minmax(0,1fr)', align: 'left' },
  { key: 'count', title: '交通预订报销订单量', width: '190px', sortable: true },
  { key: 'rate', title: '交通预订报销率', width: '170px' },
]

export const TRAVEL_PERSON_FEE_ROWS: readonly string[][] = [
  ['100100', '张丽', '73', '74.71%'],
  ['100101', '王巧', '71', '36.59%'],
  ['100102', '李思', '18', '18.95%'],
  ['100103', '徐亚', '18', '52.78%'],
  ['100104', '张颖', '41', '74.71%'],
  ['100105', '阮仟', '73', '36.59%'],
  ['100106', '刘琦', '41', '74.71%'],
  ['100107', '思思', '18', '18.95%'],
]

/** 商旅成本入账率环形（按公司） */
export const TRAVEL_COST_DONUT: readonly { label: string; value: number; colorVar: string }[] = [
  { label: '华东公司', value: 42.15, colorVar: '--ck-cyan' },
  { label: '储运技术公司', value: 18.97, colorVar: '--ck-blue' },
  { label: '甘肃公司', value: 9.27, colorVar: '--ck-teal' },
  { label: '广西公司', value: 8.49, colorVar: '--ck-purple' },
  { label: '新疆煤制气', value: 7.32, colorVar: '--ck-green' },
  { label: '华北公司', value: 6.41, colorVar: '--ck-orange' },
  { label: '东北公司', value: 4.15, colorVar: '--ck-yellow' },
]

/** 商旅报销表的列 */
export const TRAVEL_REIMBURSE_COLUMNS: readonly DrillColumn[] = [
  { key: 'code', title: '企业编码', width: '200px', align: 'left', sortable: true },
  { key: 'name', title: '企业名称', width: 'minmax(0,1fr)', align: 'left' },
  { key: 'orders', title: '商旅报销订单数', width: '220px', sortable: true },
  { key: 'share', title: '订单数占比', width: '200px' },
  { key: 'avg', title: '商旅报销-平均金额', width: '230px', sortable: true },
]

export const TRAVEL_REIMBURSE_ROWS: readonly string[][] = [
  ['2300', '华东公司', '82.14%', '64.71%', '27.43'],
  ['6200', '储运技术公司', '82.14%', '64.71%', '27.43'],
  ['7500', '甘肃公司', '14.53%', '28.53%', '18.56'],
  ['7900', '广西公司', '90.73%', '45.82%', '25.81'],
  ['2800', '新疆煤制天然气外输管道公司', '59.37%', '28.53%', '18.56'],
  ['2600', '华北公司', '59.37%', '28.53%', '18.56'],
  ['7000', '东北公司', '14.53%', '91.36%', '9.27'],
  ['8100', '山东公司', '90.73%', '45.82%', '25.81'],
]

/** 堆叠柱的分类：企业 */
export const TRAVEL_EXPENSE_COMPANIES: readonly string[] = [
  '华东公司',
  '储运技术公司',
  '甘肃公司',
  '广西公司',
  '新疆煤制气',
  '华北公司',
  '东北公司',
  '山东公司',
]

/** 企业超期待报销情况 */
export const TRAVEL_OVERDUE_SERIES: readonly TravelSeries[] = [
  {
    name: '待报销预订订单量',
    colorVar: '--ck-cyan',
    values: [92, 60, 64, 30, 52, 84, 76, 44, 58, 42, 62, 52],
  },
  {
    name: '超期待报销订单总量',
    colorVar: '--ck-blue',
    values: [46, 30, 32, 15, 26, 42, 38, 22, 29, 21, 31, 26],
  },
]

/** 企业待报销情况 */
export const TRAVEL_PENDING_SERIES: readonly TravelSeries[] = [
  {
    name: '待报销预订订单量',
    colorVar: '--ck-cyan',
    values: [18, 12, 22, 9, 26, 14, 30, 16, 12, 20, 24, 14],
  },
  {
    name: '待报销预订订单总金额',
    colorVar: '--ck-blue',
    values: [9, 7, 12, 5, 16, 8, 17, 10, 7, 11, 13, 8],
  },
]

/** 个人超期待报销情况的分类 */
export const TRAVEL_EXPENSE_PERSONS: readonly string[] = [
  '张丽',
  '李思',
  '徐亚',
  '刘琦',
  '王巧',
  '阮仟',
  '思思',
  '齐乔',
  '王洒',
  '刘超',
  '刘涛',
  '张新宇',
]

export const TRAVEL_PERSON_OVERDUE_SERIES: readonly TravelSeries[] = [
  {
    name: '待报销预订订单量',
    colorVar: '--ck-cyan',
    values: [30, 18, 16, 22, 12, 14, 10, 16, 26, 18, 14, 20],
  },
  {
    name: '超期待报销订单总量',
    colorVar: '--ck-blue',
    values: [16, 9, 8, 11, 6, 7, 5, 8, 13, 9, 7, 10],
  },
]

/** 月度（堆叠柱分类） */
export const TRAVEL_EXPENSE_MONTHS: readonly string[] = [
  '2024-01',
  '2024-02',
  '2024-03',
  '2024-04',
  '2024-05',
  '2024-06',
  '2024-07',
  '2024-08',
  '2024-09',
  '2024-10',
  '2024-11',
  '2024-12',
]
