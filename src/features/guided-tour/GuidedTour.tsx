import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import { TOUR_STEPS } from './steps'

interface TourControl {
  start: () => void
  stop: () => void
}

declare global {
  interface Window {
    cockpitTour?: TourControl
  }
}

/** 无可见 UI 的只读巡览控制器；仅触发路线白名单里的现有入口。 */
export function GuidedTour() {
  const navigate = useNavigate()
  const navigation = useRef(navigate)
  useEffect(() => { navigation.current = navigate }, [navigate])

  useEffect(() => {
    let run: AbortController | undefined
    const stop = () => {
      run?.abort()
      run = undefined
    }
    const start = () => {
      stop()
      const controller = new AbortController()
      run = controller
      const { signal } = controller

      const wait = (ms: number) => new Promise<void>((resolve, reject) => {
        if (signal.aborted) { reject(new DOMException('Stopped', 'AbortError')); return }
        const onAbort = () => {
          window.clearTimeout(timer)
          reject(new DOMException('Stopped', 'AbortError'))
        }
        const timer = window.setTimeout(() => {
          signal.removeEventListener('abort', onAbort)
          resolve()
        }, ms)
        signal.addEventListener('abort', onAbort, { once: true })
      })

      const find = async (selector: string) => {
        for (let attempt = 0; attempt < 60; attempt++) {
          signal.throwIfAborted()
          const element = document.querySelector<HTMLButtonElement>(selector)
          if (element && !element.disabled) return element
          await wait(100)
        }
        throw new Error(`巡览入口未就绪：${selector}`)
      }

      const play = async () => {
        while (!signal.aborted) {
          for (const step of TOUR_STEPS) {
            signal.throwIfAborted()
            if (step.type === 'home') {
              navigation.current('/', { replace: true })
              await find('[data-tour-module="job"]')
            } else if (step.type === 'back') {
              navigation.current(-1)
            } else if (step.type === 'click') {
              const element = await find(step.selector)
              signal.throwIfAborted()
              element.click()
              if (step.double) element.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }))
            }
            await wait(10_000)
          }
        }
      }

      void play().catch((error: unknown) => {
        if (!signal.aborted) {
          console.error('[cockpitTour] 巡览已停止', error)
          if (run === controller) stop()
        }
      })
    }

    window.cockpitTour = { start, stop }
    // 真实鼠标、触屏或键盘点击接管；巡览自身的程序点击不会中断。
    const onUserClick = (event: Event) => {
      if (event.isTrusted) stop()
    }
    document.addEventListener('pointerdown', onUserClick, true)
    document.addEventListener('click', onUserClick, true)
    start()

    return () => {
      stop()
      document.removeEventListener('pointerdown', onUserClick, true)
      document.removeEventListener('click', onUserClick, true)
      delete window.cockpitTour
    }
  }, [])

  return null
}
