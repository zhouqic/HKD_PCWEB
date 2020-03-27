<template>
<div>
  <!-- 基础信息 -->
  <el-form ref="validateForm" :model="formData" label-width="100px" :label-position="'left'" style="width:100%;">
    <el-form-item label="活动名称:" prop="name" :rules="[
      { required: true, message: '请输入活动名称', trigger: 'change' },
      { required: true, message: '请输入活动名称', trigger: 'blur' }
    ]">
      <el-input v-model.trim="formData.name" maxlength="8"></el-input>
    </el-form-item>

    <el-form-item label="活动时间:" prop="activityDate" :rules="[
      { required: true, message: '请选择活动时间', trigger: 'change' },
      { required: true, message: '请选择活动时间', trigger: 'blur' }
    ]">
      <el-date-picker type="datetimerange" v-model="formData.activityDate" arrow-control :showSeconds="false" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm"></el-date-picker>
    </el-form-item>

    <el-form-item label="消耗积分:" prop="costPoints" :rules="[
      { validator: handleValidNumber.bind(this), trigger: 'change' },
      { required: true, message: '请输入积分数', trigger: 'blur' }
    ]">
      <el-input v-model.number="formData.costPoints" maxlength="20">
        <template slot="append">积分 / 每次</template>
      </el-input>
    </el-form-item>

    <el-form-item label="参与次数:" prop="maxNumbers" :rules="[
      { validator: handleValidNumber.bind(this), trigger: 'change' },
      { required: true, message: '请输入参与次数', trigger: 'blur' }
    ]">
      <el-select v-model="numType" style="margin-bottom:5px;">
        <el-option label="1次/天" :value="1"></el-option>
        <el-option label="2次/天" :value="2"></el-option>
        <el-option label="不限次数" :value="-1"></el-option>
        <el-option label="自定义" :value="''"></el-option>
      </el-select>
      <el-input v-if="numType == ''" v-model.number="formData.maxNumbers" maxlength="5">
        <template slot="append">次 / 天</template>
      </el-input>
    </el-form-item>
    <el-form-item label="活动说明:" prop="memo" :rules="[
      { required: true, message: '请输入活动说明', trigger: 'change' },
      { required: true, message: '请输入活动说明', trigger: 'blur' }
    ]">
      <el-input v-model="formData.memo" type="textarea" maxlength="1024"></el-input>
    </el-form-item>
  </el-form>
  <!-- 奖项 -->
  <div>
    <h3>添加奖品</h3>
    <el-form class="add-container">
      <el-row class="row">
        <points-draw-template position="left" id="1" :data="formData.wheelInfoSets.filter(item => item.sort == 1)"></points-draw-template>
        <points-draw-template position="center" id="2" :data="formData.wheelInfoSets.filter(item => item.sort == 2)"></points-draw-template>
        <points-draw-template position="right" id="3" :data="formData.wheelInfoSets.filter(item => item.sort == 3)"></points-draw-template>
      </el-row>
      <el-row class="row">
        <points-draw-template position="left" id="8" :data="formData.wheelInfoSets.filter(item => item.sort == 8)"></points-draw-template>
        <points-draw-template position="center" id="9"></points-draw-template>
        <points-draw-template position="right" id="4" :data="formData.wheelInfoSets.filter(item => item.sort == 4)"></points-draw-template>
      </el-row>
      <el-row class="row">
        <points-draw-template position="left" id="7" :data="formData.wheelInfoSets.filter(item => item.sort == 7)"></points-draw-template>
        <points-draw-template position="center" id="6" :data="formData.wheelInfoSets.filter(item => item.sort == 6)"></points-draw-template>
        <points-draw-template position="right" id="5" :data="formData.wheelInfoSets.filter(item => item.sort == 5)"></points-draw-template>
      </el-row>
    </el-form>
  </div>
  <!-- 选择礼品 -->
  <el-dialog title="选择礼品" :visible.sync="showDialog" width="600px" append-to-body @closed="sort=''" :close-on-click-modal="false" :close-on-press-escape="false">
    <!-- 选择礼品表单 -->
    <points-draw-gift-form v-if="showDialog" ref="pointsDrawGiftForm" :id="sort"></points-draw-gift-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="showDialog=false;sort=''">取 消</el-button>
      <el-button type="primary" @click="handleSubmitForm">确 定</el-button>
    </span>
  </el-dialog>
</div>
</template>
<script>
import pointsDrawGiftForm from "./pointsDrawGiftForm";
import pointsDrawTemplate from "./pointsDrawTemplate";
import { isValidPrice, isValidInteger } from "@/utils/validate";
import { parseTime } from "@/utils"

export default {
  name: "pointsDrawForm",
  props: ["id"],
  components: { pointsDrawGiftForm, pointsDrawTemplate },
  data() {
    return {
      showDialog: false,
      sort: "",// 宫格位置
      numType: 1,
      probability: 0,// 概率
      formData: {
        activityDate: [],
        beginDate: '',
        endDate: '',
        costPoints: '',
        wheelInfoSets: [],
        memo: "",
        maxNumbers: 1,
        name: "",
      }
    }
  },
  watch: {
    'formData.activityDate': {
      handler(n, o) {
        if (n.length) {
          this.formData.beginDate = n[0] + ":00";
          this.formData.endDate = n[1] + ":00";
        }
      },
      deep: true
    },
    numType(n, o) {
      if (n != '') {
        this.formData.maxNumbers = parseInt(n);
      } else {
        this.formData.maxNumbers = '';
      }
    }
  },
  created() {
    let $parent = this.$parent.$parent;
    if ($parent.dialogType == 2) {
      let data = $parent.tableData.filter(item => item.wheelId == this.id)[0];
      this.formData.wheelId = data.wheelId;
      this.formData.name = data.name;
      this.formData.memo = data.memo;
      this.formData.maxNumbers = data.maxNumbers;
      this.formData.costPoints = data.costPoints;
      this.formData.wheelInfoSets = data.wheelInfoSets;
      this.formData.activityDate = [parseTime(data.beginDate, '{y}-{m}-{d} {h}:{m}'), parseTime(data.endDate, '{y}-{m}-{d} {h}:{m}')];
      this.numType = [1, 2, -1].indexOf(data.maxNumbers) == -1 ? '' : data.maxNumbers;
      for (let i = 0; i < data.wheelInfoSets.length; i++) {
        this.probability += parseFloat(data.wheelInfoSets[i].probability);
      }
      this.$forceUpdate();
    }
  },
  methods: {
    handleValidNumber(rule, value, callback) {
      if (rule["field"] == "maxNumbers" && value == -1) {
        callback();
        return true;
      }
      if (rule["field"] == "maxNumbers" && value === '' && !this.formData.maxNumbers) {
        callback(new Error("请输入非零整数"));
        return false;
      }
      if (parseFloat(value) == 0 || !isValidInteger(value)) {
        callback(new Error("请输入非零整数"));
        return false;
      }
      callback();
    },
    handleChooseAward(id) {
      if (this.probability >= 100) {
        this.$message.warning("中奖概率已经100%");
        return false;
      }
      this.sort = id;
      this.showDialog = true;
    },
    handleDeleteAward(id) {
      for (let i = 0; i < this.formData.wheelInfoSets.length; i++) {
        if (this.formData.wheelInfoSets[i]["sort"] == id) {
          this.probability -= parseFloat(this.formData.wheelInfoSets[i].probability);
          this.formData.wheelInfoSets.splice(i, 1);
          break;
        }
      }
    },
    handleSubmitForm() {
      let $el = this.$refs["pointsDrawGiftForm"];
      $el.$refs["validateForm"].validate(valid => {
        if (valid) {
          if ((this.probability + parseFloat($el.wheelInfoForm.probability)) > 100) {
            this.$message.warning("中奖概率不能大于" + parseInt(100 - this.probability) + "%");
            return false;
          }
          this.formData.wheelInfoSets.push($el.wheelInfoForm);
          this.probability += parseFloat($el.wheelInfoForm.probability);
          this.sort = '';
          this.showDialog = false;
          this.$forceUpdate();
        }
      })
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
.el-form .el-date-editor {
  width:90%!important;
}
.el-form .el-textarea {
  width:90%!important;
}
</style>