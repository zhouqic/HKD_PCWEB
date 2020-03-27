import Application from '@/views/application';

const _import = require('../_import_' + process.env.NODE_ENV);

export default [
    // 经营报表
    {
        path: '/operations',
        component: Application,
        redirect: 'main/operations/index',
        name: 'operations',
        meta: {
            roles: ['admin'],
            title: '经营报表',
            icon: 'jingyingfenxi'
        },
        children: [
            { path: 'index', component: _import('main/operations/index'), name: 'ocollect', meta: { title: '经营汇总' } },
            { path: 'osurvey_views', component: _import('main/operations/osurvey'), name: 'osurvey', meta: { title: '会员概况' } },
            { path: 'orecharge_views', component: _import('main/operations/orecharge'), name: 'orecharge', meta: { title: '会员充值' } },
            { path: 'oticket_views', component: _import('main/operations/oticket'), name: 'oticket', meta: { title: '核券报表' } },
            { path: 'oturnover_views', component: _import('main/operations/oturnover'), name: 'oturnover', meta: { title: '员工营业报表' } },
            { path: 'custom_views', component: _import('main/operations/ocustom'), name: 'datanalysis', meta: { title: '顾客报表' } }
        ]
    },
    // 人脸识别
    {
        path: '/faceRecognition',
        component: Application,
        redirect: 'main/faceRecognition/shopCustom_views',
        name: 'faceRecognition',
        meta: {
            roles: ['admin'],
            title: '人脸识别',
            icon: 'faceRecognition'
        },
        children: [
            { path: 'shopCustom_views', component: _import('main/faceRecognition/index'), name: 'shopCustom', meta: { title: '进店顾客' } },
            { path: 'shopCustomManage_views', component: _import('main/faceRecognition/customManage'), name: 'shopCustomManage', meta: { title: '人员管理' } },
            { path: 'captureRecords_views', component: _import('main/faceRecognition/captureRecords'), name: 'captureRecords', meta: { title: '抓拍记录' } }
        ]
    },
    // 核销管理
    {
        path: '/hxmanage',
        component: Application,
        redirect: 'main/operations/index',
        name: 'hxmanage',
        meta: {
            roles: ['admin'],
            title: '核销管理',
            icon: 'hxmanage'
        },
        children: [
            { path: 'fastVertical_views', component: _import('main/operations/ofastVertical'), name: 'fastVertical', meta: { title: '快速核销' } },
            { path: 'verticalRecords_views', component: _import('main/operations/ohxRecords'), name: 'verticalRecords', meta: { title: '核销记录' } }
        ]
    },
    // 订单管理 
    {
        path: '/ddmanage',
        component: Application,
        redirect: 'main/ddmanage/gathering_views',
        name: 'ddmanage',
        meta: {
            roles: ['admin', 'staff'],
            title: '订单管理',
            icon: 'dingdanmanage'
        },
        children: [
            { path: 'gathering_views', component: _import('main/ddmanage/gathering'), name: 'gathering', meta: { roles: ['admin', 'staff'], title: '收款明细' } },
            { path: 'reimburse_views', component: _import('main/ddmanage/reimburse'), name: 'reimburse', meta: { roles: ['admin', 'staff'], title: '退款明细' } },
            { path: 'runwater_views', component: _import('main/ddmanage/runwater'), name: 'runwater', meta: { roles: ['admin', 'staff'], title: '充值流水' } }
        ]
    },
    // 员工管理
    {
        path: '/ygmanage',
        component: Application,
        name: 'ygmanage',
        meta: {
            roles: ['admin']
        },
        children: [
            { path: 'ygmanage', component: _import('main/ygmanage/index'), name: 'ygmanage', meta: { roles: ['admin'], title: '员工管理', icon: 'yuangongguanli' }, noCache: true }
        ]
    },
    // 会员管理
    {
        path: '/vipmanage',
        component: Application,
        redirect: 'noredirect',
        name: 'vipmanage',
        meta: {
            roles: ['admin'],
            title: '会员管理',
            icon: 'huiyuanguanli'
        },
        children: [
            { path: 'viplist_view', component: _import('main/vipmanage/index'), name: 'viplist', meta: { roles: ['admin'], title: '会员列表' } },
            { path: 'groupSet_view', component: _import('main/vipmanage/groupSet'), name: 'groupSet', meta: { roles: ['admin'], title: '会员营销' } },
            { path: 'memberSettings_view', component: _import('main/vipmanage/memberSettings'), name: 'memberSettings', meta: { roles: ['admin'], title: '会员卡设置' } },
            { path: 'memberCard_view', component: _import('main/marketCenter/components/memberCard'), name: 'memberCard', meta: { roles: ['admin'], title: '会员卡创建' }, noMenu: true },
            { path: 'opencardGift_view', component: _import('main/marketCenter/components/opencardGift'), name: 'opencardGift', meta: { roles: ['admin'], title: '新人礼' }, noMenu: true },
            { path: 'pointsRule_view', component: _import('main/marketCenter/components/pointsRule'), name: 'pointsRule', meta: { roles: ['admin'], title: '积分规则' }, noMenu: true },
            { path: 'chongzhiFanli_view', component: _import('main/marketCenter/components/chongzhiFanli'), name: 'chongzhiFanli', meta: { roles: ['admin'], title: '充值返利' }, noMenu: true },
        ]
    },
    // 门店管理
    {
        path: '/mdmanage',
        component: Application,
        redirect: 'noredirect',
        name: 'mdmanage',
        meta: {
            roles: ['admin'],
            title: '门店管理',
            icon: 'shopManage'
        },
        children: [
            { path: 'clound_view', component: _import('main/shopmanage/index'), name: 'yunFitment', meta: { roles: ['admin'], title: '云店装修' } },
            { path: 'gatherCode_view', component: _import('main/shopmanage/gatherCode'), name: 'gatherCode', meta: { roles: ['admin'], title: '门店收款二维码' } },
            { path: 'vipCardCode_view', component: _import('main/shopmanage/vipCardCode'), name: 'vipCardCode', meta: { roles: ['admin'], title: '会员开卡二维码' } },
            { path: 'shopQRCode_view', component: _import('main/shopmanage/shopQRCode'), name: 'shopQRCode', meta: { roles: ['admin'], title: '云店二维码' } },
            { path: 'marketQRCode_view', component: _import('main/shopmanage/marketQRCode'), name: 'marketQRCode', meta: { roles: ['admin'], title: '商城二维码' } },
        ]
    },
    // 爆品引流
    {
        path: '/bpylManage',
        component: Application,
        redirect: 'noredirect',
        name: 'bpylManage',
        meta: {
            roles: ['admin'],
            title: '爆品引流',
            icon: 'bpyinliu'
        },
        children: [
            { path: 'mybp_view', component: _import('main/baopinyinliu/index'), name: 'myBaoPin', meta: { roles: ['admin'], title: '活动中心' } },
            { path: 'tuiGuang_view', component: _import('main/baopinyinliu/bptuiguang'), name: 'bpTuiGuang', meta: { roles: ['admin'], title: '爆品推广' } },
            { path: 'ylOrder_view', component: _import('main/baopinyinliu/ylorder'), name: 'ylOrder', meta: { roles: ['admin'], title: '引流订单' } },
            { path: 'jyFenXi_view', component: _import('main/baopinyinliu/jyfenxi'), name: 'jyFenXi', meta: { roles: ['admin'], title: '交易分析' } }
        ]
    },
    // 商家设置
    {
        path: '/sjSettings',
        component: Application,
        redirect: 'noredirect',
        name: 'sjSettings',
        meta: {
            roles: ['admin'],
            title: '商家设置',
            icon: 'settings'
        },
        children: [
            { path: 'myservices_view', component: _import('main/sjsettings/index'), name: 'myServices', meta: { roles: ['admin'], title: '我的服务商' } },
            { path: 'enterinfo_view', component: _import('main/sjsettings/sjenterinfo'), name: 'enterInfo', meta: { roles: ['admin'], title: '商家入驻信息' } },
            { path: 'user_view', component: _import('main/sjsettings/userset'), name: 'userSet', meta: { roles: ['admin'], title: '个人设置' } },
            { path: 'notice_view', component: _import('main/sjsettings/noticeset'), name: 'noticeSet', meta: { roles: ['admin'], title: '通知设置' } },
            { path: 'yhset_view', component: _import('main/sjsettings/yhset'), name: 'yhSet', meta: { roles: ['admin'], title: '优惠设置' } },
            { path: 'shelper_view', component: _import('main/sjsettings/shelper'), name: 'shHelper', meta: { roles: ['admin'], title: '绑定商户助手' } }
        ]
    }
]