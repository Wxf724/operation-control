import type { FlowTone } from '../types'

/** 色带与文字用的主题变量名 */
const TONE_VAR: Record<FlowTone, string> = {
  green: '--ck-green',
  yellow: '--ck-yellow',
  red: '--ck-red',
}

/** 完成率换算档位：≥85 绿、75~84 黄、<75 红（对齐线上口径） */
export function toneOf(rate: number): FlowTone {
  if (rate >= 85) return 'green'
  if (rate >= 75) return 'yellow'
  return 'red'
}

/** 完成率 → 可直接写进 style 的颜色表达式 */
export function toneVar(rate: number) {
  return `var(${TONE_VAR[toneOf(rate)]})`
}

/**
 * 流程板几何常量。
 *
 * 大屏是固定画布（2400×1080），流程板用绝对定位排布，
 * 掉头色带要精确接到上下两条色带的边缘，所以这里集中写死像素值。
 * 画布高度变化时只改这一处即可。
 */
export const FLOW_GEOMETRY = {
  /** 掉头色带的横向宽度 */
  arcWidth: 130,
  /** 色带厚度 */
  bandHeight: 18,
  /** 三条主线的「文字块顶部 y」与「色带顶部 y」（色带紧跟文字块，间距 76） */
  rows: [
    { textY: 16, bandY: 92 },
    { textY: 416, bandY: 492 },
    { textY: 816, bandY: 892 },
  ],
  /** 右侧掉头区（08、09）与左侧掉头区（15、16）节点的顶部 y */
  turnRightTop: 150,
  turnLeftTop: 550,
  /** 转折区节点卡宽度 */
  turnNodeWidth: 340,
} as const

/** React 19 的 `useId()` 形如 `«r0»`，去掉非字母数字再拼 SVG 渐变 id */
export function svgId(raw: string) {
  return raw.replace(/[^a-zA-Z0-9]/g, '')
}

/** 两位编号：02、10 */
export function pad2(value: number) {
  return String(value).padStart(2, '0')
}
