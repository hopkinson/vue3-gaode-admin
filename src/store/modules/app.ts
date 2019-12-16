import Vuex, { MutationTree } from 'vuex'
import { Store } from '@/typings/Store'
import { Route } from 'vue-router'
const state = {
  isFullScreen: false
}

const mutations: MutationTree<Store.App> = {
  SET_FULLSCREEN_STATUS(state: Store.App, status: boolean) {
    state.isFullScreen = status
  }
}
const getters = {
  isFullScreen: (state: Store.App) => state.isFullScreen
}
export default {
  state,
  namespaced: true,
  getters,
  mutations
}
