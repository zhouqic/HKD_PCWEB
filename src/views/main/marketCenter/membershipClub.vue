<template>
  <div style="padding:20px 15px;margin:20px;">
    <el-row :gutter="20">
      <el-col class="col-item" :xs="8" :sm="8" :md="8" :lg="8" :xl="6">
        <div class="grid-content" @click="$router.push({ name: 'memberGrade' })">
          <img :src="icon_level" width="70" height="70" />
          <div class="title">会员等级</div>
          <div class="desc">建立会员成长体系, 增强会员粘性、忠诚度, 提高店铺收益</div>
        </div>
      </el-col>
      <el-col class="col-item" :xs="8" :sm="8" :md="8" :lg="8" :xl="6">
        <div class="grid-content" @click="$router.push({ name: 'memberEquity' })">
          <img :src="icon_equity" width="70" height="70" />
          <div class="title">会员权益</div>
          <div class="desc">设置不同等级会员, 享有不同权益, 使会员感知专有身份</div>
        </div>
      </el-col>
      <el-col class="col-item" :xs="8" :sm="8" :md="8" :lg="8" :xl="6">
        <div class="grid-content" @click="$router.push({ name: 'memberSign' })">
          <img :src="icon_sign" width="70" height="70" />
          <div class="title">签到设置</div>
          <div class="desc">设置会员通过签到获得积分, 增加会员粘性</div>
        </div>
      </el-col>
      <el-col class="col-item" :xs="8" :sm="8" :md="8" :lg="8" :xl="6">
        <div class="grid-content" @click="$router.push({ name: 'pointsDraw' })">
          <img :src="icon_point_draw" width="70" height="70" />
          <div class="title">积分抽奖</div>
          <div class="desc">通过消耗会员积分进行抽奖获得奖品, 促进活跃, 引流新客</div>
        </div>
      </el-col>
      <el-col class="col-item" :xs="8" :sm="8" :md="8" :lg="8" :xl="6">
        <div class="grid-content" @click="$router.push({ name: 'pointsInfo' })">
          <img :src="icon_point_product" width="70" height="70" />
          <div class="title">积分商品</div>
          <div class="desc">通过消耗会员积分进行兑换商品, 促进活跃, 引流新客</div>
        </div>
      </el-col>
      <el-col class="col-item" :xs="8" :sm="8" :md="8" :lg="8" :xl="6">
        <div class="grid-content" @click="$router.push({ name: 'memberGift' })">
          <img :src="icon_gift" width="70" height="70" />
          <div class="title">会员大礼包</div>
          <div class="desc">设置积分、现金红包、优惠券、专享礼品打包售卖,提高复购率和会员粘性</div>
        </div>
      </el-col>
      <el-col class="col-item" :xs="8" :sm="8" :md="8" :lg="8" :xl="6">
        <div class="grid-content" @click="$router.push({ name: 'specialTicket' })">
          <img :src="icon_quan" width="70" height="70" />
          <div class="title">每月返券</div>
          <div class="desc">专享优惠券,消费满足设定金额可使用优惠券,提高客单价;专享商品券,顾客领券后直接兑换商品,提高会员粘性</div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      icon_level: require("@/assets/market-center/club_level.png"),
      icon_equity: require("@/assets/market-center/club_quanyi.png"),
      icon_sign: require("@/assets/market-center/club_sign.png"),
      icon_point_draw: require("@/assets/market-center/club_point_draw.png"),
      icon_point_product: require("@/assets/market-center/club_point_product.png"),
      icon_quan: require("@/assets/market-center/club_quan.png"),
      icon_gift: require("@/assets/market-center/club_gift.png"),
    };
  },
  methods: {}
};
</script>


<style lang="scss" scoped>
.col-item {
  border-radius: 4px;
  margin-bottom: 20px;
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