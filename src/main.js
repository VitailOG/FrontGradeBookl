import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import vueDebounce from 'vue-debounce'
import axios from 'axios'
import baseUrl from './http/urls'

// axios.defaults.baseURL = 'http://192.168.0.104:8000'
axios.defaults.baseURL = baseUrl
Vue.config.productionTip = false

Vue.use(vueDebounce)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
