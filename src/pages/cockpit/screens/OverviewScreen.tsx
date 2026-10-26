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
 * 内容是原首页左栏的三块面板，立成整屏后横向撑满、纵向按 2.4 : 2.7 : 3.4 分配。
 * 外留白与面板间隙对齐政策分析页（左右 40 / 间隙 21 / 底部 27），四周不顶满；
 * 用 `fill` 缩放，任何屏幕比例都四边铺满而内容不裁。
 * 面板标题字号用 CSS 变量就地调大一档（`--ck-fs-panel-title`），不动共用组件。
 */
export function OverviewScreen({ screenLayout }: { screenLayout?: ScreenLayout }) {
  return (
    <div
      className="theme-cloud-light"
      style={{ '--ck-fs-panel-title': '21px' } as React.CSSProperties}
    >
      <ScreenScaler
        width={COCKPIT_PAGE_CANVAS.width}
        height={COCKPIT_PAGE_CANVAS.height}
        mode="fill"
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
          <ResultKpiPanel className="min-h-0 flex-[2.4]" />
          <CenterStatusPanel className="min-h-0 flex-[2.7]" />
          <TrendPanel className="min-h-0 flex-[3.4]" />
        </div>
      </ScreenScaler>
    </div>
  )
}
