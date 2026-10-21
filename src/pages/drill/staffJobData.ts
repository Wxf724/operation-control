import { formatPercent } from './format'
import { STAFF_DRILL_CENTERS, staffJitter } from './staffConstants'
import type { DrillColumn, DrillMetric, DrillTab } from './types'

/**
 * 顶部页签（在指标卡之上），顺序与参考图 56 一致，默认选中第 3 个。
 *
 * 按需求只保留一张明细表：两行页签都只切高亮，表格内容不随页签变。
 */
export const STAFF_JOB_SCENE_TABS: readonly DrillTab[] = [
  { key: 'bill', label: '单据处理情况' },
  { key: 'report', label: '报表出具情况' },
  { key: 'special', label: '专项任务完成情况' },
]

/** 参考图 56 高亮的是「专项任务完成情况」 */
export const STAFF_JOB_SCENE_DEFAULT_TAB = 'special'

/** 第二行页签：工作类型，默认选中第 1 个 */
export const STAFF_JOB_TYPE_TABS: readonly DrillTab[] = [
  { key: 'all', label: '所有类型工作' },
  { key: 'yearly', label: '年度重点工作' },
  { key: 'supervise', label: '公司督办类工作' },
  { key: 'other', label: '其他综合类工作' },
]

/** 指标卡（数值照抄参考图 56） */
export const STAFF_JOB_METRICS: DrillMetric[] = [
  { icon: 'ri-stack-line', label: '工作总量', value: '240', colorVar: '--ck-cyan' },
  { icon: 'ri-database-2-line', label: '工作完成量', value: '200', colorVar: '--ck-blue' },
  { icon: 'ri-file-list-3-line', label: '待完成工作总量', value: '40', colorVar: '--ck-purple' },
  { icon: 'ri-pie-chart-line', label: '工作平均完成进度', value: '58%', colorVar: '--ck-green' },
  {
    icon: 'ri-shield-check-line',
    label: '待完成工作逾期量',
    value: '20',
    colorVar: '--ck-orange',
  },
  { icon: 'ri-bar-chart-2-line', label: '待完成工作逾期率', value: '12%', colorVar: '--ck-red' },
]

/** 明细表上方的小标题 */
export const STAFF_JOB_TABLE_TITLE = '专项任务-在岗人员'

/** 明细表列：区域中心 / 岗位 / 职工 + 4 个工作量口径 */
export const STAFF_JOB_COLUMNS: readonly DrillColumn[] = [
  { key: 'centerCode', title: '区域中心编号', width: '190px', sortable: true },
  { key: 'centerName', title: '区域中心', width: '130px' },
  { key: 'postCode', title: '岗位编号', width: '210px', sortable: true },
  { key: 'postName', title: '岗位名称', width: '1.6fr' },
  { key: 'staffCode', title: '职工编号', width: '170px', sortable: true },
  { key: 'staffName', title: '职工姓名', width: '130px' },
  { key: 'total', title: '工作总量', width: '1fr' },
  { key: 'pending', title: '待完成工作总量', width: '1.2fr' },
  { key: 'overdue', title: '待完成工作逾期量', width: '1.25fr' },
  { key: 'overdueRate', title: '待完成工作逾期率', width: '1.25fr' },
]

/** 各区域中心共用的岗位名库（参考图 56 的岗位命名规则：`中心简称_岗位`） */
const POST_NAMES: readonly string[] = [
  '影像采集岗',
  '影像审核岗一组',
  '应付核算一组（后勤）制证',
  '总账报表组审核',
  '总账账务处理制证岗',
  '资金调拨支付C岗',
  '资金审核岗',
  '资金账务处理申请单制证',
  '收入核算制证岗',
  '收入核算审核岗',
  '结账初审岗',
  '结账复审岗',
  '筹融资制证',
  '筹融资凭证审核',
  '费用报销初审岗',
  '费用报销复核岗',
  '差旅报销审核岗',
  '固定资产核算岗',
  '存货核算岗',
  '成本核算制证岗',
  '税务申报制证岗',
  '税务申报审核岗',
  '往来核算岗',
  '合并报表编制岗',
  '对外报表出具岗',
  '预算执行分析岗',
  '资金计划编制岗',
  '票据管理岗',
  '档案归集岗',
  '主数据维护岗',
  '系统运维支持岗',
  '业务咨询服务岗',
  '质检中心整改确认组',
  '争议申诉（终裁）岗',
]

const SURNAMES = '王李张刘陈杨黄赵周吴徐孙马朱胡林郭何高罗'
const GIVEN_NAMES: readonly string[] = [
  '雪鹏',
  '江帆',
  '玉鹏',
  '春凤',
  '思奇',
  '一丹',
  '旭宇',
  '昕瞳',
  '俊荣',
  '武林',
  '国庆',
  '贤祐',
  '雪斌',
  '芬',
  '琦',
  '祥',
  '恣',
  '琪',
  '明远',
  '佳怡',
]

/** 参考图 56 的「共 167 条数据」 */
const ROW_TOTAL = 167

/** 5 个区域中心 × 34 个岗位，截到 167 行，全部确定性派生 */
export const STAFF_JOB_ROWS: readonly string[][] = STAFF_DRILL_CENTERS.flatMap((center, ci) =>
  POST_NAMES.map((post, pi) => {
    const postCode = `${ci + 1}000${4001 + pi}`
    const staffCode = String(10000000 + ci * 1700000 + pi * 12347)
    const seed = `${postCode}-${staffCode}`
    const name = `${SURNAMES[(ci * 7 + pi) % SURNAMES.length]}${GIVEN_NAMES[(ci * 11 + pi) % GIVEN_NAMES.length]}`
    const total = 8 + Math.round(staffJitter(seed, 3) * 16)
    const pending = Math.max(1, Math.round(total * (0.3 + staffJitter(seed, 23) * 0.35)))
    const overdue = Math.max(1, Math.round(pending * (0.2 + staffJitter(seed, 47) * 0.5)))
    return [
      center.code,
      center.name,
      postCode,
      `${center.short}_${post}`,
      staffCode,
      name,
      String(total),
      String(pending),
      String(overdue),
      formatPercent((overdue / pending) * 100),
    ]
  })
).slice(0, ROW_TOTAL)
