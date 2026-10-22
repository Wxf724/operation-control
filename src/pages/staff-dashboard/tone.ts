/** 语义色 → 主题变量名。图表里要先经 `useChartColors()` 解析，DOM 里可直接用 `var()`。 */
export const TONE_VAR: Record<string, string> = {
  cyan: '--ck-cyan',
  blue: '--ck-blue',
  green: '--ck-green',
  orange: '--ck-orange',
  red: '--ck-red',
  purple: '--ck-purple',
  muted: '--text-tertiary',
}
