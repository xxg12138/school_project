import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getTimeStamp } from '@/utils//auth'
import router from '@/router'

const TimeOut = 36000

const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 5000
})

service.interceptors.request.use(config => {
        if (store.getters.token) {
            if (IsCheckTimeOut()) {
                store.dispatch('user/logout')
                router.push('/login')
                return Promise.reject(new Error('token超时了'))
            }
            config.headers['Authorization'] = `Bearer ${store.getters.token}`
        }
        return config
    },
    error => {
        return Promise.reject(error)
    })

service.interceptors.response.use(function(response) {
    const { success, message, data } = response.data
    if (success) {
        return data
    } else {
        Message.error(message)
        return Promise.reject(new Error(message))
    }
}, function(error) {
    if (error.response && error.response.data && error.response.data.code === 10002) {
        store.dispatch('user/logout')
        router.push('/login')
    } else {
        Message.error(error.message)
    }
    return Promise.reject(error)
})

function IsCheckTimeOut() {
    let currentTime = (Date.now() - getTimeStamp()) / 1000
    return currentTime > TimeOut
}

export default service