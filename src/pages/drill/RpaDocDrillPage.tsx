import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import {
  DrillListHeader,
  DrillPerfPanel,
  DrillQueryPanel,
  DrillScreen,
  RpaDocTable,
} from './components'
import type { DrillQueryCondition } from './components/DrillQueryPanel'
import { RPA_DOC_QUERY_KEYS, RPA_DOC_TABS, RPA_PERIOD } from './rpaConstants'
import {
  RPA_DOC_COLUMNS,
  RPA_DOC_PAGE_SIZES,
  RPA_DOC_PERF_SERIES,
  RPA_DOC_PERF_STAGES,
  RPA_DOC_PERF_STATS,
  RPA_DOC_TOTAL,
  getRpaDocRows,
} from './rpaDocData'

/**
 * 钻取明细页 ·「单据明细」（路由 `/drill/rpa-doc`，对应参考图 3）。
 *
 * 运行情况页签里的表格标题／数据行、贡献情况页签里的任意一行都跳到这里，
 * 点到的对象通过 URL 查询串带过来，展开「原始查询条件」即可看到。
 *
 * 结构：顶部条（单据明细 / 性能分析 页签 + 原始查询条件开关）
 *      → 条件带（按需展开）→ 明细表（4 万条、200 条/页）或性能分析面板。
 * 回上一层走画布左上角的小箭头。
 */
export function RpaDocDrillPage() {
  const [searchParams] = useSearchParams()
  // `?tab=perf` 可直接落在「性能分析」页签上，方便外链与截图核对
  const [activeTab, setActiveTab] = useState<string>(() => {
    const wanted = searchParams.get('tab')
    return RPA_DOC_TABS.some((tab) => tab.key === wanted) ? (wanted as string) : RPA_DOC_TABS[0].key
  })
  // 带着上一层点下来的条件进来时默认展开条件带，直接打开本页时保持收起
  const [queryOpen, setQueryOpen] = useState(() =>
    RPA_DOC_QUERY_KEYS.some(({ key }) => Boolean(searchParams.get(key)))
  )

  const conditions = useMemo<DrillQueryCondition[]>(() => {
    const items: DrillQueryCondition[] = [
      { label: '日期区间', value: `${RPA_PERIOD.start} 至 ${RPA_PERIOD.end}` },
    ]

    for (const { key, label } of RPA_DOC_QUERY_KEYS) {
      const value = searchParams.get(key)
      if (value) items.push({ label, value })
    }

    return items
  }, [searchParams])

  return (
    <DrillScreen>
      <DrillListHeader
        tabs={RPA_DOC_TABS}
        active={activeTab}
        onChange={setActiveTab}
        queryOpen={queryOpen}
        onToggleQuery={() => setQueryOpen((prev) => !prev)}
        className="h-[66px]"
      />

      {queryOpen ? <DrillQueryPanel conditions={conditions} className="min-h-[62px] py-3" /> : null}

      {activeTab === 'perf' ? (
        <DrillPerfPanel
          title="各业务环节 RPA 处理效率"
          stages={RPA_DOC_PERF_STAGES}
          series={RPA_DOC_PERF_SERIES}
          stats={RPA_DOC_PERF_STATS}
          className="min-h-0 flex-1"
        />
      ) : (
        <RpaDocTable
          columns={RPA_DOC_COLUMNS}
          total={RPA_DOC_TOTAL}
          pageSizes={RPA_DOC_PAGE_SIZES}
          getRows={getRpaDocRows}
          className="min-h-0 flex-1"
        />
      )}
    </DrillScreen>
  )
}
