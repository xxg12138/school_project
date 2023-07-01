import request from '@/utils/request'

export const getDepartments = () => {
    return request({
        url: "/company/department",
        method: "get"
    })
}


export function delDepartments(id) {
    return request({
        url: `/company/department/${id}`,
        method: 'delete'
    })
}


export function addDepartments(data) {
    return request({
        url: '/company/department',
        method: 'post',
        data
    })
}

export const getDepartDetail = id => {
    return request({
        url: `/company/department/${id}`,
    })
}


export const updateDepartments = data => {
    return request({
        url: `/company/department/${data.id}`,
        method: 'put',
        data
    })
}