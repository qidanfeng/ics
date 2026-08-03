import API from '@/api'
import {Message} from "element-ui";
import axios from "axios";
import {getAuthInfo} from "@/utils/auth";

const state = {
  name: '',
  avatar:''
}

const mutations = {
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  login({ commit }, userInfo) {
    const { username, password, key, captcha } = userInfo;
    return new Promise((resolve, reject) => {
      API.login.login({ username: username.trim(), password: password},key, captcha.trim()).then((res) => {
        var data = res.data;
        if(data.code && data.code == 500){
          Message({
            message: data.msg,
            type: 'error',
            duration: 2 * 1000
          })
          reject(data.msg);
        }else{
          resolve();
        }
      }).catch(error => {
        reject(error)
      })
    })
  },
  refreshToken({commit}) {
    return new Promise((resolve, reject) => {
      axios({
        url: process.env.VUE_APP_BASE_API+'/gfs-auth/oauth/token',
        method: 'post',
        withCredentials: true,
        auth: getAuthInfo(),
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        data:{
          grant_type:'refresh_token'
        }
      }).then(res => {
        resolve(true)
      }).catch(err => {
        reject(err)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      API.user.getInfo().then(({data}) => {
        const user  = data ? data.data : data;
        if(user){
          commit('SET_NAME', user.username);
          commit('SET_AVATAR', user.wxHeadImgUrl);
          resolve(user)
        }else{
          reject('没有获取到用户信息')
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      commit('SET_NAME', '')
      commit('SET_AVATAR', '')
      dispatch('tagsView/delAllViews', null, { root: true })
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}






// import API from '@/api'
// import { getToken, setToken, removeToken } from '@/utils/auth'
// import router, { resetRouter } from '@/router'
//
// const state = {
//   token: getToken(),
//   name: '',
//   avatar: '',
//   introduction: '',
// }
//
// const mutations = {
//   SET_TOKEN: (state, token) => {
//     state.token = token
//   },
//   SET_INTRODUCTION: (state, introduction) => {
//     state.introduction = introduction
//   },
//   SET_NAME: (state, name) => {
//     state.name = name
//   },
//   SET_AVATAR: (state, avatar) => {
//     state.avatar = avatar
//   },
// }
//
// const actions = {
//   login({ commit }, userInfo) {
//     const { username, password } = userInfo
//     return new Promise((resolve, reject) => {
//       API.login.login({ username: username.trim(), password: password }).then(({data}) => {
//
//         commit('SET_TOKEN', data['access_token'])
//         setToken(data['access_token']);
//         resolve()
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },
//
//   // get user info
//   getInfo({ commit, state }) {
//     return new Promise((resolve, reject) => {
//       API.user.getInfo().then(({data}) => {
//         const { user } = data;
//         commit('SET_NAME', user.username);
//         resolve(user)
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },
//
//   // user logout
//   logout({ commit, state, dispatch }) {
//     return new Promise((resolve, reject) => {
//       commit('SET_TOKEN', '')
//       commit('SET_NAME', '')
//       removeToken()
//       resetRouter()
//         // reset visited views and cached views
//         // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
//       dispatch('tagsView/delAllViews', null, { root: true })
//
//       resolve()
//     })
//   },
//
//   // remove token
//   resetToken({ commit }) {
//     return new Promise(resolve => {
//       commit('SET_TOKEN', '')
//         commit('SET_NAME', '')
//       removeToken()
//       resolve()
//     })
//   },
//
//   // dynamically modify permissions
//   changeRoles({ commit, dispatch }, role) {
//     return new Promise(async resolve => {
//       const token = role + '-token'
//
//       commit('SET_TOKEN', token)
//       setToken(token)
//
//       const { roles } = await dispatch('getInfo')
//
//       resetRouter()
//
//       // generate accessible routes map based on roles
//       const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
//
//       // dynamically add accessible routes
//       router.addRoutes(accessRoutes)
//
//       // reset visited views and cached views
//       dispatch('tagsView/delAllViews', null, { root: true })
//
//       resolve()
//     })
//   }
// }
//
// export default {
//   namespaced: true,
//   state,
//   mutations,
//   actions
// }
