import request from '@/utils/request'

// 获取首页统计数据
export function getDataByCreaterId(data) {
    return request({
        url: '/api/hkd-portal/pcShopHomeController/getDataByCreaterId',
        method: 'post',
        data
    })
}
// 获取首页折线图数据
export function getDataByCreaterIdLine(data) {
    return request({
        url: '/api/hkd-portal/pcShopHomeController/getDataByCreaterIdLine',
        method: 'post',
        data
    })
}
// 获取顾客报表通用数据
export function pcFindPresentation(data) {
    return request({
        url: '/api/hkd-portal/pcShopHomeController/pcFindPresentation',
        method: 'post',
        data
    })
}
// 获取顾客报表转化率复购率统计数据
export function findCusPresentation(data) {
    return request({
        url: '/api/hkd-portal/pcShopHomeController/findCusPresentation',
        method: 'post',
        data
    })
}
// 获取顾客报表用户数量统计数据
export function findCusStatistics(data) {
    return request({
        url: '/api/hkd-portal/pcShopHomeController/findCusStatistics',
        method: 'post',
        data
    })
}
// 获取经营汇总表格数据
export function getOperationSummary({ currentPage, dateFormat, endTime, pageSize, shopId, status }) {
    const data = {
        currentPage,
        dateFormat,
        endTime,
        pageSize,
        shopId,
        status
    }
    return request({
        url: '/api/hkd-portal/pcShopSetController/getOperationSummary',
        method: 'post',
        data
    })
}
// 获取经营分析表格数据
export function getBusinessAnalysis(data) {
    return request({
        url: '/api/hkd-portal/pcShopSetController/getBusinessAnalysis',
        method: 'post',
        data
    })
}
// 获取会员充值表格数据
export function getMembershipInrecord(data) {
    return request({
        url: '/api/hkd-portal/pcShopSetController/getMembershipInrecord',
        method: 'post',
        data
    })
}
// 获取会员概况表格数据
export function getMembershipProfile(data) {
    return request({
        url: '/api/hkd-portal/pcShopSetController/getMembershipProfile',
        method: 'post',
        data
    })
}
// 获取员工经营报表表格数据
export function findStaffOperateList(data) {
    return request({
        url: '/api/hkd-portal/pcShopSetController/findStaffOperateList',
        method: 'post',
        data
    })
}

// 获取核销报表表格数据
export function getVerificationList(data) {
    return request({
        url: '/api/hkd-portal/pcShopSetController/getVerificationList',
        method: 'post',
        data
    })
}

// 获取商户所有核销记录（单品、9.9，兑换券，砍价，积分,次卡）
export function getVerifyRecodes(data) {
    return request({
        url: '/api/hkd-user/rfSingleProductAPPController/getVerifyRecodeByCreaterId',
        method: 'post',
        data
    })
}

// 核销
export function exchangeCardByCode(data) {
    return request({
        url: '/api/hkd-user/shopSetController/exchangeCardByCode',
        method: 'post',
        data
    })
}

// 核销确认信息——new
export function getVerifyProductMsgNew(data) {
    return request({
        url: '/api/hkd-user/rfSingleProductAPPController/getVerifyProductMsgNew',
        method: 'post',
        data
    })
}

// 获取员工信息
export function getRfStaff() {
    return request({
        url: '/api/hkd-user/staffController/getRfStaff',
        method: 'post'
    })
}