import { PanelBox } from '@/components/cockpit-ui'

import { COLLECT_SUBTITLE, LAYOUT } from '../constants'
import { PolicyCategoryList } from './PolicyCategoryList'
import { PolicyTable } from './PolicyTable'
import { SourceCards } from './SourceCards'

/** 左栏：政策信息收集（画布宽 1004 × 高 974） */
export function PolicyCollectPanel({ className = '' }: { className?: string }) {
  return (
    <PanelBox
      title={
        <span
          className="flex items-center"
          style={{ height: LAYOUT.panelTitleBand }}
        >
          <span className="flex items-baseline gap-3">
            <span className="text-[24px]">政策信息收集</span>
            <span className="text-[16px] font-normal text-(--text-tertiary)">
              {COLLECT_SUBTITLE}
            </span>
          </span>
        </span>
      }
      className={`flex flex-col ${className}`}
    >
      <div
        className="flex h-full flex-col"
        style={{
          paddingLeft: LAYOUT.panelPadX,
          paddingRight: LAYOUT.panelPadX,
          paddingTop: LAYOUT.panelPadTop,
          paddingBottom: LAYOUT.panelPadBottom,
        }}
      >
        <SourceCards className="shrink-0" style={{ height: LAYOUT.topRowHeight }} />

        {/* 下部：政策分类侧栏 214 + 间距 29 + 政策列表 703 = 946 */}
        <div
          className="flex min-h-0 flex-1 gap-[29px]"
          style={{ marginTop: LAYOUT.topRowGap }}
        >
          <PolicyCategoryList className="w-[214px] shrink-0" />
          <PolicyTable className="min-w-0 flex-1" />
        </div>
      </div>
    </PanelBox>
  )
}
