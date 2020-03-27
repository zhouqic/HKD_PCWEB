import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import ConstantRoute from './moudles/constantRoute';

/** note: submenu only apppear when children.length>=1
*   detail see  https://panjiachen.github.io/vue-element-admin-site/#/router-and-nav?id=sidebar
**/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* noMenu: false,                 if false, the tag will be a menu in the sidebar(default is false)
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']    will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if fasle ,the page will no be cached(default is false)
    affix: true                  if true, the tag will affix in the tags-view
  },
  key: ''                        the key is used as a sign to distinguish industry permissions
**/


export default new Router({
  // base: '/portal/',
  // mode :"history", //除去#号
  scrollBehavior: () => ({ y: 0 }),
  routes: ConstantRoute
})