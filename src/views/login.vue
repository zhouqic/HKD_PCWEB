<template>
  <div class="login-container" :style="{background: 'url(' + background + ')'}">
    <el-form class="login-form" autocomplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">

      <el-form-item class="border-item" style="margin-bottom:22px;">
        <el-col v-if="loginForm.loginType == 0" class="active" :span="12"><span @click="handleChangeType(0)">老板登录</span></el-col>
        <el-col v-else :span="12"><span @click="handleChangeType(0)">老板登录</span></el-col>
        <el-col v-if="loginForm.loginType == 1" class="active" :span="12"><span @click="handleChangeType(1)">员工登录</span></el-col>
        <el-col v-else :span="12"><span @click="handleChangeType(1)">员工登录</span></el-col>
      </el-form-item>

      <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="people"/>
        </span>
        <el-input name="username" type="text" v-model="loginForm.username" autocomplete="on" placeholder="请输入账号"/>
      </el-form-item>

      <el-form-item v-if="loginForm.loginType==1" prop="jobNumber">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="jobNumber"/>
        </span>
        <el-input name="jobNumber" v-model="loginForm.jobNumber" autocomplete="on" placeholder="请输入工号"/>
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="password"/>
        </span>
        <el-input name="password" :type="passwordType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autocomplete="on" placeholder="请输入密码"/>
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye"/>
        </span>
      </el-form-item>

      <el-form-item class="border-item">
        <el-checkbox v-model="rememberPwd" style="color: #101010;">记住密码</el-checkbox>
        <router-link to="/reset_pwd" style="float:right;color:#999;" v-if="loginForm.loginType!=1">忘记密码 ？</router-link>
      </el-form-item>

      <el-form-item class="border-item">
        <el-button type="primary" style="width:100%;font-size:18px;" :loading="loading" @click.native.prevent="handleLogin">登录</el-button>
      </el-form-item>

      <el-form-item class="border-item">
        <div style="color: #ccc;font-size:12px;">推荐使用<span style="color: #409EFF;">360浏览器(极速模式)</span>、<span style="color: #409EFF;">谷歌</span>或<span style="color: #409EFF;">QQ浏览器</span>，避免因兼容问题引起的体验不畅</div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
let Base64 = require('js-base64').Base64;

export default {
  name: "login",
  data() {
    return {
      rememberPwd: false,
      background: require("@/assets/login/bg.png"),
      loginForm: {
        loginType: 0,
        username: "",
        jobNumber: '',
        password: ""
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "请输入账号" }
        ],
        jobNumber: [
          { required: true, trigger: "blur", message: "请输入工号" }
        ],
        password: [
          { required: true, trigger: "blur", message: "请输入密码" }
        ]
      },
      passwordType: "password",
      loading: false
    };
  },
  created() {
    if (localStorage.getItem("username")) {
      this.loginForm.username = localStorage.getItem("username");
    }
    if (localStorage.getItem("password")) {
      this.loginForm.password = Base64.decode(localStorage.getItem("password"));
    }
    if (localStorage.getItem("jobNumber")) {
      this.loginForm.jobNumber = localStorage.getItem("jobNumber");
    }
  },
  beforeDestroy() {
    this.$refs["loginForm"].resetFields();
  },
  methods: {
    handleChangeType(type) {
      this.loginForm.loginType = type;
      this.$refs["loginForm"].resetFields();
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store.dispatch("LoginByUsername", this.loginForm).then(res => {
              this.loading = false;
              if (res.staffRole == 0) {
                this.$router.push({ path: "/" }, onComplete => { }, onAbort => { });
              } else {
                this.$router.push({ path: "/ddmanage/gathering_views" }, onComplete => { }, onAbort => { });
              }
              if (this.rememberPwd) {
                localStorage.setItem("username", this.loginForm.username);
                localStorage.setItem("password", Base64.encode(this.loginForm.password));
                localStorage.setItem("jobNumber", this.loginForm.jobNumber);
              }
            }).catch(() => {
              this.loading = false;
            });
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
/* reset element-ui css */
.login-container {
  input:-webkit-autofill {
    background-color: rgb(250, 255, 250) !important;
  }
  .border-item .el-col {
    font-size: 18px;
    color: #101010;
    span{
      cursor: pointer;
      line-height: 36px;
      padding: 5px 20px 10px 20px;
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
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 0px;
      color: #101010;
      line-height: 32px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px #fff inset !important;
        -webkit-text-fill-color: #101010 !important;
      }
    }
  }
  .el-checkbox__inner {
    border-radius: 50%; 
  }
  .el-form-item:not(.border-item) {
    border: 1px solid #101010;
    border-radius: 5px;
    color: #454545;
  }
  /deep/ .el-form-item__content {
    line-height: 20px;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
$dark_gray: #101010;
$light_gray: #101010;
.login-container {
  @include relative;
  height: 100vh;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 420px;
    padding: 25px 35px 15px 35px;
    margin: 120px auto;
    background: #fff;
    color: #101010;
    box-shadow: 0 6px 20px 5px rgba(40, 120, 255, 0.1), 0 16px 24px 2px rgba(0, 0, 0, 0.05);
  }
  .svg-container {
    padding: 6px 0;
    margin-left: 5px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    text-align: center;
    &_login {
      font-size: 24px;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 24px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>