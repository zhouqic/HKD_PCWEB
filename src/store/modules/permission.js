import constantRouterMap from '@/router/moudles/constantRoute'
import asyncRouterMap from '@/router/moudles/asyncRoute'
import { getRfOpenFuncById } from '@/api/login'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.indexOf(role) >= 0)
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(asyncRouterMap, roles) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasPermission(roles, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, roles)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

/**
 * 智慧门店版开通所有功能
 */
function handlerJZRouter(routes) {
  return routes.map(item => {
    if (item.path != "*") {
      if (item.hasOwnProperty("hidden")) item.hidden = false;
      if (item.hasOwnProperty("children")) item.children = handlerJZRouter(item.children)
    }
    return item;
  })
}


const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: [],
    showMoreYuanGong: true,
    showManJian: true,
    showCiKa: true,
    showShangMeng: true,
    showFuLiShe: true,
    showHUIYUANDABAO: true,
    showYingXiao: true,
  },
  mutations: {
    SET_ROUTERS: (state, obj) => {
      state.addRouters = obj.accessedRouters
      if (obj.roles.indexOf('admin') >= 0) {
        state.routers = constantRouterMap.concat(obj.accessedRouters)
      } else {
        state.routers = obj.accessedRouters
      }
    },
    SET_MANJIAN: (state, data) => {
      state.showManJian = data;
    },
    SET_CIKA: (state, data) => {
      state.showCiKa = data;
    },
    SET_SHANGMENG: (state, data) => {
      state.showShangMeng = data;
    },
    SET_VIPYINGXIAO: (state, data) => {
      state.showYingXiao = data;
    },
    SET_FULISHE: (state, data) => {
      state.showFuLiShe = data;
    },
    SET_HYDABAO: (state, data) => {
      state.showHUIYUANDABAO = data;
    },
    SET_MOREYUANGONG: (state, data) => {
      state.showMoreYuanGong = data;
    }
  },
  actions: {
    GenerateRoutes({ commit, state }, data) {
      return new Promise(resolve => {
        const { roles } = data;
        let routes = asyncRouterMap;
        // 处理云商版及9月1之前未过期版本单独开通功能
        if (roles.indexOf("pt") >= 0 || roles.indexOf("commerce") >= 0 || roles.indexOf("commerceFood") >= 0) {
          getRfOpenFuncById({ funcTypeI: 1 }).then(res => {
            let data = res.businessData.rfOpenFunc;
            // 人脸识别
            if (Number(data.faceRecordEndTime) < new Date().getTime()) {
              routes = routes.map(item => {
                if (item.name === "faceRecognition") {
                  item.hidden = true;
                }
                return item;
              })
            }
            // 收银员管理限制
            if (Number(data.cashierManageEndTime) < new Date().getTime()) {
              commit("SET_MOREYUANGONG", false);
            }
            // 满减优惠
            if (Number(data.fullReduceEndTime) < new Date().getTime()) {
              commit("SET_MANJIAN", false);
            }
            // 付费次卡
            if (Number(data.numberCardEndTime) < new Date().getTime()) {
              commit("SET_CIKA", false);
            }
            // 智慧商盟
            if (Number(data.businessAllianceEndTime) < new Date().getTime()) {
              commit("SET_SHANGMENG", false);
            }
            // 会员打包功能
            if (Number(data.memberPackEndTime) < new Date().getTime()) {
              commit("SET_HYDABAO", false);
              routes = routes.map(item => {
                // 会员充值、会员概况
                if (!item.noMenu && item.name === "operations") {
                  item.children = item.children.map(child => {
                    if (child.name === "orecharge" || child.name === "osurvey") {
                      child.hidden = true;
                    }
                    return child;
                  })
                // 充值流水
                } else if (!item.noMenu && item.name === "ddmanage") {
                  item.children = item.children.map(child => {
                    if (child.name === "runwater") {
                      child.hidden = true;
                    }
                    return child;
                  })
                // 会员卡设置
                } else if (!item.noMenu && item.name === "vipmanage") {
                  item.children = item.children.map(child => {
                    if (child.name === "memberSettings") {
                      child.hidden = true;
                    }
                    return child;
                  })
                // 门店开卡二维码
                } else if (!item.noMenu && item.name === "mdmanage") {
                  item.children = item.children.map(child => {
                    if (child.name === "vipCardCode") {
                      child.hidden = true;
                    }
                    return child;
                  })
                }
                return item;
              })
            }
            // 会员营销发券
            if (Number(data.memberGiftCardEndTime) < new Date().getTime()) {
              commit("SET_VIPYINGXIAO", false);
              routes = routes.map(item => {
                if (!item.noMenu && item.name === "vipmanage") {
                  item.children = item.children.map(child => {
                    if (child.name === "groupSet") {
                      child.hidden = true;
                    }
                    return child;
                  })
                }
                return item;
              })
            }
            // 会员福利社
            if (Number(data.memberBenefitsEndTime) < new Date().getTime()) {
              commit("SET_FULISHE", false);
              routes = routes.map(item => {
                if (!item.noMenu && item.name === "marketCenter") {
                  item.children = item.children.map(child => {
                    if (child.name === "membershipClub") {
                      child.hidden = true;
                    }
                    return child;
                  })
                }
                return item;
              })
            }
            // 商城组合功能
            if (Number(data.mallEndTime) < new Date().getTime()) {
              routes = routes.map(item => {
                // 商城二维码
                if (!item.noMenu && item.name === "mdmanage") {
                  item.children = item.children.map(child => {
                    if (child.name === "marketQRCode") {
                      child.hidden = true;
                    }
                    return child;
                  })
                } else if (!item.noMenu && (item.name === "marketSettings" || item.name === "marketCommodity" || item.name === "marketManage")) {
                  item.hidden = true;
                  item.children = item.children.map(child => {
                    if (child.name != "kanjiaOrder") {
                      child.hidden = true;
                    }
                    return child;
                  })
                }
                return item;
              })
            }
            // 砍价
            if (Number(data.cutPriceEndTime) < new Date().getTime()) {
              routes = routes.map(item => {
                if (!item.noMenu && item.name === "marketManage") {
                  item.children = item.children.map(child => {
                    if (child && child.name === "kanjiaOrder" || child.name === "kanjiaManage") {
                      child.hidden = true;
                      item.hidden = true;
                    }
                    return child;
                  })
                }
                return item;
              })
            }
            let accessedRouters = filterAsyncRouter(routes, roles);
            commit('SET_ROUTERS', { accessedRouters: accessedRouters, roles: roles })
            resolve()
          });
        } 
        // 处理智能营销版版本单独开通功能
        if (roles.indexOf("marketing") >= 0) {
          getRfOpenFuncById({ funcTypeI: 1 }).then(res => {
            let data = res.businessData.rfOpenFunc;
            // 人脸识别
            if (Number(data.faceRecordEndTime) < new Date().getTime()) {
              routes = routes.map(item => {
                if (item.name === "faceRecognition") {
                  item.hidden = true;
                }
                return item;
              })
            }
            // 会员福利社
            if (Number(data.memberBenefitsEndTime) < new Date().getTime()) {
              commit("SET_FULISHE", false);
              routes = routes.map(item => {
                if (item.name === "marketCenter") {
                  item.children = item.children.map(child => {
                    if (child.name === "membershipClub") {
                      child.hidden = true;
                    }
                    return child;
                  })
                }
                return item;
              })
            }
            // 砍价
            if (Number(data.cutPriceEndTime) < new Date().getTime()) {
              routes = routes.map(item => {
                if (item.name === "marketManage") {
                  item.children = item.children.map(child => {
                    if (child.name === "kanjiaOrder" || child.name === "kanjiaManage") {
                      child.hidden = true;
                      item.hidden = true;
                    }
                    return child;
                  })
                }
                return item;
              })
            }
            let accessedRouters = filterAsyncRouter(routes, roles);
            commit('SET_ROUTERS', { accessedRouters: accessedRouters, roles: roles })
            resolve()
          })
        } else {
          getRfOpenFuncById({ funcTypeI: 1 }).then(res => {
            let data = res.businessData.rfOpenFunc;
            // 人脸识别
            if (Number(data.faceRecordEndTime) < new Date().getTime()) {
              routes = routes.map(item => {
                if (item.name === "faceRecognition") {
                  item.hidden = true;
                }
                return item;
              })
            }
            let accessedRouters = filterAsyncRouter(routes, roles);
            commit('SET_ROUTERS', { accessedRouters: accessedRouters, roles: roles })
            resolve()
          })
        }
      })
    }
  }
}

export default permission