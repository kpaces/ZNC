<template>
  <div>
    <transition-group name="fade">
      <div id="play" key="play" v-if="!micEnabled">
        <div @click.prevent.stop="play">
          <input
            title="M i n u t e s  (1 - 9 0)"
            @click.prevent.stop="doNothing"
            min="1"
            max="90"
            maxlength="2"
            id="timeset"
            type="tel"
            ref="timeset"
            v-model="timeLimit"
            @blur="fixTime"
            @keypress.enter="play"
          />
          <a class="linkButton" title="P l a y">
            <span class="material-icons">play_arrow</span>
          </a>
        </div>
      </div>

      <div id="pause" key="pause" v-if="micEnabled">
        <div @click.prevent.stop="pause">
          <a class="linkButton" title="P a u s e">
            <span v-if="status === 1" class="material-icons">pause</span>
            <span v-else class="material-icons">play_arrow</span>
          </a>
        </div>
      </div>

      <div id="stop" key="stop" v-if="micEnabled">
        <div @click.prevent.stop="stop">
          <a class="linkButton" title="S t o p">
            <span class="material-icons">stop</span>
          </a>
        </div>
      </div>

      <div id="time" :class="{ blinking: status > 1 }" key="time" v-if="micEnabled" v-html="time"></div>
    </transition-group>

    <canvas :width="resolution" height="1080" ref="display" id="display"></canvas>

    <vue-slider
      title="S e n s i t i v i t y"
      class="slider"
      v-model="sensitivity"
      :min="300"
      :max="600"
      :dotSize="30"
      :interval="10"
      :marks="false"
    ></vue-slider>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Prop, Vue } from "vue-property-decorator";

import VueSlider from "vue-slider-component";
import hotkeys from "hotkeys-js";

let createMedianFilter: any = require("moving-median");

@Component({
  name: "Timer",

  components: { VueSlider }
})
export default class Timer extends Vue {
  audioContext: any = null;
  canvasContext: any = null;
  meter: any = null;
  micEnabled: boolean = false;
  width: number = 1920;
  height: number = 1080;
  medianFilter: any = null;
  medianFilter2: any = null;
  noiseFilter: boolean = true;
  seconds: number = 0;
  interval: any = null;
  resolution: number = 320;
  speed: number = this.resolution * 5;
  blur: number = 1;
  sensitivity: number = 450;
  timeLimit: number = 5;
  status: number = 0;
  redTimer: any = null;
  redTimer2: any = null;
  isRed: boolean = false;
  preRed: boolean = false;
  redWait: number = 1.5 * 1000;
  inRed: boolean = false;
  inRedTime: number = 5 * 1000;
  stats: number[] = [0, 0, 0];
  timeStats: number[][] = [];

  get time() {
    return `${Math.floor(this.seconds / 60)}<span class="sep">:</span>${(
      this.seconds % 60
    )
      .toString()
      .padStart(2, "0")}`;
  }

  get unformatedTime() {
    return `${Math.floor(this.seconds / 60)}:${(this.seconds % 60)
      .toString()
      .padStart(2, "0")}`;
  }

  get indicator() {
    const seconds = this.timeLimit * 60;
    const ind: string[] = ["○", "◔", "◑", "◕", "⬤"];
    const i = Math.floor((4 * (seconds - this.seconds)) / seconds);

    return ind[i];
  }

  get mode() {
    return this.$store.state.mode;
  }

  get noise() {
    return this.$store.state.noise;
  }

  get step() {
    return this.$store.state.timeStep;
  }

  get otherSettings() {
    return this.$store.state.otherSettings;
  }

  created() {
    hotkeys("enter", ev => {
      ev.preventDefault();
      if (this.status > 0) {
        this.stop();
      }
    });

    hotkeys("pagedown", ev => {
      ev.preventDefault();
      if (this.status > 0) {
        this.stop();
      }
    });

    hotkeys("space", ev => {
      ev.preventDefault();
      if (this.status > 0) {
        this.pause();
      }
    });

    hotkeys("pageup", ev => {
      ev.preventDefault();
      if (this.status > 0) {
        this.pause();
      }
    });

    const savedSensitivity: any = localStorage.getItem("ZNC-sensitivity");
    if (savedSensitivity !== null) {
      this.sensitivity = parseInt(savedSensitivity, 10);
    }

    const savedTimeLimit: any = localStorage.getItem("ZNC-timeLimit");
    if (savedTimeLimit !== null) {
      this.timeLimit = parseInt(savedTimeLimit, 10);
    }

    const savedMode: any = localStorage.getItem("ZNC-mode");
    if (savedMode !== null) {
      this.$store.commit("setMode", parseInt(savedMode, 10));
    }

    const savedNoise: any = localStorage.getItem("ZNC-noiseFilter");
    if (savedNoise !== null) {
      this.$store.commit("setNoise", parseInt(savedNoise, 10));
    }

    const savedTimeStep: any = localStorage.getItem("ZNC-timeStep");
    if (savedTimeStep !== null) {
      this.$store.commit("setTimeStep", parseInt(savedTimeStep, 10));
    }

    const savedOtherSettings: any = localStorage.getItem("ZNC-otherSettings");
    if (savedOtherSettings !== null) {
      this.$store.commit("setOtherSettings", JSON.parse(savedOtherSettings));
    }
  }

  mounted() {
    const timeset = this.$refs.timeset as HTMLInputElement;
    timeset.focus();
  }

  @Watch("timeLimit")
  onTimeLimitChanged(val: string) {
    let v = parseInt(val, 10);
    if (isNaN(v)) {
      v = 5;
    }

    if (val.length > 0) {
      this.timeLimit = Math.max(1, Math.min(90, v));
      localStorage.setItem("ZNC-timeLimit", this.timeLimit.toString());
    }
  }

  @Watch("sensitivity")
  onSensitivityChanged(val: string) {
    localStorage.setItem("ZNC-sensitivity", val);
  }

  @Watch("noise")
  onNoiseChanged(val: number) {
    this.medianFilter = createMedianFilter(Math.pow(2, 2 * val + 3) + 1);
  }

  @Watch("mode")
  onModeChange(val: number) {
    this.redOut();
    this.inRed = false;
    clearTimeout(this.redTimer);
    clearTimeout(this.redTimer2);
  }

  doNothing() {}

  fixTime() {
    this.timeLimit = Math.max(1, Math.min(90, this.timeLimit));
  }

  play() {
    this.$router.push("/").catch(err => {});

    this.seconds = this.timeLimit * 60;
    this.stats = [0, 0, 0];
    this.timeStats = [];
    this.$store.commit("setStats", {
      stats: this.stats,
      timeStats: this.timeStats
    });

    const n: any = navigator;
    n.getUserMedia =
      n.getUserMedia ||
      n.webkitGetUserMedia ||
      n.mozGetUserMedia ||
      n.msGetUserMedia;

    if (!n.getUserMedia) {
      var constraints = {
        audio: true,
        video: false
      };

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(this.success)
        .catch(this.error);
    } else {
      n.getUserMedia(
        {
          audio: true,
          video: false
        },
        this.success,
        this.error
      );
    }

    this.interval = setInterval(this.tick, 1000);
    this.status = 1;
    document.title = `ZNC ${this.indicator} ${this.unformatedTime}`;
  }

  pause() {
    if (this.isRed) {
      clearInterval(this.interval);
      this.status = 3;
      document.title = `ZNC ${this.indicator} ${this.unformatedTime} - paused`;
    } else {
      switch (this.status) {
        case 1:
          clearInterval(this.interval);
          this.status = 2;
          document.title = `ZNC ${this.indicator} ${this.unformatedTime} - paused`;
          break;
        case 2:
        case 3:
          this.interval = setInterval(this.tick, 1000);
          this.status = 1;
          document.title = `ZNC ${this.indicator} ${this.unformatedTime}`;
          break;
      }
    }
  }

  stop() {
    clearTimeout(this.redTimer);
    clearTimeout(this.redTimer2);
    clearInterval(this.interval);
    this.status = 0;
    this.seconds = 0;
    this.micEnabled = false;
    this.isRed = false;
    this.preRed = false;
    this.inRed = false;

    this.$store.commit("setStats", {
      stats: this.stats,
      timeStats: this.timeStats
    });

    document.title = "ZNC";

    // Add conditional push
    if (this.otherSettings.report) {
      this.$router.push("/report").catch(err => {});
    } else {
      setTimeout(() => {
        const timeset = document.getElementById("timeset");
        if (timeset !== null) {
          timeset.focus();
        }
      }, 150);
    }
  }

  tick() {
    this.seconds -= 1;
    if (this.seconds < 0) {
      if (this.otherSettings.sounds) {
        const audio = new Audio("/mp3/chime.mp3");
        audio.play();
      }
      this.stop();
      return;
    }
    document.title = `ZNC ${this.indicator} ${this.unformatedTime}`;
  }

  redIn() {
    clearTimeout(this.redTimer);
    clearTimeout(this.redTimer2);
    this.preRed = false;

    if (this.inRed) {
      return;
    }

    if (this.otherSettings.sounds) {
      const audio = new Audio("/mp3/bip.mp3");
      audio.play();
    }

    switch (this.mode) {
      case 0:
        break;
      case 1:
        this.isRed = true;
        this.pause();
        break;
      case 2:
        this.seconds += this.step;
        this.inRed = true;
        break;
      case 3:
        this.seconds = Math.max(0, this.seconds - this.step);
        this.inRed = true;
        break;
    }

    if (this.inRed) {
      this.redTimer2 = setTimeout(() => {
        this.inRedOut();
      }, this.inRedTime);
    }
  }

  redOut() {
    clearTimeout(this.redTimer);
    clearTimeout(this.redTimer2);
    this.preRed = false;
    this.inRed = false;

    if (this.isRed) {
      this.isRed = false;
      this.pause();
      if (this.otherSettings.sounds) {
        const audio = new Audio("/mp3/bip2.mp3");
        audio.play();
      }
    }
  }

  inRedOut() {
    this.inRed = false;
  }

  success(stream: any) {
    const w: any = window;

    w.AudioContext = w.AudioContext || w.webkitAudioContext;
    if (w.AudioContext) {
      w.audioContext = new w.AudioContext();
    }

    this.audioContext = new w.AudioContext();
    let canvas: any = this.$refs.display;
    this.canvasContext = (canvas as HTMLCanvasElement).getContext("2d");
    this.medianFilter = createMedianFilter(Math.pow(2, this.noise + 4) + 1);
    this.medianFilter2 = createMedianFilter(5);

    let mediaStreamSource: any = this.audioContext.createMediaStreamSource(
      stream
    );

    this.meter = this.createAudioMeter(this.audioContext, 1, 0.95, 750);
    mediaStreamSource.connect(this.meter);

    // kick off the visual updating
    this.micEnabled = true;
    this.drawLoop(0);
  }

  error() {
    this.micEnabled = false;
    // eslint-disable-next-line
    console.error("No mic access allowed!");
  }

  /*
The MIT License (MIT)

Copyright (c) 2014 Chris Wilson

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

  /*

Usage:
audioNode = createAudioMeter(audioContext,clipLevel,averaging,clipLag);

audioContext: the AudioContext you're using.
clipLevel: the level (0 to 1) that you would consider "clipping".
   Defaults to 0.98.
averaging: how "smoothed" you would like the meter to be over time.
   Should be between 0 and less than 1.  Defaults to 0.95.
clipLag: how long you would like the "clipping" indicator to show
   after clipping has occured, in milliseconds.  Defaults to 750ms.

Access the clipping through node.checkClipping(); use node.shutdown to get rid of it.
*/

  createAudioMeter(
    audioContext: any,
    clipLevel: number,
    averaging: number,
    clipLag: number
  ) {
    var processor = audioContext.createScriptProcessor(1024);
    processor.onaudioprocess = this.volumeAudioProcess;
    processor.clipping = false;
    processor.lastClip = 0;
    processor.volume = 0;
    processor.clipLevel = clipLevel || 0.98;
    processor.averaging = averaging || 0.95;
    processor.clipLag = clipLag || 750;

    // this will have no effect, since we don't copy the input to the output,
    // but works around a current Chrome bug.
    processor.connect(audioContext.destination);

    processor.checkClipping = function() {
      if (!this.clipping) return false;
      if (this.lastClip + this.clipLag < window.performance.now())
        this.clipping = false;
      return this.clipping;
    };

    processor.shutdown = function() {
      this.disconnect();
      this.onaudioprocess = null;
    };

    return processor;
  }

  volumeAudioProcess(event: any) {
    var buf = event.inputBuffer.getChannelData(0);
    var bufLength = buf.length;
    var sum = 0;
    var x;
    var ax;

    // Do a root-mean-square on the samples: sum up the squares...
    for (var i = 0; i < bufLength; i++) {
      ax = x = buf[i];
      /* if (ax < 0) ax = -ax;

      if (ax >= event.target.clipLevel) {
        event.target.clipping = true;
        event.target.lastClip = window.performance.now();
      } */
      sum += x * x;
    }

    // ... then take the square root of the sum.
    var rms = Math.sqrt(sum / bufLength);

    // Now smooth this out with the averaging factor applied
    // to the previous sample - take the max here because we
    // want "fast attack, slow release."
    event.target.volume = Math.max(
      rms,
      (event.target.volume as any) * (event.target.averaging as any)
    );
    event.target.volume =
      rms * 0.5 +
      0.5 * (event.target.volume as any) * (event.target.averaging as any);
    /*
      rms * 0.1 +
      (event.target.volume as any) * (event.target.averaging as any) * 0.9; */
  }

  drawLoop(time: number) {
    let v: number = Math.round(this.meter.volume * 512.0);
    v = Math.max(0, Math.min(255, v));
    v = 255 * Math.pow(v / 255, (625 - this.sensitivity) / 100);
    v = (255 * Math.log(v)) / Math.log(255);
    v = Math.round(Math.max(0, Math.min(255, v)));

    // this.canvasContext.fillStyle = `rgba(255,255,255,${this.blur})`;
    // this.canvasContext.fillRect(0, 0, this.width, this.height);
    this.canvasContext.clearRect(0, 0, this.width, this.height);

    let h: number = Math.max(0, Math.min(this.height, this.height * (v / 255)));
    if (this.noiseFilter) {
      h = this.medianFilter(h);
    }
    let t: number = this.height / 3;

    // Perform running mean for the time stats
    if (this.status === 1) {
      const seconds = this.timeLimit * 60;
      const st = this.timeStats[seconds - this.seconds];

      if (typeof st !== "undefined") {
        const n = st[0];
        this.timeStats[seconds - this.seconds] = [
          n + 1,
          (st[1] * n + h / t) / (n + 1)
        ];
      } else {
        this.timeStats[seconds - this.seconds] = [1, h / t];
      }
    }

    if (h < t) {
      // GREEN state
      this.canvasContext.fillStyle = "rgba(128,255,128,.65)";
      if (this.status === 1) {
        this.stats[0] += 1;
      }
      if (this.mode > 0 && !this.inRed) {
        this.redOut();
      }
    } else if (h >= t && h < 2 * t) {
      // YELLOW state
      this.canvasContext.fillStyle = "rgba(255,192,80,.65)";
      if (this.status === 1) {
        this.stats[1] += 1;
      }
      if (this.mode > 0 && !this.inRed) {
        this.redOut();
      }
    } else {
      // RED state
      this.canvasContext.fillStyle = "rgba(255,100,100,.65)";
      if (this.status === 1) {
        this.stats[2] += 1;
      }
      if (
        !this.isRed &&
        !this.preRed &&
        this.status === 1 &&
        this.mode > 0 &&
        !this.inRed
      ) {
        clearTimeout(this.redTimer);
        this.preRed = true;
        this.redTimer = setTimeout(this.redIn, this.redWait);
      }
    }

    this.canvasContext.fillRect(0, this.height - h, this.width, this.height);

    window.requestAnimationFrame(this.drawLoop);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
@import url('https://fonts.googleapis.com/css?family=Share+Tech+Mono&display=block')

play-size = 42vmin
pause-stop-size = 20vmin

#play
#stop
#pause
  position absolute
  display flex
  width 100%
  height 100%
  top 0
  left 0
  overflow hidden
  align-items center

#timeset
  display block

#play
  justify-content center

#pause
  justify-content flex-start

#stop
  justify-content flex-end

#play div
#pause div
#stop div
  font-display block !important
  border-radius 50%
  line-height 0
  display flex
  justify-content center
  align-items center
  box-sizing border-box
  cursor pointer

#play div
  width play-size
  height play-size
  background-color rgba(0, 0, 0, 0.05)
  flex-direction column

  &:hover
    background-color rgba(0, 0, 0, 0.1)
    border 3vmin solid rgba(0, 0, 0, 0)

#play input
  font-family 'Share Tech Mono'
  font-display block
  letter-spacing -0.1em
  font-size 12vmin
  line-height 0vmin
  text-align center
  text-shadow 0.6vmin 0 0 rgba(0, 0, 0, 0.1)
  border 1px solid rgba(0, 0, 0, 0) !important
  padding 0.5vmin 1vmin 0 0
  width 15vmin !important
  height 15vmin !important
  border-radius 50%
  background rgba(255, 255, 255, 0.65) !important
  color #606060
  -webkit-box-shadow none !important
  box-shadow none !important
  outline 0 none !important
  -webkit-appearance none !important

  &:focus
    border-color inherit

/* Chrome, Safari, Edge, Opera */
input[type=number]::-webkit-inner-spin-button
input[type=number]::-webkit-outer-spin-button
  -webkit-appearance none
  margin 0

input[type=number]
  -moz-appearance textfield !important

#pause div
#stop div
  width pause-stop-size
  height pause-stop-size
  margin 0 1rem 1rem 1rem
  z-index 3
  transition opacity 0.15s ease-in-out
  opacity 0.15

  &:hover
    opacity 1
    background-color rgba(0, 0, 0, 0.1)

#play div span
  font-size play-size * 0.5 !important

#pause div span
#stop div span
  font-size pause-stop-size * 0.5 !important

#time
  font-family 'Share Tech Mono'
  font-display block
  letter-spacing -0.1em
  font-size 43vmin
  position absolute
  display flex
  width 100%
  height 100%
  top 0
  left -0.05em
  overflow hidden
  justify-content center
  align-items center
  line-height 0
  text-align center
  text-shadow 2.5vmin 0 0 rgba(0, 0, 0, 0.1)
  max-width 100vw

#display
  width 100%
  height 100%
  position absolute
  left 0
  top 0
  z-index -2

#subDisplay
  width 100%
  height 33%
  position absolute
  left 0
  bottom 0
  z-index -1

.fade-enter-active
.fade-leave-active
  transition opacity 0.5s linear

.fade-enter
  opacity 0

.fade-leave-to
  opacity 0

.blinking
  transition none !important
  animation blinking 1s ease infinite

@keyframes blinking
  50%
    opacity 0

slider-margin-x = 3em
slider-margin-y = 2em
slider-width = 2 * slider-margin-x

.slider
  margin slider-margin-y slider-margin-x
  position fixed
  width 'calc(100% - %s)' % slider-width !important
  bottom 0
  cursor pointer
  transition opacity 0.5s linear
  opacity 0.15

  &:hover
    opacity 0.9
</style>

<style lang="stylus">
.sep
  display block
  position relative
  top -4%
  left 0.1%
</style>

<style lang="sass">
$themeColor: rgba(64, 64, 64, .35)
$bgColor: rgba(128, 128, 128, .05)
@import '~vue-slider-component/lib/theme/antd.scss'
</style>
