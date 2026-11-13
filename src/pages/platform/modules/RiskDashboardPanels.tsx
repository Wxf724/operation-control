import { useMemo, useState } from 'react'
import { useChartColors } from '@/components/cockpit-ui'
import {
  RISK_CENTERS,
  RISK_DISTRIBUTIONS,
  RISK_MONITORS,
  RISK_RUNTIME,
} from '@/mocks/riskDashboard'
import { Chart } from './JobWidgets'
import { riskDistributionChart, riskMonthlyChart } from './riskDashboardCharts'

function RiskTabs<T extends string>({
  items,
  active,
  onChange,
}: {
  items: readonly T[]
  active: T
  onChange: (value: T) => void
}) {
  return (
    <div className="risk-tabs" role="tablist">
      {items.map((item) => (
        <button
          key={item}
          type="button"
          role="tab"
          aria-selected={item === active}
          onClick={() => onChange(item)}
        >
          {item}
        </button>
      ))}
    </div>
  )
}

export function RiskDistribution() {
  const [view, setView] = useState<keyof typeof RISK_DISTRIBUTIONS>('违规角度')
  const colors = useChartColors()
  const items = RISK_DISTRIBUTIONS[view]
  const option = useMemo(() => riskDistributionChart(items, colors), [items, colors])
  return (
    <section className="risk-box risk-distribution">
      <header>
        <h2>风险类型分布</h2>
        <RiskTabs<keyof typeof RISK_DISTRIBUTIONS>
          items={['违规角度', '业务类型', '风险等级'] as const}
          active={view}
          onChange={setView}
        />
      </header>
      <div className="risk-distribution-content">
        <Chart option={option} />
        <ul>
          {items.map((item, i) => (
            <li key={item.name}>
              <i style={{ background: `var(${['--ck-blue', '--ck-green', '--ck-purple'][i]})` }} />
              {item.name}
              <b>
                {item.value.toLocaleString()}({((item.value / 17412) * 100).toFixed(1)}%)
              </b>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function RiskManualMarking() {
  return (
    <section className="risk-box risk-manual">
      <header>
        <h2>风险线索手工标注</h2>
      </header>
      <div className="risk-marking-content">
        <div className="risk-marking-total">
          <span>手工标注风险</span>
          <strong>9,608</strong>
          <i className="risk-art" aria-hidden />
          <small>
            已处理 <b>1,097</b>
          </small>
        </div>
        <table>
          <thead>
            <tr>
              <th>中心</th>
              <th>数量</th>
              <th>已处理</th>
            </tr>
          </thead>
          <tbody>
            {RISK_CENTERS.map((row) => (
              <tr key={row.name}>
                <td>
                  <i style={{ background: `var(${row.tone})` }} />
                  {row.name}
                </td>
                <td>
                  <span>{row.count.toLocaleString()}</span>
                  <em
                    style={{
                      width: (row.count / 4562) * 72,
                      background: `linear-gradient(90deg,transparent,var(${row.tone}))`,
                    }}
                  />
                </td>
                <td>{row.handled}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export function RiskTrend() {
  const colors = useChartColors()
  const option = useMemo(() => riskMonthlyChart(colors), [colors])
  return (
    <section className="risk-box risk-trend">
      <header>
        <h2>风险趋势分布</h2>
      </header>
      <Chart option={option} />
    </section>
  )
}

export function RiskMonitor({ data }: { data: (typeof RISK_MONITORS)[number] }) {
  const companies = data.title === '单位风险排名'
  return (
    <section className="risk-box risk-monitor">
      <header>
        <h2>{data.title}</h2>
      </header>
      <div className="risk-monitor-content">
        <dl>
          {data.labels.map((label, i) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd className={i === 1 || companies ? 'risk-danger' : ''}>
                {data.values[i]}
                {companies && i === 1 && <small>家</small>}
              </dd>
            </div>
          ))}
        </dl>
        <div className="risk-ranking">
          <h3>{data.subtitle}</h3>
          <div className="risk-ranking-head">
            <span>问题数量</span>
            <span>整改率</span>
            <span>{companies ? '高风险数' : '风险等级'}</span>
          </div>
          <ol>
            {data.rows.map((row, i) => (
              <li key={i}>
                <div className="risk-rank-name">
                  <b>{i + 1}</b>
                  {row.name}
                </div>
                <div className="risk-rank-values">
                  <span>{row.count}</span>
                  <span>{row.rate}</span>
                  <span
                    style={{ color: row.level === '中' ? 'var(--ck-orange)' : 'var(--ck-red)' }}
                  >
                    {row.level}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

export function RiskRuntime() {
  const [view, setView] = useState<keyof typeof RISK_RUNTIME>('规则')
  return (
    <section className="risk-box risk-runtime">
      <header>
        <RiskTabs<keyof typeof RISK_RUNTIME>
          items={['规则', '模型']}
          active={view}
          onChange={setView}
        />
        <h2>指标模型运行情况</h2>
      </header>
      <dl>
        {RISK_RUNTIME[view].map(([label, value], i) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd
              style={{
                color: `var(${i === 2 ? '--ck-red' : i === 4 ? '--ck-orange' : '--ck-cyan'})`,
              }}
            >
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
