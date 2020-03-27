<template>
  <div style="padding:20px 15px;margin:20px;">
    <el-row :gutter="30">
      <el-col class="col-item" :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
        <div class="grid-content" @click="$router.push({ name: 'sharebox' })">
          <img :src="icon_box" width="80" height="80" />
          <div class="title">分享红包</div>
          <div class="desc">老带新拓客营销, 转发分享获取红包, 直接抵扣支付金额</div>
        </div>
      </el-col>
      <el-col class="col-item" :xs="6" :sm="6" :md="6" :lg="6" :xl="6" v-if="$store.state.permission.showManJian === true">
        <div class="grid-content" @click="$router.push({ name: 'fullcut' })">
          <img :src="icon_money" width="80" height="80" />
          <div class="title">满减优惠</div>
          <div class="desc">小恩小惠锁顾客, 提高消费转化率;多消费多优惠, 提高店铺收益</div>
        </div>
      </el-col>
      <el-col class="col-item" :xs="6" :sm="6" :md="6" :lg="6" :xl="6" v-if="$store.state.permission.showCiKa === true">
        <div class="grid-content" @click="$router.push({ name: 'paymentCard' })">
          <img :src="icon_card" width="80" height="80" />
          <div class="title">付费次卡</div>
          <div class="desc">一种利用次数进行消费的模式, 稳定客源, 提高进店率</div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      icon_card: require("@/assets/market-center/auto_c_card.png"),
      icon_box: require("@/assets/market-center/auto_share_box.png"),
      icon_money: require("@/assets/market-center/auto_reduce.png")
    };
  },
  methods: {}
};
</script>


<style lang="scss" scoped>
.col-item {
  border-radius: 4px;
  margin-bottom: 20px;
  max-width: 260px;
  .grid-content {
    background: #fff;
    border-radius: 4px;
    padding: 30px 25px;
    overflow: hidden;
    text-align: center;
    cursor: pointer;
    img {
      margin-bottom: 10px;
    }
    div {
      margin-bottom: 10px;
      word-break: break-all;
    }
    div.title {
      font-size: 17px;
      line-height: 30px;
    }
    div.desc {
      font-size: 12px;
      line-height: 20px;
    }
  }
  // .grid-content:hover {
  //   box-shadow: 0px 1px 5px #4a4a4a;
  // }
}
</style>