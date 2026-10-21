/**
 * 编排单（Orchestration Sheet）类型定义
 *
 * 编排单是推理流水线的唯一产出物：一份确定性的 JSON 清单。
 * 渲染器只消费编排单，不重新计算——同一编排单，任何人任何时间
 * 打开，渲染结果一致（方案「确定性呈现」原则的工程落点）。
 */

/** 场景等级，决定视觉强调程度 */
export type ScenarioLevel = 'red' | 'orange' | 'blue' | 'green'

/** 槽位内引用的数据绑定：后端按绑定表达式取数，渲染器不解析 */
export interface SlotBinding {
  /** 数据源标识，如 ledger://metrics/backlog */
  source: string
  /** 取数参数，原样透传给数据服务 */
  params?: Record<string, string | number | boolean>
}

/** 槽位动作：按钮及其触发的回写/跳转 */
export interface SlotAction {
  key: string
  label: string
  /** 回写目标，如 process://sign / ledger://feedback */
  target: string
  /** 按钮呈现类型 */
  kind?: 'primary' | 'ghost'
}

/** 一个槽位 = 一个注册组件 + 数据绑定 + 可选动作 */
export interface SheetSlot {
  /** 组件在注册表中的键，未注册的键由渲染器回退呈现 */
  component: string
  /** 透传给组件的静态属性（标题、列定义等） */
  props?: Record<string, unknown>
  /** 数据绑定，渲染器整体交给数据层解析 */
  binding?: SlotBinding
  actions?: SlotAction[]
}

/** 布局模板：定义槽位摆放的区域结构 */
export type SheetTemplate = 'focus-scenario' | 'generic-workbench'

/** 编排单 */
export interface OrchestrationSheet {
  sheetId: string
  scenario: string
  level: ScenarioLevel
  template: SheetTemplate
  /** 场景卡标题区 */
  header: {
    title: string
    summary: string
    /** 红色场景附带的响应倒计时（ISO 时间），无则省略 */
    deadline?: string
  }
  /** 模板各区域对应的槽位 */
  slots: {
    main?: SheetSlot
    side?: SheetSlot
    footer?: SheetSlot
  }
  /** 判断理由：为什么呈现这个页面（可溯源要求） */
  reason: string
  /** 有效期：过期后渲染器拒绝呈现并回退 */
  expiry: string
  /** 底座版本号，留痕可回答「依据哪一版」 */
  version: string
  /** 回退目标模板 */
  fallback: SheetTemplate
}

/** 渲染结果状态：页面层只消费这三种结论，不接触判定过程 */
export type SheetRenderState =
  | { status: 'ok'; sheet: OrchestrationSheet }
  | { status: 'expired'; sheet: OrchestrationSheet }
  | { status: 'invalid'; message: string }
