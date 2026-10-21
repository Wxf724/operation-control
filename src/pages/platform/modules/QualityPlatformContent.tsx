import ReactECharts from 'echarts-for-react'
import { useMemo, useState } from 'react'

import { PanelBox, useChartColors } from '@/components/cockpit-ui'

import type { ChartVarName } from '@/components/cockpit-ui'

import { AppealPanel, BusinessQualityPanel, RectifyPanel } from './QualityBottomPanels'
import { QUALITY_EFFICIENCY_TABS, QUALITY_SAMPLING_TABS } from './qualityData'
import { softColor, tooltipSkin, verticalFill } from './qualityChartTheme'
import { TabGroup } from './qualityWidgets'

/** 质量管理平台的中间业务区（对应 `_refs/live/15-质量管理平台.png`） */
export function QualityPlatformContent() {
  return (
    <div className="flex min-h-0 flex-1 gap-2.5">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-2.5">
        <div className="flex h-[338px] shrink-0 gap-2.5">
          <SamplingPanel className="w-[760px] shrink-0" />
          <EfficiencyPanel className="min-w-0 flex-1" />
        </div>

        <div className="flex min-h-0 flex-1 gap-2.5">
          <BusinessQualityPanel className="w-[760px] shrink-0" />
          <AppealPanel className="w-[420px] shrink-0" />
          <RectifyPanel className="min-w-0 flex-1" />
        </div>
      </div>
    </div>
  )
}

/* ───────────── 稽核覆盖与抽样情况 ───────────── */

function SamplingPanel({ className = '' }: { className?: string }) {
  const c = useChartColors()
  const [tab, setTab] = useState(0)
  const option = useMemo(() => buildSamplingOption(c, tab), [c, tab])

  return (
    <PanelBox
      title="稽核覆盖与抽样情况"
      className={`flex flex-col ${className}`}
      extra={
        <TabGroup
          labels={QUALITY_SAMPLING_TABS.map((t) => t.label)}
          active={tab}
          onChange={setTab}
        />
      }
    >
      <div className="h-full px-2 pt-1 pb-2">
        <ReactECharts
          option={option}
          style={{ height: '100%', width: '100%' }}
          opts={{ renderer: 'canvas' }}
          notMerge
        />
      </div>
    </PanelBox>
  )
}

function buildSamplingOption(c: Record<ChartVarName, string>, tab: number) {
  const rows = (QUALITY_SAMPLING_TABS[tab] ?? QUALITY_SAMPLING_TABS[0]).data

  return {
    // 关闭入场动画：useChartColors 解析出色值后 option 会以 notMerge 重建，
    // 容器尺寸回调再触发一次，动画被反复打回起点会表现为「只有坐标轴、没有图形」
    animation: false,
    backgroundColor: 'transparent',
    textStyle: { fontFamily: 'Noto Sans SC, sans-serif' },
    tooltip: { trigger: 'axis', ...tooltipSkin(c) },
    legend: {
      top: 2,
      left: 'center',
      itemWidth: 10,
      itemHeight: 10,
      itemGap: 24,
      textStyle: { color: c['--text-secondary'], fontSize: 12 },
      data: [
        { name: '抽样总量', icon: 'rect' },
        { name: '抽样比率', icon: 'roundRect' },
      ],
    },
    grid: { left: 54, right: 44, top: 44, bottom: 26 },
    xAxis: {
      type: 'category',
      data: rows.map((d) => d.month),
      axisLine: { lineStyle: { color: c['--ck-panel-border'] } },
      axisTick: { show: false },
      axisLabel: { color: c['--ck-axis'], fontSize: 12 },
    },
    yAxis: [
      {
        type: 'value',
        name: '总量：笔',
        nameTextStyle: { color: c['--text-tertiary'], fontSize: 11, align: 'right' },
        min: 0,
        max: 25000,
        interval: 5000,
        axisLabel: { color: c['--ck-axis'], fontSize: 11 },
        axisLine: { show: false },
        splitLine: { lineStyle: { color: c['--ck-grid'], type: 'dashed' as const } },
      },
      {
        type: 'value',
        name: '率：%',
        nameTextStyle: { color: c['--text-tertiary'], fontSize: 11, align: 'left' },
        min: 0,
        max: 100,
        interval: 20,
        axisLabel: { color: c['--ck-axis'], fontSize: 11 },
        axisLine: { show: false },
        splitLine: { show: false },
      },
    ],
    series: [
      {
        name: '抽样总量',
        type: 'bar',
        barWidth: 22,
        data: rows.map((d) => d.total),
        itemStyle: { color: verticalFill(c['--ck-cyan'], c['--ck-blue']) },
      },
      {
        name: '抽样比率',
        type: 'line',
        symbol: 'circle',
        symbolSize: 8,
        yAxisIndex: 1,
        data: rows.map((d) => d.rate),
        lineStyle: { color: c['--ck-green'], width: 2 },
        itemStyle: {
          color: c['--ck-green'],
          borderColor: c['--ck-panel-bg-strong'],
          borderWidth: 2,
        },
      },
    ],
  }
}

/* ───────────── 稽核过程与效率情况 ───────────── */

function EfficiencyPanel({ className = '' }: { className?: string }) {
  const c = useChartColors()
  const [tab, setTab] = useState(0)
  const option = useMemo(() => buildEfficiencyOption(c, tab), [c, tab])

  return (
    <PanelBox
      title="稽核过程与效率情况"
      className={`flex flex-col ${className}`}
      extra={
        <TabGroup
          labels={QUALITY_EFFICIENCY_TABS.map((t) => t.label)}
          active={tab}
          onChange={setTab}
        />
      }
    >
      <div className="h-full px-2 pt-1 pb-2">
        <ReactECharts
          option={option}
          style={{ height: '100%', width: '100%' }}
          opts={{ renderer: 'canvas' }}
          notMerge
        />
      </div>
    </PanelBox>
  )
}

function buildEfficiencyOption(c: Record<ChartVarName, string>, tab: number) {
  const cfg = QUALITY_EFFICIENCY_TABS[tab] ?? QUALITY_EFFICIENCY_TABS[0]

  return {
    // 关闭入场动画：useChartColors 解析出色值后 option 会以 notMerge 重建，
    // 容器尺寸回调再触发一次，动画被反复打回起点会表现为「只有坐标轴、没有图形」
    animation: false,
    backgroundColor: 'transparent',
    textStyle: { fontFamily: 'Noto Sans SC, sans-serif' },
    tooltip: { trigger: 'axis', ...tooltipSkin(c) },
    grid: { left: 54, right: 24, top: 46, bottom: 26 },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: cfg.data.map((d) => d.month),
      axisLine: { lineStyle: { color: c['--ck-panel-border'] } },
      axisTick: { show: false },
      axisLabel: { color: c['--ck-axis'], fontSize: 12 },
    },
    yAxis: {
      type: 'value',
      name: cfg.unit,
      nameTextStyle: { color: c['--text-tertiary'], fontSize: 11, align: 'right' },
      min: 0,
      max: cfg.max,
      interval: cfg.interval,
      axisLabel: { color: c['--ck-axis'], fontSize: 11 },
      axisLine: { show: false },
      splitLine: { lineStyle: { color: c['--ck-grid'], type: 'dashed' as const } },
    },
    series: [
      {
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        data: cfg.data.map((d) => d.value),
        label: {
          show: true,
          position: 'top',
          distance: 10,
          color: c['--ck-axis'],
          fontSize: 14,
          fontWeight: 'bold' as const,
        },
        lineStyle: { color: c['--ck-cyan'], width: 2 },
        itemStyle: { color: c['--ck-cyan'] },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: softColor(c['--ck-cyan'], 0.36) },
              { offset: 1, color: softColor(c['--ck-blue'], 0.02) },
            ],
          },
        },
      },
    ],
  }
}
