<template>
  <div class="goods-container main-content">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="爆品活动" name="1"></el-tab-pane>
      <el-tab-pane label="9.9专区活动" name="2"></el-tab-pane>
    </el-tabs>
    <!-- 爆品 -->
    <hot-tab v-if="activeTab == 1" ref="hotTab"></hot-tab>
    <!-- 9.9专区 -->
    <special-tab v-else ref="specialTab"></special-tab>
    <!-- 新增编辑弹窗 -->
    <el-dialog title="创建活动" :visible.sync="showDialog" width="900px" @closed="handleCloseDialog()" :close-on-click-modal="false" :close-on-press-escape="false">
      <!-- 步骤条 -->
      <el-steps v-if="!isEdit" :active="activeStep" finish-status="success" :process-status="processStatus">
        <el-step title="店铺信息"></el-step>
        <el-step title="商品信息"></el-step>
      </el-steps>
      <!-- 店铺信息验证 -->
      <shop-info v-if="activeStep == 0 && !isEdit"></shop-info>
      <!-- 商品信息 -->
      <good-info v-else-if="activeStep == 1" ref="goodInfo"></good-info>
      <!-- 下一步 -->
      <span slot="footer">
        <el-button v-if="processStatus != 'success' && activeStep == 0" type="primary" @click="$router.push({ name: 'yunFitment'})">前往云店装修</el-button>
        <el-button v-if="processStatus == 'success' && activeStep == 0" type="primary" @click="handleNextStep()">下一步</el-button>
        <el-button v-if="activeStep == 1" type="primary" @click="handleSubmitGoodForm" :disabled="isSubmit ? true : false">{{ this.editPutaway == -1 ? '确定' : '确认上架' }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { ShopInfo, GoodInfo, HotTab, SpecialTab } from "./common";
import { saveRfSingleProduct } from '@/api/bpyinliu';

export default {
  name: 'mybp_view',
  components: { ShopInfo, GoodInfo, SpecialTab, HotTab },
  data() {
    return {
      activeTab: '1',
      activeStep: 0,
      isEdit: false,
      isSubmit: false,
      showDialog: false,
      id: '',
      editPutaway: '',
      processStatus: 'success',// wait / process / finish / error / success
    }
  },
  methods: {
    handleGetTableData() {
      if (this.activeTab == 1) {
        this.$refs["hotTab"].handleGetHotGoods();
      } else {
        this.$refs["specialTab"].handleGetDisGoods();
      }
    },
    handleNextStep() {
      this.activeStep = 1;
      this.processStatus = 'text';
    },
    handleOpenEditDialog(row) {
      this.isEdit = true;
      this.activeStep = 1;
      this.showDialog = true;
      this.id = row.id;
      this.editPutaway = row.putaway;
    },
    handleCloseDialog() {
      this.isEdit = false;
      this.activeStep = 0;
      this.id = '';
    },
    handleSubmitGoodForm() {
      if (this.editPutaway == -1) {
        this.showDialog = false;
        return false;
      }
      this.$refs["goodInfo"].$refs['goodInfoForm'].validate(valid => {
        if (valid) {
          this.processStatus = "process";
          let formData = new FormData();
          Object.keys(this.$refs["goodInfo"].data).forEach(item => {
            if (this.$refs["goodInfo"].data[item] !== "") {
              formData.append(item, this.$refs["goodInfo"].data[item]);
            }
          })
          // 爆品下架状态编辑后为上架状态
          if (this.activeTab == 1) {
            formData.set("putaway", -1);
          } else {
            // 9.9上架状态编辑完成后提交审核
            if (this.$refs["goodInfo"].data.putaway = 1) {
              formData.set("putaway", -1);
            }
            // 9.9下架状态编辑完成后变更状态为已上架
            if (this.$refs["goodInfo"].data.putaway = 0) {
              formData.set("putaway", 1);
            }
          }
          // 首图
          if (this.id && this.$refs["goodInfo"].data.displayPic && typeof this.$refs["goodInfo"].data.displayPic == "string") {
            formData.set("displayPicUrl", formData.get("displayPic"));
            formData.delete("displayPic");
          }
          if (this.id && this.$refs["goodInfo"].data.displayPic2 && typeof this.$refs["goodInfo"].data.displayPic2 == "string") {
            formData.set("displayPicUrl2", formData.get("displayPic2"));
            formData.delete("displayPic2");
          }
          if (this.id && this.$refs["goodInfo"].data.displayPic3 && typeof this.$refs["goodInfo"].data.displayPic3 == "string") {
            formData.set("displayPicUrl3", formData.get("displayPic3"));
            formData.delete("displayPic3");
          }
          // 详情图
          if (this.id && this.$refs["goodInfo"].data.detailPic && typeof this.$refs["goodInfo"].data.detailPic == "string") {
            formData.set("detailPicUrl", formData.get("detailPic"));
            formData.delete("detailPic");
          }
          if (this.id && this.$refs["goodInfo"].data.detailPic2 && typeof this.$refs["goodInfo"].data.detailPic2 == "string") {
            formData.set("detailPicUrl2", formData.get("detailPic2"));
            formData.delete("detailPic2");
          }
          if (this.id && this.$refs["goodInfo"].data.detailPic3 && typeof this.$refs["goodInfo"].data.detailPic3 == "string") {
            formData.set("detailPicUrl3", formData.get("detailPic3"));
            formData.delete("detailPic3");
          }
          if (this.id && this.$refs["goodInfo"].data.detailPic4 && typeof this.$refs["goodInfo"].data.detailPic4 == "string") {
            formData.set("detailPicUrl4", formData.get("detailPic4"));
            formData.delete("detailPic4");
          }
          if (this.id && this.$refs["goodInfo"].data.detailPic5 && typeof this.$refs["goodInfo"].data.detailPic5 == "string") {
            formData.set("detailPicUrl5", formData.get("detailPic5"));
            formData.delete("detailPic5");
          }
          if (this.id && this.$refs["goodInfo"].data.detailPic6 && typeof this.$refs["goodInfo"].data.detailPic6 == "string") {
            formData.set("detailPicUrl6", formData.get("detailPic6"));
            formData.delete("detailPic6");
          }
          this.isSubmit = true;
          saveRfSingleProduct(formData).then(res => {
            this.processStatus = "success";
            this.handleGetTableData();
            this.showDialog = false;
            this.isSubmit = false;
          }).catch(err => {
            this.isSubmit = false;
          })
        } else {
          this.processStatus = "error";
        }
      });
    }
  },
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
/deep/ .el-dialog__body {
  padding: 20px 30px;
  max-height: 500px;
  overflow: hidden;
}
/deep/ .el-step__title.is-process {
  color: #e6a23c;
}
/deep/ .el-step__head.is-process {
  color: #e6a23c;
  border-color: #e6a23c;
}
/deep/ .el-step__description.is-process {
  color: #e6a23c;
}
</style>