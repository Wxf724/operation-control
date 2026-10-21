import { PanelBox } from '@/components/cockpit-ui'

import { ANALYSIS_SUBTITLE, LAYOUT } from '../constants'
import { AnalysisFlow } from './AnalysisFlow'
import { DiffComparePanel } from './DiffComparePanel'
import { PolicyDetailCard } from './PolicyDetailCard'

/** 右栏：政策智能分析（画布宽 1295 × 高 974） */
export function PolicyAnalysisPanel({ className = '' }: { className?: string }) {
  return (
    <PanelBox
      title={
        <span className="flex items-center" style={{ height: LAYOUT.panelTitleBand }}>
          <span className="flex items-baseline gap-3">
            <span className="text-[24px]">政策智能分析</span>
            <span className="text-[16px] font-normal text-(--text-tertiary)">
              {ANALYSIS_SUBTITLE}
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
        <AnalysisFlow className="shrink-0" style={{ height: LAYOUT.topRowHeight }} />

        {/* 下部左右各半：603 + 31 + 603 = 1237 */}
        <div className="flex min-h-0 flex-1 gap-[31px]" style={{ marginTop: LAYOUT.topRowGap }}>
          <PolicyDetailCard className="min-w-0 flex-1" />
          <DiffComparePanel className="min-w-0 flex-1" />
        </div>
      </div>
    </PanelBox>
  )
}
