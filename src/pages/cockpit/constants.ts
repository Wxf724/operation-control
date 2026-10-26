import type {
  CenterStatus,
  MapNode,
  MetricPill,
  ModuleEntry,
  QuickAction,
  ResultKpi,
  TeamLinkRow,
  TrendPoint,
} from './types'

/**
 * 首页三屏与管理平台、任务调整、政策分析使用同一画布及 fit 缩放基准。
 * 页面切换时，字体、卡片和间距保持相同的像素比例。
 */
export const COCKPIT_PAGE_CANVAS = { width: 2400, height: 1080 } as const

/**
 * 三屏的外留白和模块间距对齐管理平台骨架（px-5 / gap-3 / pb-5）。
 */
export const COCKPIT_PAGE_PADDING = 20
export const COCKPIT_PAGE_GAP = 12
export const COCKPIT_PAGE_PAD_BOTTOM = 20
/** 运营/模型两页没有顶栏，顶部与侧边使用相同的留白。 */
export const COCKPIT_PAGE_PAD_TOP = 20

/**
 * 三页的顺序，与原来没拆时的「左 → 中 → 右」一致：
 *   1. 运营结果与趋势（原左栏）
 *   2. 全景座舱（原中栏 · 地图页，默认停在这一页）
 *   3. 模型执行与操作（原右栏）
 */
export const COCKPIT_PAGE_LABELS = ['运营结果与趋势', '全景座舱', '模型执行与操作'] as const

/** 默认显示第几页（0 起）：地图页在中间 */
export const COCKPIT_DEFAULT_PAGE = 1

export const COCKPIT_TITLE = '运营监控与调控全景座舱'

export const DATE_RANGE = { start: '2026-10-01', end: '2026-10-19' } as const

/** 顶部播报 */
export const HEADLINE = {
  prefix: '今日整体运行平稳，发现重点风险5项，其中2项调度中、2项已闭环、1项需领导协调，',
  highlight: '北部中心',
  middle: '积压风险较高，预计',
  time: '18:00',
  suffix: '前恢复正常。',
} as const

/* ───────────────── 左栏 1 · 运营结果区 ───────────────── */

export const RESULT_KPIS: ResultKpi[] = [
  {
    key: 'received',
    label: '任务接收量',
    value: '3,286',
    delta: '+12.6%',
    tone: 'cyan',
    spark: [38, 52, 44, 68, 55, 72, 60, 84],
  },
  {
    key: 'pending',
    label: '任务待办量',
    value: '1,286',
    delta: '-5.3%',
    tone: 'green',
    spark: [70, 62, 74, 55, 66, 48, 58, 42],
  },
  {
    key: 'overtime',
    label: '超时任务量',
    value: '58',
    delta: '+12.6%',
    tone: 'orange',
    spark: [30, 44, 36, 52, 46, 64, 58, 76],
  },
  {
    key: 'highRisk',
    label: '高风险预警',
    value: '12',
    delta: '+12.6%',
    tone: 'red',
    spark: [22, 34, 28, 46, 40, 58, 50, 70],
  },
  {
    key: 'dispatching',
    label: '调度中任务量',
    value: '26',
    delta: '-7.1%',
    tone: 'purple',
    spark: [64, 58, 68, 50, 60, 44, 54, 40],
  },
]

/** 右侧环形：任务完成率 */
export const COMPLETE_RATE = {
  label: '任务完成率',
  value: 92.4,
  delta: '+3.2%',
} as const

/* ───────────────── 左栏 2 · 各中心核心数据运行情况 ───────────────── */

export const CENTER_TABS = ['各中心运行情况', '各驻企财务团队运行情况'] as const

export const CENTER_STATUS: CenterStatus[] = [
  {
    name: '东部中心',
    status: '正常',
    pending: 245,
    overtime: 12,
    load: '78.0%',
    health: '90.0%',
    danger: false,
  },
  {
    name: '西部中心',
    status: '正常',
    pending: 245,
    overtime: 12,
    load: '78.0%',
    health: '90.0%',
    danger: false,
  },
  {
    name: '南部中心',
    status: '正常',
    pending: 245,
    overtime: 12,
    load: '78.0%',
    health: '90.0%',
    danger: false,
  },
  {
    name: '北部中心',
    status: '异常',
    pending: 398,
    overtime: 29,
    load: '96.0%',
    health: '70.0%',
    danger: true,
  },
  {
    name: '业财中心',
    status: '正常',
    pending: 245,
    overtime: 12,
    load: '78.0%',
    health: '90.0%',
    danger: false,
  },
]

/** 第二个页签：各驻企财务团队 */
export const TEAM_STATUS: CenterStatus[] = [
  {
    name: '管道建设团队',
    status: '正常',
    pending: 186,
    overtime: 8,
    load: '72.0%',
    health: '93.0%',
    danger: false,
  },
  {
    name: '储运销售团队',
    status: '正常',
    pending: 204,
    overtime: 11,
    load: '81.0%',
    health: '89.0%',
    danger: false,
  },
  {
    name: '科技研究团队',
    status: '正常',
    pending: 132,
    overtime: 5,
    load: '64.0%',
    health: '95.0%',
    danger: false,
  },
  {
    name: '工程服务团队',
    status: '偏高',
    pending: 311,
    overtime: 21,
    load: '91.0%',
    health: '78.0%',
    danger: true,
  },
  {
    name: '综合保障团队',
    status: '正常',
    pending: 158,
    overtime: 9,
    load: '69.0%',
    health: '92.0%',
    danger: false,
  },
]

/** 各中心卡片里的指标行（保持原有四项，不额外加指标） */
export const CENTER_METRIC_ROWS = [
  { key: 'pending', label: '待处理任务量' },
  { key: 'overtime', label: '累计超时任务量' },
  { key: 'load', label: '平均负载率' },
  { key: 'health', label: '健康度' },
] as const

/* ───────────────── 左栏 3 · 近 10 日运行趋势 ───────────────── */

export const PEAK_FORECAST = {
  dateLabel: '业务高峰期预测到达时间',
  date: '2026年12月26日',
  totalLabel: '业务高峰期预测单据总量',
  total: '19,000 笔',
} as const

export const TREND_DATA: TrendPoint[] = [
  { date: '07-14', received: 1520, pending: 430, finished: 1180, rate: 78 },
  { date: '07-15', received: 1480, pending: 470, finished: 1120, rate: 76 },
  { date: '07-16', received: 1610, pending: 520, finished: 1260, rate: 78 },
  { date: '07-17', received: 1395, pending: 410, finished: 1090, rate: 78 },
  { date: '07-18', received: 1540, pending: 455, finished: 1215, rate: 79 },
  { date: '07-19', received: 1465, pending: 505, finished: 1130, rate: 77 },
  { date: '07-20', received: 1580, pending: 440, finished: 1290, rate: 82 },
  { date: '07-21', received: 1430, pending: 495, finished: 1105, rate: 77 },
  { date: '07-22', received: 1625, pending: 530, finished: 1310, rate: 81 },
  { date: '07-23', received: 1555, pending: 460, finished: 1245, rate: 80 },
]

/* ───────────────── 中部 · 业务模块入口 ───────────────── */

export const LEFT_MODULES: ModuleEntry[] = [
  { key: 'job', label: '作业管理', icon: 'ri-clipboard-line', route: '/platform/job' },
  { key: 'staff', label: '员工管理', icon: 'ri-user-settings-line', route: '/platform/staff' },
  { key: 'rpa', label: 'RPA管理', icon: 'ri-robot-2-line', route: '/platform/rpa' },
  { key: 'rule', label: '规则管理', icon: 'ri-file-list-3-line', route: '/platform/rule' },
  { key: 'risk', label: '风险管理', icon: 'ri-shield-check-line', route: '/platform/risk' },
  {
    key: 'process',
    label: '标准流程管理',
    icon: 'ri-bar-chart-box-line',
    route: '/platform/process',
  },
]

export const RIGHT_MODULES: ModuleEntry[] = [
  { key: 'quality', label: '质量管理', icon: 'ri-focus-2-line', route: '/platform/quality' },
  { key: 'credit', label: '信用管理', icon: 'ri-award-line', route: '/platform/credit' },
  {
    key: 'service',
    label: '服务管理',
    icon: 'ri-customer-service-2-line',
    route: '/platform/service',
  },
  {
    key: 'performance',
    label: '绩效管理',
    icon: 'ri-line-chart-line',
    route: '/platform/performance',
  },
  { key: 'system', label: '系统管理', icon: 'ri-settings-3-line', route: '/platform/system' },
  {
    key: 'travel',
    label: '商旅服务管理',
    icon: 'ri-flight-takeoff-line',
    route: '/platform/travel',
  },
  { key: 'archive', label: '档案管理', icon: 'ri-archive-2-line', route: '/platform/archive' },
]

/** 默认高亮的模块（与截图一致：服务管理） */
export const DEFAULT_ACTIVE_MODULE = 'service'

/* ───────────────── 中部 · 地图节点 ───────────────── */

export const MAP_NODES: MapNode[] = [
  { name: '北京', coord: [116.4, 39.9], weight: 100, primary: true },
  { name: '天津', coord: [117.2, 39.13], weight: 62 },
  { name: '哈尔滨', coord: [126.53, 45.8], weight: 48 },
  { name: '长春', coord: [125.32, 43.82], weight: 42 },
  { name: '沈阳', coord: [123.43, 41.8], weight: 55 },
  { name: '大连', coord: [121.62, 38.92], weight: 40 },
  { name: '锦州', coord: [121.13, 41.1], weight: 30 },
  { name: '秦皇岛', coord: [119.6, 39.93], weight: 32 },
  { name: '济南', coord: [117.0, 36.65], weight: 52 },
  { name: '青岛', coord: [120.38, 36.07], weight: 46 },
  { name: '郑州', coord: [113.65, 34.76], weight: 58 },
  { name: '太原', coord: [112.55, 37.87], weight: 44 },
  { name: '忻州', coord: [112.73, 38.42], weight: 26 },
  { name: '榆林', coord: [109.73, 38.28], weight: 34 },
  { name: '延安', coord: [109.49, 36.6], weight: 28 },
  { name: '西安', coord: [108.95, 34.27], weight: 56 },
  { name: '天水', coord: [105.72, 34.58], weight: 24 },
  { name: '兰州', coord: [103.82, 36.07], weight: 45 },
  { name: '银川', coord: [106.27, 38.47], weight: 33 },
  { name: '酒泉', coord: [98.5, 39.74], weight: 29 },
  { name: '呼和浩特', coord: [111.73, 40.83], weight: 38 },
  { name: '乌鲁木齐', coord: [87.68, 43.77], weight: 50 },
  { name: '库尔勒', coord: [86.15, 41.76], weight: 27 },
  { name: '成都', coord: [104.07, 30.67], weight: 54 },
  { name: '重庆', coord: [106.55, 29.57], weight: 50 },
  { name: '昆明', coord: [102.73, 25.05], weight: 40 },
  { name: '贵阳', coord: [106.63, 26.65], weight: 35 },
  { name: '武汉', coord: [114.31, 30.52], weight: 57 },
  { name: '长沙', coord: [112.94, 28.23], weight: 45 },
  { name: '南昌', coord: [115.89, 28.68], weight: 36 },
  { name: '合肥', coord: [117.27, 31.86], weight: 39 },
  { name: '南京', coord: [118.78, 32.04], weight: 52 },
  { name: '镇江', coord: [119.45, 32.2], weight: 25 },
  { name: '上海', coord: [121.47, 31.23], weight: 70 },
  { name: '杭州', coord: [120.15, 30.28], weight: 53 },
  { name: '福州', coord: [119.3, 26.08], weight: 37 },
  { name: '广州', coord: [113.26, 23.13], weight: 60 },
  { name: '南宁', coord: [108.37, 22.82], weight: 34 },
  { name: '海口', coord: [110.35, 20.02], weight: 22 },
]

/* ───────────────── 中部 · 底部指标药丸（随选中模块切换） ───────────────── */

/* 数据量较大，单独放在 moduleMetrics.ts，这里转出保持引用路径不变 */
export { MODULE_METRICS } from './moduleMetrics'

/* ───────────────── 右栏 · 智能操作面板 ───────────────── */

export const QUICK_ACTIONS: QuickAction[] = [
  { key: 'meeting', label: '即时会议', icon: 'ri-vidicon-line' },
  { key: 'report', label: '运营分析报告', icon: 'ri-file-chart-2-line' },
  { key: 'task', label: '任务调整', icon: 'ri-equalizer-line', to: '/task-adjust' },
  { key: 'policy', label: '政策分析', icon: 'ri-government-line', to: '/policy-analysis' },
]

/**
 * 第二个页签「各驻企财务团队运行情况」的企业链接表。
 *
 * 版面是左右两列并排的两张表，每张表两列表头「驻企财务团队 | 页面链接」。
 * 链接文本是展示用的外链写法，点击走站内路由进「企业数据看板」。
 */
export const TEAM_LINK_COLUMNS: TeamLinkRow[][] = [
  [
    {
      name: '北京燃气管道公司',
      url: 'https://finsh1-prod.pipechina.com.cn/bjrq',
      to: '/enterprise-board',
    },
    {
      name: '工程质量监督检验公司',
      url: 'https://finsh1-prod.pipechina.com.cn/gcjy',
      to: '/enterprise-board',
    },
    {
      name: '工程技术创新公司',
      url: 'https://finsh1-prod.pipechina.com.cn/gcjs',
      to: '/enterprise-board',
    },
    {
      name: '北京智网数科公司',
      url: 'https://finsh1-prod.pipechina.com.cn/zwsk',
      to: '/enterprise-board',
    },
    {
      name: '西部管道公司',
      url: 'https://finsh1-prod.pipechina.com.cn/xbgd',
      to: '/enterprise-board',
    },
    {
      name: '建设项目管理公司',
      url: 'https://finsh1-prod.pipechina.com.cn/jsxm',
      to: '/enterprise-board',
    },
  ],
  [
    {
      name: '研究总院',
      url: 'https://finsh1-prod.pipechina.com.cn/yjzy',
      to: '/enterprise-board',
    },
    {
      name: '共享运营公司',
      url: 'https://finsh1-prod.pipechina.com.cn/gxyy',
      to: '/enterprise-board',
    },
    {
      name: '燕址商务公司',
      url: 'https://finsh1-prod.pipechina.com.cn/yzsw',
      to: '/enterprise-board',
    },
    {
      name: '储运销售公司',
      url: 'https://finsh1-prod.pipechina.com.cn/cyxs',
      to: '/enterprise-board',
    },
    {
      name: '湖南管道公司',
      url: 'https://finsh1-prod.pipechina.com.cn/hngd',
      to: '/enterprise-board',
    },
    {
      name: '华中管道公司',
      url: 'https://finsh1-prod.pipechina.com.cn/hzgd',
      to: '/enterprise-board',
    },
  ],
]

/** 企业链接表的表头 */
export const TEAM_LINK_HEADS = ['驻企财务团队', '页面链接'] as const
