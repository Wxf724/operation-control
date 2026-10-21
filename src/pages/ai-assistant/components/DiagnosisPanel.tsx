import type { ReactNode } from 'react'

import {
  CURRENT_ISSUE,
  DIAGNOSIS_MODEL,
  KEY_INDICATORS,
  MODEL_DEFINITION,
  MODEL_SCORE,
  MODEL_VERDICT,
} from '../constants'
import type { KeyIndicator, WarnLevel } from '../types'

import { AiPanel } from './AiPanel'

const LEVEL_VAR: Record<WarnLevel, string> = {
  red: '--ck-red',
  yellow: '--ck-yellow',
  green: '--ck-green',
}

/** 中栏：问题诊断模型 */
export function DiagnosisPanel({ className = '' }: { className?: string }) {
  return (
    <AiPanel title="问题诊断模型" subtitle="问题是通过模型判断得出的" className={className}>
      {/* 四个卡片纵向排布，内容超出面板时整列滚动；底部结论条常驻 */}
      <div className="ck-scroll flex min-h-0 flex-1 flex-col justify-between gap-3 overflow-y-auto px-4 pt-2 pb-2">
        <CurrentIssueCard />
        <UsedModelCard />
        <ModelDefinitionCard />
        <KeyIndicatorCard />
      </div>

      <div
        className="mx-4 mt-3 mb-4 flex shrink-0 items-center gap-8 rounded-[10px] px-4 py-3.5"
        style={{
          border: '1px solid var(--ck-card-border)',
          background: 'var(--ck-panel-inner)',
        }}
      >
        <span className="flex items-baseline gap-2 text-[14px] leading-none text-(--text-secondary)">
          综合得分：
          <b className="text-[16px] font-bold text-(--foreground)">{MODEL_SCORE}</b>
        </span>
        <span className="flex items-baseline gap-2 text-[14px] leading-none text-(--text-secondary)">
          判定结果：
          <b className="text-[16px] font-bold text-(--ck-red)">{MODEL_VERDICT}</b>
        </span>
      </div>
    </AiPanel>
  )
}

/** 带浅蓝标题带的小卡，中栏四块内容共用 */
function FieldCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section
      className="shrink-0 overflow-hidden rounded-[10px]"
      style={{
        border: '1px solid var(--ck-card-border)',
        background: 'var(--surface)',
        boxShadow: 'var(--ck-card-shadow)',
      }}
    >
      <header
        className="px-4 py-3"
        style={{
          background: 'linear-gradient(90deg, var(--accent-soft), transparent)',
          borderBottom: '1px solid var(--ck-card-border)',
        }}
      >
        <h4 className="text-[18px] leading-none font-semibold text-(--ck-title-sub)">{title}</h4>
      </header>
      <div className="px-4 py-4">{children}</div>
    </section>
  )
}

function CurrentIssueCard() {
  const color = `var(${LEVEL_VAR[CURRENT_ISSUE.level]})`

  return (
    <FieldCard title="当前问题">
      <div className="flex flex-col gap-3.5">
        <div className="flex items-center justify-between gap-3">
          <Field label="问题编号">
            <span className="tabular-nums">{CURRENT_ISSUE.no}</span>
          </Field>
          <Field label="预警等级">
            <span className="flex items-center gap-1.5">
              <i className="h-[11px] w-[11px] rounded-full" style={{ background: color }} />
              {CURRENT_ISSUE.levelText}
            </span>
          </Field>
        </div>
        <Field label="问题描述">{CURRENT_ISSUE.description}</Field>
      </div>
    </FieldCard>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-start gap-1 text-[15px] leading-snug">
      <span className="shrink-0 text-(--text-secondary)">{label}：</span>
      <span className="min-w-0 text-(--foreground)">{children}</span>
    </div>
  )
}

function UsedModelCard() {
  return (
    <FieldCard title="使用模型">
      <div className="flex items-start gap-3.5">
        <ModelMedallion icon={DIAGNOSIS_MODEL.icon} size={64} />
        <div className="flex min-w-0 flex-1 flex-col gap-2.5">
          <span className="text-[16px] leading-snug font-semibold text-(--foreground)">
            {DIAGNOSIS_MODEL.name}
          </span>
          <Field label="模型编号">
            <span className="tabular-nums">{DIAGNOSIS_MODEL.code}</span>
          </Field>
          <div className="flex items-end justify-between gap-3">
            <Field label="模型版本">{DIAGNOSIS_MODEL.version}</Field>
            <button
              type="button"
              className="shrink-0 cursor-pointer rounded-[6px] border border-(--border) bg-(--ck-panel-inner) px-3 py-[6px] text-[13px] leading-none text-(--ck-title-sub) transition-colors hover:border-(--ck-cyan)"
            >
              模型说明
            </button>
          </div>
        </div>
      </div>
    </FieldCard>
  )
}

/** 圆形渐变底盘 + 图标，替代参考稿里的 3D 插画 */
function ModelMedallion({ icon, size = 54 }: { icon: string; size?: number }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full text-(--ck-cyan)"
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.46),
        background: 'linear-gradient(180deg, var(--ck-icon-from), var(--ck-icon-to))',
        boxShadow: 'var(--ck-icon-glow)',
      }}
    >
      <i className={icon} aria-hidden />
    </span>
  )
}

function ModelDefinitionCard() {
  return (
    <FieldCard title="模型定义">
      <p className="text-[15px] leading-loose text-(--foreground)">{MODEL_DEFINITION}</p>
    </FieldCard>
  )
}

function KeyIndicatorCard() {
  return (
    <FieldCard title={`关键指标(${KEY_INDICATORS.length})`}>
      <div className="grid grid-cols-4 gap-2">
        {KEY_INDICATORS.map((item) => (
          <IndicatorTile key={item.label} item={item} />
        ))}
      </div>
    </FieldCard>
  )
}

function IndicatorTile({ item }: { item: KeyIndicator }) {
  return (
    <div
      className="flex flex-col items-center gap-2.5 rounded-[10px] px-1.5 py-4"
      style={{
        border: '1px solid var(--ck-card-border)',
        background: 'linear-gradient(180deg, var(--ck-card-from), var(--ck-card-to))',
      }}
    >
      <ModelMedallion icon={item.icon} size={46} />
      <span className="text-center text-[12px] leading-snug text-(--foreground)">{item.label}</span>
    </div>
  )
}
