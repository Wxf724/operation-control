/** 商旅业务管理平台中间业务区的模拟数据（对应线上截图 `_refs/live/20-商旅业务管理平台.png`） */

/* ───────────── 商旅使用情况 ───────────── */

/** 月份类目轴，四张图共用 */
export const TRAVEL_MONTHS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月']

/** 商旅平台总体使用率 */
export const TRAVEL_PLATFORM_RATE = '82.0%'

/** 半圆仪表盘上的一项使用率 */
export interface TravelGaugeStat {
  label: string
  /** 0–100 */
  value: number
  /** 主题色变量名，含 `--` 前缀 */
  tone: string
}

/** 火车 / 飞机 / 酒店三个半圆仪表盘 */
export const TRAVEL_USAGE_GAUGES: TravelGaugeStat[] = [
  { label: '火车', value: 82, tone: '--ck-cyan' },
  { label: '飞机', value: 82, tone: '--ck-green' },
  { label: '酒店', value: 82, tone: '--ck-purple' },
]

/** 商旅业务整体情况环形图的一瓣 + 对应图例 */
export interface TravelShareRow {
  label: string
  amount: string
  unit: string
  /** 占比，0–100 */
  share: number
  tone: string
}

/** 火车 / 飞机 / 酒店的金额与占比 */
export const TRAVEL_BUSINESS_SHARES: TravelShareRow[] = [
  { label: '火车', amount: '800.0', unit: '元', share: 40, tone: '--ck-cyan' },
  { label: '飞机', amount: '600.0', unit: '元', share: 30, tone: '--ck-green' },
  { label: '酒店', amount: '600.0', unit: '元', share: 30, tone: '--ck-purple' },
]

/** 商旅预订订单总金额柱状图，单位：万元 */
export const TRAVEL_ORDER_AMOUNTS = [3100, 1800, 4300, 4400, 5000, 4350, 4800, 4750, 4700, 2350]

/** 商旅价格波动情况的口径下拉选项 */
export const TRAVEL_PRICE_FILTERS = ['日均预定张数', '日均预定金额', '日均出行人次']

/** 价格波动折线图的一条线 */
export interface TravelPriceSeries {
  name: string
  tone: string
  data: number[]
}

/** 商旅价格波动情况：火车 / 飞机 / 酒店日均预定张数 */
export const TRAVEL_PRICE_SERIES: TravelPriceSeries[] = [
  { name: '火车', tone: '--ck-cyan', data: [390, 225, 470, 465, 487, 470, 465, 462, 487, 230] },
  { name: '飞机', tone: '--ck-green', data: [80, 95, 120, 120, 140, 125, 115, 120, 150, 65] },
  { name: '酒店', tone: '--ck-purple', data: [250, 100, 340, 335, 345, 345, 348, 350, 335, 160] },
]

/** 常住酒店价格浮动情况，单位：元 */
export const TRAVEL_HOTEL_PRICES = [308, 165, 425, 440, 490, 435, 474, 473, 468, 223]

/** 常飞航线综合折扣率，单位：折 */
export const TRAVEL_FLIGHT_DISCOUNTS = [3, 2, 4, 4, 5, 4, 5, 5, 5, 2]

/* ───────────── 商旅出行情况 ───────────── */

/** 热门出差目的地 TOP20 表格的一行 */
export interface TravelDestRow {
  index: number
  city: string
  /** 热门目的地费用总金额 */
  amount: string
  /** 行内进度条长度，0–100 */
  percent: number
}

/** 热门出差目的地 TOP10 明细 */
export const TRAVEL_DEST_ROWS: TravelDestRow[] = [
  { index: 1, city: '北京', amount: '15,280.0', percent: 100 },
  { index: 2, city: '廊坊市', amount: '7,560.0', percent: 49 },
  { index: 3, city: '青岛市', amount: '6,990.0', percent: 46 },
  { index: 4, city: '西安市', amount: '5,870.0', percent: 38 },
  { index: 5, city: '成都市', amount: '4,490.0', percent: 29 },
  { index: 6, city: '天津市', amount: '3,820.0', percent: 25 },
  { index: 7, city: '上海', amount: '3,650.0', percent: 24 },
  { index: 8, city: '杭州市', amount: '3,460.0', percent: 23 },
  { index: 9, city: '南京市', amount: '3,230.0', percent: 21 },
  { index: 10, city: '重庆市', amount: '3,080.0', percent: 20 },
]

/** 退改签情况里的一个圆环指标 */
export interface TravelRingStat {
  /** 环上填充比例，0–100 */
  value: number
  display: string
  /** 圆环下方的两行说明 */
  lines: [string, string]
  tone: string
  /** 底环色，取较暗的同色系 */
  trackTone: string
}

/** 退票改签发生率 / 逾期未出行发生率 */
export const TRAVEL_CHANGE_RINGS: TravelRingStat[] = [
  {
    value: 17,
    display: '17%',
    lines: ['退票改签', '发生率'],
    tone: '--ck-cyan',
    trackTone: '--ck-green',
  },
  {
    value: 9,
    display: '9.0%',
    lines: ['逾期未出行', '发生率'],
    tone: '--ck-red',
    trackTone: '--ck-purple',
  },
]

/** 改签 / 退票小表的一行 */
export interface TravelChangeRow {
  dim: string
  count: string
  /** 总金额，单位：万元 */
  amount: string
}

/** 用户退改签情况小表 */
export const TRAVEL_CHANGE_ROWS: TravelChangeRow[] = [
  { dim: '改签', count: '600', amount: '60.0' },
  { dim: '退票', count: '300', amount: '100.0' },
]

/** 带细进度条的一行占比 / 金额 */
export interface TravelBarRow {
  label: string
  value: string
  /** 进度条填充长度，0–100 */
  percent: number
  tone: string
}

/** 逾期未出行在火车 / 飞机 / 酒店上的发生占比 */
export const TRAVEL_OVERDUE_SHARES: TravelBarRow[] = [
  { label: '火车', value: '12%', percent: 24, tone: '--ck-cyan' },
  { label: '飞机', value: '6%', percent: 12, tone: '--ck-green' },
  { label: '酒店', value: '6%', percent: 12, tone: '--ck-purple' },
]

/** 逾期未出行订单总金额，单位：万元 */
export const TRAVEL_OVERDUE_TOTAL = '8,000.0'

/** 逾期未出行订单金额按出行方式拆分 */
export const TRAVEL_OVERDUE_AMOUNTS: TravelBarRow[] = [
  { label: '火车', value: '4,000.0万元', percent: 72, tone: '--ck-cyan' },
  { label: '飞机', value: '2,000.0万元', percent: 36, tone: '--ck-green' },
  { label: '酒店', value: '2,000.0万元', percent: 36, tone: '--ck-purple' },
]

/* ───────────── 商旅报销情况 ───────────── */

/** 住宿 / 交通费用超标情况 */
export interface TravelOverStandard {
  title: string
  label: string
  value: string
  unit: string
  /** 超标比率，0–100 */
  rate: number
}

/** 两块费用超标情况 */
export const TRAVEL_OVER_STANDARDS: TravelOverStandard[] = [
  { title: '住宿费用超标情况', label: '住宿费用超标订单量', value: '263', unit: '个', rate: 13.8 },
  { title: '交通费用超标情况', label: '交通费用超标订单量', value: '263', unit: '个', rate: 10.6 },
]

/** 商旅成本入账率 */
export const TRAVEL_COST_GAUGE = { value: 91, caption: '商旅成本入账率' }

/** 商旅报销及时率 */
export const TRAVEL_TIMELY_GAUGE = { value: 91, caption: '商旅报销及时率' }

/** 超期报销明细表的一行 */
export interface TravelOverdueReimbRow {
  dim: string
  orders: string
  amount: string
}

/** 用户的超期报销情况明细 */
export const TRAVEL_OVERDUE_REIMB_ROWS: TravelOverdueReimbRow[] = [
  { dim: '火车', orders: '600张', amount: '60.0万元' },
  { dim: '飞机', orders: '300张', amount: '100.0万元' },
  { dim: '酒店', orders: '200张', amount: '50.0万元' },
]

/* ───────────── 商旅疑点订单情况 ───────────── */

/** 商旅疑点订单总量，单位：个 */
export const TRAVEL_DOUBT_TOTAL = '1,000'

/** 疑点订单确认 / 待核实的拆分图例 */
export const TRAVEL_DOUBT_LEGEND: TravelShareRow[] = [
  { label: '商旅疑点订单确认量', amount: '950', unit: '张', share: 95, tone: '--ck-cyan' },
  { label: '商旅疑点订单待核实量', amount: '50', unit: '张', share: 5, tone: '--ck-orange' },
]

/** 商旅疑点订单确认率，0–100 */
export const TRAVEL_DOUBT_RATE = 95
