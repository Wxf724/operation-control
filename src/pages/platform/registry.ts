import { ArchivePlatformContent } from './modules/ArchivePlatformContent'
import { CreditPlatformContent } from './modules/CreditPlatformContent'
import { JobPlatformContent } from './modules/JobPlatformContent'
import { PerformancePlatformContent } from './modules/PerformancePlatformContent'
import { ProcessPlatformContent } from './modules/ProcessPlatformContent'
import { QualityPlatformContent } from './modules/QualityPlatformContent'
import { RiskPlatformContent } from './modules/RiskPlatformContent'
import { RpaPlatformContent } from './modules/RpaPlatformContent'
import { RulePlatformContent } from './modules/RulePlatformContent'
import { ServicePlatformContent } from './modules/ServicePlatformContent'
import { StaffPlatformContent } from './modules/StaffPlatformContent'
import { SystemPlatformContent } from './modules/SystemPlatformContent'
import { TravelPlatformContent } from './modules/TravelPlatformContent'
import type { PlatformMeta } from './types'

/**
 * 模块平台页注册表。
 *
 * 页面标题与版面均以线上真实截图为准（`_refs/live/`，日期区间 2026-10-01 ~ 2026-10-19）。
 * `Content` 为空的模块会渲染占位块，并标出对应的参考截图。
 */
export const PLATFORM_REGISTRY: Record<string, PlatformMeta> = {
  job: {
    key: 'job',
    title: '作业管理平台',
    sourceNote: '_refs/live/10-作业管理平台.png',
    theme: 'theme-cloud-light',
    Content: JobPlatformContent,
  },
  staff: {
    key: 'staff',
    title: '员工管理平台',
    sourceNote: '_refs/live/11-员工管理平台.png',
    theme: 'theme-cloud-light',
    Content: StaffPlatformContent,
  },
  rpa: {
    key: 'rpa',
    title: 'RPA管理平台',
    sourceNote: '_refs/live/12-RPA管理平台.png',
    theme: 'theme-cloud-light',
    Content: RpaPlatformContent,
  },
  rule: {
    key: 'rule',
    title: '规则管理平台',
    sourceNote: '_refs/live/13-规则管理平台.png',
    theme: 'theme-cloud-light',
    Content: RulePlatformContent,
  },
  risk: {
    key: 'risk',
    title: '风险管理平台',
    sourceNote: '_refs/live/59-风险管理平台-目标稿.png',
    theme: 'theme-cloud-light',
    Content: RiskPlatformContent,
  },
  process: {
    key: 'process',
    title: '标准流程管理平台',
    sourceNote: '_refs/live/14-标准流程管理平台.png',
    theme: 'theme-cloud-light',
    Content: ProcessPlatformContent,
  },
  quality: {
    key: 'quality',
    title: '质量管理平台',
    sourceNote: '_refs/live/15-质量管理平台.png',
    theme: 'theme-cloud-light',
    Content: QualityPlatformContent,
  },
  credit: {
    key: 'credit',
    title: '信用管理监控平台',
    sourceNote: '_refs/live/16-信用管理监控平台.png',
    theme: 'theme-cloud-light',
    Content: CreditPlatformContent,
  },
  service: {
    key: 'service',
    title: '服务管理平台',
    sourceNote: '_refs/live/17-服务管理平台.png',
    theme: 'theme-cloud-light',
    Content: ServicePlatformContent,
  },
  performance: {
    key: 'performance',
    title: '绩效管理平台',
    sourceNote: '_refs/live/18-绩效管理平台.png',
    theme: 'theme-cloud-light',
    Content: PerformancePlatformContent,
  },
  system: {
    key: 'system',
    title: '系统运行管理平台',
    sourceNote: '_refs/live/19-系统运行管理平台.png',
    theme: 'theme-cloud-light',
    Content: SystemPlatformContent,
  },
  travel: {
    key: 'travel',
    title: '商旅业务管理平台',
    sourceNote: '_refs/live/20-商旅业务管理平台.png',
    theme: 'theme-cloud-light',
    Content: TravelPlatformContent,
  },
  archive: {
    key: 'archive',
    title: '档案业务管理平台',
    sourceNote: '_refs/live/21-档案业务管理平台.png',
    theme: 'theme-cloud-light',
    Content: ArchivePlatformContent,
  },
}

export function getPlatformMeta(key: string | undefined): PlatformMeta | undefined {
  return key ? PLATFORM_REGISTRY[key] : undefined
}
