import { SectionTitle } from '@/components/cockpit-ui'

import { DrillFilterBar, DrillMetricRow, DrillScreen, DrillTable } from './components'
import { CREDIT_APPEAL_COLUMNS, CREDIT_APPEAL_ROWS } from './creditDrillData'
import { CREDIT_PERIOD } from './creditConstants'
import type { DrillMetric } from './types'

/** 顶部 5 张指标卡，照抄参考图 9 */
const CREDIT_APPEAL_METRICS: readonly DrillMetric[] = [
  {
    icon: 'ri-file-list-3-line',
    label: '申诉发起总量',
    value: '120',
    colorVar: '--ck-cyan',
  },
  {
    icon: 'ri-verified-badge-line',
    label: '申诉通过率',
    value: '89.00%',
    sub: '申诉通过数量 100',
    colorVar: '--ck-blue',
  },
  {
    icon: 'ri-share-forward-line',
    label: '异议申诉发起率',
    value: '2.40%',
    sub: '申诉发起总量 120',
    colorVar: '--ck-blue',
  },
  {
    icon: 'ri-pie-chart-2-line',
    label: '异议申诉通过比率',
    value: '54.00%',
    sub: '异议申诉通过量 68',
    colorVar: '--ck-blue',
  },
  {
    icon: 'ri-building-2-line',
    label: '申诉处理及时率',
    value: '96.00%',
    colorVar: '--ck-cyan',
  },
]

/**
 * 钻取明细页 ·「申诉处理情况」（路由 `/drill/credit-appeal`，对应参考图 9）。
 *
 * 从信用管理监控平台的「申诉处理情况」面板标题点进来：
 * 日期区间 → 5 张指标卡 → 小标题「申诉处理情况」+ 按管理单位的申诉明细表（20 行）。
 */
export function CreditAppealDrillPage() {
  return (
    <DrillScreen>
      <DrillFilterBar
        title="申诉处理情况"
        defaultStart={CREDIT_PERIOD.start}
        defaultEnd={CREDIT_PERIOD.end}
        className="h-[74px]"
      />

      <DrillMetricRow items={CREDIT_APPEAL_METRICS} />

      <section className="flex min-h-0 flex-1 flex-col gap-2">
        <SectionTitle className="shrink-0 px-1">申诉处理情况</SectionTitle>

        <DrillTable
          columns={CREDIT_APPEAL_COLUMNS}
          rows={CREDIT_APPEAL_ROWS}
          dense
          className="min-h-0 flex-1"
        />
      </section>
    </DrillScreen>
  )
}
