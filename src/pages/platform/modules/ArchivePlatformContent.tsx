import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'

import { PanelBox, SectionTitle, useChartColors } from '@/components/cockpit-ui'
import { DrillTitleLink } from '@/pages/drill/components'
import { ARCHIVE_COLLECT_DRILL_PATH, ARCHIVE_WORK_DRILL_PATH } from '@/pages/drill/archiveConstants'

import { buildMailTrendOption, buildProblemOption } from './archiveCharts'
import {
  ARCHIVE_BORROW,
  ARCHIVE_COLLECT_CARDS,
  ARCHIVE_PAPER_COMPARE,
  ARCHIVE_PRINT,
  ARCHIVE_PROBLEM_TABS,
  ARCHIVE_RECEIPT,
  ARCHIVE_STORAGE,
} from './archiveData'
import { toneSolid } from './archiveTone'
import {
  Card,
  Chart,
  LegendNum,
  PedestalIcon,
  PedestalStat,
  Ring,
  StatRow,
  TabGroup,
} from './archiveWidgets'

/**
 * 档案业务管理平台的中间业务区（结构对齐 `_refs/live/60-档案业务管理-目标稿.png`，配色改浅蓝白）。
 *
 * 左右两栏约 45:55：
 *   左栏 ── 档案收集情况 / 档案借阅情况 / 档案库房情况
 *   右栏 ── 档案作业情况（单据签收 → 单据代打印 → 纸电比对 → 问题档案处理）
 *
 * 观感语言和作业管理平台（`JobPlatformContent`）保持一致：
 * 浅蓝面板上浮白色大圆角卡片，卡片里才是图表与数字，所以两页并排不打架。
 * flex 链路上每层都要 `min-h-0`，否则图表会被内容撑出画布或塌成 0 高。
 */
export function ArchivePlatformContent() {
  return (
    <div className="flex min-h-0 min-w-0 flex-1 gap-3.5">
      {/*
        左栏三块按权重分配高度，不再写死 `h-[NNNpx]`：
        业务区高度一变（KPI 条换行、画布比例微调）固定高就会在底部留白。
      */}
      <div className="flex w-[716px] shrink-0 flex-col gap-3.5">
        <CollectPanel className="min-h-0 flex-[1.1]" />
        <BorrowPanel className="min-h-0 flex-[1.08]" />
        <StoragePanel className="min-h-0 flex-[0.92]" />
      </div>

      <OperationPanel className="min-h-0 min-w-0 flex-1" />
    </div>
  )
}

/** 面板内的二级分组：菱形小标题 + 下方内容区 */
function Group({
  title,
  extra,
  className = '',
  bodyClassName = '',
  children,
}: {
  title: string
  extra?: ReactNode
  className?: string
  bodyClassName?: string
  children: ReactNode
}) {
  return (
    <section className={`flex min-h-0 min-w-0 flex-col ${className}`}>
      <SectionTitle className="h-[20px] shrink-0" extra={extra}>
        {title}
      </SectionTitle>
      <div className={`flex min-h-0 min-w-0 flex-1 pt-2.5 ${bodyClassName}`}>{children}</div>
    </section>
  )
}

/* ═══════════ 档案收集情况 ═══════════ */

function CollectPanel({ className = '' }: { className?: string }) {
  const c = useChartColors()
  const option = useMemo(() => buildMailTrendOption(c), [c])

  return (
    <PanelBox
      title={<DrillTitleLink title="档案收集情况" to={ARCHIVE_COLLECT_DRILL_PATH} />}
      className={`flex flex-col ${className}`}
      bodyClassName="flex min-h-0 flex-1 gap-3 px-4 pt-2.5 pb-3.5"
    >
      <Card className="min-w-0 flex-1" bodyClassName="flex-col px-2 pt-2.5 pb-2">
        <Chart option={option} />
      </Card>

      <div className="flex w-[250px] shrink-0 flex-col justify-center gap-3.5">
        {ARCHIVE_COLLECT_CARDS.map((item) => (
          <StatRow
            key={item.label}
            label={item.label}
            value={item.value}
            unit={item.unit}
            tone="blue"
            className="shrink-0"
          />
        ))}
      </div>
    </PanelBox>
  )
}

/* ═══════════ 档案借阅情况 ═══════════ */

function BorrowPanel({ className = '' }: { className?: string }) {
  return (
    <PanelBox
      title={<span className="italic">档案借阅情况</span>}
      className={`flex flex-col ${className}`}
      bodyClassName="flex min-h-0 flex-1 gap-3.5 px-4 pt-2 pb-3.5"
    >
      <Group
        title="档案借阅情况"
        className="w-[236px] shrink-0"
        bodyClassName="items-center justify-around gap-1.5"
      >
        <PedestalStat
          value={ARCHIVE_BORROW.lent.value}
          unit={ARCHIVE_BORROW.lent.unit}
          label={ARCHIVE_BORROW.lent.label}
        />
        <Ring ring={ARCHIVE_BORROW.response} size={122} stroke={13} labelWidth={120} />
      </Group>

      <span className="w-px shrink-0 self-stretch bg-(--ck-card-border)" />

      <Group
        title="档案归还情况"
        className="min-w-0 flex-1"
        bodyClassName="items-center justify-between gap-1.5"
      >
        <div className="flex shrink-0 flex-col gap-4">
          {ARCHIVE_BORROW.legends.map((item) => (
            <LegendNum key={item.label} label={item.label} value={item.value} tone={item.tone} />
          ))}
        </div>

        {ARCHIVE_BORROW.rings.map((ring) => (
          <Ring key={ring.label} ring={ring} size={134} stroke={15} labelWidth={132} />
        ))}
      </Group>
    </PanelBox>
  )
}

/* ═══════════ 档案库房情况 ═══════════ */

function StoragePanel({ className = '' }: { className?: string }) {
  const { stored, rings } = ARCHIVE_STORAGE

  return (
    <PanelBox
      title={<span className="italic">档案库房情况</span>}
      className={`flex flex-col ${className}`}
      bodyClassName="flex min-h-0 flex-1 items-center gap-3 px-4 pt-2 pb-3"
    >
      <div className="flex w-[186px] shrink-0 flex-col items-center gap-3.5">
        <PedestalIcon icon={stored.icon} tone="blue" size={70} />
        <span className="text-[15px] leading-none text-(--text-secondary)">{stored.label}</span>
        <span className="flex items-baseline gap-0.5">
          <span className="ck-glow-num text-[34px] leading-none font-bold text-(--ck-cyan)">
            {stored.value}
          </span>
          <span className="text-[14px] leading-none text-(--text-tertiary)">{stored.unit}</span>
        </span>
      </div>

      {rings.map((ring) => (
        <div key={ring.label} className="flex min-w-0 flex-1 justify-center">
          <Ring ring={ring} size={152} stroke={16} labelWidth={162} />
        </div>
      ))}
    </PanelBox>
  )
}

/* ═══════════ 档案作业情况 ═══════════ */

function OperationPanel({ className = '' }: { className?: string }) {
  const c = useChartColors()
  const [tab, setTab] = useState(0)
  // 三个页签共用同一张图，切换只换高亮
  const option = useMemo(() => buildProblemOption(c), [c])

  return (
    <PanelBox
      title={<DrillTitleLink title="档案作业情况" to={ARCHIVE_WORK_DRILL_PATH} />}
      className={`flex flex-col ${className}`}
      bodyClassName="flex min-h-0 flex-1 flex-col gap-3.5 px-4 pt-2.5 pb-3.5"
    >
      {/* ── 单据签收情况 ── */}
      <Group
        title="单据签收情况"
        className="min-h-0 flex-[1.42]"
        bodyClassName="items-center gap-3.5"
      >
        <Ring ring={ARCHIVE_RECEIPT.total} size={140} stroke={15} labelWidth={142} />

        <div className="flex min-w-0 max-w-[452px] flex-1 flex-col justify-center gap-3.5">
          {ARCHIVE_RECEIPT.breakdown.map((item) => (
            <StatRow
              key={item.label}
              label={item.label}
              value={item.value}
              unit={item.unit}
              tone={item.tone}
              dot
              className="shrink-0"
            />
          ))}
        </div>

        <i className="ri-arrow-right-line shrink-0 text-[26px] text-(--ck-blue)" aria-hidden />

        <Card
          className="w-[212px] shrink-0"
          bodyClassName="flex-col items-center justify-center gap-2.5 px-3 py-3.5"
        >
          <span className="flex items-center gap-1.5 text-[14px] leading-none text-(--text-secondary)">
            <i
              className={`${ARCHIVE_RECEIPT.machine.icon} text-[17px] text-(--ck-blue)`}
              aria-hidden
            />
            {ARCHIVE_RECEIPT.machine.label}
          </span>
          <span className="flex items-baseline gap-0.5">
            <span className="ck-glow-num text-[30px] leading-none font-bold text-(--ck-cyan)">
              {ARCHIVE_RECEIPT.machine.value}
            </span>
            <span className="text-[13px] leading-none text-(--text-tertiary)">
              {ARCHIVE_RECEIPT.machine.unit}
            </span>
          </span>
        </Card>
      </Group>

      {/* ── 单据代打印情况 ── */}
      <Group title="单据代打印情况" className="min-h-0 flex-[0.74]">
        <Card className="min-w-0 flex-1" bodyClassName="items-center justify-center gap-5 px-4">
          <Ring
            ring={{ label: '', ratio: ARCHIVE_PRINT.ratio, text: '', tone: 'cyan' }}
            size={54}
            stroke={7}
            icon="ri-printer-line"
          />
          <span className="text-[15px] leading-none text-(--text-secondary)">
            {ARCHIVE_PRINT.label}
          </span>
          <span className="flex items-baseline gap-0.5">
            <span className="ck-glow-num text-[32px] leading-none font-bold text-(--ck-cyan)">
              {ARCHIVE_PRINT.value}
            </span>
            <span className="text-[13px] leading-none text-(--text-tertiary)">
              {ARCHIVE_PRINT.unit}
            </span>
          </span>
        </Card>
      </Group>

      {/* ── 纸电比对情况 ── */}
      <Group title="纸电比对情况" className="min-h-0 flex-[1.08]" bodyClassName="gap-3">
        {ARCHIVE_PAPER_COMPARE.map((item) => (
          <Card
            key={item.label}
            className="min-w-0 flex-1"
            bodyClassName="items-center gap-3 px-3.5"
          >
            <PedestalIcon icon={item.icon} tone={item.tone} size={46} />
            <span className="flex min-w-0 flex-col gap-2.5">
              <span className="truncate text-[13px] leading-none text-(--text-secondary)">
                {item.label}
              </span>
              <span className="flex items-baseline gap-0.5">
                <span
                  className="ck-glow-num text-[27px] leading-none font-bold"
                  style={{ color: toneSolid(item.tone) }}
                >
                  {item.value}
                </span>
                <span className="text-[13px] leading-none text-(--text-tertiary)">{item.unit}</span>
              </span>
            </span>
          </Card>
        ))}
      </Group>

      {/* ── 问题档案处理情况 ── */}
      <Group
        title="问题档案处理情况"
        className="min-h-0 flex-[2.5]"
        extra={<TabGroup tabs={ARCHIVE_PROBLEM_TABS} active={tab} onChange={setTab} />}
      >
        <Card className="min-w-0 flex-1" bodyClassName="flex-col px-2 pt-2.5 pb-2">
          <Chart option={option} />
        </Card>
      </Group>
    </PanelBox>
  )
}
