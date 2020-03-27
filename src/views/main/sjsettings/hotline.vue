<template>
  <div class="hotline-container main-content">
    <div class="row-item">
      <div class="row-item-label">客服热线：</div>
      <div class="row-item-content">{{ data.tel }}</div>
    </div>
    <div class="row-item" v-if="data.qq">
      <div class="row-item-label">客服QQ：</div>
      <div class="row-item-content">{{ data.qq }}</div>
    </div>
    <div class="row-item" v-if="data.weChat">
      <div class="row-item-label">客服微信：</div>
      <div class="row-item-content">{{ data.weChat }}</div>
    </div>
  </div>
</template>
<script>
import { getRfCustomerService } from "@/api/sjsettings"
export default {
  name: "hotline_view",
  data() {
    return {
      data: {}
    }
  },
  created() {
    getRfCustomerService().then(res => {
      this.data = res.tableData;
    })
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.hotline-container {
  padding: 40px !important;
  font-size: 16px;
  color: #101010;
  .row-item {
    overflow: hidden;
    margin-bottom: 40px;
    .row-item-label {
      float: left;
      width: 85px;
    }
    .row-item-content {
      float: left;
    }
  }
}
</style>