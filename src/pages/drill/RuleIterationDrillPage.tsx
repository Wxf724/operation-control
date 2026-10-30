import { DrillFilterBar, DrillScreen, DrillTable } from './components'
import { RULE_PERIOD } from './ruleConstants'
import { RULE_ITERATION_COLUMNS, RULE_ITERATION_ROWS } from './ruleDrillData'

/**
 * 钻取明细页 ·「规则迭代优化管理」（路由 `/drill/rule-iteration`，对应参考图 2）。
 *
 * 从规则管理平台右下面板的标题点进来；版面是日期区间 + 一张业务类型明细表，
 * 没有指标卡、没有页签，页脚「共 7 条数据」。回上一层走左上角小箭头。
 */
export function RuleIterationDrillPage() {
  return (
    <DrillScreen>
      <DrillFilterBar
        title="规则迭代优化管理"
        defaultStart={RULE_PERIOD.start}
        defaultEnd={RULE_PERIOD.end}
        className="h-[74px]"
      />

      <DrillTable
        title="规则迭代优化管理"
        columns={RULE_ITERATION_COLUMNS}
        rows={RULE_ITERATION_ROWS}
        className="min-h-0 flex-1"
      />
    </DrillScreen>
  )
}
