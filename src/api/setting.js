import request from '@/utils/request'


export const getRoleList = (params) => {
    return request({
        url: '/sys/role',
        params
    })
}

export function getCompanyInfo(companyId) {
    return request({
        url: `/company/${companyId}`
    })
}


export function deleteRole(id) {
    return request({
        url: `/sys/role/${id}`,
        method: 'delete'
    })
}

export function updateRole(data) {
    return request({
        url: `/sys/role/${data.id}`,
        data,
        method: 'put'
    })
}
/**
 * 获取角色详情
 * **/
export function getRoleDetail(id) {
    return request({
        url: `/sys/role/${id}`
    })
}

export const addRole = (data) => {
    return request({
        url: "/sys/role",
        method: 'post',
        data
    })
}