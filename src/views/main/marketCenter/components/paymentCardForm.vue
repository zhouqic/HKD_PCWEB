<template>
<el-form ref="validateForm" :model="formData" :rules="formRules" label-width="120px" :label-position="'right'">
  <el-form-item label="次卡名称:" prop="title">
    <el-input v-model.trim="formData.title" maxlength="12"></el-input>
  </el-form-item>
  <el-form-item label="购买价格:" prop="price">
    <el-input v-model="formData.price" maxlength="10"></el-input>
  </el-form-item>
  <el-form-item label="原价:" prop="prePrice">
    <el-input v-model="formData.prePrice" maxlength="10"></el-input>
  </el-form-item>
  <el-form-item label="有效天数:" prop="days">
    <el-input v-model="formData.days" maxlength="5"></el-input>
  </el-form-item>
  <el-form-item label="次数:">
    <el-radio-group v-model="numType">
      <el-radio :label="0">自定义</el-radio>
      <el-radio :label="1">不限次数</el-radio>
    </el-radio-group>
  </el-form-item>
  <el-form-item prop="num" v-if="numType == 0">
    <el-input v-model="formData.num" maxlength="5">
      <template slot="append">次</template>
    </el-input>
  </el-form-item>
  <el-form-item label="购买说明:">
    <el-radio-group v-model="buyNumType">
      <el-radio :label="0">自定义</el-radio>
      <el-radio :label="1">不限张数</el-radio>
    </el-radio-group>
  </el-form-item>
  <el-form-item prop="buyNum" v-if="buyNumType == 0">
    <el-input v-model="formData.buyNum" maxlength="5">
      <template slot="prepend">每人可购买张数</template>
      <template slot="append">次</template>
    </el-input>
  </el-form-item>
  <el-form-item label="使用提醒:" prop="minCharge">
    <el-input v-model="formData.reminders" maxlength="16"></el-input>
  </el-form-item>
  <el-form-item label="使用须知:" prop="beginTime">
    <el-input type="textarea" v-model="formData.notice" maxlength="1024"></el-input>
  </el-form-item>
</el-form>
</template>
<script>
import { isValidPrice, isValidNumber } from "@/utils/validate";

export default {
  data() {
    const validPrice = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请输入合法金额"));
        return false;
      }
      if (parseFloat(value) == 0) {
        callback(new Error("购买价格应大于0"));
        return false;
      }
      if (!isValidPrice(value)) {
        callback(new Error("请输入整数最多7位，小数点后1到2位的数字"));
      } else {
        callback();
      }
    }
    const validPrePrice = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请输入合法金额"));
        return false;
      }
      if (parseFloat(value) == 0) {
        callback(new Error("原价需大于0"));
        return false;
      }
      if (parseFloat(this.formData.price) > parseFloat(this.formData.prePrice) && this.formData.price) {
        callback(new Error("原价应大于等于购买价格"));
        return false;
      }
      if (!isValidPrice(value)) {
        callback(new Error("请输入整数最多7位，小数点后1到2位的数字"));
      } else {
        callback();
      }
    }
    const validNum = (rule, value, callback) => {
      if (value == "" || parseFloat(value) == 0) {
        callback(new Error("请输入合理的非零整数"));
        return false;
      }
      if (!isValidNumber(value)) {
        callback(new Error("请输入合理的非零整数"));
        return false;
      } else {
        callback();
      }
    }
    const validTitle = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请输入次卡名称"));
        return false;
      }
      callback();
    }
    return {
      numType: 0,
      buyNumType: 0,
      formData: {
        title: '',
        price: '',
        prePrice: '',
        buyNum: '',
        notice: '请在有效期内使用，过期作废。',
        reminders: '使用时请主动出示次卡方便门店核销。',
        num: '',
        days: ''
      },
      formRules: {
        price: [
          { validator: validPrice.bind(this), trigger: "change" },
          { validator: validPrice.bind(this), trigger: "blur" }
        ],
        prePrice: [
          { validator: validPrePrice.bind(this), trigger: "change" },
          { validator: validPrePrice.bind(this), trigger: "blur" }
        ],
        num: [
          { validator: validNum.bind(this), trigger: "change" },
          { validator: validNum.bind(this), trigger: "blur" }
        ],
        buyNum: [
          { validator: validNum.bind(this), trigger: "change" },
          { validator: validNum.bind(this), trigger: "blur" }
        ],
        days: [
          { validator: validNum.bind(this), trigger: "blur" },
          { validator: validNum.bind(this), trigger: "change" }
        ],
        title: [
          { validator: validTitle.bind(this), trigger: "change" },
          { validator: validTitle.bind(this), trigger: "blur" },
        ]
      }
    }
  },
  watch: {
    numType(n, o) {
      if (n == 0) {
        this.formData.num = "";
      } else {
        this.formData.num = 0;
      }
    },
    buyNumType(n, o) {
      if (n == 0) {
        this.formData.buyNum = "";
      } else {
        this.formData.buyNum = 0;
      }
    }
  },
}
</script>
<style scoped>
.el-form .el-input {
  width:400px;
}
.el-form .el-textarea {
  width:400px!important;
}
</style>