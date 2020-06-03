const router = (path) => {
  return [
    {
      path: `/${path}`,
      name: `${path}`,
      component: resolve => require(['../index.vue'], resolve),
      meta: { title: 'nested-menu1-menu1-2' }
    }
  ]
}
export default router
