import type { ArchiveTone } from './archiveData'

/**
 * 档案页的色调表：圆环渐变的两端 + 数字／色点用的实色。
 *
 * 只取主题根上已有的 `--ck-*` 变量，不新增 CSS，换肤时跟着主题走。
 * 注意这些值只用于 DOM / SVG；ECharts 取色必须走 `useChartColors()`，
 * canvas 解析不了 `var()`。
 *
 * 单独放一个 `.ts` 文件而不是跟组件同文件：组件文件只导出组件，
 * 否则 react-refresh 规则会报「Fast refresh only works when a file only exports components」。
 */
export const ARCHIVE_TONE: Record<ArchiveTone, { from: string; to: string; solid: string }> = {
  blue: { from: 'var(--ck-blue)', to: 'var(--ck-cyan)', solid: 'var(--ck-cyan)' },
  cyan: { from: 'var(--ck-teal)', to: 'var(--ck-cyan)', solid: 'var(--ck-cyan)' },
  green: { from: 'var(--ck-teal)', to: 'var(--ck-green)', solid: 'var(--ck-green)' },
  orange: { from: 'var(--ck-yellow)', to: 'var(--ck-orange)', solid: 'var(--ck-orange)' },
  yellow: { from: 'var(--ck-orange)', to: 'var(--ck-yellow)', solid: 'var(--ck-yellow)' },
  red: { from: 'var(--ck-yellow)', to: 'var(--ck-red)', solid: 'var(--ck-red)' },
}

/** 取某个色调的实色，用于数字、色点、图标底座 */
export function toneSolid(tone: ArchiveTone) {
  return ARCHIVE_TONE[tone].solid
}
