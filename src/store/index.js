import Vue from 'vue'
import Vuex from 'vuex'
import purecore from 'purecore';

let session = new purecore(null);
let network = null;
if (localStorage.getItem("session")) {
  session = new purecore(JSON.parse(localStorage.getItem("session")), process.env.NODE_ENV !== 'production');
}
if (localStorage.getItem("network")) {
  network = session.getInstance(localStorage.getItem("network"), null, "NTW").asNetwork();
}

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    session: session,
    network: network
  },
  mutations: {
    session(state, session) {
      state.session = session
    },
    network(state, network) {
      state.network = network
    }
  },
  actions: {
  },
  modules: {
  },
  getters: {
    session: state => state.session,
    network: state => state.network
  }
})
