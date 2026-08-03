import {constantRoutes } from '@/router'
import router from '@/router'
import API from '@/api'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

function removeRouteByValue(arr, val) {
  var arrResult = [];
  for(var i=0; i<arr.length; i++) {
    if(arr[i].path == val.path) {
      arr.splice(i, 1);
      break;
    }
  }
  arrResult = arrResult.concat(arr);
  return arrResult;
}

function removeStrByValue(arr, val) {
  var arrResult = [];
  for(var i=0; i<arr.length; i++) {
    if(arr[i] == val) {
      arr.splice(i, 1);
      break;
    }
  }
  arrResult = arrResult.concat(arr);
  return arrResult;
}

const initMenu = (router, menu) => {
    if (menu.length === 0) {
        return
    }
    formatRoutes(router,menu);
    // 最后添加
   // let unfound = { path: '*', redirect: '/404', hidden: true }
   // menus.push(unfound)

}

const formatRoutes = (router,aMenu) => {
    aMenu.forEach(oMenu => {
        const {
            path,
            component,
            name,
            enableCache,
            icon,
            children,
            redirect,
            hidden,
            meta,
        } = oMenu;

        if (component) {
            const oRouter = {
                path: path,
                component(resolve) {
                    let componentPath = ''
                    if (component === 'Layout') {
                        require(['@/layout'], resolve)
                        return
                    } else {
                        componentPath = component
                    }
                    require([`@/${componentPath}.vue`], resolve)
                },
                name: name,
                enable_cache:enableCache,
                hidden:hidden,
                redirect:redirect,
                icon: icon,
                meta: {title: meta.title,icon: meta.icon},
            }
            oRouter.children=[];
            if(children && children.length > 0){

                formatRoutes(oRouter.children,children)
            }

            router.push(oRouter)
        }

    })
}





/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: [],
  permissions:[]
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = state.routes.concat(routes)
  },
  SET_PERMISSIONS: (state, permissions) => {
    state.permissions = state.permissions.concat(permissions);
  },
}

const actions = {
  cleanRoutes({ commit,state }){
    return new Promise(resolve => {
      state.routes=[];
      state.permissions=[];
      resolve();
    })
  },
  generateRoutes({ commit,state }) {
    return new Promise(resolve => {
        API.menu.nav().then(({data}) => {
          const asyncRoutes=[];
          if(data.data){
            initMenu(asyncRoutes,data.data);
          }
          commit('SET_ROUTES', asyncRoutes);

          commit('SET_PERMISSIONS',data.permissions);

          router.addRoutes(asyncRoutes);

          resolve()
        }).catch(error => {
          // reject(error)
        })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
