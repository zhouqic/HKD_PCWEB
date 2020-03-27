<template>
<el-form ref="validateForm" :model="formData" :rules="formRules" label-width="110px" :label-position="'right'">
  <!--  -->
  <el-form-item label="满减方式:">
    <el-radio-group v-model="type">
      <el-radio :label="2">随机减</el-radio>
      <el-radio :label="1">阶梯减</el-radio>
    </el-radio-group>
  </el-form-item>
  <!-- 阶梯减 -->
  <template v-if="type == 1">
    <el-form-item :key="i" v-for="(item, i) in formData.rfFullCuts" :prop="'type' + i" :rules="[
      { validator: handleValidType.bind(this), trigger: 'blur' },
      { validator: handleValidType.bind(this), trigger: 'change' }
    ]">
      <div style="margin-bottom:10px;">
        满 <el-input v-model="item.fullMoney" maxlength="7" style="width:90px;"></el-input> 元，
        立减 <el-input v-model="item.reduceMoney" maxlength="7" style="width:90px;"></el-input> 元
        <el-button v-if="i != 0" plain type="danger" @click="handleDelFullCut(i)" style="margin-left:10px;">删除</el-button>
        <el-button plain type="primary" v-if="i == (formData.rfFullCuts.length - 1) && formData.rfFullCuts.length <= 4" style="margin-left:10px;" @click="handleAddFullCut()">添加</el-button>
      </div>
    </el-form-item>
  </template>
  <!-- 随机减 -->
  <template v-else>
    <el-form-item :key="i" v-for="(item, i) in formData.rfFullCuts" prop="type0" :rules="[
      { validator: handleValidType.bind(this), trigger: 'blur' },
      { validator: handleValidType.bind(this), trigger: 'change' }
    ]">
      满 <el-input v-model="formData.rfFullCuts[0].fullMoney" maxlength="7" style="width:90px;"></el-input> 元，随机减 <el-input v-model="formData.rfFullCuts[0].randomMinMoney" maxlength="7" style="width:90px;"></el-input> - <el-input v-model="formData.rfFullCuts[0].randomMaxMoney" maxlength="7" style="width:90px;"></el-input> 元
    </el-form-item>
  </template>
  <!-- 是否叠加使用 -->
  <el-form-item label="是否叠加使用:">
    <el-radio-group v-model="formData.isAlone">
      <el-radio :label="0">可与其他优惠叠加使用</el-radio>
      <el-radio :label="1">不可与其他优惠叠加使用</el-radio>
    </el-radio-group>
  </el-form-item>
  <!-- 活动有效期 -->
  <el-form-item label="活动有效期:" prop="beginTime">
    <date-picker class="date-picker" type="daterange" :value.sync="date"></date-picker>
  </el-form-item>
</el-form>
</template>
<script>
import DatePicker from '@/components/DatePicker';
import { isValidPrice, isValidNumber } from "@/utils/validate";

export default {
  name: "fullcutForm",
  components: { DatePicker },
  data() {
    const validDate = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请选择活动有效期"));
        return false;
      }
      callback();
    }
    return {
      date: [],
      type: 1,
      isAdd: false,
      fullCut: {
        fullMoney: "",
        isAlone: 0,
        randomMaxMoney: "",
        randomMinMoney: "",
        reduceMoney: "",
        type: 0
      },
      formData: {
        isAlone: 0,
        rfFullCuts: [],
        endTime: '',
        beginTime: '',
        type: 1
      },
      formRules: {
        beginTime: [
          { validator: validDate.bind(this), trigger: "change,blur" }
        ]
      }
    }
  },
  created() {
    let obj = {...this.fullCut};
    obj.type = this.type;
    this.formData.rfFullCuts.push(obj);
    this.$forceUpdate();
  },
  watch: {
    date: {
      handler(n, o) {
        if (n != o) {
          this.formData.beginTime = n[0] + " 00:00:00";
          this.formData.endTime = n[1] + " 23:59:59";
        }
      },
      deep: true
    },
    type(n, o) {
      if (n != o) {
        let obj = {...this.fullCut};
        obj.type = n;
        this.formData.rfFullCuts = [];
        this.formData.rfFullCuts.push(obj);
        this.formData.type = n;
        this.$forceUpdate();
      }
    }
  },
  methods: {
    handleValidType(rule, value, callback) {
      let arr = this.formData.rfFullCuts;
      for (let i = 0; i < arr.length; i++) {
        // 阶梯减
        if (this.isAdd) {
          return false;
        }
        if (arr[i]["fullMoney"] == "" || parseFloat(arr[i]["fullMoney"]) == 0) {
          callback(new Error("请输入合理的消费满额度"));
          return false;
        }
        if (arr[i - 1] && parseFloat(arr[i]["fullMoney"]) <= parseFloat(arr[i - 1]["fullMoney"])) {
          callback(new Error("消费满额度应大于上一级"));
          return false;
        }
        if (arr[i]["type"] == 2 && parseFloat(arr[i]["randomMaxMoney"]) <= parseFloat(arr[i]["randomMinMoney"])) {
          callback(new Error("随机减额度初始值应小于结束值"));
          return false;
        }
        if (arr[i]["type"] == 2 && (arr[i]["randomMaxMoney"] == "" || arr[i]["randomMinMoney"] == "")) {
          callback(new Error("随机减额度值不能为空"));
          return false;
        }
        if (arr[i]["type"] == 2 && (parseFloat(arr[i]["randomMaxMoney"]) >= parseFloat(arr[i]["fullMoney"]) || parseFloat(arr[i]["randomMinMoney"]) >= parseFloat(arr[i]["fullMoney"]))) {
          callback(new Error("随机减额度值应小于消费满额度"));
          return false;
        }
        if (arr[i]["type"] == 1 && !isValidPrice(arr[i]["fullMoney"])) {
          callback(new Error("请输入整数最多7位，小数点后1到2位的数字"));
          return false;
        }
        if (arr[i]["type"] == 1 && (arr[i]["reduceMoney"] == "" || parseFloat(arr[i]["reduceMoney"]) == 0)) {
          callback(new Error("立减额度不能为空"));
          return false;
        }
        if (arr[i - 1] && parseFloat(arr[i]["reduceMoney"]) <= parseFloat(arr[i - 1]["reduceMoney"])) {
          callback(new Error("立减额度应大于上一级"));
          return false;
        }
        if (arr[i]["type"] == 1 && !isValidPrice(arr[i]["reduceMoney"])) {
          callback(new Error("请输入整数最多7位，小数点后1到2位的数字"));
          return false;
        }
        if (arr[i]["type"] == 1 && parseFloat(arr[i]["fullMoney"]) <= parseFloat(arr[i]["reduceMoney"])) {
          callback(new Error("立减额度不能超过消费满额度"));
          return false;
        }
        
      }
      callback();
    },
    handleAddFullCut() {
      this.$refs["validateForm"].validateField("type" + (this.formData.rfFullCuts.length -1), valid => {
        if (valid === "") {
          let obj = {...this.fullCut};
          obj.type = this.type;
          this.formData.rfFullCuts.push(obj);
          this.$forceUpdate();
        } else {
          this.$message.error("满减规则设置不合理，请修改后重试")
        }
      });
    },
    handleDelFullCut(i) {
      this.formData.rfFullCuts.splice(i, 1);
      this.$forceUpdate();
    }
  }
}
</script>
<style scoped>
.el-form .el-icon-error {
  color:#F56C6C;
  font-size: 14px;
}
.el-form .el-icon-circle-plus {
  color:#409EFF;
  font-size: 14px;
}
.el-form .date-picker {
  width:375px!important;
}
</style>