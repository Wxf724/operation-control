import { PanelBox, SectionTitle } from '@/components/cockpit-ui'

import {
  TRAVEL_COST_GAUGE,
  TRAVEL_DOUBT_LEGEND,
  TRAVEL_DOUBT_RATE,
  TRAVEL_DOUBT_TOTAL,
  TRAVEL_OVERDUE_REIMB_ROWS,
  TRAVEL_OVER_STANDARDS,
  TRAVEL_TIMELY_GAUGE,
} from './travelData'
import { TravelBigGauge, TravelDashGauge } from './travelGauges'
import { TravelCostIcon, TravelDoubtRing, TravelPlate } from './travelWidgets'

/** 下行左：商旅报销情况 */
export function TravelReimbursePanel({ className = '' }: { className?: string }) {
  return (
    <PanelBox
      title="商旅报销情况"
      className={`flex flex-col ${className}`}
      bodyClassName="flex min-h-0 flex-1 gap-3 px-3.5 pt-1.5 pb-2.5"
    >
      <section className="flex w-[338px] shrink-0 flex-col gap-1.5">
        {TRAVEL_OVER_STANDARDS.map((item) => (
          <div key={item.title} className="flex min-h-0 flex-1 flex-col gap-1">
            <SectionTitle className="shrink-0">{item.title}</SectionTitle>

            <div className="flex min-h-0 flex-1 items-center gap-1">
              <TravelCostIcon />

              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <span className="truncate text-[12px] leading-none text-(--text-secondary)">
                  {item.label}
                </span>
                <span className="flex items-baseline gap-0.5">
                  <span className="ck-glow-num text-[24px] leading-none font-bold text-(--ck-title)">
                    {item.value}
                  </span>
                  <span className="text-[11px] leading-none text-(--text-tertiary)">
                    {item.unit}
                  </span>
                </span>
              </div>

              <TravelDashGauge value={item.rate} caption="超标比率" />
            </div>
          </div>
        ))}
      </section>

      <section className="flex w-[186px] shrink-0 flex-col gap-1">
        <SectionTitle className="shrink-0">商旅成本入账情况</SectionTitle>
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <TravelBigGauge
            value={TRAVEL_COST_GAUGE.value}
            caption={TRAVEL_COST_GAUGE.caption}
            gradientId="tv-gauge-cost"
          />
        </div>
      </section>

      <section className="flex min-w-0 flex-1 flex-col gap-1">
        <SectionTitle className="shrink-0">用户的超期报销情况</SectionTitle>

        <div className="flex min-h-0 flex-1 items-center gap-3">
          <div className="flex shrink-0 items-center justify-center">
            <TravelBigGauge
              value={TRAVEL_TIMELY_GAUGE.value}
              caption={TRAVEL_TIMELY_GAUGE.caption}
              gradientId="tv-gauge-timely"
            />
          </div>
          <OverdueReimbTable />
        </div>
      </section>
    </PanelBox>
  )
}

const OVERDUE_COLUMNS = ['维度', '超期订单量', '超期金额']

function OverdueReimbTable() {
  return (
    <table className="min-w-0 flex-1 table-fixed border-collapse text-[13px]">
      <thead>
        <tr className="bg-(--ck-table-head)">
          {OVERDUE_COLUMNS.map((label) => (
            <th
              key={label}
              className="px-2 py-[8px] text-center font-medium whitespace-nowrap text-(--ck-title-sub)"
            >
              {label}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {TRAVEL_OVERDUE_REIMB_ROWS.map((row, i) => (
          <tr key={row.dim} className={i % 2 ? 'bg-(--ck-table-row-alt)' : 'bg-(--ck-table-row)'}>
            <td className="px-2 py-[9px] text-center text-(--foreground)">{row.dim}</td>
            <td className="px-2 py-[9px] text-center text-(--foreground) tabular-nums">
              {row.orders}
            </td>
            <td className="px-2 py-[9px] text-center text-(--foreground) tabular-nums">
              {row.amount}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

/** 下行右：商旅疑点订单情况 */
export function TravelDoubtPanel({ className = '' }: { className?: string }) {
  return (
    <PanelBox
      title="商旅疑点订单情况"
      className={`flex flex-col ${className}`}
      bodyClassName="flex min-h-0 flex-1 items-center gap-2 px-4 pt-1 pb-3"
    >
      <div className="flex w-[198px] shrink-0 flex-col gap-1.5">
        <span className="text-[13px] leading-none text-(--ck-title-sub)">商旅疑点订单总量</span>

        <TravelPlate value={TRAVEL_DOUBT_TOTAL} unit="个" variant="slab" />

        <div className="flex flex-col gap-2.5">
          {TRAVEL_DOUBT_LEGEND.map((item) => (
            <div key={item.label} className="flex flex-col gap-1.5">
              <span className="flex items-center gap-1.5 whitespace-nowrap">
                <i
                  className="h-[7px] w-[7px] shrink-0 rounded-full"
                  style={{ background: `var(${item.tone})` }}
                />
                <span className="text-[12px] leading-none text-(--text-secondary)">
                  {item.label}
                </span>
              </span>
              <span className="ml-[15px] flex items-baseline gap-0.5">
                <span className="text-[18px] leading-none font-bold text-(--ck-title) tabular-nums">
                  {item.amount}
                </span>
                <span className="text-[11px] leading-none text-(--text-tertiary)">{item.unit}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex min-w-0 flex-1 items-center justify-center">
        <TravelDoubtRing value={TRAVEL_DOUBT_RATE} size={152} />
      </div>
    </PanelBox>
  )
}
