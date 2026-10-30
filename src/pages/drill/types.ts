/** 钻取明细页的口径：法人单位 / 管理单位 二选一 */
export type OrgScope = '法人单位' | '管理单位'

/** 明细表里的一行机构数据：本期值 + 同期值 */
export interface DrillOrgRow {
  /** 单位编号，如 1000 / DGT */
  code: string
  /** 单位名称 */
  name: string
  /** 本期数值 */
  value: number
  /** 同期数值 */
  prior: number
}

/** 明细表列定义（「序号」列由 DrillTable 自动补，不用写在这里） */
export interface DrillColumn {
  key: string
  title: string
  /** grid-template-columns 片段，如 `1.4fr` 或 `180px` */
  width: string
  align?: 'left' | 'center'
  /** 表头带排序图标并支持点击排序 */
  sortable?: boolean
}

/** 指标卡：图标 + 标签 + 大数字 + 单位 */
export interface DrillMetric {
  /** Remix Icon 类名 */
  icon: string
  label: string
  value: string
  unit?: string
  /** 数值下方的一行补充说明，如「问题报数量 240」 */
  sub?: string
  /** 取色用的 CSS 变量名，如 `--ck-cyan` */
  colorVar: string
}

/** 页签 */
export interface DrillTab {
  key: string
  label: string
}
