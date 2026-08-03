import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component:() =>import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/supplierConfirm',
    component: () => import('@/views/confirm/supplierConfirm'),
    hidden: true
  },
  {
    path: '/',
    component:Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', affix: true }
      }
    ]
  },

  {
    path: '/check_help_doc',
    component:Layout,
    hidden: true,
    children: [
      {
        path: 'check_help_doc',
        component: () => import('@/views/dashboard/helpDoc'),
        name: 'helpDoc',
        meta: { title: '知识库'}
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()

  router.matcher = newRouter.matcher // reset router
}

export default router
