/**
 * 模拟编排服务：扮演推理流水线的角色，产出编排单。
 *
 * 演示页通过 orchestrate() 拿到编排单后交给 SheetRenderer。
 * 真实接入时，此模块替换为对编排服务 API 的调用
 * （流水线九个环节在服务端完成，前端永远只收编排单）。
 */
import type { OrchestrationSheet } from './types'

/** 场景一：预警触发——待分配单据积压（红色场景，聚焦式模板） */
export const BACKLOG_SHEET: OrchestrationSheet = {
  sheetId: 'S20261020-0042',
  scenario: '待分配单据积压偏高',
  level: 'red',
  template: 'focus-scenario',
  header: {
    title: '待分配单据积压偏高',
    summary:
      '某分中心待分配单据积压 540 笔，超过 500 笔红色预警线。请责任人在时限内签收并组织跨组支援。',
    deadline: new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
  },
  slots: {
    main: {
      component: 'todo-queue',
      binding: { source: 'ledger://todos/backlog', params: { scope: 'unassigned' } },
      props: { emptyText: '积压已全部清零' },
      actions: [
        { key: 'sign', label: '签收', target: 'process://sign', kind: 'primary' },
        { key: 'transfer', label: '转办', target: 'process://transfer' },
        { key: 'feedback', label: '反馈进展', target: 'process://feedback' },
        { key: 'accept', label: '申请验收', target: 'process://accept' },
      ],
    },
    side: {
      component: 'evidence-panel',
      binding: { source: 'ledger://evidence/backlog' },
      props: {
        caliber: '积压量口径：业务台账「单据积压日报」，统计范围为本分中心当日全部待分配单据。',
      },
    },
    footer: {
      component: 'metric-strip',
      binding: { source: 'ledger://metrics/backlog' },
    },
  },
  reason: '预警规则 R-102 命中：积压 540 笔 > 阈值 500 笔（业务台账口径，当日已更新）',
  expiry: new Date(Date.now() + 8 * 3600 * 1000).toISOString(),
  version: 'ledger-v1.3 / scenario-v2.1',
  fallback: 'generic-workbench',
}

/** 场景二：通用工作台（回退目标，也是无预警时的常态页面） */
export const WORKBENCH_SHEET: OrchestrationSheet = {
  sheetId: 'S20261020-0001',
  scenario: '日常监控',
  level: 'green',
  template: 'generic-workbench',
  header: {
    title: '运营监控工作台',
    summary: '今日运行整体平稳，无待签收红色场景。',
  },
  slots: {
    main: {
      component: 'todo-queue',
      binding: { source: 'ledger://todos/routine' },
      props: { emptyText: '今日暂无新增待办' },
      actions: [{ key: 'export', label: '导出日报', target: 'export://daily' }],
    },
    footer: {
      component: 'metric-strip',
      binding: { source: 'ledger://metrics/routine' },
    },
  },
  reason: '周期驱动：日常监控场景，按岗位默认视图装配',
  expiry: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
  version: 'ledger-v1.3 / scenario-v2.1',
  fallback: 'generic-workbench',
}

/** 过期的编排单：演示有效期失效后的回退行为 */
export const EXPIRED_SHEET: OrchestrationSheet = {
  ...BACKLOG_SHEET,
  sheetId: 'S20261019-0117',
  expiry: new Date(Date.now() - 3600 * 1000).toISOString(),
}

/** 引用了未注册组件的编排单：演示未知组件的兜底呈现 */
export const UNKNOWN_SLOT_SHEET: OrchestrationSheet = {
  ...BACKLOG_SHEET,
  sheetId: 'S20261020-0099',
  slots: {
    ...BACKLOG_SHEET.slots,
    side: { component: 'heatmap-3d', binding: { source: 'ledger://evidence/backlog' } },
  },
}

/** 模拟流水线：按场景键产出编排单（真实实现为 API 调用） */
export async function orchestrate(sceneKey: string): Promise<OrchestrationSheet> {
  await new Promise((resolve) => setTimeout(resolve, 60))
  switch (sceneKey) {
    case 'backlog':
      return BACKLOG_SHEET
    case 'expired':
      return EXPIRED_SHEET
    case 'unknown-slot':
      return UNKNOWN_SLOT_SHEET
    default:
      return WORKBENCH_SHEET
  }
}
