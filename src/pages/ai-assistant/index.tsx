import { useNavigate } from 'react-router-dom'

import { BackToCockpitButton, ScreenScaler } from '@/components/cockpit-ui'

import { AiChatPanel } from './components/AiChatPanel'
import { DiagnosisPanel } from './components/DiagnosisPanel'
import { FactorGraphPanel } from './components/FactorGraphPanel'
import { IssuePanel } from './components/IssuePanel'
import { RecommendPanel } from './components/RecommendPanel'
import { AI_ASSISTANT_CANVAS, PAGE_TITLE } from './constants'

/**
 * AI 助手页「智能运营调控」，路由 `/ai-assistant`。
 *
 * 由各模块平台页右栏「AI 调控策略」面板右上角的「AI助手」按钮进入
 * （见 `src/pages/platform/components/AiStrategyBlock.tsx`）。
 *
 * 四栏，宽度比约 1 : 1 : 2 : 1：
 * 问题整体展示 → 问题诊断模型 → 因子评价关系图 + 推荐方案 → AI 助手问答，
 * 从「有哪些问题」一路看到「怎么判的」「推荐怎么做」「还能追问」。
 * 参考稿是深色大屏，这里统一按 `theme-cloud-light` 浅蓝白出，与 `/platform/*` 协调。
 */
export function AiAssistantPage() {
  const navigate = useNavigate()

  return (
    <div className="theme-cloud-light">
      <ScreenScaler width={AI_ASSISTANT_CANVAS.width} height={AI_ASSISTANT_CANVAS.height}>
        <div className="relative flex h-full w-full flex-col">
          {/* 屏幕外框装饰：仅在浅色玻璃主题下可见 */}
          <span className="ck-frame" aria-hidden />

          {/* 参考稿的标题是左上角大字，不是居中顶栏，所以不套 ScreenHeader */}
          <header className="flex h-[76px] shrink-0 items-center gap-3 px-5">
            <BackToCockpitButton onClick={() => navigate(-1)} />
            <h1 className="ck-main-title text-[32px] leading-none font-bold">{PAGE_TITLE}</h1>
          </header>

          <div className="flex min-h-0 flex-1 gap-3 px-5 pb-5">
            <IssuePanel className="w-[470px] shrink-0" />
            <DiagnosisPanel className="w-[478px] shrink-0" />

            {/*
              第三栏上下两块。两块内部都带滚动区，这种「撑满 + 可滚动」的组合
              不能靠 `flex-1`（grow basis-0）分高度——滚动内容会把 basis 撑回去，
              所以直接用百分比从容器高度反推，gap 的一半各自减掉。
            */}
            <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-3">
              <FactorGraphPanel className="h-[calc(47%-6px)] shrink-0" />
              <RecommendPanel className="h-[calc(53%-6px)] shrink-0" />
            </div>

            <AiChatPanel className="w-[486px] shrink-0" />
          </div>
        </div>
      </ScreenScaler>
    </div>
  )
}

export default AiAssistantPage
