import { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import type { ScreenLayout } from '@/components/cockpit-ui'

import { COCKPIT_DEFAULT_PAGE, COCKPIT_PAGE_LABELS } from './constants'
import { MapScreen } from './screens/MapScreen'
import { ModelScreen } from './screens/ModelScreen'
import { OverviewScreen } from './screens/OverviewScreen'

/**
 * 首页三页轮播：把原来横向并排的三栏立成三页，放进一条横向轨道，
 * 左右滑动（触屏 / 鼠标拖拽 / ←→ 键 / 横向滚轮 / 两侧箭头）换页。
 *
 * 顺序与原来没拆时一致（左 → 中 → 右）：
 *   第 1 页 运营结果与趋势 · 第 2 页 全景座舱（地图页，**默认停在这一页**）· 第 3 页 模型执行与操作。
 * 每一页都是整屏（统一 16:9 画布，等比缩放到视口正好铺满）；`ScreenScaler` 用
 * `absolute` 让它相对轨道格定位，滑到哪一页就显示哪一页。
 *
 * 当前页写进 URL 的 `?p=`（1 起）：`/?p=3` 可直落第三页，不带参数就是地图页。
 */

interface Slide {
  key: string
  Screen: (props: { screenLayout?: ScreenLayout }) => React.JSX.Element
}

const SLIDES: Slide[] = [
  { key: 'overview', Screen: OverviewScreen },
  { key: 'map', Screen: MapScreen },
  { key: 'model', Screen: ModelScreen },
]

/** 每页的名字，用于箭头/圆点的 aria 与 title 文案 */
const SLIDE_LABELS = COCKPIT_PAGE_LABELS

/** 拖拽超过视口宽度的这个比例才算翻页，避免误触 */
const SWIPE_RATIO = 0.12
/** 手指/鼠标横向移动超过这个像素才进入拖拽态（小于它照旧是点击） */
const DRAG_THRESHOLD = 12

export function CockpitPager() {
  const [searchParams, setSearchParams] = useSearchParams()

  // ?p= 是 1 起的页码；不带参数 / 越界 / 非法都回落到默认页（地图页）
  const pageParam = Number(searchParams.get('p') ?? String(COCKPIT_DEFAULT_PAGE + 1))
  const index = Number.isFinite(pageParam)
    ? Math.min(Math.max(Math.trunc(pageParam) - 1, 0), SLIDES.length - 1)
    : COCKPIT_DEFAULT_PAGE

  const rootRef = useRef<HTMLDivElement>(null)
  const startRef = useRef<{ x: number; y: number } | null>(null)
  const draggingRef = useRef(false)
  const suppressClickRef = useRef(false)
  const wheelLockRef = useRef(0)

  const [dragX, setDragX] = useState(0)
  const [dragging, setDragging] = useState(false)

  /** 翻页控件（两侧箭头 + 右下圆点）：操作时完全显示，静置 2.5 秒后淡下去不挡画面 */
  const [controlsActive, setControlsActive] = useState(true)

  const goTo = useCallback(
    (next: number) => {
      const target = Math.min(Math.max(next, 0), SLIDES.length - 1)
      if (target === index) return
      const params = new URLSearchParams(searchParams)
      // 默认页不带参数，URL 保持干净
      if (target === COCKPIT_DEFAULT_PAGE) params.delete('p')
      else params.set('p', String(target + 1))
      setSearchParams(params, { replace: true })
    },
    [index, searchParams, setSearchParams]
  )

  // 静置后把翻屏控件淡下去（每次操作都会重新计时）
  const idleTimerRef = useRef<number | undefined>(undefined)
  const wakeControls = useCallback(() => {
    setControlsActive(true)
    window.clearTimeout(idleTimerRef.current)
    idleTimerRef.current = window.setTimeout(() => setControlsActive(false), 2500)
  }, [])

  useEffect(() => () => window.clearTimeout(idleTimerRef.current), [])

  useEffect(() => {
    wakeControls()
  }, [index, wakeControls])

  // ← → 翻屏（焦点在输入控件里时不抢键）
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null
      const tag = el?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el?.isContentEditable) return
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goTo(index - 1)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        goTo(index + 1)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [goTo, index])

  /** 拖到首/尾屏时给一段阻尼，手感上有「到头了」的反馈 */
  const resist = (dx: number) => {
    const atStart = index === 0 && dx > 0
    const atEnd = index === SLIDES.length - 1 && dx < 0
    return atStart || atEnd ? dx * 0.3 : dx
  }

  const endDrag = (clientX?: number) => {
    if (startRef.current) {
      const width = rootRef.current?.clientWidth ?? 1
      const dx = clientX === undefined ? dragX : clientX - startRef.current.x
      if (draggingRef.current) {
        suppressClickRef.current = true
        window.setTimeout(() => {
          suppressClickRef.current = false
        }, 320)
        if (Math.abs(dx) > width * SWIPE_RATIO) goTo(index + (dx < 0 ? 1 : -1))
      }
    }
    startRef.current = null
    draggingRef.current = false
    setDragging(false)
    setDragX(0)
  }

  const handlePointerDown = (e: React.PointerEvent) => {
    wakeControls()
    if (e.pointerType === 'mouse' && e.button !== 0) return
    startRef.current = { x: e.clientX, y: e.clientY }
    draggingRef.current = false
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    wakeControls()
    const start = startRef.current
    if (!start) return
    const dx = e.clientX - start.x
    const dy = e.clientY - start.y

    if (!draggingRef.current) {
      // 横向位移明显大于纵向才认定为翻屏手势
      if (Math.abs(dx) < DRAG_THRESHOLD || Math.abs(dx) <= Math.abs(dy)) return
      draggingRef.current = true
      setDragging(true)
    }
    setDragX(resist(dx))
  }

  const handlePointerUp = (e: React.PointerEvent) => endDrag(e.clientX)

  /** 拖拽结束时浏览器还会补一个 click，这里吞掉，避免误触屏内的按钮 */
  const handleClickCapture = (e: React.MouseEvent) => {
    if (!suppressClickRef.current) return
    e.stopPropagation()
    e.preventDefault()
  }

  const handleWheel = (e: React.WheelEvent) => {
    wakeControls()
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || Math.abs(e.deltaX) < 24) return
    const now = Date.now()
    if (now - wheelLockRef.current < 700) return
    wheelLockRef.current = now
    goTo(index + (e.deltaX > 0 ? 1 : -1))
  }

  const offset = dragX === 0 ? `-${index * 100}%` : `calc(-${index * 100}% + ${dragX}px)`

  return (
    <div
      ref={rootRef}
      className="theme-cloud-light relative h-screen w-screen overflow-hidden select-none"
      style={{ touchAction: 'pan-y' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => endDrag()}
      onPointerLeave={() => endDrag()}
      onClickCapture={handleClickCapture}
      onWheel={handleWheel}
    >
      <div
        className="flex h-full w-full"
        style={{
          transform: `translate3d(${offset}, 0, 0)`,
          transition: dragging ? 'none' : 'transform 520ms cubic-bezier(0.22, 0.61, 0.36, 1)',
          cursor: dragging ? 'grabbing' : undefined,
        }}
      >
        {SLIDES.map(({ key, Screen }) => (
          <div key={key} className="relative h-full w-full shrink-0 overflow-hidden">
            <Screen screenLayout="absolute" />
          </div>
        ))}
      </div>

      {/* 翻屏控件：静置时淡到 0.25，操作时恢复；外层不挡点击 */}
      <div
        className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-500"
        style={{ opacity: controlsActive ? 1 : 0.25 }}
      >
        <PagerArrow
          direction="prev"
          disabled={index === 0}
          label={SLIDE_LABELS[Math.max(index - 1, 0)]}
          onClick={() => goTo(index - 1)}
        />
        <PagerArrow
          direction="next"
          disabled={index === SLIDES.length - 1}
          label={SLIDE_LABELS[Math.min(index + 1, SLIDES.length - 1)]}
          onClick={() => goTo(index + 1)}
        />

        {/* 页码：放右下角（三页的底部中间都有内容，居中会压住面板），点圆点可直接跳页 */}
        <div
          className="pointer-events-auto absolute right-4 bottom-3 flex items-center gap-2 rounded-full px-2.5 py-1"
          style={{
            background: 'color-mix(in srgb, var(--surface) 82%, transparent)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--ck-card-shadow)',
          }}
        >
          {SLIDES.map((slide, i) => {
            const active = i === index
            return (
              <button
                key={slide.key}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`第 ${i + 1} 页：${SLIDE_LABELS[i]}`}
                aria-current={active ? 'true' : undefined}
                title={`第 ${i + 1} 页：${SLIDE_LABELS[i]}`}
                className="h-[7px] cursor-pointer rounded-full transition-all"
                style={{
                  width: active ? 20 : 7,
                  background: active ? 'var(--ck-cyan)' : 'var(--border)',
                }}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

/** 两侧翻屏箭头：到头时置灰不可点 */
function PagerArrow({
  direction,
  disabled,
  label,
  onClick,
}: {
  direction: 'prev' | 'next'
  disabled: boolean
  label: string
  onClick: () => void
}) {
  const isPrev = direction === 'prev'

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={isPrev ? `上一页：${label}` : `下一页：${label}`}
      title={isPrev ? `上一页：${label}` : `下一页：${label}`}
      className={`pointer-events-auto absolute top-1/2 flex h-[42px] w-[42px] -translate-y-1/2 items-center justify-center rounded-full transition-opacity ${
        isPrev ? 'left-4' : 'right-4'
      } ${disabled ? 'cursor-default opacity-0' : 'cursor-pointer hover:opacity-80'}`}
      style={{
        background: 'color-mix(in srgb, var(--surface) 82%, transparent)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--ck-card-shadow)',
        color: 'var(--ck-cyan)',
      }}
    >
      <i
        className={`${isPrev ? 'ri-arrow-left-s-line' : 'ri-arrow-right-s-line'} text-[24px]`}
        aria-hidden
      />
    </button>
  )
}
