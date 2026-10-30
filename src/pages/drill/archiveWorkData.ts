import type { DrillColumn, DrillMetric } from './types'

/**
 * 钻取明细页 ·「档案作业情况」的静态内容（参考图 3～6）。
 *
 * 11 张指标卡（4 + 4 + 3 三行）固定不变，四个页签只换表格的维度列：
 * 区域中心 / 企业（单位编码+名称）/ 个人（员工编号+姓名）/ 小组（班组编码+名称）。
 * 每行 13 个数值列，33 行，与参考图「共 33 条数据」一致。
 */

/** 指标卡：三行 */
export const ARCHIVE_WORK_METRICS: readonly (readonly DrillMetric[])[] = [
  [
    {
      icon: 'ri-error-warning-line',
      label: '问题档案数量',
      value: '693',
      colorVar: '--ck-blue',
    },
    {
      icon: 'ri-printer-line',
      label: '代打印接收量',
      value: '276',
      colorVar: '--ck-blue',
    },
    {
      icon: 'ri-file-list-3-line',
      label: '代打印完成量',
      value: '2,673',
      colorVar: '--ck-blue',
    },
    {
      icon: 'ri-time-line',
      label: '代打印待处理量',
      value: '2,673',
      colorVar: '--ck-blue',
    },
  ],
  [
    {
      icon: 'ri-printer-cloud-line',
      label: '代打印及时率',
      value: '78.58%',
      colorVar: '--ck-blue',
    },
    {
      icon: 'ri-inbox-archive-line',
      label: '签收单据量（低电）',
      value: '2,673',
      colorVar: '--ck-blue',
    },
    {
      icon: 'ri-list-check-2',
      label: '低电比对完成总量（低电）',
      value: '2,013',
      colorVar: '--ck-blue',
    },
    {
      icon: 'ri-file-list-2-line',
      label: '待处理单据总量（低电）',
      value: '2,673',
      colorVar: '--ck-blue',
    },
  ],
  [
    {
      icon: 'ri-pie-chart-line',
      label: '单据分配负载率（低电）',
      value: '78.58%',
      colorVar: '--ck-blue',
    },
    {
      icon: 'ri-stack-line',
      label: '汇总问题单据总量',
      value: '2,673',
      colorVar: '--ck-blue',
    },
    {
      icon: 'ri-error-warning-fill',
      label: '待处理问题档案数量',
      value: '2,673',
      colorVar: '--ck-blue',
    },
  ],
]

/** 13 个数值列（各页签共用） */
const ARCHIVE_WORK_VALUE_COLUMNS: readonly DrillColumn[] = [
  { key: 'issueCount', title: '问题档案数量', width: '140px', sortable: true },
  { key: 'storedCount', title: '已建库单量', width: '130px' },
  { key: 'storedReceived', title: '已建库签收单据总量', width: '180px' },
  { key: 'transitCount', title: '在途单量', width: '120px' },
  { key: 'transitRate', title: '在途单据超长时长', width: '170px' },
  { key: 'receivedTotal', title: '签收单据总量', width: '140px' },
  { key: 'receivedLow', title: '签收单据总量（低电）', width: '180px' },
  { key: 'receivedTrack', title: '签收单据跟踪', width: '140px' },
  { key: 'printIn', title: '代打印接收量', width: '140px' },
  { key: 'printDone', title: '代打印完成量', width: '140px' },
  { key: 'printTodo', title: '代打印待处理量', width: '160px' },
  { key: 'printTimely', title: '代打印及时率', width: '140px' },
  { key: 'compareDone', title: '低电比对完成总量', width: 'minmax(0,1fr)' },
]

/** 各页签的列 */
export const ARCHIVE_WORK_COLUMNS: Record<string, readonly DrillColumn[]> = {
  region: [
    { key: 'name', title: '区域中心', width: '180px', align: 'left' },
    ...ARCHIVE_WORK_VALUE_COLUMNS,
  ],
  enterprise: [
    { key: 'code', title: '单位编码', width: '150px', align: 'left', sortable: true },
    { key: 'name', title: '单位名称', width: '180px', align: 'left' },
    ...ARCHIVE_WORK_VALUE_COLUMNS,
  ],
  person: [
    { key: 'code', title: '员工编号', width: '150px', align: 'left', sortable: true },
    { key: 'name', title: '员工姓名', width: '160px', align: 'left' },
    ...ARCHIVE_WORK_VALUE_COLUMNS,
  ],
  group: [
    { key: 'code', title: '班组编码', width: '150px', align: 'left', sortable: true },
    { key: 'name', title: '班组名称', width: '180px', align: 'left' },
    ...ARCHIVE_WORK_VALUE_COLUMNS,
  ],
}

/** 行数：33 行 */
const ROW_COUNT = 33

/** 维度取值：按行号在小列表里轮换，贴近参考图「同一对象连续重复」的观感 */
const DIMENSIONS: Record<string, readonly (readonly [string, string])[]> = {
  region: [
    ['', '区域服务部'],
    ['', '西部中心'],
    ['', '东部中心'],
    ['', '北部中心'],
    ['', '南部中心'],
  ],
  enterprise: [
    ['10001000001', '管网本部'],
    ['10001000100', '调控中心本部'],
    ['10001000015', '西南项目管理中心'],
    ['10001000016', '西北项目管理中心'],
    ['10001000070', '中缅东段南海上清水河管道'],
  ],
  person: [
    ['100100', '张丽'],
    ['100101', '王巧'],
    ['100102', '李思'],
    ['100103', '徐亚'],
    ['100104', '张颖'],
    ['100105', '阮仟'],
    ['100106', '刘琦'],
    ['100107', '思思'],
    ['100108', '齐乔'],
    ['100109', '王洒'],
    ['100110', '刘超'],
    ['100111', '刘涛'],
    ['100112', '张新宇'],
    ['100113', '万宇航'],
    ['100114', '刘磊'],
    ['100115', '倪多'],
    ['100116', '康康'],
  ],
  group: [
    ['10001000001', '管网本部一组'],
    ['10001000100', '调控中心本部一组'],
    ['10001000015', '西南项目管理中心一组'],
    ['10001000016', '西北项目管理中心一组'],
    ['10001000070', '中缅东段一组'],
  ],
}

/** 按行号生成 13 个数值：以参考图首行为基准逐行 +1 */
function buildValues(i: number): string[] {
  const base = i + 1
  return [
    String(4 + base),
    String(29 + base),
    String(51 + base),
    String(14 + base),
    '0.56',
    '0.62',
    String(37 + base),
    '78.58%',
    String(9 - (i % 3)),
    String(64 + base),
    String(64 + base),
    '78.58%',
    String(44 + base),
  ]
}

/** 按页签取行：维度值 + 13 个数值列 */
export function getArchiveWorkRows(tab: string): readonly string[][] {
  const dims = DIMENSIONS[tab] ?? DIMENSIONS.region
  const rows: string[][] = []

  for (let i = 0; i < ROW_COUNT; i += 1) {
    const [code, name] = dims[Math.floor(i / 7) % dims.length]
    const values = buildValues(i)
    rows.push(tab === 'region' ? [name, ...values] : [code, name, ...values])
  }

  return rows
}
