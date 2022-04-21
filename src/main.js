import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import Particles from "particles.vue3";

import purecore from "../../purecore-js";

const app = createApp(App)

app.config.globalProperties.purecore = new purecore(undefined, true)
app.config.globalProperties.context = {}

app.use(router)
  .use(vuetify)
  .use(Particles)
  .mount('#app')
