/* Layout */
import Layout from '@/layout'

const indexRouter = {
  path: '/',
  component: Layout,
  redirect: '/dashboard',
  children: []
}

const dynamicRouter = (routerMap, parent) => {
  return routerMap.map(item => {
    const {
      title,
      icon,
      breadcrumb,
      activeMenu
    } = item.meta || {}
    const currentRouter = {
      // 如果路由设置了 path，则作为默认 path，否则 路由地址 动态拼接生成如 /dashboard/workplace
      path: item.path || `${parent && parent.path || ''}/${item.key}`,
      name: item.name || item.path || '',
      // 该路由对应页面的 组件 : (动态加载)
      // component: resolve => {
      //   if (parent) {
      //     require([`..${item.component}.vue`], resolve)
      //   } else {
      //     require(['../layout/index.vue'], resolve)
      //   }
      // },
      component: resolve => require([`..${item.component}.vue`], resolve),
      meta: {
        title: title,
        icon: icon || undefined,
        breadcrumb: breadcrumb,
        activeMenu: activeMenu
      }
    }
    // 是否设置了隐藏菜单
    currentRouter.hidden = item.hidden
    if (item.redirect) {
      currentRouter.redirect = item.redirect
    }
    // 处理有可能出现拼接出两个 反斜杠
    if (!currentRouter.path.startsWith('http')) {
      currentRouter.path = currentRouter.path.replace('//', '/')
    }
    // 重定向
    // item.redirect && (currentRouter.redirect = item.redirect)
    // 是否有子菜单，并递归处理
    if (item.children && item.children.length > 0) {
      // Recursion
      currentRouter.children = dynamicRouter(item.children, currentRouter)
    }
    return currentRouter
  })
}

/**
 * 格式化树形结构数据 生成 vue-router 层级路由表
 *
 * @param routerMap
 * @param parent
 * @returns {*}
 */
export const GeneratorDynamicRouter = (routerMap) => {
  return new Promise((resolve, reject) => {
    const routers = dynamicRouter(routerMap)
    routers.push({
      path: '*',
      redirect: '/404',
      hidden: true
    })
    indexRouter.children = routers
    console.log(indexRouter)
    resolve(indexRouter)
  })
}
