import axios from 'axios'
import { Message } from 'element-ui'
import { getAuthInfo } from '@/utils/auth'
// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // process.env.VUE_APP_BASE_API, // url = base url + request url
  timeout: 1000 * 180,
  withCredentials: true,
  auth: getAuthInfo(),
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
})

// request拦截器
service.interceptors.request.use(config => {
  config.data['grant_type'] = 'password'
  return config
}, error => {
  return Promise.reject(error)
})

// response拦截器
service.interceptors.response.use(response => {
  if (response.status != 200) {
    Message({
      message: response.data.msg,
      type: 'error',
      duration: 2 * 1000
    })
  }

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



// import axios from 'axios'
// import { Message } from 'element-ui'
// // 创建axios实例
// const service = axios.create({
//   baseURL: process.env.VUE_APP_BASE_API, // process.env.VUE_APP_BASE_API, // url = base url + request url
//   timeout: 1000 * 180,
//   withCredentials: true,
//   auth: {
//     username: 'gfscold',
//     password: '123456'
//   },
//   headers: {
//     'content-type': 'application/x-www-form-urlencoded'
//   }
// })
//
// // request拦截器
// service.interceptors.request.use(config => {
//   config.params['grant_type'] = 'password'
//   return config
// }, error => {
//   return Promise.reject(error)
// })
//
// // response拦截器
// service.interceptors.response.use(response => {
//   if (response.status != 200) {
//     Message({
//       message: response.data.msg,
//       type: 'error',
//       duration: 2 * 1000
//     })
//   }
//
//   return response
// }, error => {
//   Message({
//     message: error.response.data.msg,
//     type: 'error',
//     duration: 2 * 1000
//   })
//   return Promise.reject(error)
// })
//
// export default service
