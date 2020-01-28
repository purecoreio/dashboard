import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

const vuetify = new Vuetify({
    theme: {
        dark: false,
        themes: {
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
            }
        },
    },
})

export default vuetify;