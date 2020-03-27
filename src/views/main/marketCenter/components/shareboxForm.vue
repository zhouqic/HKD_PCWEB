<template>
<el-form ref="validateForm" :model="formData" :rules="formRules" label-width="120px" :label-position="'right'">
  <el-form-item label="红包类型:">
    <el-radio-group v-model="formData.type" @change="handleOnTypeChange">
      <el-radio :label="0">随机红包</el-radio>
      <el-radio :label="1">定额红包</el-radio>
    </el-radio-group>
  </el-form-item>
  <el-form-item ref="validateType" prop="type" v-if="formData.type == 0">
    <el-input v-model="formData.minMoney" maxlength="7" placeholder="最低" style="width:150px;"></el-input> 元 - 
    <el-input v-model="formData.maxMoney" maxlength="7" placeholder="最高" style="width:150px;"></el-input> 元
  </el-form-item>
  <el-form-item ref="validateType" prop="type" v-else>
    <el-input v-model="formData.minMoney" maxlength="7" style="width:150px;"></el-input> 元
  </el-form-item>
  <el-form-item label="红包个数:" prop="num">
    <el-input v-model="formData.num" maxlength="7"></el-input>
  </el-form-item>
  <el-form-item label="最低消费金额:" prop="minCharge">
    <el-input v-model="formData.minCharge" maxlength="7"></el-input>
  </el-form-item>
  <el-form-item label="红包有效期:" prop="beginTime">
    <date-picker class="date-picker" type="daterange" :value.sync="date"></date-picker>
  </el-form-item>
  <!-- 新增优惠券相关设置 -->
  <el-form-item label="是否附赠优惠券:" prop="beginTime">
    <el-radio-group v-model="isUseCard">
      <el-radio :label="1">是</el-radio>
      <el-radio :label="0">否</el-radio>
    </el-radio-group>
  </el-form-item>
  <el-form-item v-if="isUseCard === 1">
    <el-row style="margin-bottom:15px;" v-if="selectCard.length <= 1"><el-button @click="handleOpenCardDialog()">添加优惠券</el-button></el-row>
    <el-form label-position="left" inline class="demo-table-expand" v-for="(item, i) in selectCard" :key="item.id">
      <el-button type="danger" round size="mini" @click="selectCard.splice(i, 1)">删除</el-button>
      <el-form-item label="名称:"><span class="title" :title="item.title">{{ item.title }}</span></el-form-item>
      <el-form-item label="有效期:">领取后 {{ item.fixedTerm }}天过期</el-form-item>
      <el-form-item label="使用条件:">满 {{ item.leastCost }} 元，立减 {{ item.reduceCost }} 元</el-form-item>
    </el-form>
  </el-form-item>
  <!-- 弹窗 -->
  <el-dialog title="选择优惠券" :visible.sync="showDialog" width="500px" append-to-body :close-on-click-modal="false" :close-on-press-escape="false">
    <el-table :data="tableData" @row-click="handleOnSelectChange">
      <el-table-column align="center" width="80">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.checked" :value="scope.row.id === id ? true : false" @change="handleOnSelectChange(scope.row)"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="名称" prop="title"></el-table-column>
      <el-table-column label="使用条件">
        <template slot-scope="scope">
          <span>满{{ scope.row.leastCost }}元，立减{{ scope.row.reduceCost }}元</span>
        </template>
      </el-table-column>
      <el-table-column label="有效期">
         <template slot-scope="scope">
          <span>领取后{{ scope.row.fixedTerm }}天内有效</span>
        </template>
      </el-table-column>
    </el-table>

    <span slot="footer" class="dialog-footer">
      <el-button @click="showDialog=false;tableType='';">取 消</el-button>
      <el-button type="primary" @click="handleSubmitForm">确 定</el-button>
    </span>
  </el-dialog>
</el-form>
</template>
<script>
import DatePicker from '@/components/DatePicker';
import { isValidPrice, isValidNumber } from "@/utils/validate";
import { getRfCardsByCreaterId } from '@/api/marketCenter';

export default {
  components: { DatePicker },
  data() {
    const validType = (rule, value, callback) => {
      if (this.formData.minMoney == "") {
        callback(new Error(this.formData.type == 0 ? "请输入最低金额" : "请输入红包金额"));
        return false;
      }
      if (parseFloat(this.formData.minMoney) === 0 && this.formData.type == 0) {
        callback(new Error("红包最低金额必须大于0"));
        return false;
      }
      if (parseFloat(this.formData.minMoney) === 0 && this.formData.type == 1) {
        callback(new Error("红包定额必须大于0"));
        return false;
      }
      if (this.formData.maxMoney == "" && this.formData.type == 0) {
        callback(new Error("请输入最高金额"));
        return false;
      }
      if (parseFloat(this.formData.maxMoney) <= parseFloat(this.formData.minMoney)) {
        callback(new Error("单个红包最高金额应大于最低金额"));
        return false;
      }
      if (this.formData.minMoney && !isValidPrice(this.formData.minMoney)) {
        callback(new Error("请输入整数最多7位，小数点后1到2位的数字"));
        return false;
      }
      if (this.formData.maxMoney &&  !isValidPrice(this.formData.maxMoney)) {
        callback(new Error("请输入整数最多7位，小数点后1到2位的数字"));
        return false;
      }
      callback();
    }
    const validNum = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请输入红包个数"));
        return false;
      }
      if (!isValidNumber(value)) {
        callback(new Error("请输入合理的红包个数"));
        return false;
      }
      callback();
    }
    const validMinCharge = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请输入合法金额"));
        return false;
      }
      if (this.formData.type == 0 && parseFloat(this.formData.minCharge) <= parseFloat(this.formData.maxMoney)) {
        callback(new Error("最低消费金额应大于单个随机红包最大金额"));
        return false;
      }
      if (this.formData.type == 1 && parseFloat(this.formData.minCharge) <= parseFloat(this.formData.minMoney)) {
        callback(new Error("最低消费金额应大于单个定额红包金额"));
        return false;
      }
      if (!isValidPrice(value)) {
        callback(new Error("请输入整数最多7位，小数点后1到2位的数字"));
      } else {
        callback();
      }
    }
    const validDate = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请选择红包有效期"));
        return false;
      }
      callback();
    }
    return {
      date: [],
      id: '',
      isUseCard: 0,//是否附赠优惠券，0：否；1，是
      showDialog: false,
      tableData: [],
      selectCard: [],
      formData: {
        type: 0,
        maxMoney: '',
        minMoney: '',
        minCharge: '',
        num: '',
        endTime: '',
        beginTime: ''
      },
      formRules: {
        type: [
          { validator: validType.bind(this), trigger: "change" },
          { validator: validType.bind(this), trigger: "blur" }
        ],
        num: [
          { validator: validNum.bind(this), trigger: "change" },
          { validator: validNum.bind(this), trigger: "blur" }
        ],
        minCharge: [
          { validator: validMinCharge.bind(this), trigger: "change" },
          { validator: validMinCharge.bind(this), trigger: "blur" }
        ],
        beginTime: [
          { validator: validDate.bind(this), trigger: "change,blur" }
        ]
      }
    }
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
    }
  },
  methods: {
    handleOnSelectChange(row) {
      if (this.id != row.id) {
        this.id = row.id;
        row.checked = true;
        this.tableData.map(item => {
          if (item.id != row.id) item.checked = false;
        })
      } else {
        this.id = '';
        row.checked = false;
      }
      this.$forceUpdate();
    },
    handleOpenCardDialog() {
      getRfCardsByCreaterId({}).then(res => {
        this.tableData = res.tableData.filter(item => item.fixedTerm != "");
        this.showDialog = true;
      })
    },
    handleSubmitForm() {
      if (!this.id) {
        this.$message.error("请选择优惠券");
        return false;
      }
      this.showDialog = false;
      let data = this.tableData.filter(item => item.id == this.id);
      this.id = '';
      this.tableData = [];
      this.selectCard.push(data[0]);
    },
    handleOnTypeChange(val) {
      this.$refs["validateType"].resetField();
      this.formData.type = val;
    }
  },
}
</script>
<style scoped>
.el-form .el-input {
  width:400px;
}
.el-form .date-picker {
  width:400px!important;
}
.demo-table-expand {
  width: 90%;
  font-size: 0;
  border: 1px dashed #DCDFE6;
  padding: 5px 10px;
  margin-bottom: 10px;
  position: relative
}
.demo-table-expand .el-button {
  position: absolute;
  right: 5px;
  top: 5px;
  padding: 5px 10px;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 10px;
  width: 90%;
}
.demo-table-expand .el-form-item .title {
  width: 215px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight:bold;
  float:left;
}
.demo-table-expand .el-form-item .el-input {
  width:75px!important;
}
</style>