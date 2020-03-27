<template>
  <div class="panel-card clearfix" :class="{active: isActived}">
    <div class="img-box fl">
      <img :src="data.arriveUrl">
      <div class="text-center" v-if="showLabel">
        <span v-if="data.memberType == 0">新客</span>
        <span v-else-if="data.memberType == 1">会员</span>
        <span v-else-if="data.memberType == 2">店员</span>
        <span v-else-if="data.memberType == 3">熟客</span>
      </div>
    </div>
    <div class="data-box fl">
      <div class="data-item" v-if="showName" style="color:#000;font-weight: bolder;">{{ data.username }}</div>
      <div class="data-item">{{ data.arriveTime }}</div>
      <div class="data-item">{{ data.grade ? data.grade : '暂无等级' }}</div>
      <div class="data-item" v-if="!showName">到店次数{{ data.repeatedArrivalTimes }}次</div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["data", "isActived", "showLabel", "showName"]

}
</script>
<style lang="scss" scoped>
.panel-card.active {
  background: #ffc700;
}
.panel-card {
  padding: 10px 20px 0;
  margin-bottom: 10px;
  font-size: 12px;
  cursor: pointer;
  .img-box{
    margin-right: 20px;
    img {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: block;
    }
    div {
      width: 50px;
      color: #fff;
      line-height: 20px;
      margin: 0 auto;
      background: #288ce2;
      border-radius: 8px;
      position: relative;
      top: -15px;
    }
  }
  .data-box {
    padding-top: 5px;
    .data-item {
      color: #666;
      line-height: 24px;
    }
  }
}
</style>