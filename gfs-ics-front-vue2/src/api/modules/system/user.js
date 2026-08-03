import request from '@/api/request'
import requestParam from '@/api/requestParam'

export function getInfo() {
  return request({
    url: process.env.VUE_APP_SYSTEM_BASE_URL + '/user/info/',
    method: 'get'
  })
}



export function getUserByUserId(userId) {
  return request({
    url: process.env.VUE_APP_SYSTEM_BASE_URL + '/user/getUserByUserId/'+userId,
    method: 'get'
  })
}
