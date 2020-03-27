<template>
  <el-form ref="validateForm" :model="wheelInfoForm" label-width="120px" :label-position="'right'" style="width:100%;">
    <!-- 礼品内容 -->
    <el-form-item label="礼品内容:" prop="type" :rules="[{ required: true, message: '请选择礼品', trigger: 'blur' }]">
      <el-radio-group v-model="wheelInfoForm.type" @change="handleOnGiftChange">
        <el-radio :label="1">优惠券</el-radio>
        <el-radio :label="2">商品兑换券</el-radio>
        <el-radio :label="3">积分</el-radio>
        <el-radio :label="4">现金红包</el-radio>
      </el-radio-group>
    </el-form-item>
    <!-- 请选择优惠券 -->
    <el-form-item v-if="wheelInfoForm.type === 1" label="请选择优惠券:" prop="award" :rules="[{ required: true, message: '请选择优惠券', trigger: 'blur' }]">
      <el-select v-model="wheelInfoForm.award" placeholder="请选择优惠券" @change="handleOnCouponChange">
        <el-option v-for="item in couponList" :key="item.id" :label="item.title" :value="item.id">
          <span style="float:left">{{ item.title }}</span>
          <span style="float:right;color:#8492a6;font-size:13px">满 {{ item.leastCost }} 元，立减 {{ item.reduceCost }} 元</span>
        </el-option>
      </el-select>
    </el-form-item>
    <!-- 请选择商品券 -->
    <el-form-item v-else-if="wheelInfoForm.type === 2" label="请选择商品券:" prop="award" :rules="[{ required: true, message: '请选择商品券', trigger: 'blur' }]">
      <el-select v-model="wheelInfoForm.award" placeholder="请选择商品兑换券" @change="handleOnEntryChange">
        <el-option v-for="item in entryList" :key="item.id" :label="item.title" :value="item.id">
          <span style="float:left"><img :src="item.pic" width="20" height="20" style="border-radius:50%;margin-right:5px;vertical-align:middle;">{{ item.title }}</span>
          <span style="float:right;color:#8492a6;font-size:13px">{{ item.price }} 元</span>
        </el-option>
      </el-select>
    </el-form-item>
    <!-- 积分量 -->
    <el-form-item v-else-if="wheelInfoForm.type === 3" label="积分量:" prop="award" :rules="[
      { validator: handleValidNumber.bind(this), trigger: 'change' },
      { validator: handleValidNumber.bind(this), trigger: 'blur' },
      { required: true, message: '请输入积分量', trigger: 'blur' }
    ]">
      <el-input v-model.number="wheelInfoForm.award" maxlength="7">
        <template slot="append">积分</template>
      </el-input>
    </el-form-item>
    <!-- 赠送金额 -->
    <el-form-item v-else-if="wheelInfoForm.type === 4" label="赠送金额:" prop="award" :rules="[
      { validator: handleValidPrice.bind(this), trigger: 'change' },
      { validator: handleValidPrice.bind(this), trigger: 'blur' },
      { required: true, message: '请输入赠送金额', trigger: 'blur' }
    ]">
      <el-input v-model="wheelInfoForm.award" maxlength="7">
        <template slot="append">元</template>
      </el-input>
    </el-form-item>
    <!-- 中奖概率 -->
    <el-form-item label="中奖概率:" prop="probability" :rules="[
      { validator: handleValidProbability.bind(this), trigger: 'change' },
      { validator: handleValidProbability.bind(this), trigger: 'blur' },
      { required: true, message: '请输入中奖概率', trigger: 'blur' }
    ]">
      <el-input v-model="wheelInfoForm.probability" :disabled="isDisabled" maxlength="3">
        <template slot="append">%</template>
      </el-input>
    </el-form-item>
    <!-- 奖品数量 -->
    <el-form-item label="奖品数量:" prop="num" :rules="[
      { validator: handleValidNumber.bind(this), trigger: 'change' },
      { validator: handleValidNumber.bind(this), trigger: 'blur' },
      { required: true, message: '请输入奖品数量', trigger: 'blur' }
    ]">
      <el-input v-model.number="wheelInfoForm.num" maxlength="7">
        <template slot="append">个</template>
      </el-input>
    </el-form-item>
  </el-form>
</template>
<script>
import { findEntityCardList, getRfCardsByCreaterId } from '@/api/marketCenter';
import { isValidPrice, isValidInteger } from "@/utils/validate";

export default {
  props: ["id"],
  name: "pointsDrawGiftForm",
  data() {
    return {
      couponList: [],
      entryList: [],
      awardId: "",
      isDisabled: false,
      wheelInfoForm: {
        sort: this.id,
        award: ""
      }
    }
  },
  created() {
    let $parent = this.$parent.$parent;
    this.handleValidNumber = $parent.handleValidNumber;
    if ($parent.formData.wheelInfoSets.length == 6) {
      this.wheelInfoForm.probability = 100 - $parent.probability;
      this.isDisabled = true;
    }
  },
  methods: {
    handleOnCouponChange(val) {
      let data = this.couponList.filter(item => item.id == val)[0];
      if (data) {
        this.wheelInfoForm.title = data.title ? data.title : "";
        this.wheelInfoForm.leastCost = data.leastCost ? data.leastCost : "";
        this.wheelInfoForm.reduceCost = data.reduceCost ? data.reduceCost : "";
      }
    },
    handleOnEntryChange(val) {
      let data = this.entryList.filter(item => item.id == val)[0];
      if (data) {
        this.wheelInfoForm.title = data.title ? data.title : "";
        this.wheelInfoForm.leastCost = data.leastCost ? data.leastCost : "";
        this.wheelInfoForm.reduceCost = data.reduceCost ? data.reduceCost : "";
      }
    },
    handleOnGiftChange(val) {
      this.wheelInfoForm.title = "";
      this.wheelInfoForm.award = "";
      this.wheelInfoForm.leastCost = "";
      this.wheelInfoForm.reduceCost = "";
      this.wheelInfoForm.price = "";
      if (val === 1 && this.couponList.length == 0) {
        getRfCardsByCreaterId({}).then(res => {
          this.couponList = res.tableData.filter(item => item.fixedTerm != "");
        })
      }
      if (val === 2 && this.entryList.length == 0) {
        findEntityCardList({}).then(res => {
          this.entryList = res.tableData;
        })
      }
      this.$forceUpdate();
    },
    handleValidProbability(rule, value, callback) {
      if (value == 0) {
        callback();
        return false;
      }
      if (value == "" || !isValidInteger(value)) {
        callback(new Error("请输入非零整数"));
        return false;
      }
      callback();
    },
    handleValidPrice(rule, value, callback) {
      if (parseFloat(value) == 0 || !isValidPrice(value)) {
        callback(new Error("请输入合理的金额"));
        return false;
      }
      callback();
    }
  }
}
</script>
<style scoped>
.el-form .el-input {
  width:90%!important;
}
.el-form .el-select {
  width:90%!important;
}
</style>