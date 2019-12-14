/**
 * 路径 - 首页
 */
const product = {
  map_index: () => import('@/views/map/index.vue')
  // product_edit: () => import('@/views/product/edit.vue'),
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
    }
  ]
}
