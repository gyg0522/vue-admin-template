import {
  constantRoutes
} from '@/router'
import {
  GeneratorDynamicRouter
} from '@/router/dynamic-router'

const state = {
  routers: [],
  addRouters: []
}
const mutations = {
  SET_ROUTERS: (state, routers) => {
    state.addRouters = routers
    state.routers = constantRoutes.concat(routers)
  }
}
const actions = {
  GenerateRoutes({
    commit
  }, data) {
    return new Promise((resolve, reject) => {
      GeneratorDynamicRouter(data).then(res => {
        commit('SET_ROUTERS', res)
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
