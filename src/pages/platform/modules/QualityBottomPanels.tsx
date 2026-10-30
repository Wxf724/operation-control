import ReactECharts from 'echarts-for-react'
import { useMemo } from 'react'

import { PanelBox, SectionTitle, useChartColors } from '@/components/cockpit-ui'
import type { ChartVarName } from '@/components/cockpit-ui'
import { DrillTitleLink } from '@/pages/drill/components'
import {
  QUALITY_APPEAL_DRILL_PATH,
  QUALITY_BUSINESS_DRILL_PATH,
  QUALITY_RECTIFY_DRILL_PATH,
} from '@/pages/drill/qualityConstants'

import {
  QUALITY_APPEAL,
  QUALITY_APPEAL_TREND,
  QUALITY_BUSINESS,
  QUALITY_ERROR,
  QUALITY_RECTIFY,
} from './qualityData'
import { tooltipSkin, verticalFill } from './qualityChartTheme'
import { DonutStat } from './qualityWidgets'

/* ───────────── 业务质量与差错情况 ───────────── */

/** 下行左：业务处理质量情况 + 业务处理差错情况 */
export function BusinessQualityPanel({ className = '' }: { className?: string }) {
  return (
    <PanelBox
      title={<DrillTitleLink title="业务质量与差错情况" to={QUALITY_BUSINESS_DRILL_PATH} />}
      className={`flex flex-col ${className}`}
    >
      <div className="flex h-full gap-3.5 px-4 pt-2 pb-3.5">
        <div className="flex w-[300px] shrink-0 flex-col">
          <SectionTitle className="mb-1">业务处理质量情况</SectionTitle>

          <div className="flex flex-1 flex-col items-center justify-center gap-1.5">
            <DonutStat
              size={132}
              thickness={13}
              halo
              centerFill="var(--ck-blue)"
              trackColor="var(--ck-track)"
              segments={[{ value: QUALITY_BUSINESS.qualityRate, color: 'var(--ck-blue)' }]}
            >
              <span className="flex items-baseline leading-none font-bold text-(--ck-on-solid)">
                <span className="text-[28px]">{QUALITY_BUSINESS.qualityRate}</span>
                <span className="text-[17px]">.0%</span>
              </span>
            </DonutStat>
            <span className="text-[14px] leading-none font-semibold text-(--ck-title-sub)">
              全流程业务处理质量
            </span>
          </div>

          <div className="shrink-0">
            <div className="mb-1 pr-3 text-right text-[12px] leading-none text-(--text-secondary)">
              {QUALITY_BUSINESS.unitLabel}
            </div>
            <div className="flex flex-col gap-1.5">
              {QUALITY_BUSINESS.rows.map((row) => (
                <div
                  key={row.label}
                  className="ck-card flex items-center justify-between rounded-[3px] px-3 py-2"
                >
                  <span className="text-[13px] leading-none text-(--foreground)">{row.label}</span>
                  <span className="text-[18px] leading-none font-bold text-(--ck-cyan)">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <span className="w-px shrink-0 bg-(--border-light)" />

        <div className="flex min-w-0 flex-1 flex-col">
          <SectionTitle className="mb-1">业务处理差错情况</SectionTitle>

          <div className="flex shrink-0 flex-col items-center justify-center gap-1.5 py-1">
            <DonutStat
              size={120}
              thickness={11}
              trackColor="var(--ck-track)"
              segments={[{ value: QUALITY_ERROR.ratio, color: 'var(--ck-green)' }]}
            >
              <span className="text-[30px] leading-none font-bold text-(--ck-cyan)">
                {QUALITY_ERROR.total}
              </span>
            </DonutStat>
            <span className="text-[14px] leading-none font-semibold text-(--ck-title-sub)">
              问题凭证数量
            </span>
          </div>

          <div className="ck-scroll mt-1 min-h-0 flex-1 overflow-y-auto pr-0.5">
            {QUALITY_ERROR.items.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 border-b border-(--border-light) px-2 py-[6px] last:border-b-0"
                style={
                  item.active
                    ? { background: 'color-mix(in srgb, var(--ck-blue) 20%, transparent)' }
                    : undefined
                }
              >
                {item.active ? (
                  <i
                    className="h-[9px] w-[4px] shrink-0 rounded-[1px]"
                    style={{ background: 'var(--ck-orange)' }}
                  />
                ) : (
                  <span className="w-[4px] shrink-0" />
                )}
                <span
                  className={`flex-1 truncate text-[13px] leading-none ${
                    item.active ? 'font-semibold text-(--ck-cyan)' : 'text-(--foreground)'
                  }`}
                >
                  {item.label}
                </span>
                <span
                  className={`shrink-0 leading-none tabular-nums ${
                    item.active
                      ? 'text-[18px] font-bold text-(--ck-cyan)'
                      : 'text-[14px] text-(--foreground)'
                  }`}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PanelBox>
  )
}

/* ───────────── 申诉与争议管理情况 ───────────── */

/** 下行中：申诉堆叠柱 + 解决率折线 + 通过率环形 + 数字卡 */
export function AppealPanel({ className = '' }: { className?: string }) {
  const c = useChartColors()
  const option = useMemo(() => buildAppealOption(c), [c])

  return (
    <PanelBox
      title={<DrillTitleLink title="申诉与争议管理情况" to={QUALITY_APPEAL_DRILL_PATH} />}
      className={`flex flex-col ${className}`}
    >
      <div className="flex h-full flex-col px-3.5 pt-1.5 pb-3">
        <div className="min-h-0 flex-[1.26]">
          <ReactECharts
            option={option}
            style={{ height: '100%', width: '100%' }}
            opts={{ renderer: 'canvas' }}
            notMerge
          />
        </div>

        <div className="mt-1 flex shrink-0 items-baseline gap-1.5">
          <span className="text-[14px] leading-none font-semibold text-(--ck-title-sub)">
            申诉平均处理时长
          </span>
          <span className="text-[20px] leading-none font-bold text-(--ck-orange)">
            {QUALITY_APPEAL.avgDuration}
          </span>
          <span className="text-[12px] leading-none text-(--ck-orange)">
            {QUALITY_APPEAL.avgDurationUnit}
          </span>
        </div>

        <div className="mt-2 flex min-h-0 flex-1 items-center gap-3">
          <DonutStat
            size={116}
            thickness={14}
            trackColor="var(--ck-track)"
            innerFill="var(--ck-panel-bg-strong)"
            segments={[
              { value: 100 - QUALITY_APPEAL.passRate, color: 'var(--ck-green)' },
              { value: QUALITY_APPEAL.passRate, color: 'var(--ck-blue)' },
            ]}
          >
            <span className="flex flex-col items-center leading-none">
              <span className="text-[12px] text-(--ck-title-sub)">申诉通过率</span>
              <span className="mt-1 text-[20px] font-bold text-(--ck-cyan)">
                {QUALITY_APPEAL.passRate}%
              </span>
            </span>
          </DonutStat>

          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            {QUALITY_APPEAL.cards.map((card) => (
              <div
                key={card.label}
                className="ck-card flex items-center gap-1.5 rounded-[3px] px-2 py-[7px]"
              >
                <i
                  className="h-[8px] w-[8px] shrink-0 rounded-full"
                  style={{ background: card.color }}
                />
                <span className="flex-1 truncate text-[13px] leading-none text-(--ck-title-sub)">
                  {card.label}
                </span>
                <span className="text-[18px] leading-none font-bold text-(--ck-cyan)">
                  {card.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-2 shrink-0 pl-[52px]">
          <div className="flex items-baseline justify-between">
            <span className="text-[14px] leading-none font-semibold text-(--ck-title-sub)">
              {QUALITY_APPEAL.reject.label}
            </span>
            <span className="text-[20px] leading-none font-bold text-(--ck-cyan)">
              {QUALITY_APPEAL.reject.value}
            </span>
          </div>
          <div
            className="mt-1.5 h-[7px] overflow-hidden rounded-full"
            style={{ background: 'var(--ck-track)' }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${QUALITY_APPEAL.reject.percent}%`,
                background: 'linear-gradient(90deg, var(--ck-blue), var(--ck-cyan))',
              }}
            />
          </div>
        </div>
      </div>
    </PanelBox>
  )
}

function buildAppealOption(c: Record<ChartVarName, string>) {
  return {
    backgroundColor: 'transparent',
    // 关闭入场动画：useChartColors 解析出色值后 option 会以 notMerge 重建，
    // 动画被反复打回起点会表现为「只有坐标轴、没有图形」
    animation: false,
    textStyle: { fontFamily: 'Noto Sans SC, sans-serif' },
    tooltip: { trigger: 'axis', ...tooltipSkin(c) },
    legend: {
      top: 0,
      left: 'center',
      itemWidth: 10,
      itemHeight: 10,
      itemGap: 14,
      textStyle: { color: c['--text-secondary'], fontSize: 11 },
      data: [
        { name: '已解决数量', icon: 'rect' },
        { name: '未解决数量', icon: 'rect' },
        { name: '解决率', icon: 'circle' },
      ],
    },
    grid: { left: 36, right: 34, top: 42, bottom: 22 },
    xAxis: {
      type: 'category',
      data: QUALITY_APPEAL_TREND.map((d) => d.month),
      axisLine: { lineStyle: { color: c['--ck-panel-border'] } },
      axisTick: { show: false },
      axisLabel: { color: c['--ck-axis'], fontSize: 11 },
    },
    yAxis: [
      {
        type: 'value',
        name: '总量：笔',
        nameTextStyle: { color: c['--text-tertiary'], fontSize: 10, align: 'right' },
        min: 0,
        max: 120,
        interval: 40,
        axisLabel: { color: c['--ck-axis'], fontSize: 10 },
        axisLine: { show: false },
        splitLine: { lineStyle: { color: c['--ck-grid'], type: 'dashed' as const } },
      },
      {
        type: 'value',
        name: '率：%',
        nameTextStyle: { color: c['--text-tertiary'], fontSize: 10, align: 'left' },
        min: 0,
        max: 100,
        interval: 20,
        axisLabel: { color: c['--ck-axis'], fontSize: 10 },
        axisLine: { show: false },
        splitLine: { show: false },
      },
    ],
    series: [
      {
        name: '已解决数量',
        type: 'bar',
        stack: 'appeal',
        barWidth: 16,
        data: QUALITY_APPEAL_TREND.map((d) => d.resolved),
        itemStyle: { color: verticalFill(c['--ck-green'], c['--ck-cyan']) },
      },
      {
        name: '未解决数量',
        type: 'bar',
        stack: 'appeal',
        barWidth: 16,
        data: QUALITY_APPEAL_TREND.map((d) => d.unresolved),
        itemStyle: { color: c['--ck-cyan'] },
      },
      {
        name: '解决率',
        type: 'line',
        yAxisIndex: 1,
        symbol: 'circle',
        symbolSize: 7,
        data: QUALITY_APPEAL_TREND.map((d) => d.rate),
        lineStyle: { color: c['--ck-purple'], width: 2 },
        itemStyle: {
          color: c['--ck-panel-bg-strong'],
          borderColor: c['--ck-purple'],
          borderWidth: 3,
        },
      },
    ],
  }
}

/* ───────────── 整改与规则转化情况 ───────────── */

/** 下行右：整改数量 + 问题整改及时率 + 规则转化率 */
export function RectifyPanel({ className = '' }: { className?: string }) {
  return (
    <PanelBox
      title={<DrillTitleLink title="整改与规则转化情况" to={QUALITY_RECTIFY_DRILL_PATH} />}
      className={`flex flex-col ${className}`}
    >
      <div className="flex h-full flex-col px-4 pt-2.5 pb-3.5">
        <div className="flex flex-1 items-center gap-2">
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            {QUALITY_RECTIFY.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1">
                <span className="flex items-start gap-1.5">
                  <i
                    className="mt-[5px] h-[8px] w-[8px] shrink-0 rounded-full"
                    style={{ background: stat.color }}
                  />
                  <span className="text-[13px] leading-[1.35] text-(--ck-title-sub)">
                    {stat.label}
                  </span>
                </span>
                <span className="ck-glow-num pl-[14px] text-[26px] leading-none font-bold text-(--ck-cyan)">
                  {stat.value}
                </span>
              </div>
            ))}
          </div>

          <DonutStat
            size={122}
            thickness={16}
            halo
            trackColor="var(--ck-track)"
            innerFill="var(--ck-panel-bg-strong)"
            segments={[
              { value: QUALITY_RECTIFY.timelyRate, color: 'var(--ck-blue)' },
              { value: 100 - QUALITY_RECTIFY.timelyRate, color: 'var(--ck-orange)' },
            ]}
          >
            <span className="flex flex-col items-center leading-tight">
              <span className="text-[12px] text-(--ck-title-sub)">问题整改</span>
              <span className="text-[12px] text-(--ck-title-sub)">及时率</span>
              <span className="mt-0.5 text-[20px] leading-none font-bold text-(--ck-cyan)">
                {QUALITY_RECTIFY.timelyRate}.0%
              </span>
            </span>
          </DonutStat>
        </div>

        <span className="my-2 h-px shrink-0 bg-(--border-light)" />

        <div className="flex flex-1 items-center gap-2">
          <div className="flex min-w-0 flex-1 flex-col gap-2.5">
            <SectionTitle>规则转化率</SectionTitle>
            <span className="ck-glow-num text-[30px] leading-none font-bold text-(--ck-cyan)">
              {QUALITY_RECTIFY.convertRate}%
            </span>
          </div>

          <div className="relative flex h-[104px] w-[104px] shrink-0 items-center justify-center">
            <span
              className="absolute inset-0 rounded-full border"
              style={{ borderColor: 'color-mix(in srgb, var(--ck-cyan) 35%, transparent)' }}
            />
            <span
              className="absolute inset-[7px] rounded-full border-2"
              style={{ borderColor: 'color-mix(in srgb, var(--ck-cyan) 70%, transparent)' }}
            />
            <span
              className="absolute inset-[11px] rounded-full"
              style={{
                background: 'radial-gradient(circle at 50% 35%, var(--ck-teal), var(--ck-green))',
                boxShadow: 'var(--ck-card-shadow)',
              }}
            />
            <span className="relative text-[15px] leading-none font-semibold text-(--ck-on-solid)">
              {QUALITY_RECTIFY.buttonLabel}
            </span>
          </div>
        </div>
      </div>
    </PanelBox>
  )
}
