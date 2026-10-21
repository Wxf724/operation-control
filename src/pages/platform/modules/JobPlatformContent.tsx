import { useMemo } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

import { PanelBox, SectionTitle, useChartColors } from '@/components/cockpit-ui'

import {
  buildCrossCenterOption,
  buildEmergencyOption,
  buildNormOption,
  buildSaturationOption,
  buildTrendOption,
} from './jobCharts'
import {
  JOB_CROSS_CENTER,
  JOB_EMERGENCY,
  JOB_LOAD_SATURATION,
  JOB_MONTH_CLOSE,
  JOB_NORM_CHARTS,
  JOB_OVERALL_STATS,
  JOB_REPORT_GAUGES,
  JOB_RETURN_CARDS,
  JOB_TODO_STATS,
} from './jobData'
import {
  Block,
  Chart,
  FullFlowButton,
  IconStat,
  PedestalStat,
  ReportGauge,
  ReturnCard,
  RingGauge,
} from './JobWidgets'

/** 第一行三张规范情况柱图的宽度权重：第二张标题最长，按原件给它略宽 */
const NORM_FLEX = ['flex-[1]', 'flex-[1.08]', 'flex-[1]']

/**
 * 作业管理平台的中间业务区（结构对齐 `_refs/live/34-作业管理平台-目标稿.png`）。
 *
 * 层级与目标稿一致：
 *   共享财务（一整块大面板，标题斜体 + 蓝色三角标记）
 *     ├─ 第一行：作业处理整体情况（立体数字列 + 双折线）‖ 作业处理规范情况（三张柱图）
 *     ├─ 第二行：作业流转处理情况 → 待办单据情况 / 月末结账情况 / 报表出具情况 / 协同退回情况
 *     └─ 第三行：作业分配负载情况 → 任务分配异常情况 / 作业负载饱和情况 / 应急处理情况
 *
 * 每行内部按原件比例用 flex 做不等宽分栏（数字卡窄、图表宽），不用等分 grid。
 * 外层挂 `job-board`：浅蓝白主题里该作用域把卡片底色从纯白压成浅蓝，
 * 色值集中在 `src/styles/themes/cloud-light.css`，首页座舱共用同一主题所以不能改主题根。
 */
export function JobPlatformContent() {
  return (
    <div className="job-board flex min-h-0 flex-1 gap-2">
      <PanelBox
        title={<span className="italic">共享财务</span>}
        className="flex min-h-0 min-w-0 flex-1 flex-col"
        bodyClassName="flex min-h-0 flex-1 flex-col gap-2 px-3 pt-1.5 pb-2.5"
      >
        <OverallRow />
        <FlowRow />
        <LoadRow />
      </PanelBox>
    </div>
  )
}

/** 二级分组：蓝色菱形小标题 + 下方横向分栏的内容区 */
function Group({
  title,
  to,
  extra,
  className = '',
  children,
}: {
  title: string
  /** 填了就把标题变成可点的钻取入口，跳到对应的明细页 */
  to?: string
  extra?: ReactNode
  className?: string
  children: ReactNode
}) {
  return (
    <div className={`flex min-h-0 min-w-0 flex-col ${className}`}>
      <SectionTitle className="h-[19px] shrink-0" extra={extra}>
        {to ? <DrillLink title={title} to={to} /> : title}
      </SectionTitle>
      <div className="flex min-h-0 flex-1 gap-2 pt-1.5">{children}</div>
    </div>
  )
}

/**
 * 二级标题上的钻取入口。
 *
 * 点击区域就是标题文字本身（含末尾的「›」箭头），鼠标移上去变 `cursor-pointer`
 * 并加下划线，提示这里可以点；颜色继承 SectionTitle 的主蓝，不额外改样式层级。
 */
function DrillLink({ title, to }: { title: string; to: string }) {
  const navigate = useNavigate()

  return (
    <button
      type="button"
      title={`查看${title}明细`}
      onClick={() => navigate(to)}
      className="inline-flex cursor-pointer items-center gap-0.5 text-inherit underline-offset-[3px] transition-opacity hover:underline hover:opacity-80"
    >
      {title}
      <i className="ri-arrow-right-s-line text-[16px] leading-none" aria-hidden />
    </button>
  )
}

/* ═══════════ 第一行：作业处理整体情况 ‖ 作业处理规范情况 ═══════════ */

function OverallRow() {
  const c = useChartColors()
  const trend = useMemo(() => buildTrendOption(c), [c])
  const norms = useMemo(() => JOB_NORM_CHARTS.map((item) => buildNormOption(c, item)), [c])

  return (
    <section className="flex h-[252px] shrink-0 gap-2.5">
      <Group
        title="作业处理整体情况"
        to="/drill/job-overall"
        extra={<FullFlowButton />}
        className="w-[640px] shrink-0"
      >
        <Block className="w-[196px] shrink-0" bodyClassName="flex-col justify-evenly px-3 py-1">
          {JOB_OVERALL_STATS.map((item) => (
            <IconStat key={item.label} item={item} />
          ))}
        </Block>

        <Block title="单据完成量" className="min-w-0 flex-1" bodyClassName="flex-col px-1 pb-1">
          <Chart option={trend} />
        </Block>
      </Group>

      <Group title="作业处理规范情况" className="min-w-0 flex-1">
        {JOB_NORM_CHARTS.map((item, i) => (
          <Block
            key={item.title}
            title={item.title}
            className={`min-w-0 ${NORM_FLEX[i]}`}
            bodyClassName="flex-col px-1 pb-1"
          >
            <Chart option={norms[i]} />
          </Block>
        ))}
      </Group>
    </section>
  )
}

/* ═══════════ 第二行：作业流转处理情况 ═══════════ */

function FlowRow() {
  return (
    <section className="flex h-[268px] shrink-0">
      <Group title="作业流转处理情况" to="/drill/job-flow" className="min-w-0 flex-1">
        <Block
          title="待办单据情况"
          className="w-[196px] shrink-0"
          bodyClassName="flex-col justify-evenly px-3 py-1"
        >
          {JOB_TODO_STATS.map((item) => (
            <IconStat key={item.label} item={item} />
          ))}
        </Block>

        <Block
          title="月末结账情况"
          className="w-[452px] shrink-0"
          bodyClassName="items-stretch gap-1 px-2 pt-2 pb-1"
        >
          {JOB_MONTH_CLOSE.map((item) => (
            <PedestalStat key={item.label} item={item} />
          ))}
        </Block>

        <Block
          title="报表出具情况"
          className="min-w-0 flex-1"
          bodyClassName="items-start gap-2.5 px-2.5 pt-1.5 pb-2"
        >
          {JOB_REPORT_GAUGES.map((item) => (
            <ReportGauge key={item.label} item={item} />
          ))}
        </Block>

        <Block
          title="协同退回情况"
          className="w-[312px] shrink-0"
          bodyClassName="flex-col gap-2 px-2.5 py-2.5"
        >
          {JOB_RETURN_CARDS.map((item) => (
            <ReturnCard key={item.label} item={item} />
          ))}
        </Block>
      </Group>
    </section>
  )
}

/* ═══════════ 第三行：作业分配负载情况 ═══════════ */

function LoadRow() {
  const c = useChartColors()
  const crossCenter = useMemo(() => buildCrossCenterOption(c), [c])
  const saturation = useMemo(() => buildSaturationOption(c), [c])
  const emergency = useMemo(() => buildEmergencyOption(c), [c])

  return (
    <section className="flex min-h-0 flex-1">
      <Group title="作业分配负载情况" to="/drill/job-load" className="min-w-0 flex-1">
        <LoadCell
          title="任务分配异常情况"
          flexClass="flex-[1]"
          ringLabel={JOB_CROSS_CENTER.ringLabel}
          ringValue={JOB_CROSS_CENTER.ringValue}
          ringFrom="var(--ck-teal)"
          ringTo="var(--ck-cyan)"
          option={crossCenter}
        />
        <LoadCell
          title="作业负载饱和情况"
          flexClass="flex-[1]"
          ringLabel={JOB_LOAD_SATURATION.ringLabel}
          ringValue={JOB_LOAD_SATURATION.ringValue}
          ringFrom="var(--ck-blue)"
          ringTo="var(--ck-cyan)"
          option={saturation}
        />
        {/* 差错率属于风险指标，圆环走预警红 */}
        <LoadCell
          title="应急处理情况"
          flexClass="flex-[1.06]"
          ringLabel={JOB_EMERGENCY.ringLabel}
          ringValue={JOB_EMERGENCY.ringValue}
          ringFrom="var(--ck-yellow)"
          ringTo="var(--ck-red)"
          option={emergency}
        />
      </Group>
    </section>
  )
}

function LoadCell({
  title,
  flexClass,
  ringLabel,
  ringValue,
  ringFrom,
  ringTo,
  option,
}: {
  title: string
  flexClass: string
  ringLabel: string
  ringValue: number
  ringFrom: string
  ringTo: string
  option: object
}) {
  return (
    <Block
      title={title}
      className={`min-w-0 ${flexClass}`}
      bodyClassName="items-center gap-1 px-2 pb-1"
    >
      <RingGauge value={ringValue} label={ringLabel} from={ringFrom} to={ringTo} />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col self-stretch">
        <Chart option={option} />
      </div>
    </Block>
  )
}
