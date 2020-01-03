/**
 * 路径 - 首页
 */
const product = {
  query_index: () => import('@/views/query/index.vue'),
  query_abnormal: () => import('@/views/query/abnormal.vue'),
  query_statistics: () => import('@/views/query/statistics.vue')
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
        // title: '查询统计'
      },
      path: 'index',
      name: 'query_index',
      component: product.query_index,
      redirect: '/query/index/abnormal',
      children: [
        {
          meta: {
            title: '告警列表',
            icon: 'aside_icon_abnormal'
          },
          path: 'abnormal',
          name: 'query_abnormal',
          component: product.query_abnormal
        },
        {
          meta: {
            title: '违法行为统计',
            icon: 'aside_icon_analayisis'
          },
          path: 'statistics',
          name: 'query_statistics',
          component: product.query_statistics
        }
      ]
    }
  ]
}
