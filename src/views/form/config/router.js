const router = (path) => {
  return [
    {
      path: `/${path}`,
      name: 'Form',
      component: resolve => require(['../index.vue'], resolve),
      meta: { title: '表单' }
    }
  ]
}
export default router
