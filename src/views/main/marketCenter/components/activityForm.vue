<template>
<el-form ref="validateForm" :model="formData" :rules="formRules" label-width="110px" :label-position="'right'">
  <el-form-item label="活动类型:">
    <el-radio-group v-model="type" @change="handleGetCardData()">
      <el-radio :label="0">优惠券活动</el-radio>
      <el-radio :label="1">商品兑换券活动</el-radio>
    </el-radio-group>
  </el-form-item>
  <el-form-item v-if="type === 0" label="优惠券:">
    <el-select v-model="formData.cardId" placeholder="请选择">
      <el-option v-for="item in options" :key="item.value" :label="item.title" :value="item.id">
        <span style="float: left">{{ item.title }}</span>
        <span style="float: right; color: #8492a6; font-size: 13px">{{ '满' + item.leastCost + '元，减' + item.reduceCost + '元' }}</span>
      </el-option>
    </el-select>
  </el-form-item>
  <el-form-item v-else-if="type === 1" label="兑换券:">
    <el-select v-model="value6" placeholder="请选择">
      <el-option v-for="item in options" :key="item.value" :label="item.title" :value="item.id">
        <span style="float: left"><img :src="item.pic" width='20' height='20' style='border-radius:50%;vertical-align: -7px;margin-right:10px;'>{{ item.title }}</span>
        <span style="float: right; color: #8492a6; font-size: 13px">{{ '价值 ￥' + item.price }}</span>
      </el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="活动时间:" prop="beginTime">
    <date-picker class="date-picker" type="daterange" :value.sync="date"></date-picker>
  </el-form-item>
  <el-form-item label="赠送数量:" prop="cardNum">
    <el-input v-if="type === 0" v-model="formData.cardNum" maxlength="5">
      <template slot="append">张</template>
    </el-input>
    <el-input v-else-if="type === 1" v-model="formData.exchangeNum" maxlength="5">
      <template slot="append">张</template>
    </el-input>
  </el-form-item>
</el-form>
</template>
<script>
import DatePicker from '@/components/DatePicker';
import { isValidPrice, isValidNumber } from "@/utils/validate";
import { getRfCardsByCreaterId } from '@/api/vipManage';
import { findEntityCardList } from '@/api/marketCenter';

export default {
  name: "fullcutForm",
  components: { DatePicker },
  data() {
    const validDate = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请选择活动时间"));
        return false;
      }
      callback();
    }
    const validNum = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请输入赠送数量"));
        return false;
      }
      if (!isValidNumber(value)) {
        callback(new Error("请输入合理的赠送数量"));
        return false;
      }
      callback();
    }
    return {
      date: [],
      type: 0,
      options: [],
      formData: {
        cardId: "",
        cardNum: 10,
        exchangeNum: 30,
        redBeginTime: "",
        redEndTime: "",
        redMaxMoney: 100,
        redMinMoney: 1,
        type: 0
      },
      formRules: {
        beginTime: [
          { validator: validDate.bind(this), trigger: "change,blur" }
        ],
        cardNum: [
          { validator: validNum.bind(this), trigger: "change" },
          { validator: validNum.bind(this), trigger: "blur" }
        ]
      }
    }
  },
  created() {
    this.handleGetCardData();
  },
  watch: {
    date: {
      handler(n, o) {
        if (n != o) {
          this.formData.redBeginTime = n[0] + " 00:00:00";
          this.formData.redEndTime = n[1] + " 23:59:59";
        }
      },
      deep: true
    },
    type(n, o) {
      if (n != o) {
        this.$forceUpdate();
      }
    }
  },
  methods: {
    handleGetCardData() {
      if (this.type === 0) {
        getRfCardsByCreaterId({}).then(res => {
          this.options = res.tableData
        })
      } else {
        findEntityCardList().then(res => {
          this.options = res.tableData
        })
      }
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
      })
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
.el-form .date-picker, .el-form .el-input {
  width:375px!important;
}
.el-form .el-select {
  width:375px!important;
}
</style>