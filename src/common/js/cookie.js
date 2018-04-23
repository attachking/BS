
export const COOKIE_TYPE = {
  username: '__username__',
  password: '__password__',
  nickname: '__nickname__',
  status: '__status__',
  category: '__category__', // 用户登录类型:1为用户,2为管理员
  uid: '__uid__',
  prompted: '__prompted__',
  userType: '__userType__' // 管理员类型，1为普通管理员，2为最高级管理员
}

export function getCookies() {
  let cookie = {}
  let all = document.cookie
  if (all === '') {
    return cookie
  }
  let list = all.split('; ')
  for (let i = 0; i < list.length; i++) {
    let singleCookie = list[i]
    let p = singleCookie.indexOf('=')
    let name = singleCookie.substring(0, p)
    let value = singleCookie.substring(p + 1)
    value = decodeURIComponent(value)
    cookie[name] = value
  }
  return cookie
}

export function setCookie(name, value, expiredays) {
  let exdate
  if (typeof expiredays === 'number') {
    exdate = new Date()
    exdate.setTime(exdate.getTime() + expiredays * 24 * 60 * 60 * 1000)
  }
  document.cookie = name + '=' + encodeURIComponent(value) + (expiredays ? `;expires=${exdate.toUTCString()}` : '') + ';path=/'
}

export function isLogin() {
  return Number(getCookies()[COOKIE_TYPE.status] || 0)
}
