import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

/** 大屏容器的定位方式：`fixed` 铺满视口（默认）／`absolute` 相对所在的定位祖先 */
export type ScreenLayout = 'fixed' | 'absolute'

/**
 * 缩放模式：
 * - `fit`：完整显示设计稿，比例不符时左右/上下留边
 * - `cover`：铺满视口，超出部分裁切
 * - `fill`：按 fit 比例缩放（字号跟着走），但版面盒反向放大到「视口 / 缩放比」，
 *   于是四边刚好铺满、内容不被裁——版面内部靠 flex 吸收多余宽高。
 *   首页三页用它，任何屏幕比例都不留空。
 */
export type ScreenScaleMode = 'fit' | 'cover' | 'fill'

/** 大屏等比缩放容器：按固定设计稿尺寸渲染，再整体缩放贴合视口 */
export interface ScreenScalerProps {
  /** 设计稿宽度（px） */
  width: number
  /** 设计稿高度（px） */
  height: number
  /** 缩放模式，默认 `fit` */
  mode?: ScreenScaleMode
  /**
   * 定位方式（默认 `fixed`，铺满整个视口）。
   *
   * 首页三屏轮播把整屏放进横向轨道里，各屏要相对自己的轨道格定位，
   * 这时传 `absolute`（轨道格是 `relative`），否则三屏会重叠在视口上。
   */
  layout?: ScreenLayout
  children: ReactNode
}

export function ScreenScaler({
  width,
  height,
  mode = 'fit',
  layout = 'fixed',
  children,
}: ScreenScalerProps) {
  const [viewport, setViewport] = useState({ w: width, h: height })

  useEffect(() => {
    const compute = () => setViewport({ w: window.innerWidth, h: window.innerHeight })
    compute()
    window.addEventListener('resize', compute)
    return () => window.removeEventListener('resize', compute)
  }, [])

  const sx = viewport.w / width
  const sy = viewport.h / height
  const fitScale = Math.min(sx, sy)

  if (mode === 'fill') {
    return (
      <div className={`ck-screen ${layout} inset-0 overflow-hidden`}>
        <div
          className="absolute top-0 left-0"
          style={{
            // 版面盒反向放大：缩放后正好等于视口，四边不留空、内容也不裁
            width: fitScale > 0 ? viewport.w / fitScale : width,
            height: fitScale > 0 ? viewport.h / fitScale : height,
            transform: `scale(${fitScale})`,
            transformOrigin: 'top left',
          }}
        >
          {children}
        </div>
      </div>
    )
  }

  const scale = mode === 'cover' ? Math.max(sx, sy) : fitScale

  return (
    <div className={`ck-screen ${layout} inset-0 overflow-hidden`}>
      <div
        className="absolute top-1/2 left-1/2"
        style={{
          width,
          height,
          transform: `translate(-50%, -50%) scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
        {children}
      </div>
    </div>
  )
}
