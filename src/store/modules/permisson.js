import { constantRoutes, asyncRoutes } from '@/router/index'
const state = {
    routes: constantRoutes
}

const mutations = {
    serRoutes(state, newRoutes) {
        state.routes = [...constantRoutes, ...newRoutes]
    }
}

const actions = {
    fileterRoutes(context, menus) {
        const routes = []
        menus.forEach(key => {
            routes.push(...asyncRoutes.filter(item => item.name === key))
        })
        context.commit('serRoutes', routes)
        return routes
    }
}


export default {
    namespaced: true,
    state,
    mutations,
    actions
}