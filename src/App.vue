<template>
  <div id="app">
    <Timer />
    <div id="logo">
      <img src="img/logo.svg" />
    </div>

    <div id="nav">
      <router-link to="/">Home</router-link>
      <router-link to="/config">Config</router-link>
      <router-link to="/faq">FAQ</router-link>
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
/*
      www.OnlineWebFonts.Com
      You must credit the author Copy this link on your web
      <div>Font made from <a href="http://www.onlinewebfonts.com">oNline Web Fonts</a>is licensed by CC BY 3.0</div>
      OR
      <a href="http://www.onlinewebfonts.com">oNline Web Fonts</a>
*/
@font-face
  font-family 'Bahnschrift'
  src url('https://db.onlinewebfonts.com/t/0a6ee448d1bd65c56f6cf256a7c6f20a.eot') /* IE9 */
  src url('https://db.onlinewebfonts.com/t/0a6ee448d1bd65c56f6cf256a7c6f20a.eot?#iefix') format('embedded-opentype'), url('https://db.onlinewebfonts.com/t/0a6ee448d1bd65c56f6cf256a7c6f20a.woff2') format('woff2'), url('https://db.onlinewebfonts.com/t/0a6ee448d1bd65c56f6cf256a7c6f20a.woff') format('woff'), url('https://db.onlinewebfonts.com/t/0a6ee448d1bd65c56f6cf256a7c6f20a.ttf') format('truetype'), url('https://db.onlinewebfonts.com/t/0a6ee448d1bd65c56f6cf256a7c6f20a.svg#Bahnschrift') format('svg')
  /* iOS 4.1- */

@import url('https://fonts.googleapis.com/icon?family=Material+Icons')

nav-margin = 0.5rem
nav-color = rgb(96, 96, 96)
nav-separator-color = rgba(0, 0, 0, 0.15)
link-color = #009c52

html
  overflow hidden !important
  background-color rgb(250, 250, 250)

body
  overflow hidden !important
  -webkit-touch-callout none /* iOS Safari */
  -webkit-user-select none /* Safari */
  -khtml-user-select none /* Konqueror HTML */
  -moz-user-select none /* Old versions of Firefox */
  -ms-user-select none /* Internet Explorer/Edge */
  user-select none   /* Non-prefixed version, currently
  supported by Chrome, Opera and Firefox */
  text-rendering optimizeLegibility !important

h2
  font-size 150% !important
  margin-top 1em !important
  font-weight 600 !important

h3
  font-size 125% !important
  margin-top 2em !important
  font-weight 400 !important

p
ul
  line-height 2em

form
  margin-top 1em

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
  position fixed
  left 2 * nav-margin
  top nav-margin
  transition margin 0.5s ease-in-out
  transition opacity 0.5s ease-in-out
  z-index 20
  font-size 2.5em
  text-align left
  line-height 1.25em

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
    opacity 0.15

  #logo
    opacity 0.15
</style>
