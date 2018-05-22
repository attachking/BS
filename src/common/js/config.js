const product = process.env.NODE_ENV === 'production'

export const BASE_URL = product ? '/' : 'http://192.168.1.248:777/' // http://116.255.207.197:777/  http://192.168.1.192:777/  http://192.168.1.248:777/ https://yw.zhihuijob.com/

export const PAGE_SIZE = 10

export const NORMAL_REG = /^[a-zA-Z\d\u4e00-\u9fa5_+（）()-]*$/ // 只能是字母、数字、汉字及部分字符

export const NUMANDWORD_REG = /^[a-zA-Z0-9_+-]*$/ // 只能是数字、字母和部分字符

export const PROJECT_TYPE = [{
  code: 1,
  name: '高校'
}, {
  code: 2,
  name: '政府'
}, {
  code: 0,
  name: '其它'
}]
