const mongoose = require('mongoose')
  db = mongoose.createConnection('mongodb://localhost:27017/supportCompanies')
  Schema = mongoose.Schema
mongoose.Promise = Promise

const supportCompaniesSchema = new Schema({
  name: String, // 单位名称
  rate: String, // 级别
  lot: String, // 批次
  status: String, // 状态
  contact: String, // 联系人
  charge: String, // 负责人
  leader: String, // 领导
  others: String, // 其他联系人
  expire:  String, // 过期联系人
  contribution:  String, // 贡献评级
  remark: String, // 备注
  detail: { // 贡献详情
    重大漏洞及安全事件预警支撑: [String], // 重大漏洞及安全事件预警支撑
    未公开漏洞提交: [String], // 未公开漏洞提交
    安全报告提交: [String], // 安全报告提交
    厂商漏洞修复与销控情况: [String], // 厂商漏洞修复与销控情况
    CNNVD数据使用: [String], // CNNVD数据使用
    沟通配合情况: [String], // 沟通配合情况
    会议活动支撑: [String], // 会议活动支撑
    宣传推广支撑: [String], // 宣传推广支撑
    产品试用: [String], // 产品试用
    其他支撑: [String], // 其他支撑
  },
  date: { type: Date, default: Date.now }, 
  type: Number, // 类别 2 - 失效，1 - 待申请，0 - 现有
}, { collection: 'supportCompanies' })

exports.supportCompaniesSchema = db.model('supportCompanies', supportCompaniesSchema)

exports.keys = {
  do: ['name', 'rate', 'lot', 'contact', 'charge',
    'leader', 'others', 'expire', 'contribution'],
  doCn: ['单位名称', '级别', '批次', '联系人', '负责人',
    '领导', '其他联系人', '过期联系人', '贡献评级'],
  todo: ['name', 'rate', 'status', 'contact', 'charge',
    'leader', 'others', 'expire', 'contribution', 'remark'],
  todoCn: ['单位名称', '拟申请级别', '状态', '联系人', '负责人',
    '领导', '其他联系人', '过期联系人', '贡献评级', '备注'],
  did: ['name', 'rate', 'lot', 'contact', 'charge',
    'leader', 'others', 'expire', 'contribution', 'remark'],
  didCn: ['单位名称', '级别', '批次', '联系人', '负责人',
    '领导', '其他联系人', '过期联系人', '贡献评级', '备注'],
  info: ['name', 'rate', 'status', 'lot', 'contact', 'charge',
    'leader', 'others', 'expire', 'contribution', 'remark'],
  infoCn: ['单位名称', '级别', '状态', '批次', '联系人', '负责人',
    '领导', '其他联系人', '过期联系人', '贡献评级', '备注'],
  detail: ['重大漏洞及安全事件预警支撑', '未公开漏洞提交', '安全报告提交',
    '厂商漏洞修复与销控情况', 'CNNVD数据使用', '沟通配合情况', '会议活动支撑',
    '宣传推广支撑', '产品试用', '其他支撑'],
}