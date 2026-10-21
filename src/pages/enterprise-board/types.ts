/** 顶部 KPI 卡：标签 + 大数字 + 单位，下面一行「同期 / 同比」对照 */
export interface BoardKpi {
  key: string
  label: string
  /** 大数字，已格式化（含千分位或百分号） */
  value: string
  /** 单位，百分比类指标留空 */
  unit: string
  icon: string
  /** 同期值 */
  priorValue: string
  /** 同期值的单位 */
  priorUnit: string
  /** 同比绝对值，形如 `0.43%` */
  yoy: string
  /** 同比方向：up 红、down 绿 */
  direction: 'up' | 'down'
}

/** 企业报表提报处理时效表的一行（序号由表格按行序渲染，数据里不存） */
export interface ReportRow {
  name: string
  closedAt: string
}

/** 超期未处理情况表的一行（序号由表格按行序渲染，数据里不存） */
export interface OverdueRow {
  unit: string
  travel: string
  reject: string
  archive: string
}
