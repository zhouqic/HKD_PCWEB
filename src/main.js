//兼容IE Promise
import 'babel-polyfill'

import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import './assets/icons' // icon
import './errorLog'// error log
import './permission' // permission control
// import './mock' // simulation data

import * as filters from './filters' // global filters

Vue.use(Element, {
  size: 'small' // set element-ui default size
})

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// 全局方法验证文件上传
import checkFile from "@/utils/mixins";
Vue.prototype.$checkFile = checkFile;

// 事件总线
import VueBus from 'vue-bus';
Vue.use(VueBus);

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
