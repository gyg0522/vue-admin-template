import Layout from '@/layout'
// 动态加载路由
const context = require.context('../views', true, /router.js$/)
const asyncConstantRouter = new Map()
context.keys().forEach(element => {
  const path = `${element.substr(2)}`
  const pattern = /(\S*)\/config\/router.js/
  const router = require(`@/views/${path}`).default
  const routers = router(path.match(pattern)[1])
  if (routers && routers.length > 0) {
    routers.forEach(item => {
      asyncConstantRouter.set(item.name, item)
    })
  }
})

/* Layout */
const dynamicRouter = (routerMap, parent) => {
  return routerMap.map(item => {
    const {
      title,
      icon,
      breadcrumb,
      activeMenu,
      noCache,
      affix
    } = item.meta || {}
    const router = asyncConstantRouter.get(item.name)
    const isLink = item.path.startsWith('http')
    const currentRouter = {
      path: item.path || '',
      name: item.name || item.path || Math.random(),

      // 外链不需要component
      component: parent ? (isLink ? null : router.component) : Layout,
      meta: {
        title: title,
        icon: icon || undefined,
        breadcrumb: breadcrumb,
        activeMenu: activeMenu,
        affix: affix === true,
        noCache: noCache !== false
      }
    }
    currentRouter.hidden = item.hidden
    if (item.redirect) {
      currentRouter.redirect = item.redirect
    }

    // 处理有可能出现拼接出两个 反斜杠
    if (!isLink) {
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
    resolve(routers)
  })
}
