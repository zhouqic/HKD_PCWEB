<template>
  <el-form-item class="sort" :class="position" :id="'sort' + id">
    <template v-if="id==9">
      <img :src="icon_wheel_inster" class="inster" height="140">
    </template>
    <template v-else-if="id != 9 && data.length">
      <i class="el-icon-error" @click="handleDeleteAward()"></i>
      <!-- 优惠券 -->
      <template v-if="data[0].type == 1">
        <img class="item" :src="icon_wheel_coupon">
        <div class="item title">{{ data[0].reduceCost }} 元</div>
        <div class="item probability">{{ data[0].probability }} %</div>
      </template>
      <!-- 实物券 -->
      <template v-else-if="data[0].type == 2">
        <img class="item" :src="icon_wheel_entry">
        <div class="item title">{{ data[0].title }}</div>
        <div class="item probability">{{ data[0].probability }} %</div>
      </template>
      <!-- 积分 -->
      <template v-else-if="data[0].type == 3">
        <img class="item" :src="icon_wheel_point">
        <div class="item title">{{ data[0].award }} 积分</div>
        <div class="item probability">{{ data[0].probability }} %</div>
      </template>
      <!-- 现金 -->
      <template v-else-if="data[0].type == 4">
        <img class="item" :src="icon_wheel_cash">
        <div class="item title">{{ data[0].award }} 元</div>
        <div class="item probability">{{ data[0].probability }} %</div>
      </template>
    </template>
    <template v-else>
      <i class="el-icon-plus" @click="handleChooseAward()"></i>
    </template>
  </el-form-item>
</template>
<script>
export default {
  name: "pointsDrawTemplate",
  props: ["position", "id", "data"],
  data() {
    return {
      icon_wheel_cash: require("@/assets/market-center/icon_wheel_cash.png"),
      icon_wheel_coupon: require("@/assets/market-center/icon_wheel_coupon.png"),
      icon_wheel_entry: require("@/assets/market-center/icon_wheel_entry.png"),
      icon_wheel_inster: require("@/assets/market-center/icon_wheel_inster.png"),
      icon_wheel_point: require("@/assets/market-center/icon_wheel_point.png")
    }
  },
  methods: {
    handleChooseAward() {
      this.$parent.$parent.$parent.handleChooseAward(this.id)
    },
    handleDeleteAward() {
      this.$parent.$parent.$parent.handleDeleteAward(this.id)
    }
  }
}
</script>

<style lang="scss">
  .add-container {
    display: flex;
    flex-direction: column;
    height: 450px;
    width: 450px;
    margin: 20px auto;
    .row {
      height: 140px;
      display: flex;
      .item {
        display: block;
        margin: 0 auto;
        line-height: 20px;
      }
      .title {
        color: #000;
        font-weight: bold;
        margin-bottom: 5px;
        width: 125px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .probability {
        color: #999;
        font-size: 12px;
      }
    }
    .row:nth-child(2) {
      margin: 15px 0;
    }
    .left, .center, .right {
      flex: 1;
      height: 140px;
      color: #999;
      font-size: 15px;
      border: 1px dashed #DCDFE6;
      border-radius: 10px;
      text-align: center;
      position: relative;
      img:not(.inster){
        width: 100px;
      }
      i.el-icon-plus {
        line-height: 140px;
        font-size: 45px;
        cursor: pointer;
      }
      i.el-icon-error {
        position: absolute;
        right: 0;
        top: 0;
        font-size: 20px;
        cursor: pointer;
      }
    }
    .center {
      margin: 0 15px;
    }
    #sort9 {
      border: none;
    }
  }
</style>