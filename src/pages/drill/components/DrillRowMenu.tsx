/** 跳转列菜单里的一项 */
export interface DrillRowMenuOption {
  key: string
  label: string
  /** Remix Icon 类名 */
  icon?: string
}

/** 行点击后就地弹出的「跳转列」菜单 */
export interface DrillRowMenuProps {
  /** 视口坐标：一般直接取鼠标事件的 clientX / clientY */
  x: number
  y: number
  options: readonly DrillRowMenuOption[]
  onPick: (key: string) => void
  onClose: () => void
}

/**
 * 行点击后就地弹出的「跳转列」菜单（参考图 9）。
 *
 * 点击表格里的某一行时，在该行的鼠标位置弹出一张小菜单，
 * 「申诉明细」「争议明细」各是一条去向；点空白处即关闭。
 */
export function DrillRowMenu({ x, y, options, onPick, onClose }: DrillRowMenuProps) {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} aria-hidden />

      <div
        className="fixed z-50 w-[196px] overflow-hidden rounded-[8px] border border-(--border) bg-(--surface) py-1"
        style={{ left: x, top: y, boxShadow: '0 10px 24px rgba(42, 102, 232, 0.18)' }}
        role="menu"
      >
        <span className="flex items-center gap-1 px-3 py-1.5 text-[13px] leading-none text-(--text-tertiary)">
          <i className="ri-arrow-right-s-line text-[15px]" aria-hidden />
          跳转列
        </span>

        {options.map((option) => (
          <button
            key={option.key}
            type="button"
            role="menuitem"
            onClick={() => onPick(option.key)}
            className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-[14px] leading-none text-(--ck-title-sub) transition-colors hover:bg-(--accent-light)"
          >
            <i className={option.icon ?? 'ri-file-list-3-line'} aria-hidden />
            {option.label}
          </button>
        ))}
      </div>
    </>
  )
}
