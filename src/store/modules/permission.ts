import { Store } from '@/typings/Store'
import Vuex, { MutationTree, ActionTree } from 'vuex'

const state = {
  addRouters: [],
  permissionList: {}
}
const mutations: MutationTree<Store.Permission> = {
  SET_ROUTERS: (state: Store.Permission, routers: Array<any>) => {
    state.addRouters = routers
  },
  SET_PERMISSION(state: Store.Permission, permissionList: Array<string>) {
    state.permissionList = permissionList
  }
}
const actions: ActionTree<Store.Permission, Store.Root> = {
  GenerateRoutes({ commit, rootGetters }, { menus, routes }) {
    // 生成路由
    return new Promise(resolve => {
      let accessedRouters: Array<any> = []
      // TODO: 路由控制用户权限
      // 目前采用：所有业务路由放进去
      accessedRouters = routes
      commit('SET_ROUTERS', accessedRouters)
      resolve()
    })
  }
}
const getters = {
  addRouters: (state: Store.Permission) => state.addRouters, // 动态生成路由
  permissionList: (state: Store.Permission) => state.permissionList // 本用户的所有资源列表
}
export default {
  actions,
  namespaced: true,
  mutations,
  state,
  getters
}
