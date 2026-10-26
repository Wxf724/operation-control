import type { ControlTask } from './types'

/**
 * 右栏「智能调控模型执行结果」的数据。
 *
 * 版面与首条任务的数值对照用户给的参考稿；其余三条任务是同一起积压事件
 * 派生出的并行处置动作，各自带一条完整的「感知 → 解释 → 策略 → 反馈」链路，
 * 点击任务行时下方四个模型整体切换到该任务的结果。
 */

/** 顶部统计条，逐项照参考稿；每项自带图标与色调，横向分散排布 */
export const MODEL_SUMMARY = [
  {
    label: '今日识别异常',
    value: '5',
    unit: '项',
    icon: 'ri-alarm-warning-line',
    tone: '--ck-red',
  },
  { label: '完成诊断', value: '5', unit: '项', icon: 'ri-stethoscope-line', tone: '--ck-cyan' },
  {
    label: '生成策略',
    value: '4',
    unit: '项',
    icon: 'ri-lightbulb-flash-line',
    tone: '--ck-orange',
  },
] as const

/** 统计条末段的三个闭环状态 */
export const MODEL_CLOSURE = [
  { label: '闭环', value: '2', unit: '项', icon: 'ri-checkbox-circle-line', tone: '--ck-green' },
  { label: '执行中', value: '1', unit: '项', icon: 'ri-play-circle-line', tone: '--ck-blue' },
  { label: '待协调', value: '1', unit: '项', icon: 'ri-time-line', tone: '--ck-purple' },
] as const

export const CONTROL_TASK_COLUMNS = ['任务名称', '执行人', '执行时间', '状态', '进度'] as const

export const CONTROL_TASKS: ControlTask[] = [
  {
    id: 'dispatch-north',
    name: '调配北部中心审核人员',
    owner: '张三',
    time: '09-21 15:40',
    status: '执行中',
    statusTone: 'orange',
    progress: 60,
    models: {
      perception: [
        { label: '异常场景', value: '待处理单据积压异常' },
        { label: '异常对象', value: '北部中心' },
        { label: '当前值', value: '398 笔', tail: '> 300 笔', tone: 'red', big: true },
        { label: '预警阈值', value: '300 笔' },
        {
          label: '异常等级',
          value: '严重预警',
          tone: 'red',
          icon: 'ri-error-warning-fill',
        },
        { label: '触发时间', value: '15:32' },
      ],
      explain: [
        { label: '主因', value: '人均单据处理效率低' },
        { label: '实际效率', value: '8.6 笔/人·小时' },
        { label: '基准效率', value: '11.2 笔/人·小时' },
        { label: '偏离程度', value: '23.2%', tone: 'red', icon: 'ri-arrow-down-fill', big: true },
        { label: '次因', value: '系统性能下降，影响处理能力约12%' },
        { label: '排除原因', value: 'RPA数量不足（未触发）' },
      ],
      strategy: {
        rows: [
          { label: '最优策略', value: '人员+RPA联合调控', tone: 'cyan' },
          { label: '临时调配审核人员', value: '2 人' },
          { label: '调整人员来源', value: '东部中心' },
          { label: 'RPA任务优先级', value: '提升至一级' },
          { label: '优先处理', value: '超24小时积压单据' },
          { label: '策略执行窗口', value: '15:40 — 18:00' },
        ],
        candidateCols: ['候选策略', '预计消化量', '预计恢复时间'],
        candidates: [
          { name: '仅增加人员', effect: '86 笔', recoverAt: '19:20' },
          { name: '仅调整RPA', effect: '72 笔', recoverAt: '20:10' },
          { name: '人员+RPA联合调控', effect: '142 笔', recoverAt: '17:50', chosen: true },
        ],
      },
      feedback: {
        rows: [
          {
            label: '积压量',
            value: '398 → 286',
            delta: { text: '下降28.1%', tone: 'green', icon: 'ri-arrow-down-fill' },
          },
          {
            label: '人均处理效率',
            value: '8.6 → 10.7',
            tail: '笔/人·小时',
            delta: { text: '提升24.4%', tone: 'green', icon: 'ri-arrow-up-fill' },
          },
          { label: 'RPA处理效率', value: '92 → 108', tail: '笔/台·小时' },
          { label: '策略执行完成度', value: '78%', progress: 78 },
          {
            label: '当前判断',
            value: '调控有效，持续执行',
            tone: 'green',
            icon: 'ri-checkbox-circle-fill',
          },
        ],
        chartTitle: '积压量变化（笔）',
        bars: [
          { label: '调控前', value: '398', ratio: 100, tone: 'red' },
          { label: '调控后', value: '286', ratio: 72, tone: 'blue' },
          { label: '目标值', value: '≤300', ratio: 75, tone: 'default' },
        ],
      },
    },
  },
  {
    id: 'rpa-priority',
    name: '提升RPA任务优先级',
    owner: 'RPA系统',
    time: '09-21 15:42',
    status: '已完成',
    statusTone: 'green',
    progress: 100,
    models: {
      perception: [
        { label: '异常场景', value: 'RPA队列等待超时' },
        { label: '异常对象', value: '共享中心RPA集群' },
        { label: '当前值', value: '46 分', tail: '> 20 分', tone: 'red', big: true },
        { label: '预警阈值', value: '20 分' },
        { label: '异常等级', value: '中度预警', tone: 'orange', icon: 'ri-error-warning-fill' },
        { label: '触发时间', value: '15:35' },
      ],
      explain: [
        { label: '主因', value: '低优先级任务抢占执行槽' },
        { label: '实际效率', value: '92 笔/台·小时' },
        { label: '基准效率', value: '115 笔/台·小时' },
        { label: '偏离程度', value: '20.0%', tone: 'red', icon: 'ri-arrow-down-fill', big: true },
        { label: '次因', value: '夜间批处理任务未错峰' },
        { label: '排除原因', value: '机器人故障（未触发）' },
      ],
      strategy: {
        rows: [
          { label: '最优策略', value: '优先级重排+错峰执行', tone: 'cyan' },
          { label: '提升优先级机器人', value: '6 台' },
          { label: '让渡低优任务', value: '11 项' },
          { label: 'RPA任务优先级', value: '提升至一级' },
          { label: '优先处理', value: '审核类待办队列' },
          { label: '策略执行窗口', value: '15:42 — 16:30' },
        ],
        candidateCols: ['候选策略', '预计消化量', '预计恢复时间'],
        candidates: [
          { name: '仅扩容机器人', effect: '64 笔', recoverAt: '18:40' },
          { name: '仅错峰执行', effect: '51 笔', recoverAt: '19:30' },
          { name: '优先级重排+错峰', effect: '118 笔', recoverAt: '16:30', chosen: true },
        ],
      },
      feedback: {
        rows: [
          {
            label: '队列等待',
            value: '46 → 12',
            tail: '分',
            delta: { text: '下降73.9%', tone: 'green', icon: 'ri-arrow-down-fill' },
          },
          {
            label: 'RPA处理效率',
            value: '92 → 121',
            tail: '笔/台·小时',
            delta: { text: '提升31.5%', tone: 'green', icon: 'ri-arrow-up-fill' },
          },
          { label: '任务完成量', value: '1,180 → 1,460', tail: '笔' },
          { label: '策略执行完成度', value: '100%', progress: 100 },
          {
            label: '当前判断',
            value: '已闭环，恢复常态',
            tone: 'green',
            icon: 'ri-checkbox-circle-fill',
          },
        ],
        chartTitle: '队列等待变化（分）',
        bars: [
          { label: '调控前', value: '46', ratio: 100, tone: 'red' },
          { label: '调控后', value: '12', ratio: 26, tone: 'blue' },
          { label: '目标值', value: '≤20', ratio: 43, tone: 'default' },
        ],
      },
    },
  },
  {
    id: 'overdue-docs',
    name: '超24小时单据专项处理',
    owner: '李四',
    time: '09-21 16:10',
    status: '执行中',
    statusTone: 'orange',
    progress: 45,
    models: {
      perception: [
        { label: '异常场景', value: '单据超期未处理' },
        { label: '异常对象', value: '北部中心审核岗' },
        { label: '当前值', value: '137 笔', tail: '> 80 笔', tone: 'red', big: true },
        { label: '预警阈值', value: '80 笔' },
        { label: '异常等级', value: '严重预警', tone: 'red', icon: 'ri-error-warning-fill' },
        { label: '触发时间', value: '16:02' },
      ],
      explain: [
        { label: '主因', value: '超期单据集中在复杂业务类' },
        { label: '实际效率', value: '5.4 笔/人·小时' },
        { label: '基准效率', value: '9.8 笔/人·小时' },
        { label: '偏离程度', value: '44.9%', tone: 'red', icon: 'ri-arrow-down-fill', big: true },
        { label: '次因', value: '跨中心协同退单占比偏高' },
        { label: '排除原因', value: '人员在岗不足（未触发）' },
      ],
      strategy: {
        rows: [
          { label: '最优策略', value: '专项组集中清理', tone: 'cyan' },
          { label: '抽调专项处理人员', value: '3 人' },
          { label: '调整人员来源', value: '南部中心' },
          { label: '处理顺序', value: '超48小时优先' },
          { label: '优先处理', value: '复杂业务类单据' },
          { label: '策略执行窗口', value: '16:10 — 20:00' },
        ],
        candidateCols: ['候选策略', '预计消化量', '预计恢复时间'],
        candidates: [
          { name: '常规排队处理', effect: '42 笔', recoverAt: '次日 10:30' },
          { name: '增派 1 人', effect: '78 笔', recoverAt: '21:40' },
          { name: '专项组集中清理', effect: '125 笔', recoverAt: '20:00', chosen: true },
        ],
      },
      feedback: {
        rows: [
          {
            label: '超期单据',
            value: '137 → 94',
            tail: '笔',
            delta: { text: '下降31.4%', tone: 'green', icon: 'ri-arrow-down-fill' },
          },
          {
            label: '人均处理效率',
            value: '5.4 → 7.9',
            tail: '笔/人·小时',
            delta: { text: '提升46.3%', tone: 'green', icon: 'ri-arrow-up-fill' },
          },
          { label: '平均超期时长', value: '31 → 26', tail: '小时' },
          { label: '策略执行完成度', value: '45%', progress: 45 },
          {
            label: '当前判断',
            value: '调控有效，持续执行',
            tone: 'green',
            icon: 'ri-checkbox-circle-fill',
          },
        ],
        chartTitle: '超期单据变化（笔）',
        bars: [
          { label: '调控前', value: '137', ratio: 100, tone: 'red' },
          { label: '调控后', value: '94', ratio: 69, tone: 'blue' },
          { label: '目标值', value: '≤80', ratio: 58, tone: 'default' },
        ],
      },
    },
  },
  {
    id: 'system-tuning',
    name: '系统性能优化',
    owner: '王五',
    time: '09-21 16:20',
    status: '待协调',
    statusTone: 'red',
    progress: 20,
    models: {
      perception: [
        { label: '异常场景', value: '系统响应时延升高' },
        { label: '异常对象', value: '共享服务平台' },
        { label: '当前值', value: '2.8 秒', tail: '> 1.5 秒', tone: 'red', big: true },
        { label: '预警阈值', value: '1.5 秒' },
        { label: '异常等级', value: '中度预警', tone: 'orange', icon: 'ri-error-warning-fill' },
        { label: '触发时间', value: '16:12' },
      ],
      explain: [
        { label: '主因', value: '数据库慢查询增多' },
        { label: '实际时延', value: '2.8 秒/次' },
        { label: '基准时延', value: '1.2 秒/次' },
        // 时延是「越低越好」，所以这里的偏离是向上的，仍记为红
        { label: '偏离程度', value: '133.3%', tone: 'red', icon: 'ri-arrow-up-fill', big: true },
        { label: '次因', value: '并发峰值较上周上升 18%' },
        { label: '排除原因', value: '网络链路抖动（未触发）' },
      ],
      strategy: {
        rows: [
          { label: '最优策略', value: '慢查询治理+弹性扩容', tone: 'cyan' },
          { label: '待扩容应用节点', value: '4 个' },
          { label: '协调对象', value: '运维中心' },
          { label: '索引优化项', value: '7 项' },
          { label: '优先处理', value: '单据列表查询接口' },
          { label: '策略执行窗口', value: '待运维确认', tone: 'orange' },
        ],
        candidateCols: ['候选策略', '预计时延', '预计恢复时间'],
        candidates: [
          { name: '仅弹性扩容', effect: '2.1 秒', recoverAt: '17:30' },
          { name: '仅慢查询治理', effect: '1.9 秒', recoverAt: '18:20' },
          { name: '治理+扩容', effect: '1.3 秒', recoverAt: '17:10', chosen: true },
        ],
      },
      feedback: {
        rows: [
          {
            label: '响应时延',
            value: '2.8 → 2.5',
            tail: '秒',
            delta: { text: '下降10.7%', tone: 'green', icon: 'ri-arrow-down-fill' },
          },
          { label: '慢查询数', value: '164 → 139', tail: '条/时' },
          { label: '并发承载', value: '1,200 → 1,350', tail: '次/分' },
          { label: '策略执行完成度', value: '20%', progress: 20 },
          {
            label: '当前判断',
            value: '待运维协调确认',
            tone: 'orange',
            icon: 'ri-time-fill',
          },
        ],
        chartTitle: '响应时延变化（秒）',
        bars: [
          { label: '调控前', value: '2.8', ratio: 100, tone: 'red' },
          { label: '调控后', value: '2.5', ratio: 89, tone: 'blue' },
          { label: '目标值', value: '≤1.5', ratio: 54, tone: 'default' },
        ],
      },
    },
  },
]
