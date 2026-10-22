import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { PanelBox, ProgressBar, SectionTitle, StatusTag, useChartColors } from '@/components/cockpit-ui'

import {
  buildAuditOption,
  buildBillOption,
  buildEfficiencyOption,
  buildQualityOption,
} from './staffChartOptions'
import {
  STAFF_AUDIT_RATES,
  STAFF_BILL_TABS,
  STAFF_CENTER_ROWS,
  STAFF_EFFICIENCY_TABS,
  STAFF_HEADCOUNT,
  STAFF_HEADCOUNT_TOTAL,
  STAFF_PERFORMANCE,
  STAFF_PERFORMANCE_ROWS,
  STAFF_RANKS,
  STAFF_REPORT_GAUGES,
  STAFF_SERVICE,
  STAFF_SKILLS,
  STAFF_SPECIAL_TASK,
} from './staffData'
import {
  Chart,
  Donut,
  DonutLabel,
  HalfGauge,
  LegendNum,
  MiniKv,
  PedestalStat,
  PlateStat,
  RingGauge,
  TabRow,
} from './staffWidgets'

/** 员工管理平台的中间业务区（对应参考截图 11-员工管理平台） */
export function StaffPlatformContent() {
  return (
    <div className="flex min-h-0 flex-1 gap-2.5">
      <div className="flex min-w-0 flex-1 flex-col gap-2.5">
        <div className="flex h-[424px] shrink-0 gap-2.5">
          <BasicPanel className="w-[730px] shrink-0" />
          <QualityPanel className="w-[448px] shrink-0" />
          <PerformancePanel className="min-w-0 flex-1" />
        </div>

        <div className="flex min-h-0 flex-1 gap-2.5">
          <OperationPanel className="w-[898px] shrink-0" />
          <EfficiencyPanel className="min-w-0 flex-1" />
          <ServicePanel className="w-[228px] shrink-0" />
        </div>
      </div>
    </div>
  )
}

/**
 * 面板标题上的钻取入口。
 *
 * 点击区域就是标题文字本身（含末尾的「›」箭头），鼠标移上去变 `cursor-pointer`
 * 并加下划线；颜色继承 `PanelBox` 标题的样式，不额外改样式层级。
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

/* ───────────── 基本情况 ───────────── */

const CENTER_HEAD = ['中心', '在岗', '其中:|在岗作业人数', '休假', '出差', '其他']

function BasicPanel({ className = '' }: { className?: string }) {
  const navigate = useNavigate()

  return (
    <PanelBox
      title={<DrillLink title="基本情况" to="/drill/staff-basic" />}
      extra={
        <button
          type="button"
          onClick={() => navigate('/staff-dashboard')}
          className="cursor-pointer rounded-[4px] bg-(--ck-cyan) px-2.5 py-1.5 text-[13px] font-medium text-white transition-opacity hover:opacity-85"
        >
          员工个人管理看板
        </button>
      }
      className={`flex flex-col ${className}`}
    >
      <div className="flex h-full gap-4 px-3.5 pt-2 pb-2.5">
        <div className="flex w-[338px] shrink-0 flex-col">
          <SectionTitle>作业人员</SectionTitle>

          <div className="relative mt-1 h-[158px] shrink-0">
            <div className="absolute top-[12px] left-1/2 -translate-x-1/2">
              <Donut
                slices={STAFF_HEADCOUNT}
                size={128}
                thickness={20}
                center={
                  <>
                    <span className="ck-glow-num text-[25px] leading-none font-bold text-(--ck-title)">
                      {STAFF_HEADCOUNT_TOTAL}
                    </span>
                    <span className="mt-1 text-[11px] leading-none text-(--text-secondary)">
                      总数
                    </span>
                  </>
                }
              />
            </div>
            <DonutLabel className="top-[4px] left-[26px]" label="出差" value="20" />
            <DonutLabel className="top-[0px] right-[58px]" label="其他" value="6" />
            <DonutLabel className="top-[42px] left-[4px]" label="休假" value="17" />
            <DonutLabel className="right-[12px] bottom-[6px]" label="在岗" value="131" />
          </div>

          <table className="mt-1 w-full table-fixed border-collapse text-[12px]">
            <colgroup>
              <col className="w-[70px]" />
              <col className="w-[46px]" />
              <col className="w-[92px]" />
              <col className="w-[44px]" />
              <col className="w-[44px]" />
              <col className="w-[42px]" />
            </colgroup>
            <thead>
              <tr className="bg-(--ck-table-head)">
                {CENTER_HEAD.map((h) => (
                  <th
                    key={h}
                    className="px-1 py-1.5 text-center leading-tight font-medium text-(--ck-title-sub)"
                  >
                    {h.split('|').map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {STAFF_CENTER_ROWS.map((r, i) => (
                <tr
                  key={r.center}
                  className={i % 2 ? 'bg-(--ck-table-row-alt)' : 'bg-(--ck-table-row)'}
                >
                  <td className="py-[7px] text-center text-(--foreground)">{r.center}</td>
                  <td className="text-center text-(--foreground)">{r.onDuty}</td>
                  <td className="text-center font-medium text-(--ck-cyan)">{r.working}</td>
                  <td className="text-center text-(--foreground)">{r.leave}</td>
                  <td className="text-center text-(--foreground)">{r.trip}</td>
                  <td className="text-center text-(--foreground)">{r.other}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <SectionTitle
            extra={
              <span className="text-[12px] leading-none text-(--ck-blue)">前10大标签数量排名</span>
            }
          >
            人员技能情况
          </SectionTitle>

          <div className="relative mt-2 min-h-0 flex-1">
            <svg
              className="absolute bottom-[6px] left-1/2 -translate-x-1/2"
              width="210"
              height="60"
              viewBox="0 0 210 60"
              fill="none"
              aria-hidden
            >
              <path
                d="M105 6 L198 30 L105 54 L12 30 Z"
                fill="color-mix(in srgb, var(--ck-cyan) 12%, transparent)"
                stroke="color-mix(in srgb, var(--ck-cyan) 45%, transparent)"
              />
              <path
                d="M105 18 L158 32 L105 46 L52 32 Z"
                fill="color-mix(in srgb, var(--ck-cyan) 28%, transparent)"
              />
            </svg>

            {STAFF_SKILLS.map((b) => (
              <div
                key={b.label}
                className="absolute flex flex-col items-center justify-center gap-1 rounded-full text-center"
                style={{
                  left: `${b.x}%`,
                  top: `${b.y}%`,
                  width: b.size,
                  height: b.size,
                  background:
                    'radial-gradient(circle at 36% 28%, color-mix(in srgb, var(--ck-cyan) 20%, transparent), color-mix(in srgb, var(--ck-cyan) 8%, var(--ck-panel-inner)) 74%)',
                  border: '1px solid color-mix(in srgb, var(--ck-cyan) 30%, transparent)',
                  boxShadow: '0 6px 16px color-mix(in srgb, var(--ck-cyan) 16%, transparent)',
                }}
              >
                <span className="px-1 text-[11px] leading-tight text-(--ck-title-sub)">
                  {b.label}
                </span>
                <span className="text-[15px] leading-none font-bold text-(--ck-cyan)">
                  {b.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PanelBox>
  )
}

/* ───────────── 质量情况 ───────────── */

function QualityPanel({ className = '' }: { className?: string }) {
  const c = useChartColors()
  const qualityOption = useMemo(() => buildQualityOption(c), [c])
  const auditOption = useMemo(() => buildAuditOption(c), [c])

  return (
    <PanelBox
      title={<DrillLink title="质量情况" to="/drill/staff-quality" />}
      className={`flex flex-col ${className}`}
    >
      <div className="flex h-full flex-col px-3.5 pt-2 pb-2.5">
        <SectionTitle>业务处理质量</SectionTitle>
        <div className="h-[158px] shrink-0">
          <Chart option={qualityOption} />
        </div>

        <SectionTitle className="mt-1">被质量稽核情况</SectionTitle>
        <div className="mt-2 flex min-h-0 flex-1 gap-2.5">
          <div className="flex w-[132px] shrink-0 flex-col justify-center gap-2.5">
            {STAFF_AUDIT_RATES.map((r) => (
              <div
                key={r.label}
                className="flex flex-col items-center gap-1.5 rounded-[10px] border px-2 py-2"
                style={{
                  borderColor: 'var(--ck-card-border)',
                  background: 'linear-gradient(180deg, var(--ck-card-from), var(--ck-card-to))',
                  boxShadow: 'var(--ck-card-shadow)',
                }}
              >
                <span className="text-[12px] leading-none text-(--ck-title-sub)">{r.label}</span>
                <span className="ck-glow-num text-[19px] leading-none font-bold text-(--ck-cyan)">
                  {r.value}
                </span>
              </div>
            ))}
          </div>

          <div className="flex min-w-0 flex-1 flex-col">
            <span className="text-[12px] leading-none text-(--ck-title-sub)">质量稽核差错率</span>
            <div className="min-h-0 flex-1">
              <Chart option={auditOption} />
            </div>
          </div>
        </div>
      </div>
    </PanelBox>
  )
}

/* ───────────── 绩效情况 ───────────── */

/** 绩效达标列表固定展示的条数，第 5 条起需手动滚动 */
const PERFORMANCE_VISIBLE = 4

function PerformancePanel({ className = '' }: { className?: string }) {
  return (
    <PanelBox title="绩效情况" className={`flex flex-col ${className}`}>
      <div className="flex h-full flex-col gap-2.5 px-3.5 pt-2 pb-2.5">
        <div className="flex shrink-0 items-center gap-2">
          <div className="flex min-w-0 flex-1 flex-col gap-2.5">
            <PlateStat
              icon="ri-bar-chart-box-line"
              label="指标数量"
              value={STAFF_PERFORMANCE.indicatorTotal}
            />
            <LegendNum
              color="var(--ck-blue)"
              label="达标指标数量"
              value={STAFF_PERFORMANCE.reached}
            />
            <LegendNum
              color="var(--ck-orange)"
              label="未达标指标数量"
              value={STAFF_PERFORMANCE.unreached}
            />
          </div>

          <Donut
            size={122}
            thickness={16}
            slices={[
              { label: '达标', value: STAFF_PERFORMANCE.completionRate, color: 'var(--ck-blue)' },
              {
                label: '未达标',
                value: 100 - STAFF_PERFORMANCE.completionRate,
                color: 'var(--ck-orange)',
              },
            ]}
            center={
              <>
                <span className="ck-glow-num text-[22px] leading-none font-bold text-(--ck-title)">
                  {STAFF_PERFORMANCE.completionRate}%
                </span>
                <span className="mt-1 text-[11px] leading-none text-(--text-secondary)">
                  完成率
                </span>
              </>
            }
          />
        </div>

        {/*
          固定展示 PERFORMANCE_VISIBLE 条且撑满面板底部：
          滚动容器本身 `flex-1` 占满剩余高度，每条的外框高度取容器高度的
          1/PERFORMANCE_VISIBLE —— 前 4 条正好铺满、第 5 条落在可视区外，
          交给 `overflow-y-auto` 手动滚动。
          （不能用 `grow basis-0`：那样行会一直均分容器高度、永远不溢出，滚动失效。）
        */}
        <div className="ck-scroll flex min-h-0 flex-1 flex-col overflow-y-auto pr-1">
          {STAFF_PERFORMANCE_ROWS.map((row) => (
            <div
              key={row.label}
              className="shrink-0 pb-2 last:pb-0"
              style={{ height: `calc(100% / ${PERFORMANCE_VISIBLE})` }}
            >
              <div className="ck-card flex h-full items-center gap-2 rounded-[3px] px-2.5">
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-[12px] leading-none text-(--ck-title-sub)">
                      {row.label}
                    </span>
                    <span className="shrink-0 text-[12px] leading-none text-(--foreground)">
                      {row.value}
                    </span>
                  </span>
                  <ProgressBar
                    value={row.percent}
                    tone={row.reached ? 'green' : 'orange'}
                    showValue={false}
                  />
                </div>
                <StatusTag tone={row.reached ? 'green' : 'orange'}>
                  {row.reached ? '达标' : '未达标'}
                </StatusTag>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PanelBox>
  )
}

/* ───────────── 作业情况 ───────────── */

function OperationPanel({ className = '' }: { className?: string }) {
  const c = useChartColors()
  const [tab, setTab] = useState(1)
  const data = STAFF_BILL_TABS[tab] ?? STAFF_BILL_TABS[1]
  const option = useMemo(() => buildBillOption(c, data), [c, data])

  return (
    <PanelBox
      title={<DrillLink title="作业情况" to="/drill/staff-job" />}
      className={`flex flex-col ${className}`}
    >
      <div className="flex h-full gap-4 px-3.5 pt-2 pb-2.5">
        <div className="flex w-[398px] shrink-0 flex-col">
          <SectionTitle>单据处理情况</SectionTitle>
          <TabRow
            className="mt-2"
            items={STAFF_BILL_TABS.map((t) => t.label)}
            active={tab}
            onChange={setTab}
          />

          <div className="mt-2 flex shrink-0 items-center gap-2">
            <div className="flex min-w-0 flex-1 flex-col gap-2.5">
              <PlateStat icon="ri-file-list-3-line" label={data.label} value={data.total} />
              <LegendNum color="var(--ck-blue)" label="RPA处理单据量" value={String(data.rpa)} />
              <LegendNum
                color="var(--ck-green)"
                label="人工处理单据完成量"
                value={String(data.manual)}
              />
            </div>
            <Donut
              size={104}
              thickness={22}
              slices={[
                { label: 'RPA', value: data.rpa, color: 'var(--ck-blue)' },
                { label: '人工', value: data.manual, color: 'var(--ck-green)' },
              ]}
            />
          </div>

          <div className="mt-1 min-h-0 flex-1">
            <Chart option={option} />
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <SectionTitle>报表出具情况</SectionTitle>
          <div className="mt-1 flex shrink-0 gap-2">
            {STAFF_REPORT_GAUGES.map((g) => (
              <div key={g.label} className="flex min-w-0 flex-1 flex-col items-center gap-1">
                <HalfGauge value={g.value} />
                <span className="text-center text-[12px] leading-tight text-(--ck-title-sub)">
                  {g.label}
                </span>
                <MiniKv label="已出具量" value={g.issued} />
                <MiniKv label="待出具量" value={g.pending} />
              </div>
            ))}
          </div>

          <SectionTitle className="mt-3">专项任务完成情况</SectionTitle>
          <div className="mt-1 flex min-h-0 flex-1 items-center gap-4">
            <PedestalStat
              topLabel={STAFF_SPECIAL_TASK.label}
              value={STAFF_SPECIAL_TASK.total}
              tone="blue"
            />
            <div className="flex min-w-0 flex-1 flex-col gap-3">
              {STAFF_SPECIAL_TASK.rows.map((r) => (
                <div key={r.label} className="flex flex-col gap-2">
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-[12px] leading-none text-(--ck-title-sub)">
                      {r.label}
                    </span>
                    <span className="text-[15px] leading-none font-bold text-(--foreground)">
                      {r.value}
                    </span>
                  </span>
                  <ProgressBar value={r.percent} tone={r.tone} showValue={false} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PanelBox>
  )
}

/* ───────────── 效率情况 ───────────── */

const RANK_COLOR: Record<number, string> = {
  1: 'var(--ck-red)',
  2: 'var(--ck-orange)',
  3: 'var(--ck-green)',
}

function EfficiencyPanel({ className = '' }: { className?: string }) {
  const c = useChartColors()
  const [tab, setTab] = useState(1)
  const data = STAFF_EFFICIENCY_TABS[tab] ?? STAFF_EFFICIENCY_TABS[1]
  const option = useMemo(() => buildEfficiencyOption(c, data), [c, data])

  return (
    <PanelBox
      title={<DrillLink title="效率情况" to="/drill/staff-efficiency" />}
      className={`flex flex-col ${className}`}
    >
      <div className="flex h-full flex-col gap-2 px-3.5 pt-2 pb-2.5">
        <TabRow items={STAFF_EFFICIENCY_TABS.map((t) => t.label)} active={tab} onChange={setTab} />

        <div className="flex h-[150px] shrink-0 items-center gap-1">
          <div className="w-[128px] shrink-0">
            <PlateStat icon="ri-file-text-line" label={data.label} value={data.value} stacked />
          </div>
          <div className="h-full min-w-0 flex-1">
            <Chart option={option} />
          </div>
        </div>

        <span className="shrink-0 text-[15px] leading-none font-semibold text-(--ck-title-sub)">
          员工个人产能排名
        </span>

        <div className="grid min-h-0 flex-1 grid-cols-2 content-center gap-x-4 gap-y-2.5">
          {STAFF_RANKS.map((r) => (
            <div key={r.name} className="flex items-center gap-2">
              <span
                className="flex h-[22px] w-[19px] shrink-0 items-center justify-center text-[12px] leading-none font-bold text-white"
                style={{
                  background: RANK_COLOR[r.rank] ?? 'var(--ck-blue)',
                  clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 74%, 0 100%)',
                }}
              >
                {r.rank}
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <span className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-[12px] leading-none text-(--foreground)">
                    {r.name}
                  </span>
                  <span className="text-[13px] leading-none font-bold text-(--foreground)">
                    {r.value}
                  </span>
                </span>
                <ProgressBar value={r.percent} tone="blue" showValue={false} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </PanelBox>
  )
}

/* ───────────── 服务情况 ───────────── */

function ServicePanel({ className = '' }: { className?: string }) {
  return (
    <PanelBox
      title={<DrillLink title="服务情况" to="/drill/staff-service" />}
      className={`flex flex-col ${className}`}
    >
      <div className="flex h-full flex-col items-center justify-around px-3 pt-2 pb-3">
        <PedestalStat
          topLabel="用户投诉总量"
          value={STAFF_SERVICE.complaintTotal}
          tone="green"
          big
        />
        <RingGauge value={STAFF_SERVICE.agreementRate} label="服务协议综合达成率" />
      </div>
    </PanelBox>
  )
}
