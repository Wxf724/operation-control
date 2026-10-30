import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { DrillFilterBar, DrillScreen, DrillTable } from './components'
import {
  ARCHIVE_COLLECT_COLUMNS,
  ARCHIVE_COLLECT_HEADLINE,
  ARCHIVE_COLLECT_ROWS,
} from './archiveCollectData'
import { ARCHIVE_DOC_DRILL_PATH, ARCHIVE_PERIOD } from './archiveConstants'
import type { OrgScope } from './types'

/**
 * 钻取明细页 ·「档案收集情况」（路由 `/drill/archive-collect`，对应参考图 1）。
 *
 * 结构：日期区间 + 口径开关 → 一颗大读数（快速费用平均折扣率）→ 20 行企业明细表。
 * 任意一行点进「单据明细」页（参考图 2）。
 */
export function ArchiveCollectDrillPage() {
  const navigate = useNavigate()
  const [scope, setScope] = useState<OrgScope>('法人单位')

  return (
    <DrillScreen>
      <DrillFilterBar
        title="档案收集情况"
        defaultStart={ARCHIVE_PERIOD.start}
        defaultEnd={ARCHIVE_PERIOD.end}
        scope={scope}
        onScopeChange={setScope}
        className="h-[70px]"
      />

      <section className="ck-panel flex h-[96px] shrink-0 items-center gap-3 rounded-(--ck-panel-radius) px-6">
        <span
          className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-[12px] text-[23px] text-white"
          style={{
            background:
              'linear-gradient(145deg, color-mix(in srgb, var(--ck-cyan) 52%, #ffffff) 0%, var(--ck-cyan) 100%)',
            boxShadow: '0 6px 14px color-mix(in srgb, var(--ck-cyan) 34%, transparent)',
          }}
        >
          <i className="ri-file-chart-line" aria-hidden />
        </span>
        <span className="flex min-w-0 items-baseline gap-2">
          <span className="truncate text-[16px] leading-none text-(--text-secondary)">
            {ARCHIVE_COLLECT_HEADLINE.label}
          </span>
          <span className="ck-glow-num text-[30px] leading-none font-bold text-(--ck-cyan)">
            {ARCHIVE_COLLECT_HEADLINE.value}
          </span>
        </span>
      </section>

      <DrillTable
        columns={ARCHIVE_COLLECT_COLUMNS}
        rows={ARCHIVE_COLLECT_ROWS}
        dense
        onRowClick={(row) =>
          navigate(
            `${ARCHIVE_DOC_DRILL_PATH}?from=collect&source=${encodeURIComponent('档案收集情况')}&dim=${encodeURIComponent(row[1])}`
          )
        }
        className="min-h-0 flex-1"
      />
    </DrillScreen>
  )
}
