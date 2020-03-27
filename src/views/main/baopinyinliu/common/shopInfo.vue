<template>
  <div class="shop-info">
    <div class="row-item">
      <div class="row-item-label">名称：</div>
      <div class="row-item-content">
        <span v-if="data.name">{{ data.name }}</span>
        <span v-else style="color: #EE454C;">请前往云店装修完善信息</span>
      </div>
    </div>
    <div class="row-item">
      <div class="row-item-label">电话：</div>
      <div class="row-item-content">
        <span v-if="data.tel">{{ data.tel }}</span>
        <span v-else style="color: #EE454C;">请前往云店装修完善信息</span>
      </div>
    </div>
    <div class="row-item">
      <div class="row-item-label">营业时间：</div>
      <div class="row-item-content">
        <span v-if="data.businessTime">{{ data.businessTime.replace(/,/, "~") }}</span>
        <span v-else style="color: #EE454C;">请前往云店装修完善信息</span>
      </div>
    </div>
    <div class="row-item">
      <div class="row-item-label">地址：</div>
      <div class="row-item-content">
        <span v-if="data.address">{{ data.address }}</span>
        <span v-else style="color: #EE454C;">请前往云店装修完善信息</span>
      </div>
    </div>
    <!-- <div class="row-item" style="margin-top: 10px;">
      <div class="row-item-label" style="width: auto;"><b>粉丝群二维码上传：</b></div>
        <div class="row-item-content">
          <div style="color: #EE454C;">7天需更换一张，过期失效</div>
          <el-upload action="" :http-request="handleSubmitFile" :show-file-list="false" :on-change="handleOnFSCodeChange">
            <img v-if="data.fansQrcode" :src="data.fansQrcode" width="200">
            <i v-else class="el-icon-plus"></i>
          </el-upload>
        </div>
    </div> -->
    <img class="status" src="./complate.png" width="112" height="102">
  </div>
</template>
<script>
import { getRfShopInfoByCreaterId, saveRfShopInfo } from '@/api/shopmanage';
import _ from 'lodash';

export default {
  name: 'shopInfo',
  data() {
    return {
      URL: URL,
      data: {
        id: '',
        address: '',
        name: '',
        tel: '',
        businessTime: '',
        fansQrcode: ''
      }
    }
  },
  created() {
    this.handleGetYunShopInfo();
  },
  beforeDestroy() {
    Object.keys(this.data).forEach(item => {
      this.data[item] = '';
    })
  },
  methods: {
    handleGetYunShopInfo() {
      getRfShopInfoByCreaterId().then(res => {
        Object.keys(this.data).forEach(item => {
          this.data[item] = res.tableData[item];
        })
       if (_.findKey(this.data, (val, key) => !val && key != 'fansQrcode')) {
         this.$parent.$parent.processStatus = "error";
       } else {
         this.$parent.$parent.processStatus = "success";
       }
      })
    },
    handleSubmitFile(config){
      let formData = new FormData();
      formData.append("fansQrcode", config.file);
      formData.append("id", this.data.id);
      saveRfShopInfo(formData).then(res => {
        this.handleGetYunShopInfo();
      })
    },
    handleOnFSCodeChange(file) {
      this.data.customerServiceCode = file.raw;
    },
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.shop-info {
  margin-top: 5px;
  margin-bottom: 25px;
  position: relative;
  img.status {
    position: absolute;
    right: 0;
    top: 25px;
  }
  .row-item {
    overflow: hidden;
    line-height: 32px;
    font-size: 14px;
    color: #606266;
    .row-item-label {
      float: left;
      width: 70px;
      font-weight: bolder;
      margin-right: 10px;
    }
    .row-item-content {
      float: left;
      width: auto;
    }
  }
  /deep/ .el-upload i {
    width: 220px;
    height: 130px;
    font-size: 28px;
    color: #8c939d;
    line-height: 130px;
    background: #E8E8E8;
    text-align: center;
  }
}
</style>