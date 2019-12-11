/**
 * 路径 - 首页
 */
const product = {
  setting_index: () => import('@/views/setting/index.vue')
}
export default {
  path: '/setting',
  meta: {
    title: '系统设置',
    roles: ['admin']
  },
  children: [
    {
      meta: {
        title: '系统设置'
      },
      path: 'index',
      name: 'setting_index',
      component: product.setting_index
    }
  ]
}
