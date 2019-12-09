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
        project by <a href="https://kpaces.com" target="_blank">kpaces</a>
      </p>

      <h3>Support</h3>
      <p>Please, consider making a donation if you find ZNC useful</p>
      <form
        action="https://www.paypal.com/cgi-bin/webscr"
        method="post"
        target="_top"
      >
        <input type="hidden" name="cmd" value="_s-xclick" />
        <input type="hidden" name="hosted_button_id" value="5AD2NY5KZSYPQ" />
        <input
          type="image"
          src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif"
          border="0"
          name="submit"
          title="PayPal - The safer, easier way to pay online!"
          alt="Donate with PayPal button"
        />
        <img
          alt=""
          border="0"
          src="https://www.paypal.com/en_ES/i/scr/pixel.gif"
          width="1"
          height="1"
        />
      </form>
      <h3>ZNC uses</h3>
      <ul>
        <li>
          <a href="https://github.com/cwilso/volume-meter/" target="_blank"
            >Volume meter code</a
          >
          by
          <a href="https://cwilso.com/" target="_blank">Chris Wilson</a>.
          <a href="https://opensource.org/licenses/MIT" target="_blank"
            >The MIT License</a
          >
        </li>
        <li style="margin-top:1em">
          Bahnschrift font from
          <a
            href="hhttps://www.onlinewebfonts.com/download/0a6ee448d1bd65c56f6cf256a7c6f20a"
            >Online Web Fonts</a
          >
          by
          <a
            href="https://docs.microsoft.com/en-us/typography/font-list/bahnschrift"
            target="_blank"
            >Microsoft Corporation</a
          >. <a href="https://docs.microsoft.com/es-es/typography/">License</a>
        </li>
        <li>
          Share Tech font from
          <a href="https://fonts.google.com/specimen/Share+Tech" target="_blank"
            >Google Fonts</a
          >
          <a
            href="http://scripts.sil.org/cms/scripts/page.php?site_id=nrsi&id=OFL_web"
            target="_blank"
            >Open Font License</a
          >
        </li>
        <li>
          Material icons font from
          <a
            href="https://material.io/resources/icons/?style=baseline"
            target="_blank"
            >Material Design</a
          >
          <a
            href="https://www.apache.org/licenses/LICENSE-2.0.html"
            target="_blank"
            >Apache License, v2.0</a
          >
        </li>
        <li style="margin-top:1em">
          Beep sounds reworked from
          <a
            href="https://freesound.org/people/thisusernameis/sounds/426888/"
            target="_blank"
            >freesound</a
          >
          <a
            href="https://creativecommons.org/publicdomain/zero/1.0/"
            target="_blank"
            >CC0 1.0</a
          >
        </li>
        <li>
          Chime sound reworked from
          <a
            href="https://freesound.org/people/kwahmah_02/sounds/245956/"
            target="_blank"
            >freesound</a
          >
          by
          <a href="https://freesound.org/people/kwahmah_02/" target="_blank"
            >kwahmah_02</a
          >.
          <a href="http://creativecommons.org/licenses/by/3.0/" target="_blank"
            >CC BY 3.0</a
          >
        </li>
        <li style="margin-top:1em">
          <a href="https://wangchujiang.com/hotkeys/" target="_blank"
            >Hotkeys-js</a
          >.
          <a
            href="https://github.com/mikolalysenko/moving-median"
            target="_blank"
            >Moving-median</a
          >.
          <a
            href="https://github.com/NightCatSama/vue-slider-component"
            target="_blank"
            >Vue-slider-component</a
          >
        </li>
        <li><a href="https://vuejs.org/" target="_blank">Vue</a></li>
      </ul>

      <h3>Thanks</h3>
      <p>Elissa Clair. Jack Gómez Robisco. My always patient family. My students</p>

      <h3>Contact</h3>
      <a href="mailto:manuel.llorens@kpaces.com" target="_blank"
        >Manuel Llorens</a
      >
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
