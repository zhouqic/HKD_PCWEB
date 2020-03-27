import request from '@/utils/request'

/* 
  首页轮播图设置
*/

// 轮播图列表
export function getSlideListShow(data) {
  return request({
    url: '/api/hkd-portal/jzHomeManagementController/findCommonSlideshowList',
    method: 'post',
    data
  })
}
// 编辑之前重新获取单个轮播图数据
export function getSlideShow(data) {
  return request({
    url: '/api/hkd-portal/jzHomeManagementController/findCommonSlideshowById',
    method: 'post',
    data
  })
}
// 新增/编辑轮播图
export function saveSlideShow(data) {
  return request({
    url: '/api/hkd-portal/jzHomeManagementController/saveCommonSlideshow',
    method: 'post',
    data
  })
}
// 删除轮播图
export function deleteSlideShow(data) {
  return request({
    url: '/api/hkd-portal/jzHomeManagementController/deleteCommonSlideshowById',
    method: 'post',
    data
  })
}
// 获取轮播时间
export function getSlideTime(param) {
  const data = param || {};
  return request({
    url: '/api/hkd-portal/jzSysPosterTimeoutController/findSysPosterTimeoutByCreateBy',
    method: 'post',
    data
  })
}
// 更改轮播时间
export function changeSlideTime(data) {
  return request({
    url: '/api/hkd-portal/jzSysPosterTimeoutController/saveSysPosterTimeout',
    method: 'post',
    data
  })
}
// 根据轮播图获取商品列表
export function getBannerToProduct(data) {
  return request({
    url: '/api/hkd-portal/jzShopProductController/findBannerToProduct',
    method: 'post',
    data
  })
}

/* 
  快递运费设置设置
*/

// 快递运费列表
export function getExpressList(data) {
  return request({
    url: '/api/hkd-portal/jzExpressSettingController/findExpressList',
    method: 'post',
    data
  })
}
// 快递单个运费
export function getExpress(data) {
  return request({
    url: '/api/hkd-portal/jzExpressSettingController/findExpressById',
    method: 'post',
    data
  })
}
// 新增/编辑快递运费
export function saveExpress(data) {
  return request({
    url: '/api/hkd-portal/jzExpressSettingController/saveExpress',
    method: 'post',
    data
  })
}

// 删除快递运费
export function deleteExpress(data) {
  return request({
    url: '/api/hkd-portal/jzExpressSettingController/deleteExpressById',
    method: 'post',
    data
  })
}
