<template>
  <el-dialog
    :title="id ? '编辑员工' : '添加员工'"
    :visible.sync="visible"
    width="500px"
    ref="StaffFormDialog"
    class="staffInfoForm"
    @closed="handleBeforeCloseForm"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      :model="staffInfoForm"
      :rules="staffFormRules"
      ref="staffInfoForm"
      status-icon
      label-width="120px"
    >
      <el-form-item label="工号：" prop="jobNumber">
        <el-input
          v-model="staffInfoForm.jobNumber"
          v-if="staffInfoForm.id"
          :disabled="true"
          maxlength="6"
          autocomplete="off"
        ></el-input>
        <el-input
          v-model="staffInfoForm.jobNumber"
          v-else
          :disabled="false"
          placeholder="请输入工号"
          maxlength="6"
          autocomplete="off"
        ></el-input>
        <input type="hidden" v-model="staffInfoForm.id">
      </el-form-item>

      <el-form-item label="姓名：" prop="name">
        <el-input v-if="staffInfoForm.id" v-model="staffInfoForm.name" maxlength="4" autocomplete="off"></el-input>
        <el-input v-else v-model="staffInfoForm.name" placeholder="请输入姓名" maxlength="4" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="手机号：" prop="tel">
        <el-input v-if="staffInfoForm.id" v-model="staffInfoForm.tel" autocomplete="off"></el-input>
        <el-input v-else v-model="staffInfoForm.tel" placeholder="请输入手机号" autocomplete="off" auto-complete="new-password"></el-input>
      </el-form-item>

      <el-form-item :label="staffInfoForm.id ? '新密码：' : '密码：'" prop="password">
        <el-input
          v-if="staffInfoForm.id"
          v-model="staffInfoForm.password"
          type="password"
          maxlength="18"
          autocomplete="off"
          auto-complete="new-password"
        ></el-input>
        <el-input
          v-else
          v-model="staffInfoForm.password"
          type="password"
          placeholder="请输入密码"
          maxlength="18"
          autocomplete="off"
          auto-complete="new-password"
        ></el-input>
      </el-form-item>

      <el-form-item label="确认密码：" prop="confirmPassword">
        <el-input
          v-if="staffInfoForm.id"
          v-model="staffInfoForm.confirmPassword"
          type="password"
          maxlength="18"
          autocomplete="off"
        ></el-input>
        <el-input
          v-else
          v-model="staffInfoForm.confirmPassword"
          type="password"
          placeholder="请输入确认密码"
          maxlength="18"
          autocomplete="off"
        ></el-input>
      </el-form-item>

      <el-form-item label="所属角色：" v-if="!(id && staffInfoForm.jobNumber == 100000)">
        <el-select v-model="staffInfoForm.staffRole" :disabled="($store.getters.jobNumber == 100000 || !id) ? false : true">
          <el-option v-if="$store.getters.jobNumber == 100000 || staffInfoForm.staffRole == 0" value="0" label="店长"></el-option>
          <el-option value="1" label="店员"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="handleBeforeCloseForm">取 消</el-button>
      <el-button type="primary" @click="handleOnConfirmClick" :disabled="isSubmit ? true : false">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getRfStaffById, saveRfStaff } from "@/api/staffManage";
import { validName, validJobNumber, validTel } from "./rules";
import { isValidPwd } from "@/utils/validate";

export default {
  name: "StaffFormViews",
  props: ["id", "show"],
  data() {
    const validPassword = (rule, value, callback)  => {
      if (value == "" && !this.id) {
        callback(new Error("请输入密码"));
        return false;
      }
      if (value == "" && this.id) {
        callback();
        return false;
      }
      if (!isValidPwd(value)) {
        callback(new Error("请输入字母或数字组成的6位至18位密码"));
      } else {
        callback();
      }
    };
    const validConfirmPassword = (rule, value, callback)  => {
      // 编辑输入密码
      if (value == "" && this.staffInfoForm.password != "") {
        callback(new Error("请输入确认密码"));
        return false;
      }
      // 添加密码为空
      if (value == "" && !this.id) {
        callback(new Error("请输入确认密码"));
        return false;
      }
      // 与确认密码不一致
      if (value != this.staffInfoForm.password) {
        callback(new Error("两次输入密码不一致"));
      } else {
        callback();
      }
    };
    return {
      visible: this.show,
      isSubmit: false,
      staffFormRules: [],
      EditStaffInfoRules: {
        name: [
          { validator: validName, trigger: "change" },
          { validator: validName, trigger: "blur" }
        ],
        tel: [
          { validator: validTel, trigger: "change" },
          { validator: validTel, trigger: "blur" }
        ],
        password: [
          { validator: validPassword, trigger: "change" },
          { validator: validPassword, trigger: "blur" },
        ],
        confirmPassword: [
          { validator: validConfirmPassword, trigger: "change"},
          { validator: validConfirmPassword, trigger: "blur"}
        ]
      },
      AddStaffInfoRules: {
        name: [
          { validator: validName, trigger: "change" },
          { validator: validName, trigger: "blur" }
        ],
        jobNumber: [
          { validator: validJobNumber, trigger: "change" },
          { validator: validJobNumber, trigger: "blur" }
        ],
        tel: [
          { validator: validTel, trigger: "change" },
          { validator: validTel, trigger: "blur" }
        ],
        password: [
          { validator: validPassword, trigger: "change" },
          { validator: validPassword, trigger: "blur" }
        ],
        confirmPassword: [
          { validator: validConfirmPassword, trigger: "change"},
          { validator: validConfirmPassword, trigger: "blur"}
        ]
      },
      staffInfoForm: {
        id: "",
        jobNumber: "",
        password: "",
        confirmPassword: "",
        name: "",
        staffRole: this.$store.getters.jobNumber == 100000 ? "0" : "1",
        tel: ""
      }
    };
  },
  created() {
    if (this.id) {
      this.staffFormRules = this.EditStaffInfoRules;
      this.handleGetStaffInfo();
    } else {
      this.staffFormRules = this.AddStaffInfoRules;
    }
  },
  beforeDestroy() {
    this.$refs["staffInfoForm"].clearValidate();
  },
  methods: {
    handleGetStaffInfo() {
      getRfStaffById(this.id).then(res => {
        Object.keys(this.staffInfoForm).forEach(item => {
          this.staffInfoForm[item] = String(res.tableData[item]);
        });
        this.staffInfoForm["password"] = "";
        this.staffInfoForm["confirmPassword"] = "";
      });
    },
    handleSubmitForm() {
      saveRfStaff(this.staffInfoForm).then(res => {
        this.isSubmit = false;
        this.visible = false;
        this.$emit("close");
      }).catch(err => {
        this.isSubmit = false;
      });
    },
    handleOnConfirmClick() {
      this.$refs["staffInfoForm"].validate(valid => {
        if (valid) {
          this.isSubmit = true;
          this.handleSubmitForm();
        }
      });
    },
    handleBeforeCloseForm() {
      this.visible = false;
      this.$emit("close"); 
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.staffInfoForm {
  .el-input {
    width: 80%;
  }
  .el-select {
    width: 80%;
  }
}
</style>
