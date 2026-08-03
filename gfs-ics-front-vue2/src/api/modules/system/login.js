import authRequest from '@/api/authRequest'
import unsafeRequest from '@/api/unsafeRequest'
import request from "@/api/request";

export function login(data,key,code) {
  return authRequest({
    url: process.env.VUE_APP_AUTH_BASE_URL + '/oauth/token?grant_type=password&key='+key+'&code='+code,
    method: 'post',
    data: data
  })
}

export function logOut() {
  return request({
    url: process.env.VUE_APP_AUTH_BASE_URL + '/token/revoke',
    method: 'delete'
  })
}

export function captcha(key) {
  return unsafeRequest({
    url: process.env.VUE_APP_AUTH_BASE_URL + '/captcha?key='+key,
    method: 'get',
  })
}
