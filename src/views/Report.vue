<template>
  <div class="report">
    <Cover>
      <h2>Final stats</h2>
      <svg id="pie" width="80%" viewBox="-1 -1 2 2">
        <path v-for="(path, i) in paths" :d="path" :key="i" :fill="fills[i]" />
      </svg>
      <div id="pie-legend">
        <div class="legend" v-for="(percent, i) in percentages" :key="i">
          <div
            class="legend-item"
            :style="`background-color:${fills[i]}`"
          ></div>
          {{ Math.round(percent * 100.0) }} %
        </div>
      </div>
    </Cover>
  </div>
</template>

<script>
import Cover from "@/components/Cover.vue";
import { mapState } from "vuex";

export default {
  name: "report",

  data() {
    return {
      fills: [
        "rgba(128,255,128,.65)",
        "rgba(255,192,80,.65)",
        "rgba(255,100,100,.65)"
      ]
    };
  },

  components: {
    Cover
  },

  computed: {
    percentages() {
      const Sum = (acc, value) => acc + value;
      const total = this.stats.stats.reduce(Sum);
      return this.stats.stats.map(value => value / total);
    },

    cumPercentages() {
      const cumulativeSum = (sum => value => (sum += value))(0);

      return this.percentages.map(cumulativeSum);
    },

    paths() {
      const coordenates = [this.coordenates(0)].concat(
        this.cumPercentages.map(p => this.coordenates(p))
      );
      const arcType = this.percentages.map(p => (p > 0.5 ? 1 : 0));
      const path = [];

      for (let i = 0; i < this.cumPercentages.length; i++) {
        path[i] = `M ${coordenates[i][0]} ${coordenates[i][1]} A 1 1 0 ${
          arcType[i]
        } 1 ${coordenates[i + 1][0]} ${coordenates[i + 1][1]} L 0 0`;
      }

      return path;
    },

    ...mapState({
      stats: "stats"
    })
  },

  created() {
    if (this.stats.stats.length === 0) {
      this.$router.push("/").catch(err => {});
    }
  },

  methods: {
    coordenates(percent) {
      const pi2 = 2 * Math.PI;
      const halfpi = Math.PI / 2;

      return [Math.cos(pi2 * percent), Math.sin(pi2 * percent)];
    }
  }
};
</script>

<style lang="stylus">
#pie
  margin-top 1em
  z-index 0
  max-width 400px

#pie-legend
  margin-top 2em
  display flex
  justify-content center

.legend
  display flex
  align-items center
  white-space nowrap

.legend-item
  width 2em
  height 2em
  margin-right 1em
  display inline-block

.legend:not(:first-child) .legend-item
  margin-left 2em
</style>
