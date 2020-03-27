<template>
  <el-form :model="formData" ref="ExpressForm" :rules="formRules" class="express-form" label-width="100px">
    <el-form-item label="物流单号：" prop="deliveryCode">
      <el-input placeholder="请输入物流单号" v-model.trim="formData.deliveryCode" maxlength="20"></el-input>
    </el-form-item>
    <el-form-item label="物流公司：" prop="deliveryInc">
      <el-input placeholder="请输入物流公司" v-model.trim="formData.deliveryInc" maxlength="20"></el-input>
    </el-form-item>
  </el-form>
</template>
<script>
import { updateOrderById } from "@/api/marketOrder";
import { isValidCharNum, validatSpecialCharact } from "@/utils/validate";

export default {
  props: ["id"],
  data() {
    const validCode = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请输入物流单号"));
        return false;
      }
      if (!isValidCharNum(value)) {
        callback(new Error("请输入合法的物流单号"));
      } else {
        callback();
      }
    }
    const validInc = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请输入物流公司"));
        return false;
      }
      if (validatSpecialCharact(value)) {
        callback(new Error("不能输入特殊字符"));
      } else {
        callback();
      }
    }
    return {
      formData: {
        id: this.id,
        deliveryCode: '',
        deliveryInc: ''
      },
      formRules: {
        deliveryCode: [
          { required: true, validator: validCode, trigger: "change" },
          { required: true, validator: validCode, trigger: "blur" }
        ],
        deliveryInc: [
          { required: true, validator: validInc, trigger: "change" },
          { required: true, validator: validInc, trigger: "blur" }
        ]
      }
    }
  },
  methods: {
    handleSubmitForm() {
      this.$refs["ExpressForm"].validate(valid => {
        if (valid) {
          updateOrderById(this.formData).then(res => {
            this.$parent.$parent.showDialog = false;
            this.$message({
              type: "success",
              message: "发货成功"
            });
            this.$parent.$parent.handleGetTableData();
          });
        }
      });
    }
  },
}
</script>
<style lang="scss">
  .express-form {
    .el-input {
      width: 80%;
    }
  }
</style>