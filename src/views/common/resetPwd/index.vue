<template>
  <div class="reset-container" :style="{background: 'url(' + background + ')'}">
    <el-form class="reset-form login-forget-form" autocomplete="on" status-icon :model="resetPwdForm" :rules="resetPwdRules" ref="resetPwdForm" label-position="left">

      <el-form-item prop="tel">
        <el-input name="tel" type="text" v-model="resetPwdForm.tel" placeholder="请输入手机号" autocomplete="off" auto-complete="new-tel"/>
      </el-form-item>

      <el-form-item class="border-item" prop="verifyCode">
        <el-input class="verifyCode" name="verifyCode" type="text" v-model="resetPwdForm.verifyCode" autocomplete="off" auto-complete="new-code" placeholder="请输入验证码" style="width:60%;"/>
        <el-button type="success" round @click="handleGetVerifyCode" :disabled="verifyCodeBtnStatus" style="width: 30%;float:right">{{verifyCodeBtnText}}</el-button>
      </el-form-item>

      <el-form-item prop="password">
        <el-input name="password" type="password" v-model="resetPwdForm.password" autocomplete="off" auto-complete="new-password" maxlength="18" placeholder="请输入6位及以上密码"/>
      </el-form-item>
      
      <el-form-item prop="confirmPassword">
        <el-input name="confirmPassword" type="password" @keyup.enter.native="handleResetPassword" v-model="resetPwdForm.confirmPassword" maxlength="18" autocomplete="off" auto-complete="new-confirmPassword" placeholder="请确认密码"/>
      </el-form-item>

      <el-form-item class="border-item">
        <el-button type="primary" style="width:100%;font-size:18px;" @click.native.prevent="handleResetPassword">重置密码</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
import { getVerifyCode, updatePwd } from "@/api/login";
import { Message } from 'element-ui';
import { validTel, validPassword, validverifyCode } from '@/views/main/ygmanage/rules';

export default {
  name: "login",
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
      background: require("@/assets/login/bg.png"),
      resetPwdForm: {
        confirmPassword: '',
        password: '',
        tel: '',
        verifyCode: ''
      },
      verifyCodeBtnText: "获取验证码",
      verifyCodeBtnTime: 60,
      verifyCodeBtnStatus: false,
      verifyCodeInterval: null,
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
      }
    };
  },
  methods: {
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
    handleResetPassword() {
      this.$refs.resetPwdForm.validate(valid => {
        if (valid) {
          updatePwd(this.resetPwdForm).then(res => {
            this.$router.push({ path: "/login" });
          })
        }
      })
    }
  },
  beforeDestroy() {
    this.$nextTick(() => {
      clearInterval(this.verifyCodeInterval);
    })
  },
};
</script>

<style rel="stylesheet/scss" lang="scss">
/* reset element-ui css */
.reset-container {
  .border-item .el-col {
    font-size: 18px;
    color: #101010;
    span:not(.el-input__suffix){
      line-height: 36px;
      padding: 10px 30px;
    }
    .el-button--medium.is-round {
      padding: 0 10px;
    }
    .el-button span {
      line-height: 45px;
      padding: 0px 25px;
    }
  }
  .border-item .el-col:nth-child(1) {
    text-align: left;
  }
  .border-item .el-col:nth-child(2) {
    text-align: right;
  }
  .border-item .el-col.active span {
    color: #0076ff;
    border-bottom: 2px solid #0076ff;
  }
  .el-input {
    display: inline-block;
    width: 100%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: #101010;
      line-height: 32px;
    }
  }
  .el-input.verifyCode {
    float:left;
    border: 1px solid #101010;
    border-radius: 5px;
  }
  .el-form-item:not(.border-item) {
    border: 1px solid #101010;
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
$dark_gray: #101010;
$light_gray: #101010;

/deep/ .el-form-item__content {
  line-height: 20px;
}

.reset-container {
  @include relative;
  height: 100vh;
  .reset-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 420px;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
    background: #fff;
    color: #101010;
    box-shadow: 0 6px 20px 5px rgba(40, 120, 255, 0.1), 0 16px 24px 2px rgba(0, 0, 0, 0.05);
  }
}
</style>