import { loginByUsername } from '@/api/login'
import * as auth from '@/utils/auth'
import { MessageBox } from 'element-ui';

/**
 * 登录失败提示
 * @param {number} param 0已过期；1未开通
*/
function showErrorMsg(param) {
  let msg = `您${param===0?'开通的业务已过期':'尚未开通此业务'}，请前往汇客多掌柜宝进行开通`
  MessageBox.confirm(msg, '提示', {
    confirmButtonText: '确定',
    showCancelButton: false,
    type: 'error'
  }).then(() => {
    window.location.reload();
  }).catch(() => {});
}

const user = {
  state: {
    token: auth.getToken(),
    staffRole: auth.getStaffRole(),//用户角色 0管理员 1普通员工
    jobNumber: auth.getJobNumber(),//工号
    shop: auth.getShop(),//店铺名
    shopId: auth.getShopId(),//店铺ID
    industryId: auth.getIndustryId(),//行业id
    shopType: auth.getShopType(),//店铺等级
    name: auth.getName(),//用户名
    tel: auth.getTel(), //手机号
    avatar: auth.getAvatar(),//用户身份
    createrId: auth.getCreaterId(),//
    staffId: auth.getStaffId(),// 员工id
    voiceType: auth.getVoiceType(),// 是否开启语音播报
    roleId: auth.getRoleId(),// 店铺类型
    roles: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_JOBNUMBER: (state, jobNumber) => {
      state.jobNumber = jobNumber
    },
    SET_STAFFROLE: (state, staffRole) => {
      state.staffRole = staffRole
    },
    SET_SHOP: (state, shop) => {
      state.shop = shop
    },
    SET_SHOPID: (state, id) => {
      state.shopId = id
    },
    SET_SHOPTYPE: (state, type) => {
      state.shopType = type
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_TEL: (state, tel) => {
      state.tel = tel;
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_STAFFID: (state, staffId) => {
      state.staffId = staffId
    },
    SET_CREATERID: (state, createrId) => {
      state.createrId = createrId
    },
    SET_VOICETYPE: (state, voiceType) => {
      state.voiceType = voiceType
    },
    SET_ROLEID: (state, id) => {
      state.roleId = id
    },
    SET_INDUSTRYID: (state, id) => {
      state.industryId = id
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      const { username, loginType, password, jobNumber } = userInfo
      return new Promise((resolve, reject) => {
        loginByUsername(username.trim(), loginType, password, jobNumber).then(response => {
          const data = response.tableData
          /* 通过版本及注册时间判断是否拥有登录权限 */
          // shopType='',未开通
          if (data.shopType === '') {
            showErrorMsg(1);
            return false;
          }
          // 版本已过期
          if (data.shopType !== 'pt' && data.shopStatus === 0) {
            showErrorMsg(0);
            return false;
          }
          let deadTime = new Date('2020-03-01 00:00:00').getTime(),// 过期时间
              baseTime = new Date('2019-09-01 00:00:00').getTime();// 挤出时间
          // 9月1之后注册且店铺版本为pt(未开通)
          if (data.shopType == 'pt' && data.user.createDate >= baseTime) {
            showErrorMsg(1);
            return false;
          }
          // 9月1之前注册保留半年使用期
          if (data.shopType == 'pt' && data.user.createDate < baseTime && deadTime <= new Date().getTime()) {
            showErrorMsg(0);
            return false;
          }
          // 设置TOKEN
          commit('SET_TOKEN', data.Authorization)
          auth.setToken( data.Authorization)
          // 设置工号
          commit('SET_JOBNUMBER', data.staff.jobNumber)
          auth.setJobNumber( data.staff.jobNumber)
          // 设置用户角色
          commit('SET_STAFFROLE', data.staff.staffRole)
          auth.setStaffRole(data.staff.staffRole)
          // 设置店铺名称
          commit('SET_SHOP', data.shopInfo.name)
          auth.setShop(data.shopInfo.name)
          // 设置店铺id
          commit('SET_SHOPID', data.shopInfo.id)
          auth.setShopId(data.shopInfo.id)
          // 设置店铺行业Id
          commit('SET_INDUSTRYID', data.shopInfo.industryId)
          auth.setIndustryId(data.shopInfo.industryId)
          // 设置店铺等级
          if (data.shopType == "marketing" && data.mallStatus == 1) {
            commit('SET_SHOPTYPE', "specialMarketing")
            auth.setShopType("specialMarketing")
          } else {
            commit('SET_SHOPTYPE', data.shopType)
            auth.setShopType(data.shopType)
          }
          // 设置店铺类型
          commit('SET_ROLEID', data.user.roleid)
          auth.setRoleId(data.user.roleid)
          // 设置用户名
          commit('SET_NAME', data.staff.name)
          auth.setName(data.staff.name)
          // 设置手机号
          commit('SET_TEL', data.staff.tel)
          auth.setTel(data.staff.tel)
          // 设置用户名
          commit('SET_CREATERID', data.staff.createrId)
          auth.setCreaterId(data.staff.createrId)
          // 设置员工ID
          commit('SET_STAFFID', data.staff.id)
          auth.setStaffId(data.staff.id)
          // 设置是否开启语音播放
          commit('SET_VOICETYPE', data.shopSet.voiceType)
          auth.setVoiceType(data.shopSet.voiceType)

          resolve(data.staff)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetUserInfo({ commit, state }) {
      let roles = [], role = "";
      if (state.jobNumber == 100000 && state.staffRole == 0) {
        roles = ["admin", state.shopType];
        role = "老板";
      } else if (state.jobNumber != 100000 && state.staffRole == 0) {
        roles = ["admin", state.shopType];
        role = "店长";
      } else {
        roles = ["staff"];
        role = "店员";
      }
      commit('SET_ROLES', roles);
      commit('SET_AVATAR', role);
      auth.setAvatar(role);
    },

    // 更新用户信息
    UpdateUserInfo({ commit }, userInfo) {
      commit('SET_NAME', userInfo.name)
      auth.setName(userInfo.name)
      commit('SET_TEL', userInfo.tel)
      auth.setTel(userInfo.tel)
    },

    // 更新店铺信息
    UpdateShopInfo({ commit }, shop) {
      commit('SET_SHOP', shop)
      auth.setShop(shop)
    },

    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       commit('SET_TOKEN', response.data.token)
    //       auth.setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        auth.removeToken()
        resolve()
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        auth.removeToken()
        resolve()
      })
    },

    // 动态修改权限
    ChangeRoles({ commit }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role)
        auth.setToken(role)
        getUserInfo(role).then(response => {
          const data = response.data
          commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          resolve()
        })
      })
    }
  }
}

export default user