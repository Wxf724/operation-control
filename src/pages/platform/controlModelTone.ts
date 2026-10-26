import type { ModelTone } from './types'

/** 模型结果取值的语义色 → 主题变量名。DOM 里直接用 `var()`，无需经 `useChartColors()`。 */
export const TONE_VAR: Record<ModelTone, string> = {
  default: '--foreground',
  red: '--ck-red',
  green: '--ck-green',
  orange: '--ck-orange',
  cyan: '--ck-cyan',
  blue: '--ck-blue',
}
