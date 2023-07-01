import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getInfo, getUserDetailById } from '@/api/user'
import { resetRouter } from "@/router/index"
const state = {
    token: getToken(),
    userInfo: {}
}
const mutations = {
    setToken(state, token) {
        state.token = token
        setToken(token)
    },
    removeToken(state) {
        state.token = null,
            removeToken()
    },
    setUserInfo(state, res) {
        state.userInfo = res
    },
    removeUserInfo(state) {
        state.userInfo = {}
    }
}

const actions = {
    async login(context, data) {
        const res = await login(data)
        context.commit('setToken', res)
        setTimeStamp()
    },
    async getUserInfo(context) {
        const res = await getInfo()
        const photo = await getUserDetailById(res.userId)
        context.commit('setUserInfo', {...res, ...photo })
        return res //后面权限会讲到
    },
    logout(context) {
        context.commit('removeToken')
        context.commit('removeUserInfo')
        resetRouter()
        context.commit('permission/serRoutes', [], { root: true })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}