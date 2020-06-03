import Layout from '@/layout'
// 使用钩子函数对路由进行权限跳转
const context = require.context('../views', true, /router.js$/)
console.log(context)

const asyncConstantRouter = context.keys().map(item => {
  const path = `${item.substr(2)}`
  const pattern = /(\S*)/
  var router = require(`@/views/${path}`).default
  console.log(router(path))
  //   console.log(router()) router(i.split('/')[1])
  return null
})

const getComponent = (item, parent) => {
  console.log('=====>', asyncConstantRouter)
  if (parent) {
    return asyncConstantRouter(item.name)
  } else {
    return Layout
  }
}

/* Layout */
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
      path: item.path || '',
      name: item.name || item.path || '',
      // 该路由对应页面的 组件 : (动态加载)
      component: getComponent(item, parent),
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
    console.log(routers)
    resolve(routers)
  })
}
