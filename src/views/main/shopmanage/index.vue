<template>
  <div class="clound-container main-content">
    <el-form :model="data" :rules="rules" ref="shopInfoForm" status-icon label-width="150px">

      <el-form-item label="门店LOGO：" class="logo-item" prop="logo">
        <el-upload action='' :auto-upload="false" :show-file-list="false" :on-change="handleOnLogoChange">
          <img v-if="data.logo" :src="typeof data.logo == 'string' ? data.logo : URL.createObjectURL(data.logo)" width="100" height="100">
          <div v-else class="pic">LOGO</div>
        </el-upload>
      </el-form-item>

      <el-form-item label="门店名称：" prop="name">
        <el-input v-model="data.name" maxlength="12"></el-input>
      </el-form-item>

      <el-form-item label="门店图片：" prop="pic">
        <div class="pic-item">
          <el-upload action='' :auto-upload="false" :show-file-list="false" :on-change="handleShopPic1" class="pic-upload">
            <img v-if="data.pic1" :src="typeof data.pic1 == 'string' ? data.pic1 : URL.createObjectURL(data.pic1)" width="200">
            <div v-else class="pic">门头照</div>
          </el-upload>
        </div>
        <div class="pic-item" style="margin:0 5px;">
          <el-upload action='' :auto-upload="false" :show-file-list="false" :on-change="handleShopPic2" class="pic-upload">
            <img v-if="data.pic2" :src="typeof data.pic2 == 'string' ? data.pic2 : URL.createObjectURL(data.pic2)" width="200">
            <div v-else class="pic">店内环境</div>
          </el-upload>
        </div>
        <div class="pic-item">
          <el-upload action='' :auto-upload="false" :show-file-list="false" :on-change="handleShopPic3" class="pic-upload">
            <img v-if="data.pic3" :src="typeof data.pic3 == 'string' ? data.pic3 : URL.createObjectURL(data.pic3)" width="200">
            <div v-else class="pic">店内环境</div>
          </el-upload>
        </div>
      </el-form-item>

      <el-form-item label="门店介绍：" prop="introduction" class="desc-item">
        <el-input type="textarea" v-model="data.introduction" maxlength="1000"></el-input>
      </el-form-item>

      <el-form-item label="门店特色产品照：">
        <template v-for="item in businessData">
          <feature-item v-if="!item.operaType || item.operaType != 2" :key="item['id']" :data="item" @edit="handleEditSelectItem" @delete="handleDeleteFeature"></feature-item>
        </template>
        <!-- <span v-if="businessData.length < 5" class="add-more-item" @click="showDialog = true"><span class="el-icon-plus"></span>点击添加特色产品</span> -->
        <span v-if="businessData.length < 5 || businessData.filter(item => item.operaType == 2).length" class="add-more-item" @click="showDialog = true;item = null"><span class="el-icon-plus"></span>点击添加特色产品</span>
      </el-form-item>

      <el-form-item label="门店客服二维码：" prop="customerServiceCode">
        <el-upload action='' :auto-upload="false" :show-file-list="false" :on-change="handleShopServiceQRCode" class="pic-upload">
          <img v-if="data.customerServiceCode" :src="typeof data.customerServiceCode == 'string' ? data.customerServiceCode : URL.createObjectURL(data.customerServiceCode)" width="200">
          <div v-else class="pic">门店客服二维码</div>
        </el-upload>
      </el-form-item>

      <el-form-item label="行业：" prop="industryValue">
        <el-cascader :options="industryOptions" v-model="industryValue" :change-on-select="false"></el-cascader>
      </el-form-item>

      <el-form-item label="联系人：" class="contact-item" prop="contacts">
        <el-input v-model="data.contacts" maxlength="12"></el-input>
      </el-form-item>

      <el-form-item label="联系电话：" class="contact-item" prop="tel">
        <el-input v-model="data.tel"></el-input>
      </el-form-item>

      <el-form-item label="门店地址：" prop="address">
        <el-input v-model="data.address" maxlength="40"></el-input>
      </el-form-item>

      <el-form-item label="营业时间：" prop="businessTime">
        <el-time-picker is-range v-model="data.businessTime" arrow-control :showSeconds="false" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" style="width: 610px;" format="HH:mm" value-format="HH:mm"></el-time-picker>
      </el-form-item>

      <el-form-item><el-button type="primary" style="margin-left: 485px;padding:9px 50px;" @click="handleSaveShopInfo()">保存</el-button></el-form-item>
    </el-form>

    <!-- 特色产品新增、编辑 -->
    <el-dialog title="门店特色产品" :visible.sync="showDialog" width="600px" @close="handleCloseDialog" :close-on-click-modal="false" :close-on-press-escape="false">
      <!-- 产品信息 -->
      <feature-form v-if="showDialog" ref="FeatureItem" :item="editItem" @closed="handleAddFeatureData" @edit="handleEditFeatureData"></feature-form>

      <span slot="footer">
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="$refs['FeatureItem'].handleOnSubmitForm()">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getRfShopInfoByCreaterId, getPlatformIndustrys, saveRfShopInfo } from '@/api/shopmanage';
import mixins from './common/mixins';
import FeatureForm from './common';
import FeatureItem from './common/featureItem';
import { Message } from 'element-ui';

export default {
  name: 'Clound_Views',
  mixins: [mixins],
  components: { FeatureForm, FeatureItem },
  data() {
    return {
      URL: URL,
      showDialog: false,
      editItem: null,
      industryOptions: [],
      industryValue: [],
      businessData: [],
      data: {
        name: '',
        tel: '',
        contacts: '',
        introduction: '',
        customerServiceCode: '',
        businessTime: '',
        address: '',
        industryId: '',
        featurePic: [],
        featureId: [],
        featureDetail: [],
      }
    }
  },
  created() {
    this.handleGetShopInfo();
  },
  methods: {
    handleGetShopInfo() {
      getRfShopInfoByCreaterId().then(res => {
        this.businessData = res.businessData;
        if (res.tableData.businessTime.indexOf(",")) {
          res.tableData.businessTime = res.tableData.businessTime.split(',');
        }
        this.data = res.tableData;

        this.handleGetIndustrys();
      })
    },
    handleGetIndustrys(flag) {
      getPlatformIndustrys({ pid: ''}).then( res => {
        let option = [];
        this.industryOptions = this.handleFormatIndustrys(res.tableData, option);
        if (this.data.industryId) {
          // 获取当前选中的行业标签
          for (let i = 0; i < this.industryOptions.length; i++) {
            this.industryValue =[];
            let item = this.industryOptions[i];
            if (item.value == this.data.industryId) {
              this.industryValue.push(item.value);
              break;
            } else {
              if (item.children && item.children.length) {
                this.industryValue.push(item.value);
                for (let j = 0; j < item.children.length; j++) {
                  let c_item = item.children[j];
                  if (this.data.industryId == c_item.value) {
                    this.industryValue.push(c_item.value);
                    break;
                  }
                }
              }
              if (this.industryValue.length == 2) {
                break;
              }
            }
          }
        }
      })
    },
    handleFormatIndustrys(data, option) {
      data.forEach((item, i) => {
        option[i] = new Object();
        option[i]["value"] = item.id;
        option[i]["label"] = item.industryName;
        if (item["childrenIndustrys"].length) {
          option[i]["children"] = [];
          this.handleFormatIndustrys(item["childrenIndustrys"], option[i]["children"])
        }
      });
      return option;
    },
    handleDeleteFeature(data) {
      for (let i = 0; i < this.businessData.length; i++) {
        if (this.businessData[i].id == data.id) {
          this.businessData[i] = Object.assign(this.businessData[i], data);
          break;
        }
      }
      this.$forceUpdate();
    },
    handleEditSelectItem(data) {
      this.editItem = data;
      this.showDialog = true;
    },
    handleAddFeatureData(data) {
      this.showDialog = false;
      this.businessData.push(data);
    },
    handleEditFeatureData(data) {
      this.showDialog = false;
      for (let i = 0; i < this.businessData.length; i++) {
        if (this.businessData[i].id == data.id) {
          this.businessData[i] = Object.assign(this.businessData[i], data);
          break;
        }
      }
    },
    handleCloseDialog() {
      this.$refs['FeatureItem'].$refs['FeatureForm'].clearValidate();
      this.editItem = null;
    },
    handleSaveShopInfo() {
      this.$refs["shopInfoForm"].validate(valid => {
        if (valid) {
          let formData = new FormData();
          if (this.data["id"]) {
            formData.append("id", this.data["id"]);
          }
          if (typeof this.data["logo"] == "object") {
            formData.append("logo", this.data["logo"]);
          }
          if (typeof this.data["pic1"] == "object") {
            formData.append("pic1", this.data["pic1"]);
          }
          if (typeof this.data["pic2"] == "object") {
            formData.append("pic2", this.data["pic2"]);
          }
          if (typeof this.data["pic3"] == "object") {
            formData.append("pic3", this.data["pic3"]);
          }
          if (typeof this.data["customerServiceCode"] == "object") {
            formData.append("customerServiceQRCode", this.data["customerServiceCode"]);
          }
          if (!this.data.featureId) {
            this.data.featureId = [];
          }
          if (!this.data.featurePic) {
            this.data.featurePic = [];
          }
          if (!this.data.featureTitle) {
            this.data.featureTitle = [];
          }
          if (!this.data.featureDetail) {
            this.data.featureDetail = [];
          }
          if (!this.data.operaType) {
            this.data.operaType = [];
          }
          for (let i = 0; i < this.businessData.length; i++) {
            let item = this.businessData[i];
            if (item.id && item.id != -1) {
              formData.append(`featureId[${i}]`, item.id);
            }
            if (typeof item.featurePic == "object") {
              formData.append(`featurePic[${i}]`, item.featurePic);
            } else {
              formData.append(`featurePic[${i}]`, new File([], ""));
            }
            formData.append(`featureTitle[${i}]`, item.featureTitle);
            formData.append(`featureDetail[${i}]`, item.featureDetail);
            formData.append(`operaType[${i}]`, typeof item.operaType != "undefined" ? item.operaType : 1);
          }
          formData.append("address", this.data["address"]);
          formData.append("name", this.data["name"]);
          formData.append("businessTime", this.data["businessTime"].join(","));
          formData.append("contacts", this.data["contacts"]);
          formData.append("tel", this.data["tel"]);
          formData.append("introduction", this.data["introduction"]);
          formData.append("industryId", this.industryValue[this.industryValue.length - 1]);
          saveRfShopInfo(formData).then(res => {
            this.$store.dispatch('UpdateShopInfo', this.data["name"]);
            Message({
              message: "保存成功",
              type: 'success',
              duration: 3 * 1000
            });
            this.handleGetShopInfo();
          })
        }
      })
    }
  },
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.clound-container {
  .el-form-item {
    margin-bottom: 45px;
    .el-input {
      width: 610px;
    }
    div.pic {
      font-size: 16px;
      font-weight: bolder;
      color: #8c939d;
      width: 200px;
      height: 120px;
      line-height: 120px;
      background: #E8E8E8;
      text-align: center;
    }
  }
  /deep/ .logo-item{
    .el-form-item__label {
      line-height: 100px!important;
    }
    .el-upload {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      overflow: hidden;
      div.pic {
        width: 100%;
        height: 100%;
        line-height: 100px;
      }
    }
    
  }
  .pic-item {
    float: left;
  }
  .pic-upload {
    width: 200px;
    // height: 120px;
    float: left;
    overflow: hidden;
  }
  .desc-item .el-textarea {
    width: 610px;
    /deep/ textarea{
      height: 125px;
      resize: none;
    }
  }
  .add-more-item {
    color: #E51C23;
    cursor: pointer;
  }
  /deep/ .el-upload {
    width: 100%;
    // height: 100%;
  }
  /deep/ .el-cascader {
    .el-input {
      width: 610px;
    }
    .el-input__suffix-inner {
      display: none;
    }
  }
}
</style>