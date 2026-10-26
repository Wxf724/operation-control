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
 * 内容是原首页右栏的两块面板，立成整屏后横向撑满：模型执行结果占满剩余高度、
 * 快捷操作固定 120px。外留白与面板间隙对齐政策分析页（左右 40 / 间隙 21 / 底部 27），
 * 四周留出呼吸空间；用 `fill` 缩放，任何比例都铺满且内容不裁。
 * 面板标题字号用 CSS 变量就地调大一档。
 */
export function ModelScreen({ screenLayout }: { screenLayout?: ScreenLayout }) {
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
          <ControlModelBlock className="min-h-0 flex-1" />
          <QuickActionPanel className="h-[96px] shrink-0" />
        </div>
      </ScreenScaler>
    </div>
  )
}
