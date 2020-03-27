<template>
  <div style="padding:20px 15px;margin:20px;">
    <el-row :gutter="20">
      <el-col class="col-item" :xs="8" :sm="8" :md="8" :lg="8" :xl="6" v-if="$store.state.permission.showShangMeng === true">
        <div class="grid-content bg-purple" @click="$router.push({ name: 'shangMeng' })">
          <div class="box">
            <div class="title">智慧商盟</div>
            <div class="desc">商家联盟活动, 增加店铺曝光率, 提高进店率</div>
          </div>
          <img :src="icon_meng" width="70" height="70" />
        </div>
      </el-col>
      <el-col class="col-item" :xs="8" :sm="8" :md="8" :lg="8" :xl="6">
        <div class="grid-content bg-purple-light" @click="$router.push({ name: 'redpacketSquare' })">
          <div class="box">
            <div class="title">红包广场</div>
            <div class="desc">顾客正确说出设定口令即可获得现金红包, 高效营销传播, 增加店铺曝光率</div>
          </div>
          <img :src="icon_box" width="70" height="70" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      icon_meng: require("@/assets/market-center/b_meng.png"),
      icon_box: require("@/assets/market-center/b_box.png")
    };
  },
  methods: {}
};
</script>


<style lang="scss" scoped>
.col-item {
  border-radius: 4px;
  margin-bottom: 20px;
  max-width: 320px;
  .bg-purple {
    background: #E3B742;
  }
  .bg-purple-light {
    background: #FF6B5C;
  }
  .grid-content {
    border-radius: 4px;
    padding: 15px;
    padding-right: 10px;
    overflow: hidden;
    cursor: pointer;
    img {
      float: left;
      margin-left: 10px;
    }
    div.box {
      float: left;
      color: #fff;
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