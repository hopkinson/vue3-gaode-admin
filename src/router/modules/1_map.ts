/**
 * 路径 - 首页
 */
const product = {
  map_index: () => import('@/views/map/index.vue')
  // map_demo: () => import('@/views/map/demo.vue')
  // product_detail: () => import('@/views/product/detail.vue')
}
export default {
  path: '/map',
  meta: {
    title: '首页'
  },
  children: [
    {
      meta: {
        title: '地图',
        allow: true
      },
      path: 'index',
      name: 'map_index',
      component: product.map_index
    }
  ]
}
