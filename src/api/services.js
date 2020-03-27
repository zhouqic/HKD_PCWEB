import request from '@/utils/request'


// 获取餐桌列表
export function findTableNumberList(data) {
  return request({
    url: '/api/hkd-portal/jzTableController/findTableNumberList',
    method: 'post',
    data
  })
}

// 保存餐桌信息
export function saveUpdateTable(data) {
  return request({
    url: '/api/hkd-portal/jzTableController/saveUpdateTable',
    method: 'post',
    data
  })
}

//获取餐桌信息
export function findTableById(data) {
  return request({
    url: '/api/hkd-portal/jzTableController/findTableById',
    method: 'post',
    data
  })
}

// 根据id删除
export function delTableById(data) {
  return request({
    url: '/api/hkd-portal/jzTableController/delTableById',
    method: 'post',
    data
  })
}

//  根据id下载小程序码base64
export function findQRcodeById(data) {
  return request({
    url: '/api/hkd-portal/jzTableController/findSmallProgramQRcodeById',
    method: 'post',
    data
  })
}

//  获取自助点餐二维码
export function getMallOrderQRcord(data) {
  return request({
    url: '/api/hkd-portal/jzTableController/getMallOrderQRcord',
    method: 'post',
    data
  })
}