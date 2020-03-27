import Application from '@/views/application';

const _import = require('../_import_' + process.env.NODE_ENV);

const constantRouterMap = [
  { path: '/login', component: _import('login'), hidden: true, noMenu: true },
  { path: '/reset_pwd', component: _import('common/resetPwd/index'), hidden: true, noMenu: true },
  { path: '/404', component: _import('common/404'), hidden: true, noMenu: true },
  { path: '/401', component: _import('common/401'), hidden: true, noMenu: true },
  {
    path: '/redirect',
    component: Application,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: _import('common/redirect/index')
      }
    ]
  },
  {
    path: '',
    component: Application,
    redirect: 'dashboard',
    meta: {
      roles: ['admin']
    },
    children: [{
      path: 'dashboard',
      component: _import('main/dashboard/index'),
      name: 'dashboard',
      meta: { 
        roles: ['admin'],
        title: '主页', 
        icon: 'dashboard', 
        affix: true,
        noCache: true
      }
    }]
  }
]

export default constantRouterMap