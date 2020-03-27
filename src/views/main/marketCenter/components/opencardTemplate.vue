<template>
  <el-form ref="validateForm" :model="data"  label-position="right" label-width="80px">
    <!--  -->
    <el-form-item label="券名称:" prop="cardId" :rules="[ { required: true, message: '请选择兑换券', trigger: 'blur' }]">
      <el-select v-model="data.cardId" placeholder="请选择" @change="handleOnSelectChange">
        <el-option v-for="item in tableData" :key="item.id" :label="item.title" :value="item.id">
          <span style="float: left">{{ item.title }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">
            <template v-if="item.type == 0">满{{ item.leastCost }}元，立减{{ item.reduceCost }}元</template>
            <template v-else-if="item.type == 1">价值{{ item.price }}元</template>
          </span>
        </el-option>
      </el-select>
    </el-form-item>
    <!--  -->
    <el-form-item label="领取数量:" prop="valuesNum" :rules="[
      { validator: handleValidNumber.bind(this), trigger: 'change' },
      { validator: handleValidNumber.bind(this), trigger: 'blur' }
    ]">
      <el-input v-model="data.valuesNum" maxlength="5">
        <template slot="append">张 / 每人</template>
      </el-input>
    </el-form-item>
    <!--  -->
    <el-form-item label="消费特权:">
      <el-switch v-model="data.isPrivilege" :active-value="1" :inactive-value="0"></el-switch>
    </el-form-item>
    <el-form-item style="width:100%" v-if="data.isPrivilege == 1" prop="active" :rules="[
      { validator: handleValidActive.bind(this), trigger: 'change' },
      { validator: handleValidActive.bind(this), trigger: 'blur' }
    ]">
      每 <el-input v-model="data.activeDays" maxlength="5" class="demo-input"></el-input> 天，
      激活 <el-input v-model="data.activeNums" maxlength="5" class="demo-input"></el-input> 张
    </el-form-item>
    <!--  -->
    <el-form-item label="券说明:" v-if="showDesc">
      <el-input v-model="data.dsc" type="textarea" maxlength="100"></el-input>
    </el-form-item>
  </el-form>
</template>
<script>
import { isValidNumber } from "@/utils/validate";
import { findEntityCardList, getRfCardsByCreaterId } from '@/api/marketCenter';

export default {
  props: ["cardType", "showDesc"],
  name: "opencardTemplate",
  data() {
    return {
      tableData: [],
      data: {
        isPrivilege: 1,
        cardId: "",
        valuesNum: "",
        activeNums: "",
        activeDays: "",
        dsc: ""
      }
    }
  },
  created() {
    if (this.cardType == 0) {
      getRfCardsByCreaterId({}).then(res => {
        this.tableData = res.tableData.filter(item => item.fixedTerm != "");
      })
    } else {
      findEntityCardList({}).then(res => {
        this.tableData = res.tableData;
      })
    }
  },
  methods: {
    handleValidNumber(rule, value, callback) {
      if (parseFloat(value) == 0 || value == "" || !isValidNumber(value)) {
        callback(new Error("请输入非零整数"));
        return false;
      }
      callback();
    },
    handleValidActive(rule, value, callback) {
      if (parseFloat(this.data["activeDays"]) == 0 || this.data["activeDays"] == "" || !isValidNumber(this.data["activeDays"])) {
        callback(new Error("请输入非零整数"));
        return false;
      }
      if (parseFloat(this.data["activeNums"]) == 0 || this.data["activeNums"] == "" || !isValidNumber(this.data["activeNums"])) {
        callback(new Error("请输入非零整数"));
        return false;
      }
      if (parseFloat(this.data["activeNums"]) > parseFloat(this.data.valuesNum)) {
        callback(new Error("激活张数需小于总张数"));
        return false;
      }
      callback();
    },
    handleOnSelectChange(id) {
      let data = this.tableData.filter(item => item.id == id)[0];
      this.data.title = data.title;
      if (this.cardType == 1) {
        this.data.days = data.validDays;
        this.data.pic = data.pic;
        this.data.price = data.price;
      } else {
        this.data.leastCost = data.leastCost;
        this.data.reduceCost = data.reduceCost;
        this.data.fixedTerm = data.fixedTerm;
      }
    }
  }
}
</script>
<style scoped>
.el-form .el-input {
  width:90%!important;
}
.el-form .el-input.demo-input {
  width:100px!important;
}
.el-form .el-select {
  width:90%!important;
}
.el-form .el-textarea {
  width:90%!important;
}
</style>