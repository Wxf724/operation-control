import { useNavigate } from 'react-router-dom'

/** 面板标题上的钻取入口 */
export interface DrillTitleLinkProps {
  /** 标题文字 */
  title: string
  /** 点击后跳转的路由 */
  to: string
}

/**
 * 平台页面板标题上的钻取入口：标题点一下就进对应的明细页。
 *
 * 点击区域是标题文字加末尾的「›」，鼠标移上去加下划线提示可点；
 * 颜色继承 `PanelBox` 的标题样式，不额外分层级。
 */
export function DrillTitleLink({ title, to }: DrillTitleLinkProps) {
  const navigate = useNavigate()

  return (
    <button
      type="button"
      title={`查看${title}明细`}
      onClick={() => navigate(to)}
      className="inline-flex cursor-pointer items-center gap-0.5 text-inherit underline-offset-[3px] transition-opacity hover:underline hover:opacity-80"
    >
      {title}
      <i className="ri-arrow-right-s-line text-[16px] leading-none" aria-hidden />
    </button>
  )
}
