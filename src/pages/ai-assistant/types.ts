/** 预警等级：红灯 / 黄灯 / 绿灯 */
export type WarnLevel = 'red' | 'yellow' | 'green'

/** 左栏「问题整体展示」表格的一行 */
export interface IssueRow {
  /** 问题编号，如 0001 */
  no: string
  level: WarnLevel
  /** 等级文案，如「红灯」 */
  levelText: string
  /** 监控场景 */
  scene: string
}

/** 中栏「当前问题」卡 */
export interface CurrentIssue {
  no: string
  level: WarnLevel
  levelText: string
  description: string
}

/** 中栏「使用模型」卡 */
export interface DiagnosisModel {
  name: string
  code: string
  version: string
  /** remixicon 类名 */
  icon: string
}

/** 中栏「关键指标」里的一个图标卡 */
export interface KeyIndicator {
  label: string
  /** remixicon 类名 */
  icon: string
}

/* ───────────── 第三栏上 · 模型一因子评价关系图 ───────────── */

/** 因子与模型评价的相关程度：主要 / 次要 / 无关 */
export type FactorTone = 'major' | 'minor' | 'none'

/**
 * 放射状关系图里的一个因子节点。
 *
 * 位置用极坐标表达，渲染时按椭圆展开：
 * `x = cx + rx * radius * cos(angle)`，`y = cy + ry * radius * sin(angle)`。
 * 角度以「正东」为 0°、顺时针（屏幕坐标系向下为正）递增。
 */
export interface FactorNode {
  label: string
  tone: FactorTone
  /** 极角，单位度 */
  angle: number
  /** 相对椭圆半径的比例，1 = 贴着外圈 */
  radius: number
}

/* ───────────── 第三栏下 · 推荐方案 ───────────── */

/** 推荐方案卡里的一条键值 */
export interface PlanRow {
  label: string
  value: string
}

/** 备选方案的一张编号卡 */
export interface AltPlan {
  /** 卡片序号，1 起 */
  index: number
  name: string
  /** 卡片下方的灰色小字 */
  note: string
}

/* ───────────── 第四栏 · AI 助手 ───────────── */

/** AI 回答里「指标：异常（阈值）」的一行 */
export interface AiVerdictRow {
  label: string
  /** 判定文案，如「异常」 */
  verdict: string
  /** 阈值说明，如「（>1000笔）」 */
  threshold: string
}
