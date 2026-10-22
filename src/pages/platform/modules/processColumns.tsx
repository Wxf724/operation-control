import ReactECharts from 'echarts-for-react'
import { useMemo, useState } from 'react'

import { SectionTitle, useChartColors } from '@/components/cockpit-ui'

import { PROCESS_LEGEND_TONE, buildAreaLineOption } from './processChartOptions'
import {
  CENTER_AUDIT_CARD,
  CENTER_AUDIT_SERIES,
  CENTER_STAGE_TABS,
  PROCESS_STAGE_TAB_LABELS,
  TEAM_STAGE_TABS,
  TEAM_SUBMIT_CARD,
  TEAM_SUBMIT_SERIES,
} from './processData'
import type { ProcessSeries } from './processData'
import { IconStatCard, StageCard, StageLine, SubTitle, TabPills } from './processWidgets'

/**
 * 第二列 / 第三列的上下配比。
 *
 * 两列原来都把 `TrendBlock` 挂在 `flex-1` 上，图表独占剩余空间（第二列吃掉约 67% 列高、
 * 第三列约 52%），上方环节行与数字卡只剩最小内容高。现在改成按权重分配：
 * 折线图拿固定的小权重，其余权重回流给上部各块，列底边仍与相邻列齐平、上下都不留白。
 *
 * 第二列只有一个环节、图例又占两行，所以环节块权重压低、图表比第三列略高。
 */
const TEAM_STAGE_W = 'min-h-0 flex-[0.8]'
const TEAM_CARD_W = 'min-h-0 flex-[1.05]'
const TEAM_TREND_W = 'min-h-0 flex-[2.15]'
const CENTER_TREND_H = 'h-[230px] shrink-0'

/** 第二列 · 驻企财务管理团队业务处理情况 */
export function TeamColumn({ className = '' }: { className?: string }) {
  const [tab, setTab] = useState(0)
  const items = TEAM_STAGE_TABS[tab].items

  return (
    <div className={`flex min-h-0 flex-col gap-2.5 ${className}`}>
      <SectionTitle className="shrink-0">驻企财务管理团队业务处理情况</SectionTitle>
      <TabPills labels={PROCESS_STAGE_TAB_LABELS} active={tab} onChange={setTab} size="lg" />

      {/* 只有一个环节，按权重分摊折线图让出的高度，避免被拉空 */}
      <div className={`flex flex-col gap-2 ${TEAM_STAGE_W}`}>
        {items.map((item) => (
          <StageCard
            key={item.label}
            item={item}
            tone="green"
            size="lg"
            className="min-h-0 flex-1"
          />
        ))}
      </div>

      <SubTitle size="lg">月末结账申请单提交情况</SubTitle>

      <IconStatCard
        className={TEAM_CARD_W}
        size="lg"
        label={TEAM_SUBMIT_CARD.label}
        value={TEAM_SUBMIT_CARD.value}
        unit={TEAM_SUBMIT_CARD.unit}
        icon={TEAM_SUBMIT_CARD.icon}
      />

      <TrendBlock className={TEAM_TREND_W} series={TEAM_SUBMIT_SERIES} />
    </div>
  )
}

/** 第三列 · 分中心业务处理情况 */
export function CenterColumn({ className = '' }: { className?: string }) {
  const [tab, setTab] = useState(0)
  const items = CENTER_STAGE_TABS[tab].items

  return (
    <div className={`flex min-h-0 flex-col gap-2.5 ${className}`}>
      <SectionTitle className="shrink-0">分中心业务处理情况</SectionTitle>
      <TabPills labels={PROCESS_STAGE_TAB_LABELS} active={tab} onChange={setTab} size="lg" />

      {/* 八个环节四行，auto-rows-fr 让四行平分折线图让出的高度 */}
      <div className="grid min-h-0 flex-1 auto-rows-fr grid-cols-2 gap-x-4 gap-y-2">
        {items.map((item) => (
          <StageLine key={item.label} item={item} tone="cyan" size="lg" />
        ))}
      </div>

      <SubTitle size="lg">月末结账申请单审核情况</SubTitle>

      <IconStatCard
        className="shrink-0"
        size="lg"
        label={CENTER_AUDIT_CARD.label}
        value={CENTER_AUDIT_CARD.value}
        unit={CENTER_AUDIT_CARD.unit}
        icon={CENTER_AUDIT_CARD.icon}
      />

      <TrendBlock className={CENTER_TREND_H} series={CENTER_AUDIT_SERIES} />
    </div>
  )
}

/** 单位说明 + 图例 + 面积折线图 */
function TrendBlock({ series, className = '' }: { series: ProcessSeries[]; className?: string }) {
  const c = useChartColors()
  const option = useMemo(() => buildAreaLineOption(c, series), [c, series])

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <div className="flex shrink-0 flex-wrap items-center gap-x-3 gap-y-1">
        <span className="text-[12px] leading-none text-(--text-secondary)">单位：%</span>
        {series.map((s) => (
          <LegendItem key={s.name} name={s.name} tone={s.tone} />
        ))}
      </div>

      <div className="min-h-0 flex-1">
        <ReactECharts
          option={option}
          style={{ height: '100%', width: '100%' }}
          opts={{ renderer: 'canvas' }}
          notMerge
        />
      </div>
    </div>
  )
}

function LegendItem({ name, tone }: { name: string; tone: ProcessSeries['tone'] }) {
  const color = PROCESS_LEGEND_TONE[tone]

  return (
    <span className="flex items-center gap-1 whitespace-nowrap">
      <svg width="20" height="8" viewBox="0 0 20 8" aria-hidden>
        <line x1="0" y1="4" x2="20" y2="4" stroke={color} strokeWidth="2" />
        <circle
          cx="10"
          cy="4"
          r="3"
          fill={color}
          stroke="var(--ck-panel-bg-strong)"
          strokeWidth="1"
        />
      </svg>
      <span className="text-[12px] leading-none text-(--ck-title-sub)">{name}</span>
    </span>
  )
}
