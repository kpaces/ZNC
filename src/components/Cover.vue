<template>
  <div id="cover">
    <router-link
      title="C l o s e"
      id="close"
      class="linkButton material-icons"
      to="/"
      >close
    </router-link>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  name: "Cover"
})
export default class Cover extends Vue {}
</script>

<style scoped lang="stylus">
#cover
  position absolute
  top 0
  left 0
  width 100vw
  height 100vh
  background-color rgba(240, 240, 240, 0.75)
  z-index 10
  backdrop-filter blur(11px)
  -webkit-backdrop-filter blur(11px)
  padding 3rem
  overflow auto

#close
  font-size 2rem
  color #606060
  opacity 0.15
  transition opacity 0.5s ease-in-out

  &:hover
    opacity 0.5
</style>
