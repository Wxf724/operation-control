import { ScreenScaler } from '@/components/cockpit-ui'
import type { ScreenLayout } from '@/components/cockpit-ui'

import { CenterStatusPanel } from '../components/CenterStatusPanel'
import { ResultKpiPanel } from '../components/ResultKpiPanel'
import { TrendPanel } from '../components/TrendPanel'
import {
  COCKPIT_PAGE_CANVAS,
  COCKPIT_PAGE_GAP,
  COCKPIT_PAGE_PADDING,
  COCKPIT_PAGE_PAD_BOTTOM,
  COCKPIT_PAGE_PAD_TOP,
} from '../constants'

/**
 * 首页第 1 页：运营结果区 + 各中心核心数据运行情况 + 近10日运行趋势。
 *
 * 运营结果区缩减五分之一高度，腾出的空间分配给各中心运行情况。
 * 三块面板按 1.92 : 3.18 : 3.4 分配，画布、间距和标题字号与管理平台一致。
 */
export function OverviewScreen({ screenLayout }: { screenLayout?: ScreenLayout }) {
  return (
    <div className="theme-cloud-light">
      <ScreenScaler
        width={COCKPIT_PAGE_CANVAS.width}
        height={COCKPIT_PAGE_CANVAS.height}
        layout={screenLayout}
      >
        <div
          className="flex h-full w-full flex-col"
          style={{
            paddingInline: COCKPIT_PAGE_PADDING,
            paddingTop: COCKPIT_PAGE_PAD_TOP,
            paddingBottom: COCKPIT_PAGE_PAD_BOTTOM,
            gap: COCKPIT_PAGE_GAP,
          }}
        >
          <ResultKpiPanel className="min-h-0 flex-[1.92]" />
          <CenterStatusPanel className="min-h-0 flex-[3.18]" />
          <TrendPanel className="min-h-0 flex-[3.4]" />
        </div>
      </ScreenScaler>
    </div>
  )
}
