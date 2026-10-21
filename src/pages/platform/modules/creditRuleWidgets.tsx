import { useId, useState } from 'react'

import { ProgressBar, SectionTitle } from '@/components/cockpit-ui'

import {
  CREDIT_RULE_COLUMNS,
  CREDIT_RULE_FILTERS,
  CREDIT_RULE_ROWS,
  CREDIT_RULE_SPHERES,
  CREDIT_RULE_TIMES_MAX,
  CREDIT_RULE_TOTAL,
} from './creditData'
import type { CreditRuleSphere } from './creditData'

/** 球体布局坐标系；容器用同比例的 aspect-ratio，SVG 与叠加文字才能对齐 */
const SPHERE_VIEW_W = 520
const SPHERE_VIEW_H = 320

/**
 * 信用规则变动情况：四个浅蓝球体 + 中心球的底座与环轨。
 *
 * 原稿是深色大屏的「霓虹发光球」，白底上会糊成一团脏蓝块。
 * 浅蓝白主题下改成「高光在左上、边缘收到高亮蓝」的玻璃球，
 * 发光换成球下方的一圈投影椭圆，数字用深主色直接压在球面上。
 *
 * 渐变 id 用 `useId()` 生成：组件可能被同页渲染多次，
 * 固定字面 id 会互相覆盖（也不能拿中文标签拼 id，中文在 `\W` 里会被抹空）。
 */
export function CreditSphereCluster({ className = '' }: { className?: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const sphereId = `creditSphere-${uid}`
  const topId = `creditPedestalTop-${uid}`
  const leftId = `creditPedestalLeft-${uid}`
  const rightId = `creditPedestalRight-${uid}`

  const primary = CREDIT_RULE_SPHERES.find((s) => s.primary)

  return (
    <div className={`relative aspect-[520/320] w-full ${className}`}>
      <svg
        viewBox={`0 0 ${SPHERE_VIEW_W} ${SPHERE_VIEW_H}`}
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <defs>
          <radialGradient id={sphereId} cx="34%" cy="26%" r="78%">
            <stop offset="0%" stopColor="var(--ck-card-from)" />
            <stop offset="42%" stopColor="var(--ck-icon-from)" />
            <stop offset="100%" stopColor="var(--ck-blue)" />
          </radialGradient>
          <linearGradient id={topId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--ck-icon-to)" />
            <stop offset="100%" stopColor="var(--ck-blue)" />
          </linearGradient>
          <linearGradient id={leftId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--ck-blue)" stopOpacity={0.75} />
            <stop offset="100%" stopColor="var(--ck-blue)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id={rightId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--ck-cyan)" stopOpacity={0.72} />
            <stop offset="100%" stopColor="var(--ck-cyan)" stopOpacity={0} />
          </linearGradient>
        </defs>

        {primary ? <Pedestal sphere={primary} topId={topId} leftId={leftId} rightId={rightId} /> : null}
        {primary ? (
          <ellipse
            cx={primary.cx}
            cy={primary.cy + 34}
            rx={primary.r + 22}
            ry={20}
            fill="none"
            stroke="var(--ck-blue)"
            strokeOpacity={0.55}
            strokeWidth={2}
          />
        ) : null}

        {/* 落地投影：浅色主题里用它替掉深色大屏的外发光 */}
        {CREDIT_RULE_SPHERES.map((s) => (
          <ellipse
            key={`shadow-${s.label}`}
            cx={s.cx}
            cy={s.cy + s.r * 0.92}
            rx={s.r * 0.86}
            ry={s.r * 0.17}
            fill="var(--ck-track)"
            opacity={0.65}
          />
        ))}

        {CREDIT_RULE_SPHERES.map((s) => (
          <circle
            key={s.label}
            cx={s.cx}
            cy={s.cy}
            r={s.r}
            fill={`url(#${sphereId})`}
            stroke="var(--ck-blue)"
            strokeOpacity={0.35}
          />
        ))}

        {primary ? (
          <>
            <path
              d={`M ${primary.cx - primary.r - 22} ${primary.cy + 34} A ${primary.r + 22} 20 0 0 0 ${primary.cx + primary.r + 22} ${primary.cy + 34}`}
              fill="none"
              stroke="var(--ck-cyan)"
              strokeWidth={2.5}
            />
            <circle
              cx={primary.cx + 8}
              cy={primary.cy + 54}
              r={7}
              fill="var(--ck-cyan)"
              stroke="var(--ck-card-from)"
              strokeWidth={2}
            />
          </>
        ) : null}
      </svg>

      {CREDIT_RULE_SPHERES.map((s) => (
        <SphereLabel key={s.label} sphere={s} />
      ))}
    </div>
  )
}

/** 中心球下方的立体底座 */
function Pedestal({
  sphere,
  topId,
  leftId,
  rightId,
}: {
  sphere: CreditRuleSphere
  topId: string
  leftId: string
  rightId: string
}) {
  const cx = sphere.cx
  const top = sphere.cy + sphere.r - 6
  const hw = 72
  const depth = 20
  const h = 56

  return (
    <g>
      <polygon
        points={`${cx - hw},${top} ${cx},${top - depth} ${cx + hw},${top} ${cx},${top + depth}`}
        fill={`url(#${topId})`}
      />
      <polygon
        points={`${cx - hw},${top} ${cx},${top + depth} ${cx},${top + depth + h} ${cx - hw},${top + h}`}
        fill={`url(#${leftId})`}
      />
      <polygon
        points={`${cx + hw},${top} ${cx},${top + depth} ${cx},${top + depth + h} ${cx + hw},${top + h}`}
        fill={`url(#${rightId})`}
      />
    </g>
  )
}

/** 球体上的数字与说明文字，用 HTML 叠在 SVG 上以保证字形一致 */
function SphereLabel({ sphere }: { sphere: CreditRuleSphere }) {
  return (
    <div
      className="pointer-events-none absolute flex flex-col items-center justify-center gap-1.5"
      style={{
        left: `${((sphere.cx - sphere.r) / SPHERE_VIEW_W) * 100}%`,
        top: `${((sphere.cy - sphere.r) / SPHERE_VIEW_H) * 100}%`,
        width: `${((sphere.r * 2) / SPHERE_VIEW_W) * 100}%`,
        height: `${((sphere.r * 2) / SPHERE_VIEW_H) * 100}%`,
      }}
    >
      <span
        className="leading-none font-bold text-(--ck-title) italic"
        style={{ fontSize: sphere.fontSize }}
      >
        {sphere.value}
        <span style={{ fontSize: sphere.fontSize * 0.68 }}>{sphere.unit}</span>
      </span>
      <span className="text-[13px] leading-none font-medium whitespace-nowrap text-(--ck-title-sub)">
        {sphere.label}
      </span>
    </div>
  )
}

/** 信用规则明细表：总量行 + 带进度条的优化次数 */
export function CreditRuleTable({ className = '' }: { className?: string }) {
  const cols = '0.5fr 0.8fr 2fr 1.4fr'

  return (
    <div className={`flex flex-col overflow-hidden rounded-[3px] ${className}`}>
      <div
        className="grid shrink-0 items-center gap-1 px-2 py-2.5"
        style={{ gridTemplateColumns: cols, background: 'var(--ck-table-head)' }}
      >
        {CREDIT_RULE_COLUMNS.map((col) => (
          <span
            key={col}
            className="text-center text-[13px] leading-none font-semibold text-(--ck-title-sub)"
          >
            {col}
          </span>
        ))}
      </div>

      <div
        className="grid shrink-0 items-center gap-1 px-2 py-2.5"
        style={{ gridTemplateColumns: cols, background: 'var(--ck-table-row)' }}
      >
        <span />
        <span />
        <span className="text-center text-[14px] leading-none font-semibold text-(--foreground)">
          {CREDIT_RULE_TOTAL.label}
        </span>
        <span className="ck-glow-num text-center text-[15px] leading-none font-bold text-(--ck-green)">
          {CREDIT_RULE_TOTAL.value}
        </span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        {CREDIT_RULE_ROWS.map((row, i) => (
          <div
            key={row.seq}
            className="grid min-h-[34px] flex-1 items-center gap-1 px-2 py-2"
            style={{
              gridTemplateColumns: cols,
              background: i % 2 === 0 ? 'var(--ck-table-row-alt)' : 'var(--ck-table-row)',
            }}
          >
            <span className="text-center text-[13px] leading-none text-(--text-secondary) tabular-nums">
              {row.seq}
            </span>
            <span className="text-center text-[13px] leading-none text-(--foreground)">
              {row.category ?? ''}
            </span>
            <span className="truncate text-center text-[13px] leading-snug text-(--foreground)">
              {row.name}
            </span>
            <span className="flex items-center gap-2">
              <span className="w-[22px] shrink-0 text-right text-[13px] leading-none font-semibold text-(--foreground) tabular-nums">
                {row.times}
              </span>
              <ProgressBar
                className="min-w-0 flex-1"
                value={(row.times / CREDIT_RULE_TIMES_MAX) * 100}
                tone="blue"
                showValue={false}
                barClassName="h-[6px]"
              />
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/** 面板内的下拉筛选，样式与顶栏组织下拉一致 */
export function CreditSelect({
  options,
  width = 'w-[176px]',
  label,
}: {
  options: readonly string[]
  width?: string
  label: string
}) {
  const [value, setValue] = useState<string>(options[0])

  return (
    <label className={`relative flex items-center ${width}`}>
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-label={label}
        className="w-full cursor-pointer appearance-none rounded-[3px] border border-(--border) bg-(--ck-panel-inner) py-[6px] pr-7 pl-2.5 text-[13px] leading-none text-(--ck-title-sub) outline-none focus:border-(--ck-cyan)"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <i
        className="ri-arrow-down-s-line pointer-events-none absolute right-2 text-[16px] text-(--ck-cyan)"
        aria-hidden
      />
    </label>
  )
}

/** 右栏整块：信用规则全生命周期管理的内容区 */
export function CreditRuleBody() {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2 px-3 pt-2 pb-3">
      <SectionTitle className="shrink-0">信用规则变动情况</SectionTitle>
      <CreditSphereCluster className="shrink-0" />

      <SectionTitle
        className="shrink-0"
        extra={
          <CreditSelect options={CREDIT_RULE_FILTERS} width="w-[196px]" label="规则优化口径" />
        }
      >
        信用规则变动情况
      </SectionTitle>

      <CreditRuleTable className="min-h-0 flex-1" />
    </div>
  )
}
