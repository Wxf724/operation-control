import type { MetricPill } from './types'

/**
 * 各业务模块的核心指标。
 *
 * 一处定义、两处使用：
 * - 首页中部地图下方的指标药丸（随选中模块切换）
 * - 对应模块平台页顶部的 KPI 卡条
 *
 * 数值全部按线上真实页面截图录入（_refs/live/，日期区间 2026-10-01 ~ 2026-10-19）。
 */
export const MODULE_METRICS: Record<string, MetricPill[]> = {
  /* 作业管理平台 —— 7 张卡；「单据分配负载率」原件为黄色预警态 */
  job: [
    { key: 'received', label: '单据接收量', value: '9,000', unit: '笔', icon: 'ri-inbox-archive-line' },
    { key: 'finished', label: '单据完成量', value: '8,000', unit: '笔', icon: 'ri-checkbox-circle-line' },
    { key: 'load', label: '单据分配负载率', value: '90%', unit: '', icon: 'ri-scales-3-line', tone: 'orange' },
    { key: 'capacity', label: '平均单据产能', value: '1,400', unit: '笔/月', icon: 'ri-speed-up-line' },
    { key: 'duration', label: '单据平均处理时长', value: '5', unit: '分钟', icon: 'ri-time-line' },
    { key: 'quality', label: '全流程业务处理质量', value: '99%', unit: '', icon: 'ri-shield-star-line' },
    { key: 'ontime', label: '管理口径主报表及时率', value: '100%', unit: '', icon: 'ri-line-chart-line' },
  ],

  /* 员工管理平台 —— 7 张卡 */
  staff: [
    { key: 'finished', label: '单据完成量', value: '500', unit: '笔', icon: 'ri-bar-chart-box-line' },
    { key: 'pending', label: '待处理单据量', value: '12', unit: '笔', icon: 'ri-file-list-2-line' },
    { key: 'capacity', label: '平均单据产能', value: '500', unit: '笔/月', icon: 'ri-speed-up-line' },
    { key: 'quality', label: '全流程业务处理质量', value: '99%', unit: '', icon: 'ri-shield-star-line' },
    { key: 'error', label: '质量稽核差错率', value: '95%', unit: '', icon: 'ri-calculator-line' },
    { key: 'duration', label: '单据平均处理时长', value: '10', unit: '分钟', icon: 'ri-time-line' },
    { key: 'complaint', label: '用户投诉总量', value: '6', unit: '起', icon: 'ri-feedback-line' },
  ],

  /* RPA管理平台 —— 6 张卡 */
  rpa: [
    { key: 'coverage', label: 'RPA覆盖率', value: '89.0%', unit: '', icon: 'ri-pie-chart-line' },
    { key: 'enabled', label: 'RPA启用率', value: '89.0%', unit: '', icon: 'ri-cursor-line' },
    { key: 'online', label: 'RPA在线运行数量', value: '263', unit: '个', icon: 'ri-robot-2-line' },
    { key: 'success', label: 'RPA执行成功单据量', value: '200,000', unit: '张', icon: 'ri-file-check-line' },
    { key: 'toHuman', label: 'RPA转人工率', value: '5.0%', unit: '', icon: 'ri-user-shared-line' },
    { key: 'auto', label: 'RPA自动化率', value: '96.0%', unit: '', icon: 'ri-settings-5-line' },
  ],

  /* 规则管理平台 —— 5 张卡 */
  rule: [
    { key: 'added', label: '规则新增数', value: '200', unit: '个', icon: 'ri-file-add-line' },
    { key: 'active', label: '规则在用数', value: '1,200', unit: '个', icon: 'ri-file-settings-line' },
    { key: 'smartRatio', label: '智能审核规则占比', value: '83.3%', unit: '', icon: 'ri-pie-chart-2-line' },
    { key: 'calls', label: '规则调用次数', value: '5,000', unit: '个', icon: 'ri-refresh-line' },
    { key: 'hit', label: '审核规则有效命中率', value: '100%', unit: '', icon: 'ri-focus-2-line' },
  ],

  /* 标准流程管理平台 —— 5 张卡 */
  process: [
    { key: 'standard', label: '流程标准化率', value: '99%', unit: '', icon: 'ri-scales-3-line' },
    { key: 'stay', label: '单据平均停留时长', value: '5', unit: '小时', icon: 'ri-time-line' },
    { key: 'overdue', label: '超期停留单据量', value: '500', unit: '笔', icon: 'ri-timer-flash-line' },
    { key: 'unvouchered', label: '结账未制证待处理单据量', value: '98', unit: '笔', icon: 'ri-clipboard-line' },
    { key: 'toSubmit', label: '月末结账申请单待提交量', value: '10', unit: '笔', icon: 'ri-send-plane-line' },
  ],

  /* 质量管理平台 —— 6 张卡 */
  quality: [
    { key: 'voucherSample', label: '凭证抽样率', value: '70%', unit: '', icon: 'ri-file-copy-2-line' },
    { key: 'archiveSample', label: '档案抽样率', value: '47%', unit: '', icon: 'ri-folder-2-line' },
    { key: 'auditDone', label: '凭证稽核完成率', value: '99%', unit: '', icon: 'ri-checkbox-circle-line' },
    { key: 'auditDuration', label: '稽核单据处理时长', value: '5', unit: '分钟', icon: 'ri-time-line' },
    { key: 'errorRate', label: '稽核差错率', value: '1%', unit: '', icon: 'ri-error-warning-line' },
    { key: 'fixRate', label: '问题整改率', value: '93%', unit: '', icon: 'ri-checkbox-multiple-line' },
  ],

  /* 信用管理监控平台 —— 6 张卡，右上角标「截至当日」 */
  credit: [
    { key: 'score', label: '报销信用评分均值', value: '95', unit: '分', icon: 'ri-user-star-line', asOf: '截至当日' },
    { key: 'low', label: '低信用人员数量', value: '50', unit: '人', icon: 'ri-shield-user-line', asOf: '截至当日' },
    { key: 'severe', label: '严重失信人员数量', value: '10', unit: '人', icon: 'ri-user-forbid-line', asOf: '截至当日' },
    { key: 'deductDocs', label: '报销信用扣分单据数量', value: '10', unit: '张', icon: 'ri-file-reduce-line', asOf: '截至当日' },
    { key: 'appealPass', label: '申诉通过率', value: '0.30%', unit: '', icon: 'ri-checkbox-circle-line', asOf: '截至当日' },
    { key: 'rules', label: '规则在用数', value: '70', unit: '个', icon: 'ri-book-2-line', asOf: '截至当日' },
  ],

  /* 服务管理平台 —— 6 张卡 */
  service: [
    { key: 'firstResponse', label: '平均首次响应时长', value: '5', unit: '分钟', icon: 'ri-timer-line' },
    { key: 'ontime', label: '咨询事项解决及时率', value: '95%', unit: '', icon: 'ri-shake-hands-line' },
    { key: 'resolved', label: '咨询事项解决率', value: '98%', unit: '', icon: 'ri-group-line' },
    { key: 'toHuman', label: 'AI客服转人工会话率', value: '5.0%', unit: '', icon: 'ri-user-voice-line' },
    { key: 'satisfaction', label: '工单服务满意度评分', value: '97%', unit: '', icon: 'ri-emotion-happy-line' },
    { key: 'sla', label: '服务协议综合达成率', value: '96.0%', unit: '', icon: 'ri-task-line' },
  ],

  /* 绩效管理平台 —— 6 张卡，右上角标「截至当日」 */
  performance: [
    { key: 'capacity', label: '平均单据产能', value: '1,100', unit: '笔', icon: 'ri-bar-chart-box-line', asOf: '截至当日' },
    { key: 'quality', label: '全流程业务处理质量', value: '99.0%', unit: '', icon: 'ri-shield-star-line', asOf: '截至当日' },
    { key: 'duration', label: '全流程平均处理时长', value: '16', unit: '小时', icon: 'ri-time-line', asOf: '截至当日' },
    { key: 'reportAccuracy', label: '报表编制准确率', value: '99.0%', unit: '', icon: 'ri-clipboard-line', asOf: '截至当日' },
    { key: 'reportOnTime', label: '报表出具及时率', value: '99.0%', unit: '', icon: 'ri-file-chart-line', asOf: '截至当日' },
    { key: 'cost', label: '成本费用总额', value: '5,000', unit: '万', icon: 'ri-money-cny-circle-line', asOf: '截至当日' },
  ],

  /* 系统运行管理平台 —— 6 张卡 */
  system: [
    { key: 'available', label: '服务可用率', value: '99%', unit: '', icon: 'ri-shield-check-line' },
    { key: 'faultTime', label: '累计故障时长', value: '10', unit: '分钟', icon: 'ri-time-line' },
    { key: 'faultCount', label: '累计故障次数', value: '1', unit: '次', icon: 'ri-alert-line' },
    { key: 'openCost', label: '单据填报打开平均耗时', value: '1', unit: '分钟', icon: 'ri-timer-2-line' },
    { key: 'changeSuccess', label: '变更成功率', value: '99%', unit: '', icon: 'ri-loop-right-line' },
    { key: 'resource', label: '资源承载率', value: '90%', unit: '', icon: 'ri-database-2-line' },
  ],

  /* 商旅业务管理平台 —— 6 张卡 */
  travel: [
    { key: 'amount', label: '商旅预订订单总金额', value: '20,000', unit: '万元', icon: 'ri-money-cny-circle-line' },
    { key: 'orders', label: '商旅预订订单总量', value: '370,000', unit: '张', icon: 'ri-file-list-3-line' },
    { key: 'usage', label: '商旅平台使用率', value: '95.0%', unit: '', icon: 'ri-pie-chart-line' },
    { key: 'reimburse', label: '商旅订单报销率', value: '91.0%', unit: '', icon: 'ri-bill-line' },
    { key: 'refund', label: '退票改签发生率', value: '4.0%', unit: '', icon: 'ri-exchange-line' },
    { key: 'doubt', label: '商旅疑点订单确认量', value: '4', unit: '张', icon: 'ri-question-line' },
  ],

  /* 档案业务管理平台 —— 6 张卡 */
  archive: [
    { key: 'mailRate', label: '档案邮寄率', value: '95%', unit: '', icon: 'ri-mail-send-line' },
    { key: 'unsigned', label: '已邮寄未签收单据量', value: '56', unit: '份', icon: 'ri-mail-close-line' },
    { key: 'problem', label: '问题档案数量', value: '48', unit: '份', icon: 'ri-file-warning-line' },
    { key: 'pending', label: '待处理问题档案数量', value: '18', unit: '份', icon: 'ri-file-list-2-line' },
    { key: 'bound', label: '应预成册量', value: '1,780', unit: '份', icon: 'ri-book-3-line' },
    { key: 'paperless', label: '档案无纸化率', value: '73%', unit: '', icon: 'ri-leaf-line' },
  ],

  /* 风险管理平台 —— 7 张卡，按目标稿 _refs/live/59-风险管理平台-目标稿.png 录入 */
  risk: [
    { key: 'available', label: '系统服务可用率', value: '90%', unit: '', icon: 'ri-server-line' },
    { key: 'ruleAdded', label: '风险规则新增数', value: '200', unit: '个', icon: 'ri-file-add-line' },
    { key: 'ruleActive', label: '风险规则在用数', value: '600', unit: '个', icon: 'ri-file-settings-line' },
    { key: 'ruleEmbed', label: '风险规则内嵌率', value: '72%', unit: '', icon: 'ri-exchange-line' },
    { key: 'warnDocs', label: '有效预警单据量', value: '2,000', unit: '笔', icon: 'ri-alarm-warning-line' },
    { key: 'doubtDocs', label: '疑点单据量', value: '8', unit: '笔', icon: 'ri-question-line' },
    { key: 'clueCover', label: '风险线索抽样覆盖率', value: '90%', unit: '', icon: 'ri-shield-check-line' },
  ],
}
