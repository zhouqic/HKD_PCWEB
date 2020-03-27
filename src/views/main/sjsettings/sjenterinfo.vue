<template>
  <div class="enterinfo-container main-content">
    <div style="overflow:hidden;margin-bottom: 40px;">
      <img v-if="data.authInfo.status == 1" src="./image/success.png" width="47" style="float:left;margin-right:15px;">
      <img v-else-if="data.authInfo.status == -1" src="./image/failed.png" width="47" style="float:left;margin-right:15px;">
      <img v-else-if="data.authInfo.status == -1" src="./image/wait.png" width="47" style="float:left;margin-right:15px;">
      <div v-if="data.authInfo.status == 1" style="float:left;">
        <b>审核成功</b><br><br>恭喜，您已通过实名认证！
      </div>
      <div v-else-if="data.authInfo.status == -1" style="float:left;">
        <br><b>审核失败</b>
      </div>
      <div v-else style="float:left;">
        <br><b>等待审核</b>
      </div>
    </div>
    <div class="item">
      <h4 class="row-title">支付通道汇率</h4>
      <div class="row-item">
        <div class="row-item-label">微信支付：</div>
        <div class="row-item-content" v-if="data.rate">{{ data.rate }}%</div>
      </div>
      <div class="row-item">
        <div class="row-item-label">支付宝支付：</div>
        <div class="row-item-content" v-if="data.rateAli">{{ data.rateAli }}%</div>
      </div>
    </div>
    <div class="item">
      <h4 class="row-title">个人信息</h4>
      <div class="row-item">
        <div class="row-item-label">签约名称：</div>
        <div class="row-item-content">{{ data.authInfo.signedName }}</div>
      </div>
      <div class="row-item">
        <div class="row-item-label">身份证号：</div>
        <div class="row-item-content">{{ data.authInfo.idCard }}</div>
      </div>
    </div>
    <div class="item">
      <h4 class="row-title">结算账户信息</h4>
      <div class="row-item">
        <div class="row-item-label">联系人：</div>
        <div class="row-item-content">{{ data.authInfo.contactor }}</div>
      </div>
      <div class="row-item">
        <div class="row-item-label">绑定手机号：</div>
        <div class="row-item-content">{{ data.authInfo.bindMobile }}</div>
      </div>
      <div class="row-item">
        <div class="row-item-label">银行卡号：</div>
        <div class="row-item-content">{{ data.authInfo.bankAccountNumber }}</div>
      </div>
      <div class="row-item">
        <div class="row-item-label">开户名：</div>
        <div class="row-item-content">{{ data.authInfo.accountName }}</div>
      </div>
      <div class="row-item">
        <div class="row-item-label">卡类型：</div>
        <div class="row-item-content" v-if="data.authInfo.bankAccountType == 'PRIVATE_CASH'">对私</div>
        <div class="row-item-content" v-else>对公</div>
      </div>
      <div class="row-item">
        <div class="row-item-label">开户地区：</div>
        <div class="row-item-content">{{ data.authInfo.bankCardCity }}</div>
      </div>
      <div class="row-item">
        <div class="row-item-label">开户银行：</div>
        <div class="row-item-content">{{ data.authInfo.bankName }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import { getRfAuthInfoByCreaterId } from "@/api/sjsettings"
export default {
  name: "enterinfo_view",
  data() {
    return {
      data: {
        authInfo: {}
      }
    }
  },
  created() {
    getRfAuthInfoByCreaterId().then(res => {
      this.data = res.tableData;
    })
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.enterinfo-container {
  padding: 40px !important;
  font-size: 14px;
  color: #606266;
  .item{
    margin-bottom: 30px;
    .row-title {
      font-size: 16px;
      font-weight: bolder;
      margin-bottom: 20px;
    }
    .row-item {
      overflow: hidden;
      margin-bottom: 15px;
      .row-item-label {
        float: left;
        width: 85px;
        font-weight: bolder;
        margin-right: 20px;
      }
      .row-item-content {
        float: left;
      }
    }
  }
}
</style>