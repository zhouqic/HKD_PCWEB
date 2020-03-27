import request from '@/utils/request'

// 获取分享红包列表
export function getRedPacketList(data)　{
    return request({
        url: '/api/hkd-user/instantRedPacketController/getRfInstantRedPacketByCreaterId',
        method: 'post',
        data
    })
}

// 创建分享红包活动
export function saveRfRedPacket(data)　{
    return request({
        url: '/api/hkd-user/instantRedPacketController/saveRfInstantRedPacket',
        method: 'post',
        data
    })
}

// 终止分享红包活动
export function stopRedPacketById(data)　{
    return request({
        url: '/api/hkd-user/instantRedPacketController/stopRfInstantRedPacketById',
        method: 'post',
        data
    })
}

// 删除分享红包活动
export function delRedPacketById(data)　{
    return request({
        url: '/api/hkd-user/instantRedPacketController/deleteRfInstantRedPacketById',
        method: 'post',
        data
    })
}

// 获取满减活动列表
export function getRfFullCutList(data)　{
    return request({
        url: '/api/hkd-user/rfFullCutActiveController/getRfFullCutActiveList',
        method: 'post',
        data
    })
}

// 创建满减活动
export function addFullCutActive(data)　{
    return request({
        url: '/api/hkd-user/rfFullCutActiveController/addFullCutActive',
        method: 'post',
        data
    })
}

// 终止满减活动
export function stopRfFullCutActiveById(data)　{
    return request({
        url: '/api/hkd-user/rfFullCutActiveController/stopRfFullCutActiveById',
        method: 'post',
        data
    })
}

// 付费次卡活动列表
export function getRfNumCardList(data)　{
    return request({
        url: '/api/hkd-user/rfNumberCardRuleController/getRfNumberCardRuleList',
        method: 'post',
        data
    })
}

// 添加付费次卡活动
export function saveRfNumCardRule(data)　{
    return request({
        url: '/api/hkd-user/rfNumberCardRuleController/saveRfNumberCardRule',
        method: 'post',
        data
    })
}

// 停止付费次卡活动
export function stopRfNumCardRule(data)　{
    return request({
        url: '/api/hkd-user/rfNumberCardRuleController/stopRfNumberCardRule',
        method: 'post',
        data
    })
}

// 次卡购买记录
export function getRfNumCardRuleById(data)　{
    return request({
        url: '/api/hkd-user/rfNumberCardRuleController/getRfNumberCardRuleById',
        method: 'post',
        data
    })
}

// 获取推广活动
export function getExpandRulebyCreaterId(data)　{
    return request({
        url: '/api/hkd-user/expandCodeController/getExpandRulebyCreaterId',
        method: 'post',
        data
    })
}

// 删除优惠推广活动（假删除）
export function delExpandRulebyId(data)　{
    return request({
        url: '/api/hkd-user/expandCodeController/delExpandRulebyId',
        method: 'post',
        data
    })
}

// 设置推广活动
export function addExpandCodeRule(data)　{
    return request({
        url: '/api/hkd-user/expandCodeController/addExpandCodeRule',
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

// 获取实物券列表
export function findEntityCardList()　{
    return request({
        url: '/api/hkd-user/memberController/findEntityCardList',
        method: 'post'
    })
}

// 添加实物券
export function addEntityCard(data)　{
    return request({
        url: '/api/hkd-user/memberController/addEntityCard',
        method: 'post',
        data
    })
}

// 删除实物券（假删）
export function delEntityCardById(data)　{
    return request({
        url: '/api/hkd-user/memberController/delEntityCardById',
        method: 'post',
        data
    })
}

// 获取所有智慧商盟活动
export function getShangMengList(data)　{
    return request({
        url: '/api/hkd-user/businessAllianceActivity/getBusinessAllianceActivityList',
        method: 'post',
        data
    })
}

// 获取所有智慧商盟活动
export function getJoinActivityList(data)　{
    return request({
        url: '/api/hkd-user/businessAllianceActivity/getJoinBusinessAllianceActivityList',
        method: 'post',
        data
    })
}

// 报名参与智慧商盟活动
export function signupShangmengActivity(data)　{
    return request({
        url: '/api/hkd-user/businessAllianceActivity/saveBusinessAllianceJoinShop',
        method: 'post',
        data
    })
}

// 获取所有智慧商盟活动详情
export function getShangMengById(data)　{
    return request({
        url: '/api/hkd-user/businessAllianceActivity/getBusinessAllianceActivity',
        method: 'post',
        data
    })
}

// 获取智慧商盟活动商家我的收益
export function findBusinessShopProfit(data)　{
    return request({
        url: '/api/hkd-user/businessAllianceActivity/findBusinessShopProfit',
        method: 'post',
        data
    })
}

// 获取充值规则
export function getRfRechargeRules(data)　{
    return request({
        url: '/api/hkd-user/marketingController/getRfRechargeRulesByStatus',
        method: 'post',
        data
    })
}

// 删除充值规则
export function deleteRfRechargeRuleById(data)　{
    return request({
        url: '/api/hkd-user/marketingController/deleteRfRechargeRuleById',
        method: 'post',
        data
    })
}

// 保存充值规则
export function saveRfRechargeRule(data)　{
    return request({
        url: '/api/hkd-user/marketingController/saveRfRechargeRule',
        method: 'post',
        data
    })
}

// 获取会员礼包列表
export function getRfNewGiftsByCreaterId(data)　{
    return request({
        url: '/api/hkd-user/rfNewGiftPackController/getRfNewGiftPackList',
        method: 'post',
        data
    })
}

// 结束会员礼包活动
export function stopRfNewGiftPackActive(data)　{
    return request({
        url: '/api/hkd-user/rfNewGiftPackController/stopRfNewGiftPackActive',
        method: 'post',
        data
    })
}

// 查询会员礼包详情
export function getGiftDetailsById(data)　{
    return request({
        url: '/api/hkd-user/rfNewGiftPackController/getRfNewGiftPackDetailsByActiveId',
        method: 'post',
        data
    })
}

// 新建会员礼包
export function addRfNewGiftPack(data)　{
    return request({
        url: '/api/hkd-user/rfNewGiftPackController/addRfNewGiftPack',
        method: 'post',
        data
    })
}

// 获取积分规则
export function getRfPointsRuleByCreaterId()　{
    return request({
        url: '/api/hkd-user/marketingController/getRfPointsRuleByCreaterId',
        method: 'post'
    })
}

// 保存积分规则
export function saveRfPointsRule(data)　{
    return request({
        url: '/api/hkd-user/marketingController/saveRfPointsRule',
        method: 'post',
        data
    })
}

// 获取商家会员卡设置
export function getVipCardByCreaterId()　{
    return request({
        url: '/api/hkd-user/upgradForumController/getVipCardByCreaterId',
        method: 'post'
    })
}

// 更新会员卡
export function updateVipCard(data)　{
    return request({
        url: '/api/hkd-user/upgradForumController/updateVipCard',
        method: 'post',
        data
    })
}

// 商户创建会员卡
export function saveVipCard(data)　{
    return request({
        url: '/api/hkd-user/upgradForumController/saveVipCard',
        method: 'post',
        data
    })
}

// 获取支付前投放会员卡设置
export function getPayOpenCard()　{
    return request({
        url: '/api/hkd-user/marketingController/getPayOpenCard',
        method: 'post'
    })
}

// 保存支付前投放会员卡设置
export function savePayOpenCard(data)　{
    return request({
        url: '/api/hkd-user/marketingController/savePayOpenCard',
        method: 'post',
        data
    })
}

/* 红包广场 */
// 获取商户红包列表
export function getRedPacketOfShop(data)　{
    return request({
        url: '/api/hkd-user/wxController/getCommandRedPacketOfShop',
        method: 'post',
        data
    })
}

// 获取红包详情
export function getRedPacketDetail(data)　{
    return request({
        url: '/api/hkd-user/wxController/getCommandRedPacketDetailOfShop',
        method: 'post',
        data
    })
}

// 获取红包详情
export function getUsersOfRedPacket(data)　{
    return request({
        url: '/api/hkd-user/wxController/getUsersOfRfCommandRedPacket',
        method: 'post',
        data
    })
}

// 获取红包趋势图数据
export function getRedPacketStatistics(data)　{
    return request({
        url: '/api/hkd-user/statistics/getRfCommandRedPacketStatistics',
        method: 'post',
        data
    })
}

// 获取红包统计数据
export function getRedPacketData(data)　{
    return request({
        url: '/api/hkd-user/statistics/getRfCommandRedPacketData',
        method: 'post',
        data
    })
}

// 获取口令红包模板
export function getCommandList(data)　{
    return request({
        url: '/api/hkd-user/shopSetController/getCommandRedPacketTemplateList',
        method: 'post',
        data
    })
}

// 商家创建口令红包
export function saveRfCommandRedPacket(data)　{
    return request({
        url: '/api/hkd-user/wxController/saveRfCommandRedPacket',
        method: 'post',
        data
    })
}

/* 会员福利社 */
// 获取会员等级设置
export function getMemberGradeSet()　{
    return request({
        url: '/api/hkd-user/memberController/getMemberGradeSet',
        method: 'post'
    })
}

// 设置会员等级
export function addMemberGradeSet(data)　{
    return request({
        url: '/api/hkd-user/memberController/addMemberGradeSet',
        method: 'post',
        data
    })
}

// 获取积分商品列表
export function getPointsProductList(data)　{
    return request({
        url: '/api/hkd-user/rfPointsMallController/getPointsProductByCreaterId',
        method: 'post',
        data
    })
}


// 上传/编辑积分商品
export function savePointsProduct(data)　{
    return request({
        url: '/api/hkd-user/rfPointsMallController/savePointsProduct',
        method: 'post',
        data
    })
}

// 获取积分商品详情
export function getPointsProductById(data)　{
    return request({
        url: '/api/hkd-user/rfPointsMallController/getPointsProductById',
        method: 'post',
        data
    })
}

// 下架,上架,删除积分商品
export function putawayPointsProduct(data)　{
    return request({
        url: '/api/hkd-user/rfPointsMallController/putawayPointsProduct',
        method: 'post',
        data
    })
}

// app获取商户所有核销记录（单品、9.9，兑换券，砍价，积分,次卡）
export function getRfSingleOrderList(data)　{
    return request({
        url: '/api/hkd-portal/pcSingleProductController/getRfSingleOrderList',
        method: 'post',
        data
    })
}

// 获取会员专享优惠券列表
export function getMemberSpecialCardList()　{
    return request({
        url: '/api/hkd-user/memberController/getMemberSpecialCardList',
        method: 'post'
    })
}

// 删除会员专享优惠券
export function deleteMemberSpecialCard(data)　{
    return request({
        url: '/api/hkd-user/memberController/deleteMemberSpecialCard',
        method: 'post',
        data
    })
}

// 添加会员专享优惠券
export function addMemberSpecialCard(data)　{
    return request({
        url: '/api/hkd-user/memberController/addMemberSpecialCard',
        method: 'post',
        data
    })
}

// 专属实物券列表
export function findSpecialEntityCardList()　{
    return request({
        url: '/api/hkd-user/memberController/findSpecialEntityCardList',
        method: 'post'
    })
}

// 删除专属实物券
export function delSpecialEntityCard(data)　{
    return request({
        url: '/api/hkd-user/memberController/delSpecialEntityCard',
        method: 'post',
        data
    })
}

// 添加专属实物券
export function addSpecialEntityCard(data)　{
    return request({
        url: '/api/hkd-user/memberController/addSpecialEntityCard',
        method: 'post',
        data
    })
}

/* 积分抽奖 */
// 查询大转盘列表
export function wheelInfoList(data)　{
    return request({
        url: '/api/hkd-user/wheelInfo/wheelInfoList',
        method: 'post',
        data
    })
}

// 设置大转盘
export function addWheelInfo(data)　{
    return request({
        url: '/api/hkd-user/wheelInfo/addWheelInfo',
        method: 'post',
        data
    })
}

// 结束活动
export function finishWheelInfo(data)　{
    return request({
        url: '/api/hkd-user/wheelInfo/finishWheelInfo',
        method: 'post',
        data
    })
}

// 中奖统计
export function findAwardById(data)　{
    return request({
        url: '/api/hkd-user/wheelInfo/findAwardById',
        method: 'post',
        data
    })
}