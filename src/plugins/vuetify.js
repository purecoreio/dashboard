import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

const vuetify = new Vuetify({
    theme: {
        dark: false,
        themes: {
            /*
            light: {
                primary: '#ff8a65',
                secondary: '#b0bec5',
                accent: '#8c9eff',
                error: '#b71c1c',
            },

            dark: {
                primary: '#ff8a65',
                secondary: '#b0bec5',
                accent: '#8c9eff',
                error: '#b71c1c',
            }*/
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
})

export default vuetify;