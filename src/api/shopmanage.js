import request from '@/utils/request'

// 获取云店装修数据
export function getRfShopInfoByCreaterId() {
    return request({
        url: '/api/hkd-user/regionForumController/getRfShopInfoByCreaterId',
        method: 'post'
    })
}

// 获取所有行业数据
export function getPlatformIndustrys(data) {
    return request({
        url: '/api/hkd-user/regionForumController/getPlatformIndustrys',
        method: 'post',
        data
    })
}

// 添加修改商铺信息
export function saveRfShopInfo(data) {
    return request({
        url: '/api/hkd-user/regionForumController/saveRfShopInfo',
        method: 'post',
        data
    })
}

// 获取付款二维码
export function getQRCode(data) {
    return request({
        url: '/api/hkd-portal/pcStaffManageController/getQRCode',
        method: 'post',
        data
    })
}

// 获取会员卡开卡二维码
export function openCardQRcode(data) {
    return request({
        url: '/api/hkd-portal/pcStaffManageController/openCardQRcode',
        method: 'post',
        data
    })
}

// 获取小程序二维码
export function getMallQRcord(data) {
    return request({
        url: '/api/hkd-portal/jzTableController/getMallQRcord',
        method: 'post',
        data
    })
}


// 获取门店信息
export function findShopInfo() {
    return request({
        url: '/api/hkd-portal/pcShopSetController/findShopInfo',
        method: 'post',
        data: {}
    })
}