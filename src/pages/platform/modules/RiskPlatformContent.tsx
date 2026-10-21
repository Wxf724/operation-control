import { useMemo } from 'react'

import { PanelBox, useChartColors } from '@/components/cockpit-ui'

import { Block, Chart, ReturnCard } from './JobWidgets'
import { buildPenetrationOption, buildRiskTrendOption } from './riskCharts'
import {
  RISK_COCKPIT_NOTE,
  RISK_FAULT_CARDS,
  RISK_FLOW_STEPS,
  RISK_MAJOR_ALERTS,
  RISK_OVERVIEW_STATS,
  RISK_PROCESS_RINGS,
  RISK_SYSTEM_RINGS,
  RISK_TYPE_DIST,
} from './riskData'
import {
  AlertHead,
  AlertRow,
  CapsuleTitle,
  CockpitChrome,
  FlowStep,
  OverviewTile,
  RiskRing,
  TypeBar,
} from './riskWidgets'

/**
 * 风险管理平台的中间业务区（结构对齐 `_refs/live/59-风险管理平台-目标稿.png`）。
 *
 * 目标稿是深色版，这里只取版面与数值，配色全部走浅蓝白主题 `theme-cloud-light`，
 * 和 `/platform/job` 保持同一套观感。
 *
 * 版面分两块：
 *   左栏（380px，窄）
 *     ├─ 通用系统风险监控：两个大环形图 + 两张故障横条卡
 *     └─ 业务流程风险监控：两个大环形图（偏离率走预警橙）
 *   右栏（flex-1，宽）
 *     └─ 风险防控平台风险驾驶：胶囊标题 + 一块「内嵌驾驶舱」示意版面
 *
 * 右栏在目标稿里是一张第三方系统（风险管控与智慧监管驾驶舱）的内嵌截图，
 * 几十个图表属于另一个系统的界面，本页不做 1:1 复刻，
 * 只还原「系统标题栏 + 概览数字 + 几张概览图 + 闭环流程」这一层版面骨架，
 * 并在底部用一行小字说明它是内嵌的第三方驾驶舱。
 *
 * 外层挂 `job-board`：浅蓝白主题里该作用域把卡片底色从纯白压成浅蓝
 * （色值在 `src/styles/themes/cloud-light.css`），同时也提供 `--job-inset-*`
 * 这一批内嵌小卡变量，作业页与本页复用同一套层次。
 */
export function RiskPlatformContent() {
  return (
    <div className="job-board flex min-h-0 min-w-0 flex-1 gap-3">
      <div className="flex w-[380px] shrink-0 flex-col gap-3">
        <SystemRiskPanel />
        <ProcessRiskPanel />
      </div>

      <RiskCockpitPanel />
    </div>
  )
}

/* ═══════════ 左栏上 · 通用系统风险监控 ═══════════ */

function SystemRiskPanel() {
  return (
    <PanelBox
      title="通用系统风险监控"
      className="flex min-h-0 flex-[1.5] flex-col"
      bodyClassName="flex min-h-0 flex-col gap-3 px-3 pt-2 pb-3"
    >
      <div className="flex min-h-0 flex-[1.1] items-center gap-2">
        {RISK_SYSTEM_RINGS.map((item) => (
          <RiskRing
            key={item.label}
            value={item.value}
            label={item.label}
            from={item.from}
            to={item.to}
            size={128}
            filled
          />
        ))}
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2.5">
        {RISK_FAULT_CARDS.map((item) => (
          <ReturnCard key={item.label} item={item} />
        ))}
      </div>
    </PanelBox>
  )
}

/* ═══════════ 左栏下 · 业务流程风险监控 ═══════════ */

function ProcessRiskPanel() {
  return (
    <PanelBox
      title="业务流程风险监控"
      className="flex min-h-0 flex-1 flex-col"
      bodyClassName="flex min-h-0 items-center gap-2 px-3 pt-2 pb-3"
    >
      {RISK_PROCESS_RINGS.map((item) => (
        <RiskRing
          key={item.label}
          value={item.value}
          label={item.label}
          from={item.from}
          to={item.to}
          size={136}
        />
      ))}
    </PanelBox>
  )
}

/* ═══════════ 右栏 · 风险防控平台风险驾驶 ═══════════ */

function RiskCockpitPanel() {
  return (
    <PanelBox
      className="flex min-h-0 min-w-0 flex-1 flex-col"
      bodyClassName="flex min-h-0 flex-1 flex-col gap-2.5 px-3 pt-3 pb-3"
    >
      <div className="flex shrink-0 items-center justify-between gap-3">
        <CapsuleTitle>风险防控平台风险驾驶</CapsuleTitle>
        <span className="truncate text-[13px] leading-none text-(--text-tertiary)">
          内嵌第三方系统 · 风险管控与智慧监管驾驶舱
        </span>
      </div>

      <section
        className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-[10px] border"
        style={{
          background: 'var(--ck-panel-inner)',
          borderColor: 'var(--ck-card-border)',
          boxShadow: 'var(--ck-card-shadow)',
        }}
      >
        <CockpitChrome />

        <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-2 p-2.5">
          <OverviewRow />
          <MiddleRow />
          <BottomRow />

          <p className="shrink-0 truncate text-[12px] leading-none text-(--text-tertiary)">
            备注：{RISK_COCKPIT_NOTE}
          </p>
        </div>
      </section>
    </PanelBox>
  )
}

function OverviewRow() {
  return (
    <div className="flex h-[86px] shrink-0 gap-2">
      {RISK_OVERVIEW_STATS.map((item) => (
        <OverviewTile key={item.label} item={item} />
      ))}
    </div>
  )
}

function MiddleRow() {
  const c = useChartColors()
  const trend = useMemo(() => buildRiskTrendOption(c), [c])

  return (
    <div className="flex min-h-0 min-w-0 flex-1 gap-2">
      <Block
        title="风险类型分布"
        className="w-[300px] shrink-0"
        bodyClassName="flex-col gap-1 px-3 py-2"
      >
        {RISK_TYPE_DIST.map((item) => (
          <TypeBar key={item.name} item={item} />
        ))}
      </Block>

      <Block
        title="风险趋势分析（近30天）"
        className="min-w-0 flex-1"
        bodyClassName="flex-col px-1 pb-1"
      >
        <Chart option={trend} />
      </Block>

      <Block
        title="重大风险预警"
        className="w-[360px] shrink-0"
        bodyClassName="flex-col gap-1 px-2 py-2"
      >
        <AlertHead />
        {RISK_MAJOR_ALERTS.map((row, i) => (
          <AlertRow key={row.unit} row={row} odd={i % 2 === 1} />
        ))}
      </Block>
    </div>
  )
}

function BottomRow() {
  const c = useChartColors()
  const penetration = useMemo(() => buildPenetrationOption(c), [c])

  return (
    <div className="flex h-[156px] shrink-0 gap-2">
      <Block
        title="穿透式监管覆盖情况"
        className="w-[420px] shrink-0"
        bodyClassName="flex-col px-2 pt-1 pb-2"
      >
        <Chart option={penetration} />
      </Block>

      <Block
        title="风险闭环流程总览"
        className="min-w-0 flex-1"
        bodyClassName="items-center gap-1 px-4 pb-2"
      >
        {RISK_FLOW_STEPS.map((step, i) => (
          <FlowStep key={step.label} step={step} last={i === RISK_FLOW_STEPS.length - 1} />
        ))}
      </Block>
    </div>
  )
}
