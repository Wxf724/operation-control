import type { TagTone } from '@/components/cockpit-ui'

import type {
  AnalysisStep,
  DiffRow,
  DiffStat,
  PolicyCategory,
  PolicyMetaCard,
  PolicyRow,
  PolicySource,
  PolicyStatusBar,
  SuggestionCard,
} from './types'

/** 设计稿尺寸 */
export const POLICY_CANVAS = { width: 2400, height: 1080 } as const

/**
 * 版面骨架（画布 px，按目标稿 1797 宽 × 1.3356 换算）
 * 40 + 1004 + 21 + 1295 + 40 = 2400；79 + 974 + 27 = 1080
 */
export const LAYOUT = {
  headerHeight: 72,
  headerGap: 7,
  padLeft: 40,
  padRight: 40,
  padBottom: 27,
  columnGap: 21,
  collectWidth: 1004,
  /** 面板标题带：pt-3(12) + 55 + pb-2(8) + 1px 分隔 = 76 */
  panelTitleBand: 55,
  /** 面板内边距 */
  panelPadX: 29,
  panelPadTop: 7,
  panelPadBottom: 29,
  /** 顶部卡片行高 / 与下方区块的间距 */
  topRowHeight: 186,
  topRowGap: 35,
} as const

/** 色调 → CSS 变量名 */
export const TONE_VAR: Record<TagTone, string> = {
  cyan: '--ck-cyan',
  blue: '--ck-blue',
  green: '--ck-green',
  orange: '--ck-orange',
  red: '--ck-red',
  purple: '--ck-purple',
  muted: '--text-tertiary',
}

/** 取色调对应的 CSS 变量引用 */
export function toneColor(tone: TagTone): string {
  return `var(${TONE_VAR[tone] ?? '--ck-cyan'})`
}

export const PLATFORM_TITLE = '共享运营调控平台'
export const PAGE_TITLE = '政策分析'

export const PERIOD = '2026 年 05 月'
export const PERIOD_UNITS = ['日', '月', '年'] as const
export const DEFAULT_PERIOD_UNIT = '月'
export const ORG_OPTIONS = [
  '共享公司',
  '驻区服务部',
  '北部中心',
  '东部中心',
  '西部中心',
  '南部中心',
] as const

/** 顶栏右侧的三个跳转入口 */
export const HEADER_LINKS = ['共享财务', '燕祉商务', '质量监督'] as const

/* ───────────────── 左：政策信息收集 ───────────────── */

export const COLLECT_SUBTITLE = '7x24小时自动抓取·覆盖权威渠道·实时更新'

export const POLICY_SOURCES: PolicySource[] = [
  { key: 'mof', name: '财务部', count: '1,256', today: '+12' },
  { key: 'tax', name: '国家税务总局', count: '956', today: '+12' },
  { key: 'sasac', name: '国务院国资委', count: '756', today: '+12' },
  { key: 'nea', name: '国家能源局', count: '656', today: '+12' },
  { key: 'group', name: '上级央企/集团', count: '356', today: '+12' },
]

export const CRAWL_RING = { title: '7x24h', sub: '自动抓取中…' } as const

export const POLICY_CATEGORIES: PolicyCategory[] = [
  { name: '全部政策', count: '3,702', icon: 'ri-stack-line', highlight: true },
  { name: '会计核算', count: '892', icon: 'ri-book-2-line' },
  { name: '税务新规', count: '764', icon: 'ri-bank-card-line' },
  { name: '内控合规', count: '618', icon: 'ri-shield-keyhole-line' },
  { name: '资金管理', count: '436', icon: 'ri-money-cny-circle-line' },
  { name: '考核改革', count: '298', icon: 'ri-user-star-line' },
  { name: '能源行业', count: '412', icon: 'ri-flashlight-line' },
  { name: '其他', count: '282', icon: 'ri-more-2-line' },
]

export const POLICY_STATUS_BARS: PolicyStatusBar[] = [
  { name: '已生效', count: '1,247', percent: 28, tone: 'green' },
  { name: '即将生效', count: '2,275', percent: 50, tone: 'blue' },
  { name: '征求意见稿', count: '4,562', percent: 100, tone: 'orange' },
  { name: '废止政策', count: '1,524', percent: 34, tone: 'red' },
]

export const POLICY_TABS = [
  '最新政策(128)',
  '重点关注(23)',
  '征求意见(23)',
  '即将生效(23)',
] as const

export const POLICY_COLUMNS = ['发布时间', '政策名称', '发布机构', '分类', '状态', '操作'] as const

export const POLICY_ROWS: PolicyRow[] = [
  {
    publishedAt: '2026-09-08',
    name: '关于进一步完善能源企业税收优惠政策的通知',
    org: '国家税务总局',
    category: '税务新规',
    status: '新发布',
    statusTone: 'red',
  },
  {
    publishedAt: '2026-09-08',
    name: '关于加强中央企业财务数智化转型工作的指导意见',
    org: '国资委',
    category: '考核改革',
    status: '已生效',
    statusTone: 'green',
  },
  {
    publishedAt: '2026-09-08',
    name: '关于印发《企业会计准则第18号——所得税》的通知',
    org: '财政部',
    category: '会计核算',
    status: '即将生效',
    statusTone: 'blue',
  },
  {
    publishedAt: '2026-09-08',
    name: '关于延续天然气管道运输价格机制改革的公告',
    org: '国家能源局',
    category: '行业政策',
    status: '征求意见',
    statusTone: 'orange',
  },
  {
    publishedAt: '2026-09-08',
    name: '关于加强中央企业内控体系建设的通知',
    org: '国资委',
    category: '内控合规',
    status: '新发布',
    statusTone: 'red',
  },
  {
    publishedAt: '2026-09-08',
    name: '关于延续能源行业税收优惠政策的公告',
    org: '国家税务总局',
    category: '税务新规',
    status: '已生效',
    statusTone: 'green',
  },
  {
    publishedAt: '2026-09-08',
    name: '国家管网集团关于印发财务共享运营管理办法的通知',
    org: '国资委',
    category: '考核改革',
    status: '即将生效',
    statusTone: 'blue',
  },
  {
    publishedAt: '2026-09-08',
    name: '关于印发《能源企业绿色低碳转型支持政策》的通知',
    org: '财政部',
    category: '会计核算',
    status: '征求意见',
    statusTone: 'orange',
  },
  {
    publishedAt: '2026-09-08',
    name: '关于加强国有企业资金集中管理的指导意见',
    org: '国家能源局',
    category: '行业政策',
    status: '新发布',
    statusTone: 'red',
  },
  {
    publishedAt: '2026-09-08',
    name: '关于进一步规范增值税涉税事项的公告',
    org: '国资委',
    category: '内控合规',
    status: '已生效',
    statusTone: 'green',
  },
  {
    publishedAt: '2026-09-08',
    name: '关于加强国有企业资金集中管理的导则',
    org: '国资委',
    category: '内控合规',
    status: '已生效',
    statusTone: 'green',
  },
  {
    publishedAt: '2026-09-08',
    name: '关于进一步规范增值税涉税事项的公告',
    org: '财政部',
    category: '内控合规',
    status: '已生效',
    statusTone: 'green',
  },
]

/* ───────────────── 右：政策智能分析 ───────────────── */

export const ANALYSIS_SUBTITLE = '大模型深度解析·集团制度比对·风险预警·生成落地建议'

export const ANALYSIS_STEPS: AnalysisStep[] = [
  {
    key: 'parse',
    title: '政策解析',
    icon: 'ri-book-open-line',
    lines: ['AI提取关键信息', '结构化拆解'],
  },
  {
    key: 'compare',
    title: '制度比对',
    icon: 'ri-file-copy-2-line',
    lines: ['对标集团制度', '作业标准、流程规范'],
  },
  {
    key: 'assess',
    title: '影响评估',
    icon: 'ri-search-eye-line',
    lines: ['识别差异点风险点', '影响范围'],
  },
  {
    key: 'suggest',
    title: '生成建议',
    icon: 'ri-edit-box-line',
    lines: ['输出整改建议', '流程优化方案'],
  },
  {
    key: 'track',
    title: '跟踪闭环',
    icon: 'ri-focus-3-line',
    lines: ['推送责任人', '督办落实、效果追踪'],
  },
]

export const AI_BADGES = [
  { icon: 'ri-focus-2-line', label: '更准' },
  { icon: 'ri-flashlight-line', label: '更快' },
  { icon: 'ri-battery-2-charge-line', label: '更全' },
  { icon: 'ri-apps-2-line', label: '更智能' },
] as const

/* ── 政策详情与智能解析 ── */

export const POLICY_DETAIL = {
  title: '关于进一步完善能源企业税收优惠政策的通知',
  tags: [
    { text: '国家税务总局', tone: 'blue' as const },
    { text: '税务新规', tone: 'orange' as const },
    { text: '新发布', tone: 'red' as const },
  ],
  tabs: ['政策概览', '核心要点', '条款解读', '通用范围', '相关政策'] as const,
  summary:
    '为深入贯彻国家能源安全战略，支持能源基础设施建设和清洁能源发展，现进一步完善能源企业税收优惠政策有关事项通知如下…',
} as const

export const POLICY_META_CARDS: PolicyMetaCard[] = [
  { icon: 'ri-auction-line', label: '生效时间', value: '2026-6-22' },
  { icon: 'ri-building-2-line', label: '适用行业', value: '能源行业' },
  { icon: 'ri-pie-chart-2-line', label: '政策类型', value: '税收优惠' },
  { icon: 'ri-line-chart-line', label: '影响层级', value: '集团及所属单位' },
]

export const CORE_REQUIREMENTS = [
  '加大天然气管道等基础设施投资税收支持力度',
  '优化清洁能源项目增值税、企业所得税收优惠政策',
  '完善能源企业研发费用加计扣除政策',
  '加强税收优惠执行管理，防范税收风险',
] as const

/* ── 与集团制度差异比对 ── */

export const DIFF_STATS: DiffStat[] = [
  { label: '差异总数', value: '23', tone: 'cyan' },
  { label: '完全合规', value: '15', sub: '占比: 65%', tone: 'green' },
  { label: '部分差异', value: '6', sub: '占比: 26%', tone: 'orange' },
  { label: '重大风险', value: '2', sub: '占比: 9%', tone: 'red' },
]

export const DIFF_COLUMNS = ['序号', '差异事项', '风险等级', '涉及制度', '操作'] as const

export const DIFF_ROWS: DiffRow[] = [
  {
    index: 1,
    item: '研发费用加计扣除范围不一致',
    level: '重大风险',
    levelTone: 'red',
    system: '研发管理办法',
  },
  {
    index: 2,
    item: '清洁能源项目税收优惠运用条件差异',
    level: '部分差异',
    levelTone: 'orange',
    system: '税务管理制度',
  },
  {
    index: 3,
    item: '国有资产加速折旧政策未更新',
    level: '部分差异',
    levelTone: 'orange',
    system: '资产管理办法',
  },
  {
    index: 4,
    item: '管道建设投资税收优惠口径不同',
    level: '一般关注',
    levelTone: 'cyan',
    system: '项目核算指引',
  },
  {
    index: 5,
    item: '税收风险管理要求需补充',
    level: '一般关注',
    levelTone: 'cyan',
    system: '内控管理办法',
  },
]

export const SUGGESTION_CARDS: SuggestionCard[] = [
  {
    icon: 'ri-file-edit-line',
    title: '制度修订建议 (3项)',
    tone: 'blue',
    lines: ['建议修订《税务管理制度》', '《研发管理办法》'],
  },
  {
    icon: 'ri-recycle-line',
    title: '流程优化建议 (4项)',
    tone: 'green',
    lines: ['优化税收优惠申请流程', '完善税收优惠台账管理'],
  },
  {
    icon: 'ri-alarm-warning-line',
    title: '风险防范建议 (2项)',
    tone: 'orange',
    lines: ['加强政策执行管控与跟踪', '提前识别税收风险点'],
  },
]
