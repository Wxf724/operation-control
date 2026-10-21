import ReactECharts from 'echarts-for-react'
import { useMemo } from 'react'

import { PanelBox, useChartColors } from '@/components/cockpit-ui'
import type { ChartVarName } from '@/components/cockpit-ui'

import { PEAK_FORECAST, TREND_DATA } from '../constants'

/** 左栏第三块：近 10 日运行趋势（三柱 + 完成率折线，双 Y 轴） */
export function TrendPanel({ className = '' }: { className?: string }) {
  const c = useChartColors()
  const option = useMemo(() => buildTrendOption(c), [c])

  return (
    <PanelBox
      title="近10日运行趋势"
      className={`flex flex-col ${className}`}
      extra={
        <div className="flex items-center gap-4 text-[12px] leading-none">
          <ForecastItem label={PEAK_FORECAST.dateLabel} value={PEAK_FORECAST.date} />
          <ForecastItem label={PEAK_FORECAST.totalLabel} value={PEAK_FORECAST.total} />
        </div>
      }
    >
      <div className="h-full w-full px-1 pt-1 pb-1">
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

function ForecastItem({ label, value }: { label: string; value: string }) {
  return (
    <span className="whitespace-nowrap">
      <span className="text-(--text-tertiary)">{label}：</span>
      <span className="font-semibold text-(--ck-orange)">{value}</span>
    </span>
  )
}

function buildTrendOption(c: Record<ChartVarName, string>) {
  const axisLabel = { color: c['--ck-axis'], fontSize: 11 }
  const splitLine = { lineStyle: { color: c['--ck-grid'], type: 'dashed' as const } }

  const barBase = {
    type: 'bar' as const,
    barWidth: 7,
    barGap: '40%',
    itemStyle: { borderRadius: [2, 2, 0, 0] as [number, number, number, number] },
  }

  return {
    backgroundColor: 'transparent',
    // 关闭入场动画：useChartColors 解析出色值后 option 会以 notMerge 重建，
    // 动画被反复打回起点会表现为「只有坐标轴、没有图形」
    animation: false,
    textStyle: { fontFamily: 'Noto Sans SC, sans-serif' },
    tooltip: {
      trigger: 'axis',
      backgroundColor: c['--ck-tooltip-bg'],
      borderWidth: 0,
      textStyle: { color: c['--ck-tooltip-text'], fontSize: 12 },
      axisPointer: { type: 'shadow', shadowStyle: { color: c['--ck-grid'] } },
    },
    legend: {
      top: 2,
      right: 8,
      itemWidth: 10,
      itemHeight: 10,
      itemGap: 14,
      textStyle: { color: c['--text-secondary'], fontSize: 11 },
      data: ['单据接收量', '待处理单据量', '单据完成量', '单据完成率'],
    },
    grid: { left: 46, right: 44, top: 38, bottom: 24 },
    xAxis: {
      type: 'category',
      data: TREND_DATA.map((d) => d.date),
      axisLine: { lineStyle: { color: c['--ck-axis'] } },
      axisTick: { show: false },
      axisLabel,
    },
    yAxis: [
      {
        type: 'value',
        name: '单位：笔',
        nameTextStyle: { color: c['--text-tertiary'], fontSize: 11 },
        min: 0,
        max: 2000,
        interval: 500,
        axisLabel,
        axisLine: { show: false },
        splitLine,
      },
      {
        type: 'value',
        name: '单位：%',
        nameTextStyle: { color: c['--text-tertiary'], fontSize: 11 },
        min: 0,
        max: 100,
        interval: 20,
        axisLabel,
        axisLine: { show: false },
        splitLine: { show: false },
      },
    ],
    series: [
      {
        ...barBase,
        name: '单据接收量',
        data: TREND_DATA.map((d) => d.received),
        itemStyle: { ...barBase.itemStyle, color: c['--ck-cyan'] },
      },
      {
        ...barBase,
        name: '待处理单据量',
        data: TREND_DATA.map((d) => d.pending),
        itemStyle: { ...barBase.itemStyle, color: c['--ck-purple'] },
      },
      {
        ...barBase,
        name: '单据完成量',
        data: TREND_DATA.map((d) => d.finished),
        itemStyle: { ...barBase.itemStyle, color: c['--ck-blue'] },
      },
      {
        name: '单据完成率',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        data: TREND_DATA.map((d) => d.rate),
        lineStyle: { color: c['--ck-green'], width: 2 },
        itemStyle: { color: c['--ck-green'] },
      },
    ],
  }
}
