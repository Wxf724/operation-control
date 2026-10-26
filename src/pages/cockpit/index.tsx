import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ScreenHeader, ScreenScaler } from '@/components/cockpit-ui'

import { ControlModelBlock } from '@/pages/platform/components/ControlModelBlock'
import { AlertBanner } from './components/AlertBanner'
import { CenterStatusPanel } from './components/CenterStatusPanel'
import { ChinaMap } from './components/ChinaMap'
import { MetricPills } from './components/MetricPills'
import { ModuleNav } from './components/ModuleNav'
import { QuickActionPanel } from './components/QuickActionPanel'
import { ResultKpiPanel } from './components/ResultKpiPanel'
import { TrendPanel } from './components/TrendPanel'
import {
  COCKPIT_CANVAS,
  COCKPIT_TITLE,
  DATE_RANGE,
  DEFAULT_ACTIVE_MODULE,
  LEFT_MODULES,
  MODULE_METRICS,
  RIGHT_MODULES,
} from './constants'
import type { ModuleEntry } from './types'

/**
 * 第 1 屏：运营监控与调控全景座舱
 *
 * 布局按原截图 1:1 还原（画布 3540×940）：
 * 左栏 914 / 中栏 1506 / 右栏 968，列间距 26，左右留白 50。
 */
export function CockpitPage() {
  const navigate = useNavigate()
  const [activeModule, setActiveModule] = useState(DEFAULT_ACTIVE_MODULE)

  const metrics = MODULE_METRICS[activeModule] ?? MODULE_METRICS.job

  const handleOpen = (item: ModuleEntry) => navigate(item.route)

  return (
    <div className="theme-cloud-light">
      <ScreenScaler width={COCKPIT_CANVAS.width} height={COCKPIT_CANVAS.height}>
        <div className="flex h-full w-full flex-col">
          <ScreenHeader title={COCKPIT_TITLE} height={58} right={<HeaderRight />} />

          <div className="flex min-h-0 flex-1" style={{ paddingInline: 50, gap: 26 }}>
            {/* ── 左栏 ───────────────────────── */}
            <div
              className="flex shrink-0 flex-col"
              style={{ width: 914, paddingTop: 6, paddingBottom: 23, gap: 14 }}
            >
              <ResultKpiPanel className="h-[198px] shrink-0" />
              <CenterStatusPanel className="h-[308px] shrink-0" />
              <TrendPanel className="min-h-0 flex-1" />
            </div>

            {/* ── 中栏 ───────────────────────── */}
            <div
              className="flex min-w-0 flex-1 flex-col"
              style={{ paddingTop: 34, paddingBottom: 55 }}
            >
              <AlertBanner className="h-[39px] shrink-0" />

              <div
                className="flex min-h-0 flex-1 items-stretch"
                style={{ marginTop: 28, gap: 8 }}
              >
                <ModuleNav
                  items={LEFT_MODULES}
                  activeKey={activeModule}
                  onSelect={setActiveModule}
                  onOpen={handleOpen}
                  className="w-[270px] shrink-0"
                />

                <ChinaMap className="min-w-0 flex-1" />

                <ModuleNav
                  items={RIGHT_MODULES}
                  activeKey={activeModule}
                  onSelect={setActiveModule}
                  onOpen={handleOpen}
                  className="w-[270px] shrink-0"
                />
              </div>

              <MetricPills
                items={metrics}
                className="h-[74px] shrink-0"
                /* 与原图一致：指标条与地图区留 38px */
                style={{ marginTop: 38 }}
              />
            </div>

            {/* ── 右栏 ───────────────────────── */}
            <div
              className="flex shrink-0 flex-col"
              style={{ width: 968, paddingTop: 6, paddingBottom: 23, gap: 14 }}
            >
              <ControlModelBlock className="min-h-0 flex-1" />
              <QuickActionPanel className="h-[121px] shrink-0" />
            </div>
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
