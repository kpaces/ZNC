<template>
  <div class="about">
    <Cover>
      <h2>About</h2>

      <p>
        ZNC is an
        <a href="https://github.com/kpaces/ZNC" target="_blank">open-source</a>
        tool developed for the
        <a href="https://zeronoiseclassroom.com" target="_blank"
          >Zero Noise Classroom</a
        >
        project by <a href="https://kpaces.com" target="_blank">kpaces</a>.
      </p>
      <p>
        It uses
        <a href="https://github.com/cwilso/volume-meter/" target="_blank"
          >some code</a
        >
        by <a href="https://cwilso.com/" target="_blank">Chris Wilson</a>.
      </p>
    </Cover>
  </div>
</template>

<script>
import Cover from "@/components/Cover.vue";

export default {
  name: "about",
  components: {
    Cover
  }
};
</script>
