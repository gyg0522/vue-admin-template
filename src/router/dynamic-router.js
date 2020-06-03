<<<<<<< HEAD
import Layout from '@/layout'
// 使用钩子函数对路由进行权限跳转
const context = require.context('../views', true, /router.js$/)
console.log(context)

const asyncConstantRouter = context.keys().map(path => {
  var router = require(`../views${path.substr(1)}`).default
  console.log(router())
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
=======

const router = [
  {
    path: '',
    component: (resolve) => require(['../layout/index.vue'], resolve),
    children: [{
      path: '/dashboard',
      name: 'Dashboard',
      component: (resolve) => require(['../views/dashboard/index.vue'], resolve),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },

  {
    path: '',
    component: (resolve) => require(['../layout/index.vue'], resolve),
    name: 'Example',
    meta: { title: 'Example', icon: 'example' },
    children: [
      {
        path: '/example/table',
        name: 'Table',
        component: (resolve) => require(['../views/table/index'], resolve),
        meta: { title: 'Table', icon: 'table' }
      },
      {
        path: '/example/tree',
        name: 'Tree',
        component: (resolve) => require(['../views/tree/index'], resolve),
        meta: { title: 'Tree', icon: 'tree' }
      }
    ]
  },

  {
    path: '',
    component: (resolve) => require(['../layout/index.vue'], resolve),
    children: [
      {
        path: '/form/index',
        name: 'Form',
        component: (resolve) => require(['../views/form/index'], resolve),
        meta: { title: 'Form', icon: 'form' }
      }
    ]
  },

  {
    path: '',
    component: (resolve) => require(['../layout/index.vue'], resolve),
    name: 'Nested',
    meta: {
      title: 'Nested',
      icon: 'nested'
    },
    children: [
      {
        path: '/nested/menu1',
        component: (resolve) => require(['../views/nested/menu1/index'], resolve),
        name: 'Menu1',
        meta: { title: 'Menu1' },
        children: [
          {
            path: '/nested/menu1/menu1-1',
            component: (resolve) => require(['../views/nested/menu1/menu1-1'], resolve),
            name: 'Menu1-1',
            meta: { title: 'Menu1-1' }
          },
          {
            path: '/nested/menu1/menu1-2',
            component: (resolve) => require(['../views/nested/menu1/menu1-2'], resolve),
            name: 'Menu1-2',
            meta: { title: 'Menu1-2' },
            children: [
              {
                path: '/nested/menu1/menu1-2/menu1-2-1',
                component: (resolve) => require(['../views/nested/menu1/menu1-2/menu1-2-1'], resolve),
                name: 'Menu1-2-1',
                meta: { title: 'Menu1-2-1' }
              },
              {
                path: '/nested/menu1/menu1-2/menu1-2-2',
                component: (resolve) => require(['../views/nested/menu1/menu1-2/menu1-2-2'], resolve),
                name: 'Menu1-2-2',
                meta: { title: 'Menu1-2-2' }
              }
            ]
          },
          {
            path: '/nested/menu1/menu1-3',
            component: (resolve) => require(['../views/nested/menu1/menu1-3'], resolve),
            name: 'Menu1-3',
            meta: { title: 'Menu1-3' }
          }
        ]
      },
      {
        path: '/nested/menu2',
        component: (resolve) => require(['../views/nested/menu2/index'], resolve),
        meta: { title: 'menu2' }
      }
    ]
  },

  {
    path: '',
    name: 'external-link',
    component: (resolve) => require(['../layout/index.vue'], resolve),
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  }
]
>>>>>>> 6fdb79a970cde46b360249ad638b68ea9f902e38

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
<<<<<<< HEAD
      component: getComponent(item, parent),
=======
      component: resolve => {
        if (parent) {
          require([`..${item.component}`], resolve)
        } else {
          require(['../layout/index.vue'], resolve)
        }
      },

>>>>>>> 6fdb79a970cde46b360249ad638b68ea9f902e38
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
    // const routers = dynamicRouter(routerMap)
    const routers = router
    routers.push({
      path: '*',
      redirect: '/404',
      hidden: true
    })
    console.log(routers)
    resolve(routers)
  })
}
