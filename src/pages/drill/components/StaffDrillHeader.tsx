/** 员工钻取页顶部条 */
export interface StaffDrillHeaderProps {
  /** 页面名称 */
  title: string
  className?: string
}

/**
 * 员工管理平台五个钻取页共用的顶部条：只显示页名。
 *
 * 参考图 54~58 是截取的内容区，本身没有画顶部条；
 * 这里补一条极简的用来说明当前是哪一页。
 */
export function StaffDrillHeader({ title, className = '' }: StaffDrillHeaderProps) {
  return (
    <div
      className={`ck-panel flex shrink-0 items-center gap-3 rounded-(--ck-panel-radius) px-5 ${className}`}
    >
      <span className="flex items-center gap-2 text-[19px] leading-none font-bold text-(--ck-title)">
        <i className="ri-team-line text-[21px] text-(--ck-cyan)" aria-hidden />
        {title}
      </span>
    </div>
  )
}
