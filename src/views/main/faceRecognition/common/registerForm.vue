<template>
  <el-form ref="validateForm" :model="data" :rules="formRules" label-width="120px" :label-position="'right'">
    <el-form-item label-width="0px" style="text-align:center;">
      <img :src="faceImg" width="100" height="100">
    </el-form-item>
    <el-form-item label="姓名:" prop="name">
      <el-input v-model="data.name" maxlength="5" placeholder="请输入姓名" style="width:80%;"></el-input>
    </el-form-item>
    <el-form-item label="电话:" prop="tel">
      <el-input v-model="data.tel" maxlength="11" placeholder="请输入手机号" style="width:80%;"></el-input>
    </el-form-item>
  </el-form>
</template>
<script>
import { isValidPhone } from "@/utils/validate";
export default {
  data() {
    const validName  = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请输入姓名"));
        return false;
      }
      if (value.trim() == "") {
        callback(new Error("不能输入纯空格"));
      } else {
        callback();
      }
    }
    const validTel = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请输入手机号"));
        return false;
      }
      if (!isValidPhone(value)) {
        callback(new Error("请输入正确的手机号"));
      } else {
        callback();
      }
    }
    return {
      faceImg: '',
      data: {
        id: '',
        name: '',
        tel: '',
        type: ''
      },
      formRules: {
        name: [
          { validator: validName, trigger: "change" },
          { validator: validName, trigger: "blur" }
        ],
        tel: [
          { validator: validTel, trigger: "change" },
          { validator: validTel, trigger: "blur" }
        ],
      }
    }
  },
  created() {
    const $parent = this.$parent.$parent.$parent;
    let data = $parent.asideData.filter(it => it.id == $parent.customId);
    this.data.type = $parent.registeType;
    this.data.id = data[0].id;
    this.faceImg = data[0].arriveUrl;
  },
}
</script>