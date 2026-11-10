import { useEffect, useRef } from 'react'
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'framer-motion'

/** 指标首次进入视口或数值变化时递增；保留原始精度、千分位及占位宽度。 */
export function AnimatedNumber({ value }: { value: string | number }) {
  const text = String(value)
  const match = /^([+-]?)(\d[\d,]*)(?:\.(\d+))?(%?)$/.exec(text)
  const target = match ? Number(text.replace(/[,%]/g, '')) : 0
  const decimals = match?.[3]?.length ?? 0
  const grouped = Boolean(match?.[2].includes(','))
  const prefix = match?.[1] === '+' ? '+' : ''
  const suffix = match?.[4] ?? ''
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reducedMotion = useReducedMotion()
  const current = useMotionValue(reducedMotion ? target : 0)
  const display = useTransform(current, (number) => {
    if (!match || number === target) return text
    return `${prefix}${number.toLocaleString('en-US', {
      useGrouping: grouped,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}${suffix}`
  })

  useEffect(() => {
    if (reducedMotion !== false) {
      current.set(target)
      return
    }
    if (!inView) return
    current.set(0)
    const animation = animate(current, target, { duration: 0.9, ease: [0.22, 1, 0.36, 1] })
    return () => animation.stop()
  }, [current, inView, reducedMotion, target])

  return (
    <span ref={ref} className="ck-animated-number inline-grid tabular-nums">
      <span className="sr-only">{text}</span>
      <span aria-hidden className="invisible [grid-area:1/1]">
        {text}
      </span>
      <motion.span aria-hidden className="text-right [grid-area:1/1]">
        {display}
      </motion.span>
    </span>
  )
}
