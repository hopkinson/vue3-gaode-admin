/**
 * 路径 - 首页
 */
const product = {
  query_index: () => import('@/views/query/index.vue')
}
export default {
  path: '/query',
  meta: {
    title: '查询统计',
    roles: ['admin']
  },
  children: [
    {
      meta: {
        title: '查询统计'
      },
      path: 'index',
      name: 'query_index',
      component: product.query_index
    }
  ]
}
