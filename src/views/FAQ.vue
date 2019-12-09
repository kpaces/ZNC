<template>
  <div class="faq">
    <Cover>
      <h2>FAQ</h2>
      <ul>
        <li class="question">Does ZNC record or send any audio information?</li>
        <li>
          No. ZNC only runs on the client browser and doesn't record anything. You can explore the
          <a
            href="https://github.com/kpaces/ZNC"
            target="_blank"
          >source code</a> yourself.
        </li>
        <li
          class="question"
        >Does ZNC uses cookies, tracking code or records any other type of information?</li>
        <li>No, it doesn't. ZNC is designed for use in a school environment and is designed accordingly.</li>
        <li class="question">What are the numbers in the Sensibility slider?</li>
        <li>The numbers in the Sensibility slider means nothing. They are just there so that you can remember the settings you like. Anyway, ZNC will remember your last setting.</li>
        <li class="question">Why does ZNC not sense some short sounds?</li>
        <li>ZNC uses a running median filter to discard short but loud noises. In the near future you will be able to adjust that filter to some extend.</li>
        <li class="question">Is ZNC going to present some kind of information when the time is up?</li>
        <li>Yes, it is going to show statistical information in the near future, if you want it.</li>
        <li class="question">Is ZNC completely free?</li>
        <li>
          Yes, it is, and will always be. But you may consider a
          <router-link to="/about">donation</router-link>in order to help me maintain it.
        </li>
        <li class="question">Does ZNC works in any browser?</li>
        <li>Yes, and no. It can't work in iOS and iPadOS with any browser other than Safari. But it does work in any other case with any modern browser.</li>
        <li class="question">Can I still use the <a
            href="https://chrome.google.com/webstore/detail/zero-noise-classroom/pgpkohbgbjmihckldcacljomfkkaogjd?utm_source=chrome-app-launcher-info-dialog"
            target="_blank"
          >old ZNC version</a>?</li>
        <li>Yes, you can. But it was designed only for Chromebooks and it will not be updated in the future.</li>
      </ul>
    </Cover>
  </div>
</template>

<script>
import Cover from "@/components/Cover.vue";

export default {
  name: "faq",
  components: {
    Cover
  }
};
</script>

<style scoped lang="stylus">
.question
  margin-top 1em !important
  font-weight 600
</style>
