import axios from 'axios'
import { Message } from 'element-ui'
import {getToken, doRequest} from '@/utils/auth'
// 创建axios实例
const service = axios.create({
  timeout: 10000 * 30,
  withCredentials: true,
  headers: {
    'Content-Type': 'multipart/form-data'
  }
})

// request拦截器
service.interceptors.request.use(config => {
  config.headers['Authorization'] = 'Bearer ' + getToken()
  return config
}, error => {
  return Promise.reject(error)
})

// response拦截器
service.interceptors.response.use(response => {
  if ((response.data && response.data.code === 500)) {
    Message({
      message: response.data.msg ? response.data.msg : '未知异常，请联系管理员',
      type: 'error',
      duration: 2 * 1000
    })
  }
  return response;
},  async error => {
  if(error.response.status === 401){
    return doRequest(error);
  }else{
    Message({
      message: (error.response && error.response.data.msg) ? error.response.data.msg : error,
      type: 'error',
      duration: 2 * 1000
    })
  }
  return Promise.reject(error)
})

export default service




// import Vue from 'vue'
// import axios from 'axios'
// import router from '@/router'
// import { Message } from 'element-ui'
// import { getToken, setToken, removeToken } from '@/utils/auth'
// // 创建axios实例
// const service = axios.create({
//   timeout: 10000 * 30,
//   withCredentials: true,
//   headers: {
//     'Content-Type': 'multipart/form-data'
//   }
// })
//
// // request拦截器
// service.interceptors.request.use(config => {
//   config.headers['Authorization'] = 'Bearer ' + getToken()
//   return config
// }, error => {
//   return Promise.reject(error)
// })
//
// // response拦截器
// service.interceptors.response.use(response => {
//   if (response.data && response.data.code === 401) { // 401, token失效
//     Vue.cookie.delete('token')
//     router.push({ name: 'login' })
//   }
//   if ((response.data && response.data.code === 500)) {
//     Message({
//       message: response.data.msg ? response.data.msg : '未知异常，请联系管理员',
//       type: 'error',
//       duration: 2 * 1000
//     })
//   }
//   return response
// }, error => {
//   Message({
//     message: error.response.data.msg ? error.response.data.msg : '未知异常，请联系管理员',
//     type: 'error',
//     duration: 2 * 1000
//   })
//   return Promise.reject(error)
// })
//
// export default service
//
