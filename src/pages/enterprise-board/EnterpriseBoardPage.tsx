import { ScreenHeader, ScreenScaler } from '@/components/cockpit-ui'

import {
  BoardBottomRow,
  BoardKpiRow,
  BoardOrgSelect,
  BoardPeriodBadge,
  BoardTopRow,
} from './components'
import { BOARD_CANVAS, BOARD_TITLE } from './constants'

/**
 * 企业数据看板（路由 `/enterprise-board`）。
 *
 * 入口是首页左栏「各驻企财务团队运行情况」页签里的企业链接。
 * 版面对齐 `_refs/live/50-企业数据看板.png`，主题换成浅蓝白（`theme-cloud-light`）：
 *   顶栏（管理单位 / 标题 / 账期）→ 8 张 KPI 卡 → 上下两行各 4 个面板。
 */
export function EnterpriseBoardPage() {
  return (
    <div className="theme-cloud-light">
      <ScreenScaler width={BOARD_CANVAS.width} height={BOARD_CANVAS.height}>
        <div className="relative flex h-full w-full flex-col">
          {/* 屏幕外框装饰：仅在浅色玻璃主题下可见 */}
          <span className="ck-frame" aria-hidden />

          <ScreenHeader
            title={BOARD_TITLE}
            height={68}
            left={<BoardOrgSelect />}
            right={<BoardPeriodBadge />}
          />

          <div className="flex min-h-0 flex-1 flex-col gap-3 px-5 pt-3 pb-5">
            <BoardKpiRow className="h-[118px] shrink-0" />
            <BoardTopRow className="min-h-0 flex-1" />
            <BoardBottomRow className="min-h-0 flex-1" />
          </div>
        </div>
      </ScreenScaler>
    </div>
  )
}
