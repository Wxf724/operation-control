import type { ChartVarName } from '@/components/cockpit-ui'

import { ARCHIVE_MAIL_TREND, ARCHIVE_PROBLEM_TREND } from './archiveData'

/* ═══════════ 档案业务管理平台的 ECharts 配置（浅蓝白） ═══════════ */

const FONT = { fontFamily: 'Noto Sans SC, sans-serif' }

type Colors = Record<ChartVarName, string>

/**
 * 关掉入场动画。
 *
 * `useChartColors()` 挂载后才解析出真实色值，option 因此会被重建并以 notMerge 重新 setOption；
 * 面板用 flex-1 定高时容器尺寸回调又会再触发一次渲染，动画被反复打回起点，
 * 表现为「只有坐标轴、没有柱子也没有折线」。大屏常驻展示，直接静态出图最稳。
 */
const ANIMATION = false

/**
 * 把主题变量解析出的颜色转成带透明度的 rgba。
 *
 * canvas 解析不了 `var()` 和 `color-mix()`，把它们塞进 colorStops 会让整条序列画不出来；
 * 解析失败时宁可退回一个 ECharts 一定认得的中性蓝。
 */
function alpha(color: string, a: number) {
  const raw = (color || '').trim()

  const hex = /^#([0-9a-f]{3,8})$/i.exec(raw)
  if (hex) {
    const body = hex[1]
    const short = body.length === 3 || body.length === 4
    const full = short ? expandShortHex(body.slice(0, 3)) : body.slice(0, 6)
    if (full.length === 6) {
      const n = Number.parseInt(full, 16)
      return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`
    }
  }

  const rgb = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i.exec(raw)
  if (rgb) {
    const [r, g, b] = [rgb[1], rgb[2], rgb[3]].map((v) => Math.round(Number(v)))
    return `rgba(${r}, ${g}, ${b}, ${a})`
  }

  return `rgba(42, 102, 232, ${a})`
}

function expandShortHex(body: string) {
  let out = ''
  for (const ch of body) out += ch + ch
  return out
}

function vGradient(from: string, to: string) {
  return {
    type: 'linear' as const,
    x: 0,
    y: 0,
    x2: 0,
    y2: 1,
    colorStops: [
      { offset: 0, color: from },
      { offset: 1, color: to },
    ],
  }
}

function tooltip(c: Colors) {
  return {
    trigger: 'axis' as const,
    backgroundColor: c['--ck-panel-bg-strong'],
    borderColor: c['--ck-panel-border'],
    borderWidth: 1,
    textStyle: { color: c['--foreground'], fontSize: 13 },
    extraCssText: 'box-shadow: 0 6px 18px rgba(42,102,232,0.16); border-radius: 8px;',
  }
}

function catAxis(c: Colors, data: string[]) {
  return {
    type: 'category' as const,
    data,
    axisLine: { lineStyle: { color: c['--ck-panel-border'] } },
    axisTick: { show: false },
    axisLabel: { color: c['--ck-axis'], fontSize: 12, interval: 0, margin: 8 },
  }
}

function valAxis(
  c: Colors,
  opts: { name?: string; min?: number; max?: number; interval?: number }
) {
  return {
    type: 'value' as const,
    name: opts.name,
    // 轴名贴在纵轴顶端，左对齐才不会被卡片内边距裁掉半个「单位：」
    nameTextStyle: { color: c['--text-tertiary'], fontSize: 11, align: 'left' as const },
    nameGap: 10,
    min: opts.min ?? 0,
    max: opts.max,
    interval: opts.interval,
    axisLabel: { color: c['--ck-axis'], fontSize: 11, margin: 6 },
    axisLine: { show: false },
    axisTick: { show: false },
    splitLine: { lineStyle: { color: c['--ck-grid'], type: 'dashed' as const } },
  }
}

/** 档案邮寄率折线（带百分比数值标签） */
export function buildMailTrendOption(c: Colors) {
  return {
    animation: ANIMATION,
    backgroundColor: 'transparent',
    textStyle: FONT,
    tooltip: tooltip(c),
    legend: {
      data: ['档案邮寄率'],
      top: 0,
      right: 4,
      itemWidth: 10,
      itemHeight: 10,
      icon: 'circle',
      textStyle: { color: c['--text-secondary'], fontSize: 12 },
    },
    grid: { left: 2, right: 16, top: 34, bottom: 0, containLabel: true },
    xAxis: {
      ...catAxis(
        c,
        ARCHIVE_MAIL_TREND.map((d) => d.month)
      ),
      boundaryGap: false,
    },
    yAxis: valAxis(c, { name: '率：%', min: 70, max: 100, interval: 5 }),
    series: [
      {
        name: '档案邮寄率',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 7,
        data: ARCHIVE_MAIL_TREND.map((d) => d.rate),
        label: {
          show: true,
          position: 'top' as const,
          color: c['--ck-axis'],
          fontSize: 12,
          formatter: '{c}%',
        },
        lineStyle: { color: c['--ck-cyan'], width: 2.6 },
        itemStyle: { color: c['--ck-cyan'] },
        areaStyle: { color: vGradient(alpha(c['--ck-blue'], 0.34), alpha(c['--ck-cyan'], 0.02)) },
      },
    ],
  }
}

/** 问题档案处理情况柱图（三个页签共用同一张图） */
export function buildProblemOption(c: Colors) {
  return {
    animation: ANIMATION,
    backgroundColor: 'transparent',
    textStyle: FONT,
    tooltip: tooltip(c),
    grid: { left: 2, right: 14, top: 30, bottom: 0, containLabel: true },
    xAxis: catAxis(
      c,
      ARCHIVE_PROBLEM_TREND.map((d) => d.month)
    ),
    yAxis: valAxis(c, { name: '单位：份', max: 80, interval: 20 }),
    series: [
      {
        type: 'bar',
        barWidth: 22,
        data: ARCHIVE_PROBLEM_TREND.map((d) => d.value),
        label: { show: true, position: 'top' as const, color: c['--ck-axis'], fontSize: 12 },
        itemStyle: {
          borderRadius: [3, 3, 0, 0] as [number, number, number, number],
          color: vGradient(alpha(c['--ck-cyan'], 1), alpha(c['--ck-cyan'], 0.58)),
        },
      },
    ],
  }
}
