# 大屏动效

- `OrbitAccent`：子页面圆环外围保持常驻运转，分段刻度 24 秒反向旋转、扫描亮弧 6 秒正向旋转；无须点击或刷新触发，中心数字与数据环不参与旋转。

- `AnimatedNumber`：传入 `value`（数字或数字字符串），首次可见和数值更新时播放 900ms 递增。保留千分位、小数精度和百分号；非数字文案原样显示。以最终值预留宽度，读屏只读取最终值。
- `PanelBox`：统一短暂入场；`ProgressBar`：进度填充展开，后续进度变化平滑过渡。
- `src/styles/themes/cockpit-motion.css`：动效时长、分批延迟和悬停反馈。`data-ck-active="false"` 禁用隐藏轮播页的 CSS 动画，切屏后再播放。
- 新增 CSS 动画和数字递增遵循 `prefers-reduced-motion`。动画只改变展示，不修改业务数据，也不会周期性随机刷新数值。
- 常驻动态：地图 9 秒扫光与站点涟漪、迷你趋势线 6 秒流动、完成率外圈 40 秒转动、异常标签 3.2 秒光晕、执行中任务 2.6 秒进度高光。完成和待协调任务不显示运行高光。隐藏轮播页暂停新增循环动画；减少动态效果时关闭装饰循环和地图涟漪。
- 平台页共用的 AI 调控策略中，仅“处理中”的进度图标每 4 秒旋转一周，已处理和待处理图标保持静态。

```tsx
import { AnimatedNumber } from '@/components/cockpit-ui'

<AnimatedNumber value="3,286" />
<AnimatedNumber value="96.0%" />
```
