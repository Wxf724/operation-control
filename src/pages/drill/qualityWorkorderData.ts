import type { DrillColumn } from './types'
import type { DrillPerfSeries, DrillPerfStat } from './components/DrillPerfPanel'

/**
 * 钻取明细页 ·「工单明细」的列与数据（参考图 6）。
 *
 * 参考图底部是「1 /200」的分页口径，即 4 万条工单；
 * 与 RPA 单据明细页同样处理：4 万行不预生成，翻页时按 `getWorkorderRows` 按需生成。
 */

/** 工单明细表的 12 列（「序号」由表格组件自动补） */
export const QUALITY_WORKORDER_COLUMNS: readonly DrillColumn[] = [
  { key: 'orgCode', title: '组织机构编码', width: '200px', align: 'left', sortable: true },
  { key: 'orgName', title: '组织机构名称', width: '220px', align: 'left' },
  { key: 'docNo', title: '单据编号', width: '260px', align: 'left', sortable: true },
  { key: 'makerCode', title: '制单人编号', width: '150px', align: 'left' },
  { key: 'makerName', title: '制单人姓名', width: '150px', align: 'left' },
  { key: 'bizCode', title: '业务类型', width: '140px' },
  { key: 'bizName', title: '业务类型名称', width: '160px', align: 'left' },
  { key: 'deptCode', title: '制单部门编号', width: '170px' },
  { key: 'deptName', title: '制单部门名称', width: '170px', align: 'left' },
  { key: 'amount', title: '单据金额', width: '150px', sortable: true },
  { key: 'digest', title: '单据摘要', width: 'minmax(0,1fr)', align: 'left' },
]

/** 工单总数：200 条/页 × 200 页 */
export const QUALITY_WORKORDER_TOTAL = 40000

/** 每页条数候选 */
export const QUALITY_WORKORDER_PAGE_SIZES: readonly number[] = [100, 200, 500]

/** 参考图 6 首屏能看清的 10 行 */
const WORKORDER_SEED_ROWS: readonly string[][] = [
  [
    '10001000001',
    '管网本部',
    'SSBS20251230008',
    '1100050',
    '司马平台管理员',
    '2000000010',
    '银行上收下拨',
    '—',
    '—',
    '22,085.28',
    '资金池成员归集',
  ],
  [
    '10001000001',
    '管网本部',
    'EX0000202610201910184749',
    'zhangyh12',
    '张汉温',
    '2000000010',
    '差旅费',
    '10000110',
    '工程部',
    '2,500.00',
    '协同设计平台对接',
  ],
  [
    '10001000001',
    '管网本部',
    'BX013282025050000017',
    'dai5',
    '戴双双',
    '2000000010',
    '通用报销单',
    '10000100',
    '生产部',
    '163.14',
    '采购臭氧及管道、配发库存及库房',
  ],
  [
    '10001000001',
    '管网本部',
    'SSBS202610100011',
    '9999',
    'SYSTEM',
    '2000000010',
    '银行上收下拨',
    '—',
    '—',
    '16,898,169.28',
    '资金池成员支付',
  ],
  [
    '10001000001',
    '管网本部',
    'SSBS202607160007',
    '9999',
    'SYSTEM',
    '2000000010',
    '银行上收下拨',
    '—',
    '—',
    '1,558.05',
    '资金池成员归集',
  ],
  [
    '10001000001',
    '管网本部',
    'SSBS202607160010',
    '9999',
    'SYSTEM',
    '2000000010',
    '银行上收下拨',
    '—',
    '—',
    '30,245.74',
    '资金池成员归集',
  ],
  [
    '10001000001',
    '管网本部',
    'SSBS202604100018',
    '9999',
    'SYSTEM',
    '2000000010',
    '银行上收下拨',
    '—',
    '—',
    '41,930.05',
    '资金池成员支付',
  ],
  [
    '10001000001',
    '管网本部',
    'SSBS202604150012',
    '9999',
    'SYSTEM',
    '2000000010',
    '银行上收下拨',
    '—',
    '—',
    '150,402.58',
    '资金池成员支付',
  ],
  [
    '10001000001',
    '管网本部',
    'BX00002026122057731548787',
    'chenyz',
    '陈永主',
    '2000000010',
    '差旅费',
    '10000150',
    '市场部',
    '0',
    '赴山东检查公平性房工作',
  ],
  [
    '10001000001',
    '管网本部',
    'SSBS202609300009',
    '9999',
    'SYSTEM',
    '2000000010',
    '银行上收下拨',
    '—',
    '—',
    '28,708.78',
    '资金池成员归集',
  ],
]

const ORGS: readonly (readonly [string, string])[] = [
  ['10001000001', '管网本部'],
  ['10001000002', '管网分公司1'],
  ['10001000003', '管网分公司2'],
  ['10001000004', '管网分公司3'],
  ['10001000005', '管网分公司4'],
]

const MAKERS: readonly (readonly [string, string])[] = [
  ['1100050', '司马平台管理员'],
  ['zhangyh12', '张汉温'],
  ['dai5', '戴双双'],
  ['9999', 'SYSTEM'],
  ['chenyz', '陈永主'],
  ['liuhaining', '刘海宁'],
  ['chanxan', '陈曦'],
  ['huqinshui', '胡泉水'],
  ['suxing66', '苏星'],
  ['liuzhishan', '刘志山'],
]

const BIZ: readonly (readonly [string, string])[] = [
  ['2000000010', '银行上收下拨'],
  ['2000000010', '差旅费'],
  ['2000000010', '通用报销单'],
  ['2000000030', '资金专款下拨'],
  ['2000000020', '办公费'],
  ['2000000010', '会议费'],
]

const DEPTS: readonly (readonly [string, string])[] = [
  ['10000110', '工程部'],
  ['10000100', '生产部'],
  ['10000150', '市场部'],
  ['—', '—'],
  ['10000090', '纪检监督组'],
  ['10000080', '党组织与宣传部'],
  ['10000120', '集团办公室'],
]

const DIGESTS: readonly string[] = [
  '资金池成员归集',
  '资金池成员支付',
  '协同设计平台对接',
  '采购臭氧及管道、配发库存及库房',
  '赴山东检查公平性房工作',
  '预算管理及考核费用',
  '职工体检费用报销',
  '办公用品集中采购',
  '差旅费报销-客户拜访',
  '设备采购付款',
]

/** 千分位金额 */
function formatAmount(value: number): string {
  if (!value) return '0'
  return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

/** 取第 start 条起的 count 条工单：前 10 条照参考图，其余按行号生成 */
export function getWorkorderRows(start: number, count: number): readonly string[][] {
  const rows: string[][] = []

  for (let i = 0; i < count; i += 1) {
    const n = start + i

    if (n < WORKORDER_SEED_ROWS.length) {
      rows.push([...WORKORDER_SEED_ROWS[n]])
      continue
    }

    const org = ORGS[n % ORGS.length]
    const maker = MAKERS[(n * 3) % MAKERS.length]
    const biz = BIZ[(n * 5) % BIZ.length]
    const dept = DEPTS[(n * 7) % DEPTS.length]
    const digest = DIGESTS[(n * 11) % DIGESTS.length]
    const amount = (n * 7919) % 9000000

    rows.push([
      org[0],
      org[1],
      `EX${String(20250000000 + n * 37)}`,
      maker[0],
      maker[1],
      biz[0],
      biz[1],
      dept[0],
      dept[1],
      formatAmount(amount / 100),
      digest,
    ])
  }

  return rows
}

/** 性能分析页签：按制单部门统计的处理时长 */
export const QUALITY_WORKORDER_PERF_STAGES: readonly string[] = [
  '工程部',
  '生产部',
  '市场部',
  '采购部',
  '财务部',
  '技术部',
  '办公室',
]

export const QUALITY_WORKORDER_PERF_SERIES: readonly DrillPerfSeries[] = [
  {
    name: '平均处理时长',
    colorVar: '--ck-cyan',
    values: [1.42, 1.18, 1.66, 1.31, 0.92, 1.27, 0.88],
  },
  {
    name: '平均等待时长',
    colorVar: '--ck-teal',
    values: [0.61, 0.48, 0.73, 0.55, 0.36, 0.52, 0.41],
  },
]

export const QUALITY_WORKORDER_PERF_STATS: readonly DrillPerfStat[] = [
  { label: '平均处理时长', value: '1.23', unit: '分钟', colorVar: '--ck-cyan' },
  { label: '平均等待时长', value: '0.52', unit: '分钟', colorVar: '--ck-teal' },
  { label: '一次性通过率', value: '94.6', unit: '%', colorVar: '--ck-green' },
  { label: '退回重办率', value: '5.4', unit: '%', colorVar: '--ck-orange' },
]
