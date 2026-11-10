/** 持续运转的外围刻度与扫描弧，中心数字和数据环保持稳定。 */
export function OrbitAccent({ size, radius, color = 'var(--ck-cyan)' }: {
  size: number
  radius: number
  color?: string
}) {
  return (
    <g fill="none" stroke={color} pointerEvents="none" aria-hidden>
      <circle
        className="ck-orbit-track"
        cx={size / 2}
        cy={size / 2}
        r={radius - 0.5}
        pathLength={100}
        strokeWidth={1.5}
        strokeOpacity={0.35}
        strokeDasharray="3 4"
      />
      <circle
        className="ck-orbit-accent"
        cx={size / 2}
        cy={size / 2}
        r={radius - 0.5}
        pathLength={100}
        strokeWidth={2}
        strokeOpacity={0.9}
        strokeLinecap="round"
        strokeDasharray="18 82"
      />
    </g>
  )
}
