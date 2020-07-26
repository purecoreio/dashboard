import Vue from 'vue'
import Vuex from 'vuex'
import core from 'purecore'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    core: new core(),
    drawer: null
  },
  mutations: {
    core(state, core) {
      state.core = core
    },
  },
  actions: {
  },
  modules: {
  },
  getters: {
    core: state => state.core,
  }
})
