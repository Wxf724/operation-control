import ReactECharts from 'echarts-for-react'
import { useMemo, useState } from 'react'

import { useChartColors } from '@/components/cockpit-ui'

import {
  REPORT_COLUMNS,
  REPORT_DEFAULT_MONTH,
  REPORT_MONTH_TABS,
  REPORT_ROWS,
  REPORT_ROWS_FALLBACK,
} from '../boardData'
import {
  buildDurationOption,
  buildRejectOption,
  buildSubmitOption,
} from '../boardCharts'
import { BoardPanel } from './BoardPanel'

const CHART_PROPS = {
  style: { height: '100%', width: '100%' },
  opts: { renderer: 'canvas' as const },
  notMerge: true,
}

/** 上行四个面板：单据提报量 / 单据流转时长 / 企业报表提报处理时效 / 协同退单情况 */
export function BoardTopRow({ className = '' }: { className?: string }) {
  return (
    <div className={`grid grid-cols-4 gap-3 ${className}`}>
      <SubmitPanel />
      <DurationPanel />
      <ReportPanel />
      <RejectPanel />
    </div>
  )
}

function SubmitPanel() {
  const c = useChartColors()
  const option = useMemo(() => buildSubmitOption(c), [c])

  return (
    <BoardPanel title="单据提报量" bodyClassName="px-2 pt-1 pb-2">
      <ReactECharts option={option} {...CHART_PROPS} />
    </BoardPanel>
  )
}

function DurationPanel() {
  const c = useChartColors()
  const option = useMemo(() => buildDurationOption(c), [c])

  return (
    <BoardPanel title="单据流转时长" bodyClassName="px-2 pt-1 pb-2">
      <ReactECharts option={option} {...CHART_PROPS} />
    </BoardPanel>
  )
}

function RejectPanel() {
  const c = useChartColors()
  const option = useMemo(() => buildRejectOption(c), [c])

  return (
    <BoardPanel title="协同退单情况" bodyClassName="px-2 pt-1 pb-2">
      <ReactECharts option={option} {...CHART_PROPS} />
    </BoardPanel>
  )
}

/** 关账时间表的列宽：序号 / 企业名称 / 关账时间 */
const REPORT_GRID = '56px minmax(0, 1fr) 150px'

/** 企业报表提报处理时效：月份页签 + 关账时间明细表（表头固定、表体可滚动） */
function ReportPanel() {
  const [month, setMonth] = useState<string>(REPORT_DEFAULT_MONTH)
  const rows = REPORT_ROWS[month] ?? REPORT_ROWS_FALLBACK

  return (
    <BoardPanel title="企业报表提报处理时效" bodyClassName="gap-2 px-3 pt-2 pb-3">
      <div className="grid shrink-0 grid-cols-6 gap-1.5">
        {REPORT_MONTH_TABS.map((label) => (
          <button
            key={label}
            type="button"
            onClick={() => setMonth(label)}
            className={`cursor-pointer rounded-[3px] border py-[6px] text-[13px] leading-none transition-colors ${
              month === label
                ? 'border-(--accent) bg-(--accent) text-(--accent-foreground)'
                : 'border-(--border) bg-(--ck-panel-inner) text-(--text-secondary) hover:text-(--ck-title-sub)'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 表头固定在上、表体独立纵向滚动，序号按行序从 1 连续编号 */}
      <div className="flex min-h-0 flex-1 flex-col">
        <div
          className="grid shrink-0 items-center bg-(--ck-table-head) py-[8px]"
          style={{ gridTemplateColumns: REPORT_GRID }}
        >
          {REPORT_COLUMNS.map((label) => (
            <span
              key={label}
              className="px-2 text-center text-[13px] leading-none font-semibold text-(--ck-title-sub)"
            >
              {label}
            </span>
          ))}
        </div>

        <div className="ck-scroll min-h-0 flex-1 overflow-y-auto">
          {rows.map((row, i) => (
            <div
              key={row.name}
              className={`grid items-center py-[7px] ${
                i % 2 ? 'bg-(--ck-table-row-alt)' : 'bg-(--ck-table-row)'
              }`}
              style={{ gridTemplateColumns: REPORT_GRID }}
            >
              <span className="px-2 text-center text-[13px] leading-none text-(--foreground) tabular-nums">
                {i + 1}
              </span>
              <span className="truncate px-2 text-center text-[13px] leading-none text-(--foreground)">
                {row.name}
              </span>
              <span className="px-2 text-center text-[13px] leading-none text-(--foreground) tabular-nums">
                {row.closedAt}
              </span>
            </div>
          ))}
        </div>
      </div>
    </BoardPanel>
  )
}
