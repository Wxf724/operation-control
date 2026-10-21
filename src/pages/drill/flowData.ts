import { DRILL_CENTER_ROWS, DRILL_ORG_ROWS, scaleRows } from './drillOrgs'
import type { DrillOrgRow, DrillTab } from './types'

/** 「作业流转处理情况」的一个页签：各页签口径不同，列名与机构清单都会换 */
export interface FlowTab extends DrillTab {
  /** 第二列表头 */
  codeTitle: string
  /** 第三列表头 */
  nameTitle: string
  /** 数值列表头 */
  valueTitle: string
  rows: DrillOrgRow[]
}

/** 单据种类清单 */
const BILL_TYPE_ROWS: DrillOrgRow[] = [
  { code: 'B01', name: '差旅报销单', value: 4821, prior: 4517 },
  { code: 'B02', name: '日常费用报销单', value: 3967, prior: 3804 },
  { code: 'B03', name: '采购付款单', value: 2854, prior: 2693 },
  { code: 'B04', name: '工程结算单', value: 2130, prior: 2048 },
  { code: 'B05', name: '资产领用单', value: 1476, prior: 1391 },
  { code: 'B06', name: '薪酬发放单', value: 1082, prior: 1037 },
  { code: 'B07', name: '税务申报单', value: 836, prior: 795 },
  { code: 'B08', name: '资金结算单', value: 1694, prior: 1588 },
]

/** 业务环节清单 */
const FLOW_STEP_ROWS: DrillOrgRow[] = [
  { code: 'E01', name: '单据接收', value: 5213, prior: 4986 },
  { code: 'E02', name: '影像采集', value: 4128, prior: 3974 },
  { code: 'E03', name: '单据审核', value: 3671, prior: 3520 },
  { code: 'E04', name: '合规校验', value: 2905, prior: 2814 },
  { code: 'E05', name: '账务处理', value: 2347, prior: 2256 },
  { code: 'E06', name: '支付结算', value: 1862, prior: 1795 },
  { code: 'E07', name: '归档入库', value: 1204, prior: 1163 },
]

/** 10 个页签，前 9 个与参考图 41 一致；页签放不下时由 DrillTabBar 的左右箭头翻页 */
export const FLOW_TABS: FlowTab[] = [
  {
    key: 'pending-assign',
    label: '待分配单据量',
    codeTitle: '单位编号',
    nameTitle: '单位',
    valueTitle: '待分配单据量',
    rows: DRILL_ORG_ROWS,
  },
  {
    key: 'center-pending',
    label: '区域中心单据量(待处理/挂起)',
    codeTitle: '中心编号',
    nameTitle: '区域中心',
    valueTitle: '待处理/挂起单据量',
    rows: scaleRows(DRILL_CENTER_ROWS, 0.12),
  },
  {
    key: 'type-pending',
    label: '单据种类单据量(待处理/挂起)',
    codeTitle: '种类编号',
    nameTitle: '单据种类',
    valueTitle: '待处理/挂起单据量',
    rows: BILL_TYPE_ROWS,
  },
  {
    key: 'step-pending',
    label: '业务环节单据量(待处理/挂起)',
    codeTitle: '环节编号',
    nameTitle: '业务环节',
    valueTitle: '待处理/挂起单据量',
    rows: FLOW_STEP_ROWS,
  },
  {
    key: 'month-unfinished',
    label: '月末申请单未完成',
    codeTitle: '单位编号',
    nameTitle: '单位',
    valueTitle: '未完成申请单量',
    rows: scaleRows(DRILL_ORG_ROWS, 0.06),
  },
  {
    key: 'month-review',
    label: '月末申请单待审核',
    codeTitle: '单位编号',
    nameTitle: '单位',
    valueTitle: '待审核申请单量',
    rows: scaleRows(DRILL_ORG_ROWS, 0.04),
  },
  {
    key: 'period-open',
    label: '未关闭会计期间单位',
    codeTitle: '单位编号',
    nameTitle: '单位',
    valueTitle: '未关闭期间数',
    rows: scaleRows(DRILL_ORG_ROWS, 0.00008),
  },
  {
    key: 'report-issue',
    label: '报表出具情况',
    codeTitle: '单位编号',
    nameTitle: '单位',
    valueTitle: '已出具报表量',
    rows: scaleRows(DRILL_ORG_ROWS, 0.02),
  },
  {
    key: 'return-bill',
    label: '协同退回单据',
    codeTitle: '单位编号',
    nameTitle: '单位',
    valueTitle: '协同退回单据量',
    rows: scaleRows(DRILL_ORG_ROWS, 0.03),
  },
  {
    key: 'return-rate',
    label: '协同处理时效',
    codeTitle: '单位编号',
    nameTitle: '单位',
    valueTitle: '协同处理时长(小时)',
    rows: scaleRows(DRILL_ORG_ROWS, 0.0005),
  },
]

/** 日期区间默认值（参考图 41） */
export const FLOW_PERIOD = { start: '2026-01-01', end: '2026-08-31' } as const
