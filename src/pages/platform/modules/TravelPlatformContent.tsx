import ReactECharts from 'echarts-for-react'
import { useMemo, useState } from 'react'

import { PanelBox, SectionTitle, useChartColors, useCssVars } from '@/components/cockpit-ui'
import { DrillTitleLink } from '@/pages/drill/components'
import { TRAVEL_USAGE_DRILL_PATH, TRAVEL_TRIP_DRILL_PATH } from '@/pages/drill/travelConstants'

import { TravelDoubtPanel, TravelReimbursePanel } from './travelBottomPanels'
import {
  buildDiscountOption,
  buildHotelPriceOption,
  buildOrderAmountOption,
  buildPriceTrendOption,
} from './travelCharts'
import {
  TRAVEL_BUSINESS_SHARES,
  TRAVEL_CHANGE_RINGS,
  TRAVEL_CHANGE_ROWS,
  TRAVEL_DEST_ROWS,
  TRAVEL_OVERDUE_AMOUNTS,
  TRAVEL_OVERDUE_SHARES,
  TRAVEL_OVERDUE_TOTAL,
  TRAVEL_PLATFORM_RATE,
  TRAVEL_PRICE_FILTERS,
  TRAVEL_USAGE_GAUGES,
} from './travelData'
import { TravelSemiGauge } from './travelGauges'
import { TravelBarList, TravelDonut, TravelPlate, TravelRing } from './travelWidgets'

const CHART_PROPS = {
  style: { height: '100%', width: '100%' },
  opts: { renderer: 'canvas' as const },
  notMerge: true,
}

/** 折线数值标签用的前景色变量，`useChartColors()` 不含它 */
const FOREGROUND_VAR = ['--foreground'] as const

/** 商旅业务管理平台的中间业务区（对应线上截图 20-商旅业务管理平台） */
export function TravelPlatformContent() {
  return (
    <div className="flex min-h-0 flex-1 gap-2.5">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-2.5">
        <div className="flex min-h-0 flex-1 gap-2.5">
          <TravelUsagePanel className="min-w-0 flex-1" />
          <TravelTripPanel className="min-w-0 flex-1" />
        </div>

        <div className="flex h-[288px] shrink-0 gap-2.5">
          <TravelReimbursePanel className="min-w-0 flex-1" />
          <TravelDoubtPanel className="w-[452px] shrink-0" />
        </div>
      </div>
    </div>
  )
}

/* ───────────── 上行左：商旅使用情况 ───────────── */

function TravelUsagePanel({ className = '' }: { className?: string }) {
  return (
    <PanelBox
      title={<DrillTitleLink title="商旅使用情况" to={TRAVEL_USAGE_DRILL_PATH} />}
      className={`flex flex-col ${className}`}
      bodyClassName="flex min-h-0 flex-1 gap-3 px-3.5 pt-2 pb-2.5"
    >
      <UsageOverviewColumn />
      <span className="w-px shrink-0 bg-(--border-light)" />
      <PriceTrendColumn />
    </PanelBox>
  )
}

function UsageOverviewColumn() {
  const c = useChartColors()
  const option = useMemo(() => buildOrderAmountOption(c), [c])

  return (
    <section className="flex min-w-0 flex-[0.56] flex-col gap-1.5">
      <SectionTitle className="shrink-0">商旅平台使用情况</SectionTitle>

      <div className="flex shrink-0 items-baseline gap-1 pl-1">
        <span className="text-[14px] leading-none text-(--foreground)">商旅平台使用率</span>
        <span className="ck-glow-num text-[26px] leading-none font-bold text-(--ck-cyan)">
          {TRAVEL_PLATFORM_RATE}
        </span>
      </div>

      <div className="flex shrink-0 items-start justify-between gap-1">
        {TRAVEL_USAGE_GAUGES.map((g) => (
          <TravelSemiGauge key={g.label} value={g.value} tone={g.tone} label={g.label} />
        ))}
      </div>

      <SectionTitle className="shrink-0">商旅业务整体情况</SectionTitle>

      <div className="flex shrink-0 items-center gap-3">
        <TravelDonut shares={TRAVEL_BUSINESS_SHARES} size={96} />

        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          {TRAVEL_BUSINESS_SHARES.map((s) => (
            <div
              key={s.label}
              className="ck-card flex items-baseline gap-1.5 rounded-[3px] px-2.5 py-[7px]"
            >
              <i
                className="h-[7px] w-[7px] shrink-0 translate-y-[-1px] rounded-full"
                style={{ background: `var(${s.tone})` }}
              />
              <span className="text-[13px] leading-none text-(--foreground)">{s.label}</span>
              <span className="text-[16px] leading-none font-bold text-(--ck-title) tabular-nums">
                {s.amount}
              </span>
              <span className="text-[11px] leading-none text-(--text-tertiary)">{s.unit}</span>
              <span className="ml-auto text-[12px] leading-none text-(--text-secondary)">占比</span>
              <span className="text-[14px] leading-none font-bold text-(--ck-title) tabular-nums">
                {s.share}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-between gap-2 text-[11px] leading-none text-(--text-secondary)">
        <span>单位：万元</span>
        <span className="flex items-center gap-1.5">
          <i className="h-[8px] w-[8px] shrink-0 bg-(--ck-blue)" />
          商旅预订订单总金额
        </span>
        <span>单位：万张</span>
      </div>

      <div className="min-h-0 flex-1">
        <ReactECharts option={option} {...CHART_PROPS} />
      </div>
    </section>
  )
}

function PriceTrendColumn() {
  const c = useChartColors()
  const fg = useCssVars(FOREGROUND_VAR)['--foreground'] ?? 'transparent'
  const trend = useMemo(() => buildPriceTrendOption(c), [c])
  const hotel = useMemo(() => buildHotelPriceOption(c, fg), [c, fg])
  const discount = useMemo(() => buildDiscountOption(c, fg), [c, fg])

  return (
    <section className="flex min-w-0 flex-[0.44] flex-col gap-1.5">
      <SectionTitle className="shrink-0">商旅价格波动情况</SectionTitle>

      <div className="flex shrink-0 items-center justify-between gap-2">
        <TravelSelect options={TRAVEL_PRICE_FILTERS} label="商旅价格波动口径" />
        <span className="text-[12px] leading-none text-(--text-secondary)">单位：张</span>
      </div>

      <div className="min-h-0 flex-1">
        <ReactECharts option={trend} {...CHART_PROPS} />
      </div>

      <SubChartLabel title="常住酒店价格浮动情况" unit="单位：元" />
      <div className="min-h-0 flex-1">
        <ReactECharts option={hotel} {...CHART_PROPS} />
      </div>

      <SubChartLabel title="常飞航线综合折扣率" unit="单位：折" />
      <div className="min-h-0 flex-1">
        <ReactECharts option={discount} {...CHART_PROPS} />
      </div>
    </section>
  )
}

function SubChartLabel({ title, unit }: { title: string; unit: string }) {
  return (
    <div className="flex shrink-0 items-baseline justify-between gap-2">
      <span className="text-[13px] leading-none font-semibold text-(--ck-title-sub)">{title}</span>
      <span className="text-[12px] leading-none text-(--text-secondary)">{unit}</span>
    </div>
  )
}

/** 面板内的口径下拉筛选 */
function TravelSelect({ options, label }: { options: readonly string[]; label: string }) {
  const [value, setValue] = useState<string>(options[0])

  return (
    <label className="relative flex min-w-0 flex-1 items-center">
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-label={label}
        className="w-full cursor-pointer appearance-none rounded-[3px] border border-(--border) bg-(--ck-panel-inner) py-[6px] pr-7 pl-2.5 text-[12px] leading-none text-(--ck-title-sub) outline-none focus:border-(--ck-cyan)"
      >
        {options.map((o) => (
          <option key={o} value={o} className="bg-(--surface)">
            {o}
          </option>
        ))}
      </select>
      <i
        className="ri-arrow-down-s-line pointer-events-none absolute right-2 text-[16px] text-(--ck-cyan)"
        aria-hidden
      />
    </label>
  )
}

/* ───────────── 上行右：商旅出行情况 ───────────── */

function TravelTripPanel({ className = '' }: { className?: string }) {
  return (
    <PanelBox
      title={<DrillTitleLink title="商旅出行情况" to={TRAVEL_TRIP_DRILL_PATH} />}
      className={`flex flex-col ${className}`}
      bodyClassName="flex min-h-0 flex-1 gap-4 px-3.5 pt-2 pb-2.5"
    >
      <section className="flex min-w-0 flex-[0.45] flex-col gap-1.5">
        <SectionTitle className="shrink-0">商旅行程概况</SectionTitle>
        <DestinationTable />
      </section>

      <section className="flex min-w-0 flex-[0.55] flex-col gap-1.5">
        <SectionTitle className="shrink-0">用户退改签情况</SectionTitle>
        <ChangeRefundBlock />
      </section>
    </PanelBox>
  )
}

function DestinationTable() {
  return (
    <div className="min-h-0 flex-1">
      <table className="h-full w-full table-fixed border-collapse text-[13px]">
        <colgroup>
          <col style={{ width: '46px' }} />
          <col style={{ width: '86px' }} />
          <col />
        </colgroup>

        <thead>
          <tr className="bg-(--ck-table-head)">
            <th className="px-1 py-[7px] text-center font-medium text-(--ck-title-sub)">序号</th>
            <th className="px-1 py-[7px] text-center font-medium text-(--ck-title-sub)">
              热门出差目
              <br />
              的地TOP20
            </th>
            <th className="px-2 py-[7px] text-center font-medium whitespace-nowrap text-(--ck-title-sub)">
              热门目的地费用总金额
            </th>
          </tr>
        </thead>

        <tbody>
          {TRAVEL_DEST_ROWS.map((row, i) => (
            <tr
              key={row.index}
              className={i % 2 ? 'bg-(--ck-table-row-alt)' : 'bg-(--ck-table-row)'}
            >
              <td className="px-1 text-center text-(--text-secondary) tabular-nums">{row.index}</td>
              <td className="px-1 text-center text-(--foreground)">{row.city}</td>
              <td className="px-2">
                <div className="flex items-center gap-2">
                  <span className="w-[66px] shrink-0 text-right font-semibold text-(--ck-title) tabular-nums">
                    {row.amount}
                  </span>
                  <span className="h-[5px] min-w-0 flex-1 rounded-full bg-(--ck-panel-inner)">
                    <span
                      className="block h-full rounded-full"
                      style={{
                        width: `${row.percent}%`,
                        background:
                          'linear-gradient(90deg, var(--ck-purple), var(--ck-blue), var(--ck-cyan))',
                        boxShadow: '0 0 6px var(--ck-cyan)',
                      }}
                    />
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ChangeRefundBlock() {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-1">
      <div className="flex min-h-0 flex-1 items-center gap-3">
        <div className="flex w-[124px] shrink-0 justify-center">
          <TravelRing stat={TRAVEL_CHANGE_RINGS[0]} size={110} />
        </div>
        <div className="flex min-w-0 flex-1 items-start">
          <ChangeTable />
        </div>
      </div>

      <div className="flex min-h-0 flex-1 items-center gap-3">
        <div className="flex w-[124px] shrink-0 justify-center">
          <TravelRing stat={TRAVEL_CHANGE_RINGS[1]} size={110} />
        </div>
        <div className="min-w-0 flex-1">
          <TravelBarList rows={TRAVEL_OVERDUE_SHARES} />
        </div>
      </div>

      <div className="flex min-h-0 flex-1 items-center gap-3">
        <div className="flex w-[124px] shrink-0 flex-col items-center gap-0.5">
          <span className="text-[12px] leading-none whitespace-nowrap text-(--ck-title-sub)">
            逾期未出行订单总金额
          </span>
          <TravelPlate value={TRAVEL_OVERDUE_TOTAL} unit="万元" variant="hex" />
        </div>
        <div className="min-w-0 flex-1">
          <TravelBarList rows={TRAVEL_OVERDUE_AMOUNTS} />
        </div>
      </div>
    </div>
  )
}

const CHANGE_COLUMNS = ['维度', '总数量', '总金额(万元)']

function ChangeTable() {
  return (
    <table className="w-full table-fixed border-collapse text-[12px]">
      <thead>
        <tr className="bg-(--ck-table-head)">
          {CHANGE_COLUMNS.map((label) => (
            <th
              key={label}
              className="px-1 py-[6px] text-center font-medium whitespace-nowrap text-(--ck-title-sub)"
            >
              {label}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {TRAVEL_CHANGE_ROWS.map((row, i) => (
          <tr key={row.dim} className={i % 2 ? 'bg-(--ck-table-row-alt)' : 'bg-(--ck-table-row)'}>
            <td className="px-1 py-[7px] text-center text-(--foreground)">{row.dim}</td>
            <td className="px-1 py-[7px] text-center text-(--foreground) tabular-nums">
              {row.count}
            </td>
            <td className="px-1 py-[7px] text-center text-(--foreground) tabular-nums">
              {row.amount}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
