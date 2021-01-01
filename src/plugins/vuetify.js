import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    dark: true,
    themes: {
      light: {
        primary: '#448aff',
        secondary: '#448aff',
        accent: '#83b9ff',
        error: '#ff8a65',
      },
      dark: {
        primary: '#82b1ff',
        secondary: '#82b1ff',
        accent: '#b6e3ff',
        error: '#ff8a65',
      }
    },
  },
});
