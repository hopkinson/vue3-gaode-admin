/**
 * 路径 - 首页
 */
const product = {
  baseInfo_index: () => import('@/views/baseInfo/index.vue')
}
export default {
  path: '/baseInfo',
  meta: {
    title: '基础资料管理',
    roles: ['admin']
  },
  children: [
    {
      meta: {
        title: '基础资料'
      },
      path: 'index',
      name: 'baseInfo_index',
      component: product.baseInfo_index
    }
  ]
}
