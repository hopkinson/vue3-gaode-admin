import Vue from 'vue'
import Vuex from 'vuex'
import permission from './modules/permission'
import user from './modules/user'
import dict from './modules/dict'
import app from './modules/app'
import map from './modules/map'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    permission,
    user,

    dict,
    app,
    map
  }
})
