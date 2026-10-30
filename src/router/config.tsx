import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'

import { ProcessDisplayPage } from '@/pages/process-display'
import { AiAssistantPage } from '@/pages/ai-assistant'
import { CockpitPager } from '@/pages/cockpit'
import {
  ArchiveCollectDrillPage,
  ArchiveDocDrillPage,
  ArchiveMatchDrillPage,
  ArchivePrintDrillPage,
  ArchiveWorkDrillPage,
  CreditAppealDrillPage,
  CreditOverallDrillPage,
  JobFlowDrillPage,
  JobLoadDrillPage,
  JobOverallDrillPage,
  PerformanceDocDrillPage,
  PerformanceEfficiencyDrillPage,
  PerformanceQualityDrillPage,
  PerformanceSatisfactionDrillPage,
  PerformanceServiceDrillPage,
  QualityAppealDetailDrillPage,
  QualityAppealDrillPage,
  QualityBusinessDrillPage,
  QualityCaptureDrillPage,
  QualityCheckDrillPage,
  QualityDisputeDrillPage,
  QualityDocDrillPage,
  QualityRectifyDocDrillPage,
  QualityRectifyDrillPage,
  QualitySamplingDrillPage,
  QualityUnrectifiedDrillPage,
  QualityWorkorderDrillPage,
  RpaContribDrillPage,
  RpaDocDrillPage,
  RpaRunDrillPage,
  RuleIterationDrillPage,
  StaffBasicDrillPage,
  StaffEfficiencyDrillPage,
  TravelDoubtDrillPage,
  TravelDocDrillPage,
  TravelExpenseDrillPage,
  TravelTripDrillPage,
  TravelUsageDrillPage,
  StaffJobDrillPage,
  StaffQualityDrillPage,
  StaffServiceDrillPage,
} from '@/pages/drill'
import { EnterpriseBoardPage } from '@/pages/enterprise-board'
import { PlatformPage } from '@/pages/platform'
import { PolicyAnalysisPage } from '@/pages/policy-analysis'
import { StaffDashboardPage } from '@/pages/staff-dashboard'
import { TaskAdjustPage } from '@/pages/task-adjust'

const NotFound = lazy(() => import('../pages/NotFound'))

const routes: RouteObject[] = [
  /* ── 运营调控大屏 ───────────────────────── */
  // 首页 = 三页左右滑动（1 全景座舱 / 2 运营结果与趋势 / 3 模型执行与操作）
  { path: '/', element: <CockpitPager /> },
  { path: '/task-adjust', element: <TaskAdjustPage /> },
  { path: '/policy-analysis', element: <PolicyAnalysisPage /> },

  /* 13 个模块平台页，由首页中部模块按钮双击进入 */
  { path: '/platform/:moduleKey', element: <PlatformPage /> },

  /* 作业管理平台 →「全业务流程」按钮跳转的业务流程大屏 */
  { path: '/business-flow', element: <ProcessDisplayPage /> },
  { path: '/process-display', element: <ProcessDisplayPage /> },

  /* 作业管理平台「共享财务」面板里三个二级标题点进来的钻取明细页 */
  { path: '/drill/job-overall', element: <JobOverallDrillPage /> },
  { path: '/drill/job-flow', element: <JobFlowDrillPage /> },
  { path: '/drill/job-load', element: <JobLoadDrillPage /> },

  /* 员工管理平台里三个面板标题点进来的钻取明细页 */
  { path: '/drill/staff-basic', element: <StaffBasicDrillPage /> },
  { path: '/drill/staff-quality', element: <StaffQualityDrillPage /> },
  { path: '/drill/staff-job', element: <StaffJobDrillPage /> },
  { path: '/drill/staff-efficiency', element: <StaffEfficiencyDrillPage /> },
  { path: '/drill/staff-service', element: <StaffServiceDrillPage /> },

  /* RPA 管理平台：「运行情况」「贡献情况」面板标题点进来的钻取明细页 */
  { path: '/drill/rpa-run', element: <RpaRunDrillPage /> },
  { path: '/drill/rpa-contrib', element: <RpaContribDrillPage /> },
  /* 上面两页里的表格标题／数据行点进来的单据明细页 */
  { path: '/drill/rpa-doc', element: <RpaDocDrillPage /> },

  /* 规则管理平台：「规则迭代优化管理」面板标题点进来的钻取明细页 */
  { path: '/drill/rule-iteration', element: <RuleIterationDrillPage /> },

  /* 质量管理平台：「稽核覆盖与抽样情况」「稽核过程与效率情况」两块面板标题点进来的钻取明细页 */
  { path: '/drill/quality-sampling', element: <QualitySamplingDrillPage /> },
  { path: '/drill/quality-capture', element: <QualityCaptureDrillPage /> },
  /* 上面两页里的数据行点进来的两张单据明细页 */
  { path: '/drill/quality-check', element: <QualityCheckDrillPage /> },
  { path: '/drill/quality-doc', element: <QualityDocDrillPage /> },

  /* 质量管理平台「业务质量与差错情况」面板点进来的钻取页，及再下一层的工单明细 */
  { path: '/drill/quality-business', element: <QualityBusinessDrillPage /> },
  { path: '/drill/quality-workorder', element: <QualityWorkorderDrillPage /> },

  /* 质量管理平台「申诉与争议管理情况」面板点进来的钻取页，及跳转列的两个去向 */
  { path: '/drill/quality-appeal', element: <QualityAppealDrillPage /> },
  { path: '/drill/quality-appeal-detail', element: <QualityAppealDetailDrillPage /> },
  { path: '/drill/quality-dispute', element: <QualityDisputeDrillPage /> },

  /* 质量管理平台「整改与规则转化情况」面板点进来的钻取页，及跳转列的两个去向 */
  { path: '/drill/quality-rectify', element: <QualityRectifyDrillPage /> },
  { path: '/drill/quality-rectify-doc', element: <QualityRectifyDocDrillPage /> },
  { path: '/drill/quality-unrectified', element: <QualityUnrectifiedDrillPage /> },

  /* 信用管理监控平台两块面板点进来的钻取页 */
  { path: '/drill/credit-overall', element: <CreditOverallDrillPage /> },
  { path: '/drill/credit-appeal', element: <CreditAppealDrillPage /> },

  /* 绩效管理平台四块面板点进来的钻取页，及再下一层的单据明细 */
  { path: '/drill/performance-efficiency', element: <PerformanceEfficiencyDrillPage /> },
  { path: '/drill/performance-quality', element: <PerformanceQualityDrillPage /> },
  { path: '/drill/performance-service', element: <PerformanceServiceDrillPage /> },
  { path: '/drill/performance-satisfaction', element: <PerformanceSatisfactionDrillPage /> },
  { path: '/drill/performance-doc', element: <PerformanceDocDrillPage /> },

  /* 商旅业务管理平台四块面板点进来的钻取页，及再下一层的单据明细 */
  { path: '/drill/travel-usage', element: <TravelUsageDrillPage /> },
  { path: '/drill/travel-trip', element: <TravelTripDrillPage /> },
  { path: '/drill/travel-expense', element: <TravelExpenseDrillPage /> },
  { path: '/drill/travel-doubt', element: <TravelDoubtDrillPage /> },
  { path: '/drill/travel-doc', element: <TravelDocDrillPage /> },

  /* 档案业务管理平台两块面板点进来的钻取页，及跳转列的三条去向 */
  { path: '/drill/archive-collect', element: <ArchiveCollectDrillPage /> },
  { path: '/drill/archive-work', element: <ArchiveWorkDrillPage /> },
  { path: '/drill/archive-doc', element: <ArchiveDocDrillPage /> },
  { path: '/drill/archive-print', element: <ArchivePrintDrillPage /> },
  { path: '/drill/archive-match', element: <ArchiveMatchDrillPage /> },

  /* 员工管理平台「基本情况」面板右上角「员工个人管理看板」按钮跳转 */
  { path: '/staff-dashboard', element: <StaffDashboardPage /> },

  /* 首页左栏「各驻企财务团队运行情况」页签里的企业链接跳转的企业数据看板 */
  { path: '/enterprise-board', element: <EnterpriseBoardPage /> },

  /* 各平台页右上角「AI助手」按钮跳转的智能运营调控页 */
  { path: '/ai-assistant', element: <AiAssistantPage /> },

  /* 模板自带的组件示例页依赖缺失的 @/mocks/teamManagement，已移除该路由 */
  { path: '*', element: <NotFound /> },
]

export default routes
