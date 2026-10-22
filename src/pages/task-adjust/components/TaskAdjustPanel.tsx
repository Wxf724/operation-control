import { useEffect, useRef, useState } from 'react'

import { PanelBox } from '@/components/cockpit-ui'

import { ADJUST_ITEMS, DEPARTMENT_OPTIONS, EMPLOYEE_OPTIONS } from '../constants'
import type { AdjustItem } from '../types'
import { DateTimePicker } from './DateTimePicker'
import { SearchSelect } from './SearchSelect'

/** 卡片里被编辑的字段：有 to 的编辑「调整后」，只有 text 的编辑 text */
function editableValue(item: AdjustItem) {
  return item.to ?? item.text ?? ''
}

/**
 * 第三列：任务调整（AI 给出的逐项调整建议）。
 *
 * 七张卡片支持**双击进入编辑态**，按卡片类型切不同控件：
 * 责任调整 / 牵头部门走可搜索下拉，时间调整走单日期 + 时分选择器，其余走文本编辑。
 * 编辑的始终是「调整后」那个值，`from`（调整前）是原始值保持只读。
 */
export function TaskAdjustPanel({ className = '' }: { className?: string }) {
  // 逐卡片的「调整后」值，key 是卡片下标
  const [values, setValues] = useState<Record<number, string>>({})
  const [editing, setEditing] = useState<number | null>(null)
  const [saved, setSaved] = useState(false)
  const savedTimer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(savedTimer.current), [])

  const handleSave = () => {
    setEditing(null)
    setSaved(true)
    window.clearTimeout(savedTimer.current)
    savedTimer.current = window.setTimeout(() => setSaved(false), 1800)
  }

  return (
    <PanelBox title="任务调整" className={`flex flex-col ${className}`} extra={<AiAssistButton />}>
      <div className="flex h-full min-h-0 flex-col px-[28px] pt-[37px] pb-[26px]">
        <div className="flex min-h-0 flex-1 flex-col gap-[9px]">
          {ADJUST_ITEMS.map((item, i) => (
            <AdjustCard
              key={`${item.label}-${i}`}
              item={item}
              value={values[i] ?? editableValue(item)}
              editing={editing === i}
              onEnterEdit={() => setEditing(i)}
              onExitEdit={() => setEditing((cur) => (cur === i ? null : cur))}
              onChange={(next) => setValues((prev) => ({ ...prev, [i]: next }))}
              onReset={() => setValues((prev) => ({ ...prev, [i]: editableValue(item) }))}
            />
          ))}
        </div>

        <div className="mt-[18px] flex shrink-0 items-center justify-end gap-[14px]">
          {saved ? (
            <span className="flex items-center gap-1.5 text-[16px] leading-none text-(--ck-green)">
              <i className="ri-check-line text-[18px]" aria-hidden />
              已保存
            </span>
          ) : null}
          <SaveButton saved={saved} onClick={handleSave} />
        </div>
      </div>
    </PanelBox>
  )
}

function AiAssistButton() {
  return (
    <button
      type="button"
      className="flex cursor-pointer items-center gap-2 rounded-[3px] px-3 py-[7px] text-[15px] leading-none font-medium text-(--ck-on-solid) transition-opacity hover:opacity-85"
      style={{ background: 'linear-gradient(90deg, var(--ck-btn-from), var(--ck-btn-to))' }}
    >
      <span
        className="flex h-[17px] w-[17px] items-center justify-center rounded-[2px] text-[11px] font-bold"
        style={{ background: 'rgba(255,255,255,0.25)' }}
      >
        AI
      </span>
      AI助手
    </button>
  )
}

/** 右下角保存按钮：实心主蓝渐变，与第四列「确认调整」同款 */
function SaveButton({ saved, onClick }: { saved: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-[37px] cursor-pointer items-center gap-2 rounded-[3px] border px-[22px] text-[17px] leading-none transition-opacity hover:opacity-85"
      style={{
        borderColor: 'transparent',
        background: 'linear-gradient(90deg, var(--ck-btn-from), var(--ck-btn-to))',
        color: 'var(--ck-on-solid)',
        boxShadow: 'var(--ck-card-shadow)',
      }}
    >
      <i className={`${saved ? 'ri-check-double-line' : 'ri-save-3-line'} text-[19px]`} aria-hidden />
      保存
    </button>
  )
}

interface AdjustCardProps {
  item: AdjustItem
  value: string
  editing: boolean
  onEnterEdit: () => void
  onExitEdit: () => void
  onChange: (next: string) => void
  /** Esc 取消，回到原始值 */
  onReset: () => void
}

/** 一张内嵌卡片：左边青色箭头图标 + 标签，右边内容（双击可编辑「调整后」值） */
function AdjustCard({
  item,
  value,
  editing,
  onEnterEdit,
  onExitEdit,
  onChange,
  onReset,
}: AdjustCardProps) {
  const rootRef = useRef<HTMLDivElement>(null)

  // 点卡片外部：关闭编辑态，保留当前输入（不回滚）
  useEffect(() => {
    if (!editing) return
    const handlePointerDown = (e: Event) => {
      if (!rootRef.current?.contains(e.target as Node)) onExitEdit()
    }
    document.addEventListener('pointerdown', handlePointerDown, true)
    return () => document.removeEventListener('pointerdown', handlePointerDown, true)
  }, [editing, onExitEdit])

  const cancel = () => {
    onReset()
    onExitEdit()
  }

  return (
    <div
      ref={rootRef}
      onDoubleClick={editing ? undefined : onEnterEdit}
      className={`ck-card group relative flex min-h-0 items-start rounded-[3px] px-[15px] py-[18px] ${
        editing ? '' : 'cursor-pointer'
      }`}
      style={{
        // 撑满列高用 weight 分配；编辑态浮层要能溢出卡片，所以不给 overflow-hidden
        flexGrow: item.weight,
        flexBasis: 0,
        marginTop: item.gapBefore ? 26 : undefined,
        borderColor: editing ? 'var(--ck-blue)' : undefined,
        zIndex: editing ? 40 : undefined,
      }}
    >
      {/* hover 时显现的编辑提示图标 */}
      {editing ? null : (
        <i
          className="ri-edit-line pointer-events-none absolute top-[7px] right-[9px] text-[15px] text-(--ck-cyan) opacity-0 transition-opacity group-hover:opacity-70"
          aria-hidden
        />
      )}

      <span className="flex w-[126px] shrink-0 items-center gap-2">
        <DoubleArrow />
        <span className="text-[17px] leading-none whitespace-nowrap text-(--ck-blue)">
          {item.label}
        </span>
      </span>

      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-[12px] gap-y-2">
        {item.prefix ? (
          <span className="text-[17px] leading-none text-(--foreground)">{item.prefix}</span>
        ) : null}

        {/* 调整前：原始值，始终只读 */}
        {item.from ? <ValueChip value={item.from} tone="before" /> : null}

        {editing ? (
          <AdjustEditorField item={item} value={value} onChange={onChange} onCancel={cancel} onCommit={onExitEdit} />
        ) : (
          <>
            {item.to ? (
              <ValueChip value={value} tone="after" className={item.from ? 'ml-[18px]' : ''} />
            ) : null}

            {item.note ? (
              <span className="text-[17px] leading-none text-(--foreground)">{item.note}</span>
            ) : null}

            {item.text ? (
              <span className="text-[17px] leading-[31px] whitespace-pre-line text-(--foreground)">
                {value}
              </span>
            ) : null}
          </>
        )}
      </div>
    </div>
  )
}

interface EditorFieldProps {
  item: AdjustItem
  value: string
  onChange: (next: string) => void
  /** Esc：回到原值并退出 */
  onCancel: () => void
  /** Enter / 失焦：保留输入并退出 */
  onCommit: () => void
}

/** 按卡片类型渲染编辑控件 */
function AdjustEditorField({ item, value, onChange, onCancel, onCommit }: EditorFieldProps) {
  if (item.editor === 'employee' || item.editor === 'department') {
    return (
      <SearchSelect
        autoFocus
        className={`w-[158px] ${item.from ? 'ml-[18px]' : ''}`}
        value={value}
        options={item.editor === 'employee' ? EMPLOYEE_OPTIONS : DEPARTMENT_OPTIONS}
        onPick={(next) => {
          onChange(next)
          onCommit()
        }}
        onInput={onChange}
        onCancel={onCancel}
      />
    )
  }

  if (item.editor === 'datetime') {
    return (
      <DateTimePicker
        autoFocus
        className={`w-[168px] ${item.from ? 'ml-[18px]' : ''}`}
        value={value}
        onPick={onChange}
        onCancel={onCancel}
      />
    )
  }

  // 文本编辑：原值含换行的用 textarea，单行用 input
  const multiline = (item.text ?? '').includes('\n')

  if (multiline) {
    return (
      <textarea
        autoFocus
        rows={2}
        aria-label={`${item.label}内容`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onCommit}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            e.preventDefault()
            onCancel()
          } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault()
            onCommit()
          }
        }}
        className="ck-scroll min-h-0 w-full flex-1 resize-none rounded-[3px] border border-(--ck-blue) bg-(--surface) px-[9px] py-[6px] text-[17px] leading-[26px] text-(--foreground) outline-none"
      />
    )
  }

  return (
    <input
      autoFocus
      aria-label={`${item.label}内容`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onCommit}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.preventDefault()
          onCancel()
        } else if (e.key === 'Enter') {
          e.preventDefault()
          onCommit()
        }
      }}
      className="w-[200px] rounded-[3px] border border-(--ck-blue) bg-(--surface) px-[9px] py-[6px] text-[17px] leading-[19px] text-(--foreground) outline-none"
    />
  )
}

/** 标签前的青色双箭头 */
function DoubleArrow() {
  return (
    <svg width="15" height="11" viewBox="0 0 15 11" fill="none" aria-hidden>
      <path
        d="M1 1.5L5 5.5L1 9.5"
        stroke="var(--ck-marker)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 1.5L12 5.5L8 9.5"
        stroke="var(--ck-marker)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.6"
      />
    </svg>
  )
}

function ValueChip({
  value,
  tone,
  className = '',
}: {
  value: string
  tone: 'before' | 'after'
  className?: string
}) {
  const color = tone === 'before' ? 'var(--ck-blue)' : 'var(--ck-orange)'

  return (
    <span
      className={`rounded-[3px] px-[9px] py-[4px] text-[17px] leading-[17px] whitespace-nowrap ${className}`}
      style={{
        color,
        border: `1px solid color-mix(in srgb, ${color} 45%, transparent)`,
        background: `color-mix(in srgb, ${color} 16%, transparent)`,
      }}
    >
      {value}
    </span>
  )
}


