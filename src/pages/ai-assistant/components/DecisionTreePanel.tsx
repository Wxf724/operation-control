import { TREE_BRANCHES, TREE_LEGEND, TREE_ROOT } from '../constants'
import type { TreeBranch, TreeLeaf } from '../types'

import { AiPanel } from './AiPanel'

const LINE = 'var(--ck-blue)'
const LINE_W = 2

/** 图例三色：正常绿 / 预警黄 / 异常红 */
const LEGEND_VAR: Record<string, string> = {
  normal: '--ck-green',
  warn: '--ck-yellow',
  abnormal: '--ck-red',
}

/**
 * 右栏：模型决策树。
 *
 * 连线全部用 CSS 边框画，不用 SVG：
 * 分支按 `grid-cols-5` 均分，所以每条分支的中心固定落在整树宽度的 10%/30%/…/90%；
 * 分发横杠用一行 `grid-cols-10`，给第 1~8 格加 `border-top` 画横线、
 * 给第 1/3/5/7 格加 `border-left`、第 8 格加 `border-right` 画下落的竖线，
 * 竖线位置正好压在上述百分比上。叶子层的二分叉同理用 `grid-cols-4`。
 * 这样连线随容器宽度自适应，不会像固定坐标的 SVG 那样错位。
 */
export function DecisionTreePanel({ className = '' }: { className?: string }) {
  return (
    <AiPanel
      title="模型决策树"
      subtitle="通过模型决策树定位原因"
      extra={<Legend />}
      className={className}
    >
      <div className="ck-scroll min-h-0 flex-1 overflow-auto px-4 pt-2 pb-4">
        <div className="flex min-w-[1120px] flex-col items-center">
          <RootNode />
          <VLine height={26} />
          <BusRow count={TREE_BRANCHES.length} />

          <div
            className="grid w-full"
            style={{ gridTemplateColumns: `repeat(${TREE_BRANCHES.length}, minmax(0, 1fr))` }}
          >
            {TREE_BRANCHES.map((branch) => (
              <Branch key={branch.label} branch={branch} />
            ))}
          </div>
        </div>
      </div>
    </AiPanel>
  )
}

function Legend() {
  return (
    <div className="flex items-center gap-5">
      {TREE_LEGEND.map((item) => (
        <span
          key={item.text}
          className="flex items-center gap-2 text-[14px] leading-none text-(--foreground)"
        >
          <i
            className="h-[11px] w-[11px] rounded-full"
            style={{ background: `var(${LEGEND_VAR[item.tone]})` }}
          />
          {item.text}
        </span>
      ))}
    </div>
  )
}

/* ───────────── 连线原件 ───────────── */

function VLine({ height }: { height: number }) {
  return <span style={{ width: LINE_W, height, background: LINE }} />
}

function Dot() {
  return (
    <span className="rounded-full" style={{ width: 7, height: 7, background: 'var(--ck-cyan)' }} />
  )
}

/** 节点间的「圆点—竖线—圆点」连接件 */
function DotLink({ height }: { height: number }) {
  return (
    <span className="flex flex-col items-center">
      <Dot />
      <VLine height={height} />
      <Dot />
    </span>
  )
}

function ArrowHead({ color = LINE }: { color?: string }) {
  return (
    <span
      style={{
        width: 0,
        height: 0,
        borderLeft: '5px solid transparent',
        borderRight: '5px solid transparent',
        borderTop: `7px solid ${color}`,
      }}
    />
  )
}

/** 根节点 → 5 条分支的分发横杠 */
function BusRow({ count }: { count: number }) {
  const cells = count * 2
  const last = cells - 2 // 右端下落点所在格

  return (
    <div
      className="grid w-full"
      style={{ gridTemplateColumns: `repeat(${cells}, minmax(0, 1fr))`, height: 28 }}
    >
      {Array.from({ length: cells }, (_, i) => {
        const onBar = i >= 1 && i <= last
        // 左端 / 右端做圆角拐弯，中间几路是 T 字接头
        const dropLeft = onBar && i % 2 === 1
        const dropRight = i === last

        return (
          <span
            key={i}
            style={{
              borderTop: onBar ? `${LINE_W}px solid ${LINE}` : undefined,
              borderLeft: dropLeft ? `${LINE_W}px solid ${LINE}` : undefined,
              borderRight: dropRight ? `${LINE_W}px solid ${LINE}` : undefined,
              borderTopLeftRadius: i === 1 ? 10 : undefined,
              borderTopRightRadius: dropRight ? 10 : undefined,
            }}
          />
        )
      })}
    </div>
  )
}

/** 菱形判断框下的二分叉 */
function ForkRow() {
  return (
    <div className="grid w-full grid-cols-4" style={{ height: 24 }}>
      <span />
      <span
        style={{
          borderTop: `${LINE_W}px solid ${LINE}`,
          borderLeft: `${LINE_W}px solid ${LINE}`,
          borderTopLeftRadius: 10,
        }}
      />
      <span
        style={{
          borderTop: `${LINE_W}px solid ${LINE}`,
          borderRight: `${LINE_W}px solid ${LINE}`,
          borderTopRightRadius: 10,
        }}
      />
      <span />
    </div>
  )
}

/* ───────────── 节点原件 ───────────── */

/** 多行文案：constants 里用 \n 分行 */
function MultiLine({ text }: { text: string }) {
  return (
    <>
      {text.split('\n').map((line, i) => (
        <span key={line + String(i)} className="block">
          {line}
        </span>
      ))}
    </>
  )
}

function RootNode() {
  return (
    <div
      className="flex flex-col items-center gap-1 rounded-[10px] px-6 py-3 text-center"
      style={{
        border: `${LINE_W}px solid var(--ck-cyan)`,
        background: 'linear-gradient(180deg, var(--ck-card-from), var(--ck-card-to))',
        boxShadow: 'var(--ck-card-shadow)',
      }}
    >
      <span className="text-[15px] leading-none font-semibold text-(--foreground)">
        {TREE_ROOT.title}
      </span>
      <span className="text-[13px] leading-none text-(--text-secondary)">{TREE_ROOT.sub}</span>
    </div>
  )
}

function Branch({ branch }: { branch: TreeBranch }) {
  return (
    <div className="flex flex-col items-center px-3">
      <VLine height={12} />
      <ArrowHead />

      {/* 固定高度：单行/双行的指标名都占同一高度，下面的菱形与判定框才能横向对齐 */}
      <div
        className="mt-1 flex h-[58px] w-full max-w-[188px] items-center justify-center rounded-[10px] px-3 text-center"
        style={{
          border: `${LINE_W}px solid ${LINE}`,
          background: 'linear-gradient(180deg, var(--ck-card-from), var(--ck-card-to))',
          boxShadow: 'var(--ck-card-shadow)',
        }}
      >
        <span className="text-[14px] leading-tight font-medium text-(--foreground)">
          <MultiLine text={branch.label} />
        </span>
      </div>

      <DotLink height={22} />
      <Diamond text={branch.condition} />
      <Dot />
      <VLine height={18} />
      <ForkRow />

      <div className="grid w-full grid-cols-2">
        {branch.leaves.map((leaf) => (
          <Leaf key={leaf.branch} leaf={leaf} />
        ))}
      </div>
    </div>
  )
}

/** 菱形判断框：两层 clip-path 叠出 1px 描边效果（clip-path 自身无法带 border） */
function Diamond({ text }: { text: string }) {
  const shape = 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'

  return (
    <div className="relative flex h-[104px] w-full max-w-[186px] items-center justify-center">
      <span className="absolute inset-0" style={{ clipPath: shape, background: LINE }} />
      <span
        className="absolute"
        style={{
          inset: LINE_W,
          clipPath: shape,
          background: 'linear-gradient(180deg, var(--ck-card-from), var(--ck-card-to))',
        }}
      />
      <span className="relative text-center text-[13px] leading-tight text-(--foreground)">
        <MultiLine text={text} />
      </span>
    </div>
  )
}

function Leaf({ leaf }: { leaf: TreeLeaf }) {
  const tone = leaf.tone === 'normal' ? 'var(--ck-green)' : 'var(--ck-red)'

  return (
    <div className="flex flex-col items-center gap-1 px-1.5 pt-2">
      <span className="text-[14px] leading-none text-(--foreground)">{leaf.branch}</span>
      <span className="text-[12px] leading-none text-(--text-secondary)">{leaf.threshold}</span>

      <span className="mt-2 flex flex-col items-center">
        <span
          style={{
            width: LINE_W,
            height: 26,
            background: `linear-gradient(180deg, color-mix(in srgb, ${tone} 30%, transparent), ${tone})`,
          }}
        />
        <ArrowHead color={tone} />
      </span>

      <div
        className="mt-1 flex w-full flex-col items-center gap-0.5 rounded-[8px] px-1.5 py-2 text-center"
        style={{
          border: `${LINE_W}px solid ${tone}`,
          background: `color-mix(in srgb, ${tone} 13%, var(--surface))`,
        }}
      >
        <span className="text-[12px] leading-none text-(--text-secondary)">
          {leaf.verdictTitle}
        </span>
        <span
          className="text-[13px] leading-none font-semibold"
          style={{ color: `color-mix(in srgb, ${tone} 72%, var(--foreground))` }}
        >
          {leaf.verdictText}
        </span>
      </div>
    </div>
  )
}
