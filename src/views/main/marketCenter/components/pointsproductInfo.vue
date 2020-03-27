<template>
  <el-form ref="validateForm" :model="formData" :rules="formRules" label-width="120px" :label-position="'right'">
    <el-form-item label="首图:" prop="displayPic">
      <el-upload action='' :auto-upload="false" :show-file-list="false" :on-change="handleOnDisplayPicChange">
        <img v-if="formData.displayPic" :src="typeof formData.displayPic == 'string' ? formData.displayPic : URL.createObjectURL(formData.displayPic)" width="220">
        <i v-else class="el-icon-plus"></i>
      </el-upload>
    </el-form-item>
    <el-form-item label="商品名称:" prop="name">
      <el-input v-model.trim="formData.name" maxlength="12"></el-input>
    </el-form-item>
    <el-form-item label="兑换积分:" prop="pointPrice">
      <el-input v-model="formData.pointPrice" maxlength="9">
        <template slot="append">积分</template>
      </el-input>
    </el-form-item>
    <el-form-item label="兑换价:" prop="cheapPrice">
      <el-input v-model="formData.cheapPrice" maxlength="7">
        <template slot="append">元</template>
      </el-input>
    </el-form-item>
    <el-form-item label="原价:" prop="prePrice">
      <el-input v-model="formData.prePrice" maxlength="7">
        <template slot="append">元</template>
      </el-input>
    </el-form-item>
    <el-form-item label="库存:" prop="allStock">
      <el-input v-model="formData.allStock" maxlength="5">
        <template slot="append">件</template>
      </el-input>
    </el-form-item>
    <el-form-item label="详情图:" prop="detailPic">
      <el-upload action='' :auto-upload="false" :show-file-list="false" :on-change="handleOnDetailPicChange">
        <img v-if="formData.detailPic" :src="typeof formData.detailPic == 'string' ? formData.detailPic : URL.createObjectURL(formData.detailPic)" width="220">
        <i v-else class="el-icon-plus"></i>
      </el-upload>
    </el-form-item>
    <el-form-item label="商品详情:" prop="detailDesc">
      <el-input v-model="formData.detailDesc" type="textarea" maxlength="1024"></el-input>
    </el-form-item>
    <el-form-item label="自定义条款1:" prop="beginTime">
      <el-input v-model="formData.customTerm1" type="textarea" maxlength="20"></el-input>
    </el-form-item>
    <el-form-item label="自定义条款2:" prop="beginTime">
      <el-input v-model="formData.customTerm2" type="textarea" maxlength="20"></el-input>
    </el-form-item>
    <el-form-item label="自定义条款3:" prop="beginTime">
      <el-input v-model="formData.customTerm3" type="textarea" maxlength="20"></el-input>
    </el-form-item>
  </el-form>
</template>
<script>
import { isValidPrice, isValidNumber } from "@/utils/validate";
import { getPointsProductById } from '@/api/marketCenter';

export default {
  props: ["id"],
  data() {
    const validMoney = (rule, value, callback) => {
      if (value == "" || (parseFloat(value) == 0 && rule["field"] != "cheapPrice")) {
        callback(new Error("请输入合法金额"));
        return false;
      }
      if (!isValidPrice(value)) {
        callback(new Error("请输入整数最多7位，小数点后1到2位的数字"));
        return false;
      }
      if (rule["field"] == 'prePrice' && parseFloat(value) <= parseFloat(this.formData.cheapPrice)) {
        callback(new Error("原价需大于抢购价"));
        return false;
      }
      callback();
    }
    const validNum = (rule, value, callback) => {
      if (value == "" || parseFloat(value) == 0 || !isValidNumber(value)) {
        callback(new Error("请输入非零整数"));
        return false;
      }
      callback();
    }
    return {
      URL: URL,
      activeStep: 0,
      processStatus: 'success',// wait / process / finish / error / success
      formData: {
        name: '',
        type: 3,
        putaway: 1,
        limitBuy: 0,
        displayPic: '',
        detailPic: '',
        pointPrice: '',
        cheapPrice: '',
        prePrice: '',
        allStock: '',
        detailDesc: '',
        customTerm1: '',
        customTerm2: '',
        customTerm3: ''
      },
      formRules: {
        pointPrice: [
          { required: true, message: '请输入兑换积分', trigger: "blur" },
          { validator: validNum.bind(this), trigger: "change" },
          { validator: validNum.bind(this), trigger: "blur" }
        ],
        allStock: [
          { required: true, message: '请输入库存', trigger: "blur" },
          { validator: validNum.bind(this), trigger: "change" },
          { validator: validNum.bind(this), trigger: "blur" }
        ],
        cheapPrice: [
          { required: true, message: '请输入兑换价', trigger: "blur" },
          { validator: validMoney.bind(this), trigger: "change" },
          { validator: validMoney.bind(this), trigger: "blur" }
        ],
        prePrice: [
          { required: true, message: '请输入原价', trigger: "blur" },
          { validator: validMoney.bind(this), trigger: "change" },
          { validator: validMoney.bind(this), trigger: "blur" }
        ],
        name: [
          { required: true, message: '请输入商品名称', trigger: "blur" }
        ],
        displayPic: [
          { required: true, message: '请上传商品首图', trigger: "blur" }
        ],
        detailPic: [
          { required: true, message: '请上传商品详情图', trigger: "blur" }
        ],
        detailDesc: [
          { required: true, message: '请输入商品名称', trigger: "blur" }
        ]
      }
    }
  },
  created() {
    if (this.id) {
      getPointsProductById({ id: this.id }).then(res => {
        if (res.tableData) {
          Object.keys(this.formData).forEach(item => {
            this.formData[item] = res.tableData[item];
          })
          this.formData['id'] = res.tableData['id'];
        }
      })
    }
  },
  methods: {
    handleOnDisplayPicChange(file) {
      if (this.$checkFile(file.raw)) {
        this.$bus.emit('send-file', { file: file.raw,  ratio: 750/556 });
        this.$bus.once('set-file', val => {
          this.formData.displayPic = val;
          this.$forceUpdate();
        });
      }
    },
    handleOnDetailPicChange(file) {
      if (this.$checkFile(file.raw)) {
        this.$bus.emit('send-file', { file: file.raw,  ratio: NaN });
        this.$bus.once('set-file', val => {
          this.formData.detailPic = val;
          this.$forceUpdate();
        });
      }
    }
  }
}
</script>
<style scoped>
.el-form .el-input {
  width:400px;
}
.el-form .el-textarea {
  width:400px;
}
.el-form .el-upload i {
  width: 220px;
  height: 130px;
  font-size: 28px;
  color: #8c939d;
  line-height: 130px;
  background: #E8E8E8;
  text-align: center;
}
</style>