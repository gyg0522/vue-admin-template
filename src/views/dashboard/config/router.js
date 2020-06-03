const router = (path) => {
  return [
    {
      path: `/${path}`,
      name: `${path}`,
      component: resolve => require(['../index.vue'], resolve),
      meta: { title: '仪表盘' }
    }
  ]
}
export default router
