import { useMemo } from 'react'

import { PanelBox, SectionTitle, useChartColors } from '@/components/cockpit-ui'

import { buildBizOption, buildResourceOption } from './systemChartOptions'
import {
  SYSTEM_BANK_DELAY,
  SYSTEM_CORE_ARCS,
  SYSTEM_CORE_BALLS,
  SYSTEM_EXPERIENCE_STATS,
  SYSTEM_JOB_STATS,
  SYSTEM_RESOURCE_RINGS,
  SYSTEM_RESOURCE_STATS,
  SYSTEM_SUPPORT_GAUGES,
} from './systemData'
import {
  ArcGauge,
  Chart,
  ColorHalfGauge,
  LiquidBall,
  PedestalStat,
  PlateCard,
  RingStat,
} from './systemWidgets'

/** 系统运行管理平台的中间业务区（对应 `_refs/live/19-系统运行管理平台.png`） */
export function SystemPlatformContent() {
  return (
    <div className="flex min-h-0 flex-1 gap-3">
      <div className="flex min-h-0 w-[910px] shrink-0 flex-col gap-3">
        <BaseResourcePanel />
        <BusinessOperationPanel />
      </div>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-3">
        <KeyJobPanel />
        <SupportPanel />
      </div>
    </div>
  )
}

/* ───────────── 系统基础资源监控 ───────────── */

function BaseResourcePanel() {
  const c = useChartColors()
  const option = useMemo(() => buildResourceOption(c), [c])

  return (
    <PanelBox title="系统基础资源监控" className="flex min-h-0 flex-1 flex-col">
      <div className="flex h-full gap-2 px-3 pt-2 pb-3">
        <div className="flex w-[268px] shrink-0 flex-col gap-3">
          <div className="flex shrink-0 justify-around pt-1">
            {SYSTEM_RESOURCE_RINGS.map((item) => (
              <RingStat key={item.label} item={item} />
            ))}
          </div>

          <div className="flex min-h-0 flex-1 flex-col justify-end gap-2.5 pb-1">
            {SYSTEM_RESOURCE_STATS.map((stat) => (
              <PlateCard key={stat.label} stat={stat} className="h-[58px] shrink-0" />
            ))}
          </div>
        </div>

        <div className="min-h-0 min-w-0 flex-1">
          <Chart option={option} />
        </div>
      </div>
    </PanelBox>
  )
}

/* ───────────── 业务操作功能管理 ───────────── */

function BusinessOperationPanel() {
  return (
    <PanelBox title="业务操作功能管理" className="flex min-h-0 flex-1 flex-col">
      <div className="flex h-full gap-3.5 px-4 pt-2 pb-2.5">
        <div className="flex w-[250px] shrink-0 flex-col">
          <SectionTitle className="shrink-0">用户操作体验情况</SectionTitle>
          <div className="flex min-h-0 flex-1 flex-col justify-around py-1">
            {SYSTEM_EXPERIENCE_STATS.map((stat) => (
              <PedestalStat key={stat.label} stat={stat} />
            ))}
          </div>
        </div>

        <span
          className="w-px shrink-0"
          style={{
            background:
              'linear-gradient(180deg, transparent, var(--ck-panel-border) 30%, var(--ck-panel-border) 70%, transparent)',
          }}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <SectionTitle className="shrink-0">核心功能操作稳定性情况</SectionTitle>

          <div className="grid min-h-0 flex-1 grid-cols-4 grid-rows-2 items-center justify-items-center">
            {SYSTEM_CORE_ARCS.map((item) => (
              <ArcGauge key={item.label} item={item} />
            ))}

            {SYSTEM_CORE_BALLS.map((item) => (
              <LiquidBall key={item.label} item={item} />
            ))}

            <div className="flex flex-col items-center gap-2">
              <span className="flex items-baseline gap-1">
                <span className="ck-glow-num text-[26px] leading-none font-bold text-(--foreground)">
                  {SYSTEM_BANK_DELAY.value}
                </span>
                <span className="text-[13px] text-(--ck-cyan)">{SYSTEM_BANK_DELAY.unit}</span>
              </span>
              <svg width="92" height="30" viewBox="0 0 92 30" fill="none" aria-hidden>
                <ellipse cx="46" cy="12" rx="26" ry="7" fill="var(--ck-blue)" opacity="0.18" />
                <ellipse cx="46" cy="12" rx="26" ry="7" stroke="var(--ck-cyan)" strokeOpacity="0.5" />
                <ellipse cx="46" cy="21" rx="38" ry="9" fill="var(--ck-blue)" opacity="0.16" />
                <ellipse cx="46" cy="21" rx="38" ry="9" stroke="var(--ck-blue)" strokeOpacity="0.3" />
              </svg>
              <span className="text-[13px] leading-none text-(--ck-title-sub)">
                {SYSTEM_BANK_DELAY.label}
              </span>
            </div>
          </div>
        </div>
      </div>
    </PanelBox>
  )
}

/* ───────────── 关键作业功能监控 ───────────── */

function KeyJobPanel() {
  const c = useChartColors()
  const option = useMemo(() => buildBizOption(c), [c])

  return (
    <PanelBox title="关键作业功能监控" className="flex min-h-0 flex-[1.44] flex-col">
      <div className="flex h-full flex-col gap-2 px-4 pt-2 pb-2.5">
        <SectionTitle className="shrink-0">业务办理功能稳定情况</SectionTitle>

        <div className="min-h-0 flex-[1.4]">
          <Chart option={option} />
        </div>

        <SectionTitle className="shrink-0 pt-1">作业分配功能稳定情况</SectionTitle>

        <div className="grid min-h-0 flex-1 grid-cols-2 grid-rows-2 gap-3 pb-1">
          {SYSTEM_JOB_STATS.map((stat) => (
            <PlateCard key={stat.label} stat={stat} stacked className="min-h-0" />
          ))}
        </div>
      </div>
    </PanelBox>
  )
}

/* ───────────── 系统对业务支撑管理 ───────────── */

function SupportPanel() {
  return (
    <PanelBox title="系统对业务支撑管理" className="flex min-h-0 flex-[0.56] flex-col">
      <div className="flex h-full items-center justify-around px-4 pb-1">
        {SYSTEM_SUPPORT_GAUGES.map((g) => (
          <ColorHalfGauge key={g.label} label={g.label} value={g.value} />
        ))}
      </div>
    </PanelBox>
  )
}
