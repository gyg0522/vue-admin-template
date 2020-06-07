const router = (path) => {
  return [
    {
      path: `/${path}`,
      name: 'Tree',
      component: resolve => require(['../index.vue'], resolve),
      meta: { title: '树' }
    }
  ]
}
export default router
