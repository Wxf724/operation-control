export type TourAction =
  | { type: 'home' }
  | { type: 'click'; selector: string; double?: boolean }
  | { type: 'back' }
  | { type: 'stay' }

const click = (selector: string): TourAction => ({ type: 'click', selector })
const tab = (key: string) => click(`[data-tour-tab="${key}"]`)
const drill = (title: string) => click(`[title="查看${title}明细"]`)
const map = () => click('[aria-label^="第 2 页："]')

/** 固定 25 步，每个动作后停留 10 秒；一轮约 4 分 10 秒。 */
export const TOUR_STEPS: readonly TourAction[] = [
  { type: 'home' },
  click('[aria-label^="第 1 页："]'),
  click('[aria-label^="第 3 页："]'),
  map(),
  click('[data-tour-module="job"]'),
  { type: 'click', selector: '[data-tour-module="job"]', double: true },
  { type: 'stay' },
  drill('作业处理整体情况'),
  tab('recv-unit'),
  tab('recv-center'),
  tab('done-unit'),
  { type: 'back' },
  drill('作业流转处理情况'),
  tab('pending-assign'),
  tab('center-pending'),
  { type: 'back' },
  drill('作业分配负载情况'),
  // 该页默认页签就是单据分配异常，仍单击一次原入口。
  tab('assign-abnormal'),
  { type: 'back' },
  click('[data-tour-flow]'),
  click('[title="返回作业管理平台"]'),
  click('[data-tour-ai]'),
  { type: 'stay' },
  click('[title="返回全景座舱"]'),
  click('[title="返回全景座舱"]'),
]
