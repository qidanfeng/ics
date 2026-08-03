import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element, {Message} from 'element-ui'
import 'umy-ui/lib/theme-chalk/index.css'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import i18n from './lang' // internationalization
import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log
import {isAuth} from  './utils/permission'
import * as filters from './filters' // global filters

import { UTable } from 'umy-ui'
Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})
Vue.use(UTable)

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false
// 挂载权限方法
Vue.prototype.isAuth = isAuth
Vue.prototype.pageSizes = [50, 100, 200, 300]
Vue.prototype.loginUrl= process.env.VUE_APP_GFS_PORTAL_URL

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
