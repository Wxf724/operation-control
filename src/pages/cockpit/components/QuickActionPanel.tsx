import { useNavigate } from 'react-router-dom'

import { PanelBox } from '@/components/cockpit-ui'

import { QUICK_ACTIONS } from '../constants'
import type { QuickAction } from '../types'

/** 右栏底部：智能操作面板（快速处理）——「任务调整」「政策分析」在此跳转子页 */
export function QuickActionPanel({ className = '' }: { className?: string }) {
  const navigate = useNavigate()

  return (
    <PanelBox title="智能操作面板(快速处理)" className={`flex flex-col ${className}`}>
      <div className="grid h-full grid-cols-4 items-center gap-2.5 px-4 pt-2 pb-3">
        {QUICK_ACTIONS.map((action) => (
          <ActionButton
            key={action.key}
            action={action}
            onClick={() => action.to && navigate(action.to)}
          />
        ))}
      </div>
    </PanelBox>
  )
}

function ActionButton({ action, onClick }: { action: QuickAction; onClick: () => void }) {
  const linked = Boolean(action.to)

  return (
    <button
      type="button"
      onClick={onClick}
      title={linked ? `进入${action.label}` : action.label}
      className="group relative flex cursor-pointer items-center justify-center gap-2 rounded-[4px] border px-2 py-2.5 transition-all duration-200 hover:-translate-y-[1px]"
      style={{
        borderColor: 'var(--ck-card-border)',
        background: 'linear-gradient(180deg, var(--ck-card-from) 0%, var(--ck-card-to) 100%)',
        boxShadow: 'var(--ck-card-shadow)',
      }}
    >
      <span
        className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-[4px] text-[15px] text-(--ck-cyan) transition-shadow group-hover:shadow-[0_0_14px_color-mix(in_srgb,var(--ck-cyan)_45%,transparent)]"
        style={{ background: 'linear-gradient(180deg, var(--ck-icon-from), var(--ck-icon-to))' }}
      >
        <i className={action.icon} aria-hidden />
      </span>

      <span className="text-[15px] leading-none font-semibold whitespace-nowrap text-(--ck-title-sub) transition-colors group-hover:text-(--ck-cyan)">
        {action.label}
      </span>

      {/* 可跳转的按钮右上角加一个角标，提示这是入口 */}
      {linked ? (
        <span
          className="pointer-events-none absolute top-[5px] right-[6px] h-[5px] w-[5px] rounded-full"
          style={{ background: 'var(--ck-cyan)', boxShadow: '0 0 7px var(--ck-cyan)' }}
        />
      ) : null}
    </button>
  )
}
