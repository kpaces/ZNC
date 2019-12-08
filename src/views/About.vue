<template>
  <div class="about">
    <Cover>
      <h2>About</h2>

      <p>
        ZNC is an
        <a href="https://github.com/kpaces/ZNC" target="_blank">open-source</a>
        tool developed for the
        <a
          href="https://zeronoiseclassroom.com"
          target="_blank"
        >Zero Noise Classroom</a>
        project by
        <a href="https://kpaces.com" target="_blank">kpaces</a>.
      </p>
      <h3>ZNC uses</h3>
      <ul>
        <li><a href="https://github.com/cwilso/volume-meter/" target="_blank">Volume meter code</a>
        by
        <a href="https://cwilso.com/" target="_blank">Chris Wilson</a>. <a href="https://opensource.org/licenses/MIT" target="_blank">The MIT License</a>.</li>
        <li style="margin-top:1em">
          Bahnschrift font from
          <a href="hhttps://www.onlinewebfonts.com/download/0a6ee448d1bd65c56f6cf256a7c6f20a">Online Web Fonts</a> by <a href="https://docs.microsoft.com/en-us/typography/font-list/bahnschrift" target="_blank">Microsoft Corporation</a>. <a href="https://docs.microsoft.com/es-es/typography/">License</a>.
        </li>
        <li>Share Tech font from <a href="https://fonts.google.com/specimen/Share+Tech" target="_blank">Google Fonts</a>. <a href="http://scripts.sil.org/cms/scripts/page.php?site_id=nrsi&id=OFL_web" target="_blank">Open Font License</a>.</li>
        <li>Material icons font from <a href="https://material.io/resources/icons/?style=baseline" target="_blank">Material Design</a>. <a href="https://www.apache.org/licenses/LICENSE-2.0.html" target="_blank">Apache License, v2.0</a>.</li>
        <li style="margin-top:1em">
          Beep sound reworked from <a href="https://freesound.org/people/thisusernameis/sounds/426888/" target="_blank">freesound</a>. <a href="https://creativecommons.org/publicdomain/zero/1.0/" target="_blank">CC0 1.0</a>.
        </li>
        <li>
          Chime sound reworked from <a href="https://freesound.org/people/kwahmah_02/sounds/245956/" target="_blank">freesound</a> by <a href="https://freesound.org/people/kwahmah_02/" target="_blank">kwahmah_02</a>. <a href="http://creativecommons.org/licenses/by/3.0/" target="_blank">CC BY 3.0</a>.
        </li>
      </ul>
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
