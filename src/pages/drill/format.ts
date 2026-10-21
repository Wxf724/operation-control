/** 千分位整数，如 1243058 → 1,243,058 */
export function formatCount(value: number): string {
  return value.toLocaleString('en-US')
}

/** 同比：(本期 - 同期) / 同期，保留两位小数的百分比 */
export function formatYoY(value: number, prior: number): string {
  if (!prior) return '—'
  return `${(((value - prior) / prior) * 100).toFixed(2)}%`
}

/** 百分比文本，如 0.1432 → 0.14% */
export function formatPercent(value: number, digits = 2): string {
  return `${value.toFixed(digits)}%`
}
