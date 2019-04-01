import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import 'vuetify/dist/vuetify.min.css'
import Web3 from 'web3'
import Chain3 from 'chain3'
import VueClipboard from 'vue-clipboard2'
// import VConsole from 'vconsole'
// let vConsole = new VConsole();

Vue.use(VueClipboard)
Vue.config.productionTip = false

if (process.env.VUE_APP_NETWORK === 'MOAC') {
  window.chain3 = new Chain3(new Chain3.providers.HttpProvider(process.env.VUE_APP_SALON_VNODE_MOAC));
  console.log(chain3.isConnected());
} else {
  window.web3 = new Web3(new Web3.providers.HttpProvider(process.env.VUE_APP_SALON_VNODE));
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')