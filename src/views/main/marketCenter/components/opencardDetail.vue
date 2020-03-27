<template>
<el-container>
  <el-form ref="validateForm" :model="formData" label-width="110px" :label-position="'right'" style="width:100%;">
    <el-form-item label="活动类型:" v-if="type == 0">
      <el-radio-group disabled v-model="formData.businessData.needFees">
        <el-radio :label="0">免费会员卡</el-radio>
        <el-radio :label="1">付费会员卡</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item v-if="formData.businessData.needFees === 1" label="开卡金额:">{{ formData.businessData.fees }}元</el-form-item>
    <el-form-item label="开卡礼包:">
      <el-checkbox label="积分" :value="true" v-if="showPoints"></el-checkbox>
      <el-checkbox label="现金红包" :value="true" v-if="showRedBox"></el-checkbox>
      <el-checkbox label="优惠券" :value="showCard ? true : false" v-if="showCard"></el-checkbox>
      <el-checkbox label="商品赠送" :value="showExchange ? true : false" v-if="showExchange"></el-checkbox>
    </el-form-item>
    <el-form-item v-if="showPoints" label="积分:">赠送{{ formData.businessData.pointPrice }} 积分</el-form-item>
    <el-form-item v-if="showRedBox" label="现金红包:">赠送{{ formData.businessData.redPackPrice }} 元</el-form-item>
    <!-- 优惠券集合 -->
    <template v-if="showCard">
      <el-form-item label="优惠券:">
        <template v-for="item in formData.tableData">
          <el-form label-position="left" inline class="demo-table-expand" v-if="item.type == 3" :key="item.id">
            <el-form-item label="名称:" style="width:100%">{{ item.cardTitle }}</el-form-item>
            <el-form-item label="数量:">{{ item.valuesNum }} 张</el-form-item>
            <el-form-item label="有效期:">领取后 {{ item.days }} 天</el-form-item>
            <el-form-item label="使用条件:">满 {{ item.leastCost }} 元，立减 {{ item.reduceCost }} 元</el-form-item>
            <el-form-item label="消费特权:" style="width:100%">
              <template v-if="item.isPrivilege == 1">用户每领取后 {{ item.activeDays }} 天，激活 {{ item.activeNums }} 张</template>
              <template v-else>无</template>
            </el-form-item>
          </el-form>
        </template>
      </el-form-item>
    </template>
    <!-- 商品券集合 -->
    <template v-if="showExchange">
      <el-form-item label="商品券:">
        <template v-for="item in formData.tableData">
          <el-form label-position="left" inline class="demo-table-expand" v-if="item.type == 4" :key="item.id">
            <el-form-item label="名称:" style="width:100%">{{ item.cardMsg }}</el-form-item>
            <el-form-item label="数量:">{{ item.valuesNum }} 张</el-form-item>
            <el-form-item label="有效期:">领取后 {{ item.days }} 天</el-form-item>
            <el-form-item label="消费特权:" style="width:100%">
              <template v-if="item.isPrivilege == 1">用户每领取后 {{ item.activeDays }} 天，激活 {{ item.activeNums }} 张</template>
              <template v-else>无</template>
            </el-form-item>
          </el-form>
        </template>
      </el-form-item>
    </template>
    <el-form-item label="自定义条款1:" v-if="formData.businessData.customTerm1">{{ formData.businessData.customTerm1 }}</el-form-item>
    <el-form-item label="自定义条款2:" v-if="formData.businessData.customTerm2">{{ formData.businessData.customTerm2 }}</el-form-item>
    <el-form-item label="自定义条款3:" v-if="formData.businessData.customTerm3">{{ formData.businessData.customTerm3 }}</el-form-item>
  </el-form>
</el-container>
</template>
<script>
import { getGiftDetailsById } from '@/api/marketCenter';

export default {
  name: "opencardDetail",
  props: ["id", "type"],
  data() {
    return {
      showPoints: false,
      showRedBox: false,
      showCard: false,
      showExchange: false,
      formData: {
        businessData: {},
        tableData: []
      }
    }
  },
  created() {
    if (this.id) {
      getGiftDetailsById({ activeId: this.id }).then(res => {
        this.showPoints = res.businessData.pointPrice && res.businessData.pointPrice != 0 ? true : false;
        this.showRedBox = res.businessData.redPackPrice && res.businessData.redPackPrice != 0 ? true : false;
        this.showCard = res.tableData.filter(item => item.type == 3).length > 0 ? true : false;
        this.showExchange = res.tableData.filter(item => item.type == 4).length > 0 ? true : false;
        this.formData.businessData = res.businessData;
        this.formData.tableData = res.tableData;
      })
    }
  }
}
</script>
<style scoped>
.demo-table-expand {
  width: 90%;
  font-size: 0;
  border: 1px dashed #DCDFE6;
  padding: 5px 10px;
  margin-bottom: 10px;
  position: relative
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 10px;
  width: 50%;
}
</style>