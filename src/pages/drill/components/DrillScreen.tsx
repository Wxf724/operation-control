import type { ReactNode } from 'react'

import { ScreenScaler } from '@/components/cockpit-ui'

import { DRILL_CANVAS } from '../constants'

/**
 * 钻取明细页的屏幕外壳。
 *
 * 浅蓝白主题（`theme-cloud-light`）+ 等比缩放画布，
 * 内部是一列纵向分区：筛选行 / 指标卡行 / 页签行 / 明细表格。
 */
export function DrillScreen({ children }: { children: ReactNode }) {
  return (
    <div className="theme-cloud-light">
      <ScreenScaler width={DRILL_CANVAS.width} height={DRILL_CANVAS.height}>
        <div className="flex h-full w-full flex-col gap-3 px-6 py-5">{children}</div>
      </ScreenScaler>
    </div>
  )
}
