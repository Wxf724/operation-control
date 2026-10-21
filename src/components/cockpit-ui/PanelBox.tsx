import type { ReactNode } from 'react'

/** 大屏面板外壳：半透明底 + 描边 + 四角装饰 + 可选标题栏 */
export interface PanelBoxProps {
  /** 面板标题，省略则只渲染外壳 */
  title?: ReactNode
  /** 标题右侧区域（切换、按钮等） */
  extra?: ReactNode
  /** 是否绘制四角装饰线 */
  corners?: boolean
  className?: string
  bodyClassName?: string
  children: ReactNode
}

export function PanelBox({
  title,
  extra,
  corners = true,
  className = '',
  bodyClassName = '',
  children,
}: PanelBoxProps) {
  return (
    <div className={`ck-panel relative rounded-(--ck-panel-radius) ${className}`}>
      {corners ? <PanelCorners /> : null}

      {title ? (
        <div className="flex shrink-0 items-center justify-between gap-3 px-4 pt-3 pb-2">
          <h3 className="flex items-center gap-2 text-(length:--ck-fs-panel-title) leading-none font-bold tracking-wide text-(--ck-title)">
            <TitleMarker />
            {title}
          </h3>
          {extra ? <div className="flex items-center gap-2">{extra}</div> : null}
        </div>
      ) : null}

      {title ? <div className="ck-head-rule mx-4 h-px shrink-0" /> : null}

      {/*
        面板多数以 `flex flex-col` 使用，内容区必须能撑开剩余高度，
        否则里面写 `h-full` 的图表会因父级高度为 auto 而塌成 0。
        `flex-1` 在非 flex 容器里会被忽略，所以无副作用。
      */}
      <div className={`relative min-h-0 flex-1 ${bodyClassName}`}>{children}</div>
    </div>
  )
}

/** 面板四角的 L 形装饰线；浅色主题可整体隐藏（见 cloud-light.css 的 .ck-corner） */
function PanelCorners() {
  const base = 'ck-corner pointer-events-none absolute h-[10px] w-[10px] border-(--ck-marker)'
  return (
    <>
      <span className={`${base} top-[-1px] left-[-1px] border-t-2 border-l-2`} />
      <span className={`${base} top-[-1px] right-[-1px] border-t-2 border-r-2`} />
      <span className={`${base} bottom-[-1px] left-[-1px] border-b-2 border-l-2`} />
      <span className={`${base} right-[-1px] bottom-[-1px] border-r-2 border-b-2`} />
    </>
  )
}

/** 标题前的菱形/箭头标记 */
export function TitleMarker() {
  return (
    <svg width="11" height="12" viewBox="0 0 11 12" fill="none" aria-hidden="true">
      <path d="M0 0L6 6L0 12V0Z" fill="var(--ck-marker)" opacity="0.95" />
      <path d="M6 1.5L10.5 6L6 10.5V1.5Z" fill="var(--ck-marker)" opacity="0.4" />
    </svg>
  )
}

/** 面板内的二级小标题，如"提醒事项""AI调控策略" */
export interface SectionTitleProps {
  children: ReactNode
  className?: string
  extra?: ReactNode
}

export function SectionTitle({ children, className = '', extra }: SectionTitleProps) {
  return (
    <div className={`flex items-center justify-between gap-2 ${className}`}>
      <div className="flex items-center gap-1.5">
        <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true">
          <path d="M0 4.5L4.5 0L9 4.5L4.5 9L0 4.5Z" fill="var(--ck-marker)" />
        </svg>
        <span className="text-(length:--ck-fs-section-title) leading-none font-semibold text-(--ck-title-sub)">
          {children}
        </span>
      </div>
      {extra}
    </div>
  )
}
