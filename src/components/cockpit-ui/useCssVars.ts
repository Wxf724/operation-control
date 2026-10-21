import { useLayoutEffect, useMemo, useState } from 'react'

/**
 * 读取当前主题作用域下的 CSS 变量真实值。
 *
 * ECharts canvas 渲染无法解析 `var(--x)`，但颜色又必须只定义在主题文件里，
 * 所以这里在挂载后把变量解析成具体色值再交给图表。
 *
 * @param names 变量名数组，含 `--` 前缀
 * @param scopeSelector 在哪个元素上取计算样式，默认匹配任一主题根
 */
export function useCssVars<T extends string>(
  names: readonly T[],
  scopeSelector = '.theme-cockpit, .theme-cloud-light, .theme-lavender, .theme-aqua-light'
): Partial<Record<T, string>> {
  const [vars, setVars] = useState<Partial<Record<T, string>>>({})

  useLayoutEffect(() => {
    const scope = document.querySelector(scopeSelector) ?? document.documentElement
    const computed = getComputedStyle(scope)
    const next = {} as Partial<Record<T, string>>

    for (const name of names) {
      const value = computed.getPropertyValue(name).trim()
      if (value) next[name] = value
    }

    setVars(next)
    // names 为模块级常量数组，引用稳定
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scopeSelector])

  return vars
}

/** 大屏图表常用的一组变量 */
export const CHART_VAR_NAMES = [
  '--ck-cyan',
  '--ck-teal',
  '--ck-blue',
  '--ck-green',
  '--ck-orange',
  '--ck-red',
  '--ck-purple',
  '--ck-yellow',
  '--ck-grid',
  '--ck-axis',
  '--foreground',
  '--text-secondary',
  '--text-tertiary',
  '--ck-panel-bg-strong',
  '--ck-panel-border',
  '--ck-track',
  '--ck-tooltip-bg',
  '--ck-tooltip-text',
  '--ck-map-area',
  '--ck-map-border',
  '--ck-map-emphasis',
  '--ck-map-world-area',
  '--ck-map-world-border',
] as const

export type ChartVarName = (typeof CHART_VAR_NAMES)[number]

/**
 * 取图表配色，未解析时回退到透明，避免 ECharts 收到 undefined。
 *
 * 返回值用 `useMemo` 固定引用：调用方普遍写成
 * `useMemo(() => buildOption(c), [c])` 配合 `notMerge`，
 * 如果每次渲染都返回新对象，option 会被反复重建并重新 setOption，
 * 图表的入场动画会一直被打回起点，表现为只有坐标轴、没有图形。
 */
export function useChartColors(): Record<ChartVarName, string> {
  const vars = useCssVars(CHART_VAR_NAMES)

  return useMemo(() => {
    const out = {} as Record<ChartVarName, string>
    for (const name of CHART_VAR_NAMES) out[name] = vars[name] ?? 'transparent'
    return out
  }, [vars])
}
