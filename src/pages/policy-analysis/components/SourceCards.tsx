import type { CSSProperties } from 'react'

import { CRAWL_RING, POLICY_SOURCES } from '../constants'
import type { PolicySource } from '../types'

/**
 * 政策来源卡片组 + 右侧 7x24 抓取环。
 * 目标稿：5 张卡各 120 宽、间距 15，环区 288 宽，合计 946。
 */
export function SourceCards({
  className = '',
  style,
}: {
  className?: string
  style?: CSSProperties
}) {
  return (
    <div className={`flex items-stretch ${className}`} style={style}>
      <div className="grid min-w-0 flex-1 grid-cols-5 gap-[15px]">
        {POLICY_SOURCES.map((source) => (
          <SourceCard key={source.key} source={source} />
        ))}
      </div>

      <div className="flex w-[288px] shrink-0 items-center justify-center">
        <CrawlRing />
      </div>
    </div>
  )
}

function SourceCard({ source }: { source: PolicySource }) {
  return (
    <div
      className="flex min-w-0 flex-col items-center justify-center rounded-[5px] border px-[8px] py-[14px]"
      style={{
        borderColor: 'var(--ck-card-border)',
        background: 'linear-gradient(180deg, var(--ck-card-from) 0%, var(--ck-card-to) 100%)',
        boxShadow: 'var(--ck-card-shadow)',
      }}
    >
      <OrgEmblem />

      <span className="mt-[11px] text-center text-[16px] leading-tight font-medium whitespace-nowrap text-(--ck-title-sub)">
        {source.name}
      </span>

      <span
        className="mt-[9px] h-px w-[76%] shrink-0"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(42,102,232,0.45), transparent)',
        }}
      />

      <span className="ck-glow-num mt-[9px] text-[30px] leading-none font-bold text-(--ck-cyan)">
        {source.count}
      </span>

      <span className="mt-[10px] text-[14px] leading-none whitespace-nowrap">
        <span className="text-(--text-tertiary)">今日: </span>
        <span className="font-medium text-(--ck-red)">{source.today}</span>
      </span>
    </div>
  )
}

/** 权威机构徽标：用抽象的红金徽章表示，不复刻真实国徽 */
function OrgEmblem() {
  return (
    <span
      className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full text-[23px]"
      style={{
        background: 'radial-gradient(circle at 50% 35%, #e2443a 0%, #a81b17 100%)',
        color: '#ffd98a',
        boxShadow: '0 2px 6px rgba(168,27,23,0.28)',
      }}
    >
      <i className="ri-government-fill" aria-hidden />
    </span>
  )
}

/** 7x24h 自动抓取状态环 */
function CrawlRing() {
  const size = 160

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      {/* 外层慢转虚线环 */}
      <svg
        className="ck-spin-slow absolute inset-0"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 4}
          fill="none"
          stroke="var(--ck-cyan)"
          strokeWidth="2.5"
          strokeDasharray="19 14"
          opacity="0.55"
        />
      </svg>

      {/* 内圈 */}
      <svg className="absolute inset-0" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 19}
          fill="var(--ck-panel-inner)"
          stroke="var(--ck-blue)"
          strokeWidth="2"
          opacity="0.9"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 30}
          fill="none"
          stroke="var(--ck-cyan)"
          strokeWidth="4"
          strokeDasharray="136 82"
          strokeLinecap="round"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-[9px]">
        <span className="text-[28px] leading-none font-bold text-(--ck-cyan)">
          {CRAWL_RING.title}
        </span>
        <span className="text-[14px] leading-none text-(--text-tertiary)">{CRAWL_RING.sub}</span>
      </div>
    </div>
  )
}
