import type { DrillColumn, DrillMetric } from './types'
import type { TravelSeries } from './travelChartOptions'

/**
 * 钻取明细页 ·「商旅出行情况」的静态内容（参考图 4）。
 *
 * 六个指标卡（4 + 2 两行）+ 热门目的城市柱图 + 出差城市雷达 + 两个环形
 * + 报销预订天数与退改签周期表 + 退票改签情况-个人表。
 */

/** 指标卡：第一行 4 张、第二行 2 张 */
export const TRAVEL_TRIP_METRICS: readonly (readonly DrillMetric[])[] = [
  [
    { icon: 'ri-flight-takeoff-line', label: '出差次数', value: '100', colorVar: '--ck-cyan' },
    {
      icon: 'ri-calendar-check-line',
      label: '平均提前预订天数',
      value: '5.1',
      colorVar: '--ck-blue',
    },
    {
      icon: 'ri-refund-2-line',
      label: '退票改签发生率',
      value: '13.00%',
      colorVar: '--ck-blue',
    },
    {
      icon: 'ri-money-cny-circle-line',
      label: '退票改签总损失金额',
      value: '11,950',
      colorVar: '--ck-blue',
    },
  ],
  [
    {
      icon: 'ri-error-warning-line',
      label: '退票未出行发生率',
      value: '0.00%',
      colorVar: '--ck-blue',
    },
    {
      icon: 'ri-file-list-3-line',
      label: '逾期未出行订单总金额',
      value: '0',
      colorVar: '--ck-blue',
    },
  ],
]

/** 热门目的城市 top20 */
export const TRAVEL_TOP_CITIES: readonly string[] = [
  '上海',
  '南京',
  '重庆',
  '广州',
  '西安',
  '天水',
  '杭州',
  '成都',
  '长沙',
  '合肥',
  '济南',
  '青岛',
  '厦门',
  '昆明',
  '福州',
  '贵阳',
  '南宁',
  '银川',
  '哈尔滨',
  '沈阳',
]

export const TRAVEL_TOP_CITY_SERIES: readonly TravelSeries[] = [
  {
    name: '出差次数',
    colorVar: '--ck-cyan',
    values: [100, 92, 84, 76, 68, 62, 56, 52, 48, 44, 40, 36, 32, 28, 26, 24, 22, 20, 18, 16],
  },
]

/** 出差城市分布雷达的维度与取值 */
export const TRAVEL_RADAR_INDICATORS: readonly string[] = [
  '常用酒店',
  '提前预订',
  '酒店客户',
  '退单折扣',
  '酒店延期',
  '出差频次',
]

export const TRAVEL_RADAR_VALUES: readonly number[] = [9, 6, 8, 7, 5, 9]

/** 交通工具分布环形 */
export const TRAVEL_VEHICLE_DONUT: readonly { label: string; value: number; colorVar: string }[] = [
  { label: '火车', value: 45, colorVar: '--ck-cyan' },
  { label: '飞机', value: 33, colorVar: '--ck-blue' },
  { label: '酒店', value: 22, colorVar: '--ck-teal' },
]

/** 出差天数分布环形 */
export const TRAVEL_DAYS_DONUT: readonly { label: string; value: number; colorVar: string }[] = [
  { label: '1天', value: 12.9, colorVar: '--ck-cyan' },
  { label: '3天', value: 6.3, colorVar: '--ck-blue' },
  { label: '5天', value: 3.7, colorVar: '--ck-teal' },
  { label: '7天以上', value: 2.5, colorVar: '--ck-purple' },
]

/** 报销预订天数与退改签周期表 */
export const TRAVEL_CYCLE_COLUMNS: readonly DrillColumn[] = [
  { key: 'range', title: '退票改签天数区间', width: '240px', align: 'left' },
  { key: 'trainRate', title: '火车 · 改签到付比', width: '200px' },
  { key: 'trainShare', title: '火车 · 改签订单占比', width: '210px' },
  { key: 'hotelRate', title: '酒店 · 改签到付比', width: '200px' },
  { key: 'hotelShare', title: '酒店 · 改签订单占比', width: '210px' },
  { key: 'flightRate', title: '机票 · 改签到付比', width: '200px' },
  { key: 'flightShare', title: '机票 · 改签订单占比', width: 'minmax(0,1fr)' },
]

export const TRAVEL_CYCLE_ROWS: readonly string[][] = [
  ['0-3天', '9.09%', '0.00%', '0.00%', '0.00%', '0.00%', '0.00%'],
  ['3-7天', '9.09%', '9.09%', '0.00%', '0.00%', '12.50%', '12.50%'],
  ['7-15天', '10.53%', '5.26%', '0.00%', '0.00%', '7.69%', '6.00%'],
  ['15天以上', '0.00%', '20.00%', '0.00%', '0.00%', '10.00%', '15.00%'],
]

/** 退票改签情况-个人表：每个交通工具三列 */
export const TRAVEL_CHANGE_COLUMNS: readonly DrillColumn[] = [
  { key: 'code', title: '员工编号', width: '170px', align: 'left', sortable: true },
  { key: 'name', title: '员工姓名', width: '150px', align: 'left' },
  { key: 'trainCount', title: '火车 · 改签订单量', width: '190px' },
  { key: 'trainAmount', title: '火车 · 改签订单总额', width: '190px' },
  { key: 'trainRefund', title: '火车 · 退票扣款总额', width: '190px' },
  { key: 'hotelCount', title: '酒店 · 改签订单量', width: '190px' },
  { key: 'hotelAmount', title: '酒店 · 改签订单总额', width: '190px' },
  { key: 'hotelRefund', title: '酒店 · 退票扣款总额', width: '190px' },
  { key: 'flightCount', title: '机票 · 改签订单量', width: '190px' },
  { key: 'flightAmount', title: '机票 · 改签订单总额', width: '190px' },
  { key: 'flightRefund', title: '机票 · 退票扣款总额', width: 'minmax(0,1fr)' },
]

const CHANGE_STAFF: readonly (readonly [string, string])[] = [
  ['1001', '张丽'],
  ['1002', '王巧'],
  ['1003', '李思'],
  ['1004', '徐亚'],
  ['1005', '张颖'],
  ['1006', '阮仟'],
  ['1007', '刘琦'],
  ['1008', '思思'],
  ['1009', '齐乔'],
  ['1010', '王洒'],
  ['1011', '刘超'],
  ['1012', '刘涛'],
  ['1013', '张新宇'],
]

/** 个人退改签明细：按行号生成确定性数值，首行照参考图带一笔机票损失 */
export const TRAVEL_CHANGE_ROWS: readonly string[][] = CHANGE_STAFF.map(([code, name], i) => {
  if (i === 0) {
    return [code, name, '0', '0', '0', '0', '0', '0', '1', '1,300', '1,300']
  }
  const trainCount = i % 4 === 0 ? '1' : '0'
  const hotelCount = i % 5 === 0 ? '1' : '0'
  const flightCount = i % 3 === 0 ? '1' : '0'
  return [
    code,
    name,
    trainCount,
    trainCount === '1' ? String(120 + i * 30) : '0',
    trainCount === '1' ? String(20 + i * 5) : '0',
    hotelCount,
    hotelCount === '1' ? String(340 + i * 40) : '0',
    hotelCount === '1' ? String(60 + i * 10) : '0',
    flightCount,
    flightCount === '1' ? String(900 + i * 120) : '0',
    flightCount === '1' ? String(180 + i * 20) : '0',
  ]
})
