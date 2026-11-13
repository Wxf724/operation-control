import type { ChartVarName } from '@/components/cockpit-ui'
import { RISK_MONTHLY } from '@/mocks/riskDashboard'

type Colors = Record<ChartVarName, string>

export function riskDistributionChart(items: { name: string; value: number }[], c: Colors) {
  return {
    animation: false,
    color: [c['--ck-blue'], c['--ck-green'], c['--ck-purple']],
    tooltip: { trigger: 'item', formatter: '{b}：{c}（{d}%）' },
    series: [
      {
        type: 'pie',
        radius: ['50%', '71%'],
        center: ['50%', '50%'],
        itemStyle: {
          borderWidth: 1,
          borderColor: '#153358',
          shadowColor: '#0a3865',
          shadowBlur: 6,
        },
        label: { show: false },
        emphasis: { scaleSize: 4 },
        data: items.map((item, i) => ({
          ...item,
          itemStyle: {
            color: {
              type: 'radial',
              x: 0.5,
              y: 0.5,
              r: 0.55,
              colorStops: [
                { offset: 0.68, color: ['#0e639a', '#0f7146', '#66558c'][i] },
                { offset: 1, color: [c['--ck-blue'], '#149b43', '#9c7bcb'][i] },
              ],
            },
          },
        })),
      },
    ],
    graphic: [
      {
        type: 'text',
        left: 'center',
        top: '41%',
        style: { text: '17,412', fill: c['--foreground'], font: 'bold 18px sans-serif' },
      },
      {
        type: 'text',
        left: 'center',
        top: '58%',
        style: { text: '风险总数', fill: c['--text-secondary'], font: '11px sans-serif' },
      },
    ],
  }
}

export function riskMonthlyChart(c: Colors) {
  return {
    animation: false,
    color: [c['--ck-blue'], c['--ck-orange'], c['--ck-green']],
    tooltip: { trigger: 'axis' },
    legend: {
      top: 0,
      itemWidth: 10,
      itemHeight: 8,
      textStyle: { color: c['--text-secondary'], fontSize: 10 },
    },
    grid: { left: 32, right: 32, top: 24, bottom: 27 },
    xAxis: {
      type: 'category',
      data: RISK_MONTHLY.months,
      axisLabel: { color: c['--ck-axis'], fontSize: 10 },
      axisTick: { show: false },
      axisLine: { lineStyle: { color: c['--ck-grid'] } },
    },
    yAxis: [
      {
        type: 'value',
        name: '单位：笔',
        max: 3500,
        interval: 500,
        axisLabel: { color: c['--ck-axis'], fontSize: 10, margin: 4, formatter: '{value}' },
        nameGap: 8,
        nameTextStyle: { color: c['--text-secondary'], fontSize: 10 },
        splitLine: { lineStyle: { color: c['--ck-grid'], type: 'dashed' } },
      },
      {
        type: 'value',
        name: '单位：%',
        min: 80,
        max: 100,
        interval: 5,
        axisLabel: { color: c['--ck-axis'], fontSize: 10, margin: 4, formatter: '{value}' },
        nameGap: 8,
        nameTextStyle: { color: c['--text-secondary'], fontSize: 10 },
        splitLine: { show: false },
      },
    ],
    series: [
      {
        name: '查改完成数',
        type: 'bar',
        z: 3,
        barWidth: 8,
        data: RISK_MONTHLY.completed,
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: c['--ck-cyan'] },
              { offset: 1, color: c['--ck-blue'] },
            ],
          },
        },
      },
      {
        name: '识别问题数',
        type: 'bar',
        barWidth: 9,
        barGap: '-100%',
        data: RISK_MONTHLY.found,
        itemStyle: {
          color: 'rgba(246, 164, 46, 0.18)',
          borderColor: c['--ck-orange'],
          borderWidth: 1,
        },
      },
      {
        name: '查改完成率',
        type: 'line',
        yAxisIndex: 1,
        data: RISK_MONTHLY.rates,
        symbol: 'circle',
        symbolSize: 4,
        itemStyle: { color: c['--ck-green'] },
        lineStyle: { width: 1.5, color: c['--ck-green'] },
      },
    ],
  }
}
