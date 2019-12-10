import Vue from 'vue'
import Router from 'vue-router'

export const baseRoute = [
  {
    path: '',
    name: 'index',
    meta: {
      title: process.env.VUE_APP_TITLE
    },
    component: () => import('@/views/index.vue')
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: process.env.VUE_APP_TITLE
    },
    component: () => import('@/views/login/index.vue')
  }
  //  {
  //   path: '/401',
  //   name: '401',
  //   component: () => import('~@/401.vue')
  // }, {
  //   path: '/404',
  //   name: '404',
  //   component: () => import('~@/404.vue')
  // }
]
Vue.use(Router)
const router = new Router({
  routes: baseRoute,
  mode: 'history'
})
export default router
