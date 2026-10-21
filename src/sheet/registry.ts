/**
 * 槽位组件注册表：编排单里 component 键到这里查表。
 *
 * 新增页面组件 = 在本文件注册一行 + 在底座登记，不开发新页面。
 * 渲染器对未注册的键做回退呈现（见 SheetRenderer），不会渲染崩溃。
 */
import type { ComponentType } from 'react'

import { EvidencePanel } from './slots/EvidencePanel'
import { MetricStrip } from './slots/MetricStrip'
import { ScenarioCard } from './slots/ScenarioCard'
import { TodoQueue } from './slots/TodoQueue'

import type { SheetSlot } from './types'

/** 槽位组件收到的统一入参：静态 props + 已解析数据 + 动作 */
export interface SlotComponentProps {
  slot: SheetSlot
  /** 数据层按 binding 解析后的结果；解析失败为 null，组件需自行兜底 */
  data: unknown
  onAction?: (actionKey: string, target: string) => void
}

export type SlotComponent = ComponentType<SlotComponentProps>

export const SLOT_REGISTRY: Record<string, SlotComponent> = {
  'scenario-card': ScenarioCard,
  'todo-queue': TodoQueue,
  'metric-strip': MetricStrip,
  'evidence-panel': EvidencePanel,
}

export function isRegistered(component: string): boolean {
  return component in SLOT_REGISTRY
}
