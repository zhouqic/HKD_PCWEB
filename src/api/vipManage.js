import request from '@/utils/request'

// 查询人群划分列表
export function getMemberCondition() {
    return request({
        url: '/api/hkd-user/memberController/getMemberConditionByCreaterId',
        method: 'post'
    })
}

// 查询人群人数
export function getGroupCount(data) {
    return request({
        url: '/api/hkd-portal/pcMemberController/countMemberByConsum',
        method: 'post',
        data
    })
}

// 新增或者修改人群划分
export function saveCondition(data) {
    return request({
        url: '/api/hkd-user/memberController/saveOrUpdateCondition',
        method: 'post',
        data
    })
}

// 查询群体发券记录
export function getGroupSendRecord(data) {
    return request({
        url: '/api/hkd-user/marketingController/sendCardsByGroup',
        method: 'post',
        data
    })
}

// 查询单个发券记录
export function getSendCardRecord(data) {
    return request({
        url: '/api/hkd-portal/pcMemberController/getSendCardRecord',
        method: 'post',
        data
    })
}


// 查询群体短信记录
export function getSmsSendRecord(data) {
    return request({
        url: '/api/hkd-user/smsMarketing/sendSmsListByCreaterId',
        method: 'post',
        data
    })
}

// 查询单个短信记录
export function getSmsDetailById(data) {
    return request({
        url: '/api/hkd-user/smsMarketing/smsDetailById',
        method: 'post',
        data
    })
}

// 删除人群划分
export function deleteConditionById(data) {
    return request({
        url: '/api/hkd-user/memberController/deleteConditionById',
        method: 'post',
        data
    })
}

// 获取会员等级标签
export function getMemberLabelList(data) {
    return request({
        url: '/api/hkd-portal/pcMemberController/findCusGradeList',
        method: 'post',
        data
    })
}

// 获取会员列表
export function getRfShopUserInfos(data) {
    return request({
        url: '/api/hkd-portal/pcMemberController/getRfShopUserInfosByCondition',
        method: 'post',
        data
    })
}

// 获取优惠券
export function getRfCardsByCreaterId(data) {
    return request({
        url: '/api/hkd-user/marketingController/getRfCardsByCreaterId',
        method: 'post',
        data
    })
}

// 发送优惠券
export function sendCards(data) {
    return request({
        url: '/api/hkd-user/marketingController/sendCards',
        method: 'post',
        data
    })
}

// 批量导出
export function downloadLoadExcel(data) {
    return request({
        url: '/api/hkd-portal/excel/memberExcel',
        method: 'post',
        data
    })
}

// 批量导入会员
export function importCustomExcel(data) {
    return request({
        url: '/api/hkd-portal/excel/importCustomExcel',
        method: 'post',
        data
    })
}

// 获取会员信息
export function getRfShopUserInfoById(data) {
    return request({
        url: '/api/hkd-portal/pcMemberController/getRfShopUserInfoById',
        method: 'post',
        data
    })
}

// 保存会员信息
export function saveRfShopUserInfo(data) {
    return request({
        url: '/api/hkd-user/memberController/saveRfShopUserInfo',
        method: 'post',
        data
    })
}

// 获取会员消费记录
export function findMallOrderByPage(data) {
    return request({
        url: '/api/hkd-portal/pcOrderManController/getConsumptionRecordById',
        method: 'post',
        data
    })
}

// 获取会员核销记录
export function findExchangeList(data) {
    return request({
        url: '/api/hkd-portal/pcMemberController/findExchangeList',
        method: 'post',
        data
    })
}

// 获取会员储值记录
export function findRecordList(data) {
    return request({
        url: '/api/hkd-portal/pcMemberController/findRecordList',
        method: 'post',
        data
    })
}

// 删除优惠券
export function deleteRfCardById(id) {
    const data = { id }
    return request({
        url: '/api/hkd-user/marketingController/deleteRfCardById',
        method: 'post',
        data
    })
}

// 保存优惠券
export function saveRfCard(data) {
    return request({
        url: '/api/hkd-user/marketingController/saveRfCard',
        method: 'post',
        data
    })
}