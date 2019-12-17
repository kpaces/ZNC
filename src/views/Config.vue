<template>
  <div class="config">
    <Cover>
      <h2>Config</h2>

      <h3>What to do when the meter hits red</h3>
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
                >{{ mode === 0 ? "SELECTED" : "SELECT" }}</b-button
              >
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
                >{{ mode === 1 ? "SELECTED" : "SELECT" }}</b-button
              >
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
                class="numberInput"
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
                >{{ mode === 2 ? "SELECTED" : "SELECT" }}</b-button
              >
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
                class="numberInput"
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
                >{{ mode === 3 ? "SELECTED" : "SELECT" }}</b-button
              >
            </div>
          </nav>
        </div>
      </div>

      <h3>Noise filter intensity</h3>
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
                >{{ noise === 0 ? "SELECTED" : "SELECT" }}</b-button
              >
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
                >{{ noise === 1 ? "SELECTED" : "SELECT" }}</b-button
              >
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
                >{{ noise === 2 ? "SELECTED" : "SELECT" }}</b-button
              >
            </div>
          </nav>
        </div>
      </div>

      <h3>Other settings</h3>
      <div class="columns">
        <div class="column">
          <nav class="panel box">
            <div class="panel-block">Show final stats</div>
            <div class="panel-block">
              <div class="field">
                <b-switch
                  @input="changeOtherSettings"
                  v-model="otherSettings.report"
                  type="is-success"
                  >{{ otherSettings.report ? "Yes" : "No" }}</b-switch
                >
              </div>
            </div>
          </nav>
        </div>

        <div class="column">
          <nav class="panel box">
            <div class="panel-block">Play sounds</div>
            <div class="panel-block">
              <div class="field">
                <b-switch
                  @input="changeOtherSettings"
                  v-model="otherSettings.sounds"
                  type="is-success"
                  >{{ otherSettings.sounds ? "Yes" : "No" }}</b-switch
                >
              </div>
            </div>
          </nav>
        </div>

        <div class="column">
          <nav class="panel box disabled">
            <div class="panel-block">Webhook</div>

            <div class="panel-block">
              <b-input
                disabled
                @input="changeOtherSettings"
                v-model="otherSettings.webhookURL"
                placeholder="Paste the webhook URL here"
                rounded
                expanded
                class="textInput"
                :class="{
                  valid: isWebhookURLValid === 1,
                  unvalid: isWebhookURLValid === 2
                }"
              ></b-input>
            </div>

            <div class="panel-block">
              <div class="field">
                <b-switch
                  v-if="isWebhookURLValid === 1"
                  @input="changeOtherSettings"
                  v-model="otherSettings.webhook"
                  type="is-success"
                  >{{ otherSettings.webhook ? "Yes" : "No" }}</b-switch
                >

                <b-switch v-else disabled :value="false" type="is-success"
                  >No</b-switch
                >
              </div>
            </div>
          </nav>
        </div>
      </div>
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
      step: 5,
      otherSettings: {
        report: true,
        sounds: true,
        webhook: false,
        webhookURL: ""
      }
    };
  },

  computed: {
    isWebhookURLValid() {
      // Regex for URL validation from https://www.regextester.com/94502
      if (this.otherSettings.webhookURL.trim().length === 0) {
        return 0;
      }
      if (
        /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w-._~:/?#[\]@!$&'()*+,;=.]+$/.test(
          this.otherSettings.webhookURL.trim()
        )
      ) {
        return 1;
      }
      return 2;
    },

    ...mapState({
      mode: "mode",
      noise: "noise",
      timeStep: "timeStep",
      other: "otherSettings"
    })
  },

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
    this.otherSettings = this.other;
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
    },

    changeOtherSettings() {
      this.$store.commit("setOtherSettings", this.otherSettings);
      localStorage.setItem(
        "ZNC-otherSettings",
        JSON.stringify(this.otherSettings)
      );
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

.numberInput
  font-family 'Share Tech Mono'
  letter-spacing -0.1em
  display block
  font-size 2em
  line-height 0
  text-align center
  border 1px solid #dbdbdb !important
  padding 0.3em 0.5em 0.2em 0.4em
  width 2em !important
  height 2em !important
  border-radius 50%
  background rgba(255, 255, 255, 0.65) !important
  color #606060
  -webkit-box-shadow none !important
  box-shadow none !important
  outline 0 none !important
  -webkit-appearance none !important

.textInput input
  font-family 'Share Tech Mono'
  font-size 1em
  text-align center
  border 1px solid #dbdbdb !important
  padding 0.3em 0.5em 0.2em 0.4em
  background rgba(255, 255, 255, 0.65) !important
  color #606060
  -webkit-box-shadow none !important
  box-shadow none !important
  outline 0 none !important
  -webkit-appearance none !important

.valid input
  background-color rgba(128, 255, 128, 0.25) !important

.unvalid input
  background-color rgba(255, 100, 100, 0.25) !important
</style>
