import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './plugins/element.js'

// 导入样式表
import "./assets/css/global.css"

// 导入图标字体
import './assets/icon/login/font_zc12yx0lp3c/iconfont.css'
import './assets/icon/home/font_yorv358nwhl/iconfont.css'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
