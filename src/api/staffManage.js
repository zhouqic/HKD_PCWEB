import request from '@/utils/request'

//获取员工列表
export function getStaffList(data) {
  return request({
    url: 'api/hkd-portal/pcStaffManageController/findStaffList',
    method: 'post',
    data
  })
}

//获取员工信息
export function getRfStaffById(id) {
  let data = { id }
  return request({
    url: '/api/hkd-user/staffController/getRfStaffById',
    method: 'post',
    data
  })
}

//保存员工信息
export function saveRfStaff(data) {
  return request({
    url: '/api/hkd-user/staffController/saveRfStaff',
    method: 'post',
    data: data
  })
}

//删除员工
export function deleteRfStaffById(id) {
  let data = { id };
  return request({
    url: '/api/hkd-user/staffController/deleteRfStaffById',
    method: 'post',
    data
  })
}