import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'

import { ProcessDisplayPage } from '@/pages/process-display'
import { AiAssistantPage } from '@/pages/ai-assistant'
import { CockpitPage } from '@/pages/cockpit'
import {
  JobFlowDrillPage,
  JobLoadDrillPage,
  JobOverallDrillPage,
  StaffBasicDrillPage,
  StaffEfficiencyDrillPage,
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
  { path: '/', element: <CockpitPage /> },
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
