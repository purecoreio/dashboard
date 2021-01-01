import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import i18n from './i18n'
//import store from './store'
import StatusIndicator from 'vue-status-indicator';
import VueClipboard from 'vue-clipboard2'
import VueApexCharts from 'vue-apexcharts'
import SubNav from './components/SubNav'
import secure from './components/Secure'
import purecore from 'purecore'

let forceLive = true;
Vue.prototype.$stripeKey = process.env.NODE_ENV !== 'production' && !forceLive ? 'pk_test_6yVRLazy6P5ywQLIwoGZ1JJq00J5zfs2CE' : 'pk_live_EApGv1EQo2QX4zp4E543Na5Q00JGPBZESa';
Vue.prototype.$purecore = new purecore();
Vue.prototype.$loginManager = new purecore().getLoginManager(true);

if (localStorage.getItem(btoa("purecore-n")) != null) {
  try {
    Vue.prototype.$purecore.getContext().setNetwork(localStorage.getItem(btoa("purecore-n")))
  } catch (error) {
    localStorage.removeItem(btoa("purecore-n"));
  }
}

Vue.component('secure', secure);

Vue.component('SubNav', SubNav);

import Plus from './components/Plus'
Vue.component('plus', Plus);


import Beta from './components/Beta'
Vue.component('beta', Beta);

import PlusTrial from './components/PlusTrial'
Vue.component('trial', PlusTrial);

Vue.component('apexchart', VueApexCharts);
Vue.use(StatusIndicator);
Vue.use(VueClipboard)
Vue.prototype.$chartBarOptions = {
  tooltip: {
    theme: vuetify.framework.theme.dark ? 'dark' : 'light'
  },
  legend: {
    show: true,
    showForZeroSeries: false,
    position: 'top',
    horizontalAlign: 'left',
    floating: true,
    labels: {
      useSeriesColors: true
    },
    offsetX: -13,
    offsetY: 80,
  },
  chart: {
    type: 'bar',
    stacked: true,
    zoom: {
      enabled: false
    },
    animations: {
      enabled: false
    },
    toolbar: {
      show: false,
    },
    sparkline: {
      enabled: true,
    },
  },
  plotOptions: {
    bar: {
      columnWidth: '50%',
      distributed: false
    }
  },
  xaxis: {
    type: 'datetime',
  },
  yaxis: {
    min: 0,
  }
}
Vue.prototype.$chartOptions = {
  tooltip: {
    theme: vuetify.framework.theme.dark ? 'dark' : 'light'
  },
  legend: {
    show: true,
    showForZeroSeries: false,
    position: 'top',
    horizontalAlign: 'left',
    floating: true,
    labels: {
      useSeriesColors: true
    },
    offsetX: -13,
    offsetY: 80,
  },
  chart: {
    type: 'line',
    zoom: {
      enabled: false
    },
    animations: {
      enabled: false
    },
    toolbar: {
      show: false,
    },
    sparkline: {
      enabled: true,
    }
  },
  stroke: {
    width: 5,
    curve: 'straight'
  },
  xaxis: {
    type: 'datetime',
  },
  yaxis: {
    min: 0,
  }
}

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  i18n,
  // store,
  render: h => h(App)
}).$mount('#app')
