import ReactECharts from 'echarts-for-react'
import { useMemo } from 'react'

import { useChartColors } from '@/components/cockpit-ui'

import { buildAdjustOption, buildArchiveOption, buildTravelOption } from '../boardCharts'
import { OVERDUE_COLUMNS, OVERDUE_ROWS, OVERDUE_TOTAL } from '../boardData'
import { BoardPanel } from './BoardPanel'

const CHART_PROPS = {
  style: { height: '100%', width: '100%' },
  opts: { renderer: 'canvas' as const },
  notMerge: true,
}

/** 下行四个面板：商旅预订及报销情况 / 档案邮寄率 / 超期未处理情况 / 企业调账情况 */
export function BoardBottomRow({ className = '' }: { className?: string }) {
  return (
    <div className={`grid grid-cols-4 gap-3 ${className}`}>
      <TravelPanel />
      <ArchivePanel />
      <OverduePanel />
      <AdjustPanel />
    </div>
  )
}

function TravelPanel() {
  const c = useChartColors()
  const option = useMemo(() => buildTravelOption(c), [c])

  return (
    <BoardPanel title="商旅预订及报销情况" bodyClassName="px-2 pt-1 pb-2">
      <ReactECharts option={option} {...CHART_PROPS} />
    </BoardPanel>
  )
}

function ArchivePanel() {
  const c = useChartColors()
  const option = useMemo(() => buildArchiveOption(c), [c])

  return (
    <BoardPanel title="档案邮寄率" bodyClassName="px-2 pt-1 pb-2">
      <ReactECharts option={option} {...CHART_PROPS} />
    </BoardPanel>
  )
}

function AdjustPanel() {
  const c = useChartColors()
  const option = useMemo(() => buildAdjustOption(c), [c])

  return (
    <BoardPanel title="企业调账情况" bodyClassName="px-2 pt-1 pb-2">
      <ReactECharts option={option} {...CHART_PROPS} />
    </BoardPanel>
  )
}

/** 超期未处理情况表的列宽：序号 / 单位 / 商旅 / 协同退单 / 档案 */
const OVERDUE_GRID = '54px minmax(0, 1fr) 76px 88px 76px'

/**
 * 超期未处理情况：明细表 + 合计行。
 *
 * 表头和合计行分别钉在上下两端（`shrink-0`），只有中间的明细区滚动，
 * 序号按行序从 1 连续编号。
 */
function OverduePanel() {
  return (
    <BoardPanel title="超期未处理情况" bodyClassName="px-3 pt-2 pb-3">
      <div className="flex min-h-0 flex-1 flex-col">
        <div
          className="grid shrink-0 items-center bg-(--ck-table-head) py-[9px]"
          style={{ gridTemplateColumns: OVERDUE_GRID }}
        >
          {OVERDUE_COLUMNS.map((label) => (
            <span
              key={label}
              className="px-1.5 text-center text-[13px] leading-none font-semibold text-(--ck-title-sub)"
            >
              {label}
            </span>
          ))}
        </div>

        <div className="ck-scroll min-h-0 flex-1 overflow-y-auto">
          {OVERDUE_ROWS.map((row, i) => (
            <div
              key={row.unit}
              className={`grid items-center py-[8px] ${
                i % 2 ? 'bg-(--ck-table-row-alt)' : 'bg-(--ck-table-row)'
              }`}
              style={{ gridTemplateColumns: OVERDUE_GRID }}
            >
              <span className="px-1.5 text-center text-[13px] leading-none text-(--foreground) tabular-nums">
                {i + 1}
              </span>
              <span className="truncate px-1.5 text-center text-[13px] leading-none text-(--foreground)">
                {row.unit}
              </span>
              <span className="px-1.5 text-center text-[13px] leading-none text-(--foreground) tabular-nums">
                {row.travel}
              </span>
              <span className="px-1.5 text-center text-[13px] leading-none text-(--foreground) tabular-nums">
                {row.reject}
              </span>
              <span className="px-1.5 text-center text-[13px] leading-none text-(--foreground) tabular-nums">
                {row.archive}
              </span>
            </div>
          ))}
        </div>

        {/* 合计行固定在底部，不随表体滚动 */}
        <div
          className="grid shrink-0 items-center bg-(--accent-soft) py-[9px]"
          style={{ gridTemplateColumns: OVERDUE_GRID }}
        >
          <span className="col-span-2 px-1.5 text-center text-[14px] leading-none font-bold text-(--ck-title-sub)">
            {OVERDUE_TOTAL.label}
          </span>
          <span className="px-1.5 text-center text-[14px] leading-none font-bold text-(--ck-title-sub) tabular-nums">
            {OVERDUE_TOTAL.travel}
          </span>
          <span className="px-1.5 text-center text-[14px] leading-none font-bold text-(--ck-title-sub) tabular-nums">
            {OVERDUE_TOTAL.reject}
          </span>
          <span className="px-1.5 text-center text-[14px] leading-none font-bold text-(--ck-title-sub) tabular-nums">
            {OVERDUE_TOTAL.archive}
          </span>
        </div>
      </div>
    </BoardPanel>
  )
}
