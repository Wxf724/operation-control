/**
 * 数据绑定解析器：把编排单里的 binding 表达式解析为组件数据。
 *
 * 当前为演示实现——内置一个模拟数据源（mockSheets.ts）。
 * 接入真实后端时，只替换 resolveBinding 的实现（按 source 协议
 * 走指标服务 / 业务台账 / 过程服务取数），渲染器与槽位组件零改动。
 */
import type { SlotBinding } from './types'
import { MOCK_DATASOURCE } from './mockData'

export async function resolveBinding(binding: SlotBinding): Promise<unknown> {
  const record = MOCK_DATASOURCE[binding.source]
  // 模拟一次网络往返；真实实现中为指标服务/台账/过程服务的并发请求
  await new Promise((resolve) => setTimeout(resolve, 30))
  return record ?? null
}
