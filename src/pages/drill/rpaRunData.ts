import type { DrillColumn, DrillMetric } from './types'

/** 运行情况钻取页里的一张明细表 */
export interface RpaRunTable {
  /** React key */
  key: string
  /** 卡片左上角的小标题（点击进单据明细） */
  title: string
  /** 点标题时带进单据明细页的查询串 */
  titleQuery: string
  /** 点数据行时用「第 1 列的值」拼查询串的参数名 */
  rowQueryKey: string
  columns: readonly DrillColumn[]
  rows: readonly string[][]
}

/** 一个页签下的整套内容：指标条 + 1~2 张明细表 */
export interface RpaRunView {
  metrics: readonly DrillMetric[]
  tables: readonly RpaRunTable[]
}

/* ───────────── 页签一：RPA运行情况（参考图 1） ───────────── */

const RUN_STAGE_COLUMNS: readonly DrillColumn[] = [
  { key: 'stage', title: '业务环节', width: 'minmax(0,1fr)', align: 'left' },
  { key: 'online', title: 'RPA在线运行数量', width: '200px' },
  { key: 'stopped', title: 'RPA异常停用数量', width: '200px' },
  { key: 'success', title: 'RPA执行成功单据量', width: '230px' },
]

const RUN_STAGE_ROWS: readonly string[][] = [
  ['初审', '24', '4', '2,400'],
  ['复审', '24', '4', '2,400'],
  ['制证', '24', '4', '2,400'],
  ['审核', '24', '4', '2,400'],
  ['资金支付点', '24', '4', '2,400'],
  ['资金支付点2', '24', '4', '2,400'],
  ['结转', '24', '4', '2,400'],
]

const MANUAL_TYPE_COLUMNS: readonly DrillColumn[] = [
  { key: 'type', title: '业务类型', width: 'minmax(0,1fr)', align: 'left' },
  { key: 'handled', title: '转人工处理单据量', width: '300px' },
  { key: 'untouched', title: '未人工干预单据量', width: '320px' },
]

const MANUAL_TYPE_ROWS: readonly string[][] = [
  ['员工出行', '10', '200'],
  ['员工差旅及劳务', '10', '200'],
  ['物资采购', '10', '200'],
  ['收款业务', '10', '200'],
  ['资产变更', '10', '200'],
  ['税金计算', '10', '200'],
  ['税金缴纳', '10', '200'],
]

/* ───────────── 页签二：RPA资源闲置（参考图 2） ───────────── */

const IDLE_COLUMNS: readonly DrillColumn[] = [
  { key: 'stage', title: '业务环节', width: 'minmax(0,1fr)', align: 'left' },
  { key: 'successRate', title: 'RPA单据处理成功率', width: '340px' },
  { key: 'usageRate', title: 'RPA运行利用率', width: '300px' },
  { key: 'manualRate', title: 'RPA转人工率', width: '280px' },
  { key: 'errorCount', title: '人工复核RPA差错数量', width: '340px' },
]

const IDLE_ROWS: readonly string[][] = [
  ['初审', '90.00%', '89.00%', '12.00%', '—'],
  ['复审', '90.00%', '89.00%', '12.00%', '—'],
  ['制证', '90.00%', '89.00%', '12.00%', '240'],
  ['审核', '90.00%', '89.00%', '12.00%', '240'],
  ['资金支付点', '90.00%', '89.00%', '12.00%', '240'],
  ['资金支付点2', '90.00%', '89.00%', '12.00%', '240'],
  ['结转', '90.00%', '89.00%', '12.00%', '240'],
]

/** 两个页签的指标条与明细表，数值照抄参考图 1、2 */
export const RPA_RUN_VIEWS: Record<string, RpaRunView> = {
  running: {
    metrics: [
      {
        icon: 'ri-stack-line',
        label: 'RPA在线运行数量',
        value: '24',
        colorVar: '--ck-cyan',
      },
      {
        icon: 'ri-robot-2-line',
        label: 'RPA异常停用数量',
        value: '4',
        colorVar: '--ck-orange',
      },
      {
        icon: 'ri-file-chart-line',
        label: 'RPA执行成功单据量',
        value: '2,400',
        colorVar: '--ck-green',
      },
    ],
    tables: [
      {
        key: 'stage',
        title: 'RPA运行情况',
        titleQuery: 'source=RPA运行情况',
        rowQueryKey: 'stage',
        columns: RUN_STAGE_COLUMNS,
        rows: RUN_STAGE_ROWS,
      },
      {
        key: 'manual',
        title: 'RPA转人工情况',
        titleQuery: 'source=RPA转人工情况',
        rowQueryKey: 'type',
        columns: MANUAL_TYPE_COLUMNS,
        rows: MANUAL_TYPE_ROWS,
      },
    ],
  },

  idle: {
    metrics: [
      {
        icon: 'ri-pie-chart-line',
        label: 'RPA单据处理成功率',
        value: '90%',
        colorVar: '--ck-cyan',
      },
      {
        icon: 'ri-time-line',
        label: 'RPA运行利用率',
        value: '89%',
        colorVar: '--ck-blue',
      },
      {
        icon: 'ri-user-shared-line',
        label: 'RPA转人工率',
        value: '12%',
        colorVar: '--ck-purple',
      },
      {
        icon: 'ri-error-warning-line',
        label: '人工复核RPA差错数量',
        value: '240',
        colorVar: '--ck-orange',
      },
    ],
    tables: [
      {
        key: 'idle',
        title: 'RPA资源闲置',
        titleQuery: 'source=RPA资源闲置',
        rowQueryKey: 'stage',
        columns: IDLE_COLUMNS,
        rows: IDLE_ROWS,
      },
    ],
  },
}
