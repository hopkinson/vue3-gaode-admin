import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import config from '@/config'
import ElementUI from 'element-ui'
import VueAMap from 'vue-amap'
import * as filters from '@/utils/filters'
import { MAP } from '@/config/dict'
// Echarts
import echarts from 'echarts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/title'
/**
 * ===============
 *  公共组件注册
 * ===============
 */
import './plugins/components'
/**
 * ===============
 *  路  由  相  关
 * ===============
 */

// 1.用户权限
import './router/permission'
/**
 * ===============
 *  Vue 相关配置
 * ===============
 */
Vue.config.productionTip = false
Vue.config.devtools = true

/**
 * =============
 *  全 局 配 置
 * =============
 */
// 全局注册配置表的数据
// 调用：this.$config
// Vue.prototype.$config = config
// 注册图表
Vue.prototype.$echarts = echarts
// 全局过滤器
Object.keys(filters).forEach(k => Vue.filter(k, filters[k]))
// 高德地图
VueAMap.initAMapApiLoader({
  key: MAP.key,
  plugin: [
    'AMap.ToolBar',
    'AMap.MapType',
    'AMap.PolyEditor',
    'AMap.MarkerClusterer'
  ],
  v: '1.4.15'
})
setTimeout(() => {
  localStorage.removeItem('_AMap_raster')
  Vue.use(VueAMap)
}, 0)
/**
 * ==============
 *  插  件  使  用
 * ==============
 */
Vue.use(ElementUI) // UI库
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
