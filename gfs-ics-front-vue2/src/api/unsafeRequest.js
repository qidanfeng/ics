import axios from 'axios'
import router from '@/router'
import { Message } from 'element-ui'
// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // process.env.VUE_APP_BASE_API, // url = base url + request url
  timeout: 1000 * 180,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  },
  responseType:'blob'
})

// request拦截器
service.interceptors.request.use(config => {
  return config
}, error => {
  return Promise.reject(error)
})

// response拦截器
service.interceptors.response.use(response => {
  return response
}, error => {
  Message({
    message: (error.response && error.response.data.msg) ? error.response.data.msg : error,
    type: 'error',
    duration: 2 * 1000
  })
  return Promise.reject(error)
})

export default service
