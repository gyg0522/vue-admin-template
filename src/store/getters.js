const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  visitedRoutes: state => state.tagsView.visitedRoutes,
  cachedRoutes: state => state.tagsView.cachedRoutes,
  routes: state => state.permission.routes,
  menus: state => state.user.menuList
}
export default getters
