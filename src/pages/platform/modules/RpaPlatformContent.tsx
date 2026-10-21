import { ContributionPanel, OperationPanel, PlanningPanel } from './rpaPanels'

/**
 * RPA 管理平台的中间业务区。
 *
 * 版面按参考稿 `_refs/live/12-RPA管理平台.png`：
 * 左栏「规划与覆盖情况」+ 中栏「运行情况 / 贡献情况」，右栏由平台页骨架统一渲染。
 */
export function RpaPlatformContent() {
  return (
    <div className="flex min-h-0 flex-1 gap-3">
      <PlanningPanel className="w-[580px] shrink-0" />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-3">
        {/* 运行情况 : 贡献情况 ≈ 7 : 3，与参考稿一致 */}
        <OperationPanel className="min-h-0 flex-[2.35]" />
        <ContributionPanel className="min-h-0 flex-1" />
      </div>
    </div>
  )
}
