// import token from '@/utils/token'
import store from '@/store'
import router from '@/router'
import routes from '@/router/routes'
import cookie from 'js-cookie'
import { TOKEN, REFRESH_TOKEN } from '@/config/constant'
const whiteList = ['/login']
router.afterEach(to => {
  document.title = to.meta.title
})
router.beforeEach(async (to, from, next) => {
  /**
   * 1.有token情况
   *  1.1 如果是登录页 跳转到首页
   *  1.2 否则
   *    1.2.1 如果没有用户导航（判断有没有menuList） 没有去加载用户信息 并动态添加权限
   *    1.2.2 如果  有用户导航
   *            （1） 如果是主页 加载导航菜单第一个
   *            （2） 否则     直接next
   */
  if (cookie.get(TOKEN)) {
    if (to.path === '/login') {
      next('/')
    } else {
      if (!store.getters['user/userInfo']) {
        try {
          const data = await store.dispatch('user/GetUserInfo')
          if (data) {
            await store.dispatch('permission/GenerateRoutes', { routes })
            // await store.dispatch('dict/GetDict')
            // 生成可访问的路由表
            router.addRoutes(
              store.getters['permission/addRouters'].concat({
                path: '*',
                redirect: '/404'
              })
            )

            next({
              ...to,
              replace: true
            })
          }
        } catch (e) {
          next(false)
        }
      } else {
        if (to.path === '/') {
          try {
            next({
              path: store.getters['permission/addRouters'][0].redirect,
              replace: true
            })
          } catch (err) {
            next()
          }
        } else {
          next()
        }
      }
    }
  } else {
    /**
     * 2.没有token情况
     *  2.1 如果是白名单 免登录
     *  2.2 跳转到登录页
     */
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next({
        path: '/login',
        query: {
          redirect: to.path
        }
      })
    }
  }
})
