import request from '@/utils/request'

// 砍价管理列表
export function getCutPriceList(data)　{
    return request({
        url: '/api/hkd-portal/jzMarketCutPriceController/findMarketCutPriceByPage',
        method: 'post',
        data
    })
}
// 某个砍价详情
export function getCutPrice(data)　{
    return request({
        url: '/api/hkd-portal/jzMarketCutPriceController/findMarketCutPriceById',
        method: 'post',
        data
    })
}
// 新建/编辑砍价管理
export function saveCutPrice(data)　{
    return request({
        url: '/api/hkd-portal/jzMarketCutPriceController/saveMarketCutPriceById',
        method: 'post',
        data
    })
}
