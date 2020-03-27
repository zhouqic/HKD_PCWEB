<template>
<el-container>
  <el-form ref="validateForm" :model="formData" :rules="formRules" label-width="110px" :label-position="'right'" style="width:100%;">
    <el-form-item label="等级名称:">
      <el-input v-model.trim="formData.gradeName" maxlength="6"></el-input>
    </el-form-item>
    <el-form-item label="成长值:" prop="growValue">
      <el-input v-model="formData.minGrowValue" disabled maxlength="8" style="width:190px!important;"></el-input>
      至
      <el-input v-model="formData.maxGrowValue" maxlength="8" style="width:190px!important;"></el-input>
    </el-form-item>
    <el-form-item label="等级权益:">
      <el-checkbox label="积分赠送" v-model="formData.openPoints" :true-label="1" :false-label="0"></el-checkbox>
      <el-checkbox label="专属优惠券" v-model="formData.openCard" :true-label="1" :false-label="0"></el-checkbox>
      <el-checkbox label="专属商品券" v-model="formData.openEntityCard" :true-label="1" :false-label="0"></el-checkbox>
      <el-checkbox label="门店特权" v-model="formData.openPrivilege" :true-label="1" :false-label="0"></el-checkbox>
    </el-form-item>
    <el-form-item v-if="formData.openPoints" label="积分赠送:" prop="points">
      <el-input v-model="formData.points" maxlength="7">
        <template slot="prepend">每消费 1 元，赠送</template>
        <template slot="append">倍积分</template>
      </el-input>
    </el-form-item>
    <el-form-item v-if="formData.openCard" label="专属优惠券:" prop="maxCardNum">
      <el-input v-model="formData.maxCardNum" maxlength="7">
        <template slot="prepend">每人每月可领取</template>
        <template slot="append">张</template>
      </el-input>
    </el-form-item>
    <el-form-item v-if="formData.openEntityCard" label="专属商品券:" prop="maxEntityCard">
      <el-input v-model="formData.maxEntityCard" maxlength="7">
        <template slot="prepend">每人每月可领取</template>
        <template slot="append">张</template>
      </el-input>
    </el-form-item>
    <el-form-item v-if="formData.openPrivilege" label="门店特权1:" prop="privilege">
      <el-input v-model="formData.privilege1" type="textarea" maxlength="20"></el-input>
    </el-form-item>
    <el-form-item v-if="formData.openPrivilege" label="门店特权2:" prop="privilege">
      <el-input v-model="formData.privilege2" type="textarea" maxlength="20"></el-input>
    </el-form-item>
    <el-form-item v-if="formData.openPrivilege" label="门店特权3:" prop="privilege">
      <el-input v-model="formData.privilege3" type="textarea" maxlength="20"></el-input>
    </el-form-item>
  </el-form>
</el-container>
</template>
<script>
import { isValidNumber } from "@/utils/validate";
import { getRfCardsByCreaterId } from '@/api/vipManage';

export default {
  name: "memberlevelForm",
  props: ["id"],
  data() {
    const validGrowValue = (rule, value, callback) => {
      if (this.formData.minGrowValue === '' || !isValidNumber(this.formData.minGrowValue)) {
        callback(new Error("请输入合理的成长值最小值"));
        return false;
      }
      if (this.formData.maxGrowValue === '' || !isValidNumber(this.formData.maxGrowValue)) {
        callback(new Error("请输入合理的成长值最大值"));
        return false;
      }
      if (parseFloat(this.formData.minGrowValue) >= parseFloat(this.formData.maxGrowValue)) {
        callback(new Error("成长值最大值不能小于最小值"));
        return false;
      }
      callback();
    }
    const validNum = (rule, value, callback) => {
      if (value == "" || parseFloat(value) == "" || !isValidNumber(value)) {
        callback(new Error("请输入非零整数"));
        return false;
      }
      callback();
    }
    const validPrivilege = (rule, value, callback) => {
      if (this.formData.privilege1 == "" && this.formData.privilege2 == "" && this.formData.privilege3 == "") {
        callback(new Error("请至少输入1项门店特权"));
        return false;
      }
      if (this.formData.privilege1 == "" && (this.formData.privilege2 != "" || this.formData.privilege3 != "")) {
        callback(new Error("请按照顺序输入"));
        return false;
      }
      if (this.formData.privilege2 == "" && this.formData.privilege3 != "") {
        callback(new Error("请按照顺序输入"));
        return false;
      }
      callback();
    }
    return {
      formData: {
        gradeName: "",
        grade: "",
        minGrowValue: '',
        maxGrowValue: '',
        openCard: 0,
        openEntityCard: 0,
        openPoints: 0,
        openPrivilege: 0,
        points: "",
        maxCardNum: "",
        maxEntityCard: "",
        privilege1: "",
        privilege2: "",
        privilege3: ""
      },
      formRules: {
        gradeName: [
          { required: true, message: "请输入等级名称", trigger: "change" }
        ],
        growValue: [
          { validator: validGrowValue.bind(this), trigger: "change" },
          { validator: validGrowValue.bind(this), trigger: "blur" }
        ],
        points: [
          { validator: validNum.bind(this), trigger: "change" },
          { validator: validNum.bind(this), trigger: "blur" }
        ],
        maxCardNum: [
          { validator: validNum.bind(this), trigger: "change" },
          { validator: validNum.bind(this), trigger: "blur" }
        ],
        maxEntityCard: [
          { validator: validNum.bind(this), trigger: "change" },
          { validator: validNum.bind(this), trigger: "blur" }
        ],
        privilege: [
          { validator: validPrivilege.bind(this), trigger: "change" },
          { validator: validPrivilege.bind(this), trigger: "blur" }
        ]
      }
    }
  },
  created() {
    let $parent = this.$parent.$parent;
    if (this.id) {
      let data = $parent.tableData.filter(item => item.id == this.id);
      this.formData.id = data[0].id;
      this.formData.grade = data[0].grade;
      this.formData.gradeName = data[0].gradeName;
      this.formData.minGrowValue = data[0].minGrowValue;
      this.formData.maxGrowValue = data[0].maxGrowValue;
      this.formData.openCard = data[0].openCard;
      this.formData.openPoints = data[0].openPoints;
      this.formData.openEntityCard = data[0].openEntityCard;
      this.formData.openPrivilege = data[0].openPrivilege;
      this.formData.privilege1 = data[0].privilege1;
      this.formData.privilege2 = data[0].privilege2;
      this.formData.privilege3 = data[0].privilege3;
      this.formData.maxCardNum = data[0].maxCardNum;
      this.formData.maxEntityCard = data[0].maxEntityCard;
      this.formData.points = data[0].points;
    } else {
      if ($parent.tableData.length) {
        this.formData.grade = parseInt($parent.tableData[$parent.tableData.length - 1].grade) + 1;
        this.formData.minGrowValue = parseInt($parent.tableData[$parent.tableData.length - 1].maxGrowValue) + 1;
      } else {
        this.formData.grade = 1;
        this.formData.minGrowValue = 0;
      }
    }
  }
}
</script>
<style scoped>
.el-form .el-input {
  width:90%!important;
}
.el-form .el-textarea {
  width:90%!important;
}
</style>