import type { DrillColumn } from './types'

/**
 * 单据明细钻取页（参考图 3）的列定义与模拟数据。
 *
 * 参考图底部是「显示 200 条数据 / 1 /200」，即 4 万条单据；
 * 4 万行不预生成进内存，翻页时按 `getRpaDocRows` 按需生成，
 * 生成规则全部由行号推出（不用 `Math.random`），每次截图都一样。
 */

/** 单据明细表的 11 列（「序号」列由表格组件自动补在最左） */
export const RPA_DOC_COLUMNS: readonly DrillColumn[] = [
  { key: 'orgCode', title: '组织编码', width: '190px', align: 'left' },
  { key: 'orgName', title: '组织名称', width: '290px', align: 'left' },
  { key: 'docNo', title: '单据编号', width: '240px', align: 'left' },
  { key: 'makerAccount', title: '制单人账号', width: '140px', align: 'left' },
  { key: 'makerName', title: '制单人姓名', width: '120px', align: 'left' },
  { key: 'bizCode', title: '业务类型编码', width: '140px', align: 'left' },
  { key: 'bizName', title: '业务类型名称', width: '160px', align: 'left' },
  { key: 'settleNo', title: '结算单编号', width: '210px', align: 'left' },
  { key: 'originNo', title: '原始单据编号', width: '180px', align: 'left' },
  { key: 'amount', title: '单据金额', width: '140px', align: 'left' },
  { key: 'digest', title: '单据摘要', width: 'minmax(0,1fr)', align: 'left' },
]

/** 单据总数：200 条/页 × 200 页，与参考图右下角的分页口径一致 */
export const RPA_DOC_TOTAL = 40000

/** 每页条数候选（参考图默认 200） */
export const RPA_DOC_PAGE_SIZES: readonly number[] = [100, 200, 500]

/** 参考图 3 首屏能看清的行，照抄（组织 / 制单人 / 业务类型 / 单据号 / 金额 / 摘要） */
const RPA_DOC_SEED_ROWS: readonly string[][] = [
  [
    '100078090010',
    '云南分公司',
    'BX00000252310019',
    'pengyl01',
    '邹炳红',
    '2000000010',
    '差旅费',
    '7800000100002002',
    '—',
    '1,020.00',
    '差旅费线性城市1元限额报销',
  ],
  [
    '100016001060000',
    '北方管道本部',
    'ZC21_11600_2025120457',
    'ahangy23',
    '张男',
    '91000010',
    '资产增加',
    '11600160002022040',
    '—',
    '0',
    '—',
  ],
  [
    '100062000000000',
    '管网集团（徐州）联油检验检测有限公司',
    'ZDB1_16360_2025120645',
    'aaxing',
    '徐超',
    '91000010',
    '自动冲销',
    '1620000000',
    '—',
    '0',
    '—',
  ],
  [
    '100011000140',
    '联合管道武汉分公司',
    'BGJZ_11700_2025123023',
    'chenqie',
    '郑璐',
    '91000010',
    '价值类型增值',
    '1171001017',
    '—',
    '0',
    '—',
  ],
  [
    '100027060010000',
    '徐州实华管道特种作业有限公司',
    'DYDZ00160001',
    'hangdj',
    '韩广东',
    '2000000060',
    '所得税递延',
    '279700000000040',
    '备用-财务管理部',
    '1,150,097.32',
    '计算2026门1递延所得税',
  ],
  [
    '100013000000000',
    '联合管道油气储运本部',
    'BGJZ_11700_2025123249',
    'aiarq',
    '张童瑶',
    '91000010',
    '价值类型增值',
    '1171001017',
    '—',
    '0',
    '—',
  ],
  [
    '100017000210',
    '西气东输管道公司甘塘压气站',
    'YTZG102000232512031',
    'lahui',
    '李智',
    '7000000020',
    '工程竣工结项',
    '2094001001',
    '河间监督分部',
    '369,961.12',
    '管网(杭州)管理服务成本',
  ],
  [
    '100013000000000',
    '国家管网集团北方管道公司',
    'BX00000252311200057',
    'luaol',
    '罗晶',
    '2000002900',
    '费用明细',
    '179000001010',
    '91000-生产用车',
    '161.29',
    '报销城山东公司安全生产费',
  ],
  [
    '100016001001000',
    '北方管道西安输油气分公司',
    'BGJZ_11600_2025120314',
    'skyk2',
    '李海峰',
    '91000010',
    '价值类型增值',
    '1160016000140',
    '—',
    '0',
    '—',
  ],
  [
    '100078090010',
    '芮城旭盛燃气有限公司',
    'BX000002523100015',
    'justin',
    '查路春',
    '2000002900',
    '费用明细',
    '7000000000100010',
    '综合办公室',
    '1,474.00',
    '培训基地房租计入费用',
  ],
  [
    '100010000130',
    '西气东输管道公司',
    'YTZG102000232512056',
    'zhaoyh',
    '赵慧斐',
    '7000000020',
    '工程竣工结项',
    '2010000007',
    '经营计划部',
    '550,864.56',
    '结算二期人工成本及服务费',
  ],
  [
    '100027200010000',
    '浙江省天然气开发有限公司',
    'BX00000252312004051',
    'hanqian',
    '韩青',
    '2000000020',
    '无票费用',
    '7200001000010',
    '党建工作部',
    '1,478.53',
    '聚餐费用结算',
  ],
  [
    '100078090010',
    '兰州输油气分公司',
    'JHSZ82601019040200118',
    'zuohz',
    '左晓辉',
    '95000020',
    '新购资产-折旧费用',
    '1160016000140',
    '—',
    '0',
    '—',
  ],
  [
    '100011000140',
    '西部管道公司塔里木输油气分公司',
    'YTZG1020002325120018',
    'lhsdan',
    '李宗泽',
    '7000000020',
    '工程竣工结项',
    '1160016000140',
    '生产技术科',
    '4,219.31',
    '预算管理及考核费用',
  ],
  [
    '100016001060000',
    '榆林分公司（榆林管道处）',
    'YWDTZ_2025120311071',
    'chenye',
    '施悦民',
    '96000940',
    '调整冲销',
    '630000200014',
    '财务科',
    '1,222.00',
    '调整1-11月5006/4凭证计提',
  ],
  [
    '1000020000130',
    '湖北分公司本部',
    'BGJZ_12200_2025120490',
    'zhengege',
    '郑媛',
    '91000010',
    '价值类型增值',
    '1220000000',
    '—',
    '0',
    '—',
  ],
]

/** 组织编码 / 名称：按参考图里的真实单位循环 */
const RPA_DOC_ORGS: readonly (readonly [string, string])[] = [
  ['100078090010', '云南分公司'],
  ['100016001060000', '北方管道本部'],
  ['100062000000000', '管网集团（徐州）联油检验检测有限公司'],
  ['100011000140', '联合管道武汉分公司'],
  ['100027060010000', '徐州实华管道特种作业有限公司'],
  ['100013000000000', '国家管网集团北方管道公司'],
  ['100017000210', '西气东输管道公司甘塘压气站'],
  ['100016001001000', '北方管道西安输油气分公司'],
  ['100010000130', '西气东输管道公司'],
  ['100027200010000', '浙江省天然气开发有限公司'],
  ['1000020000130', '湖北分公司本部'],
  ['100016001001600', '装备技术中心'],
]

/** 制单人账号 / 姓名 */
const RPA_DOC_MAKERS: readonly (readonly [string, string])[] = [
  ['pengyl01', '邹炳红'],
  ['ahangy23', '张男'],
  ['aaxing', '徐超'],
  ['chenqie', '郑璐'],
  ['hangdj', '韩广东'],
  ['aiarq', '张童瑶'],
  ['lahui', '李智'],
  ['luaol', '罗晶'],
  ['skyk2', '李海峰'],
  ['justin', '查路春'],
  ['zhaoyh', '赵慧斐'],
  ['hanqian', '韩青'],
  ['zuohz', '左晓辉'],
  ['lhsdan', '李宗泽'],
  ['chenye', '施悦民'],
  ['wanphei0', '王金山'],
]

/** 业务类型编码 / 名称 */
const RPA_DOC_BIZ: readonly (readonly [string, string])[] = [
  ['2000000010', '差旅费'],
  ['91000010', '资产增加'],
  ['91000010', '自动冲销'],
  ['91000010', '价值类型增值'],
  ['2000000060', '所得税递延'],
  ['7000000020', '工程竣工结项'],
  ['2000002900', '费用明细'],
  ['96000940', '成本收入分摊单'],
  ['95000020', '新购资产-折旧费用'],
  ['2000000020', '无票费用'],
  ['2000002500', '费用调整单'],
  ['10000010', '资产使用费'],
]

/** 单据编号前缀：按单据类型区分，和参考图里几种编号形态对齐 */
const RPA_DOC_NO_PREFIX: readonly string[] = [
  'BX000002523100',
  'ZC21_11600_2025120',
  'ZDB1_16360_2025120',
  'BGJZ_11700_2025123',
  'DYDZ00160',
  'YTZG10200023251',
  'ZCB_11710_2025120',
  'CB1600_202512',
]

/** 摘要 */
const RPA_DOC_DIGESTS: readonly string[] = [
  '差旅费线性城市1元限额报销',
  '结算二期人工成本及服务费',
  '报销城山东公司安全生产费',
  '计算2026门1递延所得税',
  '预算管理及考核费用',
  '管网(杭州)管理服务成本',
  '培训基地房租计入费用',
  '调整1-11月5006/4凭证计提',
  '2026年委托运维水电费托收',
  '固定资产折旧计提分摊',
  '物资采购结算—长庆分公司',
  '党费报销明细汇总',
  '食堂费用月度结算',
  '车辆保险费集中支付',
  '职工体检费用报销',
  '办公用品集中采购',
]

/** 金额：两位小数 + 千分位，0 直接显示 0（与参考图一致） */
function formatAmount(value: number): string {
  if (!value) return '0'
  return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

/** 由行号推出的确定性数值，保证翻页/回看时同一行数值不变 */
function stableNumber(seed: number, salt: number, mod: number): number {
  return (seed * salt + salt * 13) % mod
}

/**
 * 取第 `start` 条起的 `count` 条单据。
 *
 * 前 16 条用参考图里的真实行，其余按行号从各池子里取，
 * 因此任意一页的内容都可以复现，也不需要把 4 万行常驻内存。
 */
export function getRpaDocRows(start: number, count: number): readonly string[][] {
  const rows: string[][] = []

  for (let i = 0; i < count; i += 1) {
    const n = start + i

    if (n < RPA_DOC_SEED_ROWS.length) {
      rows.push([...RPA_DOC_SEED_ROWS[n]])
      continue
    }

    const org = RPA_DOC_ORGS[stableNumber(n, 7, RPA_DOC_ORGS.length)]
    const maker = RPA_DOC_MAKERS[stableNumber(n, 11, RPA_DOC_MAKERS.length)]
    const biz = RPA_DOC_BIZ[stableNumber(n, 13, RPA_DOC_BIZ.length)]
    const digest = RPA_DOC_DIGESTS[stableNumber(n, 17, RPA_DOC_DIGESTS.length)]
    const prefix = RPA_DOC_NO_PREFIX[stableNumber(n, 19, RPA_DOC_NO_PREFIX.length)]

    const docNo = `${prefix}${String(2310000 + stableNumber(n, 23, 90000))}`
    const settleNo = `78${String(10000000000000 + stableNumber(n, 29, 8999999999999))}`
    const originNo = n % 4 === 0 ? '—' : `${1170000000 + stableNumber(n, 31, 9000000)}`
    const amount = n % 7 === 0 ? 0 : stableNumber(n, 37, 90000000) / 100

    rows.push([
      org[0],
      org[1],
      docNo,
      maker[0],
      maker[1],
      biz[0],
      biz[1],
      settleNo,
      originNo,
      formatAmount(amount),
      digest,
    ])
  }

  return rows
}

/** 性能分析页签：各业务环节的平均耗时（分钟） */
export const RPA_DOC_PERF_STAGES: readonly string[] = [
  '初审',
  '复审',
  '制证',
  '审核',
  '资金支付点',
  '资金支付点2',
  '结转',
]

/** 性能分析页签的两个系列：平均处理时长 / 平均审核时长 */
export const RPA_DOC_PERF_SERIES: readonly {
  name: string
  colorVar: string
  values: readonly number[]
}[] = [
  {
    name: '平均处理时长',
    colorVar: '--ck-cyan',
    values: [0.42, 0.38, 0.66, 0.51, 0.29, 0.34, 0.47],
  },
  {
    name: '平均审核时长',
    colorVar: '--ck-teal',
    values: [0.21, 0.19, 0.31, 0.28, 0.16, 0.18, 0.24],
  },
]

/** 性能分析页签左侧的四条读数 */
export const RPA_DOC_PERF_STATS: readonly {
  label: string
  value: string
  unit: string
  colorVar: string
}[] = [
  { label: '平均处理时长', value: '0.44', unit: '分钟', colorVar: '--ck-cyan' },
  { label: '平均审核时长', value: '0.22', unit: '分钟', colorVar: '--ck-teal' },
  { label: '一次性通过率', value: '96.5', unit: '%', colorVar: '--ck-green' },
  { label: '人工复核差错率', value: '0.8', unit: '%', colorVar: '--ck-orange' },
]
