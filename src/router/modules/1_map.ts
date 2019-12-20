/**
 * 路径 - 首页
 */
const product = {
  map_index: () => import('@/views/map/index.vue'),
  map_demo: () => import('@/views/map/demo.vue')
  // product_detail: () => import('@/views/product/detail.vue')
}
export default {
  path: '/map',
  meta: {
    title: '首页',
    roles: ['admin']
  },
  children: [
    {
      meta: {
        title: '地图'
      },
      path: 'index',
      name: 'map_index',
      component: product.map_index
    },
    {
      meta: {
        title: '地图'
      },
      path: 'demo',
      name: 'map_demo',
      component: product.map_demo
    }
  ]
}
