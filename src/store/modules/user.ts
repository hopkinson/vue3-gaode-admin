import Vuex, { MutationTree, ActionTree } from 'vuex'
import { Store } from '@/types/store.d'
import { Params } from '@/types/params.d'
import cookie from 'js-cookie'
import { TOKEN, REFRESH_TOKEN } from '@/config/constant'
import $axios from '@ajax'
const state: Store.User = {
  userInfo: null,
  token: '',
  isSuperRole: false
}

const mutations: MutationTree<Store.User> = {
  // 获取用户信息
  GET_USERINFO(state: Store.User, userInfo: object) {
    state.userInfo = userInfo
  },
  // 清楚用户信息
  CLEAR_USERINFO(state: Store.User, userInfo: object) {
    state.userInfo = {}
  },
  // 设置token
  SET_TOKEN(state: Store.User, { token, refreshToken }: Params.Token) {
    state.token = token
    cookie.set(TOKEN, token, {
      expires: 7
    })
    cookie.set(REFRESH_TOKEN, refreshToken, {
      expires: 7
    })
  },
  // 清除token
  REMOVE_TOKEN(state: Store.User) {
    state.token = ''
    cookie.remove(TOKEN)
    cookie.remove(REFRESH_TOKEN)
  }
}
const actions: ActionTree<Store.User, Store.Root> = {
  /**
   * 获取用户信息
   * 过程：
   * 1.把用户信息传到         state.userInfo
   * 2.判断用户角色是否super  state.isSuperRole[TODO]
   */
  async GetUserInfo({ commit }) {
    try {
      const userInfo = await $axios.ajax({
        method: 'GET',
        url: 'v1/users/profile'
      })
      commit('GET_USERINFO', userInfo)
      return Promise.resolve(userInfo)
    } catch (e) {
      Promise.reject('登陆失败')
    }
  },
  /**
   * 登录
   * @param  {[type]}  commit    [mutation操作]
   * @param  {[type]}  data      [form数据]
   */
  async Login({ commit }, data) {
    try {
      const token = await $axios.ajax({
        method: 'POST',
        url: 'v1/login',
        data
      })
      commit('SET_TOKEN', token)
      return Promise.resolve(token)
    } catch (e) {
      Promise.reject('登录失败')
    }
  },
  // /**
  //  * 注册
  //  * @param  {[type]}  commit    [mutation操作]
  //  * @param  {[type]}  loginForm [form数据]
  //  */
  // async Register({ commit }, loginForm) {
  //   try {
  //     // let data = await sso.register(loginForm)
  //     let data = 111
  //     return data
  //   } catch (e) {
  //     console.error('注册失败', e)
  //   }
  // },
  /**
   * 退出登录
   * 过程：
   * 1.清除token
   * 2.清除用户信息
   */
  async Logout({ commit }) {
    commit('REMOVE_TOKEN')
    commit('CLEAR_USERINFO')
    return Promise.resolve()
  }
}
const getters = {
  userInfo: (state: Store.User) => state.userInfo, // 用户基本信息
  isSuperRole: (state: Store.User) => state.isSuperRole, // 是否超级管理员角色
  token: (state: Store.User) => state.token // token
}
export default {
  state,
  namespaced: true,
  actions,
  getters,
  mutations
}
