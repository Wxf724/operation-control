import type { OrgScope } from './types'

/** 钻取明细页设计稿尺寸（与模块平台页一致，便于从平台页跳进来时画面不跳） */
export const DRILL_CANVAS = { width: 2400, height: 1080 } as const

/** 口径切换的两个选项 */
export const ORG_SCOPES: readonly OrgScope[] = ['法人单位', '管理单位']

/** 返回入口：三个钻取页都从作业管理平台的二级标题进来 */
export const DRILL_BACK_PATH = '/platform/job'
