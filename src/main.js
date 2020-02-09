import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import GAuth from 'vue-google-oauth2'
import VueGtag from "vue-gtag";

Vue.config.productionTip = false
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

const gauthOption = {
  clientId: '593217935798-1h8jef218evbleu7i5su8ctds6urp12f.apps.googleusercontent.com',
  scope: 'profile email openid',
  prompt: 'select_account'
}

Vue.use(GAuth, gauthOption)

Vue.use(VueGtag, {
  config: { id: "G-VJ3VLD1HH2" }
});


