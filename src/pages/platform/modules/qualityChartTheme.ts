/** 质量管理平台图表的公共皮肤与渐变工具 */

/**
 * ECharts 提示框的统一皮肤：白卡片 + 柔和蓝投影，跟浅蓝白主题一致。
 *
 * 取色经调用方的 `useChartColors()` 传入——canvas 解析不了 `var()`。
 */
export function tooltipSkin(c: Record<string, string>) {
  return {
    backgroundColor: c['--ck-panel-bg-strong'],
    borderColor: c['--ck-panel-border'],
    borderWidth: 1,
    textStyle: { color: c['--foreground'], fontSize: 12 },
    extraCssText: 'box-shadow: 0 6px 18px rgba(42,102,232,0.16); border-radius: 8px;',
  }
}

/** 竖向渐变填充，用于柱体 */
export function verticalFill(from: string, to: string) {
  return {
    type: 'linear',
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

/**
 * 把色值掺入透明度，供 ECharts 面积渐变使用。
 *
 * 不能用 `color-mix()`：canvas 渲染只认具体色值，
 * 非法色串会让整个图形画不出来，所以这里自己把 `#rrggbb` 转成 rgba。
 */
export function softColor(color: string, alpha: number) {
  const raw = (color || '').trim()

  const hex = /^#([0-9a-f]{3})([0-9a-f]{3})?$/i.exec(raw)
  if (hex) {
    const body = hex[2] ? hex[1] + hex[2] : [...hex[1]].map((ch) => ch + ch).join('')
    const n = Number.parseInt(body, 16)
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`
  }

  const rgb = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i.exec(raw)
  if (rgb) {
    const [r, g, b] = [rgb[1], rgb[2], rgb[3]].map((v) => Math.round(Number(v)))
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  return `rgba(42, 102, 232, ${alpha})`
}
