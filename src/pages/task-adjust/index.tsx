import { useNavigate } from 'react-router-dom'

import { BackToCockpitButton, PeriodOrgControls, ScreenHeader, ScreenScaler } from '@/components/cockpit-ui'

import { ImpactConfirmPanel } from './components/ImpactConfirmPanel'
import { OriginalTaskPanel } from './components/OriginalTaskPanel'
import { TaskAdjustPanel } from './components/TaskAdjustPanel'
import { TaskOverviewPanel } from './components/TaskOverviewPanel'
import {
  DEFAULT_PERIOD_UNIT,
  ORG_OPTIONS,
  PAGE_TITLE,
  PERIOD,
  PERIOD_UNITS,
  PLATFORM_TITLE,
  TASK_CANVAS,
  TASK_LAYOUT,
} from './constants'

/** 第 2 屏：共享运营调控平台丨任务调整 */
export function TaskAdjustPage() {
  const navigate = useNavigate()

  return (
    <div className="theme-cloud-light">
      <ScreenScaler width={TASK_CANVAS.width} height={TASK_CANVAS.height}>
        <div className="flex h-full w-full flex-col">
          <ScreenHeader
            title={PLATFORM_TITLE}
            subtitle={PAGE_TITLE}
            height={TASK_LAYOUT.headerHeight}
            left={
              <>
                <BackToCockpitButton onClick={() => navigate('/')} />
                <PeriodOrgControls
                  period={PERIOD}
                  units={PERIOD_UNITS}
                  defaultUnit={DEFAULT_PERIOD_UNIT}
                  orgs={ORG_OPTIONS}
                />
              </>
            }
          />

          {/* 四栏骨架：列宽/间距按目标稿实测值固定，四个面板等高、顶底对齐 */}
          <div
            className="grid shrink-0"
            style={{
              height: TASK_LAYOUT.panelHeight,
              gridTemplateColumns: TASK_LAYOUT.columns,
              columnGap: TASK_LAYOUT.columnGap,
              paddingLeft: TASK_LAYOUT.padLeft,
              paddingRight: TASK_LAYOUT.padRight,
            }}
          >
            <TaskOverviewPanel className="min-h-0" />
            <OriginalTaskPanel className="min-h-0" />
            <TaskAdjustPanel className="min-h-0" />
            <ImpactConfirmPanel className="min-h-0" />
          </div>
        </div>
      </ScreenScaler>
    </div>
  )
}
