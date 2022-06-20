import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import Particles from "particles.vue3";
import VueSmoothScroll from 'v-smooth-scroll'

// https://docs.npmjs.com/cli/v8/commands/npm-link this may be useful so we can have a similar setup to main
import purecore from "../../purecore-js";

const app = createApp(App)

app.config.globalProperties.purecore = new purecore(undefined, true)
app.config.globalProperties.context = {}

app.use(router)
  .use(vuetify)
  .use(VueSmoothScroll, {
    duration: 200,
    offset: -74,
    updateHistory: false,
    easingFunction: t => t * (2 - t),
  })
  .use(Particles)
  .mount('#app')
