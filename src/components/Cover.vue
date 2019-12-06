<template>
  <div id="cover">
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
  width 100%
  height 100%
  background-color rgba(240, 240, 240, 0.75)
  z-index 10
  backdrop-filter blur(11px)
  padding 3rem
  overflow auto
</style>
