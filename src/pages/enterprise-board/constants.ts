import type { BoardKpi } from './types'

/** 设计稿尺寸，与模块平台页 / 钻取页一致 */
export const BOARD_CANVAS = { width: 2400, height: 1080 } as const

export const BOARD_TITLE = '企业数据看板'

/** 顶栏左侧的管理单位下拉 */
export const BOARD_ORG_OPTIONS = [
  '全部',
  '北京燃气管道公司',
  '工程质量监督检验公司',
  '工程技术创新公司',
  '北京智网数科公司',
  '西部管道公司',
  '建设项目管理公司',
  '研究总院',
] as const

/** 顶栏右侧的账期 */
export const BOARD_PERIOD = '2026-09'

/** 顶部 8 张 KPI 卡 */
export const BOARD_KPIS: BoardKpi[] = [
  {
    key: 'submit',
    label: '单据提报量',
    value: '1,427,889',
    unit: '张',
    icon: 'ri-file-list-3-line',
    priorValue: '1,421,740',
    priorUnit: '张',
    yoy: '0.43%',
    direction: 'up',
  },
  {
    key: 'duration',
    label: '单据流转时长',
    value: '1.08',
    unit: '天',
    icon: 'ri-time-line',
    priorValue: '1.46',
    priorUnit: '天',
    yoy: '25.89%',
    direction: 'down',
  },
  {
    key: 'report',
    label: '企业报表提报处理时效',
    value: '94%',
    unit: '',
    icon: 'ri-bar-chart-box-line',
    priorValue: '90%',
    priorUnit: '',
    yoy: '4.00%',
    direction: 'up',
  },
  {
    key: 'reject',
    label: '协同退单处理量',
    value: '26,692',
    unit: '张',
    icon: 'ri-reply-line',
    priorValue: '30,561',
    priorUnit: '张',
    yoy: '12.66%',
    direction: 'down',
  },
  {
    key: 'booking',
    label: '商旅预订率',
    value: '95%',
    unit: '',
    icon: 'ri-plane-line',
    priorValue: '91%',
    priorUnit: '',
    yoy: '4.83%',
    direction: 'up',
  },
  {
    key: 'reimburse',
    label: '商旅报销率',
    value: '96%',
    unit: '',
    icon: 'ri-wallet-3-line',
    priorValue: '96%',
    priorUnit: '',
    yoy: '0.06%',
    direction: 'up',
  },
  {
    key: 'archive',
    label: '档案邮寄率',
    value: '99%',
    unit: '',
    icon: 'ri-mail-send-line',
    priorValue: '100%',
    priorUnit: '',
    yoy: '0.58%',
    direction: 'down',
  },
  {
    key: 'adjust',
    label: '企业调账量',
    value: '6,868',
    unit: '张',
    icon: 'ri-exchange-funds-line',
    priorValue: '8,675',
    priorUnit: '张',
    yoy: '20.83%',
    direction: 'down',
  },
]
