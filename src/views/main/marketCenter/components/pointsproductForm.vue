<template>
<el-container>
  <!-- 步骤条 -->
  <el-header v-if="!id" style="margin-bottom:10px;">
    <el-steps :active="activeStep" finish-status="success" :process-status="processStatus">
      <el-step title="店铺信息"></el-step>
      <el-step title="商品信息"></el-step>
    </el-steps>
  </el-header>
  <!-- 店铺信息验证 -->
  <shop-info v-if="activeStep == 0"></shop-info>
  <!-- 商品信息 -->
  <pointsproduct-info v-else-if="activeStep == 1" :id="id" ref="pointsproductInfo"></pointsproduct-info>
</el-container>
</template>
<script>
import { ShopInfo } from "../../baopinyinliu/common";
import pointsproductInfo from "./pointsproductInfo";

export default {
  props: ["id"],
  components: { pointsproductInfo, ShopInfo },
  data() {
    return {
      date: [],
      activeStep: !this.id ? 0 : 1,
      processStatus: !this.id ? 'success' : 'text'// wait / process / finish / error / success
    }
  }
}
</script>