import request from '@/utils/request'

// 获取收款明细数据
export function getOperationSummary(data) {
    return request({
        url: '/api/hkd-portal/pcOrderManController/getOperationSummary',
        method: 'post',
        data
    })
}

// 获取退款明细数据
export function refundRecordList(data) {
    return request({
        url: '/api/hkd-user/regionForumController/refundRecordList',
        method: 'post',
        data
    })
}

// 获取充值流水数据
export function findRechargeByCreaterId(data) {
    return request({
        url: '/api/hkd-portal/pcOrderManController/findRechargeByCreaterId',
        method: 'post',
        data
    })
}

// 订单打印
export function printOrder(data) {
    return request({
        url: '/api/hkd-portal/pcShopSetController/printOrder',
        method: 'post',
        data
    })
}