<template>
  <count-to :startVal="0" :endVal="endVal" :decimals="decimals !== undefined ? decimals : 2" :duration="2500"></count-to>
</template>
<script>
import CountTo from "vue-count-to";

export default {
  name: "Count",
  components: { CountTo },
  props: ["endVal", "decimals"]
};
</script>

