// 启用插件 babel-plugin-transform-runtime 后，Babel 就会使用 babel-runtime 下的工具函数
import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Element from 'element-ui'
import store from './store'
import base from './base'
import directive from './common/js/directive'
import './common/style/index.scss'
import './common/font/iconfont.css'

Vue.use(Element)
Vue.use(base)
Vue.use(directive)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
