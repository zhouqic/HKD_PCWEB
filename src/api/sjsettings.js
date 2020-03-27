import request from '@/utils/request'

// 获取我的服务商数据
export function getAgentBriefInfo() {
    return request({
        url: '/api/hkd-user/shopSetController/getAgentBriefInfo',
        method: 'post'
    })
}

// 获取商家入驻信息
export function getRfAuthInfoByCreaterId() {
    return request({
        url: '/api/hkd-user/rfAuthInfoController/getRfAuthInfoByCreaterId',
        method: 'post'
    })
}

// 获取储值余额优惠共享
export function getRfNewGiftsNumByCreaterId() {
    return request({
        url: '/api/hkd-user/marketingController/getRfNewGiftsNumByCreaterId',
        method: 'post'
    })
}


// 获取所有绑定云喇叭
export function getAllRfCloudSpeakers() {
    return request({
        url: '/api/hkd-user/horn/getRfCloudSpeakersByCreaterId',
        method: 'post'
    })
}

// 绑定云喇叭
export function saveRfCloudSpeaker(data) {
    return request({
        url: '/api/hkd-user/horn/saveRfCloudSpeaker',
        method: 'post',
        data
    })
}

// 解除绑定云喇叭
export function unBindRfCloudSpeaker(data) {
    return request({
        url: '/api/hkd-user/horn/relieveBindingRfCloudSpeaker',
        method: 'post',
        data
    })
}

// 获取云喇叭绑定员工
export function getStaffsBySpeakerId(data) {
    return request({
        url: '/api/hkd-user/horn/getBindingRfStaffsByRfCloudSpeakerId',
        method: 'post',
        data
    })
}

// 获取未绑定云喇叭员工
export function getNotBindStaffs() {
    return request({
        url: '/api/hkd-user/horn/getNotBindingRfStaffsByCreaterId',
        method: 'post'
    })
}

// 云喇叭绑定员工
export function bindingRfStaffs(data) {
    return request({
        url: '/api/hkd-user/horn/bindingRfStaffs',
        method: 'post',
        data
    })
}

// 解除员工云喇叭
export function unBindingRfStaff(data) {
    return request({
        url: '/api/hkd-user/horn/relieveBindingRfStaff',
        method: 'post',
        data
    })
}

// 设置储值余额优惠共享
export function setRechargeAlone(data) {
    return request({
        url: '/api/hkd-user/shopSetController/setRechargeAlone',
        method: 'post',
        data
    })
}

// 获取商户助手已绑定的员工
export function getAlreadBindAssistant(data) {
    return request({
        url: '/api/hkd-user/staffController/getAlreadBindAssistant',
        method: 'post',
        data
    })
}

// 解除商户助手绑定的某员工
export function disBindAssistant(data) {
    return request({
        url: '/api/hkd-user/staffController/disBindAssistant',
        method: 'post',
        data
    })
}

// 老板获取商户助手绑定二维码
export function getAssistantCode(data) {
    return request({
        url: '/api/hkd-portal/pcStaffManageController/getAssistantCode',
        method: 'post',
        data
    })
}

// 获取客服信息
export function getRfCustomerService() {
    return request({
        url: '/api/hkd-user/regionForumController/getRfCustomerService',
        method: 'post'
    })
}