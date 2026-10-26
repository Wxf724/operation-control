import { useMemo } from 'react'

import { PanelBox, SectionTitle, useChartColors } from '@/components/cockpit-ui'
import { splitLabelLines } from '@/utils'

import {
  buildComplaintOption,
  buildResolveHoursOption,
  buildRevenueOption,
} from './serviceChartOptions'
import {
  SERVICE_AI_CONSULT_TOTAL,
  SERVICE_COLLECTED,
  SERVICE_COLLECT_RATE,
  SERVICE_COLLECT_RING,
  SERVICE_COMPLAINT_TOTAL,
  SERVICE_CONSULT_TOTAL,
  SERVICE_ENTERPRISE_COUNT,
  SERVICE_MOOD_ROWS,
  SERVICE_ORDER_RATE,
  SERVICE_ORDER_RING,
  SERVICE_REVENUE_MONTH,
  SERVICE_REVENUE_YOY,
  SERVICE_SATISFIED_RATE,
  SERVICE_SATISFIED_RING,
  SERVICE_SLA_ACHIEVED,
  SERVICE_SLA_GAUGE,
  SERVICE_SLA_RATES,
  SERVICE_STAR_ROWS,
  SERVICE_SURVEY_SCORE,
  SERVICE_TIMEOUT_TIMES,
  SERVICE_TRANSFER_RATE,
  SERVICE_TRANSFER_RING,
  SERVICE_TRANSFER_SESSIONS,
  SERVICE_UNCOLLECTED,
} from './serviceData'
import {
  ArcGauge,
  Chart,
  Donut,
  LegendRow,
  MoodRow,
  PedestalRing,
  PlateNumber,
  PodiumScore,
  StarRow,
} from './serviceWidgets'

/** 服务管理平台的中间业务区（对应 `_refs/live/17-服务管理平台.png`） */
export function ServicePlatformContent() {
  return (
    <div className="flex min-h-0 flex-1 gap-3">
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex min-h-0 flex-[1.16] gap-3">
          <ServiceStatusPanel className="w-[642px] shrink-0" />
          <SlaPanel className="min-w-0 flex-1" />
        </div>

        <SatisfactionPanel className="min-h-0 flex-1" />
      </div>
    </div>
  )
}

/* ───────────── 服务情况 ───────────── */

function ServiceStatusPanel({ className = '' }: { className?: string }) {
  const c = useChartColors()
  const option = useMemo(() => buildResolveHoursOption(c), [c])

  return (
    <PanelBox title="服务情况" className={`flex flex-col ${className}`}>
      <div className="flex h-full flex-col px-4 pt-2 pb-2.5">
        <div className="flex min-h-0 flex-[0.95] items-start gap-1">
          <div className="flex w-[186px] shrink-0 flex-col">
            <span className="text-[14px] leading-none font-medium text-(--ck-title-sub)">
              完成咨询总量（人工）
            </span>
            <PlateNumber
              value={SERVICE_CONSULT_TOTAL.toLocaleString('en-US')}
              unit="个"
              valueTone="cyan"
              width={142}
              className="mt-3"
            />
            <div className="mt-2 flex flex-col gap-3">
              <LegendRow
                color="var(--ck-green)"
                label="AI客服转人工会话率"
                value={String(SERVICE_TRANSFER_SESSIONS)}
                unit="个"
                valueClassName="text-[15px]"
              />
              <LegendRow
                color="var(--ck-blue)"
                label="完成咨询总量（AI客服）"
                value={String(SERVICE_AI_CONSULT_TOTAL)}
                unit="个"
                valueClassName="text-[15px]"
              />
            </div>
          </div>

          <Donut
            slices={SERVICE_TRANSFER_RING}
            size={156}
            thickness={20}
            innerRing
            className="mt-2 shrink-0"
            center={
              <>
                <span className="ck-glow-num text-[28px] leading-none font-bold text-(--foreground)">
                  {SERVICE_TRANSFER_RATE}%
                </span>
                <span className="mt-2 text-[14px] leading-none text-(--ck-title-sub)">
                  转人工率
                </span>
              </>
            }
          />

          <div className="flex min-w-0 flex-1 flex-col items-center">
            <span className="flex items-center gap-1.5 self-stretch">
              <i className="ri-time-line text-[17px] leading-none text-(--ck-orange)" aria-hidden />
              <span className="text-[14px] leading-none font-medium text-(--ck-title-sub)">
                首次响应超时次数（人工）
              </span>
            </span>
            <PlateNumber
              value={String(SERVICE_TIMEOUT_TIMES)}
              unit="次"
              tone="orange"
              width={150}
              className="mt-6"
            />
          </div>
        </div>

        <SectionTitle className="mt-1 shrink-0">平均问题解决时长</SectionTitle>
        <span className="mt-1.5 shrink-0 text-[12px] leading-none text-(--text-tertiary)">
          单位：小时
        </span>

        <div className="mt-0.5 min-h-0 flex-1">
          <Chart option={option} />
        </div>
      </div>
    </PanelBox>
  )
}

/* ───────────── 服务水平协议履约情况 ───────────── */

function SlaPanel({ className = '' }: { className?: string }) {
  const c = useChartColors()
  const option = useMemo(() => buildRevenueOption(c), [c])

  return (
    <PanelBox title="服务水平协议履约情况" className={`flex flex-col ${className}`}>
      <div className="flex h-full flex-col px-4 pt-2 pb-2.5">
        <SectionTitle className="shrink-0">服务达成情况</SectionTitle>

        <div className="flex min-h-0 flex-[0.82] items-center gap-3.5 pt-1">
          <div className="flex w-[218px] shrink-0 items-center gap-2.5">
            <span className="relative flex h-[48px] w-[52px] shrink-0 items-end justify-center">
              <svg
                className="absolute bottom-0 left-0"
                width="52"
                height="16"
                viewBox="0 0 52 16"
                fill="none"
                aria-hidden
              >
                <ellipse cx="26" cy="8" rx="23" ry="6" fill="var(--ck-blue)" opacity="0.22" />
                <ellipse
                  cx="26"
                  cy="8"
                  rx="23"
                  ry="6"
                  stroke="var(--ck-blue)"
                  strokeOpacity="0.45"
                />
              </svg>
              <i
                className="ri-file-list-3-line relative mb-[3px] text-[27px] text-(--ck-cyan)"
                aria-hidden
              />
            </span>
            <span className="flex min-w-0 flex-col gap-2">
              <span className="truncate text-[14px] leading-none text-(--ck-title-sub)">
                服务指标达成量
              </span>
              <span className="flex items-baseline gap-0.5">
                <span className="ck-glow-num text-[26px] leading-none font-bold text-(--ck-cyan)">
                  {SERVICE_SLA_ACHIEVED}
                </span>
                <span className="text-[12px] leading-none text-(--text-secondary)">个</span>
              </span>
            </span>
          </div>

          <ArcGauge value={SERVICE_SLA_GAUGE} label="达成率" width={148} />

          <div className="flex min-w-0 flex-1 flex-col justify-center gap-3.5">
            {SERVICE_SLA_RATES.map((rate) => (
              <div key={rate.label} className="flex items-center gap-2.5">
                <span className="ck-card flex h-[48px] w-[122px] shrink-0 flex-col items-center justify-center gap-1 rounded-[3px] px-1 text-center">
                  {splitLabelLines(rate.label, 6).map((line) => (
                    <span
                      key={line}
                      className="block text-[12px] leading-none text-(--ck-title-sub)"
                    >
                      {line}
                    </span>
                  ))}
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <span className="self-end text-[14px] leading-none text-(--foreground)">
                    综合达成率{' '}
                    <span
                      className="font-bold"
                      style={{ color: `var(--ck-${rate.tone === 'green' ? 'green' : 'blue'})` }}
                    >
                      {rate.value}%
                    </span>
                  </span>
                  <span
                    className="relative h-[9px] overflow-hidden rounded-full"
                    style={{ background: 'var(--ck-track)' }}
                  >
                    <i
                      className="absolute top-0 left-0 h-full rounded-full"
                      style={{
                        width: `${rate.value}%`,
                        background: `linear-gradient(90deg, color-mix(in srgb, var(--ck-${rate.tone}) 40%, transparent), var(--ck-${rate.tone}))`,
                      }}
                    />
                  </span>
                </span>
              </div>
            ))}
          </div>

          <PedestalRing label="服务企业数量" value={String(SERVICE_ENTERPRISE_COUNT)} width={148} />
        </div>

        <SectionTitle className="mt-1.5 shrink-0">服务收入金额</SectionTitle>

        <div className="mt-2 flex shrink-0 items-baseline gap-5">
          <span className="flex items-baseline gap-1">
            <span className="text-[13px] leading-none text-(--ck-title-sub)">当月</span>
            <span className="ck-glow-num text-[26px] leading-none font-bold text-(--foreground)">
              {SERVICE_REVENUE_MONTH.toLocaleString('en-US')}
            </span>
            <span className="text-[12px] leading-none text-(--text-secondary)">万元</span>
          </span>
          <span className="text-[13px] leading-none">
            <span className="text-(--text-tertiary)">同比：</span>
            <span className="font-medium text-(--ck-green)">
              {SERVICE_REVENUE_YOY}
              <span className="ml-0.5">▲</span>
            </span>
          </span>
        </div>

        <span className="mt-2 shrink-0 text-[12px] leading-none text-(--text-tertiary)">
          单位：万元
        </span>

        <div className="mt-0.5 flex min-h-0 flex-1 items-center gap-2">
          <div className="h-full min-w-0 flex-1">
            <Chart option={option} />
          </div>

          <div className="flex w-[348px] shrink-0 items-center gap-4">
            <Donut
              slices={SERVICE_COLLECT_RING}
              size={180}
              thickness={18}
              innerRing
              center={
                <>
                  <span className="ck-glow-num text-[27px] leading-none font-bold text-(--foreground)">
                    {SERVICE_COLLECT_RATE}%
                  </span>
                  <span className="mt-2 text-center text-[13px] leading-tight text-(--ck-title-sub)">
                    服务收费
                    <br />
                    回款率
                  </span>
                </>
              }
            />
            <div className="flex min-w-0 flex-col gap-5">
              <LegendRow
                color="var(--ck-blue)"
                label="服务收费已回款金额"
                value={SERVICE_COLLECTED.toLocaleString('en-US')}
                unit="万元"
                stacked
              />
              <LegendRow
                color="var(--ck-yellow)"
                label="服务收入未回款金额"
                value={SERVICE_UNCOLLECTED.toLocaleString('en-US')}
                unit="万元"
                stacked
              />
            </div>
          </div>
        </div>
      </div>
    </PanelBox>
  )
}

/* ───────────── 客户体验与满意度情况 ───────────── */

const MOOD_TOTAL = SERVICE_MOOD_ROWS.reduce((sum, r) => sum + r.count, 0) || 1

function SatisfactionPanel({ className = '' }: { className?: string }) {
  const c = useChartColors()
  const option = useMemo(() => buildComplaintOption(c), [c])

  return (
    <PanelBox title="客户体验与满意度情况" className={`flex flex-col ${className}`}>
      <div className="flex h-full gap-5 px-4 pt-1.5 pb-3">
        {/* 随单评价占比 */}
        <div className="flex w-[420px] shrink-0 flex-col">
          <SectionTitle className="shrink-0">随单评价占比</SectionTitle>

          <div className="flex min-h-0 flex-1 items-center gap-5 pt-1">
            <Donut
              slices={SERVICE_ORDER_RING}
              size={196}
              thickness={22}
              gap={6}
              center={
                <>
                  <span className="ck-glow-num text-[30px] leading-none font-bold text-(--foreground)">
                    {SERVICE_ORDER_RATE.toFixed(1)}%
                  </span>
                  <span className="mt-2 text-[14px] leading-none text-(--ck-title-sub)">
                    五星评价
                  </span>
                </>
              }
            />

            <div className="flex min-w-0 flex-1 flex-col gap-3">
              {SERVICE_STAR_ROWS.map((row) => (
                <StarRow key={row.stars} stars={row.stars} count={row.count} />
              ))}
            </div>
          </div>
        </div>

        {/* 工单服务满意度评分 */}
        <div className="flex w-[486px] shrink-0 flex-col">
          <SectionTitle className="shrink-0">工单服务满意度评分</SectionTitle>

          <div className="flex min-h-0 flex-1 items-center gap-5 pt-1">
            <Donut
              slices={SERVICE_SATISFIED_RING}
              size={196}
              thickness={22}
              gap={10}
              center={
                <>
                  <span className="ck-glow-num text-[30px] leading-none font-bold text-(--foreground)">
                    {SERVICE_SATISFIED_RATE.toFixed(1)}%
                  </span>
                  <span className="mt-2 text-[14px] leading-none text-(--ck-title-sub)">
                    非常满意
                  </span>
                </>
              }
            />

            <div className="flex min-w-0 flex-1 flex-col gap-4">
              {SERVICE_MOOD_ROWS.map((row) => (
                <MoodRow
                  key={row.emoji}
                  emoji={row.emoji}
                  count={row.count}
                  ratio={(row.count / MOOD_TOTAL) * 100}
                  color="var(--ck-blue)"
                />
              ))}
            </div>
          </div>
        </div>

        {/* 问卷满意度调查 */}
        <div className="flex w-[252px] shrink-0 flex-col">
          <SectionTitle className="shrink-0">问卷满意度调查</SectionTitle>

          <div className="flex min-h-0 flex-1 items-center justify-center">
            <PodiumScore label="客户满意度问卷评分" value={String(SERVICE_SURVEY_SCORE)} />
          </div>
        </div>

        {/* 用户投诉总量 */}
        <div className="flex min-w-0 flex-1 flex-col">
          <SectionTitle className="shrink-0">用户投诉总量</SectionTitle>

          <div className="mt-3 flex shrink-0 items-center gap-2">
            <i
              className="ri-error-warning-fill text-[20px] leading-none text-(--ck-orange)"
              aria-hidden
            />
            <span className="text-[14px] leading-none text-(--ck-title-sub)">用户投诉总量</span>
            <span className="ck-glow-num text-[19px] leading-none font-bold text-(--ck-orange)">
              {SERVICE_COMPLAINT_TOTAL}
            </span>
            <span className="text-[12px] leading-none text-(--text-secondary)">个</span>
          </div>

          <span className="mt-3 shrink-0 text-[12px] leading-none text-(--text-tertiary)">
            单位：个
          </span>

          <div className="mt-0.5 min-h-0 flex-1">
            <Chart option={option} />
          </div>
        </div>
      </div>
    </PanelBox>
  )
}
