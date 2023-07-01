import request from '@/utils/request'

export const getEmployeeSimple = () => {
    return request({
        url: '/sys/user/simple'
    })
}

export function getEmployeeList(params) {
    return request({
        url: '/sys/user',
        params
    })
}

export function delEmployee(id) {
    return request({
        url: `/sys/user/${id}`,
        method: 'delete'
    })
}

export function addEmployee(data) {
    return request({
        method: 'post',
        url: '/sys/user',
        data
    })
}

export function importEmployee(data) {
    return request({
        url: '/sys/user/batch',
        method: 'post',
        data
    })
}


export function saveUserDetailById(data) {
    return request({
        url: `/sys/user/${data.id}`,
        method: 'put',
        data
    })
}

// 读取用户详情
export function getPersonalDetail(id) {
    return request({
        url: `/employees/${id}/personalInfo`
    })
}

// 更新
export function updatePersonal(data) {
    return request({
        url: `/employees/${data.userId}/personalInfo`,
        method: 'put',
        data
    })
}


//   获取岗位
export function getJobDetail(id) {
    return request({
        url: `/employees/${id}/jobs`
    })
}

// 更新岗位信息
export function updateJob(data) {
    return request({
        url: `/employees/${data.userId}/jobs`,
        method: 'put',
        data
    })
}

export function assignRoles(data) {
    return request({
        url: '/sys/user/assignRoles',
        data,
        method: 'put'
    })
}