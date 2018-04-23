import $ from 'jquery'
import {BASE_URL} from './config'
import {Message} from 'element-ui'

export function post(url, params) {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'post',
      data: params,
      url: BASE_URL + url,
      success(data) {
        resolve(data)
        if (data.error && data.error.result === 0) {
          Message({
            showClose: false,
            message: data.error.message,
            type: 'error'
          })
        }
      },
      error(err) {
        reject(err)
        Message({
          showClose: false,
          message: '网络出错',
          type: 'warning'
        })
      }
    })
  })
}
