import { useNavigate } from 'react-router-dom'

import { ScreenHeader, ScreenScaler } from '@/components/cockpit-ui'

import { FlowBoard } from './components/FlowBoard'
import { ReviewPanel } from './components/ReviewPanel'

/** 设计稿尺寸：与其它平台页共用同一套画布，互相跳转时版面不跳 */
const FLOW_CANVAS = { width: 2400, height: 1080 } as const

const PERIOD = '2026-09-01 至 2026-09-21'

/**
 * 全业务流程展示。
 *
 * 入口：作业管理平台「作业处理整体情况」右上角的「全业务流程」按钮。
 * 版面复刻线上 FineBI 同页：左侧蛇形流程（23 个业务节点 + 4 个环节标签），
 * 右侧固定展示「10 共享初审」节点的明细与问题 / 方案 / 督办状态。
 */
export function BusinessFlowPage() {
  const navigate = useNavigate()

  return (
    <div className="theme-cockpit">
      <ScreenScaler width={FLOW_CANVAS.width} height={FLOW_CANVAS.height}>
        <div className="flex h-full w-full flex-col">
          <ScreenHeader
            title="全业务流程展示"
            height={72}
            left={<BackToJobButton onClick={() => navigate('/platform/job')} />}
            right={
              <span className="flex items-center gap-2 rounded-[3px] border border-(--border) bg-(--ck-panel-inner) px-3 py-[7px] text-[13px] leading-none text-(--text-secondary)">
                <i className="ri-calendar-line text-[14px] text-(--ck-cyan)" aria-hidden />
                {PERIOD}
              </span>
            }
          />

          <div className="flex min-h-0 flex-1 gap-4 px-5 pt-1 pb-5">
            <FlowBoard className="min-w-0 flex-1" />
            <ReviewPanel className="w-[600px] shrink-0" />
          </div>
        </div>
      </ScreenScaler>
    </div>
  )
}

/** 左上角返回按钮：回到作业管理平台 */
function BackToJobButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title="返回作业管理平台"
      className="flex h-[30px] w-[30px] shrink-0 cursor-pointer items-center justify-center rounded-[3px] border border-(--border) bg-(--ck-panel-inner) text-[17px] text-(--ck-cyan) transition-colors hover:bg-(--accent-light)"
    >
      <i className="ri-arrow-left-line" aria-hidden />
    </button>
  )
}
