/** 风险驾驶舱演示数据，按参考图的业务口径组织。 */
export const RISK_SUMMARY = [
  {
    label: '有效预警数量',
    value: '12,856',
    unit: '笔',
    icon: 'ri-shield-check-line',
    tone: '--ck-cyan',
  },
  {
    label: '发现风险问题',
    value: '2,346',
    unit: '笔',
    extra: { value: '3.46', unit: '亿元' },
    icon: 'ri-focus-3-line',
    tone: '--ck-orange',
  },
  {
    label: '待整改问题数',
    value: '1,982',
    unit: '笔',
    icon: 'ri-file-list-3-line',
    tone: '--ck-orange',
  },
  {
    label: '整改完成率',
    value: '76.8%',
    unit: '',
    icon: 'ri-checkbox-circle-line',
    tone: '--ck-cyan',
  },
  {
    label: '超期整改数',
    value: '46',
    unit: '笔',
    icon: 'ri-alarm-warning-line',
    tone: '--ck-orange',
  },
  {
    label: '协同联动事项',
    value: '368',
    unit: '笔',
    icon: 'ri-organization-chart',
    tone: '--ck-cyan',
  },
]

export const RISK_DISTRIBUTIONS = {
  违规角度: [
    { name: '管理类', value: 5804 },
    { name: '核算类', value: 5804 },
    { name: '违规变现', value: 5804 },
  ],
  业务类型: [
    { name: '资金业务', value: 6812 },
    { name: '资产业务', value: 5640 },
    { name: '税务业务', value: 4960 },
  ],
  风险等级: [
    { name: '高风险', value: 5804 },
    { name: '中风险', value: 7240 },
    { name: '低风险', value: 4368 },
  ],
}

export const RISK_CENTERS = [
  { name: '东部中心', count: 1247, handled: 264, tone: '--ck-green' },
  { name: '西部中心', count: 2275, handled: 267, tone: '--ck-teal' },
  { name: '南部中心', count: 4562, handled: 356, tone: '--ck-purple' },
  { name: '北部中心', count: 1524, handled: 210, tone: '--ck-blue' },
]

export const RISK_MONTHLY = {
  months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月'],
  found: [2200, 2500, 2600, 3000, 2700, 2000, 1950, 2350],
  completed: [2000, 2100, 2200, 2800, 2500, 1750, 1700, 2000],
  rates: [90, 94, 98, 92, 93, 98, 96, 95],
}

export const RISK_CLOSED_LOOP = [
  {
    name: '风险识别',
    icon: 'ri-search-line',
    tone: '--ck-blue',
    metrics: [
      ['有效预警数', '12,856'],
      ['手工打点数', '532'],
    ],
  },
  {
    name: '风险评估',
    icon: 'ri-bar-chart-box-line',
    tone: '--ck-teal',
    metrics: [
      ['已评估预警数', '8,271'],
      ['高风险占比', '18.7%'],
    ],
  },
  {
    name: '风险监控',
    icon: 'ri-radar-line',
    tone: '--ck-orange',
    metrics: [
      ['高风险预警数', '5,804'],
      ['近七日优化数', '28'],
    ],
  },
  {
    name: '风险应对',
    icon: 'ri-shield-flash-line',
    tone: '--ck-blue',
    metrics: [
      ['已应对数', '2,804'],
      ['应对率', '84.6%'],
    ],
  },
  {
    name: '风险整改',
    icon: 'ri-clipboard-line',
    tone: '--ck-green',
    metrics: [
      ['整改完成率', '78.6%'],
      ['逾期数', '332'],
    ],
  },
  {
    name: '风险沉淀',
    icon: 'ri-book-open-line',
    tone: '--ck-teal',
    metrics: [['案例数量', '1,721']],
  },
  {
    name: '模型优化',
    icon: 'ri-box-3-line',
    tone: '--ck-orange',
    metrics: [
      ['模型数量', '286'],
      ['近七日优化数', '28'],
    ],
  },
]

export const RISK_MONITORS = [
  {
    title: '指标监控风险',
    subtitle: '指标监控风险TOP3',
    labels: ['问题数量', '高风险数量'],
    values: ['2,543', '64'],
    rows: [
      { name: '会议费用违规报销风险', count: '64', rate: '99.0%', level: '高' },
      { name: '销售费用套外报销等异常', count: '345', rate: '90.0%', level: '高' },
      { name: '差旅费用违规报销风险', count: '2,134', rate: '93.0%', level: '中' },
    ],
  },
  {
    title: '模型监控风险',
    subtitle: '指标监控风险TOP3',
    labels: ['问题数量', '高风险数量'],
    values: ['1,286', '43'],
    rows: [
      { name: '突击列支预算监控模型', count: '1,634', rate: '0.0%', level: '高' },
      { name: '差旅费用违规报销风险', count: '987', rate: '97.0%', level: '中' },
      { name: '销售费用套外报销等异常', count: '256', rate: '93.0%', level: '中' },
    ],
  },
  {
    title: '单位风险排名',
    subtitle: '企业高风险TOP3',
    labels: ['高风险数量', '存在高风险的企业'],
    values: ['35', '10'],
    rows: [
      { name: 'XXXXXXXX有限公司', count: '64', rate: '90.0%', level: '9' },
      { name: 'XXXXXXXX有限公司', count: '1,264', rate: '90.0%', level: '7' },
      { name: 'XXXXXXXX有限公司', count: '2,134', rate: '90.0%', level: '6' },
    ],
  },
]

export const RISK_RUNTIME = {
  规则: [
    ['风险规则新增数', '28'],
    ['风险规则在用数', '1,216'],
    ['风险规则停用数', '40'],
    ['风险规则迭代优化数', '86'],
    ['半年在用未触发指标数', '132'],
  ],
  模型: [
    ['风险模型新增数', '12'],
    ['风险模型在用数', '286'],
    ['风险模型停用数', '8'],
    ['风险模型迭代优化数', '28'],
    ['半年在用未触发模型数', '32'],
  ],
}
