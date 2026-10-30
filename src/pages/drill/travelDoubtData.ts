import type { DrillColumn } from './types'

/**
 * 钻取明细页 ·「商旅疑点订单情况」的静态内容（参考图 6／7）。
 *
 * 两个页签（企业／个人）共用同构表：维度列（企业编码/名称 或 员工编号/姓名）
 * + 商旅疑点订单总量 / 疑点订单确认量 / 疑点订单核销金额 / 商旅预订取消率。
 * 同一个对象按三个月重复出现，8 个对象 × 3 = 24 行，与参考图「共 24 条数据」一致。
 */

/** 企业页签的列 */
export const TRAVEL_DOUBT_ENTERPRISE_COLUMNS: readonly DrillColumn[] = [
  { key: 'code', title: '企业编码', width: '240px', align: 'left', sortable: true },
  { key: 'name', title: '企业名称', width: 'minmax(0,1fr)', align: 'left' },
  { key: 'total', title: '商旅疑点订单总量', width: '260px', sortable: true },
  { key: 'confirmed', title: '疑点订单确认量', width: '250px' },
  { key: 'amount', title: '疑点订单核销金额', width: '250px', sortable: true },
  { key: 'cancelRate', title: '商旅预订取消率', width: '240px' },
]

/** 个人页签的列 */
export const TRAVEL_DOUBT_PERSON_COLUMNS: readonly DrillColumn[] = [
  { key: 'code', title: '员工编号', width: '240px', align: 'left', sortable: true },
  { key: 'name', title: '员工姓名', width: 'minmax(0,1fr)', align: 'left' },
  { key: 'total', title: '商旅疑点订单总量', width: '260px', sortable: true },
  { key: 'confirmed', title: '疑点订单确认量', width: '250px' },
  { key: 'amount', title: '疑点订单核销金额', width: '250px', sortable: true },
  { key: 'cancelRate', title: '商旅预订取消率', width: '240px' },
]

/** 企业页签的对象，照参考图 6 */
const DOUBT_ENTERPRISES: readonly (readonly [string, string, string, string, string])[] = [
  ['2300', '华东公司', '73', '5', '56'],
  ['6200', '储运技术公司', '41', '6', '12'],
  ['7500', '甘肃公司', '96', '7', '89'],
  ['7900', '广西公司', '18', '8', '37'],
  ['2800', '新疆煤制天然气外输管道公司', '52', '9', '74'],
  ['2600', '华北公司', '87', '10', '21'],
  ['7000', '东北公司', '34', '11', '65'],
  ['2100', '华南公司', '60', '12', '48'],
]

/** 个人页签的对象，照参考图 7 */
const DOUBT_PERSONS: readonly (readonly [string, string, string, string, string])[] = [
  ['100100', '张丽', '73', '5', '56'],
  ['100101', '王巧', '41', '6', '12'],
  ['100102', '李思', '96', '7', '89'],
  ['100103', '徐亚', '18', '8', '37'],
  ['100104', '张颖', '52', '9', '74'],
  ['100105', '阮仟', '87', '10', '21'],
  ['100106', '刘琦', '34', '11', '65'],
  ['100107', '思思', '60', '12', '48'],
]

/** 取消率：同一对象三行依次取三个值，照参考图 */
const DOUBT_CANCEL_RATES: readonly (readonly [string, string, string])[] = [
  ['64.71%', '58.74%', '35.89%'],
  ['28.53%', '48.74%', '28.53%'],
  ['91.30%', '91.74%', '63.60%'],
  ['47.42%', '25.82%', '45.82%'],
  ['79.24%', '52.24%', '72.24%'],
  ['13.68%', '33.68%', '24.68%'],
  ['55.69%', '57.49%', '82.15%'],
  ['42.15%', '61.36%', '49.28%'],
]

/** 把「对象 × 3 行」展开成 24 行 */
function buildRows(
  items: readonly (readonly [string, string, string, string, string])[]
): readonly string[][] {
  const rows: string[][] = []

  items.forEach(([code, name, total, confirmed, amount], i) => {
    const rates = DOUBT_CANCEL_RATES[i]
    rates.forEach((rate) => {
      rows.push([code, name, total, confirmed, amount, rate])
    })
  })

  return rows
}

/** 企业页签的 24 行 */
export const TRAVEL_DOUBT_ENTERPRISE_ROWS: readonly string[][] = buildRows(DOUBT_ENTERPRISES)

/** 个人页签的 24 行 */
export const TRAVEL_DOUBT_PERSON_ROWS: readonly string[][] = buildRows(DOUBT_PERSONS)
