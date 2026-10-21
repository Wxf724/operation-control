import { useNavigate } from 'react-router-dom'

import {
  BackToCockpitButton,
  PeriodOrgControls,
  ScreenHeader,
  ScreenScaler,
} from '@/components/cockpit-ui'

import { PolicyAnalysisPanel } from './components/PolicyAnalysisPanel'
import { PolicyCollectPanel } from './components/PolicyCollectPanel'
import {
  DEFAULT_PERIOD_UNIT,
  HEADER_LINKS,
  LAYOUT,
  ORG_OPTIONS,
  PAGE_TITLE,
  PERIOD,
  PERIOD_UNITS,
  PLATFORM_TITLE,
  POLICY_CANVAS,
} from './constants'

/** 第 3 屏：共享运营调控平台丨政策分析 */
export function PolicyAnalysisPage() {
  const navigate = useNavigate()

  return (
    <div className="theme-cloud-light">
      <ScreenScaler width={POLICY_CANVAS.width} height={POLICY_CANVAS.height}>
        <div className="flex h-full w-full flex-col">
          <ScreenHeader
            title={<span className="text-[36px]">{PLATFORM_TITLE}</span>}
            subtitle={<span className="text-[36px]">{PAGE_TITLE}</span>}
            height={LAYOUT.headerHeight}
            left={
              <>
                <BackToCockpitButton onClick={() => navigate('/')} />
                <PeriodOrgControls
                  period={PERIOD}
                  units={PERIOD_UNITS}
                  defaultUnit={DEFAULT_PERIOD_UNIT}
                  orgs={ORG_OPTIONS}
                />
              </>
            }
            right={HEADER_LINKS.map((label) => (
              <HeaderLink key={label} label={label} />
            ))}
          />

          {/* 标题区 72+7=79，面板区 974，底部留白 27 → 合计 1080 */}
          <div
            className="flex min-h-0 flex-1"
            style={{
              gap: LAYOUT.columnGap,
              paddingLeft: LAYOUT.padLeft,
              paddingRight: LAYOUT.padRight,
              paddingTop: LAYOUT.headerGap,
              paddingBottom: LAYOUT.padBottom,
            }}
          >
            <PolicyCollectPanel className="min-h-0 w-[1004px] shrink-0" />
            <PolicyAnalysisPanel className="min-h-0 min-w-0 flex-1" />
          </div>
        </div>
      </ScreenScaler>
    </div>
  )
}

/** 顶栏右侧的三个平台入口 */
function HeaderLink({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="flex h-[38px] cursor-pointer items-center gap-2 rounded-[5px] border px-3.5 text-[15px] leading-none font-medium text-(--ck-title-sub) transition-colors hover:text-(--ck-cyan)"
      style={{
        borderColor: 'var(--ck-card-border)',
        background: 'linear-gradient(180deg, var(--ck-card-from) 0%, var(--ck-card-to) 100%)',
        boxShadow: 'var(--ck-card-shadow)',
      }}
    >
      <span
        className="flex h-[24px] w-[24px] items-center justify-center rounded-[4px] text-[14px] text-(--ck-cyan)"
        style={{ background: 'linear-gradient(180deg, var(--ck-icon-from), var(--ck-icon-to))' }}
      >
        <i className="ri-shield-star-line" aria-hidden />
      </span>
      {label}
      <i className="ri-arrow-right-double-line text-[15px] text-(--ck-cyan)" aria-hidden />
    </button>
  )
}
