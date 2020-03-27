import request from '@/utils/request'

// 登录接口
export function loginByUsername(username, loginType, password, jobNumber) {
  const data = {
    username,
    loginType,
    jobNumber,
    password
  }
  return request({
    url: '/api/hkd-auth/auth/tokenPC',
    method: 'post',
    data
  })
}

// 获取验证码接口
export function getVerifyCode(tel) {
  const data = { tel };
  return request({
    url: '/api/hkd-user/loginRegisterController/getVerifyCode',
    method: 'post',
    data
  })
}

// 获取系统功能列表
export function getRfOpenFuncById(data) {
  return request({
    url: '/api/hkd-user/marketingController/getRfFunctionChargeByCreaterId ',
    method: 'post',
    data
  })
}

// 修改密码接口
export function updatePwd(data) {
  return request({
    url: '/api/hkd-user/loginRegisterController/updatePwd',
    method: 'post',
    data
  })
}