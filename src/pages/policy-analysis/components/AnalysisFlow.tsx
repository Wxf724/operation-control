import { Fragment, useId } from 'react'
import type { CSSProperties } from 'react'

import { AI_BADGES, ANALYSIS_STEPS } from '../constants'
import type { AnalysisStep } from '../types'

/**
 * 智能分析五步流程 + 右侧 AI 立方。
 * 目标稿（画布 px）：流程区 824（5 张 140 卡 + 4 个 31 箭头）+ 立方 250 + 徽章 164 = 1238。
 */
export function AnalysisFlow({
  className = '',
  style,
}: {
  className?: string
  style?: CSSProperties
}) {
  return (
    <div className={`flex items-stretch ${className}`} style={style}>
      <div className="flex w-[824px] shrink-0 items-stretch">
        {ANALYSIS_STEPS.map((step, i) => (
          <Fragment key={step.key}>
            {i > 0 ? <FlowArrow /> : null}
            <StepCard step={step} />
          </Fragment>
        ))}
      </div>

      <AiCube />

      <div className="flex w-[164px] shrink-0 flex-col justify-center gap-[22px] pl-[14px]">
        {AI_BADGES.map((badge) => (
          <span key={badge.label} className="flex items-center gap-2 whitespace-nowrap">
            <i className={`${badge.icon} text-[18px] text-(--ck-cyan)`} aria-hidden />
            <span className="text-[16px] leading-none text-(--ck-title-sub)">{badge.label}</span>
          </span>
        ))}
      </div>
    </div>
  )
}

function StepCard({ step }: { step: AnalysisStep }) {
  return (
    <div
      className="flex min-w-0 flex-1 flex-col items-center justify-center rounded-[5px] border px-[8px] py-[18px]"
      style={{
        borderColor: 'var(--ck-card-border)',
        background: 'linear-gradient(180deg, var(--ck-card-from) 0%, var(--ck-card-to) 100%)',
        boxShadow: 'var(--ck-card-shadow)',
      }}
    >
      <span
        className="flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-[8px] text-[28px] text-(--ck-cyan)"
        style={{
          background: 'linear-gradient(180deg, var(--ck-icon-from), var(--ck-icon-to))',
          boxShadow: 'var(--ck-icon-glow)',
        }}
      >
        <i className={step.icon} aria-hidden />
      </span>

      <span className="mt-[12px] text-[17px] leading-none font-semibold whitespace-nowrap text-(--ck-title-sub)">
        {step.title}
      </span>

      <div className="mt-[10px] flex flex-col items-center gap-[4px]">
        {step.lines.map((line) => (
          <span
            key={line}
            className="text-center text-[13px] leading-tight whitespace-nowrap text-(--text-tertiary)"
          >
            {line}
          </span>
        ))}
      </div>
    </div>
  )
}

function FlowArrow() {
  return (
    <span className="flex w-[31px] shrink-0 items-center justify-center text-[26px] text-(--ck-blue)">
      <i className="ri-arrow-right-s-fill" aria-hidden />
    </span>
  )
}

/**
 * 右侧 AI 立方。
 * 浅蓝白主题下不做霓虹外发光：顶面走白→高亮蓝的玻璃高光，
 * 左右两面走高亮蓝→主蓝→深蓝做体积，棱线用白色描边，底部用落地投影 + 淡蓝光环收口。
 */
function AiCube() {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const top = `cube-top-${uid}`
  const left = `cube-left-${uid}`
  const right = `cube-right-${uid}`
  const shadow = `cube-shadow-${uid}`

  return (
    <div className="relative flex w-[250px] shrink-0 items-center justify-center">
      <svg width="164" height="164" viewBox="0 0 118 118" fill="none" aria-hidden>
        <defs>
          <linearGradient id={top} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="var(--ck-blue)" />
          </linearGradient>
          <linearGradient id={left} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--ck-blue)" />
            <stop offset="100%" stopColor="var(--ck-cyan)" />
          </linearGradient>
          <linearGradient id={right} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--ck-cyan)" />
            <stop offset="100%" stopColor="var(--foreground)" stopOpacity="0.92" />
          </linearGradient>
          {/* 落地投影：取代深色主题的外发光 */}
          <radialGradient id={shadow} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="var(--ck-cyan)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--ck-cyan)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 落地投影 */}
        <ellipse cx="59" cy="107" rx="46" ry="8" fill={`url(#${shadow})`} />

        {/* 立方体三面 */}
        <path d="M59 16L100 38L59 60L18 38L59 16Z" fill={`url(#${top})`} />
        <path d="M18 38L59 60V102L18 80V38Z" fill={`url(#${left})`} />
        <path d="M100 38L59 60V102L100 80V38Z" fill={`url(#${right})`} />

        {/* 棱线：白色描边把三个面分开 */}
        <path
          d="M59 16L100 38L59 60L18 38L59 16ZM18 38V80L59 102L100 80V38"
          stroke="#ffffff"
          strokeOpacity="0.75"
          strokeWidth="1.2"
          fill="none"
        />
        <path d="M59 60V102" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="1.2" />
      </svg>

      {/* 文字下移 16px，落在左右两个实心面上才读得清 */}
      <span
        className="pointer-events-none absolute translate-y-[16px] text-[36px] font-bold tracking-wider text-(--ck-on-solid)"
        style={{ textShadow: '0 1px 3px rgba(27,47,99,0.45)' }}
      >
        AI
      </span>

      {/* 底部光环 */}
      <svg
        className="pointer-events-none absolute bottom-[14px] left-1/2 -translate-x-1/2"
        width="210"
        height="54"
        viewBox="0 0 210 54"
        fill="none"
        aria-hidden
      >
        <ellipse cx="105" cy="27" rx="100" ry="22" stroke="var(--ck-blue)" strokeOpacity="0.4" />
        <ellipse cx="105" cy="27" rx="76" ry="16" stroke="var(--ck-blue)" strokeOpacity="0.28" />
        <ellipse cx="105" cy="27" rx="52" ry="10" stroke="var(--ck-cyan)" strokeOpacity="0.2" />
      </svg>
    </div>
  )
}
