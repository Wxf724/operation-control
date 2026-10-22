import { useId } from 'react'

import { FACTOR_CENTER, FACTOR_GRAPH_TITLE, FACTOR_LEGEND, FACTOR_NODES } from '../constants'
import type { FactorNode, FactorTone } from '../types'

import { AiPanel } from './AiPanel'

/*
  放射状关系图整幅手写内联 SVG：
  节点位置由 constants 里的极坐标 (angle, radius) 按椭圆展开，连线、箭头、
  立方体都在同一套 viewBox 坐标里算，缩放交给 `preserveAspectRatio`。
  （ECharts 的 graph 布局没法精确复刻参考稿这种疏密不均的环，所以不用它。）
*/

/** 画布与环的几何参数，单位是 viewBox 坐标 */
const VB = { w: 880, h: 392 }
const CENTER = { x: 420, y: 198 }
const RING = { x: 350, y: 140 }

/** 中心菱形的半宽／半高 */
const DIAMOND = { x: 108, y: 44 }

/** 立方体：半宽、顶面半深、侧面高 */
const CUBE = { w: 16, t: 8, h: 15 }

/** 立方体整体的视觉半高：上顶点 -t、下顶点 t+h，中点即 h/2 */
const CUBE_SHIFT = CUBE.h / 2

/** 标签基线相对节点中心的下移量 */
const LABEL_DY = 30

/** 因子类型 → 主题色变量 */
const TONE_VAR: Record<FactorTone, string> = {
  major: '--ck-red',
  minor: '--ck-orange',
  none: '--ck-blue',
}

/** 立方体三个面的明暗：顶面提白、左面本色、右面压暗 */
function faceFills(tone: FactorTone) {
  const c = `var(${TONE_VAR[tone]})`
  return {
    top: `color-mix(in srgb, ${c} 42%, var(--surface))`,
    left: `color-mix(in srgb, ${c} 88%, var(--surface))`,
    right: `color-mix(in srgb, ${c} 78%, var(--foreground))`,
  }
}

function nodePos(node: FactorNode) {
  const a = (node.angle * Math.PI) / 180
  return {
    x: CENTER.x + RING.x * node.radius * Math.cos(a),
    y: CENTER.y + RING.y * node.radius * Math.sin(a),
  }
}

/** 第三栏上块：模型一因子评价关系图 */
export function FactorGraphPanel({ className = '' }: { className?: string }) {
  return (
    <AiPanel title={FACTOR_GRAPH_TITLE} marker extra={<Legend />} className={className}>
      <div className="min-h-0 flex-1 px-3 pb-2">
        <FactorGraph />
      </div>
    </AiPanel>
  )
}

function Legend() {
  return (
    <div className="flex items-center gap-5">
      {FACTOR_LEGEND.map((item) => (
        <span
          key={item.text}
          className="flex items-center gap-1.5 text-[14px] leading-none text-(--foreground)"
        >
          <LegendCube tone={item.tone} />
          {item.text}
        </span>
      ))}
    </div>
  )
}

/** 图例里的迷你立方体，和图上的节点同构 */
function LegendCube({ tone }: { tone: FactorTone }) {
  return (
    <svg width="20" height="20" viewBox="-11 -11 22 22" aria-hidden>
      <CubeFaces tone={tone} scale={0.62} />
    </svg>
  )
}

function FactorGraph() {
  const gradId = useId()
  const centerGrad = `${gradId}-center`
  const innerGrad = `${gradId}-inner`

  return (
    <svg
      viewBox={`0 0 ${VB.w} ${VB.h}`}
      preserveAspectRatio="xMidYMid meet"
      className="h-full w-full"
      role="img"
      aria-label={FACTOR_GRAPH_TITLE}
    >
      <defs>
        <linearGradient id={centerGrad} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--ck-blue)" />
          <stop offset="100%" stopColor="var(--ck-cyan)" />
        </linearGradient>
        <linearGradient id={innerGrad} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--ck-teal)" />
          <stop offset="100%" stopColor="var(--ck-blue)" />
        </linearGradient>
      </defs>

      {/* 连线先画，保证立方体与菱形盖在线头上 */}
      <g>
        {FACTOR_NODES.map((node) => (
          <Spoke key={node.label} node={node} />
        ))}
      </g>

      <CenterDiamond outerGrad={centerGrad} innerGrad={innerGrad} />

      {FACTOR_NODES.map((node) => {
        const p = nodePos(node)
        return (
          <g key={node.label}>
            <g transform={`translate(${p.x.toFixed(1)} ${(p.y - CUBE_SHIFT).toFixed(1)})`}>
              <CubeFaces tone={node.tone} />
            </g>
            <text
              x={p.x.toFixed(1)}
              y={(p.y + LABEL_DY).toFixed(1)}
              textAnchor="middle"
              style={{ fontSize: 13, fill: 'var(--foreground)' }}
            >
              {node.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

/** 中心菱形 → 某个节点的连线 + 箭头 */
function Spoke({ node }: { node: FactorNode }) {
  const p = nodePos(node)
  const dx = p.x - CENTER.x
  const dy = p.y - CENTER.y
  const len = Math.hypot(dx, dy) || 1
  const ux = dx / len
  const uy = dy / len

  // 菱形边界 |x|/a + |y|/b = 1 上的交点，让线从菱形外缘起笔
  const edge = 1 / (Math.abs(ux) / DIAMOND.x + Math.abs(uy) / DIAMOND.y)
  const sx = CENTER.x + ux * (edge + 4)
  const sy = CENTER.y + uy * (edge + 4)

  // 收到立方体外缘之前，留出箭头的长度
  const stop = CUBE.w + 10
  const ex = p.x - ux * stop
  const ey = p.y - uy * stop

  // 箭头：尖端在 (ex, ey)，底边沿法线展开
  const head = 9
  const half = 4.2
  const bx = ex - ux * head
  const by = ey - uy * head
  const arrow = [
    `${ex.toFixed(1)},${ey.toFixed(1)}`,
    `${(bx - uy * half).toFixed(1)},${(by + ux * half).toFixed(1)}`,
    `${(bx + uy * half).toFixed(1)},${(by - ux * half).toFixed(1)}`,
  ].join(' ')

  return (
    <g>
      <line
        x1={sx.toFixed(1)}
        y1={sy.toFixed(1)}
        x2={bx.toFixed(1)}
        y2={by.toFixed(1)}
        stroke="var(--ck-blue)"
        strokeWidth={1.2}
        strokeOpacity={0.55}
      />
      <polygon points={arrow} fill="var(--ck-blue)" fillOpacity={0.75} />
    </g>
  )
}

/** 正中心的「模型评价」菱形：外框 + 渐变主体 + 内嵌小菱形 */
function CenterDiamond({ outerGrad, innerGrad }: { outerGrad: string; innerGrad: string }) {
  const { x: cx, y: cy } = CENTER
  const rhombus = (a: number, b: number) =>
    `${cx},${cy - b} ${cx + a},${cy} ${cx},${cy + b} ${cx - a},${cy}`

  return (
    <g>
      <polygon
        points={rhombus(DIAMOND.x + 12, DIAMOND.y + 12)}
        fill="var(--ck-blue)"
        fillOpacity={0.14}
      />
      <polygon
        points={rhombus(DIAMOND.x, DIAMOND.y)}
        fill={`url(#${outerGrad})`}
        stroke="var(--ck-teal)"
        strokeWidth={1.5}
      />
      <polygon
        points={rhombus(DIAMOND.x - 16, DIAMOND.y - 7)}
        fill={`url(#${innerGrad})`}
        fillOpacity={0.5}
      />
      <text
        x={cx}
        y={cy + 7}
        textAnchor="middle"
        style={{ fontSize: 21, fontWeight: 700, letterSpacing: 1, fill: 'var(--ck-on-solid)' }}
      >
        {FACTOR_CENTER}
      </text>
    </g>
  )
}

/** 等距立方体：顶面菱形 + 左右两个侧面，原点在顶面中心 */
function CubeFaces({ tone, scale = 1 }: { tone: FactorTone; scale?: number }) {
  const w = CUBE.w * scale
  const t = CUBE.t * scale
  const h = CUBE.h * scale
  const fill = faceFills(tone)

  return (
    <g>
      <polygon points={`0,${-t} ${w},0 0,${t} ${-w},0`} style={{ fill: fill.top }} />
      <polygon points={`${-w},0 0,${t} 0,${t + h} ${-w},${h}`} style={{ fill: fill.left }} />
      <polygon points={`${w},0 0,${t} 0,${t + h} ${w},${h}`} style={{ fill: fill.right }} />
    </g>
  )
}
