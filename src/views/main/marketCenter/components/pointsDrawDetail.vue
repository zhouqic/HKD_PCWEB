<template>
<div>
  <!-- 信息 -->
  <el-table :data="tableData" border :show-header="false" style="width:450px;margin:0 auto;">
    <el-table-column label="key" prop="key" width="200px"></el-table-column>
    <el-table-column label="value" prop="value"></el-table-column>
  </el-table>
  <!-- 奖项 -->
  <div class="container">
    <div class="row">
      <div class="left" id="1">
        <template v-if="palaceData.filter(item => item.sort == 1).length">
          <!-- 优惠券 -->
          <template v-if="palaceData.filter(item => item.sort == 1)[0].type == 1">
            <img class="item" :src="icon_wheel_coupon">
            <div class="item title">{{ palaceData.filter(item => item.sort == 1)[0].reduceCost }} 元</div>
            <div class="item probability">{{ palaceData.filter(item => item.sort == 1)[0].probability }} %</div>
          </template>
          <!-- 实物券 -->
         <template v-else-if="palaceData.filter(item => item.sort == 1)[0].type == 2">
            <img class="item" :src="icon_wheel_entry">
            <div class="item title">{{ palaceData.filter(item => item.sort == 1)[0].title }}</div>
            <div class="item probability">{{ palaceData.filter(item => item.sort == 1)[0].probability }} %</div>
          </template>
          <!-- 积分 -->
          <template v-else-if="palaceData.filter(item => item.sort == 1)[0].type == 3">
            <img class="item" :src="icon_wheel_point">
            <div class="item title">{{ palaceData.filter(item => item.sort == 1)[0].award }} 积分</div>
            <div class="item probability">{{ palaceData.filter(item => item.sort == 1)[0].probability }} %</div>
          </template>
          <!-- 现金 -->
          <template v-else-if="palaceData.filter(item => item.sort == 1)[0].type == 4">
            <img class="item" :src="icon_wheel_cash">
            <div class="item title">{{ palaceData.filter(item => item.sort == 1)[0].award }} 元</div>
            <div class="item probability">{{ palaceData.filter(item => item.sort == 1)[0].probability }} %</div>
          </template>
        </template>
        <template v-else>谢谢参与</template>
      </div>
      <div class="center" id="2">
         <template v-if="palaceData.filter(item => item.sort == 2).length">
          <!-- 优惠券 -->
          <template v-if="palaceData.filter(item => item.sort == 2)[0].type == 1">
            <img class="item" :src="icon_wheel_coupon">
            <div class="item title">{{ palaceData.filter(item => item.sort == 2)[0].reduceCost }} 元</div>
            <div class="item probability">{{ palaceData.filter(item => item.sort == 2)[0].probability }} %</div>
          </template>
          <!-- 实物券 -->
         <template v-else-if="palaceData.filter(item => item.sort == 2)[0].type == 2">
            <img class="item" :src="icon_wheel_entry">
            <div class="item title">{{ palaceData.filter(item => item.sort == 2)[0].title }}</div>
            <div class="item probability">{{ palaceData.filter(item => item.sort == 2)[0].probability }} %</div>
          </template>
          <!-- 积分 -->
          <template v-else-if="palaceData.filter(item => item.sort == 2)[0].type == 3">
            <img class="item" :src="icon_wheel_point">
            <div class="item title">{{ palaceData.filter(item => item.sort == 2)[0].award }} 积分</div>
            <div class="item probability">{{ palaceData.filter(item => item.sort == 2)[0].probability }} %</div>
          </template>
          <!-- 现金 -->
          <template v-else-if="palaceData.filter(item => item.sort == 2)[0].type == 4">
            <img class="item" :src="icon_wheel_cash">
            <div class="item title">{{ palaceData.filter(item => item.sort == 2)[0].award }} 元</div>
            <div class="item probability">{{ palaceData.filter(item => item.sort == 2)[0].probability }} %</div>
          </template>
        </template>
        <template v-else>谢谢参与</template>
      </div>
      <div class="right" id="3">
        <template v-if="palaceData.filter(item => item.sort == 3).length">
          <!-- 优惠券 -->
          <template v-if="palaceData.filter(item => item.sort == 3)[0].type == 1">
            <img class="item" :src="icon_wheel_coupon">
            <div class="item title">{{ palaceData.filter(item => item.sort == 3)[0].reduceCost }} 元</div>
            <div class="item probability">{{ palaceData.filter(item => item.sort == 3)[0].probability }} %</div>
          </template>
          <!-- 实物券 -->
         <template v-else-if="palaceData.filter(item => item.sort == 3)[0].type == 2">
            <img class="item" :src="icon_wheel_entry">
            <div class="item title">{{ palaceData.filter(item => item.sort == 3)[0].title }}</div>
            <div class="item probability">{{ palaceData.filter(item => item.sort == 3)[0].probability }} %</div>
          </template>
          <!-- 积分 -->
          <template v-else-if="palaceData.filter(item => item.sort == 3)[0].type == 3">
            <img class="item" :src="icon_wheel_point">
            <div class="item title">{{ palaceData.filter(item => item.sort == 3)[0].award }} 积分</div>
            <div class="item probability">{{ palaceData.filter(item => item.sort == 3)[0].probability }} %</div>
          </template>
          <!-- 现金 -->
          <template v-else-if="palaceData.filter(item => item.sort == 3)[0].type == 4">
            <img class="item" :src="icon_wheel_cash">
            <div class="item title">{{ palaceData.filter(item => item.sort == 3)[0].award }} 元</div>
            <div class="item probability">{{ palaceData.filter(item => item.sort == 3)[0].probability }} %</div>
          </template>
        </template>
        <template v-else>谢谢参与</template>
      </div>
    </div>
    <div class="row">
      <div class="left" id="8">
        <template v-if="palaceData.filter(item => item.sort == 8).length">
          <!-- 优惠券 -->
          <template v-if="palaceData.filter(item => item.sort == 8)[0].type == 1">
            <img class="item" :src="icon_wheel_coupon">
            <div class="item title">{{ palaceData.filter(item => item.sort == 8)[0].reduceCost }} 元</div>
            <div class="item probability">{{ palaceData.filter(item => item.sort == 8)[0].probability }} %</div>
          </template>
          <!-- 实物券 -->
         <template v-else-if="palaceData.filter(item => item.sort == 8)[0].type == 2">
            <img class="item" :src="icon_wheel_entry">
            <div class="item title">{{ palaceData.filter(item => item.sort == 8)[0].title }}</div>
            <div class="item probability">{{ palaceData.filter(item => item.sort == 8)[0].probability }} %</div>
          </template>
          <!-- 积分 -->
          <template v-else-if="palaceData.filter(item => item.sort == 8)[0].type == 3">
            <img class="item" :src="icon_wheel_point">
            <div class="item title">{{ palaceData.filter(item => item.sort == 8)[0].award }} 积分</div>
            <div class="item probability">{{ palaceData.filter(item => item.sort == 8)[0].probability }} %</div>
          </template>
          <!-- 现金 -->
          <template v-else-if="palaceData.filter(item => item.sort == 8)[0].type == 4">
            <img class="item" :src="icon_wheel_cash">
            <div class="item title">{{ palaceData.filter(item => item.sort == 8)[0].award }} 元</div>
            <div class="item probability">{{ palaceData.filter(item => item.sort == 8)[0].probability }} %</div>
          </template>
        </template>
        <template v-else>谢谢参与</template>
      </div>
      <div class="center wheel-inster">
        <img :src="icon_wheel_inster" class="inster" height="140">
      </div>
      <div class="right" id="4">
        <template v-if="palaceData.filter(item => item.sort == 4).length">
          <!-- 优惠券 -->
          <template v-if="palaceData.filter(item => item.sort == 4)[0].type == 1">
            <img class="item" :src="icon_wheel_coupon">
            <div class="item title">{{ palaceData.filter(item => item.sort == 4)[0].reduceCost }} 元</div>
            <div class="item probability">{{ palaceData.filter(item => item.sort == 4)[0].probability }} %</div>
          </template>
          <!-- 实物券 -->
         <template v-else-if="palaceData.filter(item => item.sort == 4)[0].type == 2">
            <img class="item" :src="icon_wheel_entry">
            <div class="item title">{{ palaceData.filter(item => item.sort == 4)[0].title }}</div>
            <div class="item probability">{{ palaceData.filter(item => item.sort == 4)[0].probability }} %</div>
          </template>
          <!-- 积分 -->
          <template v-else-if="palaceData.filter(item => item.sort == 4)[0].type == 3">
            <img class="item" :src="icon_wheel_point">
            <div class="item title">{{ palaceData.filter(item => item.sort == 4)[0].award }} 积分</div>
            <div class="item probability">{{ palaceData.filter(item => item.sort == 4)[0].probability }} %</div>
          </template>
          <!-- 现金 -->
          <template v-else-if="palaceData.filter(item => item.sort == 4)[0].type == 4">
            <img class="item" :src="icon_wheel_cash">
            <div class="item title">{{ palaceData.filter(item => item.sort == 4)[0].award }} 元</div>
            <div class="item probability">{{ palaceData.filter(item => item.sort == 4)[0].probability }} %</div>
          </template>
        </template>
        <template v-else>谢谢参与</template>
      </div>
    </div>
    <div class="row">
      <div class="left" id="7">
        <template v-if="palaceData.filter(item => item.sort == 7).length">
          <!-- 优惠券 -->
          <template v-if="palaceData.filter(item => item.sort == 7)[0].type == 1">
            <img class="item" :src="icon_wheel_coupon">
            <div class="item title">{{ palaceData.filter(item => item.sort == 7)[0].reduceCost }} 元</div>
            <div class="item probability">{{ palaceData.filter(item => item.sort == 7)[0].probability }} %</div>
          </template>
          <!-- 实物券 -->
         <template v-else-if="palaceData.filter(item => item.sort == 7)[0].type == 2">
            <img class="item" :src="icon_wheel_entry">
            <div class="item title">{{ palaceData.filter(item => item.sort == 7)[0].title }}</div>
            <div class="item probability">{{ palaceData.filter(item => item.sort == 7)[0].probability }} %</div>
          </template>
          <!-- 积分 -->
          <template v-else-if="palaceData.filter(item => item.sort == 7)[0].type == 3">
            <img class="item" :src="icon_wheel_point">
            <div class="item title">{{ palaceData.filter(item => item.sort == 7)[0].award }} 积分</div>
            <div class="item probability">{{ palaceData.filter(item => item.sort == 7)[0].probability }} %</div>
          </template>
          <!-- 现金 -->
          <template v-else-if="palaceData.filter(item => item.sort == 7)[0].type == 4">
            <img class="item" :src="icon_wheel_cash">
            <div class="item title">{{ palaceData.filter(item => item.sort == 7)[0].award }} 元</div>
            <div class="item probability">{{ palaceData.filter(item => item.sort == 7)[0].probability }} %</div>
          </template>
        </template>
        <template v-else>谢谢参与</template>
      </div>
      <div class="center" id="6">
        <template v-if="palaceData.filter(item => item.sort == 6).length">
          <!-- 优惠券 -->
          <template v-if="palaceData.filter(item => item.sort == 6)[0].type == 1">
            <img class="item" :src="icon_wheel_coupon">
            <div class="item title">{{ palaceData.filter(item => item.sort == 6)[0].reduceCost }} 元</div>
            <div class="item probability">{{ palaceData.filter(item => item.sort == 6)[0].probability }} %</div>
          </template>
          <!-- 实物券 -->
         <template v-else-if="palaceData.filter(item => item.sort == 6)[0].type == 2">
            <img class="item" :src="icon_wheel_entry">
            <div class="item title">{{ palaceData.filter(item => item.sort == 6)[0].title }}</div>
            <div class="item probability">{{ palaceData.filter(item => item.sort == 6)[0].probability }} %</div>
          </template>
          <!-- 积分 -->
          <template v-else-if="palaceData.filter(item => item.sort == 6)[0].type == 3">
            <img class="item" :src="icon_wheel_point">
            <div class="item title">{{ palaceData.filter(item => item.sort == 6)[0].award }} 积分</div>
            <div class="item probability">{{ palaceData.filter(item => item.sort == 6)[0].probability }} %</div>
          </template>
          <!-- 现金 -->
          <template v-else-if="palaceData.filter(item => item.sort == 6)[0].type == 4">
            <img class="item" :src="icon_wheel_cash">
            <div class="item title">{{ palaceData.filter(item => item.sort == 6)[0].award }} 元</div>
            <div class="item probability">{{ palaceData.filter(item => item.sort == 6)[0].probability }} %</div>
          </template>
        </template>
        <template v-else>谢谢参与</template>
      </div>
      <div class="right" id="5">
        <template v-if="palaceData.filter(item => item.sort == 5).length">
          <!-- 优惠券 -->
          <template v-if="palaceData.filter(item => item.sort == 5)[0].type == 1">
            <img class="item" :src="icon_wheel_coupon">
            <div class="item title">{{ palaceData.filter(item => item.sort == 5)[0].reduceCost }} 元</div>
            <div class="item probability">{{ palaceData.filter(item => item.sort == 5)[0].probability }} %</div>
          </template>
          <!-- 实物券 -->
         <template v-else-if="palaceData.filter(item => item.sort == 5)[0].type == 2">
            <img class="item" :src="icon_wheel_entry">
            <div class="item title">{{ palaceData.filter(item => item.sort == 5)[0].title }}</div>
            <div class="item probability">{{ palaceData.filter(item => item.sort == 5)[0].probability }} %</div>
          </template>
          <!-- 积分 -->
          <template v-else-if="palaceData.filter(item => item.sort == 5)[0].type == 3">
            <img class="item" :src="icon_wheel_point">
            <div class="item title">{{ palaceData.filter(item => item.sort == 5)[0].award }} 积分</div>
            <div class="item probability">{{ palaceData.filter(item => item.sort == 5)[0].probability }} %</div>
          </template>
          <!-- 现金 -->
          <template v-else-if="palaceData.filter(item => item.sort == 5)[0].type == 4">
            <img class="item" :src="icon_wheel_cash">
            <div class="item title">{{ palaceData.filter(item => item.sort == 5)[0].award }} 元</div>
            <div class="item probability">{{ palaceData.filter(item => item.sort == 5)[0].probability }} %</div>
          </template>
        </template>
        <template v-else>谢谢参与</template>
      </div>
    </div>
  </div>
  <!-- 活动说明 -->
  <div style="width:450px;margin:0 auto;">
    <h3>活动说明</h3>
    <div>{{ explain }}</div>
  </div>
</div>
</template>
<script>
import { parseTime } from "@/utils";
export default {
  name: "pointsDrawDetail",
  props: ["data"],
  data() {
    return {
      icon_wheel_cash: require("@/assets/market-center/icon_wheel_cash.png"),
      icon_wheel_coupon: require("@/assets/market-center/icon_wheel_coupon.png"),
      icon_wheel_entry: require("@/assets/market-center/icon_wheel_entry.png"),
      icon_wheel_inster: require("@/assets/market-center/icon_wheel_inster.png"),
      icon_wheel_point: require("@/assets/market-center/icon_wheel_point.png"),
      tableData: [],
      palaceData: [],
      explain: ""
    }
  },
  created() {
    let data = this.data;
    this.explain = data.memo;
    this.palaceData = data.wheelInfoSets;
    this.tableData = [
      { key: '活动名称', value: data.name },
      { key: '活动时间', value: parseTime(data.beginDate, '{y}-{m}-{d} {h}:{m}') + ' ~ ' + parseTime(data.endDate, '{y}-{m}-{d} {h}:{m}') },
      { key: '每次消耗积分', value: data.costPoints + ' 积分' },
      { key: '每人参与次数', value: data.maxNumbers == -1 ? '不限次数' : (data.maxNumbers + ' 次数') },
      { key: '总中奖概率', value: parseFloat(data.probability).toFixed(1) + '%' }
    ]
  }
}
</script>
<style lang="scss">
  .container {
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
      color: #F56C6C;
      line-height: 140px;
      font-size: 15px;
      border: 1px dashed #DCDFE6;
      border-radius: 10px;
      text-align: center;
      img:not(.inster){
        width: 100px;
      }
    }
    .center {
      margin: 0 15px;
    }
    .wheel-inster {
      border: none;
    }
  }
</style>