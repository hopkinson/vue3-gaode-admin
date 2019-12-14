import Vuex, { MutationTree, ActionTree } from 'vuex'
import { Store } from '@/typings/Store'
import { Route } from 'vue-router'
const state = {
  saved_paths: [],
  active_path: '',
  isCollapse: false
}

const mutations: MutationTree<Store.Path> = {
  SET_PATHS(state: Store.Path, path: Route) {
    if (state.saved_paths.some((v: Route) => v.name === path.name)) {
      return
    }
    state.saved_paths.push(path)
  },
  REMOVE_PATH(state: Store.Path) {
    state.saved_paths = []
  },
  SET_ACTIVE_PATH(sstate: Store.Path, path: string) {
    state.active_path = path
  }
}
const getters = {
  saved_paths: (state: Store.Path) => state.saved_paths, // tabs页保存的路由
  active_path: (state: Store.Path) => state.active_path
}
export default {
  state,
  namespaced: true,
  getters,
  mutations
}
