<template>
  <div id="app">
    <Timer />
    <div id="logo">
      <img src="/img/logo.svg" />
    </div>

    <div id="nav">
      <router-link to="/">Home</router-link>
      <router-link to="/config">Config</router-link>
      <router-link to="/about">About</router-link>
    </div>

    <div id="main">
      <transition name="fade">
        <router-view />
      </transition>
    </div>
  </div>
</template>

<script>
import Timer from "@/components/Timer.vue";

export default {
  name: "app",
  components: {
    Timer
  }
};
</script>

<style lang="stylus">
@import url('//db.onlinewebfonts.com/c/0a6ee448d1bd65c56f6cf256a7c6f20a?family=Bahnschrift')

nav-margin = 0.5rem
nav-color = rgb(96, 96, 96)
nav-separator-color = rgba(0, 0, 0, 0.15)
link-color = #009c52

html
  overflow hidden !important
  background-color rgb(250, 250, 250)

body
  overflow hidden !important

h2
  font-size 150% !important
  margin 0 40% 1em 40% !important
  border-bottom 3px solid rgba(0, 0, 0, 0.05)

a:not(.linkButton)
  color link-color !important
  &:hover
    border-bottom 2px solid link-color

a.linkButton
  color nav-color
  &:hover
    color nav-color

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
  z-index 20

  &:hover
    opacity 1 !important

#nav > a
  padding-left nav-margin
  color nav-color !important
  opacity 0.75
  text-decoration none
  font-size 0.75em

  &:hover
    opacity 1
    border-bottom none

#nav > a:not(:last-child)
  padding-right nav-margin
  border-right 1px solid nav-separator-color

#nav > a:first-child
  padding-left 0

#logo
  margin 1em 0 0 1em
  height 70px
  transition margin 0.25s ease-in-out
  transition opacity 0.5s ease-in-out
  z-index 20
  position fixed

  &:hover
    opacity 1

.fade-enter-active
.fade-leave-active
  transition opacity 0.5s linear

.fade-enter
  opacity 0

.fade-leave-to
  opacity 0

@media screen and (max-height: 450px), screen and (max-width: 640px)
  #nav
    opacity 0.075

  #logo
    opacity 0.075
</style>
