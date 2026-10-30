import { useState } from 'react'

import { DrillFilterBar, DrillScreen, DrillTable } from './components'
import { PERFORMANCE_PERIOD } from './performanceConstants'
import { PERFORMANCE_SERVICE_COLUMNS, PERFORMANCE_SERVICE_ROWS } from './performanceServiceData'
import type { OrgScope } from './types'

/**
 * 钻取明细页 ·「服务企业情况」（路由 `/drill/performance-service`，对应参考图 9）。
 *
 * 结构：日期区间 + 管理单位／法人单位口径开关 + 一张 13 列的企业明细表（20 行）。
 * 列多，表格走 `dense` 紧凑模式。
 */
export function PerformanceServiceDrillPage() {
  const [scope, setScope] = useState<OrgScope>('法人单位')

  return (
    <DrillScreen>
      <DrillFilterBar
        title="服务企业情况"
        defaultStart={PERFORMANCE_PERIOD.start}
        defaultEnd={PERFORMANCE_PERIOD.end}
        scope={scope}
        onScopeChange={setScope}
        className="h-[74px]"
      />

      <DrillTable
        columns={PERFORMANCE_SERVICE_COLUMNS}
        rows={PERFORMANCE_SERVICE_ROWS}
        dense
        className="min-h-0 flex-1"
      />
    </DrillScreen>
  )
}
