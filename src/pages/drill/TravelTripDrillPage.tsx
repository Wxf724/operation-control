import ReactECharts from 'echarts-for-react'
import { useMemo } from 'react'

import { SectionTitle, useChartColors } from '@/components/cockpit-ui'

import { DrillDonut, DrillFilterBar, DrillMetricRow, DrillScreen, DrillTable } from './components'
import { TRAVEL_PERIOD } from './travelConstants'
import { buildBarOption, buildRadarOption } from './travelChartOptions'
import {
  TRAVEL_CHANGE_COLUMNS,
  TRAVEL_CHANGE_ROWS,
  TRAVEL_CYCLE_COLUMNS,
  TRAVEL_CYCLE_ROWS,
  TRAVEL_DAYS_DONUT,
  TRAVEL_RADAR_INDICATORS,
  TRAVEL_RADAR_VALUES,
  TRAVEL_TOP_CITIES,
  TRAVEL_TOP_CITY_SERIES,
  TRAVEL_TRIP_METRICS,
  TRAVEL_VEHICLE_DONUT,
} from './travelTripData'

const CHART_PROPS = {
  style: { height: '100%', width: '100%' },
  opts: { renderer: 'canvas' as const },
  notMerge: true,
}

/**
 * 钻取明细页 ·「商旅出行情况」（路由 `/drill/travel-trip`，对应参考图 4）。
 *
 * 结构：日期区间 → 6 张指标卡（4 + 2）→ 热门目的城市柱图 ｜ 出差城市雷达 ｜ 两个环形
 *      → 报销预订天数与退改签周期表 → 退票改签情况-个人表。
 */
export function TravelTripDrillPage() {
  const c = useChartColors()

  const cityOption = useMemo(
    () => buildBarOption(c, TRAVEL_TOP_CITIES, TRAVEL_TOP_CITY_SERIES),
    [c]
  )
  const radarOption = useMemo(
    () => buildRadarOption(c, TRAVEL_RADAR_INDICATORS, TRAVEL_RADAR_VALUES, 10),
    [c]
  )

  return (
    <DrillScreen>
      <DrillFilterBar
        title="商旅出行情况"
        defaultStart={TRAVEL_PERIOD.start}
        defaultEnd={TRAVEL_PERIOD.end}
        className="h-[70px]"
      />

      <DrillMetricRow rows={TRAVEL_TRIP_METRICS} />

      <div className="flex min-h-0 flex-1 gap-3">
        <section className="ck-panel flex min-h-0 flex-[1.5] flex-col rounded-(--ck-panel-radius) p-3">
          <SectionTitle>热门目的城市 top20</SectionTitle>
          <div className="mt-1 min-h-0 flex-1">
            <ReactECharts option={cityOption} {...CHART_PROPS} />
          </div>
        </section>

        <section className="ck-panel flex min-h-0 w-[460px] shrink-0 flex-col rounded-(--ck-panel-radius) p-3">
          <SectionTitle>出差城市分布</SectionTitle>
          <div className="mt-1 min-h-0 flex-1">
            <ReactECharts option={radarOption} {...CHART_PROPS} />
          </div>
        </section>

        <section className="ck-panel flex min-h-0 w-[420px] shrink-0 flex-col gap-2 rounded-(--ck-panel-radius) p-3">
          <div className="flex min-h-0 flex-1 flex-col">
            <SectionTitle>交通工具分布</SectionTitle>
            <DrillDonut segments={TRAVEL_VEHICLE_DONUT} className="mt-1 min-h-0 flex-1" />
          </div>
          <span className="h-px shrink-0 bg-(--border-light)" />
          <div className="flex min-h-0 flex-1 flex-col">
            <SectionTitle>出差天数分布</SectionTitle>
            <DrillDonut segments={TRAVEL_DAYS_DONUT} className="mt-1 min-h-0 flex-1" />
          </div>
        </section>
      </div>

      <DrillTable
        title="报销预订天数与退改签周期"
        columns={TRAVEL_CYCLE_COLUMNS}
        rows={TRAVEL_CYCLE_ROWS}
        dense
        className="h-[228px] shrink-0"
      />

      <DrillTable
        title="退票改签情况 — 个人"
        columns={TRAVEL_CHANGE_COLUMNS}
        rows={TRAVEL_CHANGE_ROWS}
        dense
        className="min-h-0 flex-1"
      />
    </DrillScreen>
  )
}
