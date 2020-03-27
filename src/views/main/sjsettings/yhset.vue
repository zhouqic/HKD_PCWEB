<template>
  <div class="yhset-container main-content">
    <div class="item">
      <div class="row-item">
        <div class="row-item-label"><b>储值余额优惠共享</b></div>
        <div class="row-item-content" style="line-height:30px;">
          <el-switch v-model="rechargeAlone" @change="handlerOnSwitchChange"></el-switch>
        </div>
      </div>
      <div class="row-item">
        <div class="row-item-label" style="width: 100%;">说明：</div>
        <div class="row-item-content">
          若打开开关，储值余额与其他优惠可叠加使用；<br>
          若关闭开关，储值余额与其他优惠不可叠加使；
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getRfNewGiftsNumByCreaterId, setRechargeAlone } from "@/api/sjsettings";
import { Message } from 'element-ui';

export default {
  name: "yhset_view",
  data() {
    return {
      rechargeAlone: false
    }
  },
  created() {
    getRfNewGiftsNumByCreaterId().then(res => {
      this.rechargeAlone = res.tableData.shopSet.rechargeAlone == 1 ? false : true;
    })
  },
  methods: {
    handlerOnSwitchChange(flag) {
      setRechargeAlone({ rechargeAlone: flag ? 0 : 1 }).then(res =>{
        if (res.success) {
          Message({
            message: "设置成功",
            type: 'success',
            duration: 3 * 1000
          });
        }
      })
    }
  },
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.yhset-container {
  padding: 40px !important;
  font-size: 16px;
  font-family: SourceHanSansSC-bold;
  color: #101010;
  .item{
    margin-bottom: 30px;
    .row-item {
      overflow: hidden;
      margin-bottom: 15px;
      padding-left: 40px;
      .row-item-label {
        float: left;
        width: 130px;
        line-height: 32px;
        margin-right: 20px;
      }
      .row-item-content {
        float: left;
        line-height: 28px;
      }
    }
  }
}
</style>