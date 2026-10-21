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

/** 右栏决策树里的一个判定结果叶子 */
export interface TreeLeaf {
  /** 分支标签：否 / 是 */
  branch: string
  /** 阈值说明，如 (<=1000笔) */
  threshold: string
  /** 判定结果文案第一行，如「判定1:」 */
  verdictTitle: string
  /** 判定结果文案第二行，如「单据量正常」 */
  verdictText: string
  /** 正常绿 / 异常红 */
  tone: 'normal' | 'abnormal'
}

/** 右栏决策树的一条分支（指标 → 判断 → 两个叶子） */
export interface TreeBranch {
  /** 分支指标节点文案，可多行 */
  label: string
  /** 菱形判断框文案，可多行 */
  condition: string
  leaves: [TreeLeaf, TreeLeaf]
}
