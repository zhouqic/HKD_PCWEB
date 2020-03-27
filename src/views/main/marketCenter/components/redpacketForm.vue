<template>
<el-form ref="validateForm" :model="formData" :rules="formRules" label-width="120px" :label-position="'right'">
  <el-form-item label="口令模板:" prop="pId">
    <el-select v-model="formData.pId" placeholder="请选择" @change="handleOnSelectChange">
      <el-option v-for="item in pOption" :key="item.id" :label="item.command" :value="item.id"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item v-if="formData.pId != -1" label="红包口令:" prop="command" :rules="[
    { required: true,  message: '请选择红包口令', trigger: 'change, blur' }
  ]">
    <el-select v-model="formData.command" placeholder="请选择">
      <el-option v-for="item in cOption" :key="item.id" :label="item.command" :value="item.command"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item v-else label="红包口令:" prop="command1" :rules="[
    { required: true,  message: '请输入红包口令', trigger: 'change, blur' }
  ]">
    <el-input v-model="formData.command" maxlength="25"></el-input>
  </el-form-item>
  <el-form-item label="红包类型:" prop="totalBudget">
    <el-radio-group v-model="formData.type">
      <el-radio label="IMMEDIATELY">即时红包</el-radio>
      <el-radio label="COUNTDOWN">定时红包</el-radio>
    </el-radio-group>
  </el-form-item>
  <el-form-item label="红包金额:" prop="redPacketMoney">
    <el-input v-model="formData.redPacketMoney" maxlength="7">
      <template slot="append">元</template>
    </el-input>
  </el-form-item>
  <el-form-item label="红包个数:" prop="num">
    <el-input v-model="formData.num" maxlength="5">
      <template slot="append">个</template>
    </el-input>
  </el-form-item>
  <el-form-item label="投放范围:">
    <el-select v-model="formData.receiveRange" placeholder="请选择">
      <el-option label="不限" :value="-1"></el-option>
      <el-option label="一公里" :value="1"></el-option>
      <el-option label="三公里" :value="3"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item v-if="formData.type == 'COUNTDOWN'" label="发布时间:" prop="publishTime" :rules="[
    { required: true,  message: '请选择发布时间', trigger: 'change, blur' }
  ]">
    <el-date-picker v-model="formData.publishTime" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
  </el-form-item>
</el-form>
</template>
<script>
import { isValidPrice, isValidNumber } from "@/utils/validate";
import { getCommandList } from "@/api/marketCenter";

export default {
  data() {
    const validMoney = (rule, value, callback) => {
      if (value == "" || parseFloat(value) == 0 || !isValidPrice(value)) {
        callback(new Error("请输入整数最多7位，小数点后1到2位的数字"));
      } else {
        callback();
      }
    }
    const validNum = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请输入红包个数"));
        return false;
      }
      if (parseFloat(value) == 0 || !isValidNumber(value)) {
        callback(new Error("请输入合理的红包个数"));
        return false;
      }
      callback();
    }
    return {
      pOption: [],
      cOption: [],
      formData: {
        pId: "",
        command: '',
        redPacketMoney: '',
        type: "IMMEDIATELY",
        receiveRange: '',
        num: '',
        publishTime: ""
      },
      formRules: {
        pId: [
          { required: true,  message: "请选择口令模板", trigger: "change, blur" }
        ],
        num: [
          { validator: validNum.bind(this), trigger: "change" },
          { validator: validNum.bind(this), trigger: "blur" }
        ],
        redPacketMoney: [
          { validator: validMoney.bind(this), trigger: "change" },
          { validator: validMoney.bind(this), trigger: "blur" }
        ]
      }
    }
  },
  created() {
    getCommandList({ pid: this.formData.pId }).then(res => {
      this.pOption = res.businessData;
      this.pOption.push({ id: -1, command: '自定义' })
    })
  },
  methods: {
    handleOnSelectChange(val) {
      this.pid = val;
      this.handleGetTemplateData();
    },
    handleGetTemplateData() {
      getCommandList({ pid: this.formData.pId }).then(res => {
        this.cOption = res.businessData;
      })
    },
  },
}
</script>
<style scoped>
.el-form .el-input {
  width:400px;
}
.el-form .el-select {
  width:400px;
}
</style>