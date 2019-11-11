import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import App from './App'
import store from './store'
import router from './router'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import '@/icons' // icon
import '@/permission' // permission control

import vuescroll from 'vue-scroll'

import numFormat from 'vue-filter-number-format'

import Clipboard from 'v-clipboard'

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })

Vue.use(vuescroll, { debounce: 600 })

Vue.use(require('vue-moment'))

Vue.use(Clipboard)

Vue.filter('numFormat', numFormat)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
