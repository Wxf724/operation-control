import { useState } from 'react'

import { DrillFilterBar, DrillScreen, DrillTable } from './components'
import { CREDIT_OVERALL_COLUMNS, CREDIT_OVERALL_ROWS } from './creditDrillData'
import { CREDIT_PERIOD } from './creditConstants'
import type { OrgScope } from './types'

/**
 * 钻取明细页 ·「信用整体情况」（路由 `/drill/credit-overall`，对应参考图 8）。
 *
 * 从信用管理监控平台的「信用整体情况」面板标题点进来：
 * 日期区间 + 管理单位／法人单位口径开关 + 一张按单位的扣分单据量明细表（20 行）。
 */
export function CreditOverallDrillPage() {
  const [scope, setScope] = useState<OrgScope>('管理单位')

  return (
    <DrillScreen>
      <DrillFilterBar
        title="信用整体情况"
        defaultStart={CREDIT_PERIOD.start}
        defaultEnd={CREDIT_PERIOD.end}
        scope={scope}
        onScopeChange={setScope}
        className="h-[74px]"
      />

      <DrillTable
        title="报销信用扣分单据数量"
        columns={CREDIT_OVERALL_COLUMNS}
        rows={CREDIT_OVERALL_ROWS}
        className="min-h-0 flex-1"
      />
    </DrillScreen>
  )
}
