/**
 * 全业务流程展示 · 23 个流程节点的模拟数据
 *
 * 节点编号与指标均以参考截图为准；
 * 「现状问题 / 解决方案 / 催办状态」除 11 共享复审外暂全部显示「无」。
 */

export type NodeTone = 'green' | 'yellow' | 'red'

/** 右栏清单里的一行：左指标名、右数值 + 单位 */
export interface ProcessCard {
  label: string
  value: string
  unit?: string
}

export interface ClosingRow {
  name: string
  cells: number[]
}

export interface ProcessNode {
  id: number
  name: string
  /** 节点标题与路面段颜色 */
  tone: NodeTone
  /** 路面上方的两行小指标 */
  flow: { label: string; value: string; unit: string }[]
  /** 右栏清单项：所有节点统一用「指标名 ──── 数值 + 单位」的长条行 */
  cards: ProcessCard[]
  /** 清单之外的补充说明（03 上传附件），同样按清单行渲染 */
  note?: { label: string; value: string; unit: string }
  /** 17 结转：月末关账事项确认表 */
  closing?: { rows: ClosingRow[] }
  issue?: string
  solution?: string
  urge?: string
}

const NONE = { issue: '无', solution: '无', urge: '无' } as const

export const PROCESS_NODES: ProcessNode[] = [
  {
    id: 2,
    name: '单据填报',
    tone: 'green',
    flow: [
      { label: '单据待提交量', value: '5,000', unit: '笔' },
      { label: '单据提报完成率', value: '90%', unit: '' },
    ],
    cards: [
      { label: '单据填报量', value: '6,720', unit: '笔' },
      { label: '单据完成量', value: '6,720', unit: '笔' },
      { label: '单据待提交量', value: '6,720', unit: '笔' },
      { label: '单据平均时长', value: '30', unit: '分钟' },
      { label: '应提交但未提交单据量', value: '6,720', unit: '笔' },
      { label: '单据平均停留时长', value: '30', unit: '分钟' },
    ],
    ...NONE,
  },
  {
    id: 3,
    name: '上传附件',
    tone: 'green',
    flow: [
      { label: '待上传影像单量', value: '2,700', unit: '笔' },
      { label: '影像上传完成率', value: '90%', unit: '' },
    ],
    cards: [{ label: '上传附件总量', value: '6,720', unit: '笔' }],
    note: { label: '其他中:需要涉及档案邮寄等的单据数量', value: '6,720', unit: '笔' },
    ...NONE,
  },
  {
    id: 4,
    name: '发票查验',
    tone: 'green',
    flow: [
      { label: '待查验发票数量', value: '3,600', unit: '笔' },
      { label: '发票验真成功率', value: '90%', unit: '' },
    ],
    cards: [
      { label: '发票总量', value: '6,720', unit: '笔' },
      { label: '发票查验总量', value: '6,720', unit: '笔' },
      { label: '发票查验失败量', value: '720', unit: '笔' },
      { label: '发票查验成功量', value: '1,930', unit: '笔' },
      { label: '平均查验时长', value: '16', unit: '小时' },
    ],
    ...NONE,
  },
  {
    id: 5,
    name: '业务审核',
    tone: 'yellow',
    flow: [
      { label: '待审核单据量', value: '4,000', unit: '笔' },
      { label: '业务审核完成率', value: '75%', unit: '' },
    ],
    cards: [
      { label: '单据审核完成量', value: '6,720', unit: '笔' },
      { label: '审核时长异常单据量', value: '620', unit: '笔' },
      { label: '业务单据审核平均时长', value: '20', unit: '小时' },
      { label: '单据审核退单率', value: '90.00%', unit: '' },
      { label: '协同退单率', value: '93.00%', unit: '' },
      { label: '单据平均停留时长', value: '30', unit: '分钟' },
    ],
    ...NONE,
  },
  {
    id: 6,
    name: '档案邮寄',
    tone: 'yellow',
    flow: [
      { label: '待邮寄档案单据量', value: '4,500', unit: '笔' },
      { label: '邮寄及时率', value: '75%', unit: '' },
    ],
    cards: [
      { label: '待邮寄室单据量', value: '6,720', unit: '笔' },
      { label: '已邮寄已签收单据', value: '7,620', unit: '笔' },
      { label: '已邮寄单据总量', value: '7,620', unit: '笔' },
      { label: '档案邮寄超时总量', value: '920', unit: '笔' },
      { label: '在途单据量', value: '920', unit: '笔' },
      { label: '邮寄及时率', value: '90.00%', unit: '' },
      { label: '档案前寄处理时长', value: '16', unit: '小时' },
      { label: '单据平均停留时长', value: '16', unit: '小时' },
      { label: '档案邮寄率', value: '90.00%', unit: '' },
    ],
    ...NONE,
  },
  {
    id: 7,
    name: '快递签收',
    tone: 'green',
    flow: [
      { label: '已邮寄未签收单据量', value: '1,200', unit: '笔' },
      { label: '已邮寄已签收完成率', value: '88%', unit: '' },
    ],
    cards: [
      { label: '已邮寄未签收单据量', value: '6,720', unit: '笔' },
      { label: '已邮寄已签收单据量', value: '9,720', unit: '笔' },
    ],
    ...NONE,
  },
  {
    id: 8,
    name: '档案对比',
    tone: 'green',
    flow: [
      { label: '待档案比对量', value: '3,900', unit: '笔' },
      { label: '档案比对完成率', value: '90%', unit: '' },
    ],
    cards: [
      { label: '待档案比对量', value: '9,720', unit: '笔' },
      { label: '档案比对完成率', value: '90.00%', unit: '' },
      { label: '档案平均比对时长', value: '1.50', unit: '小时' },
      { label: '人均比对量', value: '56', unit: '笔' },
      { label: '纸电比对完成总量（纸电）', value: '56', unit: '笔' },
      { label: '待处理单据总量（纸电）', value: '56', unit: '笔' },
      { label: '档案比对差错率', value: '2.00%', unit: '' },
      { label: '协同退单率', value: '2.00%', unit: '' },
    ],
    ...NONE,
  },
  {
    id: 9,
    name: '单据待分配',
    tone: 'green',
    flow: [
      { label: '待分配单据量', value: '900', unit: '笔' },
      { label: '单据分配完成率', value: '90%', unit: '' },
    ],
    cards: [
      { label: '单据分配完成率', value: '90.00%', unit: '' },
      { label: '单据平均分配时长', value: '20', unit: '小时' },
      { label: '已分配单据量', value: '6,720', unit: '笔' },
    ],
    ...NONE,
  },
  {
    id: 10,
    name: '共享初审',
    tone: 'green',
    flow: [
      { label: '初审待办量', value: '1,300', unit: '笔' },
      { label: '共享初审完成率', value: '95%', unit: '' },
    ],
    cards: [
      { label: '初审待办量', value: '1,720', unit: '笔' },
      { label: '共享初审完成率', value: '95.00%', unit: '' },
      { label: '人员在岗率', value: '90.00%', unit: '' },
      { label: '人工处理单据量', value: '1,720', unit: '笔' },
      { label: '初审协同退单量', value: '60', unit: '笔' },
      { label: '初审协同退单率', value: '2.00%', unit: '' },
      { label: '单据平均处理时长', value: '1.50', unit: '小时' },
      { label: '单据平均停留时长', value: '1.50', unit: '小时' },
    ],
    ...NONE,
  },
  {
    id: 11,
    name: '共享复审',
    tone: 'red',
    flow: [
      { label: '复审待办量', value: '2,200', unit: '笔' },
      { label: '共享复审完成率', value: '55%', unit: '' },
    ],
    cards: [
      { label: '复审待办量', value: '1,720', unit: '笔' },
      { label: '共享复审完成率', value: '55.00%', unit: '' },
      { label: '人员在岗率', value: '90.00%', unit: '' },
      { label: '人工处理单据量', value: '1,720', unit: '笔' },
      { label: '复审协同退单量', value: '60', unit: '笔' },
      { label: '复审协同退单率', value: '2.00%', unit: '' },
      { label: '单据平均处理时长', value: '1.50', unit: '小时' },
      { label: '单据平均停留时长', value: '1.50', unit: '小时' },
    ],
    issue: '距离月末结账截至时间不足1小时，仍有未完',
    solution:
      '向中心负责人推送消息，提示当前共享复审节点存在20笔单据仍未处理完毕，存在逾期结账风险，请指定专人跟踪复审业务办理人员，在1小时内完成单据 处理',
    urge: '已催办',
  },
  {
    id: 12,
    name: '凭证制证',
    tone: 'yellow',
    flow: [
      { label: '待制证凭证量', value: '800', unit: '笔' },
      { label: '凭证制证完成率', value: '75%', unit: '' },
    ],
    cards: [
      { label: '待制证凭证量', value: '6,720', unit: '笔' },
      { label: '凭证制证完成率', value: '75.00%', unit: '' },
      { label: '人员在岗率', value: '90.00%', unit: '' },
      { label: '人工处理单据量', value: '1,720', unit: '笔' },
      { label: '单据平均处理时长', value: '1.50', unit: '小时' },
      { label: '单据平均停留时长', value: '1.50', unit: '小时' },
    ],
    ...NONE,
  },
  {
    id: 13,
    name: '凭证审核',
    tone: 'green',
    flow: [
      { label: '待审核凭证量', value: '1,000', unit: '笔' },
      { label: '凭证审核完成率', value: '90%', unit: '' },
    ],
    cards: [
      { label: '待审核凭证量', value: '6,720', unit: '笔' },
      { label: '凭证审核完成量', value: '6,720', unit: '笔' },
      { label: '人员在岗率', value: '90.00%', unit: '' },
      { label: '人工处理单据量', value: '1,720', unit: '笔' },
      { label: '单据平均处理时长', value: '1.50', unit: '小时' },
      { label: '单据平均停留时长', value: '1.50', unit: '小时' },
    ],
    ...NONE,
  },
  {
    id: 14,
    name: '待付节点',
    tone: 'green',
    flow: [
      { label: '待付单据量', value: '1,800', unit: '笔' },
      { label: '待付单据完成率', value: '90%', unit: '' },
    ],
    cards: [
      { label: '待付单据量', value: '6,720', unit: '笔' },
      { label: '待付资金量', value: '720', unit: '笔' },
      { label: '平均待付时长', value: '20', unit: '小时' },
    ],
    ...NONE,
  },
  {
    id: 15,
    name: '发起付款A点',
    tone: 'green',
    flow: [
      { label: '待资金支付单据量', value: '2,300', unit: '笔' },
      { label: '资金支付A点任务完成率', value: '90%', unit: '' },
    ],
    cards: [
      { label: '待资金支付单据量', value: '6,720', unit: '笔' },
      { label: '资金支付A点完成单据量', value: '720', unit: '笔' },
      { label: '支付A点平均处理时长', value: '20', unit: '小时' },
    ],
    ...NONE,
  },
  {
    id: 16,
    name: '资金支付C点',
    tone: 'green',
    flow: [
      { label: '待资金支付单据量', value: '800', unit: '笔' },
      { label: '资金支付C点支付成功率', value: '94%', unit: '' },
    ],
    cards: [
      { label: '待资金支付单据量', value: '6,720', unit: '笔' },
      { label: '资金支付C点支付失败量', value: '620', unit: '笔' },
      { label: '资金支付C点完成单据量', value: '720', unit: '笔' },
      { label: '资金支付C点平均处理时长', value: '20', unit: '小时' },
    ],
    ...NONE,
  },
  {
    id: 17,
    name: '结转',
    tone: 'yellow',
    flow: [
      { label: '待结转企业数量', value: '230', unit: '家' },
      { label: '结转完成率', value: '78%', unit: '' },
    ],
    cards: [
      { label: '月末结账申请单待提交量', value: '120', unit: '笔' },
      { label: '月末结账申请单待审核量', value: '80', unit: '笔' },
      { label: '月末结账校验表完成率', value: '80.00%', unit: '' },
    ],
    closing: {
      rows: [
        { name: '西部管道公司', cells: [98, 80, 85, 100] },
        { name: '北方管道公司', cells: [100, 80, 80, 100] },
        { name: '东部储运公司', cells: [100, 80, 70, 70] },
        { name: '南部中心', cells: [98, 98, 70, 85] },
      ],
    },
    ...NONE,
  },
  {
    id: 18,
    name: '报表出具',
    tone: 'green',
    flow: [
      { label: '待出具报表量', value: '600', unit: '笔' },
      { label: '报表出具完成率', value: '90%', unit: '' },
    ],
    cards: [
      { label: '管理口径主报表已出具量', value: '120', unit: '笔' },
      { label: '管理口径主报表待出具量', value: '120', unit: '笔' },
      { label: '管理口径其他报表已出具量', value: '120', unit: '笔' },
      { label: '管理口径其他报表待出具量', value: '120', unit: '笔' },
      { label: '国资报表已出具量', value: '120', unit: '笔' },
      { label: '国资报表待出具量', value: '120', unit: '笔' },
      { label: '管理口径主报表完成率', value: '90.00%', unit: '' },
      { label: '管理口径其他报表完成率', value: '90.00%', unit: '' },
      { label: '国资报表完成率', value: '90.00%', unit: '' },
      { label: '报表修改次数', value: '40', unit: '次' },
    ],
    ...NONE,
  },
  {
    id: 19,
    name: '报表披露',
    tone: 'green',
    flow: [
      { label: '待披露报表量', value: '700', unit: '笔' },
      { label: '报表披露完成率', value: '91%', unit: '' },
    ],
    cards: [
      { label: '报表披露完成量', value: '640', unit: '笔' },
      { label: '报表披露及时率', value: '91.00%', unit: '' },
    ],
    ...NONE,
  },
  {
    id: 20,
    name: '预成册',
    tone: 'green',
    flow: [
      { label: '应预成册量', value: '1,000', unit: '笔' },
      { label: '预成册完成率', value: '92%', unit: '' },
    ],
    cards: [
      { label: '应预成册量', value: '1,000', unit: '笔' },
      { label: '待预成册单报总量', value: '80', unit: '笔' },
    ],
    ...NONE,
  },
  {
    id: 21,
    name: '正式成册',
    tone: 'green',
    flow: [
      { label: '应正式成册量', value: '3,000', unit: '笔' },
      { label: '正式成册完成率', value: '90%', unit: '' },
    ],
    cards: [
      { label: '正式成册完成量', value: '2,700', unit: '笔' },
      { label: '应正式成册量', value: '3,000', unit: '笔' },
    ],
    ...NONE,
  },
  {
    id: 22,
    name: '档案装订',
    tone: 'green',
    flow: [
      { label: '应装订档案量', value: '3,400', unit: '笔' },
      { label: '档案装订完成率', value: '91%', unit: '' },
    ],
    cards: [
      { label: '档案装订完成量', value: '3,100', unit: '笔' },
      { label: '应装订档案量', value: '3,400', unit: '笔' },
    ],
    ...NONE,
  },
  {
    id: 23,
    name: '正式归档',
    tone: 'green',
    flow: [
      { label: '待正式归档量', value: '3,100', unit: '笔' },
      { label: '正式归档完成率', value: '90%', unit: '' },
    ],
    cards: [{ label: '待正式归档量', value: '3,100', unit: '笔' }],
    ...NONE,
  },
]

export const PROCESS_NODE_MAP: Map<number, ProcessNode> = new Map(
  PROCESS_NODES.map((n) => [n.id, n]),
)

/**
 * 四个环节的阶段标注。
 * 坐标写在 FlowRoad 的舞台坐标系里（目标稿左栏内容区 1417×792）；
 * align=right 时 x 为文字块右边界。
 */
export const PHASE_LABELS: {
  no: string
  name: string
  align: 'left' | 'right'
  x: number
  y: number
}[] = [
  { no: '01', name: '单据处理环节', align: 'left', x: 23, y: 20 },
  { no: '02', name: '财务处理环节', align: 'right', x: 1391, y: 489 },
  { no: '03', name: '报表处理环节', align: 'left', x: 26, y: 754 },
  { no: '04', name: '档案处理环节', align: 'right', x: 1391, y: 560 },
]

/** 月末关账确认表的列（17 结转） */
export const CLOSING_COLS = ['企业名称', '费用', '成本', '收入', '资产']

/** 进度条配色：≥90 绿、≥75 黄、其余红 */
export function closingTone(v: number): 'green' | 'yellow' | 'red' {
  if (v >= 90) return 'green'
  if (v >= 75) return 'yellow'
  return 'red'
}
