import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import vueDebounce from 'vue-debounce'
import axios from 'axios'


axios.defaults.baseURL = 'http://192.168.0.101:8000'
Vue.config.productionTip = false

Vue.use(vueDebounce)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
