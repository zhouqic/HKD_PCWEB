<template>
  <div class="userset-container main-content">
    <el-form :model="userSetForm" :rules="userSetRules" ref="userSetForm" label-width="90px" status-icon class="userSetForm">
      <el-form-item label="所属门店：">
        <el-input :value="$store.getters.shop" disabled></el-input>
      </el-form-item>
      <el-form-item label="角色：">
        <el-input :value="$store.getters.avatar" disabled></el-input>
      </el-form-item>
      <el-form-item label="工号：">
        <el-input :value="$store.getters.jobNumber" disabled></el-input>
      </el-form-item>
      <el-form-item label="姓名：" prop="name">
        <el-input v-model="userSetForm.name" maxlength="12"></el-input>
      </el-form-item>
      <el-form-item label="手机号：" prop="tel">
        <el-input v-model="userSetForm.tel"></el-input>
        <el-button type="primary" style="margin-left:30px;" @click="handlerSaveRFStaff">保存</el-button>
        <el-button type="primary" @click="showDialog = true">修改密码</el-button>
      </el-form-item>
      <el-form-item>
      </el-form-item>
    </el-form>
    <!-- 修改密码 -->
    <el-dialog title="修改密码" :visible.sync="showDialog" width="500px" ref="StaffFormDialog" @closed="handleBeforeCloseForm" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form class="reset-form" autocomplete="on" status-icon :model="resetPwdForm" :rules="resetPwdRules" ref="resetPwdForm" label-width="90px">

        <el-form-item prop="tel" label="手机号：">
          <el-input name="tel" type="text" v-model="resetPwdForm.tel" placeholder="请输入手机号" autocomplete="off" auto-complete="new-tel"/>
        </el-form-item>

        <el-form-item class="border-item" prop="verifyCode" label="验证码：">
          <el-col :span="16"><el-input class="verifyCode" name="verifyCode" type="text" v-model="resetPwdForm.verifyCode" autocomplete="off" placeholder="请输入验证码" style="width:85%;"/></el-col>
          <el-col :span="8"><el-button type="success" round @click="handleGetVerifyCode" :disabled="verifyCodeBtnStatus" style="width: 100%;">{{verifyCodeBtnText}}</el-button></el-col>
        </el-form-item>

        <el-form-item prop="password" label="密码：">
          <el-input name="password" type="password" v-model="resetPwdForm.password" autocomplete="off" maxlength="18" placeholder="请输入6位及以上密码"/>
        </el-form-item>
        
        <el-form-item prop="confirmPassword" label="确认密码：">
          <el-input name="confirmPassword" type="password" @keyup.enter.native="handleResetPassword" v-model="resetPwdForm.confirmPassword" maxlength="18" autocomplete="off" placeholder="请确认密码"/>
        </el-form-item>

        <div style="text-align:right;">
          <el-button @click.native.prevent="handleBeforeCloseForm">取消</el-button>
          <el-button type="primary" @click.native.prevent="handleResetPassword">确定</el-button>
        </div>

      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { getAgentBriefInfo } from "@/api/sjsettings";
import { validName, validTel, validPassword, validverifyCode } from "../ygmanage/rules";
import { getVerifyCode, updatePwd } from "@/api/login";
import { saveRfStaff } from "@/api/staffManage";
import { Message } from 'element-ui';

export default {
  name: "myservices_view",
  data() {
    const validConfirmPassword = (rule, value, callback)  => {
      if (value == "") {
        callback(new Error("请输入确认密码"));
        return false;
      }
      if (value != this.resetPwdForm.password) {
        callback(new Error("两次输入密码不一致"));
      } else {
        callback();
      }
    };
    return {
      data: {},
      showDialog: false,
      userSetForm: {
        id: this.$store.getters.staffId,
        name: this.$store.getters.name,
        tel: this.$store.getters.tel
      },
      userSetRules: {
        name: [
          { validator: validName, trigger: "change" },
          { validator: validName, trigger: "blur" }
        ],
        tel: [
          { validator: validTel, trigger: "change" },
          { validator: validTel, trigger: "blur" }
        ]
      },
      resetPwdForm: {
        tel: '',
        verifyCode: '',
        password: '',
        confirmPassword: ''
      },
      resetPwdRules: {
        verifyCode: [
          { trigger: "blur", validator: validverifyCode },
          { trigger: "change", validator: validverifyCode }
        ],
        tel: [
          { trigger: "blur", validator: validTel},
          { trigger: "change", validator: validTel}
        ],
        password: [
          { trigger: "blur", validator: validPassword },
          { trigger: "change", validator: validPassword }
        ],
        confirmPassword: [
          { trigger: "blur", validator: validConfirmPassword },
          { trigger: "change", validator: validConfirmPassword },
        ]
      },
      verifyCodeBtnText: "获取验证码",
      verifyCodeBtnTime: 60,
      verifyCodeBtnStatus: false,
      verifyCodeInterval: null
    }
  },
  created() {
    getAgentBriefInfo().then(res => {
      this.data = res.tableData;
    })
  },
  methods: {
    handlerSaveRFStaff() {
      this.$refs.userSetForm.validate(valid => {
        saveRfStaff(this.userSetForm).then(() => {
          Message({
            message: "保存成功",
            type: 'success',
            duration: 3 * 1000
          });
          this.$store.dispatch('UpdateUserInfo', this.userSetForm);
        })
      })
    },
    handleGetVerifyCode() {
      this.$refs["resetPwdForm"].validateField(["tel"], error => {
        if (!error) {
          this.verifyCodeBtnStatus = true;
          this.verifyCodeInterval = setInterval(() => {
            this.verifyCodeBtnTime--;
            if (this.verifyCodeBtnTime >= 0) {
              this.verifyCodeBtnText = this.verifyCodeBtnTime + " 秒";
            } else {
              clearInterval(this.verifyCodeInterval);
              this.verifyCodeBtnTime = 60;
              this.verifyCodeBtnText = "获取验证码";
              this.verifyCodeBtnStatus = false;
            }
          }, 1000);
          getVerifyCode(this.resetPwdForm.tel).then(res => {
            if (res.success) {
              Message({
                message: "发送成功",
                type: 'success',
                duration: 3 * 1000
              });
            } else {
              Message({
                message: "发送失败",
                type: 'success',
                duration: 3 * 1000
              });
            }
          });
        }
      })
    },
    handleBeforeCloseForm() {
      this.$refs["resetPwdForm"].clearValidate();
      this.showDialog = false;
    },
    handleResetPassword() {
      this.$refs.resetPwdForm.validate(valid => {
        if (valid) {
          updatePwd(this.resetPwdForm).then(res => {
            Message({
              message: "修改成功",
              type: 'success',
              duration: 3 * 1000
            });
            this.handleBeforeCloseForm();
          })
        }
      })
    }
  },
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.userset-container {
  padding: 40px !important;
  font-size: 16px;
  color: #101010;
  .row-item {
    overflow: hidden;
    margin-bottom: 40px;
    .row-item-label {
      float: left;
      width: 115px;
      margin-right: 65px;
    }
    .row-item-content {
      float: left;
    }
  }
  .userSetForm .el-input {
    width: 220px!important;
  }
 .reset-form {
   padding-right: 20px;
   .el-input {
      width: 100%;
    }
 }
}
</style>