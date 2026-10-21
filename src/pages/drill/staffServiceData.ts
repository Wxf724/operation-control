import type { DrillMetric, DrillTab } from './types'

/**
 * 钻取明细页 ·「服务情况」的静态内容。
 *
 * 指标卡与页签照抄 `_refs/live/58-钻取-服务情况.png`；
 * 明细表各页签共用同一张表（本期只做页签切换交互，不切数据源）。
 */

/** 顶部指标卡 */
export const STAFF_SERVICE_METRICS: DrillMetric[] = [
  { icon: 'ri-user-3-line', label: '用户投诉总量', value: '29', unit: '件', colorVar: '--ck-cyan' },
  {
    icon: 'ri-shake-hands-line',
    label: '服务协议综合达成率',
    value: '91%',
    colorVar: '--ck-blue',
  },
  {
    icon: 'ri-focus-3-line',
    label: '业务处理准确性综合达成率',
    value: '91%',
    colorVar: '--ck-purple',
  },
  { icon: 'ri-map-pin-line', label: '业务处理准确性达成率', value: '91%', colorVar: '--ck-teal' },
  {
    icon: 'ri-notification-3-line',
    label: '业务处理及时性综合达成率',
    value: '98%',
    colorVar: '--ck-green',
  },
  {
    icon: 'ri-time-line',
    label: '业务处理及时性达成率',
    value: '94%',
    colorVar: '--ck-orange',
  },
]

/** 7 个页签，顺序与参考图 58 一致 */
export const STAFF_SERVICE_TABS: readonly DrillTab[] = [
  { key: 'complained', label: '被投诉人' },
  { key: 'agreement', label: '服务协议综合达成率' },
  { key: 'accuracy', label: '业务处理准确性达成率' },
  { key: 'timely-all', label: '业务处理及时性综合达成率' },
  { key: 'timely-staff', label: '业务处理及时性达成率-在岗人员' },
  { key: 'timely-type', label: '业务处理及时性达成率-业务类型' },
  { key: 'timely-step', label: '业务处理及时性达成率-业务环节' },
]
