<template>
  <div>
    <transition name="fade">
      <div id="play" key="play" v-if="!micEnabled">
        <div @click="play">
          <span>▶</span>
        </div>
      </div>
      <div id="time" key="time" v-if="micEnabled" v-html="time"></div>
    </transition>

    <canvas
      :width="resolution"
      height="1080"
      ref="display"
      id="display"
    ></canvas>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
let createMedianFilter: any = require("moving-median");

@Component
export default class Timer extends Vue {
  @Prop(Number) readonly sensitivity: number = 250;

  audioContext: any = null;
  canvasContext: any = null;
  meter: any = null;
  micEnabled: boolean = false;
  width: number = 1920;
  height: number = 1080;
  medianFilter: any = null;
  noiseFilter: boolean = true;
  seconds: number = 5 * 60;
  interval: any = null;
  resolution: number = 1920;
  speed: number = this.resolution / 10;
  blur: number = 1;

  get time() {
    return `${Math.floor(this.seconds / 60)}<span class="sep">:</span>${(
      this.seconds % 60
    )
      .toString()
      .padStart(2, "0")}`;
  }

  play() {
    this.seconds = 10 * 60;
    this.audioContext = new AudioContext();
    let canvas: any = this.$refs.display;
    this.canvasContext = (canvas as HTMLCanvasElement).getContext("2d");
    this.medianFilter = createMedianFilter(63);
    // this.width = (canvas as HTMLCanvasElement).scrollWidth;
    // this.height = (canvas as HTMLCanvasElement).scrollHeight;

    // eslint-disable-next-line
    let n: any = navigator;

    n.getUserMedia =
      n.getUserMedia ||
      n.webkitGetUserMedia ||
      n.mozGetUserMedia ||
      n.msGetUserMedia;

    n.getUserMedia(
      {
        video: false,
        audio: true
      },
      this.success,
      this.error
    );

    this.interval = setInterval(this.tick, 1000);
  }

  tick() {
    this.seconds -= 1;
    if (this.seconds < 0) {
      clearInterval(this.interval);
      this.micEnabled = false;
    }
  }

  success(stream: any) {
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
    v = 255 * Math.pow(v / 255, (600 - this.sensitivity) / 100);
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

    if (h < t) {
      this.canvasContext.fillStyle = `rgba(128,255,128,.25)`;
    } else if (h >= t && h < 2 * t) {
      this.canvasContext.fillStyle = `rgba(255,192,80,.25)`;
    } else {
      this.canvasContext.fillStyle = `rgba(255,100,100,.25)`;
    }

    this.canvasContext.beginPath();
    this.canvasContext.moveTo(
      0,
      this.height - h * 1.02 + 50 * Math.sin(time / this.speed)
    );
    this.canvasContext.lineTo(
      this.width,
      this.height - h * 1.03 + 50 * Math.cos(time / this.speed)
    );
    this.canvasContext.lineTo(this.width, this.height);
    this.canvasContext.lineTo(0, this.height);
    this.canvasContext.fill();

    if (h < t) {
      this.canvasContext.fillStyle = `rgba(128,255,128,.5)`;
    } else if (h >= t && h < 2 * t) {
      this.canvasContext.fillStyle = `rgba(255,192,80,.5)`;
    } else {
      this.canvasContext.fillStyle = `rgba(255,100,100,.5)`;
    }

    this.canvasContext.fillRect(0, this.height - h, this.width, this.height);
    window.requestAnimationFrame(this.drawLoop);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
@import url('https://fonts.googleapis.com/css?family=Share+Tech+Mono&display=swap')

play-size = 50vmin

#play
  font-family sans-serif
  position absolute
  display flex
  width 100%
  height 100%
  top 0
  left 0
  overflow hidden
  justify-content center
  align-items center
  cursor pointer

#play div
  border-radius 50%
  line-height 0
  font-size play-size * 0.5
  width play-size
  height play-size
  display flex
  justify-content center
  align-items center
  border 3vmin solid rgba(0, 0, 0, 0.1)
  box-sizing border-box

  &:hover
    background-color rgba(0, 0, 0, 0.1)
    border 3vmin solid rgba(0, 0, 0, 0)

#play div span
  display inline-block
  padding-left 4vmin
  padding-top 1vmin

#time
  font-family 'Share Tech Mono'
  letter-spacing -0.1em
  font-size 50vmin
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

#display
  width 100%
  height 100%
  position absolute
  left 0
  top 0
  z-index -1

.fade-enter-active
.fade-leave-active
  transition opacity 0.5s linear

.fade-enter
  opacity 0

.fade-leave-to
  opacity 0
</style>

<style lang="stylus">
.sep
  display block
  position relative
  top -4%
  left 0.1%
</style>
