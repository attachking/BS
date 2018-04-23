import {isLogin, getCookies, COOKIE_TYPE} from '../common/js/cookie'

const state = {
  status: isLogin(), // 用户登录状态
  category: Number(getCookies()[COOKIE_TYPE.category] || 0), // 登录用户类型 1为普通用户，2为管理员
  nickname: decodeURIComponent(getCookies()[COOKIE_TYPE.nickname] || ''), // 用户名
  uid: getCookies()[COOKIE_TYPE.uid] || 0, // 用户id
  userType: Number(getCookies()[COOKIE_TYPE.userType] || 1), // 管理员类型，1为普通管理员，2为最高级管理员
  userAssets: {}, // 记录用户资产
  adminAssets: [], // 管理员权限（左侧菜单）
  dictionaries: { // 字典表
    express: [], // 物流公司
    cities: [], // 城市
    corpNature: [], // 企业性质
    issuesType: [], // 知识库问题类型
    deviceType: [] // 设备类型
  }
}

export default state
