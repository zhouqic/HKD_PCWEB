<template>
<div class="main-content" style="padding: 20px 20px;">
  <el-tabs v-model="activeTab">
    <el-tab-pane label="专享优惠券" name="0"></el-tab-pane>
    <el-tab-pane label="专享商品券" name="1"></el-tab-pane>
  </el-tabs>
  <special-card v-if="activeTab === '0'"></special-card>
  <special-entity-card v-if="activeTab === '1'"></special-entity-card>
</div>
</template>
<script>
  import specialCard from "./specialCard";
  import specialEntityCard from "./specialEntityCard";

  export default {
    components: { specialCard, specialEntityCard },
    data() {
      return {
        activeTab: "0",
      }
    }
  }
</script>