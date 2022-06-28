import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import VueSmoothScroll from 'v-smooth-scroll'
import VueGtag from "vue-gtag";

import purecore from "purecore";

const app = createApp(App)

const mode = import.meta.env.MODE
app.config.globalProperties.purecore = new purecore(undefined, mode == 'lldev')
app.config.globalProperties.context = {}

app.use(router)
  .use(vuetify)
  .use(VueSmoothScroll, {
    duration: 200,
    offset: -74,
    updateHistory: false,
    easingFunction: t => t * (2 - t),
  })

if (!String(mode).includes("dev")) {
  app.use(VueGtag, {
    config: {
      id: "G-VJ3VLD1HH2",
      params: {
        anonymize_ip: true
      }
    }
  }, router)
} else {
  console.log("analytics disabled on dev mode")
}
app.mount('#app')
