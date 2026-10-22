import { PHASE_LABELS, PROCESS_NODE_MAP } from './data'
import type { NodeTone, ProcessNode } from './data'

/**
 * 坐标系说明
 * ----------
 * 本文件所有几何量都写在「目标稿坐标系」里：目标稿 2000×977，左栏内容区为
 * x∈[29,1446]、y∈[118,910]，也就是 1417×792。外层把这块 1417×792 的舞台整体
 * scale(1.2) 贴进 1700×950 的左栏，于是画布像素 = 这里的数值 ×1.2。
 */
const STAGE_W = 1417
const STAGE_H = 792
const STAGE_SCALE = 1.2

/** 三个环节面板：等高纵排，面板之间留出让路面穿过的缝 */
const PANEL_H = 251
const PANEL_TOP = [0, 272, 541] as const

/** 路面厚度与三段路的中心线 y（= 面板顶 + 199） */
const BAND = 36
const ROW_Y = [199, 471, 740] as const

/** 两个 U 弯的圆心与半径 */
const CX_RIGHT = 1071
const CX_LEFT = 334
const CY_RIGHT = (ROW_Y[0] + ROW_Y[1]) / 2
const CY_LEFT = (ROW_Y[1] + ROW_Y[2]) / 2
const R_RIGHT = (ROW_Y[1] - ROW_Y[0]) / 2
const R_LEFT = (ROW_Y[2] - ROW_Y[1]) / 2

/**
 * 路面配色：目标稿以绿色为主，黄色只有 05/06/12/17，红色只有 11 共享复审。
 *
 * 目标稿是深色底，用的是低明度高饱和的墨绿／土黄／暗红；同一组色直接放到
 * 浅蓝白底上会发脏发闷。这里保留三档语义色相，但按浅底重新调：
 * 路面提亮到主题的绿／黄／红一档（`--cl-green` / `--cl-yellow` / `--cl-red` 附近），
 * 描边取同色深一档当轮廓——白底上靠深色细边收口，比亮边更干净。
 */
const ROAD: Record<NodeTone, { fill: string; edge: string }> = {
  green: { fill: '#3fb98a', edge: '#2a8f69' },
  yellow: { fill: '#edb133', edge: '#c58b14' },
  red: { fill: '#ef6b7b', edge: '#cb4257' },
}

/**
 * 节点标题 / 数值文字色。
 *
 * `--ck-green` / `--ck-orange` 是按深色底调的亮色，直接打在白面板上只有 2:1 左右的对比，
 * 所以统一往主文字色混一档再用——色相不变，读得清。
 */
const TEXT_TONE: Record<NodeTone, string> = {
  green: 'color-mix(in srgb, var(--ck-green) 65%, var(--foreground))',
  yellow: 'color-mix(in srgb, var(--ck-orange) 72%, var(--foreground))',
  red: 'color-mix(in srgb, var(--ck-red) 82%, var(--foreground))',
}

/**
 * 路面中心线。
 *
 * 路面提亮适配白底后，中心线继续用纯白（`--ck-on-solid`）——白线压在
 * 绿／琥珀／珊瑚三档路面上都还有足够反差，而且是最贴近真实路面标线的画法；
 * 改成淡蓝或半透明白反而会在琥珀路段上糊掉。
 */
const DASH = { stroke: 'var(--ck-on-solid)', strokeWidth: 3.5, strokeDasharray: '26 24' }

/** 节点标签旁的分隔线 */
const RULE_COLOR = 'var(--ck-panel-border)'

/* ───────────────────────── 路面分段 ───────────────────────── */

interface Straight {
  row: 0 | 1 | 2
  x0: number
  x1: number
  tone: NodeTone
}

/** 直路分段的 x 边界取自目标稿实测——节点列宽就是对应路段宽 */
const STRAIGHTS: Straight[] = [
  // 第 1 段：从左往右，引导段 + 02–07
  { row: 0, x0: 25, x1: 195, tone: 'green' },
  { row: 0, x0: 195, x1: 374, tone: 'green' },
  { row: 0, x0: 374, x1: 552, tone: 'green' },
  { row: 0, x0: 552, x1: 708, tone: 'green' },
  { row: 0, x0: 708, x1: 879, tone: 'yellow' },
  { row: 0, x0: 879, x1: 1042, tone: 'yellow' },
  { row: 0, x0: 1042, x1: CX_RIGHT, tone: 'green' },
  // 第 2 段：从右往左（编号递减）14–10
  { row: 1, x0: CX_LEFT, x1: 499, tone: 'green' },
  { row: 1, x0: 499, x1: 675, tone: 'green' },
  { row: 1, x0: 675, x1: 844, tone: 'yellow' },
  { row: 1, x0: 844, x1: 1013, tone: 'red' },
  { row: 1, x0: 1013, x1: CX_RIGHT, tone: 'green' },
  // 第 3 段：从左往右，18–23
  { row: 2, x0: CX_LEFT, x1: 500, tone: 'green' },
  { row: 2, x0: 500, x1: 660, tone: 'green' },
  { row: 2, x0: 660, x1: 838, tone: 'green' },
  { row: 2, x0: 838, x1: 1029, tone: 'green' },
  { row: 2, x0: 1029, x1: 1223, tone: 'green' },
  { row: 2, x0: 1223, x1: 1391, tone: 'green' },
]

interface Arc {
  cx: number
  cy: number
  r: number
  /** 1 = 向右鼓（右弯），-1 = 向左鼓（左弯） */
  dir: 1 | -1
  /** 角度以「上端点」为 0°，顺车流方向递增到 180° */
  a0: number
  a1: number
  tone: NodeTone
}

/** 右弯整段绿；左弯上半绿、下半金（17 结转） */
const ARCS: Arc[] = [
  { cx: CX_RIGHT, cy: CY_RIGHT, r: R_RIGHT, dir: 1, a0: 0, a1: 58, tone: 'green' },
  { cx: CX_RIGHT, cy: CY_RIGHT, r: R_RIGHT, dir: 1, a0: 58, a1: 130, tone: 'green' },
  { cx: CX_RIGHT, cy: CY_RIGHT, r: R_RIGHT, dir: 1, a0: 130, a1: 180, tone: 'green' },
  { cx: CX_LEFT, cy: CY_LEFT, r: R_LEFT, dir: -1, a0: 0, a1: 30, tone: 'green' },
  { cx: CX_LEFT, cy: CY_LEFT, r: R_LEFT, dir: -1, a0: 30, a1: 60, tone: 'green' },
  { cx: CX_LEFT, cy: CY_LEFT, r: R_LEFT, dir: -1, a0: 60, a1: 90, tone: 'green' },
  { cx: CX_LEFT, cy: CY_LEFT, r: R_LEFT, dir: -1, a0: 90, a1: 180, tone: 'yellow' },
]

const rad = (deg: number) => (deg * Math.PI) / 180

function arcPoint(cx: number, cy: number, r: number, dir: 1 | -1, deg: number) {
  return [cx + dir * r * Math.sin(rad(deg)), cy - r * Math.cos(rad(deg))] as const
}

function arcPath(a: Arc) {
  const [x0, y0] = arcPoint(a.cx, a.cy, a.r, a.dir, a.a0)
  const [x1, y1] = arcPoint(a.cx, a.cy, a.r, a.dir, a.a1)
  return `M ${x0} ${y0} A ${a.r} ${a.r} 0 0 ${a.dir === 1 ? 1 : 0} ${x1} ${y1}`
}

/* ───────────────────────── 节点标签排布 ───────────────────────── */

type LabelAlign = 'left' | 'right'

interface LabelSpec {
  id: number
  /** 所属面板，决定纵向基线 */
  panel: 0 | 1 | 2
  align: LabelAlign
  /** align=left 时为左边界，align=right 时为右边界 */
  x: number
  width: number
  /** 标题顶在面板内的偏移，默认 TITLE_TOP */
  top?: number
  /** 分隔线：side 文字块侧边竖线 / top 文字块上方横线 */
  rule?: 'side' | 'top'
}

/** 面板内纵向基线：标题顶 60、两行指标从 100 起、行距 29、路面顶 181 */
const TITLE_TOP = 60
const TITLE_LH = 28
const METRIC_GAP = 12
const METRIC_PITCH = 29
const LABEL_PAD_TOP = 6
const LABEL_H = LABEL_PAD_TOP + TITLE_LH + METRIC_GAP + METRIC_PITCH * 2 + 4
/** 竖分隔线相对按钮顶的偏移与高度 */
const RULE_OFFSET = 45
const RULE_H = 81

const LABELS: LabelSpec[] = [
  { id: 2, panel: 0, align: 'left', x: 195, width: 179 },
  { id: 3, panel: 0, align: 'left', x: 374, width: 178 },
  { id: 4, panel: 0, align: 'left', x: 552, width: 156 },
  { id: 5, panel: 0, align: 'left', x: 708, width: 171 },
  { id: 6, panel: 0, align: 'left', x: 879, width: 163 },
  { id: 7, panel: 0, align: 'left', x: 1042, width: 175 },
  { id: 8, panel: 0, align: 'left', x: 1223, width: 181, top: 180 },
  { id: 9, panel: 1, align: 'left', x: 1236, width: 181, top: 50 },
  { id: 10, panel: 1, align: 'left', x: 1013, width: 175 },
  { id: 11, panel: 1, align: 'left', x: 844, width: 169 },
  { id: 12, panel: 1, align: 'left', x: 675, width: 169 },
  { id: 13, panel: 1, align: 'left', x: 499, width: 176 },
  { id: 14, panel: 1, align: 'left', x: 334, width: 165 },
  { id: 15, panel: 1, align: 'right', x: 263, width: 245, top: 50 },
  { id: 16, panel: 1, align: 'right', x: 216, width: 215, top: 152 },
  { id: 17, panel: 2, align: 'left', x: 28, width: 190, top: 71, rule: 'top' },
  { id: 18, panel: 2, align: 'left', x: 334, width: 166 },
  { id: 19, panel: 2, align: 'left', x: 500, width: 160 },
  { id: 20, panel: 2, align: 'left', x: 660, width: 178 },
  { id: 21, panel: 2, align: 'left', x: 838, width: 191 },
  { id: 22, panel: 2, align: 'left', x: 1029, width: 194 },
  { id: 23, panel: 2, align: 'left', x: 1223, width: 168 },
]

/* ───────────────────────── 组件 ───────────────────────── */

/** 左栏：三个环节面板 + 一条贯穿三段的 U 型折返跑道 + 可点击节点标签 */
export function FlowRoad({
  selected,
  onSelect,
}: {
  selected: number
  onSelect: (id: number) => void
}) {
  return (
    <div
      className="relative shrink-0"
      style={{ width: STAGE_W * STAGE_SCALE, height: STAGE_H * STAGE_SCALE }}
    >
      <div
        className="absolute top-0 left-0"
        style={{
          width: STAGE_W,
          height: STAGE_H,
          transform: `scale(${STAGE_SCALE})`,
          transformOrigin: 'top left',
        }}
      >
        {/* 三个环节面板（各自独立边框） */}
        {PANEL_TOP.map((top) => (
          <div
            key={top}
            className="ck-panel absolute rounded-[3px]"
            style={{ left: 0, top, width: STAGE_W, height: PANEL_H }}
          />
        ))}

        {/* 环节标注：01/03 贴左，02/04 贴右 */}
        {PHASE_LABELS.map((p) => (
          <span
            key={p.no}
            className="absolute flex items-center gap-[7px] text-[23px] leading-none font-bold whitespace-nowrap text-(--ck-title) italic"
            style={
              p.align === 'right' ? { right: STAGE_W - p.x, top: p.y } : { left: p.x, top: p.y }
            }
          >
            <i className="ri-play-fill text-[19px] text-(--ck-marker) not-italic" aria-hidden />
            {p.no} {p.name}
          </span>
        ))}

        {/* 跑道：画在面板之上，弯道跨越面板之间的缝 */}
        <svg
          className="pointer-events-none absolute inset-0"
          width={STAGE_W}
          height={STAGE_H}
          viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
          fill="none"
          aria-hidden
        >
          {ARCS.map((a) => {
            const d = arcPath(a)
            const c = ROAD[a.tone]
            return (
              <g key={`arc-${a.cx}-${a.a0}`}>
                <path d={d} fill="none" stroke={c.edge} strokeWidth={BAND} />
                <path d={d} fill="none" stroke={c.fill} strokeWidth={BAND - 3} />
                <path d={d} fill="none" {...DASH} />
              </g>
            )
          })}

          {STRAIGHTS.map((s) => {
            const y = ROW_Y[s.row]
            const c = ROAD[s.tone]
            return (
              <g key={`seg-${s.row}-${s.x0}`}>
                <rect
                  x={s.x0}
                  y={y - BAND / 2}
                  width={s.x1 - s.x0}
                  height={BAND}
                  fill={c.fill}
                  stroke={c.edge}
                  strokeWidth={1.5}
                />
                <line x1={s.x0 + 8} y1={y} x2={s.x1 - 8} y2={y} {...DASH} />
              </g>
            )
          })}

          {/* 弯道上的分段隔线（沿半径方向横跨路面） */}
          {ARCS.filter((a) => a.a1 < 180).map((a) => {
            const [x1, y1] = arcPoint(a.cx, a.cy, a.r - BAND / 2, a.dir, a.a1)
            const [x2, y2] = arcPoint(a.cx, a.cy, a.r + BAND / 2, a.dir, a.a1)
            return (
              <line
                key={`div-${a.cx}-${a.a1}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={ROAD[a.tone].edge}
                strokeWidth={1.5}
              />
            )
          })}
        </svg>

        {/* 节点标签 */}
        {LABELS.map((spec) => {
          const node = PROCESS_NODE_MAP.get(spec.id)
          if (!node) return null
          return (
            <NodeLabel
              key={spec.id}
              spec={spec}
              node={node}
              selected={spec.id === selected}
              onSelect={onSelect}
            />
          )
        })}
      </div>
    </div>
  )
}

/** 节点的两行小指标：标签 + 数值 + 单位，行高固定以免挤成一团 */
function MetricRows({
  node,
  align,
}: {
  node: ProcessNode
  align: LabelAlign
}) {
  return (
    <>
      {node.flow.map((f) => (
        <span
          key={f.label}
          className={`flex items-baseline gap-[4px] whitespace-nowrap ${
            align === 'right' ? 'justify-end' : ''
          }`}
          style={{ height: METRIC_PITCH }}
        >
          <span className="text-[14px] text-(--ck-title-sub)">{f.label}</span>
          <span
            className="text-[24px] leading-none font-bold"
            style={{ color: TEXT_TONE[node.tone] }}
          >
            {f.value}
          </span>
          {f.unit ? <span className="text-[11px] text-(--text-secondary)">{f.unit}</span> : null}
        </span>
      ))}
    </>
  )
}

function NodeLabel({
  spec,
  node,
  selected,
  onSelect,
}: {
  spec: LabelSpec
  node: ProcessNode
  selected: boolean
  onSelect: (id: number) => void
}) {
  const titleTop = PANEL_TOP[spec.panel] + (spec.top ?? TITLE_TOP)
  const rule = spec.rule ?? 'side'

  return (
    <button
      type="button"
      onClick={() => onSelect(node.id)}
      className={`absolute cursor-pointer rounded-[4px] transition-colors ${
        selected ? 'bg-(--accent-light) ring-[1.5px] ring-(--ck-cyan)' : 'hover:bg-(--accent-subtle)'
      }`}
      style={{
        left: spec.align === 'left' ? spec.x : spec.x - spec.width,
        top: titleTop - LABEL_PAD_TOP,
        width: spec.width,
        height: LABEL_H,
        textAlign: spec.align,
        paddingLeft: spec.align === 'left' ? 7 : 0,
        paddingRight: spec.align === 'right' ? 7 : 0,
      }}
    >
      {rule === 'side' ? (
        <span
          className="pointer-events-none absolute"
          style={{
            [spec.align === 'left' ? 'left' : 'right']: 0,
            top: RULE_OFFSET,
            width: 1,
            height: RULE_H,
            background: RULE_COLOR,
          }}
        />
      ) : (
        <span
          className="pointer-events-none absolute"
          style={{ left: 58, top: 0, width: 100, height: 1, background: RULE_COLOR }}
        />
      )}

      <span
        className="block text-[22px] font-bold whitespace-nowrap"
        style={{
          color: TEXT_TONE[node.tone],
          marginTop: LABEL_PAD_TOP,
          lineHeight: `${TITLE_LH}px`,
        }}
      >
        {String(node.id).padStart(2, '0')} {node.name}
      </span>
      <span className="flex flex-col" style={{ marginTop: METRIC_GAP }}>
        <MetricRows node={node} align={spec.align} />
      </span>
    </button>
  )
}

