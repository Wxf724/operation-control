import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DateRangePicker } from '@/components/cockpit-ui'
import { RISK_CLOSED_LOOP, RISK_MONITORS, RISK_SUMMARY } from '@/mocks/riskDashboard'
import { ORG_OPTIONS } from '../constants'
import {
  RiskDistribution,
  RiskManualMarking,
  RiskMonitor,
  RiskRuntime,
  RiskTrend,
} from './RiskDashboardPanels'
import './riskDashboard.css'

const sections = [
  '驾驶舱',
  '资金预警视图',
  '资产预警视图',
  '税务预警视图',
  '模型运行分析',
  '智慧监督',
  '财会监督',
]

function CockpitHeader() {
  const navigate = useNavigate()
  const [period, setPeriod] = useState({ start: '2026-01-01', end: '2026-10-26' })
  return (
    <header className="risk-masthead">
      <h1>
        <button type="button" title="返回全景座舱" onClick={() => navigate('/')}>
          <span className="sr-only">预警管控驾驶舱</span>
        </button>
      </h1>
      <ul className="risk-sections" aria-label="驾驶舱栏目">
        {sections.map((label, i) => (
          <li key={label} aria-current={i === 0 ? 'page' : undefined}>
            {label}
          </li>
        ))}
      </ul>
      <div className="risk-period">
        <i className="ri-calendar-2-line" aria-hidden />
        <DateRangePicker value={period} onChange={setPeriod} panelAlign="right" />
      </div>
      <select aria-label="组织范围" defaultValue="集团公司">
        {['集团公司', ...ORG_OPTIONS].map((org) => (
          <option key={org}>{org}</option>
        ))}
      </select>
    </header>
  )
}

export function RiskPlatformContent() {
  const navigate = useNavigate()
  return (
    <main className="risk-cockpit" data-risk-dashboard>
      <CockpitHeader />
      <div className="risk-summaries">
        {RISK_SUMMARY.map((item, i) => (
          <section className="risk-summary" key={item.label}>
            <i
              className="risk-art"
              aria-hidden
              style={{ backgroundPosition: `-${[35, 361, 688, 991, 1294, 1596][i]}px -76px` }}
            />
            <div>
              <h2>{item.label}</h2>
              <strong style={{ color: `var(${item.tone})` }}>
                {item.value} <small>{item.unit}</small>{' '}
                {item.extra && (
                  <>
                    {item.extra.value} <small>{item.extra.unit}</small>
                  </>
                )}
              </strong>
            </div>
          </section>
        ))}
      </div>
      <div className="risk-columns">
        <div className="risk-left">
          <RiskDistribution />
          <RiskManualMarking />
          <RiskTrend />
        </div>
        <div className="risk-middle">
          <ClosedLoop />
          <Collaboration />
          <RiskRuntime />
        </div>
        <div className="risk-right">
          {RISK_MONITORS.map((data) => (
            <RiskMonitor key={data.title} data={data} />
          ))}
        </div>
      </div>
      <button
        type="button"
        className="risk-assistant risk-art"
        aria-label="AI助手"
        onClick={() => navigate('/ai-assistant')}
      />
    </main>
  )
}

function ClosedLoop() {
  return (
    <section className="risk-box risk-flow">
      <h2>风险闭环管理流程</h2>
      <ol>
        {RISK_CLOSED_LOOP.map((step, i) => (
          <li
            key={step.name}
            style={{ '--step-color': `var(${step.tone})` } as React.CSSProperties}
          >
            <i
              className="risk-art"
              aria-hidden
              style={{
                backgroundPosition: `-${[546, 673, 800, 927, 1053, 1180, 1307][i]}px -252px`,
              }}
            />
            {i < RISK_CLOSED_LOOP.length - 1 && <span className="risk-step-arrow" aria-hidden />}
            <h3>{step.name}</h3>
            <dl>
              {step.metrics.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ol>
      <div className="risk-loop-return" aria-hidden />
    </section>
  )
}

function Collaboration() {
  return (
    <section className="risk-box risk-collaboration">
      <h2>协同联动</h2>
      <div className="risk-network">
        <CollaborationUnit title="质检中心" offset={632} />
        <span className="risk-exchange-arrows" aria-hidden />
        <div className="risk-hub">
          <b>风控中心</b>
          <strong>3,845</strong>
          <span>总量</span>
        </div>
        <span className="risk-exchange-arrows" aria-hidden />
        <CollaborationUnit title="驻企团队" offset={1222} />
      </div>
      <div className="risk-supervisor">
        <span>
          总量<b>845</b>
        </span>
        <strong>综合监督</strong>
        <span>
          存疑/查实<b>262</b>
        </span>
      </div>
    </section>
  )
}

function CollaborationUnit({ title, offset }: { title: string; offset: number }) {
  return (
    <div className="risk-unit">
      <h3>{title}</h3>
      <i className="risk-art" aria-hidden style={{ backgroundPosition: `-${offset}px -565px` }} />
      <dl>
        <dt>总量</dt>
        <dd>845</dd>
        <dt>存疑/查实</dt>
        <dd>262</dd>
      </dl>
    </div>
  )
}
