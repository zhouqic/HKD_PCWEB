<template>
<el-form ref="validateForm" :model="formData" :rules="formRules" label-width="110px" :label-position="'right'">
  <el-form-item label="活动类型:">
    <el-radio-group v-model="formData.type" @change="handleGetCardData()">
      <el-radio :label="0">充值返现金</el-radio>
      <el-radio :label="1">充值返实物券</el-radio>
    </el-radio-group>
  </el-form-item>
  <el-form-item label="充值金额:" prop="recharge">
    <el-input v-model="formData.recharge" maxlength="7">
      <template slot="append">元</template>
    </el-input>
  </el-form-item>
  <el-form-item v-if="formData.type === 0" label="赠送金额:" prop="give">
    <el-input v-model="formData.give" maxlength="7">
      <template slot="append">元</template>
    </el-input>
  </el-form-item>
  <el-form-item v-else-if="formData.type === 1" label="商品兑换券:" prop="exchangeId" :rules="[{ required: true, message: '请选择商品兑换券', trigger: 'blur' }]">
    <el-select v-model="formData.exchangeId" placeholder="请选择" @change="handleSelectExchange">
      <el-option v-for="item in options" :key="item.value" :label="item.title" :value="item.id">
        <span style="float: left"><img :src="item.pic" width='20' height='20' style='border-radius:50%;vertical-align: -7px;margin-right:10px;'>{{ item.title }}</span>
        <span style="float: right; color: #8492a6; font-size: 13px">{{ '价值 ￥' + item.price }}</span>
      </el-option>
    </el-select>
  </el-form-item>
  <el-form-item v-if="formData.type === 0" label="返利规则:" prop="giveTime">
    <el-input v-model="formData.giveTime" maxlength="200">
      <template slot="prepend">分</template>
      <template slot="append">个月返还</template>
    </el-input>
  </el-form-item>
  <el-form-item label="备注说明:" prop="rechargeDesc">
    <el-input v-model="formData.rechargeDesc" type="textarea" maxlength="200"></el-input>
  </el-form-item>
</el-form>
</template>
<script>
import { isValidPrice, isValidNumber } from "@/utils/validate";
import { getRfCardsByCreaterId } from '@/api/vipManage';
import { findEntityCardList } from '@/api/marketCenter';

export default {
  name: "chongzhifanliForm",
  data() {
    const validRecharge = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请输入充值金额"));
        return false;
      }
      if (parseFloat(value) < 0.1) {
        callback(new Error("最小充值金额为0.1"));
        return false;
      }
      if (!isValidPrice(value)) {
        callback(new Error("请输入合理的金额"));
        return false;
      }
      callback();
    }
    const validGive = (rule, value, callback) => {
      if (value && !isValidPrice(value)) {
        callback(new Error("请输入合理的金额"));
        return false;
      }
      callback();
    }
    const validNum = (rule, value, callback) => {
      if (value && !isValidNumber(value)) {
        callback(new Error("请输入合理的整数数字"));
        return false;
      }
      callback();
    }
    return {
      options: [],
      formData: {
        "endTime": "",
        "exchangeId": "",
        "exchangeNum": "",
        "give": "",
        "giveTime": "",
        "recharge": "",
        "rechargeDesc": "",
        "type": 0
      },
      formRules: {
        recharge: [
          { validator: validRecharge.bind(this), trigger: "change" },
          { validator: validRecharge.bind(this), trigger: "blur" }
        ],
        give: [
          { validator: validGive.bind(this), trigger: "change" },
          { validator: validGive.bind(this), trigger: "blur" }
        ],
        giveTime: [
          { validator: validNum.bind(this), trigger: "change" },
          { validator: validNum.bind(this), trigger: "blur" }
        ]
      }
    }
  },
  created() {
    this.handleGetCardData();
  },
  methods: {
    handleGetCardData() {
      if (this.formData.type === 1) {
        findEntityCardList().then(res => {
          this.options = res.tableData
        })
      }
    },
    handleSelectExchange(val) {
      let selectData = this.options.filter(item => item.id == val)
      this.formData.give = selectData[0]["title"];
      this.formData.endTime = selectData[0]["validDays"];
    }
  }
}
</script>
<style scoped>
.el-form .el-input {
  width:375px!important;
}
.el-form .el-textarea {
  width:375px!important;
}
.el-form .el-select {
  width:375px!important;
}
</style>