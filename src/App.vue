<template>
  <div id="app">
    <Timer :sensitivity="sensitivity" />
    <div>
      <img src="/img/logo.svg" id="logo" />
    </div>

    <div id="nav">
      <router-link to="/">Home</router-link>
      <router-link to="/config">Config</router-link>
      <router-link to="/about">About</router-link>
    </div>

    <div id="main">
      <router-view />
    </div>

    <div style="margin:1em 2em;position:relative">
      <b-field>
        <b-slider
          :min="250"
          :max="500"
          v-model="sensitivity"
          type="is-info"
          size="is-small"
        ></b-slider>
      </b-field>
    </div>
  </div>
</template>

<script>
import Timer from "@/components/Timer.vue";

export default {
  name: "app",
  components: {
    Timer
  },
  data() {
    return { sensitivity: 180 };
  }
};
</script>

<style lang="stylus">
@import url('//db.onlinewebfonts.com/c/0a6ee448d1bd65c56f6cf256a7c6f20a?family=Bahnschrift')

nav-margin = 0.5rem
nav-color = rgb(96, 96, 96)
nav-separator-color = rgba(0, 0, 0, 0.15)

html
  overflow hidden!important

body
  bodybackground-color rgb(250, 250, 250)
  overflow hidden

#app
  font-family Bahnschrift, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  color rgb(96, 96, 96)
  letter-spacing 1px
  margin 0

#nav
  position fixed
  right 2 * nav-margin
  top nav-margin
  transition margin 0.5s ease-in-out
  transition opacity 0.5s ease-in-out

#nav > a
  padding-left nav-margin
  color nav-color
  opacity 0.75
  text-decoration none
  font-size 0.75em

  &:hover
    opacity 1

#nav > a:not(:last-child)
  padding-right nav-margin
  border-right 1px solid nav-separator-color

#nav > a:first-child
  padding-left 0

#logo
  margin-top 1em
  height 50px
  transition margin 0.25s ease-in-out
  transition opacity 0.5s ease-in-out

@media screen and (max-width: 650px)
  #nav
    margin 0 auto
    width 100%
    right 0

  #logo
    margin-top 2em

@media screen and (max-height: 400px)
  #nav
    opacity 0

  #logo
    opacity 0
</style>
