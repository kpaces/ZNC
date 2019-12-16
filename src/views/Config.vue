<template>
  <div class="config">
    <Cover>
      <h2>Config</h2>

      <h3>When the meter hits red</h3>
      <p>
        Select what ZND should do when the meter hits red (for more than 1.5
        seconds)
      </p>
      <div class="columns">
        <div class="column">
          <nav class="panel box">
            <div class="panel-block">Do nothing</div>
            <div class="panel-block">
              <b-button
                :disabled="mode === 0"
                @click="changeMode(0)"
                :type="mode === 0 ? 'is-success' : ''"
                rounded
              >{{ mode === 0 ? "SELECTED" : "SELECT" }}</b-button>
            </div>
          </nav>
        </div>

        <div class="column">
          <nav class="panel box">
            <div class="panel-block">Pause timer</div>
            <div class="panel-block">
              <b-button
                :disabled="mode === 1"
                @click="changeMode(1)"
                :type="mode === 1 ? 'is-success' : ''"
                rounded
              >{{ mode === 1 ? "SELECTED" : "SELECT" }}</b-button>
            </div>
          </nav>
        </div>

        <div class="column">
          <nav class="panel box">
            <div class="panel-block">Increase time in</div>
            <div class="panel-block">
              <input
                title="seconds (1 - 60)"
                min="5"
                max="60"
                maxlength="2"
                type="tel"
                class="input"
                v-model="step"
                @blur="fixStep"
              />
            </div>
            <div class="panel-block">
              <b-button
                :disabled="mode === 2"
                @click="changeMode(2)"
                :type="mode === 2 ? 'is-success' : ''"
                rounded
              >{{ mode === 2 ? "SELECTED" : "SELECT" }}</b-button>
            </div>
          </nav>
        </div>

        <div class="column">
          <nav class="panel box">
            <div class="panel-block">Decrease time in</div>
            <div class="panel-block">
              <input
                title="seconds (1 - 60)"
                min="5"
                max="60"
                maxlength="2"
                type="tel"
                class="input"
                v-model="step"
                @blur="fixStep"
              />
            </div>
            <div class="panel-block">
              <b-button
                :disabled="mode === 3"
                @click="changeMode(3)"
                :type="mode === 3 ? 'is-success' : ''"
                rounded
              >{{ mode === 3 ? "SELECTED" : "SELECT" }}</b-button>
            </div>
          </nav>
        </div>
      </div>

      <h3>Noise filter</h3>
      <p>
        The noise filter discards short noises, like a dropped pencil, and makes
        the meter more stable
      </p>
      <div class="columns">
        <div class="column">
          <nav class="panel box">
            <div class="panel-block">Low</div>
            <div class="panel-block">
              <b-button
                :disabled="noise === 0"
                @click="changeNoise(0)"
                :type="noise === 0 ? 'is-success' : ''"
                rounded
              >{{ noise === 0 ? "SELECTED" : "SELECT" }}</b-button>
            </div>
          </nav>
        </div>

        <div class="column">
          <nav class="panel box">
            <div class="panel-block">Medium</div>
            <div class="panel-block">
              <b-button
                :disabled="noise === 1"
                @click="changeNoise(1)"
                :type="noise === 1 ? 'is-success' : ''"
                rounded
              >{{ noise === 1 ? "SELECTED" : "SELECT" }}</b-button>
            </div>
          </nav>
        </div>

        <div class="column">
          <nav class="panel box">
            <div class="panel-block">High</div>
            <div class="panel-block">
              <b-button
                :disabled="noise === 2"
                @click="changeNoise(2)"
                :type="noise === 2 ? 'is-success' : ''"
                rounded
              >{{ noise === 2 ? "SELECTED" : "SELECT" }}</b-button>
            </div>
          </nav>
        </div>
      </div>

      <h3>Final stats</h3>
      <p>Coming soon</p>
      <h3>Sounds</h3>
      <p>Coming soon</p>
    </Cover>
  </div>
</template>

<script>
import Cover from "@/components/Cover.vue";
import { mapState } from "vuex";

export default {
  name: "config",
  components: {
    Cover
  },

  data() {
    return {
      step: 5
    };
  },

  computed: mapState({
    mode: "mode",
    noise: "noise",
    timeStep: "timeStep"
  }),

  watch: {
    step: function(val) {
      let v = parseInt(val, 10);
      if (isNaN(v)) {
        v = 5;
      }

      if (val.length > 0) {
        this.step = Math.max(1, Math.min(60, v));
        localStorage.setItem("ZNC-timeStep", this.step.toString());
        this.$store.commit("setTimeStep", v);
      }
    }
  },

  mounted() {
    this.step = this.timeStep;
  },

  methods: {
    fixStep() {
      this.step = Math.max(1, Math.min(60, this.step));
    },

    changeMode(mode) {
      this.$store.commit("setMode", mode);
      localStorage.setItem("ZNC-mode", mode.toString());
    },

    changeNoise(noise) {
      this.$store.commit("setNoise", noise);
      localStorage.setItem("ZNC-noiseFilter", noise.toString());
    }
  }
};
</script>

<style lang="stylus">
.config .columns
  margin-top 0.5em !important
  flex-wrap wrap
  align-items stretch

.panel-block
  justify-content center !important

.box
  background-color rgba(255, 255, 255, 0.75)
  border 0 !important
  box-shadow none !important
  border-radius 9px
  height 100%
  padding 0.75em

nav.disabled
  opacity 0.5

nav.disabled *
  pointer-events none !important

.panel
.panel-heading
.panel-block
  border 0 !important

.button[disabled]
  opacity 0.9 !important
  transition all 0.15s ease-in-out !important
  cursor default !important

.input
  font-family 'Share Tech Mono'
  letter-spacing -0.1em
  display block
  font-size 4vmin
  line-height 0vmin
  text-align center
  border 1px solid #dbdbdb !important
  padding 0.6vmin 1vmin 0.4vmin 0.8vmin
  width 6vmin !important
  height 6vmin !important
  border-radius 50%
  background rgba(255, 255, 255, 0.65) !important
  color #606060
  -webkit-box-shadow none !important
  box-shadow none !important
  outline 0 none !important
  -webkit-appearance none !important
</style>
