import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { DateRangePicker, ScreenHeader, ScreenScaler } from '@/components/cockpit-ui'
import type { DateRangeValue, ScreenLayout } from '@/components/cockpit-ui'

import { AlertBanner } from '../components/AlertBanner'
import { ChinaMap } from '../components/ChinaMap'
import { MetricPills } from '../components/MetricPills'
import { ModuleNav } from '../components/ModuleNav'
import {
  COCKPIT_PAGE_CANVAS,
  COCKPIT_PAGE_GAP,
  COCKPIT_PAGE_PADDING,
  COCKPIT_PAGE_PAD_BOTTOM,
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
 * 与另两屏及管理平台使用同一画布，顶栏 72px、模块间隔 12px，地图自适应中部空间。
 */
export function MapScreen({ screenLayout }: { screenLayout?: ScreenLayout }) {
  const navigate = useNavigate()
  const [activeModule, setActiveModule] = useState(DEFAULT_ACTIVE_MODULE)

  const metrics = MODULE_METRICS[activeModule] ?? MODULE_METRICS.job

  const handleOpen = (item: ModuleEntry) => navigate(item.route)

  return (
    <div className="theme-cloud-light">
      <ScreenScaler
        width={COCKPIT_PAGE_CANVAS.width}
        height={COCKPIT_PAGE_CANVAS.height}
        layout={screenLayout}
      >
        <div className="flex h-full w-full flex-col">
          <ScreenHeader title={COCKPIT_TITLE} height={72} right={<HeaderRight />} className="z-20" />

          <div
            className="flex min-h-0 flex-1 flex-col"
            style={{
              paddingInline: COCKPIT_PAGE_PADDING,
              paddingTop: 6,
              paddingBottom: COCKPIT_PAGE_PAD_BOTTOM,
            }}
          >
            <AlertBanner className="h-[44px] shrink-0" />

            <div
              className="flex min-h-0 flex-1 items-stretch"
              style={{ marginTop: COCKPIT_PAGE_GAP, gap: COCKPIT_PAGE_GAP }}
            >
              <ModuleNav
                items={LEFT_MODULES}
                activeKey={activeModule}
                onSelect={setActiveModule}
                onOpen={handleOpen}
                className="w-[280px] shrink-0"
              />

              <ChinaMap className="min-w-0 flex-1" />

              <ModuleNav
                items={RIGHT_MODULES}
                activeKey={activeModule}
                onSelect={setActiveModule}
                onOpen={handleOpen}
                className="w-[280px] shrink-0"
              />
            </div>

            <MetricPills
              items={metrics}
              className="h-[80px] shrink-0"
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
  const [dateRange, setDateRange] = useState<DateRangeValue>(DATE_RANGE)

  return (
    <>
      <button
        type="button"
        className="flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-[3px] border border-(--border) text-[16px] text-(--ck-cyan) transition-colors hover:bg-(--accent-light)"
        title="播报开关"
      >
        <i className="ri-volume-up-line" aria-hidden />
      </button>

      <div className="flex items-center gap-2 rounded-[3px] border border-(--border) bg-(--ck-panel-inner) px-2 py-[5px]">
        <i className="ri-calendar-2-line text-[14px] text-(--ck-cyan)" aria-hidden />
        <DateRangePicker value={dateRange} onChange={setDateRange} panelAlign="right" />
      </div>
    </>
  )
}
