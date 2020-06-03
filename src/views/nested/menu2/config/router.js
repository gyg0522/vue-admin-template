const router = (path) => {
  return [
    {
      path: `/${path}`,
      name: `${path}`,
      component: resolve => require(['../index.vue'], resolve),
      meta: { title: 'nested-menu2' }
    }
  ]
}
export default router
