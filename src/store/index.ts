import Vue from 'vue'
import Vuex from 'vuex'
import permission from './modules/permission'
import user from './modules/user'
import path from './modules/path'
import dict from './modules/dict'
import app from './modules/app'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    permission,
    user,
    path,
    dict,
    app
  }
})
