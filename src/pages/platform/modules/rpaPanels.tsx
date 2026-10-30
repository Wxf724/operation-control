import ReactECharts from 'echarts-for-react'
import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'

import { PanelBox, useChartColors } from '@/components/cockpit-ui'
import { DrillTitleLink } from '@/pages/drill/components'
import { RPA_CONTRIB_DRILL_PATH, RPA_RUN_DRILL_PATH } from '@/pages/drill/rpaConstants'

import {
  buildManualRingOption,
  buildRunStatusOption,
  buildStageBotOption,
  buildTaskOption,
} from './rpaChartOptions'
import {
  RPA_CONTRIB_GAUGE,
  RPA_CONTRIB_STAGES,
  RPA_CONTRIB_TABS,
  RPA_COUNTS,
  RPA_MANUAL,
  RPA_RUN_RINGS,
  RPA_RUN_TABS,
  RPA_TYPE_ROWS,
} from './rpaData'
import {
  ContribGauge,
  DotLine,
  MiniBar,
  PanelSectionTitle,
  PedestalIcon,
  Ring,
  StatTile,
  TabGroup,
  VerticalRule,
} from './rpaWidgets'

const CHART_PROPS = {
  style: { height: '100%', width: '100%' },
  opts: { renderer: 'canvas' as const },
  notMerge: true,
}

/* ───────────── 左栏：规划与覆盖情况 ───────────── */

export function PlanningPanel({ className = '' }: { className?: string }) {
  const c = useChartColors()
  const option = useMemo(() => buildStageBotOption(c), [c])

  return (
    <PanelBox
      title="规划与覆盖情况"
      className={`flex flex-col ${className}`}
      bodyClassName="flex min-h-0 flex-1 flex-col gap-3 px-4 pt-3 pb-4"
    >
      <PanelSectionTitle>RPA数量</PanelSectionTitle>

      <div
        className="flex shrink-0 items-center gap-3 rounded-[12px] px-3.5 py-3"
        style={{
          background: 'linear-gradient(135deg, var(--ck-card-from), var(--ck-card-to))',
          border: '1px solid var(--ck-card-border)',
          boxShadow: 'var(--ck-card-shadow)',
        }}
      >
        <PedestalIcon icon="ri-robot-2-line" />
        <VerticalRule />
        {RPA_COUNTS.map((stat, i) => (
          <div key={stat.label} className="flex min-w-0 flex-1 items-center gap-3">
            {i > 0 ? <VerticalRule /> : null}
            <StatTile label={stat.label} value={stat.value} unit={stat.unit} />
          </div>
        ))}
      </div>

      <div className="min-h-0 flex-1">
        <ReactECharts option={option} {...CHART_PROPS} />
      </div>

      <PanelSectionTitle>RPA上线类型分布</PanelSectionTitle>
      <TypeTable />
    </PanelBox>
  )
}

const TYPE_COLUMNS = ['序号', 'RPA类型', '业务大类', '业务场景', '数量', '任务量', '自动化率']
const TYPE_WIDTHS = ['42px', '62px', '66px', 'auto', '58px', '72px', '80px']

function TypeTable() {
  return (
    <div
      className="w-full shrink-0 overflow-hidden rounded-[12px]"
      style={{ border: '1px solid var(--ck-panel-inner-border)' }}
    >
      <table className="w-full table-fixed border-collapse text-[12px]">
        <colgroup>
          {TYPE_WIDTHS.map((w, i) => (
            <col key={TYPE_COLUMNS[i]} style={{ width: w }} />
          ))}
        </colgroup>

        <thead>
          <tr style={{ background: 'var(--ck-table-head)' }}>
            {TYPE_COLUMNS.map((label) => (
              <th
                key={label}
                className="px-1 py-[9px] text-center text-[12px] leading-none font-semibold whitespace-nowrap text-(--ck-title-sub)"
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {RPA_TYPE_ROWS.map((row, i) => (
            <tr
              key={row.index}
              style={{
                background: i % 2 ? 'var(--ck-table-row-alt)' : 'var(--ck-table-row)',
              }}
            >
              <Cell className="text-(--text-tertiary)">{row.index}</Cell>
              <Cell>{row.type}</Cell>
              <Cell>{row.category}</Cell>
              <Cell>{row.scene}</Cell>
              <Cell className="text-(--ck-cyan)">{row.count}</Cell>
              <Cell className="text-(--ck-cyan)">{row.taskVolume}</Cell>
              <Cell>
                <span
                  className="inline-flex items-center rounded-full px-1.5 py-[3px] text-[11px] leading-none font-semibold"
                  style={{
                    color: 'var(--ck-green)',
                    background: 'color-mix(in srgb, var(--ck-green) 14%, transparent)',
                  }}
                >
                  {row.autoRate}
                </span>
              </Cell>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Cell({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <td
      className={`truncate px-1 py-[10px] text-center align-middle text-(--foreground) tabular-nums ${className}`}
    >
      {children}
    </td>
  )
}

/* ───────────── 中栏上：运行情况 ───────────── */

export function OperationPanel({ className = '' }: { className?: string }) {
  return (
    <PanelBox
      title={<DrillTitleLink title="运行情况" to={RPA_RUN_DRILL_PATH} />}
      className={`flex flex-col ${className}`}
      bodyClassName="flex min-h-0 flex-1 gap-1 px-3.5 pt-2.5 pb-3"
    >
      <RunStatusBlock />
      <span className="mx-1.5 w-px shrink-0 self-stretch bg-(--border-light)" />
      <TaskBlock />
    </PanelBox>
  )
}

function RunStatusBlock() {
  const c = useChartColors()
  const [tab, setTab] = useState(0)
  const option = useMemo(() => buildRunStatusOption(c), [c])

  const rings = RPA_RUN_RINGS[tab] ?? RPA_RUN_RINGS[0]
  const max = Math.max(1, ...rings.map((r) => r.value))

  return (
    <section className="flex min-w-0 flex-1 flex-col gap-2.5">
      <PanelSectionTitle>RPA运行状态</PanelSectionTitle>

      <div className="h-[204px] shrink-0">
        <ReactECharts option={option} {...CHART_PROPS} />
      </div>

      <TabGroup tabs={RPA_RUN_TABS} active={tab} onChange={setTab} className="justify-center" />

      <div className="grid min-h-0 flex-1 grid-cols-3 gap-2.5">
        {rings.map((ring) => (
          <div
            key={ring.stage}
            className="ck-card flex items-center justify-center gap-3 rounded-[12px] px-2.5 py-2"
          >
            <Ring
              size={48}
              stroke={6}
              percent={Math.max(20, (ring.value / max) * 100)}
              color={`var(${ring.tone})`}
            />
            <div className="flex min-w-0 flex-col gap-2">
              <span className="truncate text-[12px] leading-none text-(--ck-title-sub)">
                {ring.stage}
              </span>
              <span className="flex items-baseline gap-0.5">
                <span className="text-[20px] leading-none font-bold text-(--ck-title) tabular-nums">
                  {ring.value}
                </span>
                <span className="text-[11px] leading-none text-(--text-tertiary)">个</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/** 图例小圆点的颜色与双层环的两段扇区一一对应 */
const MANUAL_LEGEND = [
  { label: '转人工处理单据量', value: RPA_MANUAL.handled, dot: 'var(--ck-cyan)' },
  { label: '未人工干预单据量', value: RPA_MANUAL.untouched, dot: 'var(--ck-track)' },
]

function TaskBlock() {
  const c = useChartColors()
  const option = useMemo(() => buildTaskOption(c), [c])

  const ringOption = useMemo(() => buildManualRingOption(c), [c])

  return (
    <section className="flex min-w-0 flex-1 flex-col gap-3">
      <PanelSectionTitle>RPA作业情况</PanelSectionTitle>

      <div className="h-[210px] shrink-0">
        <ReactECharts option={option} {...CHART_PROPS} />
      </div>

      {/* 转人工占比：双层环在左，原有的两个单据量读数在右 */}
      <div className="flex min-h-0 flex-1 items-center justify-center gap-9 pb-1.5">
        <div className="relative shrink-0" style={{ width: 176, height: 176 }}>
          <span
            className="pointer-events-none absolute inset-[26px] rounded-full"
            style={{
              background:
                'radial-gradient(circle, color-mix(in srgb, var(--ck-cyan) 14%, transparent) 0%, transparent 72%)',
            }}
          />
          {/* 最外圈虚线刻度，和相邻柱状图的视觉重量对齐 */}
          <svg
            className="absolute inset-0"
            width="176"
            height="176"
            viewBox="0 0 176 176"
            aria-hidden
          >
            <circle
              cx="88"
              cy="88"
              r="84"
              fill="none"
              stroke="var(--ck-panel-inner-border)"
              strokeWidth="1.5"
              strokeDasharray="2 7"
            />
          </svg>
          <ReactECharts option={ringOption} {...CHART_PROPS} />
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 leading-none">
            <span className="ck-glow-num text-[32px] font-bold text-(--ck-title)">
              {RPA_MANUAL.rate}%
            </span>
            <span className="text-[11.5px] text-(--text-secondary)">RPA转人工率</span>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2">
          {MANUAL_LEGEND.map((item) => (
            <div key={item.label} className="flex flex-col gap-1.5">
              <span className="flex items-center gap-1.5 whitespace-nowrap">
                <i
                  className="h-[7px] w-[7px] shrink-0 rounded-full"
                  style={{ background: item.dot }}
                />
                <span className="text-[12px] leading-none text-(--text-secondary)">
                  {item.label}
                </span>
              </span>
              <span className="ml-[15px] flex items-baseline gap-0.5">
                <span className="text-[22px] leading-none font-bold text-(--ck-title) tabular-nums">
                  {item.value}
                </span>
                <span className="text-[11px] leading-none text-(--text-tertiary)">笔</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ───────────── 中栏下：贡献情况 ───────────── */

export function ContributionPanel({ className = '' }: { className?: string }) {
  const [tab, setTab] = useState(0)
  const stages = RPA_CONTRIB_STAGES[tab] ?? RPA_CONTRIB_STAGES[0]

  return (
    <PanelBox
      title={<DrillTitleLink title="贡献情况" to={RPA_CONTRIB_DRILL_PATH} />}
      className={`flex flex-col ${className}`}
      bodyClassName="flex min-h-0 flex-1 gap-4 px-4 pt-1.5 pb-4"
    >
      <div className="flex w-[190px] shrink-0 flex-col items-center justify-center gap-1.5">
        <ContribGauge value={RPA_CONTRIB_GAUGE} />
        <span className="text-[12px] leading-none text-(--text-secondary)">效率提升贡献率</span>
      </div>

      <span className="w-px shrink-0 self-stretch bg-(--border-light)" />

      <div className="flex min-w-0 flex-1 flex-col gap-3 pt-1">
        <TabGroup tabs={RPA_CONTRIB_TABS} active={tab} onChange={setTab} />

        <div className="grid min-h-0 flex-1 grid-cols-6 gap-2.5">
          {stages.map((item) => (
            <div
              key={item.stage}
              className="flex flex-col justify-center gap-2.5 rounded-[12px] px-3 py-2.5"
              style={{
                background: 'var(--ck-panel-inner)',
                border: '1px solid var(--ck-panel-inner-border)',
              }}
            >
              <span className="w-full truncate rounded-full bg-(--ck-panel-bg-strong) py-[4px] text-center text-[12px] leading-none font-semibold text-(--ck-title-sub)">
                {item.stage}
              </span>
              <DotLine color="var(--ck-green)" label="节约" value={item.hours} unit="小时" />
              <DotLine color="var(--ck-cyan)" label="提升效率" value={item.efficiency} />
              <MiniBar percent={Number.parseFloat(item.efficiency)} color="var(--ck-teal)" />
            </div>
          ))}
        </div>
      </div>
    </PanelBox>
  )
}
