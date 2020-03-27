<template>
  <div class="myservices-container main-content">
    <div class="row-item">
      <div class="row-item-label">公司名称：</div>
      <div class="row-item-content">{{ data.inc }}</div>
    </div>
    <div class="row-item">
      <div class="row-item-label">联系人名称：</div>
      <div class="row-item-content">{{ data.name }}</div>
    </div>
    <div class="row-item">
      <div class="row-item-label">联系地址：</div>
      <div class="row-item-content">{{ data.address }}</div>
    </div>
    <div class="row-item">
      <div class="row-item-label">联系方式：</div>
      <div class="row-item-content">{{ data.mobile }}</div>
    </div>
  </div>
</template>
<script>
import { getAgentBriefInfo } from "@/api/sjsettings"
export default {
  name: "myservices_view",
  data() {
    return {
      data: {}
    }
  },
  created() {
    getAgentBriefInfo().then(res => {
      this.data = res.tableData;
    })
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.myservices-container {
  padding: 40px !important;
  font-size: 14px;
  color: #606266;
  .row-item {
    overflow: hidden;
    margin-bottom: 40px;
    .row-item-label {
      float: left;
      width: 115px;
      font-weight: bolder;
      margin-right: 65px;
    }
    .row-item-content {
      float: left;
    }
  }
}
</style>