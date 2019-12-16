import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    mode: 1,
    noise: 1,
    timeStep: 5,
    stats: { stats: [], timeStats: [] }
  },
  mutations: {
    setMode(state, mode) {
      state.mode = mode;
    },

    setNoise(state, noise) {
      state.noise = noise;
    },

    setTimeStep(state, step) {
      state.timeStep = step;
    },

    setStats(state, stats) {
      state.stats = stats;
    }
  },
  actions: {},
  modules: {}
});
