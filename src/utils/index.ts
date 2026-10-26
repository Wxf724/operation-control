import dayjs from 'dayjs'

/**
 * 日历日粒度：若 end 早于 start 返回 true。
 * 与 DatePicker 的 DateValue（`String` 后为可解析日期）或 `YYYY-MM-DD` 等字符串兼容。
 * 任一端为 null/undefined 或解析失败则返回 false。
 */
export function isEndDateBeforeStartDate(start: unknown, end: unknown): boolean {
  if (start == null || end == null) return false
  const startD = dayjs(String(start))
  const endD = dayjs(String(end))
  if (!startD.isValid() || !endD.isValid()) return false
  return endD.isBefore(startD, 'day')
}

/**
 * 校验中国大陆手机号：11 位数字，以 1 开头，第二位 3–9。
 * 用于成员档案、登录等场景；空字符串返回 false。
 */
export function isValidChinaMobile(mobile: string): boolean {
  const s = mobile.trim()
  if (!s) return false
  return /^1[3-9]\d{9}$/.test(s)
}

/**
 * 校验常见邮箱格式（非空时校验；用于企业邮箱等）。
 * 规则：本地部分 + @ + 域名含点，不允许空白。
 */
export function isValidEmailFormat(email: string): boolean {
  const s = email.trim()
  if (!s) return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)
}

/**
 * 常见指标尾词。中文指标名基本是「作用域 + 尾词」，如
 * 「月末结账申请单｜提交完成率」——能在尾词前断开时优先这样断，
 * 免得把「申请单」这类词劈成两行。
 */
const METRIC_TAIL_WORDS = [
  '提交完成率',
  '提交及时率',
  '提交率',
  '完成率',
  '及时率',
  '准确率',
  '达成率',
  '挂报率',
  '上报率',
  '回款率',
  '退单率',
  '直联率',
  '数量',
  '金额',
  '总量',
  '情况',
  '时长',
  '评分',
  '占比',
] as const

/**
 * 中文指标标签折行：超过一行放得下的字数时折成两行。
 *
 * 浏览器自动折行会把「分项业务处理质量达成率」断成「分项业务处理质量达成 / 率」，
 * 第二行只剩一个字很难看；这里在渲染前就断好，让两行长短接近。
 *
 * - `text` 不长于 `maxChars`：原样返回一行
 * - 否则在两行都不少于 2 字的前提下挑断点：优先中点（两行均分），
 *   若在尾词前断开能让两行字数差控制在原长的 20% 以内，则改用语义断点
 * - 例：11 字 → 6+5，8 字 → 4+4，12 字的「…申请单提交完成率」→ 7+5
 */
export function splitLabelLines(text: string, maxChars = 6): string[] {
  const label = text.trim()
  if (label.length <= maxChars) return [label]

  const mid = Math.ceil(label.length / 2)
  const tail = METRIC_TAIL_WORDS.find((w) => label.length > w.length && label.endsWith(w))

  /** 语义断点在前：与中点同分时优先语义断点 */
  const candidates = tail ? [label.length - tail.length, mid] : [mid]

  const valid = candidates.filter((i) => i >= 2 && label.length - i >= 2)
  if (!valid.length) return [label.slice(0, mid), label.slice(mid)]

  /** 分数越小越好：两行字数差越小越好，语义断点额外减 20% 原长 */
  const score = (i: number) => {
    const imbalance = Math.abs(i - (label.length - i)) / label.length
    return imbalance - (i === mid ? 0 : 0.2)
  }

  const cut = valid.reduce((best, i) => (score(i) < score(best) ? i : best))
  return [label.slice(0, cut), label.slice(cut)]
}

const DEFAULT_AVATAR_ICON = 'ri-robot-2-line'
const DEFAULT_AVATAR_BG = 'bg-slate-100 text-slate-600'
const ALLOWED_AVATAR_BG = new Set([
  'bg-slate-100 text-slate-600',
  'bg-teal-100 text-teal-600',
  'bg-violet-100 text-violet-600',
  'bg-indigo-100 text-indigo-600',
  'bg-emerald-100 text-emerald-600',
  'bg-orange-100 text-orange-600',
  'bg-red-100 text-red-600',
  'bg-yellow-100 text-yellow-600',
  'bg-cyan-100 text-cyan-600',
  'bg-rose-100 text-rose-600',
  'bg-fuchsia-100 text-fuchsia-600',
  'bg-lime-100 text-lime-700',
  'bg-amber-100 text-amber-700',
  'bg-sky-100 text-sky-600',
  'bg-purple-100 text-purple-600',
  'bg-green-100 text-green-700',
  'bg-blue-100 text-blue-600',
  'bg-pink-100 text-pink-600',
  'bg-neutral-100 text-neutral-600',
  'bg-stone-100 text-stone-600',
])

/**
 * 解析智能体头像配置：
 * - 期望后端返回 JSON 字符串：{"icon":"ri-xxx","iconBg":"bg-... text-..."}
 * - 不合法或缺失时回退默认图标与背景色
 */
export function parseAgentAvatar(rawAvatar?: string): { icon: string; iconBg: string } {
  if (!rawAvatar) {
    return { icon: DEFAULT_AVATAR_ICON, iconBg: DEFAULT_AVATAR_BG }
  }

  try {
    const parsed = JSON.parse(rawAvatar) as { icon?: unknown; iconBg?: unknown }
    const icon =
      typeof parsed?.icon === 'string' && /^ri-[a-z0-9-]+$/i.test(parsed.icon)
        ? parsed.icon
        : DEFAULT_AVATAR_ICON
    const iconBg =
      typeof parsed?.iconBg === 'string' && ALLOWED_AVATAR_BG.has(parsed.iconBg.trim())
        ? parsed.iconBg.trim()
        : DEFAULT_AVATAR_BG
    return { icon, iconBg }
  } catch {
    return { icon: DEFAULT_AVATAR_ICON, iconBg: DEFAULT_AVATAR_BG }
  }
}
