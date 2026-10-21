import type { ReactNode } from 'react'

import { PanelBox } from '@/components/cockpit-ui'

export interface AiPanelProps {
  title: string
  /** 标题下方的灰色说明行 */
  subtitle?: ReactNode
  /** 标题行右侧区域（下拉、图例等） */
  extra?: ReactNode
  className?: string
  children: ReactNode
}

/**
 * 智能运营调控页三栏共用的面板外壳。
 *
 * 不走 `PanelBox` 自带的 title（那套是「标题 + 渐隐横线」的大屏语言），
 * 参考稿里是「大标题 + 副标题」两行、无分隔线，所以自己画标题区，
 * 只借用 `PanelBox` 的卡片底／圆角／投影。
 */
export function AiPanel({ title, subtitle, extra, className = '', children }: AiPanelProps) {
  return (
    <PanelBox
      className={`flex min-h-0 flex-col ${className}`}
      bodyClassName="flex min-h-0 flex-col"
    >
      <div className="flex shrink-0 items-start justify-between gap-3 px-4 pt-3.5 pb-2">
        <div className="flex min-w-0 flex-col gap-1.5">
          <h3 className="text-[22px] leading-none font-bold tracking-wide text-(--ck-title)">
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
