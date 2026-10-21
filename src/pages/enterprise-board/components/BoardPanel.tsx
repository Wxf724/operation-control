import type { ReactNode } from 'react'

import { PanelBox } from '@/components/cockpit-ui'

/**
 * 企业数据看板的面板外壳。
 *
 * 与参考稿一致：标题右侧跟一个「»」展开箭头，点击后可进一步钻取（当前为占位交互）。
 *
 * 面板是四列网格的网格项，而网格项默认 `min-height: auto`（= min-content），
 * 内容一多就会把整行撑高、把下面的内容顶出画布；所以外壳显式 `min-h-0`，
 * 超出的部分交给面板内部的滚动区处理。
 */
export function BoardPanel({
  title,
  className = '',
  bodyClassName = '',
  children,
}: {
  title: string
  className?: string
  bodyClassName?: string
  children: ReactNode
}) {
  return (
    <PanelBox
      title={
        <span className="flex items-center gap-1.5">
          {title}
          <span
            className="text-[16px] leading-none font-normal text-(--ck-title-sub) opacity-70"
            aria-hidden
          >
            »
          </span>
        </span>
      }
      className={`flex min-h-0 min-w-0 flex-col ${className}`}
      bodyClassName={`flex min-h-0 flex-1 flex-col ${bodyClassName}`}
    >
      {children}
    </PanelBox>
  )
}
