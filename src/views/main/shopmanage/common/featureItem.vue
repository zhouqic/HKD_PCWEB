<template>
  <div class="item-container">
    <div class="item-title">
      <div class="item-title-text">
        <el-input :value="data['featureTitle']" disabled="disabled"><template slot="prepend">产品名称：</template></el-input>
      </div>
      <div class="item-title-btn">
        <el-button @click="handleOpenEditDialog(data)">编辑</el-button>
        <el-button @click="handleRemoveFeature(data)">删除</el-button>
      </div>
    </div>
    <div class="item-pic">
      <img :src="typeof data.featurePic == 'string' ? data.featurePic : URL.createObjectURL(data.featurePic)" width="300">
    </div>
    <div class="item-desc">
      <div>产品描述：</div>
      <div>
        <el-input type="textarea" :value="data['featureDetail']" disabled="disabled"></el-input>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "FeatureItem",
  props: ["data"],
  data() {
    return {
      URL: URL
    }
  },
  methods: {
    handleOpenEditDialog(data) {
      this.$emit("edit", data);
    },
    handleRemoveFeature(data) {
      data.operaType = 2;
      this.$emit("delete", data);
    },
  },
}
</script>
<style lang="scss" scoped>
.item-container {
  margin-bottom: 25px;
  /deep/ .el-input.is-disabled .el-input__inner, /deep/ .el-textarea.is-disabled .el-textarea__inner {
    color: #606266;
    background-color: #fff;
    resize: none;
  }
  .item-title {
    overflow: hidden;
    margin-bottom: 10px;
    div.item-title-text {
      float: left;
      .el-input {
        width: 430px;
      }
    }
    div.item-title-btn {
      float: left;
      margin-left: 20px;
    }
  }
  .item-pic {
    width: 430px;
    overflow: hidden;
    img {
      float: left;
    }
  }
  .item-desc {
    width: 430px;
    div:first-of-type {
      text-align: left;
      line-height:35px;
    }
    /deep/ .el-textarea textarea{
      min-height: 60px !important;
      resize: none;
    }
  }
}
</style>
