const router = (path) => {
  return [
    {
      path: `/${path}`,
      name: `${path}`,
      component: resolve => require(['../index.vue'], resolve),
      meta: { title: 'nested-menu1-menu1-1' }
    }
  ]
}
export default router
