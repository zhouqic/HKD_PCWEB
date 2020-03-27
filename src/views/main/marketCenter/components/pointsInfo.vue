<template>
<div class="main-content" style="padding: 20px 20px;">
  <el-tabs v-model="activeTab">
    <el-tab-pane label="积分商品" name="0"></el-tab-pane>
    <el-tab-pane label="积分订单" name="1"></el-tab-pane>
  </el-tabs>
  <points-product v-if="activeTab === '0'"></points-product>
  <points-order v-if="activeTab === '1'"></points-order>
</div>
</template>
<script>
  import pointsProduct from "./pointsProduct";
  import pointsOrder from "./pointsOrder";

  export default {
    components: { pointsProduct, pointsOrder },
    data() {
      return {
        activeTab: "0",
      }
    }
  }
</script>