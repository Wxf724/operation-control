import { useNavigate } from 'react-router-dom'

import { STAFF_DRILL_BACK_PATH } from '../staffConstants'

/** 员工钻取页顶部条 */
export interface StaffDrillHeaderProps {
  /** 页面名称，显示在左侧 */
  title: string
  className?: string
}

/**
 * 员工管理平台三个钻取页共用的顶部条：页名 + 返回入口。
 *
 * 参考图 54~56 是截取的内容区，本身没有画顶部条；
 * 这里补一条极简的，保证用户点进来之后能退回 `/platform/staff`，
 * 样式与 `DrillFilterBar` 的返回按钮保持一致。
 */
export function StaffDrillHeader({ title, className = '' }: StaffDrillHeaderProps) {
  const navigate = useNavigate()

  return (
    <div
      className={`ck-panel flex shrink-0 items-center justify-between gap-3 rounded-(--ck-panel-radius) px-5 ${className}`}
    >
      <span className="flex items-center gap-2 text-[19px] leading-none font-bold text-(--ck-title)">
        <i className="ri-team-line text-[21px] text-(--ck-cyan)" aria-hidden />
        {title}
      </span>

      <button
        type="button"
        onClick={() => navigate(STAFF_DRILL_BACK_PATH)}
        className="flex cursor-pointer items-center gap-1.5 rounded-[6px] px-3.5 py-[8px] text-[14px] leading-none font-medium text-white transition-opacity hover:opacity-85"
        style={{
          background: 'linear-gradient(90deg, var(--ck-btn-from), var(--ck-btn-to))',
          boxShadow: '0 3px 8px rgba(42, 102, 232, 0.28)',
        }}
      >
        <i className="ri-arrow-left-line text-[15px]" aria-hidden />
        返回员工管理平台
      </button>
    </div>
  )
}
