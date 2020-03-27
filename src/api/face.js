import request from '@/utils/request'

// 获取到店顾客列表
export function findUserToStore(data) {
  return request({
    url: '/api/hkd-portal/face/findUserToStore',
    method: 'post',
    data
  })
}

// 注册会员
export function registerUserById(data) {
  return request({
    url: '/api/hkd-portal/face/registerUserById',
    method: 'post',
    data
  })
}

// 顾客到店记录
export function findComeStoreByFaceId(data) {
  return request({
    url: '/api/hkd-portal/face/findComeStoreByFaceId',
    method: 'post',
    data
  })
}

// 获取顾客到店次数按时间统计
export function findUserInfoByFaceId(data) {
  return request({
    url: '/api/hkd-portal/face/findUserInfoByFaceId',
    method: 'post',
    data
  })
}

// 获取会员消费记录
export function findMallOrderByPage(data) {
  return request({
      url: '/api/hkd-portal/face/getConsumptionRecordById',
      method: 'post',
      data
  })
}

// 照片查看
export function findUserUrlByPage(data) {
  return request({
    url: '/api/hkd-portal/face/findUserUrlByPage',
    method: 'post',
    data
  })
}

// 人员管理统计
export function findUserManageCount() {
  return request({
    url: '/api/hkd-portal/face/findUserManageCount',
    method: 'post'
  })
}

// 人员管理列表
export function findUserManage(data) {
  return request({
    url: '/api/hkd-portal/face/findUserManage',
    method: 'post',
    data
  })
}

// 抓拍记录
export function findFaceCustomerList(data) {
  return request({
    url: '/api/hkd-portal/face/findFaceCustomerList',
    method: 'post',
    data
  })
}