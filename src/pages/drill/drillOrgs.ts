import type { DrillOrgRow } from './types'

/**
 * 33 家单位的基础明细数据（单位编号 / 单位名称 / 本期 / 同期）。
 *
 * 取自 `_refs/live/40-钻取-作业处理整体情况.png` 的「单据接收量-单位」页签，
 * 三个钻取页共用这一份机构清单，各页签按倍率派生各自的数值，属于模拟数据。
 */
export const DRILL_ORG_ROWS: DrillOrgRow[] = [
  { code: '1000', name: '集团公司总部', value: 9939, prior: 8939 },
  { code: '1010', name: '油气调控中心', value: 3940, prior: 2940 },
  { code: '1020', name: '建设项目管理公司', value: 49236, prior: 48236 },
  { code: '1030', name: '工程质量监督检验公司', value: 2835, prior: 1835 },
  { code: '1050', name: '工程技术创新公司', value: 17496, prior: 16496 },
  { code: '1060', name: '研究总院', value: 13494, prior: 12494 },
  { code: '1070', name: '北京智网数科公司', value: 8989, prior: 7989 },
  { code: '1080', name: '共享运营公司', value: 27146, prior: 26146 },
  { code: '1200', name: '西部管道公司', value: 48548, prior: 47548 },
  { code: '1500', name: '西南管道公司', value: 71869, prior: 70869 },
  { code: '1600', name: '北方管道公司', value: 114492, prior: 113492 },
  { code: '1700', name: '西气东输公司', value: 72146, prior: 71146 },
  { code: '1800', name: '北京管道公司', value: 52427, prior: 51427 },
  { code: '2100', name: '华南公司', value: 69336, prior: 68336 },
  { code: '2200', name: '华中公司', value: 60361, prior: 59361 },
  { code: '2300', name: '华东公司', value: 3057, prior: 2057 },
  { code: '2600', name: '华北公司', value: 2510, prior: 1510 },
  { code: '2700', name: '东部原油储运公司', value: 92984, prior: 91984 },
  { code: '2800', name: '新疆煤制天然气外输管道公司', value: 813, prior: 187 },
  { code: '3000', name: '液化天然气接收站管理公司', value: 26999, prior: 25999 },
  { code: '6100', name: '燕祉商务服务公司', value: 5211, prior: 4211 },
  { code: '6200', name: '储运技术公司', value: 24818, prior: 23818 },
  { code: '6300', name: '储能技术公司', value: 18977, prior: 17977 },
  { code: '7000', name: '东北公司', value: 78933, prior: 77933 },
  { code: '7200', name: '浙江省天然气管网公司', value: 29175, prior: 28175 },
  { code: '7300', name: '西北公司', value: 64542, prior: 63542 },
  { code: '7500', name: '甘肃公司', value: 48091, prior: 47091 },
  { code: '7600', name: '湖南公司', value: 31616, prior: 30616 },
  { code: '7700', name: '福建公司', value: 19370, prior: 18370 },
  { code: '7800', name: '云南公司', value: 37379, prior: 36379 },
  { code: '7900', name: '广西公司', value: 28636, prior: 27636 },
  { code: '8100', name: '山东公司', value: 85759, prior: 84759 },
  { code: 'DGT', name: '党工团', value: 21934, prior: 20934 },
]

/** 六大区域中心 */
export const DRILL_CENTER_ROWS: DrillOrgRow[] = [
  { code: 'C01', name: '北部中心', value: 268430, prior: 254118 },
  { code: 'C02', name: '东部中心', value: 231905, prior: 226740 },
  { code: 'C03', name: '西部中心', value: 198362, prior: 190214 },
  { code: 'C04', name: '南部中心', value: 214877, prior: 203556 },
  { code: 'C05', name: '中部中心', value: 176240, prior: 171098 },
  { code: 'C06', name: '驻区服务部', value: 153244, prior: 149307 },
]

/** 业务场景 */
export const DRILL_SCENE_ROWS: DrillOrgRow[] = [
  { code: 'S01', name: '差旅费报销', value: 312486, prior: 298213 },
  { code: 'S02', name: '日常费用报销', value: 274931, prior: 266508 },
  { code: 'S03', name: '采购付款', value: 186742, prior: 179630 },
  { code: 'S04', name: '工程结算', value: 142087, prior: 138914 },
  { code: 'S05', name: '薪酬发放', value: 98354, prior: 94726 },
  { code: 'S06', name: '资产业务', value: 76219, prior: 73508 },
  { code: 'S07', name: '税务申报', value: 54128, prior: 52370 },
  { code: 'S08', name: '资金结算', value: 97311, prior: 93842 },
]

/** 业务环节 */
export const DRILL_STEP_ROWS: DrillOrgRow[] = [
  { code: 'E01', name: '单据接收', value: 243058, prior: 236417 },
  { code: 'E02', name: '影像采集', value: 228614, prior: 221903 },
  { code: 'E03', name: '单据审核', value: 215730, prior: 208566 },
  { code: 'E04', name: '合规校验', value: 189422, prior: 182055 },
  { code: 'E05', name: '账务处理', value: 173905, prior: 168243 },
  { code: 'E06', name: '支付结算', value: 158316, prior: 152480 },
  { code: 'E07', name: '归档入库', value: 134013, prior: 129394 },
]

/** 负载页用的口径：参考图里不含集团公司总部与党工团，共 31 家 */
export const DRILL_LOAD_ORG_ROWS: DrillOrgRow[] = DRILL_ORG_ROWS.filter(
  (row) => row.code !== '1000' && row.code !== 'DGT'
).map((row) =>
  row.code === '2100'
    ? { ...row, name: '华南公司（广东省管网公司）' }
    : row.code === '2200'
      ? { ...row, name: '湖北公司' }
      : row
)

/**
 * 按倍率派生一组模拟数值。
 *
 * 各页签的口径不同但机构清单一致，用确定性倍率派生，
 * 保证每次渲染结果稳定（不要用 Math.random，否则截图不可复现）。
 */
export function scaleRows(rows: DrillOrgRow[], factor: number, priorFactor = 0.97): DrillOrgRow[] {
  return rows.map((row) => ({
    ...row,
    value: Math.max(1, Math.round(row.value * factor)),
    prior: Math.max(1, Math.round(row.prior * factor * priorFactor)),
  }))
}
