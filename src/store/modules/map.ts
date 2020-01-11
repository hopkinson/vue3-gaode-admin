import Vuex, { MutationTree } from 'vuex'
import { Store } from '@/typings/Store'
import { CarLocationBody } from '@/services'

const state = {
  isDragging: false,
  isEnd: false,
  isPlaying: false,
  speed: 1,
  showDrawer: false,
  passedLength: 0,
  trackMarkers: []
}

const mutations: MutationTree<Store.Map> = {
  SET_DRAGGING_STATUS(state: Store.Map, status: boolean) {
    state.isDragging = status
  },
  SET_TRACK_STATUS(state: Store.Map, status: boolean) {
    state.isEnd = status
  },
  SET_PLAY_STATUS(state: Store.Map, status: boolean) {
    state.isPlaying = status
  },
  SET_TRACK_SPEED(state: Store.Map, speed: number) {
    state.speed = speed
  },
  IS_SHOW_DRAWER(state: Store.Map, show: boolean) {
    state.showDrawer = show
  },
  SET_TRACK_MARKERS(state: Store.Map, arr: Array<CarLocationBody>) {
    state.trackMarkers = arr
  },
  SET_TRACK_PASSED_LENGTH(state: Store.Map, length: number) {
    state.passedLength = length
  }
}
const getters = {
  isDragging: (state: Store.Map) => state.isDragging,
  isEnd: (state: Store.Map) => state.isEnd,
  isPlaying: (state: Store.Map) => state.isPlaying,
  showDrawer: (state: Store.Map) => state.showDrawer,
  speed: (state: Store.Map) => state.speed,
  trackMarkers: (state: Store.Map) => state.trackMarkers,
  passedLength: (state: Store.Map) => state.passedLength
}
export default {
  state,
  namespaced: true,
  getters,
  mutations
}
