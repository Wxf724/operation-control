import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ScreenHeader, ScreenScaler } from '@/components/cockpit-ui'
import type { ScreenLayout } from '@/components/cockpit-ui'

import { AlertBanner } from '../components/AlertBanner'
import { ChinaMap } from '../components/ChinaMap'
import { MetricPills } from '../components/MetricPills'
import { ModuleNav } from '../components/ModuleNav'
import {
  COCKPIT_MAP_CANVAS,
  COCKPIT_PAGE_GAP,
  COCKPIT_PAGE_PADDING,
  COCKPIT_TITLE,
  DATE_RANGE,
  DEFAULT_ACTIVE_MODULE,
  LEFT_MODULES,
  MODULE_METRICS,
  RIGHT_MODULES,
} from '../constants'
import type { ModuleEntry } from '../types'

/**
 * 首页第 2 页（中间页，默认显示）：全景座舱。
 *
 * 就是原首页的中栏——顶部标题、播报条、左右两组模块入口夹着中国地图，
 * 底部是随选中模块切换的指标条。
 *
 * 立成整屏后用比另两页更小的画布（`COCKPIT_MAP_CANVAS`）并按 `fill` 缩放：
 * 字号随屏幕宽度放大、高度跟视口走，四边不留空；左右留白压到 8px，两块模块列
 * 贴到屏幕边上，地图占满中间——地图本身不再额外 zoom，中国左右两端完整露出。
 */
export function MapScreen({ screenLayout }: { screenLayout?: ScreenLayout }) {
  const navigate = useNavigate()
  const [activeModule, setActiveModule] = useState(DEFAULT_ACTIVE_MODULE)

  const metrics = MODULE_METRICS[activeModule] ?? MODULE_METRICS.job

  const handleOpen = (item: ModuleEntry) => navigate(item.route)

  return (
    <div className="theme-cloud-light">
      <ScreenScaler
        width={COCKPIT_MAP_CANVAS.width}
        height={COCKPIT_MAP_CANVAS.height}
        mode="fill"
        layout={screenLayout}
      >
        <div className="flex h-full w-full flex-col">
          <ScreenHeader title={COCKPIT_TITLE} height={58} right={<HeaderRight />} />

          <div
            className="flex min-h-0 flex-1 flex-col"
            style={{ paddingInline: COCKPIT_PAGE_PADDING, paddingTop: 12, paddingBottom: 24 }}
          >
            <AlertBanner className="h-[44px] shrink-0" />

            <div
              className="flex min-h-0 flex-1 items-stretch"
              style={{ marginTop: COCKPIT_PAGE_GAP, gap: 16 }}
            >
              <ModuleNav
                items={LEFT_MODULES}
                activeKey={activeModule}
                onSelect={setActiveModule}
                onOpen={handleOpen}
                className="w-[236px] shrink-0"
              />

              <ChinaMap className="min-w-0 flex-1" />

              <ModuleNav
                items={RIGHT_MODULES}
                activeKey={activeModule}
                onSelect={setActiveModule}
                onOpen={handleOpen}
                className="w-[236px] shrink-0"
              />
            </div>

            <MetricPills
              items={metrics}
              className="h-[84px] shrink-0"
              /* 与播报条保持同款呼吸感 */
              style={{ marginTop: COCKPIT_PAGE_GAP }}
            />
          </div>
        </div>
      </ScreenScaler>
    </div>
  )
}

/** 顶栏右侧：播报开关 + 日期区间 */
function HeaderRight() {
  return (
    <>
      <button
        type="button"
        className="flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-[3px] border border-(--border) text-[16px] text-(--ck-cyan) transition-colors hover:bg-(--accent-light)"
        title="播报开关"
      >
        <i className="ri-volume-up-line" aria-hidden />
      </button>

      <div className="flex items-center gap-2 rounded-[3px] border border-(--border) bg-(--ck-panel-inner) px-2.5 py-[6px]">
        <i className="ri-calendar-line text-[14px] text-(--ck-cyan)" aria-hidden />
        <span className="text-[13px] leading-none text-(--ck-title-sub) tabular-nums">
          {DATE_RANGE.start}
        </span>
        <span className="text-[12px] leading-none text-(--text-tertiary)">至</span>
        <span className="text-[13px] leading-none text-(--ck-title-sub) tabular-nums">
          {DATE_RANGE.end}
        </span>
      </div>
    </>
  )
}
