<template>
  <div class="faq">
    <Cover>
      <h2>FAQ</h2>
      <ul>
        <li class="question">Why ZNC?</li>
        <li>
          Because, as an educator, I like to help my students to be aware of
          themselves and to be able to make decisions autonomously.
        </li>
        <li class="question">Does ZNC record or send any audio information?</li>
        <li>
          No. ZNC only runs on your browser and doesn't record anything. You can
          explore the
          <a
            href="https://github.com/kpaces/ZNC"
            target="_blank"
          >source code</a>
          yourself.
        </li>
        <li class="question">
          Does ZNC uses cookies, tracking code or records any other type of
          information?
        </li>
        <li>
          No, it doesn't. ZNC is designed for use in a school environment and it
          works accordingly.
        </li>
        <li class="question">What does ZNC do when the meter hits red?</li>
        <li>
          It waits for one and a half seconds of continous red and then
          automatically does what you chooses in the config screen.
        </li>
        <li class="question">What is the webhook setting for?</li>
        <li>
          If you use services like IFTTT or Zapier, you can tell ZNC to trigger
          your own actions when the time is up. Contact me if you need support.
        </li>
        <li class="question">Can I control ZNC with the keyboard?</li>
        <li>
          Yes, you can pause and resume with the SPACEBAR and stop it with the
          ENTER key. You can also use a presentation remote to pause and stop
          the timer.
        </li>
        <li class="question">Is ZNC accurate?</li>
        <li>Of course not. Please do not use it as a measuring device.</li>
        <li class="question">What does the numbers in the Sensibility slider mean?</li>
        <li>
          The numbers in the Sensibility slider means nothing. They are just
          there so that you can remember the settings you like. Anyway, ZNC will
          remember your last setting.
        </li>
        <li class="question">Why does ZNC not sense some short sounds?</li>
        <li>
          ZNC uses a running median filter to discard short but loud noises. You
          can adjust that filter in the config screen.
        </li>
        <li class="question">Is ZNC completely free?</li>
        <li>
          Yes, it is, and will always be. But you may consider a
          <router-link to="/about">donation</router-link>in order to help me
          maintain it.
        </li>
        <li class="question">Does ZNC runs in any browser?</li>
        <li>
          Yes, and no. It can't work in iOS and iPadOS with any browser other
          than Safari. But it does work in any other case with any modern
          browser.
        </li>
        <li class="question">
          Can I still use the
          <a
            href="https://chrome.google.com/webstore/detail/zero-noise-classroom/pgpkohbgbjmihckldcacljomfkkaogjd?utm_source=chrome-app-launcher-info-dialog"
            target="_blank"
          >old ZNC version</a>?
        </li>
        <li>
          Yes, you can. But it was designed for Chromebooks only and it will not
          be updated in the future.
        </li>
        <li class="question">May I report a bug or suggest a new functionality?</li>
        <li>
          Of course. You can do it in the
          <router-link to="https://github.com/kpaces/ZNC/issues">issues page</router-link>.
        </li>
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
