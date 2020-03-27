import request from '@/utils/request'

// 订单查询
export function getOrderByPage(data)　{
    return request({
        url: '/api/hkd-portal/jzMallOrderController/findMallOrderByPage',
        method: 'post',
        data
    })
}
// 提货
export function updateOrderById(data)　{
    return request({
        url: '/api/hkd-portal/jzMallOrderController/updateMallOrderById',
        method: 'post',
        data
    })
}
// 订单详情
export function getOrderById(data)　{
    return request({
        url: '/api/hkd-portal/jzMallOrderController/findMallOrderById',
        method: 'post',
        data
    })
}