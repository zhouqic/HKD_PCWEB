import request from '@/utils/request'

// 获取单品活动列表
export function getBPListByCreaterId(data) {
    return request({
        url: '/api/hkd-portal/pcSingleProductController/getRfSingleProductByCreaterId',
        method: 'post',
        data
    })
}

// 获取已创建爆品个数
export function getBPCount(data) {
    return request({
        url: '/api/hkd-portal/pcSingleProductController/getRfSingleProductCountByCreaterId',
        method: 'post',
        data
    })
}

// 获取9.9专区活动列表
export function getDisProductByCreaterId(data) {
    return request({
        url: '/api/hkd-portal/pcSingleProductController/getRfDiscountProductByCreaterId',
        method: 'post',
        data
    })
}

// 上传/编辑单品/9.9专区
export function saveRfSingleProduct(data) {
    return request({
        url: '/api/hkd-user/rfSingleProductAPPController/saveRfSingleProduct',
        method: 'post',
        data
    })
}

// 下架,上架,删除 单品/9.9
export function putawayRfSingleProduct(data) {
    return request({
        url: '/api/hkd-user/rfSingleProductAPPController/putawayRfSingleProduct',
        method: 'post',
        data
    })
}

// 获取所有的单品分类
export function getProductCategory() {
    return request({
        url: '/api/hkd-user/rfSingleProductAPPController/getProductCategory',
        method: 'post'
    })
}

// 获取单品/9.9详情
export function getRfSingleProductById(data) {
    return request({
        url: '/api/hkd-user/rfSingleProductAPPController/getRfSingleProductById',
        method: 'post',
        data
    })
}

// 设置单品展示位置(爆品推广)
export function setProductDisplaySite(data) {
    return request({
        url: '/api/hkd-user/rfSingleProductAPPController/setRfSingleProductDisplaySite',
        method: 'post',
        data
    })
}

// 查询展示位置,以及该位置绑定的单品
export function getRfSingleProductSiteDetail(data) {
    return request({
        url: '/api/hkd-user/rfSingleProductAPPController/getRfSingleProductSiteDetail',
        method: 'post',
        data
    })
}

// 获取单品/9.9订单列表（引流订单）
export function getRfSingleOrderList(data) {
    return request({
        url: '/api/hkd-portal/pcSingleProductController/getRfSingleOrderList',
        method: 'post',
        data
    })
}

// 单品和9.9专区数据分析
export function getPushProductAnalysis(data) {
    return request({
        url: '/api/hkd-user/rfSingleProductAPPController/getPushProductAnalysis',
        method: 'post',
        data
    })
}