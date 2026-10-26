/**
 * 首页 = 三页左右滑动的轮播。
 *
 * 原来一整屏横向并排的三栏，现在各成一页：
 *   1. 全景座舱（地图页，默认）— 原中栏，见 `screens/MapScreen`
 *   2. 运营结果与趋势         — 原左栏，见 `screens/OverviewScreen`
 *   3. 模型执行与操作         — 原右栏，见 `screens/ModelScreen`
 * 轮播、手势与翻页控件在 `CockpitPager`。
 */
export { CockpitPager } from './CockpitPager'
