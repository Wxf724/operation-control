import type { FlowNodeData, ReviewNote, ReviewStat } from './types'

/**
 * 全业务流程展示的模拟数据。
 *
 * 口径与线上 FineBI「全业务流程展示」页一致（23 个业务节点 + 右侧共享初审详情），
 * 数值取自 `_refs/live/全业务流程展示.png`。
 */

/** 23 个业务节点 */
export const FLOW_NODES: FlowNodeData[] = [
  {
    id: 2,
    name: '单据填报',
    volume: { label: '待提交单据量', value: '5,000', unit: '笔' },
    rate: { label: '单据填报完成率', value: '90%', unit: '' },
    rateValue: 90,
  },
  {
    id: 3,
    name: '上传附件',
    volume: { label: '待上传影像单据量', value: '2,700', unit: '笔' },
    rate: { label: '影像上传完成率', value: '90%', unit: '' },
    rateValue: 90,
  },
  {
    id: 4,
    name: '发票查验',
    volume: { label: '待查验发票数量', value: '3,600', unit: '笔' },
    rate: { label: '发票查验完成率', value: '90%', unit: '' },
    rateValue: 90,
  },
  {
    id: 5,
    name: '业务审核',
    volume: { label: '待审核单据量', value: '4,000', unit: '笔' },
    rate: { label: '业务审核完成率', value: '75%', unit: '' },
    rateValue: 75,
  },
  {
    id: 6,
    name: '档案邮寄',
    volume: { label: '待邮寄档案单据量', value: '4,500', unit: '笔' },
    rate: { label: '邮寄及时率', value: '75%', unit: '' },
    rateValue: 75,
  },
  {
    id: 7,
    name: '快递签收',
    volume: { label: '已签收单据量', value: '1,200', unit: '笔' },
    rate: { label: '已签收完成率', value: '88%', unit: '' },
    rateValue: 88,
  },
  {
    id: 8,
    name: '档案对比',
    volume: { label: '待档案对比量', value: '3,900', unit: '笔' },
    rate: { label: '档案对比完成率', value: '90%', unit: '' },
    rateValue: 90,
  },
  {
    id: 9,
    name: '单据待分配',
    volume: { label: '待分配单据量', value: '900', unit: '笔' },
    rate: { label: '单据分配完成率', value: '90%', unit: '' },
    rateValue: 90,
  },
  {
    id: 10,
    name: '共享初审',
    volume: { label: '待初审单据量', value: '1,300', unit: '笔' },
    rate: { label: '共享初审完成率', value: '95%', unit: '' },
    rateValue: 95,
  },
  {
    id: 11,
    name: '共享复审',
    volume: { label: '待复审单据量', value: '2,200', unit: '笔' },
    rate: { label: '共享复审完成率', value: '55%', unit: '' },
    rateValue: 55,
  },
  {
    id: 12,
    name: '凭证制证',
    volume: { label: '待制证凭证量', value: '800', unit: '笔' },
    rate: { label: '凭证制证完成率', value: '75%', unit: '' },
    rateValue: 75,
  },
  {
    id: 13,
    name: '凭证审核',
    volume: { label: '待审核凭证量', value: '1,000', unit: '笔' },
    rate: { label: '凭证审核完成率', value: '90%', unit: '' },
    rateValue: 90,
  },
  {
    id: 14,
    name: '待付节点',
    volume: { label: '待付单据量', value: '1,800', unit: '笔' },
    rate: { label: '待付单据完成率', value: '90%', unit: '' },
    rateValue: 90,
  },
  {
    id: 15,
    name: '发起付款A点',
    volume: { label: '待资金支付单据量', value: '2,300', unit: '笔' },
    rate: { label: '资金支付A点任务完成率', value: '90%', unit: '' },
    rateValue: 90,
  },
  {
    id: 16,
    name: '资金支付C点',
    volume: { label: '待资金支付单据量', value: '800', unit: '笔' },
    rate: { label: '资金支付C点支付成功率', value: '94%', unit: '' },
    rateValue: 94,
  },
  {
    id: 17,
    name: '结转',
    volume: { label: '待结转企业数量', value: '230', unit: '笔' },
    rate: { label: '结转完成率', value: '78%', unit: '' },
    rateValue: 78,
  },
  {
    id: 18,
    name: '报表出具',
    volume: { label: '待出具报表量', value: '600', unit: '笔' },
    rate: { label: '报表出具完成率', value: '90%', unit: '' },
    rateValue: 90,
  },
  {
    id: 19,
    name: '报表披露',
    volume: { label: '待披露报表量', value: '700', unit: '笔' },
    rate: { label: '报表披露完成率', value: '91%', unit: '' },
    rateValue: 91,
  },
  {
    id: 20,
    name: '预成册',
    volume: { label: '预成册用量', value: '1,000', unit: '笔' },
    rate: { label: '预成册完成率', value: '92%', unit: '' },
    rateValue: 92,
  },
  {
    id: 21,
    name: '正式成册',
    volume: { label: '正式成册用量', value: '3,000', unit: '笔' },
    rate: { label: '正式成册完成率', value: '90%', unit: '' },
    rateValue: 90,
  },
  {
    id: 22,
    name: '档案装订',
    volume: { label: '应装订档案量', value: '3,400', unit: '笔' },
    rate: { label: '档案装订完成率', value: '91%', unit: '' },
    rateValue: 91,
  },
  {
    id: 23,
    name: '正式归档',
    volume: { label: '待正式归档量', value: '3,100', unit: '笔' },
    rate: { label: '正式归档完成率', value: '90%', unit: '' },
    rateValue: 90,
  },
]

const NODE_MAP = new Map(FLOW_NODES.map((node) => [node.id, node]))

/** 按编号取节点；缺失时抛错，避免版面悄悄少一个环节 */
export function getNode(id: number): FlowNodeData {
  const node = NODE_MAP.get(id)
  if (!node) throw new Error(`流程节点 ${id} 未定义`)
  return node
}

/* ───────────── 三条主线 + 两个掉头区的节点编排 ───────────── */

/** 第一条线：02 → 07，左到右 */
export const LINE_ONE = [2, 3, 4, 5, 6, 7]

/** 第二条线：10 → 14，从右往左（10 在最右端，接住上一条线掉下来的色带） */
export const LINE_TWO = [10, 11, 12, 13, 14]

/** 第三条线：17 → 23，左到右 */
export const LINE_THREE = [17, 18, 19, 20, 21, 22, 23]

/** 右侧掉头区里的两个节点：08 → 09 → 10 */
export const TURN_RIGHT_NODES = [8, 9]

/** 左侧掉头区里的两个节点：14 → 15 → 16 → 17 */
export const TURN_LEFT_NODES = [15, 16]

/* ───────────── 右侧详情面板：10 共享初审 ───────────── */

export const REVIEW_TITLE = '10 共享初审'

export const REVIEW_STATS: ReviewStat[] = [
  { label: '初审待办量', value: '1,720', unit: '笔' },
  { label: '共享初审完成率', value: '95.00', unit: '%' },
  { label: '人员在岗率', value: '90.00', unit: '%' },
  { label: '人工处理单据量', value: '1,720', unit: '笔' },
  { label: '初审协同退单量', value: '60', unit: '笔' },
  { label: '初审协同退单率', value: '2.00', unit: '%' },
  { label: '单据平均处理时长', value: '1.50', unit: '小时' },
  { label: '单据平均停留时长', value: '1.50', unit: '小时' },
]

export const REVIEW_NOTES: ReviewNote[] = [
  { label: '现状问题', value: '无' },
  { label: '解决方案', value: '无' },
  { label: '督办状态', value: '无' },
]
