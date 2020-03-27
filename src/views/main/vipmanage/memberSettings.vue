<template>
  <div style="padding:20px 15px;margin:20px;">
    <el-row :gutter="28">
      <el-col class="col-item" :xs="8" :sm="8" :md="8" :lg="8" :xl="6">
        <div class="grid-content" @click="$router.push({ name: 'memberCard' })">
          <img :src="icon_card" width="70" height="70" />
          <div class="title">会员卡创建</div>
          <div class="desc">创建电子会员卡, 让精准化营销变得简单</div>
        </div>
      </el-col>
      <el-col class="col-item" :xs="8" :sm="8" :md="8" :lg="8" :xl="6">
        <div class="grid-content" @click="$router.push({ name: 'opencardGift' })">
          <img :src="icon_gift" width="70" height="70" />
          <div class="title">新人礼</div>
          <div class="desc">对领取会员卡的会员进行奖励, 顾客沉淀</div>
        </div>
      </el-col>
      <el-col class="col-item" :xs="8" :sm="8" :md="8" :lg="8" :xl="6">
        <div class="grid-content" @click="$router.push({ name: 'pointsRule' })">
          <img :src="icon_point" width="70" height="70" />
          <div class="title">积分规则</div>
          <div class="desc">会员通过消费、互动增加店铺积分, 增加会员粘性</div>
        </div>
      </el-col>
      <el-col class="col-item" :xs="8" :sm="8" :md="8" :lg="8" :xl="6">
        <div class="grid-content" @click="$router.push({ name: 'chongzhiFanli' })">
          <img :src="icon_fanli" width="70" height="70" />
          <div class="title">充值返利</div>
          <div class="desc">对于充值达到设定金额的会员进行赠送金额或实物, 顾客沉淀, 资金沉淀</div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      icon_card: require("@/assets/market-center/m_set_card.png"),
      icon_point: require("@/assets/market-center/m_set_point.png"),
      icon_gift: require("@/assets/market-center/m_set_gift.png"),
      icon_fanli: require("@/assets/market-center/m_set_fanli.png")
    };
  },
  methods: {}
};
</script>


<style lang="scss" scoped>
.col-item {
  border-radius: 4px;
  margin-bottom: 20px;
  max-width: 350px;
  .grid-content {
    background: #FFF;
    border-radius: 4px;
    padding: 15px;
    padding-right: 10px;
    overflow: hidden;
    cursor: pointer;
    img, div {
      float: left;
    }
    div {
      margin-left: 10px;
      word-break: break-all;
      width: calc(100% - 80px);
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