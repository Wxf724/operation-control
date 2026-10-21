import { POLICY_CATEGORIES, POLICY_STATUS_BARS, toneColor } from '../constants'
import type { PolicyCategory, PolicyStatusBar } from '../types'
import { SubTitle } from './common'

/**
 * 左下侧栏：政策分类 + 政策状态。
 * 目标稿（画布 px）：标题 22 → 间距 29 → 8 条分类 346 → 间距 37
 * → 标题 22 → 间距 17 → 4 条状态 169，合计 642。
 */
export function PolicyCategoryList({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-col ${className}`}>
      <section className="flex min-h-0 flex-1 flex-col">
        <SubTitle className="h-[22px] shrink-0">政策分类</SubTitle>
        <div className="mt-[29px] flex min-h-0 flex-1 flex-col gap-[5px]">
          {POLICY_CATEGORIES.map((item) => (
            <CategoryRow key={item.name} item={item} />
          ))}
        </div>
      </section>

      <section className="mt-[37px] flex h-[208px] shrink-0 flex-col">
        <SubTitle className="h-[22px] shrink-0">政策状态</SubTitle>
        <div className="mt-[17px] flex min-h-0 flex-1 flex-col gap-[4px]">
          {POLICY_STATUS_BARS.map((bar) => (
            <StatusRow key={bar.name} bar={bar} />
          ))}
        </div>
      </section>
    </div>
  )
}

function CategoryRow({ item }: { item: PolicyCategory }) {
  return (
    <button
      type="button"
      className="flex min-h-0 flex-1 cursor-pointer items-center gap-[9px] rounded-[4px] border px-[11px] text-left transition-colors"
      style={{
        borderColor: item.highlight ? 'var(--ck-cyan)' : 'var(--ck-panel-inner-border)',
        background: item.highlight ? 'var(--accent-soft)' : 'var(--ck-panel-inner)',
      }}
    >
      <i
        className={`${item.icon} shrink-0 text-[19px]`}
        style={{ color: item.highlight ? 'var(--ck-cyan)' : 'var(--ck-blue)' }}
        aria-hidden
      />
      <span
        className="flex-1 truncate text-[16px] leading-none"
        style={{ color: item.highlight ? 'var(--ck-cyan)' : 'var(--ck-title-sub)' }}
      >
        {item.name}
      </span>
      <span
        className="text-[18px] leading-none font-semibold tabular-nums"
        style={{ color: item.highlight ? 'var(--ck-cyan)' : 'var(--ck-green)' }}
      >
        {item.count}
      </span>
    </button>
  )
}

function StatusRow({ bar }: { bar: PolicyStatusBar }) {
  const color = toneColor(bar.tone)

  return (
    <div className="flex min-h-0 flex-1 items-center gap-[7px]">
      <i className="h-[9px] w-[9px] shrink-0 rounded-full" style={{ background: color }} />
      <span className="shrink-0 text-[15px] leading-none whitespace-nowrap text-(--text-secondary)">
        {bar.name}
      </span>

      <div
        className="h-[9px] min-w-0 flex-1 overflow-hidden rounded-full"
        style={{ background: 'var(--ck-track)' }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${bar.percent}%`,
            background: color,
          }}
        />
      </div>

      <span className="w-[48px] shrink-0 text-right text-[15px] leading-none text-(--foreground) tabular-nums">
        {bar.count}
      </span>
    </div>
  )
}
