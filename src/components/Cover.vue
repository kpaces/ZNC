<template>
  <div id="cover">
    <a
      @click="close()"
      title="C l o s e"
      id="close"
      class="linkButton material-icons"
      >close</a
    >
    <div id="content">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import hotkeys from "hotkeys-js";

@Component({
  name: "Cover"
})
export default class Cover extends Vue {
  mounted() {
    hotkeys("esc", ev => {
      ev.preventDefault();
      this.close();
      return false;
    });
  }

  close() {
    hotkeys.unbind("esc");
    setTimeout(() => {
      const timeset = document.getElementById("timeset");
      if (timeset !== null) {
        timeset.focus();
      }
    }, 150);
    this.$router.push("/").catch(err => {});
  }
}
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
  overflow hidden

#content
  margin-top 1em
  border-top 1px solid rgba(0, 0, 0, 0.025)
  padding 0 3em 3em 3em
  width 100%
  height calc(100% - 6em)
  overflow-y auto

#close
  margin-top 3rem
  font-size 2rem
  color #606060
  opacity 0.15
  transition opacity 0.5s ease-in-out

  &:hover
    opacity 0.5

::-webkit-scrollbar-track
::scrollbar-track
  border-radius 0
  background-color transparent

::-webkit-scrollbar
  width 6px
  height 6px
  border-left 0
  background-color transparent

::-webkit-scrollbar-thumb
  border-left 0
  border-radius 0
  background-color rgba(0, 0, 0, 0.125)
</style>
