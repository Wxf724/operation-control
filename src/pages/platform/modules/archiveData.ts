/**
 * 档案业务管理平台的模拟数据。
 *
 * 结构对齐 `_refs/live/60-档案业务管理-目标稿.png`（目标稿是深色版，本页按浅蓝白主题落地）。
 */

/** 圆环／数字的色调名，映射到主题变量见 `archiveWidgets.tsx` 的 TONE 表 */
export type ArchiveTone = 'blue' | 'cyan' | 'green' | 'orange' | 'yellow' | 'red'

/** 一个环形指标：ratio 控制圆环扫过的角度，text/unit 是环心展示的内容 */
export interface ArchiveRing {
  label: string
  /** 圆环进度，0–100；计数类指标（如告警次数）按量程折算 */
  ratio: number
  text: string
  unit?: string
  tone: ArchiveTone
}

/* ───────────── 档案收集情况 ───────────── */

export const ARCHIVE_MAIL_TREND = [
  { month: '1月', rate: 90 },
  { month: '2月', rate: 86 },
  { month: '3月', rate: 91 },
  { month: '4月', rate: 96 },
  { month: '5月', rate: 89 },
  { month: '6月', rate: 88 },
  { month: '7月', rate: 94 },
]

export const ARCHIVE_COLLECT_CARDS = [
  { label: '档案超期邮寄总量', value: '1,000', unit: '份' },
  { label: '档案邮寄处理时长', value: '20', unit: '天' },
]

/* ───────────── 档案借阅情况 ───────────── */

export const ARCHIVE_BORROW = {
  /** 左半区：借阅 */
  lent: { label: '借出档案数量', value: '100', unit: '份' },
  response: {
    label: '借阅申请及时响应率',
    ratio: 99,
    text: '99.0',
    unit: '%',
    tone: 'green',
  } satisfies ArchiveRing,

  /** 右半区：归还 */
  legends: [
    { label: '归还档案数量', value: '70', tone: 'cyan' as ArchiveTone },
    { label: '待归还档案数量', value: '30', tone: 'orange' as ArchiveTone },
  ],
  rings: [
    { label: '归还及时率', ratio: 70, text: '70.0', unit: '%', tone: 'orange' },
    { label: '归还档案完好率', ratio: 100, text: '100', unit: '%', tone: 'blue' },
  ] satisfies ArchiveRing[],
}

/* ───────────── 档案库房情况 ───────────── */

export const ARCHIVE_STORAGE = {
  stored: { label: '已存放档案量', value: '300', unit: '份', icon: 'ri-archive-2-line' },
  rings: [
    { label: '温湿度达标率', ratio: 98, text: '98.0', unit: '%', tone: 'blue' },
    // 计数类指标：按 10 次量程折算成圆环进度，环心仍展示真实次数
    { label: '烟雾/火焰探测器告警次数', ratio: 50, text: '5', unit: '次', tone: 'yellow' },
    { label: '烟雾/火焰探测器告警解决率', ratio: 90, text: '90.0', unit: '%', tone: 'cyan' },
  ] satisfies ArchiveRing[],
}

/* ───────────── 档案作业情况 · 单据签收 ───────────── */

export const ARCHIVE_RECEIPT = {
  total: {
    label: '已邮寄单据总量',
    ratio: 82,
    text: '316',
    unit: '份',
    tone: 'green',
  } satisfies ArchiveRing,
  breakdown: [
    { label: '已邮寄已签收单据量', value: '260', unit: '份', tone: 'green' as ArchiveTone },
    { label: '已邮寄未签收单据量', value: '56', unit: '份', tone: 'orange' as ArchiveTone },
  ],
  machine: { label: '收单机收单总量', value: '200', unit: '份', icon: 'ri-inbox-archive-line' },
}

/* ───────────── 档案作业情况 · 单据代打印 ───────────── */

export const ARCHIVE_PRINT = {
  label: '代打印完成量',
  value: '100',
  unit: '份',
  ratio: 76,
} as const

/* ───────────── 档案作业情况 · 纸电比对 ───────────── */

export const ARCHIVE_PAPER_COMPARE = [
  {
    label: '签收单据量(纸电)',
    value: '500',
    unit: '份',
    icon: 'ri-file-copy-2-line',
    tone: 'blue',
  },
  {
    label: '纸电对比完成总量(纸电)',
    value: '320',
    unit: '份',
    icon: 'ri-file-check-line',
    tone: 'cyan',
  },
  {
    label: '待处理单据总量(纸电)',
    value: '130',
    unit: '份',
    icon: 'ri-file-list-2-line',
    tone: 'orange',
  },
] satisfies {
  label: string
  value: string
  unit: string
  icon: string
  tone: ArchiveTone
}[]

/* ───────────── 档案作业情况 · 问题档案处理 ───────────── */

/**
 * 页签只切换高亮，不切换数据。
 * 原件三个页签共用同一张柱图，这里保持一致，避免编造三套口径不同的假数据。
 */
export const ARCHIVE_PROBLEM_TABS = [
  '问题档案数量',
  '待处理问题档案数量',
  '超期待处理问题档案数量',
] as const

export const ARCHIVE_PROBLEM_TREND = [
  { month: '1月', value: 72 },
  { month: '2月', value: 50 },
  { month: '3月', value: 53 },
  { month: '4月', value: 42 },
  { month: '5月', value: 49 },
  { month: '6月', value: 52 },
  { month: '7月', value: 56 },
]
