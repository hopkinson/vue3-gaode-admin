/**
 * 公共组件注册
 * 调用： 直接调用即可，不需要另外引入
 * 方法： <slw-xxx></slw-xxx>
 */
import Vue from 'vue'
const frameRoute = () => import('@/views/index.vue')

const requireComponent = require.context('./modules', true, /\w+\.ts$/)

export default requireComponent.keys().map(fileName => {
  const componentConfig = requireComponent(fileName)
  const item = componentConfig.default || componentConfig
  if (item.children) {
    item.component = frameRoute
    item.redirect = item.path + '/' + item.children[0].path
  }
  return item
})
