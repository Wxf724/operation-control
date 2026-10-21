import { PanelBox } from '@/components/cockpit-ui'

import { TaskListTable } from './TaskListTable'
import { TaskStatRow } from './TaskStatRow'
import { TaskTypeDistribution } from './TaskTypeDistribution'

/** 第一列：当前任务总览（统计底座 + 类型分布 + 任务清单） */
export function TaskOverviewPanel({ className = '' }: { className?: string }) {
  return (
    <PanelBox title="当前任务总览" className={`flex flex-col ${className}`}>
      <div className="flex h-full flex-col px-[30px] pt-[32px] pb-[26px]">
        <TaskStatRow className="h-[134px] shrink-0" />
        <TaskTypeDistribution className="mt-[45px] h-[295px] shrink-0" />
        <TaskListTable className="mt-[27px] min-h-0 flex-1" />
      </div>
    </PanelBox>
  )
}
