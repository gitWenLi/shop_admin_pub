import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'

Vue.config.productionTip = false

Vue.prototype.$axios = axios

axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

// 请求劫持
axios.interceptors.request.use(function (config) {
  // console.log(config)
  if (config.url !== 'login') {
    config.headers.Authorization = localStorage.getItem('token')
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

// 响应劫持
axios.interceptors.response.use(function (response) {
  return response.data
}, function (error) {
  return Promise.reject(error)
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
