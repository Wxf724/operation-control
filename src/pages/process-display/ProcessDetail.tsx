import { CLOSING_COLS, closingTone } from './data'
import type { ClosingRow, ProcessCard, ProcessNode } from './data'

/**
 * 右栏（画布 604×950）。
 *
 * 版面按目标稿 `_refs/live/61-全业务流程-节点详情排版.png` 换算：
 * 标题带 59 → 指标清单（每行一个浅色长条：左指标名、右大号数值 + 小号单位）
 * → 底部「现状问题 / 解决方案 / 催办状态」固定块高 317。
 *
 * **23 个节点共用这一套结构**，各节点只是清单条目不同；
 * 17 结转在清单下方额外挂一块「月末关账事项确认」表。
 */
const TITLE_H = 59
const PAD_X = 34
const PAD_Y = 38
/** 指标卡网格的行列间距 */
const CARD_GAP = 16
const FOOT_H = 317
/** 清单区与下方区块的间距 */
const BLOCK_GAP = 14

/**
 * 指标卡列数：按条目数决定，条目少就让卡片占更宽、长得更高，避免矮条 + 大片留白。
 *
 * 分档取自目标稿的四张排版参考：
 * 1~2 条单列整宽（20 预成册）、3~6 条两列（02 单据填报）、7 条以上三列（10 共享初审）。
 */
function gridColumns(count: number) {
  if (count <= 2) return 1
  if (count <= 6) return 2
  return 3
}

/**
 * 月末关账进度条配色（17 结转）。
 *
 * 取主题的绿／橙／红三个语义色再压深一档：条内要压白字，
 * 直接用 `--ck-green` / `--ck-orange` 这类按浅底调亮的值，白字会糊。
 */
const CLOSING_BAR: Record<'green' | 'yellow' | 'red', string> = {
  green: '#2fb87a',
  yellow: '#ef9f2a',
  red: '#ef5a6b',
}

/** 右侧明细面板：随左侧选中节点切换 */
export function ProcessDetail({
  node,
  width,
  className = '',
}: {
  node?: ProcessNode
  width: number
  className?: string
}) {
  if (!node) return null

  /** 03 上传附件的补充说明和普通指标同构，直接并进清单 */
  const rows: ProcessCard[] = node.note ? [...node.cards, node.note] : node.cards

  return (
    <div className={`ck-panel relative flex flex-col rounded-[3px] ${className}`} style={{ width }}>
      {/* 居中斜体标题带：文字贴着底部的分隔线 */}
      <div className="flex shrink-0 items-end justify-center" style={{ height: TITLE_H }}>
        <span className="text-[34px] leading-[36px] font-bold text-(--ck-title) italic">
          {String(node.id).padStart(2, '0')} {node.name}
        </span>
      </div>
      <div
        className="shrink-0"
        style={{
          marginLeft: PAD_X,
          marginRight: PAD_X,
          height: 1,
          background:
            'linear-gradient(90deg, transparent, var(--ck-panel-border) 20%, var(--ck-panel-border) 80%, transparent)',
        }}
      />

      <div
        className="flex min-h-0 flex-1 flex-col"
        style={{ paddingLeft: PAD_X, paddingRight: PAD_X, paddingTop: PAD_Y, paddingBottom: PAD_Y }}
      >
        <div className="ck-scroll flex min-h-0 flex-1 flex-col overflow-auto">
          {/* 指标卡网格：所有节点统一形态，列数随条目数变化，卡片纵向撑满可用高度 */}
          <MetricGrid rows={rows} fill={!node.closing} />

          {/* 月末关账事项确认（仅 17 结转） */}
          {node.closing ? <ClosingBlock rows={node.closing.rows} /> : null}
        </div>

        {/* 三段式文本块：贴底，高度固定 */}
        <div
          className="flex shrink-0 flex-col rounded-[3px]"
          style={{
            height: FOOT_H,
            marginTop: BLOCK_GAP,
            paddingTop: 26,
            paddingLeft: 19,
            paddingRight: 19,
            paddingBottom: 17,
            background: 'var(--ck-panel-inner)',
            border: '1px solid var(--ck-panel-inner-border)',
          }}
        >
          <Field label="现状问题" text={node.issue ?? '无'} />
          <Field label="解决方案" text={node.solution ?? '无'} grow />
          <Field label="催办状态" text={node.urge ?? '无'} last />
        </div>
      </div>
    </div>
  )
}

/**
 * 指标卡网格。
 *
 * `fill` 为真时整块撑满清单区（`flex-1`），行高由 `grid-auto-rows: 1fr` 均分，
 * 于是条目少的节点（如 23 正式归档只有 1 条）卡片会长得很高而不是留一条矮边。
 * 17 结转下方还挂着关账表，这时不抢高度，按内容高度排（`fill` 为假）。
 *
 * 末行条目不满一整行时跨列铺平，不留半截空位。
 */
function MetricGrid({ rows, fill }: { rows: ProcessCard[]; fill: boolean }) {
  const cols = gridColumns(rows.length)
  /**
   * 末行条目数不满一整行时，把整行宽度分给这几张卡，不留半截空位。
   * 列数除不尽的情况（3 列余 2 张）把多出来的列加到靠后的卡上 → 跨度 1 + 2。
   */
  const tail = rows.length % cols
  const tailStart = rows.length - tail
  const tailSpans = (() => {
    if (tail === 0) return []
    const base = Math.floor(cols / tail)
    const extra = cols % tail
    return Array.from({ length: tail }, (_, i) => base + (i >= tail - extra ? 1 : 0))
  })()

  return (
    <div
      className={`grid ${fill ? 'min-h-0 flex-1' : 'shrink-0'}`}
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gridAutoRows: fill ? '1fr' : 'minmax(84px, auto)',
        gap: CARD_GAP,
      }}
    >
      {rows.map((card, i) => {
        const span = tail !== 0 && i >= tailStart ? tailSpans[i - tailStart] : 1
        return <MetricCard key={card.label} card={card} span={span} />
      })}
    </div>
  )
}

/** 指标卡：上方指标名、下方「大号数值 + 小号单位」，整块一个浅色卡片 */
function MetricCard({ card, span }: { card: ProcessCard; span: number }) {
  return (
    <div
      className="flex min-h-0 min-w-0 flex-col justify-between rounded-[3px] px-[18px] py-[16px]"
      style={{
        gridColumn: `span ${span}`,
        background: 'linear-gradient(180deg, var(--ck-card-from) 0%, var(--ck-card-to) 100%)',
        border: '1px solid var(--ck-card-border)',
        boxShadow: 'var(--ck-card-shadow)',
      }}
    >
      <span className="text-[17px] leading-[23px] text-(--ck-title)">{card.label}</span>
      <span className="flex shrink-0 items-baseline gap-[4px]">
        <span className="ck-glow-num text-[34px] leading-none font-bold text-(--ck-cyan)">
          {card.value}
        </span>
        {card.unit ? (
          <span className="text-[14px] leading-none text-(--ck-cyan)">{card.unit}</span>
        ) : null}
      </span>
    </div>
  )
}

/* ─────────────── 17 结转：月末关账事项确认 ─────────────── */

/** 表格列宽：企业名称列宽一档，四个数值列等分 */
const CLOSING_GRID = '1.35fr 1fr 1fr 1fr 1fr'
const CLOSING_HEAD_H = 34
const CLOSING_ROW_H = 46
/** 表体最多露出 4 行，再多就滚动 */
const CLOSING_VISIBLE_ROWS = 4

/** 标题 +「导出」+ 可滚动的进度条表格 */
function ClosingBlock({ rows }: { rows: ClosingRow[] }) {
  return (
    <div className="flex shrink-0 flex-col" style={{ marginTop: BLOCK_GAP + 8 }}>
      <div className="flex h-[30px] shrink-0 items-center justify-between">
        <span className="flex items-center gap-[6px] text-[19px] leading-none font-bold text-(--ck-title)">
          <BlockMarker />
          月末关账事项确认
        </span>
        <button
          type="button"
          className="h-[26px] cursor-pointer rounded-[3px] px-[14px] text-[14px] leading-none font-medium text-(--ck-on-solid)"
          style={{
            background: 'linear-gradient(90deg, var(--ck-btn-from) 0%, var(--ck-btn-to) 100%)',
            boxShadow: '0 2px 6px rgba(42, 102, 232, 0.25)',
          }}
        >
          导出
        </button>
      </div>

      <div
        className="mt-[12px] flex shrink-0 flex-col overflow-hidden rounded-[3px]"
        style={{ border: '1px solid var(--ck-panel-inner-border)', background: 'var(--surface)' }}
      >
        {/* 表头 */}
        <div
          className="grid shrink-0 items-center"
          style={{
            gridTemplateColumns: CLOSING_GRID,
            height: CLOSING_HEAD_H,
            background: 'var(--ck-table-head)',
          }}
        >
          {CLOSING_COLS.map((col) => (
            <span
              key={col}
              className="px-[10px] text-center text-[15px] leading-none font-semibold text-(--ck-title)"
            >
              {col}
            </span>
          ))}
        </div>

        {/* 表体：行高固定，超出 4 行滚动 */}
        <div
          className="ck-scroll shrink-0 overflow-auto"
          style={{ maxHeight: CLOSING_ROW_H * CLOSING_VISIBLE_ROWS }}
        >
          {rows.map((row, ri) => (
            <div
              key={row.name}
              className="grid items-center"
              style={{
                gridTemplateColumns: CLOSING_GRID,
                height: CLOSING_ROW_H,
                background: ri % 2 ? 'var(--ck-table-row-alt)' : 'var(--ck-table-row)',
                borderTop: ri ? '1px solid var(--ck-panel-inner-border)' : 'none',
              }}
            >
              <span className="px-[10px] text-center text-[15px] leading-[20px] text-(--ck-title)">
                {row.name}
              </span>
              {row.cells.map((v, i) => (
                <ClosingBar key={CLOSING_COLS[i + 1]} value={v} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/** 带百分比文字的进度条：绿=达标、橙=偏低、红=告警 */
function ClosingBar({ value }: { value: number }) {
  const color = CLOSING_BAR[closingTone(value)]
  return (
    <span className="px-[7px]">
      <span
        className="relative block h-[21px] overflow-hidden rounded-[2px]"
        style={{ background: 'var(--ck-track)' }}
      >
        <span
          className="flex h-full items-center justify-center"
          style={{ width: `${Math.min(value, 100)}%`, background: color }}
        >
          <span className="text-[14px] leading-none font-bold text-(--ck-on-solid)">{value}%</span>
        </span>
      </span>
    </span>
  )
}

/* ─────────────── 底部三段式文本 ─────────────── */

/** 一段「橙色小标题 + 浅底文本条」；解决方案一段高度自适应占满剩余空间 */
function Field({
  label,
  text,
  grow = false,
  last = false,
}: {
  label: string
  text: string
  grow?: boolean
  last?: boolean
}) {
  const empty = text === '无'
  return (
    <div
      className={`flex min-h-0 flex-col ${grow ? 'flex-1' : 'shrink-0'}`}
      style={{ marginBottom: last ? 0 : 20 }}
    >
      <span className="flex shrink-0 items-center gap-[6px] text-[17px] leading-[20px] font-bold text-(--ck-orange)">
        <FieldMarker />
        {label}
      </span>
      <div
        className={`ck-scroll mt-[13px] overflow-auto rounded-[2px] px-[16px] py-[4px] ${
          grow ? 'min-h-0 flex-1' : 'min-h-[30px] shrink-0'
        }`}
        style={{ background: 'var(--surface)', border: '1px solid var(--ck-panel-inner-border)' }}
      >
        <span
          className={`text-[15px] leading-[22px] ${
            empty ? 'text-(--text-secondary)' : 'text-(--foreground)'
          }`}
        >
          {text}
        </span>
      </div>
    </div>
  )
}

/** 小标题前的橙色「◆▸」标记 */
function FieldMarker() {
  return (
    <svg width="14" height="11" viewBox="0 0 14 11" fill="var(--ck-orange)" aria-hidden="true">
      <path d="M4 1.3L6.7 5.5L4 9.7L1.3 5.5L4 1.3Z" />
      <path d="M8.2 1.3L12.7 5.5L8.2 9.7V1.3Z" opacity="0.85" />
    </svg>
  )
}

/** 区块小标题前的蓝色「◆▸」标记（和环节标注同一套语言） */
function BlockMarker() {
  return (
    <svg width="14" height="11" viewBox="0 0 14 11" fill="var(--ck-marker)" aria-hidden="true">
      <path d="M4 1.3L6.7 5.5L4 9.7L1.3 5.5L4 1.3Z" />
      <path d="M8.2 1.3L12.7 5.5L8.2 9.7V1.3Z" opacity="0.85" />
    </svg>
  )
}
