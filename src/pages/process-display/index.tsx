import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ScreenHeader, ScreenScaler } from '@/components/cockpit-ui'

import { FlowRoad } from './FlowRoad'
import { ProcessDetail } from './ProcessDetail'
import { PROCESS_NODE_MAP } from './data'

/**
 * 设计稿尺寸：目标稿 2000×977，本页按 1.2 倍换算成 2400×1172。
 * 骨架（画布 px）：左右页边距 35 / 40，标题区 142，内容区 950，底部留白 80；
 * 左列 1700、列间距 22、右列 604。
 */
const FLOW_CANVAS = { width: 2400, height: 1172 } as const
const PAD_LEFT = 35
const PAD_RIGHT = 40
const COL_GAP = 22
/** 标题区 142 = 顶部留白 50 + 顶栏 92（目标稿里主标题中心在画布 y≈96） */
const HEADER_TOP = 50
const HEADER_H = 92
const PAD_BOTTOM = 80
const RIGHT_W = 604

const PERIOD = '2026-09-01 至 2026-09-21'

/**
 * 全业务流程展示。
 *
 * 入口：作业管理平台「作业处理整体情况」右上角的「全业务流程」按钮。
 * 版面复刻线上 FineBI 同页：左侧三个环节面板里串着一条 U 型折返跑道
 * （23 个业务节点 + 4 个环节标注），右侧展示所选节点的指标卡与
 * 「现状问题 / 解决方案 / 催办状态」。默认选中 08 档案对比。
 */
export function ProcessDisplayPage() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(8)
  const node = PROCESS_NODE_MAP.get(selected)

  return (
    <div className="theme-cloud-light ck-screen">
      <ScreenScaler width={FLOW_CANVAS.width} height={FLOW_CANVAS.height}>
        <div className="flex h-full w-full flex-col">
          <div className="shrink-0" style={{ height: HEADER_TOP }} />
          <ScreenHeader
            title={<span className="text-[40px] leading-none">全业务流程展示</span>}
            height={HEADER_H}
            left={<BackToJobButton onClick={() => navigate('/platform/job')} />}
            right={
              <span className="flex items-center gap-2 rounded-[3px] border border-(--border) bg-(--ck-panel-inner) px-3 py-[7px] text-[13px] leading-none text-(--text-secondary)">
                <i className="ri-calendar-line text-[14px] text-(--ck-cyan)" aria-hidden />
                {PERIOD}
              </span>
            }
          />

          <div
            className="flex min-h-0 flex-1"
            style={{
              paddingLeft: PAD_LEFT,
              paddingRight: PAD_RIGHT,
              paddingBottom: PAD_BOTTOM,
              gap: COL_GAP,
            }}
          >
            <FlowRoad selected={selected} onSelect={setSelected} />
            <ProcessDetail node={node} className="shrink-0" width={RIGHT_W} />
          </div>
        </div>
      </ScreenScaler>
    </div>
  )
}

/** 左上角返回按钮：回到作业管理平台 */
function BackToJobButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title="返回作业管理平台"
      className="flex h-[30px] w-[30px] shrink-0 cursor-pointer items-center justify-center rounded-[3px] border border-(--border) bg-(--ck-panel-inner) text-[17px] text-(--ck-cyan) transition-colors hover:bg-(--accent-light)"
    >
      <i className="ri-arrow-left-line" aria-hidden />
    </button>
  )
}
