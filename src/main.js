import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import GAuth from 'vue-google-oauth2'
import VueGtag from "vue-gtag";
import VueCodemirror from 'vue-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/base16-dark.css'

import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/xml/xml'
import 'codemirror/mode/css/css'

Vue.use(VueCodemirror, {
  options: {
    theme: 'base16-dark',
    tabSize: 5,
    styleActiveLine: true,
    lineNumbers: true,
    line: true,
  }
})


const gauthOption = {
  clientId: '593217935798-1h8jef218evbleu7i5su8ctds6urp12f.apps.googleusercontent.com',
  scope: 'profile email openid',
  prompt: 'select_account'
}

Vue.use(GAuth, gauthOption)

Vue.use(VueGtag, {
  config: { id: "G-VJ3VLD1HH2" }
});

Vue.config.productionTip = false
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')


