/** 员工钻取页的返回入口：三个页面都从员工管理平台的面板标题进来 */
export const STAFF_DRILL_BACK_PATH = '/platform/staff'

/**
 * 用字符串派生一个 0~1 的确定性扰动。
 *
 * 模拟数据必须可复现（不要用 `Math.random`，否则每次截图都不一样），
 * 与 `loadData.ts` 里的 `jitter` 同思路，这里按员工页的几张表单独维护。
 */
export function staffJitter(seed: string, salt: number): number {
  let sum = salt
  for (let i = 0; i < seed.length; i += 1) sum += seed.charCodeAt(i) * (i + 1)
  return (sum % 101) / 101
}

/** 共享中心的 5 个区域中心（参考图 55 / 56 的「区域中心编号 + 区域中心」两列） */
export const STAFF_DRILL_CENTERS: readonly { code: string; name: string; short: string }[] = [
  { code: '10001000', name: '北京总部', short: '北京' },
  { code: '10002000', name: '北部中心', short: '北部' },
  { code: '10003000', name: '东部中心', short: '东部' },
  { code: '10004000', name: '西部中心', short: '西部' },
  { code: '10005000', name: '南部中心', short: '南部' },
]
