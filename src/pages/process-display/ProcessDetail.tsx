import { CLOSING_COLS, closingTone } from './data'
import type { ProcessCard, ProcessNode } from './data'

/**
 * 右栏（画布 604×950）。版面按目标稿换算：
 * 标题带 59、标题下内边距 40、指标卡 3 列（卡 162×134、列距 25、行距 26）、
 * 左右内边距 34；底部「现状问题 / 解决方案 / 催办状态」块高 372、与卡片区间距 18。
 */
const TITLE_H = 59
const PAD_X = 34
const PAD_Y = 38
const CARD_W = 162
const CARD_H = 140
const COL_GAP = 25
const ROW_GAP = 22
const FOOT_H = 317

/** 关账表数值配色：和跑道节点一样，往主文字色压一档才在白底上读得清 */
const CLOSING_COLOR: Record<'green' | 'yellow' | 'red', string> = {
  green: 'color-mix(in srgb, var(--ck-green) 65%, var(--foreground))',
  yellow: 'color-mix(in srgb, var(--ck-yellow) 60%, var(--foreground))',
  red: 'color-mix(in srgb, var(--ck-red) 82%, var(--foreground))',
}

/** 右侧明细面板：随左侧选中节点切换，默认展示 08 档案对比 */
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
        className="ck-scroll flex min-h-0 flex-1 flex-col overflow-auto"
        style={{ paddingLeft: PAD_X, paddingRight: PAD_X, paddingTop: PAD_Y, paddingBottom: PAD_Y }}
      >
        {/* 指标卡：固定三列栅格，最后一行不足三列时靠左 */}
        <div
          className="grid shrink-0 justify-start"
          style={{
            gridTemplateColumns: `repeat(3, ${CARD_W}px)`,
            columnGap: COL_GAP,
            rowGap: ROW_GAP,
          }}
        >
          {node.cards.map((card) => (
            <MetricCard key={card.label} card={card} />
          ))}
        </div>

        {/* 节点补充说明（03 上传附件） */}
        {node.note ? (
          <div className="ck-card mt-[26px] shrink-0 rounded-[3px] px-4 py-3">
            <span className="text-[16px] leading-[22px] text-(--ck-title-sub)">
              {node.note.label}
            </span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="ck-glow-num text-[28px] leading-none font-bold text-(--ck-cyan)">
                {node.note.value}
              </span>
              <span className="text-[14px] leading-none text-(--text-tertiary)">
                {node.note.unit}
              </span>
            </div>
          </div>
        ) : null}

        {/* 月末关账确认表（17 结转） */}
        {node.closing ? (
          <div className="ck-card mt-[26px] shrink-0 overflow-hidden rounded-[3px]">
            <table className="w-full border-collapse text-[15px]">
              <thead>
                <tr className="bg-(--ck-table-head) text-(--ck-title-sub)">
                  {CLOSING_COLS.map((col) => (
                    <th key={col} className="px-3 py-2 text-left font-semibold whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {node.closing.rows.map((row) => (
                  <tr key={row.name} className="border-t border-(--ck-panel-inner-border)">
                    <td className="px-3 py-2 whitespace-nowrap text-(--ck-title)">{row.name}</td>
                    {row.cells.map((v, i) => (
                      <td key={i} className="px-3 py-2">
                        <span
                          className="ck-glow-num font-bold"
                          style={{ color: CLOSING_COLOR[closingTone(v)] }}
                        >
                          {v}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        {/* 三段式文本块：贴底，高度固定 */}
        <div
          className="flex shrink-0 flex-col rounded-[3px]"
          style={{
            height: FOOT_H,
            marginTop: 'auto',
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

/** 指标卡：标签在上、数值在下，整卡居中，固定 162×134 */
function MetricCard({ card }: { card: ProcessCard }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-[14px] rounded-[2px] px-[4px] text-center"
      style={{
        width: CARD_W,
        height: CARD_H,
        background: 'linear-gradient(180deg, var(--ck-card-from) 0%, var(--ck-card-to) 100%)',
        border: '1px solid var(--ck-card-border)',
        boxShadow: 'var(--ck-card-shadow)',
      }}
    >
      <span className="text-[18px] leading-[25px] text-(--ck-title-sub)">{card.label}</span>
      <span className="flex items-baseline justify-center gap-[3px]">
        <span className="ck-glow-num text-[36px] leading-none font-bold text-(--ck-cyan)">
          {card.value}
        </span>
        {card.unit ? (
          <span className="text-[15px] leading-none text-(--ck-cyan)">{card.unit}</span>
        ) : null}
      </span>
    </div>
  )
}

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
