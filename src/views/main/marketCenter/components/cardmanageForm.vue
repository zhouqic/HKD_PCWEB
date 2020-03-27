<template>
  <el-form ref="validateForm" :model="formData" :rules="formRules" label-width="110px" :label-position="'right'">
    <el-form-item label="券类型:">
      <el-radio-group v-model="cardType">
        <el-radio :label="0">优惠券</el-radio>
        <el-radio :label="1" v-if="$store.state.permission.showHUIYUANDABAO || $store.state.permission.showYingXiao || $store.state.permission.showFuLiShe || $store.state.permission.showShangMeng">商品兑换券</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="券名称:" prop="title">
      <el-input v-model.trim="formData.title" maxlength="20"></el-input>
    </el-form-item>
    <el-form-item label="券图片:" prop="pic" v-if="cardType == 1" :rules="[{ validator: handleVlidPic, trigger: 'blur' }]">
      <el-upload action :auto-upload="false" :show-file-list="false" :on-change="handleOnPicChange">
        <img v-if="formData.pic" :src="typeof formData.pic == 'string' ? formData.pic : URL.createObjectURL(formData.pic)" width="200" height="200" style="border-radius:10px;">
        <i v-else class="el-icon-plus"></i>
      </el-upload>
    </el-form-item>
    <el-form-item label="券面额:" prop="price">
      <el-input v-model.number="formData.price" maxlength="7">
        <template slot="append">元 / 张</template>
      </el-input>
    </el-form-item>
    <el-form-item label="使用条件:" prop="leastCost" v-if="cardType != 1">
      <el-input v-model="formData.leastCost" maxlength="7">
        <template slot="prepend">满</template>
        <template slot="append">元，可使用</template>
      </el-input>
    </el-form-item>
    <el-form-item label="是否可赠送:" v-if="cardType == 0">
      <el-radio-group v-model="formData.isSend">
        <el-radio :label="0">不可赠送</el-radio>
        <el-radio :label="1">可赠送</el-radio>
      </el-radio-group>
      <div style="color:#F56C6C;">特别提醒：开启后，用户可通过微信赠送给好友使用该优惠券。</div>
    </el-form-item>
    <el-form-item label="有效期:">
      <el-radio-group v-model="formData.type">
        <el-radio :label="0">固定天数</el-radio>
        <el-radio :label="1" :disabled="cardType == 1 ? true : false">固定日期</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item prop="date" v-if="formData.type == 1" :rules="[{ required: true, message: '请选择有效期', trigger: 'blur' }]">
      <el-date-picker class="date-picker" unlink-panels v-model="formData.date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
    </el-form-item>
    <el-form-item prop="effectNum" v-if="cardType == 0 && formData.type == 0" :rules="[{ validator: handleValidFixedTerm.bind(this), trigger: 'blur' }]">
      <el-input v-model="formData.effectNum" maxlength="5">
        <template slot="prepend">用户领取后</template>
        <template slot="append">天生效</template>
      </el-input>
    </el-form-item>
    <el-form-item prop="fixedTerm" v-if="formData.type == 0" :rules="[{ validator: handleValidFixedTerm.bind(this), trigger: 'blur' }]">
      <el-input v-model="formData.fixedTerm" maxlength="5">
        <template slot="prepend">有效期</template>
        <template slot="append">天</template>
      </el-input>
    </el-form-item>
  </el-form>
</template>
<script>
import { isValidPrice, isValidInteger } from "@/utils/validate";
export default {
  data() {
    const validPrice = (rule, value, callback) => {
      if (parseFloat(value) === 0) {
        callback(new Error("请输入合理的金额"));
        return false;
      }
      if (!isValidPrice(value)) {
        callback(new Error("请输入合理的金额"));
        return false;
      }
      callback();
    };
    const validLeastCost = (rule, value, callback) => {
      if (this.formData.price !== "" && parseFloat(value) <= this.formData.price) {
        callback(new Error("最低消费金额需大于面额"));
        return false;
      }
      if (!isValidPrice(value)) {
        callback(new Error("请输入合理的金额"));
        return false;
      }
      callback();
    };
    return {
      URL: URL,
      cardType: 0,//0,优惠券；1,实物券
      formData: {
        title: '',
        price: '',
        date: "",
        leastCost: '',
        isSend: 0,
        type: 0,
        effectNum: '',
        fixedTerm: '',
        shareNum: 1,
        cardType: 'CASH',
        beginTimestamp: '',
        endTimestamp: '',
      },
      formRules: {
        title: [
          { required: true, message: '请输入券名称', trigger: 'blur' },
          { required: true, message: '请输入券名称', trigger: 'change' }
        ],
        price: [
          { validator: validPrice.bind(this), trigger: "change" },
          { validator: validPrice.bind(this), trigger: "blur" }
        ],
        leastCost: [
          { validator: validLeastCost.bind(this), trigger: "change" },
          { validator: validLeastCost.bind(this), trigger: "blur" }
        ]
      }
    }
  },
  watch: {
    'formData.date': {
      handler(n, o) {
        if (n != o) {
          this.formData.beginTimestamp = n[0] + " 00:00:00";
          this.formData.endTimestamp = n[1] + " 23:59:59";
        }
      },
      deep: true
    },
    'cardType': {
      handler(n, o) {
        if (n != o) {
          this.formData.type = 0;
        }
      }
    }
  },
  methods: {
    handleVlidPic(rule, value, callback) {
      if (!this.formData.pic) {
        callback(new Error("请上传图片"));
        return false;
      }
      callback();
    },
    handleValidFixedTerm(rule, value, callback) {
      if (parseFloat(value) === 0 || !isValidInteger(value)) {
        callback(new Error("请输入合理的有效期"));
        return false;
      }
      callback();
    },
    handleOnPicChange(file) {
      if (this.$checkFile(file.raw)) {
        this.$bus.emit('send-file', { file: file.raw,  ratio: 1 });
        this.$bus.once('set-file', val => {
          let reader = new FileReader();
          reader.readAsDataURL(val);
          reader.onload = (e) => {
            this.formData.pic = e.srcElement.result || e.currentTarget.result || e.target.result;
            this.$forceUpdate();
          }
        });
      }
    }
  }
}
</script>
<style scoped>
.el-input {
  width: 90%;
}
.date-picker {
  width: 90%!important;
}
/deep/ .el-upload i {
  width: 220px;
  height: 130px;
  font-size: 28px;
  color: #8c939d;
  line-height: 130px;
  background: #E8E8E8;
  text-align: center;
}
</style>