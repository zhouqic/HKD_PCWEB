<template>
<el-container>
  <el-form ref="validateForm" :model="formData" :rules="formRules" label-width="110px" :label-position="'right'" style="width:100%;">
    <!-- 礼包名称 -->
    <el-form-item label="礼包名称:" prop="title" :rules="[
      { required: true, message: '请输入礼包名称', trigger: 'change' },
      { required: true, message: '请输入礼包名称', trigger: 'blur' },
    ]">
      <el-input v-model="formData.title" maxlength="12"></el-input>
    </el-form-item>
    <!-- 礼包总价值 -->
    <el-form-item label="礼包总价值:">
      <el-input v-model="formData.totalMoney" disabled><template slot="append">元</template></el-input>
    </el-form-item>
    <!-- 商盟礼包 -->
    <el-form-item label="商盟礼包:">
      <el-checkbox label="优惠券" v-model="showCard"></el-checkbox>
      <el-checkbox label="商品赠送" v-model="showExchange"></el-checkbox>
    </el-form-item>
    <!-- 优惠券集合 -->
    <el-form-item v-if="showCard" label="优惠券:">
      <el-button @click="handleOpenCardDialog(0)">添加优惠券</el-button>
    </el-form-item>
    <el-form-item v-if="showCard">
      <el-form label-position="left" inline class="demo-table-expand" v-for="(item, i) in formData.cards" :key="item.id">
        <el-button type="danger" round size="mini" @click="formData.cards.splice(i, 1)">删除</el-button>
        <el-form-item label="名称:" style="width:100%"><span style="font-weight:bold;float:left;">{{ item.title }}</span></el-form-item>
        <el-form-item label="数量:"> {{ item.totalNum }} 张/人</el-form-item>
        <el-form-item label="有效期:">领取后 {{ item.validDays }} 天</el-form-item>
        <el-form-item label="使用条件:" style="width:100%">满 {{ item.leastCost }} 元，立减 {{ item.reduceCost }} 元</el-form-item>
        <el-form-item label="消费特权:" style="width:100%">
          <template v-if="item.isPrivilege == 1">用户每领取后 {{ item.days }} 天，激活 {{ item.num }} 张</template>
          <template v-else>无</template>
        </el-form-item>
        <el-form-item label="券说明:" style="width:100%">{{ item.dsc }}</el-form-item>
      </el-form>
    </el-form-item>
    <!-- 商品券集合 -->
    <el-form-item v-if="showExchange" label="商品券:">
      <el-button @click="handleOpenCardDialog(1)">添加商品券</el-button>
    </el-form-item>
    <el-form-item v-if="showExchange">
      <el-form label-position="left" inline class="demo-table-expand" v-for="(item, i) in formData.products" :key="item.id">
        <el-button type="danger" round size="mini" @click="formData.products.splice(i, 1)">删除</el-button>
        <el-form-item label="名称:" style="width:100%"><span style="font-weight:bold;float:left;">{{ item.title }}</span></el-form-item>
        <el-form-item label="数量:"> {{ item.totalNum }} 张/人</el-form-item>
        <el-form-item label="有效期:">领取后 {{ item.validDays }} 天</el-form-item>
        <el-form-item label="消费特权:" style="width:100%">
          <template v-if="item.isPrivilege == 1">用户每领取后 {{ item.days }} 天，激活 {{ item.num }} 张</template>
          <template v-else>无</template>
        </el-form-item>
        <el-form-item label="券说明:" style="width:100%">{{ item.dsc }}</el-form-item>
      </el-form>
    </el-form-item>
    <!-- 活动说明 -->
    <el-form-item label="活动说明1:">
      <el-input v-model="formData.notice1" type="textarea" maxlength="200"></el-input>
    </el-form-item>
    <el-form-item label="活动说明2:">
      <el-input v-model="formData.notice2" type="textarea" maxlength="200"></el-input>
    </el-form-item>
    <el-form-item label="活动说明3:">
      <el-input v-model="formData.notice3" type="textarea" maxlength="200"></el-input>
    </el-form-item>
  </el-form>
  <!-- 弹窗 -->
  <el-dialog title="设置券信息" :visible.sync="showDialog" width="500px" append-to-body :close-on-click-modal="false" :close-on-press-escape="false">
    <opencard-template v-if="showDialog" :cardType="tableType" ref="opencardTemplate" :show-desc="true"></opencard-template>

    <span slot="footer" class="dialog-footer">
      <el-button @click="showDialog=false;tableType='';">取 消</el-button>
      <el-button type="primary" @click="handleSubmitForm">确 定</el-button>
    </span>
  </el-dialog>
</el-container>
</template>
<script>
import { isValidPrice, isValidNumber } from "@/utils/validate";
import opencardTemplate from "./opencardTemplate";

export default {
  name: "shangmengSignup",
  components: { opencardTemplate },
  data() {
    const validNum = (rule, value, callback) => {
      if (value == "" || !isValidNumber(value)) {
        callback(new Error("请输入非零整数"));
        return false;
      }
      callback();
    };
    return {
      tableType: 0, // 0,优惠券；1，实物券
      showDialog: false,
      showCard: false,
      showExchange: false,
      formData: {
        activityId: '',
        cards: [],
        products: [],
        totalMoney: '',//礼包总价值
        point: "",
        fees: "",
        needFees: 0
      },
      formRules: {}
    }
  },
  created() {
    this.formData.activityId = this.$parent.$parent.$parent.id
  },
  methods: {
    handleOpenCardDialog(type) {
      this.tableType = type;
      this.showDialog = true;
    },
    handleGetTotalMoney() {
      let total = 0;
      this.formData.cards.forEach(item => {
        total += parseFloat(item.price) * parseFloat(item.totalNum);
      })
      this.formData.products.forEach(item => {
        total += parseFloat(item.price) * parseFloat(item.totalNum);
      })
      return total.toFixed(2);
    },
    handleSubmitForm() {
      let $el = this.$refs["opencardTemplate"];
      $el.$refs["validateForm"].validate(valid => {
        if (valid) {
          let data = {};
          data.cardId = $el.data.cardId;
          data.title = $el.data.title;
          data.totalNum = $el.data.valuesNum;
          data.isPrivilege = $el.data.isPrivilege;
          data.days = $el.data.activeDays;
          data.num = $el.data.activeNums;
          data.dsc = $el.data.dsc;
          if (this.tableType == 1) {
            data.validDays = $el.data.days;
            data.pic = $el.data.pic;
            data.price = $el.data.price;
            this.formData.products.push(data);
          } else {
            data.validDays = $el.data.fixedTerm;
            data.price = $el.data.reduceCost;
            data.leastCost = $el.data.leastCost;
            data.reduceCost = $el.data.reduceCost;
            this.formData.cards.push(data);
          }
          this.formData.totalMoney = this.handleGetTotalMoney();
          this.showDialog = false;
          this.tableType = "";
        }
      })
    }
  }
}
</script>
<style scoped>
.el-form .el-input {
  width:100%!important;
}
.el-form .el-textarea {
  width:100%!important;
}
.demo-table-expand {
  width: 90%;
  font-size: 0;
  border: 1px dashed #DCDFE6;
  padding: 5px 10px;
  margin-bottom: 10px;
  position: relative
}
.demo-table-expand .el-button {
  position: absolute;
  right: 5px;
  top: 5px;
  padding: 5px 10px;
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
.demo-table-expand .el-form-item .el-input {
  width:75px!important;
}
</style>