import ReactECharts from 'echarts-for-react'
import { useId, useMemo } from 'react'

import { PanelBox, ProgressBar, useChartColors } from '@/components/cockpit-ui'
import type { ChartVarName } from '@/components/cockpit-ui'

import {
  RULE_CALL_COLUMNS,
  RULE_CALL_ROWS,
  RULE_CALL_STATS,
  RULE_COVERAGE_COLUMNS,
  RULE_COVERAGE_RATES,
  RULE_COVERAGE_ROWS,
  RULE_COVERAGE_STATS,
  RULE_HIT_EFFECT,
  RULE_ITERATION,
  RULE_SCENE_COVERAGE,
  RULE_ZERO_TRIGGER,
} from './ruleData'
import type { RuleIterationItem, RuleSceneRow, RuleStatCard, RuleTrendPoint } from './ruleData'

/** 规则管理平台的中间业务区（对应 `_refs/live/13-规则管理平台.png`） */
export function RulePlatformContent() {
  return (
    <div className="flex min-h-0 flex-1 gap-2.5">
      <div className="flex w-[772px] shrink-0 flex-col gap-2.5">
        <CoveragePanel className="h-[445px] shrink-0" />
        <HitEffectPanel className="min-h-0 flex-1" />
      </div>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-2.5">
        <CallPanel className="h-[445px] shrink-0" />
        <IterationPanel className="min-h-0 flex-1" />
      </div>
    </div>
  )
}

/* ───────────── 左上 · 规则覆盖度管理 ───────────── */

function CoveragePanel({ className = '' }: { className?: string }) {
  return (
    <PanelBox title="规则覆盖度管理" className={`flex flex-col ${className}`}>
      <div className="flex h-full flex-col gap-2.5 px-3 pt-2.5 pb-3">
        <div className="grid shrink-0 grid-cols-3 gap-2.5">
          {RULE_COVERAGE_STATS.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </div>

        <div className="flex min-h-0 flex-1 gap-3">
          <div className="flex w-[232px] shrink-0 flex-col justify-center gap-6">
            {RULE_COVERAGE_RATES.map((rate) => (
              <div key={rate.label} className="flex flex-col gap-2.5">
                <span className="text-[14px] leading-none text-(--ck-title-sub)">{rate.label}</span>
                <span
                  className="ck-glow-num text-[26px] leading-none font-bold"
                  style={{ color: `var(--ck-${rate.tone})` }}
                >
                  {rate.display}
                </span>
                <ProgressBar value={rate.value} tone={rate.tone} showValue={false} />
              </div>
            ))}
          </div>

          <DataTable
            className="min-w-0 flex-1"
            columns={RULE_COVERAGE_COLUMNS}
            rows={RULE_COVERAGE_ROWS}
            cols="0.6fr 0.9fr 1.6fr 1.1fr 1.1fr"
            accent={false}
          />
        </div>
      </div>
    </PanelBox>
  )
}

/* ───────────── 右上 · 规则调用情况 ───────────── */

function CallPanel({ className = '' }: { className?: string }) {
  return (
    <PanelBox title="规则调用情况" className={`flex flex-col ${className}`}>
      <div className="flex h-full gap-3 px-3 pt-2.5 pb-3">
        <div className="flex min-w-0 flex-1 flex-col gap-2.5">
          <div className="grid shrink-0 grid-cols-2 gap-2.5">
            {RULE_CALL_STATS.map((stat) => (
              <StatCard key={stat.label} stat={stat} compact />
            ))}
          </div>

          <DataTable
            className="min-h-0 flex-1"
            columns={RULE_CALL_COLUMNS}
            rows={RULE_CALL_ROWS}
            cols="0.6fr 0.9fr 1.5fr 1.2fr 1.2fr"
            accent
          />
        </div>

        <div className="flex w-[262px] shrink-0 flex-col items-center gap-2">
          <ZeroTriggerRing />

          <span className="text-center text-[14px] leading-none text-(--ck-title-sub)">
            {RULE_ZERO_TRIGGER.label}
          </span>

          <span className="w-full pr-1 text-right text-[12px] leading-none text-(--text-secondary)">
            数量（个）
          </span>

          <div className="flex w-full min-h-0 flex-1 flex-col justify-start gap-2">
            {RULE_ZERO_TRIGGER.scenes.map((scene) => (
              <div
                key={scene.label}
                className="ck-card flex items-center justify-between rounded-[3px] px-3 py-2.5"
              >
                <span className="truncate text-[13px] leading-none text-(--foreground)">
                  {scene.label}
                </span>
                <span className="text-[17px] leading-none font-bold text-(--ck-cyan) tabular-nums">
                  {scene.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PanelBox>
  )
}

/** 半年内零触发规则数：蓝→青渐变半环 */
function ZeroTriggerRing() {
  const size = 112
  const half = size / 2
  // 中文标签经 `\W` 正则会被抹空导致 id 撞车，统一交给 useId
  const gradId = `ruleZeroRing${useId().replace(/:/g, '')}`

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" style={{ stopColor: BLUE }} />
            <stop offset="100%" style={{ stopColor: 'var(--ck-cyan)' }} />
          </linearGradient>
        </defs>
        <circle cx={half} cy={half} r={52} fill="none" stroke="var(--ck-card-border)" />
        <RingArc c={half} r={44} w={13} stroke={`url(#${gradId})`} pct={RULE_ZERO_TRIGGER.ratio} />
      </svg>
      <span className="ck-glow-num absolute inset-0 flex items-center justify-center text-[28px] leading-none font-bold text-(--foreground)">
        {RULE_ZERO_TRIGGER.value}
      </span>
    </div>
  )
}

/* ───────────── 左下 · 规则命中有效性管理 ───────────── */

function HitEffectPanel({ className = '' }: { className?: string }) {
  const c = useChartColors()

  const effectOption = useMemo(
    () =>
      buildTrendOption(c, {
        data: RULE_HIT_EFFECT,
        names: ['智能审核规则命中次数', '人工审核规则命中次数', '审核规则有效命中率'],
        barColor: c['--ck-cyan'],
        barColorAlt: c['--ck-blue'],
        lineColor: c['--ck-green'],
        max: 200,
        interval: 50,
        labelPosition: 'bottom',
      }),
    [c]
  )

  const coverageOption = useMemo(
    () =>
      buildTrendOption(c, {
        data: RULE_SCENE_COVERAGE,
        names: ['审核规则命中场景数', '业务场景数', '审核规则命中场景覆盖率'],
        barColor: c['--ck-green'],
        barColorAlt: c['--ck-green'],
        barOpacityAlt: 0.5,
        lineColor: c['--ck-purple'],
        max: 70,
        interval: 10,
        labelPosition: 'top',
      }),
    [c]
  )

  return (
    <PanelBox title="规则命中有效性管理" className={`flex flex-col ${className}`}>
      <div className="flex h-full gap-2 px-2 pt-1.5 pb-2.5">
        <ChartBlock title="审核规则有效命中率" option={effectOption} />
        <ChartBlock title="审核规则命中场景覆盖率" option={coverageOption} />
      </div>
    </PanelBox>
  )
}

function ChartBlock({ title, option }: { title: string; option: TrendOption }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <span className="shrink-0 pb-1 text-center text-[14px] leading-none font-semibold text-(--ck-title-sub)">
        {title}
      </span>
      <div className="min-h-0 flex-1">
        <ReactECharts
          option={option}
          style={{ height: '100%', width: '100%' }}
          opts={{ renderer: 'canvas' }}
          notMerge
        />
      </div>
    </div>
  )
}

type TrendOption = ReturnType<typeof buildTrendOption>

/** 柱+折线双轴图的配置：names 依次为 [亮色柱, 深色柱, 折线]，max/interval 为左轴刻度 */
interface TrendOptionConfig {
  data: RuleTrendPoint[]
  names: [string, string, string]
  barColor: string
  barColorAlt: string
  barOpacityAlt?: number
  lineColor: string
  max: number
  interval: number
  labelPosition: 'top' | 'bottom'
}

function buildTrendOption(c: Record<ChartVarName, string>, cfg: TrendOptionConfig) {
  const axisLabel = { color: c['--ck-axis'], fontSize: 11 }
  const yAxisBase = {
    type: 'value' as const,
    min: 0,
    axisLabel,
    axisLine: { show: false },
    axisTick: { show: false },
    splitLine: { lineStyle: { color: c['--ck-grid'], type: 'dashed' as const } },
  }

  return {
    /**
     * 关掉入场动画。`useChartColors()` 挂载后才解析出色值，option 会以 notMerge 重建，
     * 面板 flex-1 定高时容器尺寸回调又触发一次，动画被反复打回起点 → 只剩坐标轴。
     */
    animation: false,
    backgroundColor: 'transparent',
    textStyle: { fontFamily: 'Noto Sans SC, sans-serif' },
    tooltip: {
      trigger: 'axis',
      backgroundColor: c['--ck-tooltip-bg'],
      borderWidth: 0,
      textStyle: { color: c['--ck-tooltip-text'], fontSize: 12 },
    },
    grid: { left: 36, right: 36, top: 24, bottom: 26 },
    xAxis: {
      type: 'category',
      data: cfg.data.map((d) => d.month),
      axisLine: { lineStyle: { color: c['--ck-panel-border'] } },
      axisTick: { show: false },
      axisLabel: { ...axisLabel, fontSize: 12 },
    },
    yAxis: [
      { ...yAxisBase, max: cfg.max, interval: cfg.interval },
      { ...yAxisBase, max: 100, interval: 20, splitLine: { show: false } },
    ],
    series: [
      {
        name: cfg.names[0],
        type: 'bar',
        stack: 'total',
        barWidth: 22,
        data: cfg.data.map((d) => d.primary),
        itemStyle: { color: cfg.barColor },
      },
      {
        name: cfg.names[1],
        type: 'bar',
        stack: 'total',
        barWidth: 22,
        data: cfg.data.map((d) => d.secondary),
        itemStyle: { color: cfg.barColorAlt, opacity: cfg.barOpacityAlt ?? 1 },
      },
      {
        name: cfg.names[2],
        type: 'line',
        yAxisIndex: 1,
        symbol: 'circle',
        symbolSize: 7,
        data: cfg.data.map((d) => d.rate),
        lineStyle: { color: cfg.lineColor, width: 2 },
        itemStyle: { color: cfg.lineColor },
        label: {
          show: true,
          position: cfg.labelPosition,
          distance: 8,
          color: cfg.lineColor,
          fontSize: 13,
          fontWeight: 'bold' as const,
          formatter: '{c}%',
        },
      },
    ],
  }
}

/* ───────────── 右下 · 规则迭代优化管理 ───────────── */

function IterationPanel({ className = '' }: { className?: string }) {
  return (
    <PanelBox title="规则迭代优化管理" className={`flex flex-col ${className}`}>
      <div className="grid h-full grid-cols-3 items-center gap-2 px-3 pt-1 pb-3">
        {RULE_ITERATION.map((item) => (
          <IterationItem key={item.title} item={item} />
        ))}
      </div>
    </PanelBox>
  )
}

function IterationItem({ item }: { item: RuleIterationItem }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-center text-[14px] leading-none font-semibold text-(--ck-title-sub)">
        {item.title}
      </span>

      <DualRing total={item.total} smart={item.smart} manual={item.manual} />

      <div className="flex flex-col gap-2">
        <LegendRow color={BLUE} label="智能审核规则" value={item.smart} />
        <LegendRow color={GREEN} label="人工审核规则" value={item.manual} />
      </div>
    </div>
  )
}

/** 双层环：外环为智能审核规则占比，内环为人工审核规则占比 */
function DualRing({ total, smart, manual }: { total: string; smart: number; manual: number }) {
  const sum = smart + manual || 1
  const size = 142
  const c = size / 2

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <RingArc c={c} r={60} w={10} stroke={BLUE} pct={(smart * 100) / sum} />
        <RingArc c={c} r={47} w={9} stroke={GREEN} pct={(manual * 100) / sum} />
      </svg>
      <span className="ck-glow-num absolute inset-0 flex items-center justify-center text-[38px] leading-none font-bold text-(--foreground)">
        {total}
      </span>
    </div>
  )
}

/** 从 12 点方向顺时针绘制的单段圆弧，含底色轨道。c=圆心坐标，w=线宽，pct=填充 0–100 */
function RingArc({ c, r, w, stroke, pct }: RingArcProps) {
  const circ = 2 * Math.PI * r

  return (
    <>
      <circle cx={c} cy={c} r={r} fill="none" stroke="var(--ck-track)" strokeWidth={w} />
      <circle
        cx={c}
        cy={c}
        r={r}
        fill="none"
        stroke={stroke}
        strokeWidth={w}
        strokeDasharray={`${(circ * pct) / 100} ${circ}`}
        transform={`rotate(-90 ${c} ${c})`}
        strokeLinecap="round"
      />
    </>
  )
}

function LegendRow({ color, label, value }: { color: string; label: string; value: number }) {
  return (
    <span className="flex items-center gap-2 whitespace-nowrap">
      <i className="h-[7px] w-[7px] shrink-0 rounded-full" style={{ background: color }} />
      <span className="text-[13px] leading-none text-(--foreground)">{label}</span>
      <span className="text-[19px] leading-none font-bold tabular-nums" style={{ color }}>
        {value}
      </span>
      <span className="text-[12px] leading-none text-(--text-tertiary)">次</span>
    </span>
  )
}

/** 左侧带发光底座图标的数字卡 */
function StatCard({ stat, compact = false }: { stat: RuleStatCard; compact?: boolean }) {
  return (
    <div
      className={`flex items-center gap-2.5 rounded-[10px] border border-(--ck-card-border) ${compact ? 'px-2.5 py-2' : 'px-3 py-2.5'}`}
      style={{
        background: 'linear-gradient(180deg, var(--ck-card-from) 0%, var(--ck-card-to) 100%)',
        boxShadow: 'var(--ck-card-shadow)',
      }}
    >
      <span
        className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[9px] text-[20px] text-(--ck-cyan)"
        style={{
          background: 'linear-gradient(180deg, var(--ck-icon-from), var(--ck-icon-to))',
          boxShadow: 'var(--ck-icon-glow)',
        }}
      >
        <i className={stat.icon} aria-hidden />
      </span>

      <div className="flex min-w-0 flex-col gap-2">
        <span className="truncate text-[13px] leading-none text-(--ck-title-sub)">
          {stat.label}
        </span>
        <span className="flex items-baseline gap-0.5">
          <span className="ck-glow-num text-[21px] leading-none font-bold text-(--ck-cyan)">
            {stat.value}
          </span>
          <span className="text-[11px] leading-none text-(--text-tertiary)">{stat.unit}</span>
        </span>
      </div>
    </div>
  )
}

/** 业务场景明细表 */
function DataTable({ columns, rows, cols, accent, className = '' }: DataTableProps) {
  const numClass = accent
    ? 'text-[14px] leading-snug font-bold text-(--ck-cyan) tabular-nums'
    : 'text-[13px] leading-snug text-(--foreground) tabular-nums'

  return (
    <div className={`flex flex-col overflow-hidden rounded-[3px] ${className}`}>
      <div
        className="grid shrink-0 items-center gap-1 px-2 py-2"
        style={{ gridTemplateColumns: cols, background: 'var(--ck-table-head)' }}
      >
        {columns.map((col) => (
          <span
            key={col}
            className="text-center text-[12px] leading-tight font-semibold text-(--ck-title-sub)"
          >
            {col}
          </span>
        ))}
      </div>

      <div className="ck-scroll min-h-0 flex-1 overflow-y-auto">
        {rows.map((row, i) => (
          <div
            key={row.seq}
            className="grid items-center gap-1 px-2 py-2.5"
            style={{
              gridTemplateColumns: cols,
              background: i % 2 === 0 ? 'var(--ck-table-row)' : 'var(--ck-table-row-alt)',
            }}
          >
            <span className={`text-center ${TEXT_CELL} text-(--text-secondary) tabular-nums`}>
              {row.seq}
            </span>
            <span className={`text-center ${TEXT_CELL} text-(--foreground)`}>{row.category}</span>
            <span className={`text-center ${TEXT_CELL} text-(--foreground)`}>{row.scene}</span>
            <span className={`text-center ${numClass}`}>{row.smart}</span>
            <span className={`text-center ${numClass}`}>{row.manual}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const TEXT_CELL = 'text-[13px] leading-snug'
const BLUE = 'var(--ck-blue)'
const GREEN = 'var(--ck-green)'

interface RingArcProps {
  c: number
  r: number
  w: number
  stroke: string
  pct: number
}

interface DataTableProps {
  columns: readonly string[]
  rows: RuleSceneRow[]
  /** grid-template-columns 取值；accent 为真时数值列用高亮色 */
  cols: string
  accent: boolean
  className?: string
}
