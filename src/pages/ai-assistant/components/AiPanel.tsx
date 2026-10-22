import type { ReactNode } from 'react'

import { PanelBox, TitleMarker } from '@/components/cockpit-ui'

export interface AiPanelProps {
  title: string
  /** 标题下方的灰色说明行 */
  subtitle?: ReactNode
  /** 标题行右侧区域（下拉、图例、按钮等） */
  extra?: ReactNode
  /** 标题前是否加三角标记（参考稿里第三、四栏的标题带标记，前两栏不带） */
  marker?: boolean
  className?: string
  children: ReactNode
}

/**
 * 智能运营调控页四栏共用的面板外壳。
 *
 * 不走 `PanelBox` 自带的 title（那套是「标题 + 渐隐横线」的大屏语言），
 * 参考稿里是「大标题 + 副标题」两行、无分隔线，所以自己画标题区，
 * 只借用 `PanelBox` 的卡片底／圆角／投影。
 */
export function AiPanel({
  title,
  subtitle,
  extra,
  marker = false,
  className = '',
  children,
}: AiPanelProps) {
  return (
    <PanelBox
      className={`flex min-h-0 flex-col ${className}`}
      bodyClassName="flex min-h-0 flex-col"
    >
      <div className="flex shrink-0 items-start justify-between gap-3 px-4 pt-3.5 pb-2">
        <div className="flex min-w-0 flex-col gap-1.5">
          <h3 className="flex items-center gap-2 text-[22px] leading-none font-bold tracking-wide text-(--ck-title)">
            {marker ? <TitleMarker /> : null}
            {title}
          </h3>
          {subtitle ? (
            <span className="text-[14px] leading-none text-(--text-secondary)">{subtitle}</span>
          ) : null}
        </div>
        {extra ? <div className="flex shrink-0 items-center gap-3">{extra}</div> : null}
      </div>

      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </PanelBox>
  )
}
