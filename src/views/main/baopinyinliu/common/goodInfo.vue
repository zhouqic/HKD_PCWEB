<template>
  <div class="form-container">
    <el-form ref="goodInfoForm" :model="data" :rules="data.putaway != -1 ? rules : {}" status-icon label-width="140px" label-position="left">
      <el-form-item label="商品首图：" prop="displayPic" v-if="data.putaway != -1 && data.putaway != 1 && data.putaway !== 0">
        <div class="pic-item img-box" v-if="data.displayPic">
          <img :src="typeof data.displayPic == 'string' ? data.displayPic : URL.createObjectURL(data.displayPic)" width="200">
          <i class="el-icon-error" @click="handleDeletePic('displayPic')"></i>
        </div>
        <div class="pic-item img-box" v-if="data.displayPic2">
          <img :src="typeof data.displayPic2 == 'string' ? data.displayPic2 : URL.createObjectURL(data.displayPic2)" width="200">
          <i class="el-icon-error" @click="handleDeletePic('displayPic2')"></i>
        </div>
        <div class="pic-item img-box" v-if="data.displayPic3">
          <img :src="typeof data.displayPic3 == 'string' ? data.displayPic3 : URL.createObjectURL(data.displayPic3)" width="200">
          <i class="el-icon-error" @click="handleDeletePic('displayPic3')"></i>
        </div>
        <div class="pic-item" v-show="!data.displayPic || !data.displayPic2 || !data.displayPic3">
          <el-upload action='' :auto-upload="false" :show-file-list="false" :on-change="handleOnDisplayPicChange">
            <i class="el-icon-plus"></i>
          </el-upload>
        </div>
      </el-form-item>
      <el-form-item label="商品首图：" v-else>
        <div class="pic-item">
          <img :src="data.displayPic" width="220">
        </div>
        <div class="pic-item" v-if="data.displayPic2" style="margin: 0 5px;">
          <img :src="data.displayPic2" width="220">
        </div>
        <div class="pic-item" v-if="data.displayPic3">
          <img :src="data.displayPic3" width="220">
        </div>
      </el-form-item>
      <el-form-item label="商品名称：" v-if="data.putaway != -1" prop="name">
        <el-input :disabled="data.putaway == -1 ? true : false" v-model="data.name" style="width: 100%;" placeholder="请输入商品名称" maxlength="10"></el-input>
      </el-form-item>
      <el-form-item label="抢购价：" prop="cheapPrice">
        <el-input :disabled="data.putaway == -1 ? true : false" v-model="data.cheapPrice" placeholder="请输入抢购价" maxlength="10"></el-input> 元
      </el-form-item>
      <el-form-item label="原价：" prop="prePrice">
        <el-input :disabled="data.putaway == -1 ? true : false" v-model="data.prePrice" placeholder="请输入原价" maxlength="10"></el-input> 元
      </el-form-item>
      <el-form-item label="库存：" prop="allStock">
        <el-input :disabled="data.putaway == -1 ? true : false" v-model="data.allStock" placeholder="请输入库存数" maxlength="5"></el-input> 件
      </el-form-item>
      <el-form-item label="商品分类：" prop="industryId">
        <el-select v-model="data.industryId" placeholder="请选择商品分类" :disabled="data.putaway == -1 ? true : false">
          <el-option v-for="item in industryList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="详情图片：" prop="detailPic" v-if="data.putaway != -1 && data.putaway != 1 && data.putaway !== 0">
        <div class="pic-item img-box" v-if="data.detailPic">
          <img :src="typeof data.detailPic == 'string' ? data.detailPic : URL.createObjectURL(data.detailPic)" width="200">
          <i class="el-icon-error" @click="handleDeletePic('detailPic')"></i>
        </div>
        <div class="pic-item img-box" v-if="data.detailPic2">
          <img :src="typeof data.detailPic2 == 'string' ? data.detailPic2 : URL.createObjectURL(data.detailPic2)" width="200">
          <i class="el-icon-error" @click="handleDeletePic('detailPic2')"></i>
        </div>
        <div class="pic-item img-box" v-if="data.detailPic3">
          <img :src="typeof data.detailPic3 == 'string' ? data.detailPic3 : URL.createObjectURL(data.detailPic3)" width="200">
          <i class="el-icon-error" @click="handleDeletePic('detailPic3')"></i>
        </div>
        <div class="pic-item img-box" v-if="data.detailPic4">
          <img :src="typeof data.detailPic4 == 'string' ? data.detailPic4 : URL.createObjectURL(data.detailPic4)" width="200">
          <i class="el-icon-error" @click="handleDeletePic('detailPic4')"></i>
        </div>
        <div class="pic-item img-box" v-if="data.detailPic5">
          <img :src="typeof data.detailPic5 == 'string' ? data.detailPic5 : URL.createObjectURL(data.detailPic5)" width="200">
          <i class="el-icon-error" @click="handleDeletePic('detailPic5')"></i>
        </div>
        <div class="pic-item img-box" v-if="data.detailPic6">
          <img :src="typeof data.detailPic6 == 'string' ? data.detailPic6 : URL.createObjectURL(data.detailPic6)" width="200">
          <i class="el-icon-error" @click="handleDeletePic('detailPic6')"></i>
        </div>
        <div class="pic-item" v-if="!data.detailPic || !data.detailPic2 || !data.detailPic3 || !data.detailPic4 || !data.detailPic5 || !data.detailPic6">
          <el-upload action='' :auto-upload="false" :show-file-list="false" :on-change="handleOnDetailPicChange">
            <i class="el-icon-plus"></i>
          </el-upload>
        </div>
      </el-form-item>
      <el-form-item label="详情图片：" v-else>
        <div class="pic-item">
          <img :src="data.detailPic" width="220">
        </div>
        <div class="pic-item" v-if="data.detailPic2" style="margin: 0 5px;">
          <img :src="data.detailPic2" width="220">
        </div>
        <div class="pic-item" v-if="data.detailPic3">
          <img :src="data.detailPic3" width="220">
        </div>
        <div class="pic-item" v-if="data.detailPic4">
          <img :src="data.detailPic4" width="220">
        </div>
        <div class="pic-item" v-if="data.detailPic5" style="margin: 0 5px;">
          <img :src="data.detailPic5" width="220">
        </div>
        <div class="pic-item" v-if="data.detailPic6">
          <img :src="data.detailPic6" width="220">
        </div>
      </el-form-item>
      <el-form-item label="商品详情：" prop="detailDesc">
        <el-input :disabled="data.putaway == -1 ? true : false" v-model="data.detailDesc" type="textarea" placeholder="请输入商品详情" maxlength="1024"></el-input>
      </el-form-item>
      <el-form-item label="是否可以使用红包：" prop="usableDiscount" v-if="$parent.$parent.activeTab == 1">
        <el-radio-group :disabled="data.putaway == -1 ? true : false" v-model="data.usableDiscount">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="购买须知：" prop="limitBuy">
        <el-radio :value="true" :label="true">退款提醒：在线支付，不支持退款</el-radio>
        <div>是否限购：</div>
        <el-radio-group :disabled="data.putaway != -1 ? false : true" v-model="islimitBuy">
          <el-radio :label="0">不限购</el-radio>
          <el-radio :label="1">
            每人限购 <el-input v-model="data.limitBuy" :value="islimitBuy == 0 ? '' : data.limitBuy" :disabled="(islimitBuy == 0 || data.putaway == -1) ? true : false" maxlength="5" style="width: 100px;"></el-input> 件
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="自定义条款：">
        <div class="customTerm">
          <span class="customTerm-label">1</span>
          <el-input :disabled="data.putaway == -1 ? true : false" v-model="data.customTerm1" maxlength="20"></el-input>
        </div>
        <div class="customTerm">
          <span class="customTerm-label">2</span>
          <el-input :disabled="data.putaway == -1 ? true : false" v-model="data.customTerm2" maxlength="20"></el-input>
        </div>
        <div class="customTerm">
          <span class="customTerm-label">3</span>
          <el-input :disabled="data.putaway == -1 ? true : false" v-model="data.customTerm3" maxlength="20"></el-input>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getProductCategory, getRfSingleProductById } from '@/api/bpyinliu';
import rules from './rules';

export default {
  name: 'goodInfo',
  mixins: [rules],
  data() {
    return {
      URL: URL,
      industryList: [],
      displayPicKey: 1,
      islimitBuy: 0,
      data: {
        usableDiscount: 0,
        limitBuy: 0,
        type: this.$parent.$parent.activeTab,
        putaway: ''
      }
    }
  },
  watch: {
    islimitBuy(newval, oldval) {
      if (!newval) {
        this.data.limitBuy = 0;
      } else {
        this.data.limitBuy = '';
      }
    }
  },
  created() {
    getProductCategory().then(res => {
      res.tableData.forEach(item => {
        this.industryList.push({ label: item.title, value: item.id });
      });
    })
    if (this.$parent.$parent.id) {
      getRfSingleProductById({ id: this.$parent.$parent.id }).then(res => {
        if (res.tableData.limitBuy == 0) {
          this.islimitBuy = 0;
        }
        this.data = res.tableData;
      })
    }
  },
  methods: {
    handleDeletePic(pic) {
      delete this.data[pic];
      this.$forceUpdate();
    },
    handleOnDisplayPicChange(file) {
      if (this.$checkFile(file.raw)) {
        this.$bus.emit('send-file', { file: file.raw,  ratio: 1/1 });
        this.$bus.once('set-file', val => {
          if (!this.data.displayPic) {
            this.data.displayPic = val;
          } else if (!this.data.displayPic2) {
            this.data.displayPic2 = val;
          } else if (!this.data.displayPic3) {
            this.data.displayPic3 = val;
          }
          this.$forceUpdate();
        });
      }
    },
    handleOnDetailPicChange(file) {
      if (this.$checkFile(file.raw)) {
        this.$bus.emit('send-file', { file: file.raw,  ratio: NaN });
        this.$bus.once('set-file', val => {
          if (!this.data.detailPic) {
            this.data.detailPic = val;
          } else if (!this.data.detailPic2) {
            this.data.detailPic2 = val;
          } else if (!this.data.detailPic3) {
            this.data.detailPic3 = val;
          } else if (!this.data.detailPic4) {
            this.data.detailPic4 = val;
          } else if (!this.data.detailPic5) {
            this.data.detailPic5 = val;
          } else if (!this.data.detailPic6) {
            this.data.detailPic6 = val;
          }
          this.$forceUpdate();
        });
      }
    }
  },
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.form-container {
  margin-top: 5px;
  padding-right: 15px;
  height: 400px;
  overflow: auto;
  .img-box {
    position: relative;
    margin-right: 10px;
    .el-icon-error {
      position: absolute;
      top: 10px;
      right: -5px;
      font-size: 18px;
      color: red;
      cursor: pointer;
    }
  }
  .pic-item {
    display: inline-block;
    vertical-align: top;
    padding-top: 15px;
  }
  .customTerm {
    margin-bottom: 15px;
    overflow: hidden;
    .customTerm-label {
      width: 25px;
      float: left;
    }
    .el-input {
      width: calc(100% - 25px);
      float: left;
    }
  }
  /deep/ .el-upload i.el-icon-plus {
    width: 200px;
    height: 130px;
    font-size: 28px;
    color: #8c939d;
    line-height: 130px;
    background: #E8E8E8;
    text-align: center;
  }
  .el-input {
    width: 200px;
  }
  .el-select {
    width: 200px;
    .el-input__suffix .el-input__suffix-inner {
      display: none;
    }
  }
}
</style>