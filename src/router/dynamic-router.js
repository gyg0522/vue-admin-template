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

const dynamicRouter = (routerMap, parent) => {
  return routerMap.map(item => {
    const router = asyncConstantRouter.get(item.name) || {}
    const {
      title,
      icon,
      breadcrumb,
      activeMenu,
      cache
    } = { ...router.meta, ...item.meta }

    const isLink = item.path.startsWith('http')
    const currentRouter = {
      path: item.path || '',

      // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
      name: item.name || item.path || Math.random(),

      // 外链不需要component
      component: parent ? (isLink ? null : router.component) : Layout,
      meta: {
        // 设置该路由在侧边栏和面包屑中展示的名字
        title: title,

        // 设置该路由的图标
        icon: icon || undefined,

        // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
        noCache: !cache,

        // 如果设置为false，则不会在breadcrumb面包屑中显示(默认 true)
        breadcrumb: breadcrumb,

        // 当路由设置了该属性，则会高亮相对应的侧边栏。
        // 这在某些场景非常有用，比如：一个文章的列表页路由为：/article/list
        // 点击文章进入文章详情页，这时候路由为/article/1，但你想在侧边栏高亮文章列表的路由，就可以进行如下设置
        activeMenu: activeMenu
      }
    }

    // 当设置 true 的时候该路由不会在侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
    currentRouter.hidden = item.hidden || false
    if (item.redirect) {
      currentRouter.redirect = item.redirect
    }

    // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
    // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
    // 若你想不管路由下面的 children 声明的个数都显示你的根路由
    // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
    currentRouter.alwaysShow = false

    // 处理有可能出现拼接出两个 反斜杠
    if (!isLink) {
      currentRouter.path = currentRouter.path.replace('//', '/')
    }

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
