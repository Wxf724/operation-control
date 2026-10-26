import { ScreenScaler } from '@/components/cockpit-ui'
import type { ScreenLayout } from '@/components/cockpit-ui'

import { ControlModelBlock } from '@/pages/platform/components/ControlModelBlock'
import { QuickActionPanel } from '../components/QuickActionPanel'
import {
  COCKPIT_PAGE_CANVAS,
  COCKPIT_PAGE_GAP,
  COCKPIT_PAGE_PADDING,
  COCKPIT_PAGE_PAD_BOTTOM,
  COCKPIT_PAGE_PAD_TOP,
} from '../constants'

/**
 * 首页第 3 页：智能调控模型执行结果 + 智能操作面板（快速处理）。
 *
 * 模型结果填满剩余高度，快捷操作固定 96px；画布、间距和标题字号与管理平台一致。
 */
export function ModelScreen({ screenLayout }: { screenLayout?: ScreenLayout }) {
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
          <ControlModelBlock className="min-h-0 flex-1" />
          <QuickActionPanel className="h-[96px] shrink-0" />
        </div>
      </ScreenScaler>
    </div>
  )
}
