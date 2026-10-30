import type { DrillColumn, DrillMetric } from './types'

/**
 * 钻取明细页 ·「稽核过程与效率情况」的静态内容（参考图 6／7／8）。
 *
 * 三个页签（凭证／要素／档案）各自一套指标，下面叠两张同构的明细表：
 * 上表按「环节（岗位）」、下表按「个人（员工）」聚合。
 * 凭证页签的行照抄参考图，其余页签按同一结构换一套确定性数值。
 */

/** 一个页签下的完整内容 */
export interface QualityCaptureView {
  /** 卡片小标题，如「凭证捕获完成情况」 */
  tableTitle: string
  /** 口径词：凭证 / 报表 / 档案 */
  unit: string
  /** 指标条 5 项 */
  metrics: readonly DrillMetric[]
  /** 上表：环节（岗位） */
  stageRows: readonly string[][]
  /** 下表：个人（员工） */
  staffRows: readonly string[][]
  /** 行点击落到哪个明细页：凭证/要素 → 待抽样核查明细，档案 → 单据明细 */
  detail: 'check' | 'doc'
}

/** 「环节」表的列：口径词拼进表头 */
export function buildCaptureStageColumns(unit: string): readonly DrillColumn[] {
  return [
    { key: 'postCode', title: '岗位编号', width: '300px', sortable: true },
    { key: 'postName', title: '岗位名称', width: 'minmax(0,1fr)', align: 'left' },
    { key: 'total', title: `${unit}捕获总量`, width: '250px' },
    { key: 'done', title: `${unit}捕获完成量`, width: '270px' },
    { key: 'pending', title: `待处理捕获${unit}量`, width: '290px' },
    { key: 'rate', title: `${unit}捕获完成率`, width: '250px', sortable: true },
    { key: 'duration', title: '抽核平均处理时长', width: '260px' },
    { key: 'timely', title: '抽核报告及时出具比率', width: '290px' },
  ]
}

/** 「个人」表的列：第 1、2 列换成员工编号与姓名 */
export function buildCaptureStaffColumns(unit: string): readonly DrillColumn[] {
  return [
    { key: 'staffCode', title: '员工编号', width: '300px', sortable: true },
    { key: 'staffName', title: '员工姓名', width: 'minmax(0,1fr)', align: 'left' },
    { key: 'total', title: `${unit}捕获总量`, width: '250px' },
    { key: 'done', title: `${unit}捕获完成量`, width: '270px' },
    { key: 'pending', title: `待处理捕获${unit}量`, width: '290px' },
    { key: 'rate', title: `${unit}捕获完成率`, width: '250px', sortable: true },
    { key: 'duration', title: '抽核平均处理时长', width: '260px' },
    { key: 'timely', title: '抽核报告及时出具比率', width: '290px' },
  ]
}

/** 环节（岗位）编号与名称：参考图 6 上表 */
const STAGE_NAMES: readonly (readonly [string, string])[] = [
  ['50013001', '南港：总账报表复制岗'],
  ['50013002', '南港：总账报表复制岗'],
  ['50013003', '南港：资产报废凭证制证岗'],
  ['50013004', '南港：资产报废审核岗'],
  ['50013005', '南港：总账报表制证岗'],
  ['50013006', '南港：部分报销审核岗'],
  ['50013007', '南港：总账报表复核岗'],
  ['50013008', '南港：总账报表归档岗'],
  ['50013009', '南港：总账报表制证岗'],
  ['1000100001100', '安徽销售（销售、尚）'],
  ['50013002', '南港：总账报表制证岗'],
  ['50013003', '南港：总账报表归档岗'],
  ['50013004', '南港：总账报表复制岗'],
  ['50013005', '南港：总账报表归档岗'],
]

/** 凭证页签「环节」表的数值，照抄参考图 6 */
const VOUCHER_STAGE_NUMBERS: readonly string[][] = [
  ['4,314', '997', '3,317', '23.00%', '1.49', '91.17%'],
  ['3,117', '1,291', '2,136', '36.00%', '0.34', '92.58%'],
  ['4,472', '2,773', '1,699', '62.00%', '2.46', '50.81%'],
  ['4,110', '1,726', '2,384', '42.00%', '2.84', '50.81%'],
  ['3,508', '1,517', '235', '87.00%', '0.34', '96.16%'],
  ['4,537', '4,129', '408', '91.00%', '2.18', '74.25%'],
  ['1,317', '864', '353', '66.00%', '1.85', '54.69%'],
  ['3,648', '3,539', '109', '97.00%', '1.85', '56.54%'],
  ['3,183', '1,751', '1,432', '55.00%', '1.15', '96.20%'],
  ['4,529', '996', '3,533', '22.00%', '1.79', '60.90%'],
  ['1,250', '988', '263', '79.00%', '2.93', '82.29%'],
  ['1,963', '1,363', '605', '28.00%', '1.50', '70.65%'],
  ['2,689', '807', '1,882', '30.00%', '0.91', '62.63%'],
  ['1,530', '1,209', '321', '79.00%', '0.51', '50.05%'],
]

/** 员工编号与姓名：参考图 6 下表能看清的 14 人 + 补齐到 34 人 */
const STAFF_NAMES: readonly (readonly [string, string])[] = [
  ['27070525', '李子明'],
  ['33000005', '胡楠'],
  ['16000602', '赵新旭'],
  ['16000910', '刘军'],
  ['15000063', '兵纳'],
  ['15000064', '翟俊'],
  ['27007113', '孟锦锐'],
  ['15000005', '李娟'],
  ['17001825', '史文萍'],
  ['27070265', '王瑾'],
  ['27007208', '董鑫芳'],
  ['16000339', '曹甜'],
  ['27007217', '杜若达'],
  ['27007004', '张磊'],
  ['16000202', '曹佳'],
  ['15000049', '潘婉'],
  ['18000150', '余家林'],
  ['19000200', '孟鑫'],
  ['19000310', '苗丽'],
  ['19000420', '许小燕'],
  ['20000550', '吕晓峰'],
  ['20000660', '鲍永峰'],
  ['21000770', '苏晓峰'],
  ['21000880', '梁鑫'],
  ['22000990', '苏瑜'],
  ['22001010', '张瑜'],
  ['23001120', '苗嘉'],
  ['23001230', '杨嘉'],
  ['24001340', '汤倩'],
  ['24001450', '钱倩'],
  ['25001560', '周艳'],
  ['25001670', '封爽'],
  ['26001780', '吴爽'],
  ['26001890', '张梁'],
]

/** 凭证页签「个人」表的数值，照抄参考图 6 */
const VOUCHER_STAFF_NUMBERS: readonly string[][] = [
  ['4,314', '997', '3,317', '23.00%', '1.49', '91.17%'],
  ['3,337', '1,291', '2,136', '36.00%', '0.34', '92.58%'],
  ['4,472', '2,773', '1,699', '62.00%', '2.46', '50.81%'],
  ['4,110', '1,726', '2,384', '42.00%', '2.84', '50.81%'],
  ['1,868', '1,517', '235', '87.00%', '2.18', '74.25%'],
  ['4,537', '4,129', '408', '91.00%', '1.85', '54.69%'],
  ['1,317', '864', '353', '66.00%', '1.85', '56.54%'],
  ['3,648', '3,539', '109', '97.00%', '2.93', '82.29%'],
  ['3,183', '1,751', '1,432', '55.00%', '2.93', '82.29%'],
  ['4,529', '996', '3,533', '22.00%', '1.79', '60.90%'],
  ['1,250', '988', '263', '79.00%', '2.93', '82.29%'],
  ['1,963', '1,363', '605', '28.00%', '1.50', '70.65%'],
  ['2,689', '807', '1,882', '30.00%', '0.91', '62.63%'],
  ['1,530', '1,209', '321', '79.00%', '0.51', '50.05%'],
]

/** 千分位 */
function formatCount(value: number): string {
  return value.toLocaleString('en-US')
}

/** 由行号推出一组确定性数值：总量 / 完成量 / 待处理量 / 完成率 / 时长 / 及时率 */
function buildNumbers(seed: number, shift: number): string[] {
  const total = 240 + ((seed * 977 + shift * 131) % 4300)
  const rate = 12 + ((seed * 37 + shift * 7) % 86)
  const done = Math.round((total * rate) / 100)
  const pending = total - done
  const duration = (0.3 + ((seed * 13 + shift * 3) % 260) / 100).toFixed(2)
  const timely = (48 + ((seed * 29 + shift * 5) % 52)).toFixed(2)

  return [
    formatCount(total),
    formatCount(done),
    formatCount(pending),
    `${rate.toFixed(2)}%`,
    duration,
    `${timely}%`,
  ]
}

/** 环节表：凭证页签照抄参考图，其余页签换一套数值 */
function buildStageRows(shift: number): readonly string[][] {
  return STAGE_NAMES.map(([code, name], i) => [
    code,
    name,
    ...(shift === 0 ? VOUCHER_STAGE_NUMBERS[i] : buildNumbers(i + 1, shift)),
  ])
}

/** 个人表：凭证页签前 14 行照抄参考图，其余按行号生成（共 34 人） */
function buildStaffRows(shift: number): readonly string[][] {
  return STAFF_NAMES.map(([code, name], i) => {
    const seeded = shift === 0 && i < VOUCHER_STAFF_NUMBERS.length
    return [code, name, ...(seeded ? VOUCHER_STAFF_NUMBERS[i] : buildNumbers(i + 1, shift))]
  })
}

/** 三个页签的指标、标题与明细行 */
export const QUALITY_CAPTURE_VIEWS: Record<string, QualityCaptureView> = {
  voucher: {
    tableTitle: '凭证捕获完成情况',
    unit: '凭证',
    detail: 'check',
    metrics: [
      {
        icon: 'ri-file-list-3-line',
        label: '凭证捕获完成量',
        value: '39,161',
        unit: '笔',
        colorVar: '--ck-cyan',
      },
      {
        icon: 'ri-time-line',
        label: '待处理捕获凭证量',
        value: '30,050',
        unit: '笔',
        colorVar: '--ck-blue',
      },
      {
        icon: 'ri-pie-chart-line',
        label: '凭证捕获完成率',
        value: '56.58%',
        colorVar: '--ck-green',
      },
      {
        icon: 'ri-timer-line',
        label: '抽核平均处理时长',
        value: '1.61',
        unit: '分钟',
        colorVar: '--ck-purple',
      },
      {
        icon: 'ri-shield-check-line',
        label: '质检报告及时出具比率',
        value: '72.79%',
        colorVar: '--ck-teal',
      },
    ],
    stageRows: buildStageRows(0),
    staffRows: buildStaffRows(0),
  },

  element: {
    tableTitle: '报表捕获完成情况',
    unit: '报表',
    detail: 'check',
    metrics: [
      {
        icon: 'ri-file-chart-line',
        label: '报表捕获完成量',
        value: '31,338',
        unit: '笔',
        colorVar: '--ck-cyan',
      },
      {
        icon: 'ri-time-line',
        label: '待处理捕获报表量',
        value: '23,805',
        unit: '笔',
        colorVar: '--ck-blue',
      },
      {
        icon: 'ri-pie-chart-line',
        label: '报表捕获完成率',
        value: '56.83%',
        colorVar: '--ck-green',
      },
      {
        icon: 'ri-timer-line',
        label: '抽核平均处理时长',
        value: '1.76',
        unit: '分钟',
        colorVar: '--ck-purple',
      },
      {
        icon: 'ri-shield-check-line',
        label: '质检报告及时出具比率',
        value: '76.15%',
        colorVar: '--ck-teal',
      },
    ],
    stageRows: buildStageRows(3),
    staffRows: buildStaffRows(3),
  },

  archive: {
    tableTitle: '档案捕获完成情况',
    unit: '档案',
    detail: 'doc',
    metrics: [
      {
        icon: 'ri-archive-2-line',
        label: '档案捕获完成量',
        value: '25,806',
        unit: '笔',
        colorVar: '--ck-cyan',
      },
      {
        icon: 'ri-time-line',
        label: '待处理捕获档案量',
        value: '18,477',
        unit: '笔',
        colorVar: '--ck-blue',
      },
      {
        icon: 'ri-pie-chart-line',
        label: '档案捕获完成率',
        value: '58.28%',
        colorVar: '--ck-green',
      },
      {
        icon: 'ri-timer-line',
        label: '抽核平均处理时长',
        value: '1.52',
        unit: '分钟',
        colorVar: '--ck-purple',
      },
      {
        icon: 'ri-shield-check-line',
        label: '质检报告及时出具比率',
        value: '71.23%',
        colorVar: '--ck-teal',
      },
    ],
    stageRows: buildStageRows(7),
    staffRows: buildStaffRows(7),
  },
}
