import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ReactECharts from 'echarts-for-react'

import {
  BackToCockpitButton,
  PanelBox,
  PeriodOrgControls,
  ScreenHeader,
  ScreenScaler,
  useChartColors,
} from '@/components/cockpit-ui'
import { AiStrategyBlock } from '@/pages/platform/components/AiStrategyBlock'
import { FeedbackBlock } from '@/pages/platform/components/FeedbackBlock'
import { KpiRow } from '@/pages/platform/components/KpiRow'
import { ORG_OPTIONS } from '@/pages/platform/constants'

import { buildTrendOption } from './chartOptions'
import {
  CANVAS,
  DASHBOARD_KPIS,
  DOC_STATS,
  DURATION_TREND,
  PERIOD,
  PERSONAL_METRICS,
  REPORT_GAUGES,
  SPECIAL_ROWS,
  SPECIAL_STATS,
  SPECIAL_TABS,
  SPECIAL_TOTAL,
  STAFF_INFO,
  STAFF_TABS,
  VOLUME_TREND,
} from './constants'
import {
  DocStatItem,
  GaugeKvBar,
  MetricBar,
  PedestalIcon,
  ReportGauge,
  SpecialRing,
  SpecialStatCard,
  SubTitle,
} from './widgets'
import { TONE_VAR } from './tone'
import type { SpecialTaskRow, TrendSeries } from './types'

/**
 * 员工个人管理看板（路由 `/staff-dashboard`）。
 *
 * 从员工管理平台「基本情况」面板右上角的按钮跳转进来。
 * 版面与 13 个模块平台页同骨架：顶栏 + 7 张 KPI + 三栏，
 * 右栏「AI 调控策略」「调控执行反馈」直接复用平台页的共用块。
 */
export function StaffDashboardPage() {
  const navigate = useNavigate()

  return (
    <div className="theme-cloud-light">
      <ScreenScaler width={CANVAS.width} height={CANVAS.height}>
        <div className="relative flex h-full w-full flex-col">
          {/* 屏幕外框装饰：仅在浅色玻璃主题下可见（见 aqua-light.css 的 .ck-frame） */}
          <span className="ck-frame" aria-hidden />

          <ScreenHeader
            title="员工个人管理看板"
            height={72}
            left={
              <>
                <BackToCockpitButton onClick={() => navigate('/platform/staff')} />
                <PeriodOrgControls
                  period={`${PERIOD.start}  至  ${PERIOD.end}`}
                  units={['日', '月', '年']}
                  defaultUnit="月"
                  orgs={ORG_OPTIONS}
                />
              </>
            }
          />

          <div className="flex min-h-0 flex-1 flex-col gap-3 px-5 pt-1.5 pb-5">
            <KpiRow items={DASHBOARD_KPIS} className="h-[80px] shrink-0" />

            <div className="flex min-h-0 flex-1 gap-3">
              <LeftColumn />
              <CenterColumn />

              {/* 右栏：与 13 个平台页一致（策略 1.22 : 反馈 1） */}
              <div className="flex w-[756px] shrink-0 flex-col gap-3">
                <AiStrategyBlock className="min-h-0 flex-[1.22]" />
                <FeedbackBlock className="min-h-0 flex-1" />
              </div>
            </div>
          </div>
        </div>
      </ScreenScaler>
    </div>
  )
}

/* ───────────── 左栏：员工动态监测 + 作业趋势监测 ───────────── */

function LeftColumn() {
  return (
    <div className="flex w-[734px] shrink-0 flex-col gap-3">
      <PanelBox title={<span className="italic">员工动态监测</span>} className="flex min-h-0 flex-col flex-[1.02]">
        <div className="flex h-full min-h-0 flex-col gap-3 px-3.5 pt-3 pb-3.5">
          <StaffProfileRow />

          <div className="grid min-h-0 flex-1 grid-cols-3 gap-3">
            {PERSONAL_METRICS.map((metric) => (
              <div key={metric.title} className="flex min-w-0 flex-col justify-end gap-3">
                <span className="text-[14px] leading-snug font-medium text-(--ck-title-sub)">
                  {metric.title}
                </span>
                {metric.rows.map((row) => (
                  <MetricBar key={row.label} row={row} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </PanelBox>

      <PanelBox title={<span className="italic">作业趋势监测</span>} className="flex min-h-0 flex-col flex-[1.28]">
        <div className="flex h-full min-h-0 flex-col gap-2 px-3.5 pt-2.5 pb-3">
          <TrendChart title="任务平均处理时长" series={DURATION_TREND} />
          <TrendChart title="任务量情况" series={VOLUME_TREND} />
        </div>
      </PanelBox>
    </div>
  )
}

/** 头像 + 姓名 / 职级岗位 + 在岗·休假·出差三个底座数 */
function StaffProfileRow() {
  const days = [STAFF_INFO.onDuty, STAFF_INFO.vacation, STAFF_INFO.travel]

  return (
    <div className="flex shrink-0 gap-3.5">
      {/*
        证件照位：优先读 `public/avatar-staff.png`，缺失时退回项目已有的
        `avatar-handler.png`，两者都取不到才露出底层图标占位。
        把本人照片放进 public 后无需改代码即生效。
      */}
      <span
        className="relative flex h-[132px] w-[118px] shrink-0 items-center justify-center overflow-hidden rounded-[10px]"
        style={{ border: '1px solid var(--ck-card-border)', background: 'var(--ck-panel-inner)' }}
      >
        <i className="ri-user-3-fill text-[52px] text-(--ck-blue) opacity-35" aria-hidden />
        <img
          src={`${import.meta.env.BASE_URL}avatar-staff.png`}
          alt={STAFF_INFO.name}
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
          onError={(e) => {
            const img = e.currentTarget
            const fallback = `${import.meta.env.BASE_URL}avatar-handler.png`
            if (!img.src.endsWith('avatar-handler.png')) {
              img.src = fallback
              return
            }
            img.style.display = 'none'
          }}
        />
      </span>

      <div className="flex min-w-0 flex-1 flex-col justify-center gap-3.5">
        <div className="flex flex-col gap-2.5">
          <span className="flex items-baseline gap-2">
            <span className="text-[14px] leading-none text-(--text-secondary)">姓名：</span>
            <span className="text-[21px] leading-none font-bold text-(--ck-title)">
              {STAFF_INFO.name}
            </span>
          </span>
          <span className="flex items-baseline gap-2">
            <span className="shrink-0 text-[14px] leading-none text-(--text-secondary)">
              职级岗位：
            </span>
            <span className="text-[15px] leading-none font-medium text-(--foreground)">
              {STAFF_INFO.post}
            </span>
          </span>
        </div>

        <div className="flex gap-2">
          {days.map((d) => (
            <div key={d.label} className="flex min-w-0 flex-1 items-center gap-1.5">
              <span
                className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-[8px] text-[16px]"
                style={{
                  color: `var(${TONE_VAR[d.tone]})`,
                  background: 'linear-gradient(180deg, var(--ck-icon-from), var(--ck-icon-to))',
                  border: '1px solid var(--ck-card-border)',
                }}
              >
                <i className={d.icon} aria-hidden />
              </span>
              <div className="flex min-w-0 flex-col gap-1">
                <span className="truncate text-[12px] leading-none text-(--text-secondary)">
                  {d.label}
                </span>
                <span className="flex items-baseline gap-0.5">
                  <span
                    className="text-[18px] leading-none font-bold tabular-nums"
                    style={{ color: `var(${TONE_VAR[d.tone]})` }}
                  >
                    {d.value}
                  </span>
                  <span className="text-[11px] leading-none text-(--text-tertiary)">{d.unit}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/** 作业趋势监测里的一张折线图：标题 + 单位 + 图例 + 图表 */
function TrendChart({ title, series }: { title: string; series: TrendSeries }) {
  const c = useChartColors()
  const option = useMemo(() => buildTrendOption(series, c), [series, c])

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-1">
      <div className="flex shrink-0 items-center justify-between gap-2">
        <SubTitle text={title} />
        <span className="flex items-center gap-3">
          <span className="text-[12px] leading-none text-(--text-tertiary)">{series.unit}</span>
          {series.lines.map((line) => (
            <span key={line.name} className="flex items-center gap-1">
              <span
                className="h-[2px] w-[12px] shrink-0 rounded-full"
                style={{ background: `var(${TONE_VAR[line.tone]})` }}
                aria-hidden
              />
              <span className="text-[12px] leading-none text-(--text-secondary)">{line.name}</span>
            </span>
          ))}
        </span>
      </div>
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
/* ───────────── 中栏：页签 + 三块业务区 ───────────── */

function CenterColumn() {
  const [tab, setTab] = useState(STAFF_TABS[0].key)

  return (
    <PanelBox className="flex min-h-0 min-w-0 flex-1 flex-col" corners={false}>
      <div className="flex h-full min-h-0 flex-col gap-3 px-3.5 pt-3 pb-3.5">
        {/* 顶部页签：参考稿里是独立的一行胶囊，不是面板标题 */}
        <div className="flex shrink-0 gap-2.5">
          {STAFF_TABS.map((t) => {
            const active = t.key === tab
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className="flex cursor-pointer items-center gap-1.5 rounded-[9px] px-3.5 py-2.5 text-[14px] leading-none font-medium transition-colors"
                style={{
                  color: active ? 'var(--ck-cyan)' : 'var(--text-secondary)',
                  border: `1px solid ${active ? 'var(--ck-cyan)' : 'var(--ck-card-border)'}`,
                  background: active
                    ? 'color-mix(in srgb, var(--ck-cyan) 12%, var(--ck-panel-inner))'
                    : 'var(--ck-panel-inner)',
                }}
              >
                <i className={`${t.icon} text-[15px]`} aria-hidden />
                {t.label}
              </button>
            )
          })}
        </div>

        <DocSection />
        <ReportSection />
        <SpecialSection />
      </div>
    </PanelBox>
  )
}

/** 个人单据处理情况：一行 5 个底座数 */
function DocSection() {
  return (
    <div className="flex shrink-0 flex-col gap-2.5">
      <SubTitle text="个人单据处理情况" />
      <div className="flex items-center gap-2">
        {DOC_STATS.map((stat) => (
          <DocStatItem key={stat.label} stat={stat} />
        ))}
      </div>
    </div>
  )
}

/** 个人报表出具情况：三个仪表盘，每个下挂已出具 / 待出具两行 */
function ReportSection() {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2.5">
      <SubTitle text="个人报表出具情况" />
      <div className="grid min-h-0 flex-1 grid-cols-3 gap-3">
        {REPORT_GAUGES.map((item) => (
          <div key={item.label} className="flex min-w-0 flex-col items-center gap-2.5">
            <ReportGauge item={item} />
            <span className="text-center text-[13px] leading-none text-(--text-secondary)">
              {item.label}
            </span>
            <div className="flex w-full flex-col gap-1.5">
              <GaugeKvBar label="已出具量" value={item.issued} ratio={item.issuedRatio} tone="cyan" />
              <GaugeKvBar
                label="待出具量"
                value={item.pending}
                ratio={item.pendingRatio}
                tone="green"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/** 个人专项任务工作统计：页签 + 环 + 三张数值卡 + 明细表 */
function SpecialSection() {
  const [tab, setTab] = useState(SPECIAL_TABS[0])

  return (
    <div className="flex min-h-0 flex-[1.62] flex-col gap-2.5">
      <SubTitle text="个人专项任务工作统计" />

      <div className="flex shrink-0 gap-1.5">
        {SPECIAL_TABS.map((t) => {
          const active = t === tab
          return (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className="cursor-pointer rounded-[6px] px-2.5 py-[7px] text-[12px] leading-none transition-colors"
              style={{
                color: active ? 'var(--ck-cyan)' : 'var(--text-secondary)',
                border: `1px solid ${active ? 'var(--ck-cyan)' : 'var(--ck-card-border)'}`,
                background: active
                  ? 'color-mix(in srgb, var(--ck-cyan) 12%, var(--ck-panel-inner))'
                  : 'var(--ck-panel-inner)',
              }}
            >
              {t}
            </button>
          )
        })}
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <SpecialRing
          value={SPECIAL_TOTAL.value}
          label={SPECIAL_TOTAL.label}
          ratio={SPECIAL_TOTAL.ratio}
        />
        {SPECIAL_STATS.map((stat) => (
          <SpecialStatCard key={stat.label} stat={stat} />
        ))}
      </div>

      <SpecialTable />
    </div>
  )
}

/** 专项任务明细表：表头 + 两行，行数多了纵向滚动 */
function SpecialTable() {
  const cols = '56px 1fr 112px 112px 92px'

  return (
    <div
      className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[8px]"
      style={{ border: '1px solid var(--ck-card-border)' }}
    >
      <div
        className="grid shrink-0 items-center gap-2 px-3 py-2.5"
        style={{ gridTemplateColumns: cols, background: 'var(--ck-table-head)' }}
      >
        {['序号', '工作内容', '工作类型', '截止日期', '完成情况'].map((h, i) => (
          <span
            key={h}
            className={`text-[13px] leading-none font-medium text-(--ck-title-sub) ${i === 1 ? '' : 'text-center'}`}
          >
            {h}
          </span>
        ))}
      </div>

      <div className="ck-scroll min-h-0 flex-1 overflow-y-auto">
        {SPECIAL_ROWS.map((row, i) => (
          <SpecialRow key={row.no} row={row} cols={cols} odd={i % 2 === 1} />
        ))}
      </div>
    </div>
  )
}

function SpecialRow({
  row,
  cols,
  odd,
}: {
  row: SpecialTaskRow
  cols: string
  odd: boolean
}) {
  return (
    <div
      className="grid items-center gap-2 px-3 py-2.5"
      style={{
        gridTemplateColumns: cols,
        background: odd ? 'var(--ck-panel-inner)' : 'transparent',
      }}
    >
      <span className="text-center text-[13px] leading-none text-(--text-secondary) tabular-nums">
        {row.no}
      </span>
      <span className="truncate text-[13px] leading-snug text-(--foreground)">{row.content}</span>
      <span className="text-center text-[13px] leading-none text-(--text-secondary)">
        {row.type}
      </span>
      <span className="text-center text-[13px] leading-none text-(--text-secondary) tabular-nums">
        {row.deadline}
      </span>
      <span
        className="text-center text-[13px] leading-none font-semibold"
        style={{ color: `var(${TONE_VAR[row.statusTone] ?? '--ck-cyan'})` }}
      >
        {row.status}
      </span>
    </div>
  )
}
