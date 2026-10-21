import type { OverdueRow, ReportRow } from './types'

/* ═══════════ 企业数据看板的模拟数据 ═══════════ */

export const MONTHS_12 = [
  '1月',
  '2月',
  '3月',
  '4月',
  '5月',
  '6月',
  '7月',
  '8月',
  '9月',
  '10月',
  '11月',
  '12月',
] as const

export const MONTHS_9 = MONTHS_12.slice(0, 9)

/* ───────────── 上行 1 · 单据提报量 ───────────── */

/** 柱：本年 / 去年单据完成量（万张）；折线：本年 / 去年人均产能 */
export const SUBMIT_TREND = {
  months: MONTHS_9,
  thisYearBar: [11.5, 9.2, 15.0, 16.1, 15.6, 17.2, 17.0, 16.2, 18.1],
  lastYearBar: [9.6, 10.4, 13.9, 15.2, 16.2, 16.9, 16.8, 17.3, 18.2],
  thisYearRate: [11.37, 9.58, 13.38, 14.45, 15.29, 16.04, 16.62, 15.6, 16.37],
  lastYearRate: [10.9, 10.2, 12.9, 14.0, 14.8, 15.5, 16.1, 16.3, 16.6],
  yMax: 20,
  yInterval: 5,
} as const

/* ───────────── 上行 2 · 单据流转时长 ───────────── */

/** 两条堆叠柱：本年（共享端 + 业务财经）/ 去年（共享端 + 业务财经），单位天 */
export const DURATION_TREND = {
  months: MONTHS_12,
  thisShare: [0.28, 0.34, 0.36, 0.4, 0.32, 0.3, 0.31, 0.32, 0.35, null, null, null],
  thisBiz: [0.62, 0.79, 0.83, 0.91, 0.73, 0.7, 0.71, 0.72, 0.8, null, null, null],
  lastShare: [0.34, 0.3, 0.29, 0.32, 0.29, 0.27, 0.27, 0.28, 0.29, 0.29, 0.28, 0.24],
  lastBiz: [1.36, 1.24, 1.17, 1.27, 1.14, 1.05, 1.09, 1.1, 1.13, 1.14, 1.14, 0.96],
  /** 柱顶的加粗数值：本年 9 个月 */
  thisTotal: [0.9, 1.13, 1.19, 1.31, 1.05, 1.0, 1.02, 1.04, 1.15, null, null, null],
  /** 柱顶的常规数值：去年 12 个月 */
  lastTotal: [1.7, 1.54, 1.46, 1.59, 1.43, 1.32, 1.36, 1.38, 1.42, 1.43, 1.42, 1.2],
  yMax: 2,
  yInterval: 0.5,
} as const

/* ───────────── 上行 3 · 企业报表提报处理时效 ───────────── */

export const REPORT_MONTH_TABS = [
  '1月',
  '2月',
  '3月',
  '4月',
  '5月',
  '6月',
  '7月',
  '8月',
  '9月',
] as const

export const REPORT_DEFAULT_MONTH = '9月'

/** 各月的关账时间明细（按关账时间倒序，序号由表格按行序从 1 渲染），缺省月回落到 `REPORT_ROWS_FALLBACK` */
export const REPORT_ROWS: Record<string, ReportRow[]> = {
  '9月': [
    { name: '共享运营公司', closedAt: '10月01号  15:42' },
    { name: '北京燃气管道公司', closedAt: '10月01号  15:36' },
    { name: '建设项目管理公司', closedAt: '10月01号  15:29' },
    { name: '工程技术创新公司', closedAt: '10月01号  15:22' },
    { name: '北京智网数科公司', closedAt: '10月01号  15:17' },
    { name: '西部管道', closedAt: '10月01号  15:15' },
    { name: '燕址商务', closedAt: '10月01号  15:06' },
    { name: '湖南公司', closedAt: '10月01号  14:49' },
    { name: '华中公司', closedAt: '10月01号  14:48' },
    { name: '工程质量监督检验公司', closedAt: '10月01号  14:37' },
    { name: '研究总院', closedAt: '10月01号  14:31' },
    { name: '储运销售公司', closedAt: '10月01号  14:26' },
    { name: '西气东输公司', closedAt: '10月01号  14:18' },
    { name: '物资装备公司', closedAt: '10月01号  14:05' },
  ],
  '8月': [
    { name: '北京燃气管道公司', closedAt: '09月01号  16:02' },
    { name: '工程技术创新公司', closedAt: '09月01号  15:48' },
    { name: '建设项目管理公司', closedAt: '09月01号  15:31' },
    { name: '研究总院', closedAt: '09月01号  15:12' },
    { name: '共享运营公司', closedAt: '09月01号  14:55' },
    { name: '北京智网数科公司', closedAt: '09月01号  14:48' },
    { name: '西部管道', closedAt: '09月01号  14:40' },
    { name: '燕址商务', closedAt: '09月01号  14:33' },
    { name: '湖南公司', closedAt: '09月01号  14:27' },
    { name: '华中公司', closedAt: '09月01号  14:19' },
    { name: '工程质量监督检验公司', closedAt: '09月01号  14:08' },
    { name: '储运销售公司', closedAt: '09月01号  13:57' },
    { name: '西气东输公司', closedAt: '09月01号  13:46' },
    { name: '物资装备公司', closedAt: '09月01号  13:35' },
  ],
}

export const REPORT_ROWS_FALLBACK: ReportRow[] = [
  { name: '北京燃气管道公司', closedAt: '次月01号  15:48' },
  { name: '共享运营公司', closedAt: '次月01号  15:39' },
  { name: '建设项目管理公司', closedAt: '次月01号  15:30' },
  { name: '工程质量监督检验公司', closedAt: '次月01号  15:21' },
  { name: '西部管道', closedAt: '次月01号  15:08' },
  { name: '储运销售公司', closedAt: '次月01号  14:57' },
  { name: '湖南公司', closedAt: '次月01号  14:46' },
  { name: '华中公司', closedAt: '次月01号  14:38' },
  { name: '北京智网数科公司', closedAt: '次月01号  14:30' },
  { name: '工程技术创新公司', closedAt: '次月01号  14:22' },
  { name: '燕址商务', closedAt: '次月01号  14:14' },
  { name: '研究总院', closedAt: '次月01号  14:05' },
  { name: '西气东输公司', closedAt: '次月01号  13:52' },
  { name: '物资装备公司', closedAt: '次月01号  13:41' },
]

export const REPORT_COLUMNS = ['序号', '企业名称', '关账时间'] as const

/* ───────────── 上行 4 · 协同退单情况 ───────────── */

/** 柱：本年 / 去年协同退单量（万张）；折线：本年 / 去年协同退单率（%） */
export const REJECT_TREND = {
  months: MONTHS_12,
  thisYear: [0.28, 0.2, 0.3, 0.33, 0.3, 0.31, 0.29, 0.26, 0.23, 0.38, 0.5, 1.07],
  lastYear: [0.3, 0.24, 0.34, 0.37, 0.34, 0.35, 0.33, 0.3, 0.27, 0.41, 0.56, 0.98],
  thisRate: [1.8, 1.9, 2.1, 2.0, 2.1, 2.0, 1.8, 1.8, 1.8, 2.0, 2.2, 2.9],
  lastRate: [3.6, 3.2, 2.5, 2.5, 2.2, 2.2, 2.1, 2.0, 1.9, 2.2, 2.2, 2.9],
  yMax: 1.2,
  yInterval: 0.2,
  rateMax: 4,
} as const

/* ───────────── 下行 1 · 商旅预订及报销情况 ───────────── */

/** 柱：本年 / 去年报销率（%）；虚线：本年 / 去年平均预订率（%） */
export const TRAVEL_TREND = {
  months: MONTHS_12,
  thisYear: [65, 76, 73, 74, 70, 74, 69, 68, 72, 64, 72, 86],
  lastYear: [63, 68, 70, 70, 66, 71, 66, 65, 69, 0, 0, 0],
  thisAvg: [97.5, 96.1, 95.5, 95.8, 95.5, 95.5, 95.5, 95.5, 95.4, 95.5, 95.5, 95.5],
  lastAvg: [93.2, 93.6, 93.4, 93.5, 93.3, 93.4, 93.4, 93.5, 93.3, 93.4, 93.4, 93.4],
  yMax: 100,
  yInterval: 20,
} as const

/* ───────────── 下行 2 · 档案邮寄率 ───────────── */

/** 双折线：去年邮寄率（橙色虚线）/ 本年邮寄率（青色实线）+ 本年平均邮寄率（红色） */
export const ARCHIVE_TREND = {
  months: MONTHS_12,
  lastYear: [83, 94, 99, 94, 94, 96, 95, 95, 97, 93, 96, 96],
  thisYear: [96, 96, 99, 95, 96, 96, 96, 98, 99, null, null, null],
  thisAvg: [96.2, 97.6, 99.2, 99.3, 99.4, 99.4, 99.5, 99.4, 99.0, null, null, null],
  yMin: 80,
  yMax: 100,
  yInterval: 5,
} as const

/* ───────────── 下行 3 · 超期未处理情况 ───────────── */

export const OVERDUE_COLUMNS = ['序号', '单位', '商旅', '协同退单', '档案'] as const

export const OVERDUE_ROWS: OverdueRow[] = [
  { unit: '北京燃气管道公司', travel: '486', reject: '18', archive: '12' },
  { unit: '西气东输公司', travel: '341', reject: '15', archive: '9' },
  { unit: '储运销售公司', travel: '268', reject: '12', archive: '11' },
  { unit: '工程技术创新公司', travel: '202', reject: '1', archive: '0' },
  { unit: '建设项目管理公司', travel: '187', reject: '9', archive: '7' },
  { unit: '物资装备公司', travel: '164', reject: '11', archive: '6' },
  { unit: '湖南公司', travel: '152', reject: '8', archive: '5' },
  { unit: '华中公司', travel: '134', reject: '7', archive: '14' },
  { unit: '北京智网数科公司', travel: '100', reject: '4', archive: '0' },
  { unit: '燕址商务', travel: '72', reject: '6', archive: '8' },
  { unit: '共享运营公司', travel: '51', reject: '2', archive: '0' },
  { unit: '工程质量监督检验公司', travel: '44', reject: '1', archive: '0' },
  { unit: '西部管道', travel: '28', reject: '7', archive: '11' },
  { unit: '研究总院', travel: '12', reject: '0', archive: '0' },
]

export const OVERDUE_TOTAL = {
  label: '合计',
  travel: '2241',
  reject: '101',
  archive: '83',
} as const

/* ───────────── 下行 4 · 企业调账情况 ───────────── */

/** 分组柱：本年 / 去年企业调账数量（张） */
export const ADJUST_TREND = {
  months: MONTHS_12,
  thisYear: [1922, 354, 579, 586, 526, 759, 760, 664, 718, 0, 0, 0],
  lastYear: [1880, 402, 648, 940, 612, 806, 822, 712, 764, 920, 1500, 3570],
  yMax: 4000,
  yInterval: 1000,
} as const
