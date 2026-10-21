import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

/** 大屏等比缩放容器：按固定设计稿尺寸渲染，再整体缩放贴合视口 */
export interface ScreenScalerProps {
  /** 设计稿宽度（px） */
  width: number
  /** 设计稿高度（px） */
  height: number
  /** 缩放模式：fit 完整显示（留黑边）/ cover 铺满（可能裁切） */
  mode?: 'fit' | 'cover'
  children: ReactNode
}

export function ScreenScaler({ width, height, mode = 'fit', children }: ScreenScalerProps) {
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const compute = () => {
      const sx = window.innerWidth / width
      const sy = window.innerHeight / height
      setScale(mode === 'cover' ? Math.max(sx, sy) : Math.min(sx, sy))
    }
    compute()
    window.addEventListener('resize', compute)
    return () => window.removeEventListener('resize', compute)
  }, [width, height, mode])

  return (
    <div className="ck-screen fixed inset-0 overflow-hidden">
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
