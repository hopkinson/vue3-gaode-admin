import Vuex, { MutationTree, ActionTree } from 'vuex'
import { Store } from '@/typings/Store'
import $axios from '@ajax'
const state = {
  dict: []
}

const mutations: MutationTree<Store.Dict> = {
  SET_DICT(state: Store.Dict, dict: Array<any>) {
    state.dict = dict
  }
}
const getters = {
  dict: (state: Store.Dict) => state.dict
}
const actions: ActionTree<Store.User, Store.Root> = {
  //   获取字典数据
  async GetDict({ commit }, data) {
    try {
      const dict = await $axios.ajax({
        method: 'GET',
        url: 'v1/commons/dicts/user-types'
      })
      commit('SET_DICT', dict)
      return Promise.resolve(dict)
    } catch (e) {
      Promise.reject(e)
    }
  }
}
export default {
  state,
  namespaced: true,
  getters,
  actions,
  mutations
}
