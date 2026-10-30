import type { DrillColumn, DrillMetric } from './types'

/**
 * 钻取明细页 ·「稽核覆盖与抽样情况」的静态内容（参考图 3／4／5）。
 *
 * 三个页签共用同一张业务类型明细表（141 行 / 2 页），只有指标与标题随页签切换；
 * 前 19 行照参考图，其余按业务类型命名规则补齐，保证「共 141 条数据、1/2 页」一致。
 */

/** 一个页签下的指标与卡片标题 */
export interface QualitySamplingView {
  /** 指标条 3 项 */
  metrics: readonly DrillMetric[]
  /** 卡片内小标题，如「凭证抽样覆盖与抽样情况」 */
  tableTitle: string
}

/** 明细表的列 */
export const QUALITY_SAMPLING_COLUMNS: readonly DrillColumn[] = [
  { key: 'bizCode', title: '业务类型编码', width: '320px', sortable: true },
  { key: 'bizName', title: '业务类型名称', width: 'minmax(0,1fr)', align: 'left' },
  { key: 'total', title: '抽样总量', width: '400px', sortable: true },
  { key: 'rate', title: '抽样比率', width: '300px', sortable: true },
  { key: 'concentration', title: '抽样样本集中度', width: '340px' },
]

/** 参考图里能看清的 19 行，数值照抄 */
const SAMPLING_SEED_ROWS: readonly string[][] = [
  ['200000000010', '差旅费', '218,604', '59.00%', '59.90%'],
  ['200000000020', '办公费', '53', '31.00%', '0.04%'],
  ['200000000030', '业务招待费', '11', '71.00%', '18.12%'],
  ['200000000040', '会议费/半办公议', '6', '35.00%', '135.27%'],
  ['200000000060', '出国人员经费', '28', '6.00%', '61.12%'],
  ['200000000061', '出国报销单', '2', '62.00%', '50.00%'],
  ['200000000062', '回国汇交汇单', '1', '48.00%', '11.82%'],
  ['200000000070', '通用报销单', '79', '49.00%', '7.07%'],
  ['200000000080', '图书资料费', '29', '45.00%', '1.63%'],
  ['200000000110', '福利费', '27', '12.00%', '13.46%'],
  ['200000000121', '工会经费上报单据', '182', '13.00%', '77.36%'],
  ['200000000130', '车辆费用', '31', '80.00%', '4.30%'],
  ['200000000133', '党费报销', '10', '69.00%', '100.23%'],
  ['200000000134', '党费下拨上交单', '8', '61.00%', '34.88%'],
  ['200000000135', '党报党刊工作经费', '90', '85.00%', '43.27%'],
  ['200000000136', '部门汇总报销', '1,544', '63.00%', '70.50%'],
  ['200000000146', '被动报销单', '2,107', '60.00%', '83.54%'],
  ['200000000147', '付其他用报销单', '1,142', '73.00%', '70.91%'],
  ['200000000149', '无合同ERP报销单', '574', '10.00%', '57.46%'],
]

/** 补齐用的费用大类 × 单据动作：40 × 3 = 120 行，与 19 行种子合计 139… 再补 2 行汇总单到 141 */
const SAMPLING_FEE_KINDS: readonly string[] = [
  '差旅费',
  '办公费',
  '会议费',
  '招待费',
  '车辆费',
  '福利费',
  '培训费',
  '咨询费',
  '审计费',
  '租赁费',
  '修理费',
  '运输费',
  '仓储费',
  '装卸费',
  '检验费',
  '设计费',
  '监理费',
  '服务费',
  '检测费',
  '水电费',
  '物业费',
  '劳保费',
  '印刷费',
  '邮寄费',
  '通讯费',
  '广告费',
  '诉讼费',
  '体检费',
  '食堂费',
  '宿舍费',
  '防疫费',
  '安全费',
  '环保费',
  '信息费',
  '科研费',
  '党建费',
  '工会费',
  '会务费',
  '接待费',
  '资料费',
]

const SAMPLING_BILL_ACTIONS: readonly string[] = ['报销单', '借款单', '付款单']

/** 金额千分位 */
function formatAmount(value: number): string {
  return value.toLocaleString('en-US')
}

/** 拼出 141 行：种子行 + 40 类 × 3 动作 + 2 行汇总单 */
function buildRows(): readonly string[][] {
  const rows: string[][] = SAMPLING_SEED_ROWS.map((row) => [...row])
  let n = 0

  for (const kind of SAMPLING_FEE_KINDS) {
    for (const action of SAMPLING_BILL_ACTIONS) {
      const total = 3 + ((n * 137) % 4200)
      const rate = 6 + ((n * 19) % 90)
      const concentration = (((n * 53) % 13500) / 100).toFixed(2)
      const code = `20000000${String(200 + n).padStart(4, '0')}`

      rows.push([
        code,
        `${kind}${action}`,
        formatAmount(total),
        `${rate.toFixed(2)}%`,
        `${concentration}%`,
      ])
      n += 1
    }
  }

  rows.push(['200000009990', '费用类报销明细汇总单', '3,268', '41.00%', '68.42%'])
  rows.push(['200000009991', '资产类凭证汇总单', '1,475', '52.00%', '73.18%'])

  return rows
}

/** 业务类型明细表的 141 行 */
export const QUALITY_SAMPLING_ROWS: readonly string[][] = buildRows()

/** 三个页签的指标与标题，数值照抄参考图 3／4／5 */
export const QUALITY_SAMPLING_VIEWS: Record<string, QualitySamplingView> = {
  voucher: {
    tableTitle: '凭证抽样覆盖与抽样情况',
    metrics: [
      {
        icon: 'ri-file-list-3-line',
        label: '凭证抽样总量',
        value: '1,243,058',
        unit: '笔',
        colorVar: '--ck-cyan',
      },
      {
        icon: 'ri-pie-chart-line',
        label: '凭证抽样比率',
        value: '46.79%',
        colorVar: '--ck-blue',
      },
      {
        icon: 'ri-focus-3-line',
        label: '抽取样本集中度',
        value: '78.46%',
        colorVar: '--ck-teal',
      },
    ],
  },

  report: {
    tableTitle: '报表抽样覆盖与抽样情况',
    metrics: [
      {
        icon: 'ri-file-chart-line',
        label: '报表抽样总量',
        value: '1,243,058',
        unit: '笔',
        colorVar: '--ck-cyan',
      },
      {
        icon: 'ri-pie-chart-line',
        label: '报表抽样比率',
        value: '46.79%',
        colorVar: '--ck-blue',
      },
      {
        icon: 'ri-focus-3-line',
        label: '抽取样本集中度',
        value: '78.46%',
        colorVar: '--ck-teal',
      },
    ],
  },

  archive: {
    tableTitle: '档案抽样覆盖与抽样情况',
    metrics: [
      {
        icon: 'ri-archive-2-line',
        label: '档案抽样总量',
        value: '1,243,058',
        unit: '笔',
        colorVar: '--ck-cyan',
      },
      {
        icon: 'ri-pie-chart-line',
        label: '档案抽样比率',
        value: '65.97%',
        colorVar: '--ck-blue',
      },
      {
        icon: 'ri-focus-3-line',
        label: '抽取样本集中度',
        value: '110.62%',
        colorVar: '--ck-teal',
      },
    ],
  },
}
