import axios from 'axios'
import { Message } from 'element-ui'
import store from "@/store";
import router from "@/router";
import vuex from '@/store'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // process.env.VUE_APP_BASE_API, // url = base url + request url
  timeout: 1000 * 180,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
})

// request拦截器
service.interceptors.request.use(config => {
  //config.headers['warehouseCode'] = vuex.getters.warehouseCode
  config.headers['platform'] = 'ICS'
  config.headers['Authorization'] = 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjI3NjUxNzU5MzIsInVzZXIiOiJ7XCJhbGxvd0xvZ2luTXVsdGlEZXZpY2VcIjoxLFwiY29tcGFueUlkXCI6MTEsXCJkYXRhVHlwZVwiOlwiXCIsXCJsb2dpblN5c3RlbVwiOlwiV0VCXCIsXCJsb2dpblRlcm1pbmFsXCI6XCJQQ1wiLFwic3RhdHVzXCI6ZmFsc2UsXCJ1c2VySWRcIjo0ODksXCJ1c2VybmFtZVwiOlwiaWNzU3VwcGxpZXJDb25maXJtXCJ9IiwidXNlcl9uYW1lIjoiaWNzU3VwcGxpZXJDb25maXJtIiwianRpIjoiZDE2ZjEwNTgtZDFjNi00NDE5LTgwNzUtZTVmZTMwNjg2NzhiIiwiY2xpZW50X2lkIjoic3lzdGVtIiwic2NvcGUiOlsiYWxsIl19.anyccplpLqS-ZvLgvka1OgEKSQDcODFcti4BfnHKRrE6Gx4p3k5i4aiuobYd_6QYsZImKhb30QeSJ_69Hc4bhiiCXua2EPv63zw9x0Mh5b5Wg3Orz0bdHPbs2GmxLoQ_yZ6KJ17TjY_naqFf6rF5q0hwsEJmukLZPu12KaTviYyuWhfkLOfH__ydJbMPjOYkP2fX12zmRDg5DhxVauxk_fU6U5POKcorvNnzrty-lvxVTXszQeRYAL_n6rwedER41VKQRWvKyjkrgviIciiPlIyAJnrACalXq_HDRMcqQdBlYnRSXxy_dr6gtbgDVzpGOEpAW9oleBea9nb_2oGS8w'
  return config
}, error => {
  return Promise.reject(error)
})

// 正在刷新标识，避免重复刷新
let refreshing = false;
// 请求等待队列
let waitQueue = [];

// response拦截器
service.interceptors.response.use(response => {
  if ((response.data && response.data.code === 500)) {
    Message({
      message: response.data.msg ? response.data.msg : '未知异常，请联系管理员',
      type: 'error',
      duration: 4 * 1000,
      dangerouslyUseHTMLString: true
    })
  }
  return response;
},  async error => {
  var config = error.response.config;
  if(error.response.status === 401){
    if (refreshing == false) {
      refreshing = true;
      return store.dispatch('user/refreshToken').then((res)=>{
        waitQueue.forEach(callback => callback()); // 已成功刷新token，队列中的所有请求重试
        waitQueue = [];
        refreshing = false;
        return service(config)
      }).catch ((err)=>{
        waitQueue = [];
        refreshing = false;
        if(err.response){
          if(err.response.status === 403){
            Message({
              message: '登录会话已过期，请重新登录',
              type: 'error',
              duration: 2 * 1000
            })
            store.dispatch('user/logout');
            store.dispatch('permission/cleanRoutes');
            router.push({ path: '/login' });
          }else{
            Message({
              message: (err.response && err.response.data.msg) ? err.response.data.msg : err,
              type: 'error',
              duration: 2 * 1000
            })
          }
        }else{
          Message({
            message: err.message,
            type: 'error',
            duration: 2 * 1000
          })
        }
      })
    }else{
      // 正在刷新token，返回未执行resolve的Promise,刷新token执行回调
      return new Promise((resolve => {
        waitQueue.push(() => {
          config.baseURL = '' // 请求重试时，url已包含baseURL
          resolve(service(config))
        })
      }))
    }
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



// import { getToken, setToken, removeToken } from '@/utils/auth'
// import axios from 'axios'
// import router from '@/router'
// import { Message } from 'element-ui'
// // 创建axios实例
// const service = axios.create({
//   baseURL: process.env.VUE_APP_BASE_API, // process.env.VUE_APP_BASE_API, // url = base url + request url
//   timeout: 1000 * 600,
//   withCredentials: true,
//   headers: {
//     'Content-Type': 'application/json; charset=utf-8'
//   }
// })
//
// // request拦截器
// service.interceptors.request.use(config => {
//   config.headers['Authorization'] = 'Bearer ' + getToken()
//   config.headers['platform'] = 'OMS'
//   return config
// }, error => {
//   return Promise.reject(error)
// })
//
// // response拦截器
// service.interceptors.response.use(response => {
//   if (response.data && response.data.code === 401) { // 401, token失效
//     removeToken()
//     router.push({ name: 'login' })
//   }
//   if ((response.data && response.data.code === 500)) {
//     Message({
//       message: response.data.msg ? response.data.msg : '未知异常，请联系管理员',
//       type: 'error',
//       duration: 2 * 1000,
//       dangerouslyUseHTMLString: true
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
