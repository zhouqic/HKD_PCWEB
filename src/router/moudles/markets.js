import Application from '@/views/application';

const _import = require('../_import_' + process.env.NODE_ENV);

const key = 1;

export default [
  // 营销中心
  {
    path: '/marketCenter',
    component: Application,
    redirect: 'noredirect',
    name: 'marketCenter',
    meta: {
      roles: ['admin'],
      title: '营销中心',
      icon: "marketCenter"
    },
    children: [
      { path: 'cardManage_view', component: _import('main/marketCenter/components/cardManage'), name: 'cardManage', meta: { roles: ['admin'], title: '券管理' }},
      { path: 'smartPay_view', component: _import('main/marketCenter/index'), name: 'smartPay', meta: { roles: ['admin'], title: '智能支付' }},
      { path: 'sharebox_view', component: _import('main/marketCenter/components/sharebox'), name: 'sharebox', meta: { roles: ['admin'], title: '分享红包' },noMenu: true},
      { path: 'fullcut_view', component: _import('main/marketCenter/components/fullcut'), name: 'fullcut', meta: { roles: ['admin'], title: '满减优惠' }, noMenu: true},
      { path: 'paymentCard_view', component: _import('main/marketCenter/components/paymentCard'), name: 'paymentCard', meta: { roles: ['admin'], title: '付费次卡' }, noMenu: true},
      { path: 'businessCircle_view', component: _import('main/marketCenter/businessCircle'), name: 'businessCircle', meta: { roles: ['admin'], title: '智慧商圈' }},
      { path: 'shangMeng_view', component: _import('main/marketCenter/components/shangMeng'), name: 'shangMeng', meta: { roles: ['admin'], title: '智慧商盟' }, noMenu: true},
      { path: 'redpacketSquare_view', component: _import('main/marketCenter/components/redpacketSquare'), name: 'redpacketSquare', meta: { roles: ['admin'], title: '红包广场' }, noMenu: true},
      { path: 'membershipClub_view', component: _import('main/marketCenter/membershipClub'), name: 'membershipClub', meta: { roles: ['admin',], title: '会员福利社' }},
      { path: 'memberGrade_view', component: _import('main/marketCenter/components/memberGrade'), name: 'memberGrade', meta: { roles: ['admin'], title: '会员等级' }, noMenu: true},
      { path: 'memberEquity_view', component: _import('main/marketCenter/components/memberGrade'), name: 'memberEquity', meta: { roles: ['admin'], title: '会员权益' }, noMenu: true},
      { path: 'memberSign_view', component: _import('main/marketCenter/components/pointsRule'), name: 'memberSign', meta: { roles: ['admin'], title: '签到设置' }, noMenu: true},
      { path: 'pointsDraw_view', component: _import('main/marketCenter/components/pointsDraw'), name: 'pointsDraw', meta: { roles: ['admin'], title: '积分抽奖' }, noMenu: true},
      { path: 'pointsInfo_view', component: _import('main/marketCenter/components/pointsInfo'), name: 'pointsInfo', meta: { roles: ['admin'], title: '积分商品' }, noMenu: true},
      { path: 'specialTicket_view', component: _import('main/marketCenter/components/specialTicket'), name: 'specialTicket', meta: { roles: ['admin'], title: '每月返券' }, noMenu: true},
      { path: 'memberGift_view', component: _import('main/marketCenter/components/memberGift'), name: 'memberGift', meta: { roles: ['admin'], title: '会员大礼包' }, noMenu: true},
    ]
  },
  // 餐饮服务
  {
    path: '/service',
    component: Application,
    redirect: 'noredirect',
    name: 'service',
    key: key,
    meta: {
      roles: ['commerceFood', 'specialMarketing', 'jz'],
      title: '餐饮服务',
      icon: "foodService"
    },
    children: [
      { path: 'tableManage_view', component: _import('main/services/food/tableManage'), name: 'tableManage', meta: { roles: ['commerceFood', 'specialMarketing', 'jz'], title: '餐桌管理' }},
      { path: 'selfHelpCode_view', component: _import('main/services/food/selfHelpCode'), name: 'selfHelpCode', meta: { roles: ['commerceFood', 'specialMarketing', 'jz'], title: '自助点餐二维码' }}
    ]
  },
  // 商城首页设置
  {
    path: '/marketSettings',
    component: Application,
    redirect: 'noredirect',
    name: 'marketSettings',
    meta: {
      roles: ['admin']
    },
    children: [
      { path: 'slideManage_view', component: _import('main/marketSettings/slideManage'), name: 'slideManage', meta: { roles: ['admin'], title: '商城轮播图设置', icon: 'marketHome' }}
    ]
  },
  // 商城快递设置
  {
    path: '/marketSettings',
    component: Application,
    redirect: 'noredirect',
    name: 'marketSettings',
    meta: {
      roles: ['admin']
    },
    children: [
      { path: 'expressSet_view', component: _import('main/marketSettings/expressSet'), name: 'expressSet', meta: { roles: ['admin'], title: '商城快递运费设置', icon: 'marketExpress' }}
    ]
  },
  // 商城商品设置
  {
    path: '/marketManage',
    component: Application,
    redirect: 'noredirect',
    name: 'marketCommodity',
    meta: {
      roles: ['admin'],
      title: '商城商品管理',
      icon: 'marketCommodity' 
    },
    children: [
      { path: 'flManage_view', component: _import('main/marketManage/flManage'), name: 'flManage', meta: { roles: ['admin'], title: '分类管理'}},
      { path: 'ggManage_view', component: _import('main/marketManage/ggManage'), name: 'ggManage', meta: { roles: ['admin'], title: '规格管理'}},
      { path: 'goodManage_view', component: _import('main/marketManage/goodManage'), name: 'goods', meta: { roles: ['admin'], title: '商品管理'}},
      { path: 'goodSet_view', component: _import('main/marketManage/components/addGoods'), name: 'goodSet', meta: { roles: ['admin'], title: '商品信息设置'}, noMenu: true},
    ]
  },
  // 商城订单设置
  {
    path: '/marketManage',
    component: Application,
    redirect: 'noredirect',
    name: 'marketManage',
    meta: {
      roles: ['admin'],
      title: '商城订单管理',
      icon: 'marketOrder' 
    },
    children: [
      { path: 'pickOrder_view', component: _import('main/marketManage/orderManage/pickOrder'), name: 'pickOrder', meta: { roles: ['admin'], title: '自提订单'}},
      { path: 'expressOrder_view', component: _import('main/marketManage/orderManage/expressOrder'), name: 'expressOrder', meta: { roles: ['admin'], title: '快递订单'}},
      { path: 'dispatchOrder_view', component: _import('main/marketManage/orderManage/dispatchOrder'), name: 'dispatchOrder', meta: { roles: ['admin'], title: '配送订单'}},
    ]
  },
  // 商城活动设置
  {
    path: '/marketManage',
    component: Application,
    redirect: 'noredirect',
    name: 'marketManage',
    meta: {
      roles: ['admin']
    },
    children: [
      { path: 'kanjiaManage_view', component: _import('main/marketManage/kanjiaManage'), name: 'kanjiaManage', meta: { roles: ['admin'], title: '商城砍价活动管理', icon: 'marketActivity'}}
    ]
  },
  // 商城砍价订单
  {
    path: '/marketManage',
    component: Application,
    redirect: 'noredirect',
    name: 'marketManage',
    meta: {
      roles: ['admin']
    },
    children: [
      { path: 'kanjiaOrder_view', component: _import('main/marketManage/kanjiaOrder'), name: 'kanjiaOrder', meta: { roles: ['admin'], title: '商城砍价订单', icon: 'marketBargain'}}
    ]
  }
]
