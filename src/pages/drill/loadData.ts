import { DRILL_LOAD_ORG_ROWS } from './drillOrgs'
import { formatCount } from './format'
import type { DrillColumn, DrillMetric, DrillTab } from './types'

/** 「作业分配负载情况」的一个页签：指标卡、列、行三者整套替换 */
export interface LoadTab extends DrillTab {
  metrics: DrillMetric[]
  columns: DrillColumn[]
  rows: string[][]
}

/** 三个页签公用的前两列 */
const ORG_COLUMNS: DrillColumn[] = [
  { key: 'code', title: '单位编号', width: '260px', sortable: true },
  { key: 'name', title: '单位名称', width: '1fr' },
]

/** 用单位编号派生一个 0~1 的确定性扰动，避免 Math.random 导致截图不可复现 */
function jitter(code: string, salt: number): number {
  let sum = salt
  for (let i = 0; i < code.length; i += 1) sum += code.charCodeAt(i) * (i + 1)
  return (sum % 97) / 97
}

/** 31 家单位 × 单据分配差错率（参考图 42 里统一是 0.14%） */
const ERROR_ROWS: string[][] = DRILL_LOAD_ORG_ROWS.map((row) => [row.code, row.name, '0.14%'])

/** 31 家单位 × 连续超负荷作业 */
const OVERLOAD_ROWS: string[][] = DRILL_LOAD_ORG_ROWS.map((row) => {
  const people = 3 + Math.round(jitter(row.code, 7) * 42)
  const days = 2 + Math.round(jitter(row.code, 19) * 12)
  const perCapita = 58 + Math.round(jitter(row.code, 31) * 76)
  return [row.code, row.name, formatCount(people), `${days} 天`, formatCount(perCapita)]
})

/** 31 家单位 × 应急处理情况 */
const EMERGENCY_ROWS: string[][] = DRILL_LOAD_ORG_ROWS.map((row) => {
  const bills = 120 + Math.round(jitter(row.code, 11) * 1680)
  const rate = 92 + jitter(row.code, 23) * 7.8
  const hours = 1.2 + jitter(row.code, 41) * 4.6
  return [row.code, row.name, formatCount(bills), `${rate.toFixed(2)}%`, `${hours.toFixed(1)}`]
})

/** 3 个页签，顺序与参考图 42 一致 */
export const LOAD_TABS: LoadTab[] = [
  {
    key: 'assign-abnormal',
    label: '单据分配异常',
    metrics: [
      {
        icon: 'ri-shuffle-line',
        label: '单据分配策略种类数量',
        value: '10',
        colorVar: '--ck-cyan',
      },
      {
        icon: 'ri-stack-line',
        label: '在用单据分配策略种类数量',
        value: '3',
        colorVar: '--ck-blue',
      },
      {
        icon: 'ri-database-2-line',
        label: '跨中心调整的单据量',
        value: '40',
        colorVar: '--ck-purple',
      },
      {
        icon: 'ri-bar-chart-2-line',
        label: '跨中心单据调整率',
        value: '89.00%',
        colorVar: '--ck-green',
      },
    ],
    columns: [...ORG_COLUMNS, { key: 'errorRate', title: '单据分配差错率', width: '640px' }],
    rows: ERROR_ROWS,
  },
  {
    key: 'overload',
    label: '连续超负荷作业',
    metrics: [
      {
        icon: 'ri-group-line',
        label: '连续超负荷人数',
        value: '326',
        unit: '人',
        colorVar: '--ck-cyan',
      },
      {
        icon: 'ri-timer-flash-line',
        label: '最长连续超负荷天数',
        value: '14',
        unit: '天',
        colorVar: '--ck-orange',
      },
      {
        icon: 'ri-file-copy-2-line',
        label: '人均日处理单据量',
        value: '96',
        unit: '笔',
        colorVar: '--ck-blue',
      },
      { icon: 'ri-pie-chart-line', label: '超负荷人员占比', value: '12.60%', colorVar: '--ck-red' },
    ],
    columns: [
      ...ORG_COLUMNS,
      { key: 'people', title: '连续超负荷人数', width: '320px' },
      { key: 'days', title: '最长连续天数', width: '300px' },
      { key: 'perCapita', title: '人均日处理单据量', width: '340px' },
    ],
    rows: OVERLOAD_ROWS,
  },
  {
    key: 'emergency',
    label: '应急处理情况',
    metrics: [
      {
        icon: 'ri-alarm-warning-line',
        label: '应急处理单据量',
        value: '18,462',
        unit: '笔',
        colorVar: '--ck-red',
      },
      {
        icon: 'ri-user-follow-line',
        label: '应急处理人次',
        value: '1,037',
        unit: '人次',
        colorVar: '--ck-orange',
      },
      {
        icon: 'ri-time-line',
        label: '平均处理时长',
        value: '2.8',
        unit: '小时',
        colorVar: '--ck-blue',
      },
      {
        icon: 'ri-shield-check-line',
        label: '应急完成率',
        value: '96.40%',
        colorVar: '--ck-green',
      },
    ],
    columns: [
      ...ORG_COLUMNS,
      { key: 'bills', title: '应急处理单据量', width: '320px' },
      { key: 'rate', title: '应急完成率', width: '300px' },
      { key: 'hours', title: '平均处理时长(小时)', width: '340px' },
    ],
    rows: EMERGENCY_ROWS,
  },
]

/** 日期区间默认值（参考图 42） */
export const LOAD_PERIOD = { start: '2026-01-01', end: '2026-08-31' } as const
