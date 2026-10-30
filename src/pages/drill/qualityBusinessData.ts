import type { DrillColumn, DrillMetric, DrillTab } from './types'

/**
 * 钻取明细页 ·「业务质量与差错情况」的静态内容（参考图 1～5）。
 *
 * 五个页签只是把同一批单据按不同维度（单位／区域／个人／小组／团队）列出来，
 * 所以数据只存一份记录，渲染时按页签前置对应的维度列。
 */

/** 五个页签 */
export const QUALITY_BUSINESS_TABS: readonly DrillTab[] = [
  { key: 'unit', label: '全流程业务处理质量-单位' },
  { key: 'region', label: '全流程业务处理质量-区域' },
  { key: 'person', label: '全流程业务处理质量-个人' },
  { key: 'group', label: '全流程业务处理质量-小组' },
  { key: 'team', label: '全流程业务处理质量-团队' },
]

/** 顶部指标条：前三项带「问题报数量」补充说明 */
export const QUALITY_BUSINESS_METRICS: readonly DrillMetric[] = [
  {
    icon: 'ri-stack-line',
    label: '凭证报错差错比率',
    value: '1.40%',
    sub: '问题报数量 240',
    colorVar: '--ck-cyan',
  },
  {
    icon: 'ri-stack-line',
    label: '报表报错差错比率',
    value: '1.40%',
    sub: '问题报数量 12',
    colorVar: '--ck-cyan',
  },
  {
    icon: 'ri-stack-line',
    label: '档案报错差错比率',
    value: '1.40%',
    sub: '问题报数量 350',
    colorVar: '--ck-cyan',
  },
  { icon: 'ri-pie-chart-line', label: '质量报错差错率', value: '1.40%', colorVar: '--ck-blue' },
  {
    icon: 'ri-home-smile-line',
    label: '全流程业务处理质量',
    value: '90.00%',
    colorVar: '--ck-teal',
  },
]

/** 左下角构成环形图 */
export const QUALITY_BUSINESS_ISSUES: readonly {
  label: string
  value: number
  colorVar: string
}[] = [
  { label: '业务问题', value: 290, colorVar: '--ck-cyan' },
  { label: '财务调整', value: 40, colorVar: '--ck-yellow' },
  { label: '资金支付错误', value: 140, colorVar: '--ck-orange' },
]

/** 单据表共有的后 11 列 */
const BUSINESS_TAIL_COLUMNS: readonly DrillColumn[] = [
  { key: 'docNo', title: '单据编号', width: '230px', align: 'left', sortable: true },
  { key: 'submitter', title: '提交人', width: '130px', align: 'left' },
  { key: 'bizType', title: '业务类型', width: '130px', align: 'left' },
  { key: 'submitAt', title: '单据提交时间', width: '180px' },
  { key: 'shareAt', title: '共享开始时间', width: '180px' },
  { key: 'invoiceDate', title: '开票日期', width: '150px' },
  { key: 'docStatus', title: '单据状态', width: '130px' },
  { key: 'invoiceCode', title: '发票代码', width: '170px' },
  { key: 'invoiceNo', title: '发票号码', width: '170px' },
  { key: 'invoiceAmount', title: '发票金额', width: '150px' },
  { key: 'dept', title: '编制部门', width: 'minmax(0,1fr)', align: 'left' },
]

/** 各页签的列：前置维度列 + 公共列 */
export const QUALITY_BUSINESS_COLUMNS: Record<string, readonly DrillColumn[]> = {
  unit: [
    { key: 'unitCode', title: '单位编码', width: '160px', sortable: true },
    { key: 'unitName', title: '单位名称', width: '180px', align: 'left' },
    ...BUSINESS_TAIL_COLUMNS,
  ],
  region: [
    { key: 'region', title: '区域中心', width: '180px', align: 'left' },
    ...BUSINESS_TAIL_COLUMNS,
  ],
  person: [...BUSINESS_TAIL_COLUMNS],
  group: [
    { key: 'groupCode', title: '小组编码', width: '160px', sortable: true },
    { key: 'groupName', title: '小组名称', width: '190px', align: 'left' },
    ...BUSINESS_TAIL_COLUMNS,
  ],
  team: [
    { key: 'teamCode', title: '团队编码', width: '160px', sortable: true },
    { key: 'teamName', title: '团队名称', width: '190px', align: 'left' },
    ...BUSINESS_TAIL_COLUMNS,
  ],
}

/** 一条单据记录：维度字段 + 单据字段 */
interface BusinessRecord {
  unitCode: string
  unitName: string
  region: string
  groupCode: string
  groupName: string
  teamCode: string
  teamName: string
  docNo: string
  submitter: string
  bizType: string
  submitAt: string
  shareAt: string
  invoiceDate: string
  docStatus: string
  invoiceCode: string
  invoiceNo: string
  invoiceAmount: string
  dept: string
}

/** 参考图 1 首屏能看清的 19 行（单位页签） */
const BUSINESS_SEED_ROWS: readonly string[][] = [
  [
    '10001000001',
    '管网本部',
    '东部中心',
    '10001000001',
    '管网本部-总账组',
    '10001000001',
    '管网本部-总账团队',
    'EX000972025021400023',
    '刘瑞宁',
    '车辆费',
    '2025-02-14',
    '2025-02-17',
    '2024-12-13',
    '流程结束',
    '0110001900711',
    '24110000000209331',
    '22,085.28',
    '工程管理部',
  ],
  [
    '10001000001',
    '管网本部',
    '西部中心',
    '10001000002',
    '管网本部-报销组',
    '10001000002',
    '管网本部-报销团队',
    'BX013282025020500051',
    '王丰',
    '通用报销',
    '2025-02-05',
    '2025-02-07',
    '2024-07-24',
    '流程结束',
    '0110001900711',
    '2411000000091078',
    '2,500.00',
    '生产运行部',
  ],
  [
    '10001000001',
    '管网本部',
    '东部中心',
    '10001000003',
    '管网本部-制证组',
    '10001000003',
    '管网本部-制证团队',
    'EX000162025032500023',
    '张珂',
    '办公费',
    '2025-03-25',
    '2025-03-25',
    '2024-07-02',
    '流程结束',
    '0110001900711',
    '55957260',
    '18,898.16',
    '财务部',
  ],
  [
    '10001000001',
    '管网本部',
    '北部中心',
    '10001000004',
    '管网本部-材料组',
    '10001000004',
    '管网本部-材料团队',
    'EX000162025032500021',
    '张珂',
    '办公费',
    '2025-03-25',
    '2025-03-25',
    '2024-05-06',
    '流程结束',
    '01100230711',
    '21409685',
    '3,260.50',
    '行政部',
  ],
  [
    '10001000001',
    '管网本部',
    '南部中心',
    '10001000005',
    '管网本部-借还组',
    '10001000005',
    '管网本部-借还团队',
    'BX013282025010900009',
    '李轶楠',
    '通用报销',
    '2025-01-20',
    '2025-02-13',
    '2024-12-25',
    '流程结束',
    '24110000000221862',
    '24110000000221862',
    '1,558.05',
    '采购部',
  ],
  [
    '10001000001',
    '管网本部',
    '东部中心',
    '10001000006',
    '管网本部-归档组',
    '10001000006',
    '管网本部-归档团队',
    'EX000162025032500012',
    '张珂',
    '办公费',
    '2025-03-25',
    '2025-03-25',
    '2024-10-11',
    '流程结束',
    '0110001900711',
    '59683481',
    '30,245.74',
    '技术部',
  ],
  [
    '10001000001',
    '管网本部',
    '西部中心',
    '10001000007',
    '管网本部-复核组',
    '10001000007',
    '管网本部-复核团队',
    'EX000162025032500013',
    '张珂',
    '办公费',
    '2025-03-25',
    '2025-03-25',
    '2024-12-08',
    '流程结束',
    '0110001900711',
    '8715153',
    '41,930.05',
    '财务部',
  ],
  [
    '10001000001',
    '管网本部',
    '北部中心',
    '10001000008',
    '管网本部-审核组',
    '10001000008',
    '管网本部-审核团队',
    'EX000162025032500014',
    '张珂',
    '办公费',
    '2025-03-25',
    '2025-03-25',
    '2024-02-05',
    '流程结束',
    '011002301511',
    '47681379',
    '15,74.28',
    '运营部',
  ],
  [
    '10001000001',
    '管网本部',
    '南部中心',
    '10001000009',
    '管网本部-车辆组',
    '10001000009',
    '管网本部-车辆团队',
    'EX000972025021400023',
    '刘瑞宁',
    '车辆费',
    '2025-02-14',
    '2025-02-17',
    '2024-12-13',
    '流程结束',
    '01100230811',
    '2411000000092838',
    '3,930.90',
    '工程管理部',
  ],
  [
    '10001000001',
    '管网本部',
    '东部中心',
    '10001000010',
    '管网本部-税务组',
    '10001000010',
    '管网本部-税务团队',
    'EX00016202503331',
    '张珂',
    '办公费',
    '2025-03-25',
    '2025-03-25',
    '2024-06-03',
    '流程结束',
    '011002301711',
    '2182165',
    '15,384.16',
    '财务部',
  ],
  [
    '10001000001',
    '管网本部',
    '西部中心',
    '10001000011',
    '管网本部-借还组',
    '10001000011',
    '管网本部-借还团队',
    'BX013282025010900009',
    '李轶楠',
    '通用报销',
    '2025-01-20',
    '2025-02-13',
    '2024-12-25',
    '流程结束',
    '24110000000221498',
    '24110000000221498',
    '11,903.24',
    '采购部',
  ],
  [
    '10001000001',
    '管网本部',
    '北部中心',
    '10001000012',
    '管网本部-制证组',
    '10001000012',
    '管网本部-制证团队',
    'EX00016202503333',
    '张珂',
    '办公费',
    '2025-03-25',
    '2025-03-25',
    '2024-03-07',
    '流程结束',
    '011002301611',
    '01734244',
    '15,345.28',
    '财务部',
  ],
  [
    '10001000001',
    '管网本部',
    '南部中心',
    '10001000013',
    '管网本部-材料组',
    '10001000013',
    '管网本部-材料团队',
    'EX000162025032500023',
    '张珂',
    '办公费',
    '2025-03-25',
    '2025-03-25',
    '2024-09-06',
    '流程结束',
    '0110001900711',
    '57823708',
    '4,783.83',
    '行政部',
  ],
  [
    '10001000001',
    '管网本部',
    '东部中心',
    '10001000014',
    '管网本部-车辆组',
    '10001000014',
    '管网本部-车辆团队',
    'EX000972025010700030',
    '刘瑞宁',
    '车辆费',
    '2025-01-07',
    '2025-01-09',
    '2024-12-05',
    '流程结束',
    '24110000000209854',
    '24110000000209854',
    '10,980.25',
    '工程管理部',
  ],
  [
    '10001000001',
    '管网本部',
    '西部中心',
    '10001000015',
    '管网本部-制证组',
    '10001000015',
    '管网本部-制证团队',
    'EX000162025032500020',
    '张珂',
    '办公费',
    '2025-03-25',
    '2025-03-25',
    '2024-01-09',
    '流程结束',
    '011002301111',
    '8469111',
    '11,445.40',
    '财务部',
  ],
  [
    '10001000001',
    '管网本部',
    '北部中心',
    '10001000016',
    '管网本部-借还组',
    '10001000016',
    '管网本部-借还团队',
    'BX013282025010900017',
    '李轶楠',
    '通用报销',
    '2025-01-20',
    '2025-01-23',
    '2024-12-11',
    '流程结束',
    'D061179',
    '100103102121106',
    '5,810.00',
    '采购部',
  ],
  [
    '10001000001',
    '管网本部',
    '南部中心',
    '10001000017',
    '管网本部-车辆组',
    '10001000017',
    '管网本部-车辆团队',
    'EX000972025010700030',
    '刘瑞宁',
    '车辆费',
    '2025-01-07',
    '2025-01-09',
    '2024-12-20',
    '流程结束',
    '24110000000216365',
    '24110000000216365',
    '1,599.98',
    '工程管理部',
  ],
  [
    '10001000001',
    '管网本部',
    '东部中心',
    '10001000018',
    '管网本部-制证组',
    '10001000018',
    '管网本部-制证团队',
    'EX000162025032500015',
    '张珂',
    '办公费',
    '2025-03-25',
    '2025-03-25',
    '2024-08-04',
    '流程结束',
    '0110001900711',
    '57031713',
    '123,989.01',
    '财务部',
  ],
  [
    '10001000001',
    '管网本部',
    '西部中心',
    '10001000019',
    '管网本部-复核组',
    '10001000019',
    '管网本部-复核团队',
    'EX000972025010700030',
    '刘瑞宁',
    '车辆费',
    '2025-01-07',
    '2025-01-09',
    '2024-12-24',
    '流程结束',
    '24110000000219763',
    '24110000000219763',
    '2,003.87',
    '工程管理部',
  ],
]

/** 单据总量：与参考图右下角的「共 755 条数据、1 /8 页」对齐（每页 100 条） */
export const QUALITY_BUSINESS_TOTAL = 755

const REGIONS = ['东部中心', '西部中心', '北部中心', '南部中心', '北京总部']

const SUBMITTERS = [
  '刘瑞宁',
  '王丰',
  '张珂',
  '李轶楠',
  '陈永胜',
  '刘建国',
  '赵玉刚',
  '孙倩',
  '周涛',
  '吴静',
]

const BIZ_TYPES = ['车辆费', '办公费', '通用报销', '差旅费', '会议费', '福利费']

const DEPTS = [
  '工程管理部',
  '生产运行部',
  '财务部',
  '行政部',
  '采购部',
  '技术部',
  '运营部',
  '人力资源部',
  '企划部',
]

const DOC_STATUS = ['流程结束', '流程中', '已退回', '待审核']

/** 千分位 */
function formatAmount(value: number): string {
  return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

/** 补零 */
function pad(value: number, length: number): string {
  return String(value).padStart(length, '0')
}

/** 由行号推出的确定性日期（2024-01 ~ 2025-03） */
function buildDate(seed: number, offsetDays: number): string {
  const month = (seed % 12) + 1
  const day = ((seed * 7) % 27) + 1
  const year = offsetDays > 300 ? 2024 : 2025
  return `${year}-${pad(month, 2)}-${pad(day, 2)}`
}

/** 种子行转记录 */
function toRecord(row: readonly string[]): BusinessRecord {
  return {
    unitCode: row[0],
    unitName: row[1],
    region: row[2],
    groupCode: row[3],
    groupName: row[4],
    teamCode: row[5],
    teamName: row[6],
    docNo: row[7],
    submitter: row[8],
    bizType: row[9],
    submitAt: row[10],
    shareAt: row[11],
    invoiceDate: row[12],
    docStatus: row[13],
    invoiceCode: row[14],
    invoiceNo: row[15],
    invoiceAmount: row[16],
    dept: row[17],
  }
}

/** 755 条单据记录：19 条种子 + 按行号补齐 */
const BUSINESS_RECORDS: readonly BusinessRecord[] = (() => {
  const records: BusinessRecord[] = BUSINESS_SEED_ROWS.map(toRecord)

  for (let i = records.length; i < QUALITY_BUSINESS_TOTAL; i += 1) {
    const seed = i + 1
    const region = REGIONS[seed % REGIONS.length]
    const unit = pad(10001000001 + (seed % 5), 11)
    const group = pad(10001000000 + (seed % 19), 11)
    const team = pad(10001000000 + (seed % 7), 11)

    records.push({
      unitCode: unit,
      unitName: seed % 5 === 0 ? '管网本部' : `管网分公司${(seed % 5) + 1}`,
      region,
      groupCode: group,
      groupName: `管网本部-${['总账', '报销', '制证', '材料', '借还', '归档', '复核'][seed % 7]}组`,
      teamCode: team,
      teamName: `管网本部-${['总账', '报销', '制证', '材料', '借还', '归档', '复核'][seed % 7]}团队`,
      docNo: `EX${pad(seed, 3)}${formatAmount(20250000000 + seed * 137)
        .replace(/[^0-9]/g, '')
        .slice(0, 15)}`,
      submitter: SUBMITTERS[seed % SUBMITTERS.length],
      bizType: BIZ_TYPES[seed % BIZ_TYPES.length],
      submitAt: buildDate(seed, 320),
      shareAt: buildDate(seed + 3, 320),
      invoiceDate: buildDate(seed + 7, 120),
      docStatus: DOC_STATUS[seed % DOC_STATUS.length],
      invoiceCode: `01100019007${pad(seed % 100, 2)}`,
      invoiceNo: pad(21000000 + ((seed * 977) % 900000), 8),
      invoiceAmount: formatAmount(((seed * 1379) % 9000000) / 100),
      dept: DEPTS[seed % DEPTS.length],
    })
  }

  return records
})()

/** 按页签取行：前置对应的维度列，再拼上公共的单据列 */
export function getBusinessRows(tab: string): readonly string[][] {
  return BUSINESS_RECORDS.map((record) => {
    const tail = [
      record.docNo,
      record.submitter,
      record.bizType,
      record.submitAt,
      record.shareAt,
      record.invoiceDate,
      record.docStatus,
      record.invoiceCode,
      record.invoiceNo,
      record.invoiceAmount,
      record.dept,
    ]

    switch (tab) {
      case 'unit':
        return [record.unitCode, record.unitName, ...tail]
      case 'region':
        return [record.region, ...tail]
      case 'group':
        return [record.groupCode, record.groupName, ...tail]
      case 'team':
        return [record.teamCode, record.teamName, ...tail]
      default:
        return tail
    }
  })
}
