/**
 * 员工钻取页共用的人员花名册（模拟数据）。
 *
 * 取自 `_refs/live/57-钻取-效率情况.png` / `58-钻取-服务情况.png` 的明细表口径：
 * 区域中心 → 岗位 → 职工，共 167 条，与参考图底部「共 167 条数据」一致。
 *
 * 全部用确定性规则派生（不要用 Math.random，否则截图不可复现）。
 */

/** 花名册一行 */
export interface StaffRosterRow {
  centerCode: string
  centerName: string
  postCode: string
  postName: string
  staffCode: string
  staffName: string
  /** 单据处理平均时长（天） */
  duration: string
}

/** 区域中心：编号 / 名称 / 岗位编号前缀 / 岗位名前缀 / 本中心人数 */
const CENTERS = [
  { code: '10001000', name: '北京总部', postBase: 10002000, prefix: '北京', count: 12 },
  { code: '10002000', name: '北部中心', postBase: 20004000, prefix: '北部', count: 28 },
  { code: '10003000', name: '东部中心', postBase: 30004000, prefix: '东部', count: 36 },
  { code: '10004000', name: '西部中心', postBase: 40005000, prefix: '西部', count: 32 },
  { code: '10005000', name: '南部中心', postBase: 50003000, prefix: '南部', count: 30 },
  { code: '10006000', name: '中部中心', postBase: 60002000, prefix: '中部', count: 29 },
] as const

/** 岗位名（不带中心前缀） */
const POSTS = [
  '影像审核岗一组',
  '应付核算一组（后勤）制证',
  '总账报表组审核',
  '资金调拨支付C岗',
  '总账账务处理制证岗',
  '资金审核岗',
  '收入核算制证岗',
  '收入核算审核岗',
  '资金账务处理申请单制证',
  '结账复审岗',
  '税务三组制证岗',
  '检验动力审核岗',
  '账务处理申请单审核组',
  '质检中心整改确认组',
  '争议申诉（终裁）岗',
  '筹融资凭证审核',
] as const

const SURNAMES = [
  '王',
  '李',
  '张',
  '刘',
  '陈',
  '杨',
  '黄',
  '赵',
  '周',
  '吴',
  '徐',
  '孙',
  '马',
  '朱',
  '胡',
  '郭',
  '林',
  '何',
  '高',
  '罗',
  '贾',
  '金',
  '柯',
  '殷',
  '余',
  '舒',
  '杜',
  '方',
] as const

const GIVEN_NAMES = [
  '雪鹏',
  '江帆',
  '雪斌',
  '贤祐',
  '国庆',
  '玉鹏',
  '春凤',
  '思奇',
  '一丹',
  '旭宇',
  '昕瞳',
  '俊荣',
  '武林',
  '凌霄',
  '梦婷',
  '晨光',
  '嘉树',
  '浩然',
  '泽宇',
  '明远',
  '书瑶',
  '婉清',
  '承志',
  '佳怡',
  '少卿',
  '立诚',
  '子衿',
  '望舒',
  '抒怀',
  '靖安',
  '观澜',
] as const

/** 167 条花名册 */
export const STAFF_ROSTER_ROWS: StaffRosterRow[] = buildRoster()

/** 明细条数（页脚「共 N 条数据」） */
export const STAFF_ROSTER_TOTAL = STAFF_ROSTER_ROWS.length

function buildRoster(): StaffRosterRow[] {
  const rows: StaffRosterRow[] = []
  let i = 0

  for (const center of CENTERS) {
    for (let n = 0; n < center.count; n += 1) {
      const post = POSTS[(i * 5 + n) % POSTS.length]
      rows.push({
        centerCode: center.code,
        centerName: center.name,
        postCode: String(center.postBase + n * 7 + 1),
        postName: `${center.prefix}_${post}`,
        staffCode: String(10000000 + ((i * 6700417) % 19999999)),
        staffName: `${SURNAMES[i % SURNAMES.length]}${GIVEN_NAMES[(i * 11) % GIVEN_NAMES.length]}`,
        duration: (0.15 + ((i * 7) % 16) / 100).toFixed(2),
      })
      i += 1
    }
  }

  return rows
}
