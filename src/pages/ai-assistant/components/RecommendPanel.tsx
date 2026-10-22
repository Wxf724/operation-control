import { SectionTitle } from '@/components/cockpit-ui'

import {
  ALT_PLANS,
  ALT_PLAN_COUNT_TEXT,
  PLAN_ALT_TITLE,
  PLAN_DETAIL_BUTTON,
  PLAN_HEADLINE,
  PLAN_MAIN_TITLE,
  PLAN_ROWS,
  PLAN_TITLE,
} from '../constants'
import type { AltPlan } from '../types'

import { AiPanel } from './AiPanel'

/**
 * 第三栏下块：推荐方案。
 *
 * 内部左右两半——左边一张「推荐方案」键值卡，右边「备选方案」4 张编号卡。
 * 两半都可能超出面板高度，所以各自 `min-h-0 flex-1 overflow-y-auto`，
 * 面板本身的高度由第三栏用百分比写死（见 `index.tsx`），不靠内容撑。
 */
export function RecommendPanel({ className = '' }: { className?: string }) {
  return (
    <AiPanel title={PLAN_TITLE} marker extra={<DetailButton />} className={className}>
      <div className="flex min-h-0 flex-1 gap-4 px-4 pt-1 pb-4">
        <section className="flex min-h-0 w-[55%] shrink-0 flex-col gap-2">
          <SectionTitle className="shrink-0">{PLAN_MAIN_TITLE}</SectionTitle>
          <MainPlanCard />
        </section>

        <section className="flex min-h-0 min-w-0 flex-1 flex-col gap-2">
          <SectionTitle className="shrink-0">{PLAN_ALT_TITLE}</SectionTitle>
          <AltPlanCard />
        </section>
      </div>
    </AiPanel>
  )
}

function DetailButton() {
  return (
    <button
      type="button"
      className="flex cursor-pointer items-center gap-1.5 rounded-[8px] px-3 py-[7px] text-[15px] leading-none font-medium text-(--ck-on-solid) transition-opacity hover:opacity-85"
      style={{ background: 'linear-gradient(90deg, var(--ck-btn-from), var(--ck-btn-to))' }}
    >
      <i className="ri-bar-chart-box-line text-[16px]" aria-hidden />
      {PLAN_DETAIL_BUTTON}
    </button>
  )
}

/** 左半：推荐方案的键值卡 */
function MainPlanCard() {
  return (
    <div
      className="ck-scroll min-h-0 flex-1 overflow-y-auto rounded-[10px] px-4 py-3.5"
      style={{
        border: '1px solid var(--ck-card-border)',
        background: 'var(--ck-panel-inner)',
      }}
    >
      <div
        className="mb-3 flex items-center gap-2 rounded-[8px] px-4 py-3"
        style={{
          border: '1px solid var(--ck-card-border)',
          background: 'linear-gradient(90deg, var(--accent-soft), var(--accent-subtle))',
        }}
      >
        <span className="text-[15px] leading-none font-semibold text-(--ck-title-sub)">
          {PLAN_HEADLINE.label}
        </span>
        <span className="text-[15px] leading-none font-semibold text-(--foreground)">
          {PLAN_HEADLINE.value}
        </span>
      </div>

      <dl className="flex flex-col gap-0">
        {PLAN_ROWS.map((row) => (
          <div key={row.label} className="flex items-baseline gap-2 py-[11px]">
            <dt className="w-[92px] shrink-0 text-[15px] leading-snug text-(--text-secondary)">
              {row.label}
            </dt>
            <dd className="min-w-0 text-[15px] leading-snug font-medium text-(--foreground)">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

/** 右半：4 张备选方案编号卡 */
function AltPlanCard() {
  return (
    <div
      className="ck-scroll flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto rounded-[10px] px-3.5 py-3.5"
      style={{
        border: '1px solid var(--ck-card-border)',
        background: 'var(--ck-panel-inner)',
      }}
    >
      <span className="shrink-0 text-[15px] leading-none font-semibold text-(--ck-green)">
        {ALT_PLAN_COUNT_TEXT}
      </span>

      {ALT_PLANS.map((plan) => (
        <AltPlanRow key={plan.name} plan={plan} />
      ))}
    </div>
  )
}

function AltPlanRow({ plan }: { plan: AltPlan }) {
  return (
    <div
      className="flex shrink-0 items-center gap-3 rounded-[8px] px-3 py-3.5"
      style={{
        border: '1px solid var(--ck-card-border)',
        background: 'linear-gradient(180deg, var(--ck-card-from), var(--ck-card-to))',
        boxShadow: 'var(--ck-card-shadow)',
      }}
    >
      <span
        className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full text-[15px] leading-none font-bold text-(--ck-on-solid)"
        style={{ background: 'var(--ck-green)' }}
      >
        {plan.index}
      </span>
      <span className="flex min-w-0 flex-col gap-1.5">
        <span className="text-[15px] leading-none font-semibold text-(--foreground)">
          {plan.name}
        </span>
        <span className="text-[12px] leading-none text-(--text-secondary)">{plan.note}</span>
      </span>
    </div>
  )
}
