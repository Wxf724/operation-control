import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  BackToCockpitButton,
  PeriodOrgControls,
  ScreenHeader,
  ScreenScaler,
} from '@/components/cockpit-ui'
import { MODULE_METRICS } from '@/pages/cockpit/constants'

import { AiStrategyBlock } from './components/AiStrategyBlock'
import { FeedbackBlock } from './components/FeedbackBlock'
import { KpiRow } from './components/KpiRow'
import { PlaceholderPanel } from './components/PlaceholderPanel'
import { ORG_OPTIONS, PERIOD_RANGE, PLATFORM_CANVAS } from './constants'
import { getPlatformMeta } from './registry'

/**
 * 模块平台页（13 个模块共用一套骨架）。
 *
 * 路由 `/platform/:moduleKey`，由首页中部模块按钮双击进入。
 * 顶部 KPI 条取自 `MODULE_METRICS`，与首页底部指标条同源；
 * 右栏「AI 调控策略」「调控执行反馈」在所有平台页中一致。
 */
export function PlatformPage() {
  const navigate = useNavigate()
  const { moduleKey } = useParams<{ moduleKey: string }>()
  const [currentOrg, setCurrentOrg] = useState<string>(ORG_OPTIONS[2])

  const meta = getPlatformMeta(moduleKey)
  const kpis = moduleKey ? MODULE_METRICS[moduleKey] : undefined

  if (!meta) {
    return <UnknownModule moduleKey={moduleKey} onBack={() => navigate('/')} />
  }

  const Content = meta.Content

  return (
    <div className={meta.theme ?? 'theme-cloud-light'}>
      <ScreenScaler width={PLATFORM_CANVAS.width} height={PLATFORM_CANVAS.height}>
        <div className="relative flex h-full w-full flex-col">
          {/* 屏幕外框装饰：仅在浅色玻璃主题下可见（见 aqua-light.css 的 .ck-frame） */}
          <span className="ck-frame" aria-hidden />

          <ScreenHeader
            title={meta.title}
            height={72}
            left={
              <>
                <BackToCockpitButton onClick={() => navigate('/')} />
                <PeriodOrgControls
                  period={`${PERIOD_RANGE.start}  至  ${PERIOD_RANGE.end}`}
                  units={['日', '月', '年']}
                  defaultUnit="月"
                  orgs={ORG_OPTIONS}
                  defaultOrg={currentOrg}
                  onOrgChange={setCurrentOrg}
                />
              </>
            }
          />

          <div className="flex min-h-0 flex-1 flex-col gap-3 px-5 pt-1.5 pb-5">
            <KpiRow items={kpis ?? []} className="h-[80px] shrink-0" />

            <div className="flex min-h-0 flex-1 gap-3">
              {/* 中间业务区：各模块不同 */}
              {Content ? (
                <Content org={currentOrg} />
              ) : (
                <PlaceholderPanel
                  title={meta.title}
                  sourceNote={meta.sourceNote}
                  className="min-h-0 min-w-0 flex-1"
                />
              )}

              {/* 右栏：13 个平台页一致；比例对齐参考稿（策略 6 : 反馈 4） */}
              <div className="flex w-[756px] shrink-0 flex-col gap-3">
                <AiStrategyBlock className="min-h-0 flex-[1.22]" />
                <FeedbackBlock className="min-h-0 flex-1" />
              </div>
            </div>
          </div>
        </div>
      </ScreenScaler>
    </div>
  )
}

function UnknownModule({ moduleKey, onBack }: { moduleKey?: string; onBack: () => void }) {
  return (
    <div className="theme-cloud-light ck-screen flex h-screen w-screen flex-col items-center justify-center gap-4">
      <span className="text-[20px] font-semibold text-(--ck-title-sub)">
        未找到模块：{moduleKey ?? '(空)'}
      </span>
      <button
        type="button"
        onClick={onBack}
        className="cursor-pointer rounded-[3px] border border-(--border) bg-(--ck-panel-inner) px-4 py-2 text-[14px] text-(--ck-cyan)"
      >
        返回全景座舱
      </button>
    </div>
  )
}
