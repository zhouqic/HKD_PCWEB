<template>
  <el-form :model="formData" class="carousel-form" label-width="145px">
    <el-form-item label="轮播图片：">
      <el-upload action :show-file-list="false" :on-change="handleFileChange" :auto-upload="false">
        <img v-if="formData.filePhoto" :src="typeof formData.filePhoto == 'string' ? formData.filePhoto : URL.createObjectURL(formData.filePhoto)" width="220" />
        <i v-else class="el-icon-plus"></i>
      </el-upload>
    </el-form-item>
    <el-form-item label="轮播图跳转位置：">
      <el-radio-group v-model="formData.jumplocate">
        <el-radio :label="3">商品列表</el-radio>
        <el-radio :label="7">商品详情</el-radio>
        <el-radio :label="0">不跳转</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="轮播图跳转商品：" v-if="formData.jumplocate == 7">
      <el-select v-model="formData.bindFirstId" placeholder="请选择商品">
        <template v-for="item in productList">
          <el-option :key="item.id" :label="item.title" :value="item.id"></el-option>
        </template>
      </el-select>
    </el-form-item>
  </el-form>
</template>
<script>
import { saveSlideShow, getBannerToProduct, getSlideShow } from "@/api/marketSettings";

export default {
  props: ["id"],
  data() {
    return {
      URL: URL,
      productList: [],
      formData: {
        bindFirstId: '',
        filePhoto: '',
        jumplocate: 3
      },
    }
  },
  created() {
    this.handleGetProductList();
  },
  methods: {
    handleGetProductList() {
      getBannerToProduct({}).then(res => {
        this.productList = res.tableData;
        if (this.id) {
          getSlideShow({ id: this.id }).then(res => {
            this.formData.filePhoto = res.tableData.picture;
            this.formData.jumplocate = res.tableData.jumplocate;
            if (res.tableData.jumplocate == 7) {
              //处理商品删除
              this.formData.bindFirstId = this.productList.filter(item => item.id == this.formData.bindFirstId).length == 0 ? "" :res.tableData.bindFirstId;
            }
          })
        }
      });
    },
    handleFileChange(file) {
      if (this.$checkFile(file.raw)) {
        this.$bus.emit('send-file', { file: file.raw,  ratio: 750/310 });
        this.$bus.once('set-file', val => {
          this.formData.filePhoto = val;
          this.$forceUpdate();
        });
      }
    },
    handleSubmitForm() {
      if (!this.formData.filePhoto) {
        this.$message({
          message: "请选择轮播图片",
          type: "error"
        });
        return;
      }
      let formData = new FormData();
      Object.keys(this.formData).forEach(item => {
        if (this.formData[item] !== "") {
          formData.append(item, this.formData[item]);
        }
      })
      if (this.formData.jumplocate != 7) {
        formData.delete("bindFirstId");
      }
      if (this.id) {
        formData.append("id", this.id);
        if (typeof this.formData.filePhoto == 'string') {
          formData.delete("filePhoto");
        }
      }
      this.$parent.$parent.isSubmit = true;
      saveSlideShow(formData).then(res => {
        this.$parent.$parent.isSubmit = false;
        this.$parent.$parent.showDialog = false;
        this.$message({
          type: "success",
          message: "保存成功"
        });
        this.$parent.$parent.handleGetTableData();
      }).catch(() => { this.$parent.$parent.isSubmit = false });
    }
  },
}
</script>
<style lang="scss" scoped>
.carousel-form {
  .el-upload i {
    width: 220px;
    height: 130px;
    font-size: 28px;
    color: #8c939d;
    line-height: 130px;
    background: #E8E8E8;
    text-align: center;
  }
}
</style>