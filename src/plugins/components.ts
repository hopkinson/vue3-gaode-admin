/**
 * 公共组件注册
 * 调用： 直接调用即可，不需要另外引入
 * 方法： <slw-xxx></slw-xxx>
 */
import Vue from 'vue'
const PREFIX = 'hp' // 组件前缀

const requireComponent = require.context('../components', true, /\w+\.vue$/)

requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName)
  // 截取路径作为组件名
  const reqComName = fileName.split('/')[1].replace(/.vue/gi, '')
  // 全局注册组件
  Vue.component(PREFIX + reqComName, componentConfig.default || componentConfig)
})
