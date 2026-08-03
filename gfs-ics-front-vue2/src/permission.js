import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  if (to.path === '/login') {
    // if is logged in, redirect to the home page
    store.dispatch('permission/cleanRoutes');
    if(typeof(process.env.VUE_APP_GFS_PORTAL_URL) == "undefined" ){
      if (whiteList.indexOf(to.path) !== -1) {
        // in the free login whitelist, go directly
        next()
      } else {
        // other pages that do not have permission to access are redirected to the login page.
        await this.$store.dispatch('permission/cleanRoutes');
        await this.$store.dispatch('user/logout');
        next(`/login?redirect=${to.path}`)
        NProgress.done()
      }
    }else{
      NProgress.done()
      window.location.href= process.env.VUE_APP_GFS_PORTAL_URL;     //在同当前窗口中打开窗口
    }
  } else {
    if(to.query.type == 'open'){
      next()
    }else {
      if (store.getters.name && store.getters.name != '') {
        next()
      } else {
        try {
          await store.dispatch('user/getInfo');
          await store.dispatch('permission/generateRoutes');
          next({path: '/dashboard'})
        } catch (error) {
          console.log(error)
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})







// import router from './router'
// import store from './store'
// import { Message } from 'element-ui'
// import NProgress from 'nprogress' // progress bar
// import 'nprogress/nprogress.css' // progress bar style
// import { getToken } from '@/utils/auth' // get token from cookie
// import getPageTitle from '@/utils/get-page-title'
//
// NProgress.configure({ showSpinner: false }) // NProgress Configuration
//
// const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist
//
// router.beforeEach(async(to, from, next) => {
//   // start progress bar
//   NProgress.start()
//
//   // set page title
//   document.title = getPageTitle(to.meta.title)
//
//   // determine whether the user has logged in
//   const hasToken = getToken()
//
//   if (hasToken) {
//     if (to.path === '/login') {
//       // if is logged in, redirect to the home page
//       store.dispatch('permission/cleanRoutes');
//       next({ path: '/' })
//       NProgress.done()
//     } else {
//       // determine whether the user has obtained his permission roles through getInfo
//         //store.getters.roles && store.getters.roles.length > 0
//
//       //跳转路由 传参 type=open  排除下面验证    可优化
//       if(to.query.type == 'open'){
//         next()
//       }else{
//         if (store.getters.name) {
//           next()
//         }else {
//           try {
//
//             const user =await store.dispatch('user/getInfo');
//
//             // var navs = await store.dispatch('permission/generateHeadNav');
//             store.dispatch('permission/generateRoutes');
//             // router.addRoutes(asyncRoutes)
//             next({ path: '/dashboard' })
//             // hack method to ensure that addRoutes is complete
//             // set the replace: true, so the navigation will not leave a history record
//             // next({ ...to, replace: true })
//           } catch (error) {
//             alert(error)
//             // remove token and go to login page to re-login
//             await store.dispatch('user/resetToken')
//             Message.error(error || 'Has Error')
//             next(`/login?redirect=${to.path}`)
//             NProgress.done()
//           }
//         }
//       }
//     }
//   } else {
//     /* has no token*/
//     if(typeof(process.env.VUE_APP_GFS_PORTAL_URL) == "undefined" ){
//       //开发环境
//       if (whiteList.indexOf(to.path) !== -1) {
//         // in the free login whitelist, go directly
//         next()
//       } else {
//         // other pages that do not have permission to access are redirected to the login page.
//         store.dispatch('permission/cleanRoutes');
//         next(`/login?redirect=${to.path}`)
//         NProgress.done()
//       }
//     }else{
//       NProgress.done()
//       window.location.href= process.env.VUE_APP_GFS_PORTAL_URL;     //在同当前窗口中打开窗口
//     }
//   }
// })
//
// router.afterEach(() => {
//   // finish progress bar
//   NProgress.done()
// })
