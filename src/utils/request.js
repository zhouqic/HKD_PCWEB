import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import md5 from 'js-md5';

// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  contentType: "application/json",
  timeout: 30000 // request timeout
})

// request interceptor
service.interceptors.request.use(config => {
  let timestamp = new Date().getTime();
  // 让每个请求携带签名-- ['sign']
  if (store.getters.APP_SCRECT && store.getters.APP_KEY) {
    let str = store.getters.APP_SCRECT + 'appKey' + store.getters.APP_KEY + 'body' + (config.data ? JSON.stringify(config.data) : '') + 'platformPC' + 'timestamp' + timestamp + store.getters.APP_SCRECT;
    config.headers['sign'] = md5(str).toUpperCase();
    config.headers['appKey'] = store.getters.APP_KEY;
  }
  if (store.getters.token) {
    config.headers['Authorization'] = store.getters.token;
  }
  config.headers['Accept'] =  "application/json; charset=utf-8";
  config.headers['timestamp'] = timestamp;
  config.headers['platform'] = "PC";
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(
  response => {
    //response,
  /**
  * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
  * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
  */
    const res = response.data;
    if (res.code == 1) {
      if (res.data.success) {
        return res.data;
      } else {
        Message({
          message: res.data.msg,
          type: 'error',
          duration: 3 * 1000
        });
        return Promise.reject('error');
      }
    } else {
      Message({
        message: res.msg,
        type: 'error',
        duration: 3 * 1000
      });
      return Promise.reject('error');
    }
  },
  error => {
    console.log('err' + error)// for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 3 * 1000
    })
    return Promise.reject(error)
  })

export default service