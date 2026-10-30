import ReactECharts from 'echarts-for-react'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { SectionTitle, useChartColors } from '@/components/cockpit-ui'

import { DrillDonut, DrillFilterBar, DrillScreen, DrillTabBar, DrillTable } from './components'
import { TRAVEL_PERIOD, TRAVEL_VEHICLE_TABS } from './travelConstants'
import { buildBarOption, buildLineOption } from './travelChartOptions'
import {
  TRAVEL_HOTEL_COLUMNS,
  TRAVEL_HOTEL_ROWS,
  TRAVEL_HOTEL_SERIES,
  TRAVEL_PRICE_COLUMNS,
  TRAVEL_PRICE_ROWS,
  TRAVEL_RATE_COLUMNS,
  TRAVEL_RATE_MONTHS,
  TRAVEL_RATE_ROWS,
  TRAVEL_RATE_SERIES,
  TRAVEL_SETTLEMENT_MONTHS,
  TRAVEL_SETTLEMENT_SEGMENTS,
  TRAVEL_SETTLEMENT_SERIES,
  TRAVEL_USAGE_COLUMNS,
  TRAVEL_USAGE_ROWS,
} from './travelUsageData'

const CHART_PROPS = {
  style: { height: '100%', width: '100%' },
  opts: { renderer: 'canvas' as const },
  notMerge: true,
}

/**
 * 钻取明细页 ·「商旅使用情况」（路由 `/drill/travel-usage`，对应参考图 1～3）。
 *
 * 参考图是一屏多面板的拼盘，这里同等拆成五行：
 *   顶部：商旅业务整体情况（火车／飞机／酒店三个页签 + 可滚动表）
 *   第二行：商旅采购量和价格情况 ｜ 商旅服务商结算总金额（环 + 柱）
 *   第三行：常驻酒店（折线 + 表） ｜ 商旅平台使用率（折线 + 表）
 */
export function TravelUsageDrillPage() {
  const c = useChartColors()
  const [searchParams] = useSearchParams()

  const [activeTab, setActiveTab] = useState<string>(() => {
    const wanted = searchParams.get('tab')
    return TRAVEL_VEHICLE_TABS.some((tab) => tab.key === wanted)
      ? (wanted as string)
      : TRAVEL_VEHICLE_TABS[0].key
  })

  const usageRows = TRAVEL_USAGE_ROWS[activeTab] ?? TRAVEL_USAGE_ROWS.train

  const settlementOption = useMemo(
    () => buildBarOption(c, TRAVEL_SETTLEMENT_MONTHS, TRAVEL_SETTLEMENT_SERIES),
    [c]
  )
  const hotelOption = useMemo(
    () => buildLineOption(c, TRAVEL_RATE_MONTHS, TRAVEL_HOTEL_SERIES),
    [c]
  )
  const rateOption = useMemo(() => buildLineOption(c, TRAVEL_RATE_MONTHS, TRAVEL_RATE_SERIES), [c])

  return (
    <DrillScreen>
      <DrillFilterBar
        title="商旅使用情况"
        defaultStart={TRAVEL_PERIOD.start}
        defaultEnd={TRAVEL_PERIOD.end}
        className="h-[70px]"
      />

      {/* 行一：商旅业务整体情况（三页签 + 可滚动表） */}
      <section className="ck-panel flex min-h-0 flex-[1.25] flex-col rounded-(--ck-panel-radius) p-3">
        <div className="flex shrink-0 items-center justify-between gap-3 pb-2">
          <SectionTitle>商旅业务整体情况</SectionTitle>
          <DrillTabBar
            tabs={TRAVEL_VEHICLE_TABS}
            active={activeTab}
            onChange={setActiveTab}
            className="h-[46px]"
          />
        </div>
        <DrillTable
          bare
          columns={TRAVEL_USAGE_COLUMNS}
          rows={usageRows}
          dense
          className="min-h-0 flex-1"
        />
      </section>

      {/* 行二：采购量与价格 ｜ 结算总金额 */}
      <div className="flex min-h-0 flex-1 gap-3">
        <DrillTable
          title="商旅采购量和价格情况"
          columns={TRAVEL_PRICE_COLUMNS}
          rows={TRAVEL_PRICE_ROWS}
          dense
          className="min-h-0 flex-[1.1]"
        />

        <section className="ck-panel flex min-h-0 flex-1 flex-col rounded-(--ck-panel-radius) p-3">
          <SectionTitle>商旅业务整体情况 — 商旅服务商结算总金额</SectionTitle>
          <div className="mt-2 flex min-h-0 flex-1 gap-3">
            <DrillDonut
              segments={TRAVEL_SETTLEMENT_SEGMENTS}
              centerLabel="平台结算"
              centerValue="3,787,240"
              className="w-[380px] shrink-0"
            />
            <div className="min-h-0 min-w-0 flex-1">
              <ReactECharts option={settlementOption} {...CHART_PROPS} />
            </div>
          </div>
        </section>
      </div>

      {/* 行三：常驻酒店 ｜ 平台使用率 */}
      <div className="flex min-h-0 flex-1 gap-3">
        <section className="ck-panel flex min-h-0 flex-1 flex-col rounded-(--ck-panel-radius) p-3">
          <SectionTitle>商旅采购量和价格情况 — 常驻酒店</SectionTitle>
          <div className="mt-1 h-[132px] shrink-0">
            <ReactECharts option={hotelOption} {...CHART_PROPS} />
          </div>
          <DrillTable
            bare
            columns={TRAVEL_HOTEL_COLUMNS}
            rows={TRAVEL_HOTEL_ROWS}
            dense
            className="mt-1 min-h-0 flex-1"
          />
        </section>

        <section className="ck-panel flex min-h-0 flex-1 flex-col rounded-(--ck-panel-radius) p-3">
          <SectionTitle>商旅平台使用率</SectionTitle>
          <div className="mt-1 h-[132px] shrink-0">
            <ReactECharts option={rateOption} {...CHART_PROPS} />
          </div>
          <DrillTable
            bare
            columns={TRAVEL_RATE_COLUMNS}
            rows={TRAVEL_RATE_ROWS}
            dense
            className="mt-1 min-h-0 flex-1"
          />
        </section>
      </div>
    </DrillScreen>
  )
}
