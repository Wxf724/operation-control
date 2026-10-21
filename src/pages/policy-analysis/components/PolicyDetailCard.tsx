import { useState } from 'react'

import { CORE_REQUIREMENTS, POLICY_DETAIL, POLICY_META_CARDS } from '../constants'
import type { PolicyMetaCard } from '../types'
import { SubTitle, Tag } from './common'

/**
 * 政策详情与智能解析（右栏左半，603 x 641）。
 * 目标稿（画布 px）：标题 24 / 政策名+标签 53 / 页签 31 / 内容卡 492（撑满到底）。
 */
export function PolicyDetailCard({ className = '' }: { className?: string }) {
  const [tab, setTab] = useState(0)

  return (
    <div className={`flex flex-col ${className}`}>
      <SubTitle className="h-[24px] shrink-0">政策详情与智能解析</SubTitle>

      <div className="mt-[16px] flex shrink-0 items-start justify-between gap-[14px]">
        <div className="flex min-w-0 flex-col gap-[10px]">
          <h4 className="truncate text-[19px] leading-none font-semibold text-(--foreground)">
            {POLICY_DETAIL.title}
          </h4>
          <div className="flex flex-wrap items-center gap-[8px]">
            {POLICY_DETAIL.tags.map((tag) => (
              <Tag key={tag.text} tone={tag.tone}>
                {tag.text}
              </Tag>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="flex h-[36px] shrink-0 cursor-pointer items-center gap-2 rounded-[4px] border border-(--border) bg-(--ck-panel-inner) px-3 text-[15px] leading-none text-(--ck-title-sub) transition-colors hover:border-(--ck-cyan) hover:text-(--ck-cyan)"
        >
          <i className="ri-file-download-line text-[17px] text-(--ck-cyan)" aria-hidden />
          原文下载
        </button>
      </div>

      <div className="mt-[16px] flex shrink-0 flex-wrap items-center gap-[8px]">
        {POLICY_DETAIL.tabs.map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => setTab(i)}
            className={`h-[31px] cursor-pointer rounded-[4px] border px-[11px] text-[15px] leading-none transition-colors ${
              tab === i
                ? 'border-(--ck-cyan) bg-(--ck-cyan) text-(--ck-on-solid)'
                : 'border-(--border-light) bg-(--ck-panel-inner) text-(--text-secondary) hover:text-(--ck-title-sub)'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div
        className="mt-[9px] flex min-h-0 flex-1 flex-col rounded-[5px] border p-[16px]"
        style={{
          borderColor: 'var(--ck-card-border)',
          background: 'linear-gradient(180deg, var(--ck-card-from), var(--ck-card-to))',
          boxShadow: 'var(--ck-card-shadow)',
        }}
      >
        <p className="shrink-0 text-[16px] leading-[1.65] text-(--text-secondary) [text-indent:2em]">
          {POLICY_DETAIL.summary}
        </p>

        <div className="mt-[20px] grid h-[70px] shrink-0 grid-cols-4 gap-[10px]">
          {POLICY_META_CARDS.map((card) => (
            <MetaCard key={card.label} card={card} />
          ))}
        </div>

        <SubTitle className="mt-[22px] h-[22px] shrink-0">核心管控要求</SubTitle>

        <div className="mt-[14px] flex min-h-0 flex-1 flex-col gap-[10px]">
          {CORE_REQUIREMENTS.map((req) => (
            <div
              key={req}
              className="ck-card flex min-h-0 flex-1 items-center gap-[10px] rounded-[4px] px-[12px]"
            >
              <i
                className="ri-checkbox-circle-line shrink-0 text-[18px] text-(--ck-cyan)"
                aria-hidden
              />
              <span className="text-[16px] leading-snug text-(--foreground)">{req}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function MetaCard({ card }: { card: PolicyMetaCard }) {
  return (
    <div className="ck-card flex min-w-0 items-center gap-[8px] rounded-[4px] px-[9px]">
      <i className={`${card.icon} shrink-0 text-[26px] text-(--ck-cyan)`} aria-hidden />
      <div className="flex min-w-0 flex-col gap-[6px]">
        <span className="truncate text-[14px] leading-none text-(--text-tertiary)">
          {card.label}
        </span>
        <span className="text-[15px] leading-tight font-medium text-(--foreground)">
          {card.value}
        </span>
      </div>
    </div>
  )
}
