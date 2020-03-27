<template>
  <div class="main-content">
    <!-- 列表 -->
    <el-form ref="pointsRule" :model="formData" :label-position="'left'" label-width="130px">
      <!--  -->
      <el-form-item label="是否获赠积分:">
        <el-switch v-model="formData.givePoints" :active-value="1" :inactive-value="0" :active-text="!formData.givePoints ? '' : '消费1元积1积分'"></el-switch>
      </el-form-item>
      <!--  -->
      <el-form-item label="是否开启分享:">
        <el-switch v-model="formData.openShare" :active-value="1" :inactive-value="0" :active-text="!formData.openShare ? '' : '开启分享得积分'"></el-switch>
      </el-form-item>
      <el-form-item v-if="formData.openShare" prop="sharePoints" :rules="[
        { validator: handleValidNum.bind(this), trigger: 'blur' },
        { validator: handleValidNum.bind(this), trigger: 'change' }
      ]">
        每天分享好友开卡获得<el-input :disabled="formData.openShare ? false : true" v-model="formData.sharePoints" maxlength="5"></el-input>积分
      </el-form-item>
      <el-form-item v-if="formData.openShare" prop="maxSharePointsNum" :rules="[
        { validator: handleValidNum.bind(this), trigger: 'blur' },
        { validator: handleValidNum.bind(this), trigger: 'change' }
      ]">
        每天最多分享<el-input :disabled="formData.openShare ? false : true" v-model="formData.maxSharePointsNum" maxlength="5"></el-input>次，可获得积分
      </el-form-item>
      <!--  -->
      <el-form-item label="是否开启签到:">
        <el-switch v-model="formData.openSign" :active-value="1" :inactive-value="0" :active-text="!formData.openSign ? '' : '开启签到得积分'"></el-switch>
      </el-form-item>
      <el-form-item v-if="formData.openSign" prop="signPoints" :rules="[
        { validator: handleValidNum.bind(this), trigger: 'blur' },
        { validator: handleValidNum.bind(this), trigger: 'change' }
      ]">
        每天签到可获得<el-input :disabled="formData.openSign ? false : true" v-model="formData.signPoints" maxlength="5"></el-input>积分
      </el-form-item>
      <!--  -->
      <el-form-item label="是否积分抵扣:">
        <el-switch v-model="formData.reducePoints" :active-value="1" :inactive-value="0" :active-text="!formData.reducePoints ? '' : '开启积分抵扣'"></el-switch>
      </el-form-item>
      <el-form-item prop="minRequire" v-if="formData.reducePoints" :rules="[
        { validator: handleValidNum.bind(this), trigger: 'blur' },
        { validator: handleValidNum.bind(this), trigger: 'change' }
      ]">
        满<el-input :disabled="formData.reducePoints ? false : true" v-model="formData.minRequire" maxlength="5"></el-input>积分，
        可以使用<el-input :disabled="formData.reducePoints ? false : true" v-model="formData.points" maxlength="5"></el-input>积分抵扣1元
      </el-form-item>
      <el-form-item prop="deductRatio" v-if="formData.reducePoints" :rules="[
        { validator: handleValidNum.bind(this), trigger: 'blur' },
        { validator: handleValidNum.bind(this), trigger: 'change' }
      ]">
        积分最高抵整单<el-input :disabled="formData.reducePoints ? false : true" v-model="formData.deductRatio" maxlength="2"></el-input>%
      </el-form-item>
      <!--  -->
      <el-form-item label="是否开启会员日:">
        <el-switch v-model="formData.memberDaySet" :active-value="1" :inactive-value="0" :active-text="!formData.memberDaySet ? '' : '开启会员日'"></el-switch>
      </el-form-item>
      <!--  -->
      <el-form-item v-if="formData.memberDaySet" prop="pointsTimes" :rules="[
        { validator: handleValidNum.bind(this), trigger: 'blur' },
        { validator: handleValidNum.bind(this), trigger: 'change' }
      ]">
        会员日享有<el-input v-model="formData.pointsTimes" maxlength="5"></el-input>倍积分
      </el-form-item>
      <!--  -->
      <el-form-item v-if="formData.memberDaySet">
        <el-radio-group v-model="formData.memberDayType" @change="handleOnDayTypeChange">
          <el-radio :label="0">每周</el-radio>
          <el-radio :label="1">每月</el-radio>
          <el-radio :label="2">自定义</el-radio>
        </el-radio-group>
      </el-form-item>
      <!--  -->
      <el-form-item v-if="formData.memberDaySet && formData.memberDayType === 0" prop="memberDays" :rules="[{ required: true, message: '请选择会员日', trigger: 'blur' }]">
        选择每周
        <el-select v-model="formData.memberDays" multiple :multiple-limit="1" style="width:200px;">
          <el-option label="周日" value="0"></el-option>
          <el-option label="周一" value="1"></el-option>
          <el-option label="周二" value="2"></el-option>
          <el-option label="周三" value="3"></el-option>
          <el-option label="周四" value="4"></el-option>
          <el-option label="周五" value="5"></el-option>
          <el-option label="周六" value="6"></el-option>
        </el-select>为会员日
      </el-form-item>
      <!--  -->
      <el-form-item v-else-if="formData.memberDaySet && formData.memberDayType != 0" prop="memberDays" :rules="[{ required: true, message: '请选择会员日', trigger: 'blur' }]">
        选择每月
        <el-select v-model="formData.memberDays" multiple :multiple-limit="multipleLimit" style="width:200px;">
          <el-option v-for="(item, i) in options" :key="i" :label="item" :value="item"></el-option>
        </el-select>日为会员日
      </el-form-item>
      <!--  -->
      <el-form-item style="text-align:left;">
        <el-button type="primary" :disabled="isSubmit ? true : false" @click="handleSubmitForm" style="">保存设置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getRfPointsRuleByCreaterId, saveRfPointsRule } from '@/api/marketCenter';
import { isValidNumber } from "@/utils/validate";

  export default {
    data() {
      return {
        options: [],
        formData: {
          id: "",
          givePoints: 0,
          openShare: 0,
          sharePoints: '',
          maxSharePointsNum: '',
          openSign: 0,
          signPoints: '',
          reducePoints: 0,
          minRequire: '',
          points: '',
          deductRatio: '',
          memberDaySet: 0,
          pointsTimes: '',
          memberDayType: 0,
          memberDays: []
        },
        formRules: {},
        multipleLimit: 1,
        isSubmit: false
      }
    },
    created() {
      for (let i = 1; i <= 31; i++) {
        let val = i < 10 ? ("0" + i) : String(i);
        this.options.push(val)
      }
      this.handleGetRuleData();
    },
    methods: {
      handleValidNum(rule, value, callback) {
        if (parseFloat(value) == 0 || value == "" || !isValidNumber(value)) {
          callback(new Error("请输入非零整数"));
          return false;
        }
        if (rule["field"] == "minRequire" && (parseFloat(this.formData.points) == 0 || !isValidNumber(this.formData.points))) {
          callback(new Error("请输入非零整数"));
          return false;
        }
        callback();
      },
      handleOnDayTypeChange(val) {
        this.multipleLimit = val == 2 ? 7 : 1;
        this.formData.memberDays = [];
      },
      handleGetRuleData() {
        getRfPointsRuleByCreaterId().then(res => {
          Object.keys(this.formData).forEach(key => {
            if (key == "memberDays") {
              this.formData["memberDays"] = res.tableData["memberDays"].split(",");
            } else {
              this.formData[key] = res.tableData[key];
            }
          });
        })
      },
      handleSubmitForm() {
        this.$refs["pointsRule"].validate(valid => {
          if (valid) {
            this.isSubmit = true;
            let data = {...this.formData};
            data.memberDays = data.memberDays.join(",")
            saveRfPointsRule(data).then(res => {
              this.isSubmit = false;
              this.handleGetRuleData();
              this.$message.success("保存成功");
            }).catch(() => { 
              this.isSubmit = false;
            });
          }
        })
      }
    }
  }
</script>
<style scoped>
.el-form .el-input {
  width: 100px;
  margin: 0 5px;
}
.el-form .el-select {
  width: 100px;
  margin: 0 5px;
}
</style>
