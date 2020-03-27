<template>
  <el-form :model="formData" ref="expressForm" :rules="formRules" class="express-form" label-width="140px">
    <el-form-item label="快递运费：" prop="fee" required>
      <el-input v-model.trim="formData.fee" maxlength="10"></el-input> 元
    </el-form-item>
    <el-form-item label="免运费订单金额：" prop="orderFee" required>
      <el-input v-model.trim="formData.orderFee" maxlength="10"></el-input> 元
    </el-form-item>
    <el-form-item label="快递方式：" prop="expressType" required>
      <el-checkbox-group v-model="formData.expressType">
        <el-checkbox label="1">快递</el-checkbox>
        <el-checkbox label="2">到店自提</el-checkbox>
        <el-checkbox label="3">商家配送</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
  </el-form>
</template>
<script>
import { isValidPrice } from "@/utils/validate";
import { saveExpress, getExpress } from "@/api/marketSettings";

export default {
  props: ["id"],
  data() {
    const ValidPrice = function(rule, value, callback) {
      if (!isValidPrice(value)) {
        callback(new Error("请输入整数最多7位，小数点后1到2位的数字"));
        return false;
      }
      callback();
    }
    return {
      formData: {
        fee: "",
        orderFee: "",
        expressType: []
      },
      formRules: {
        fee: [
          { validator: ValidPrice, trigger: "change" },
          { validator: ValidPrice, trigger: "blur" }
        ],
        orderFee: [
          { validator: ValidPrice, trigger: "change" },
          { validator: ValidPrice, trigger: "blur" }
        ],
        expressType: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个快递方式",
            trigger: "change"
          }
        ]
      }
    }
  },
  created() {
    if (this.id) {
      this.handleGetExpressSet();
    }
  },
  methods: {
    handleGetExpressSet() {
      getExpress({ id: this.id }).then(res => {
        this.formData.fee = res.tableData.fee;
        this.formData.orderFee = res.tableData.orderFee;
        this.formData.expressType = res.tableData.expressType.split(",");
      });
    },
    handleSubmitForm() {
      this.$refs.expressForm.validate(valid => {
        if (valid) {
          let option = {
            fee: this.formData.fee,
            orderFee: this.formData.orderFee,
            expressType: this.formData.expressType.join(",")
          };
          if (this.id) {
            option.id = this.id;
          }
          this.$parent.$parent.isSubmit = true;
          saveExpress(option).then(res => {
            this.$message({
              type: "success",
              message: "保存成功"
            });
            this.$parent.$parent.showDialog = false;
            this.$parent.$parent.isSubmit = false;
            this.$parent.$parent.handleGetTableData();
          }).catch(() => { this.$parent.$parent.isSubmit = false });
        }
      });
    }
  }
}
</script>
<style lang="scss" scoped>
.express-form {
  .el-input {
    width: 80%;
  }
  .el-upload i {
    width: 220px;
    height: 130px;
    font-size: 28px;
    color: #8c939d;
    line-height: 130px;
    background: #E8E8E8;
    text-align: center;
  }
}
</style>