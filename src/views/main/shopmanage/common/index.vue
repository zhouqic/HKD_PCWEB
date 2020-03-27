<template>
  <el-form :model="data" :rules="rules" ref="FeatureForm" status-icon>
    <el-form-item label="产品名称：" prop="featureTitle">
      <el-input v-model="data.featureTitle" placeholder="请输入特色产品名称" maxlength="10"></el-input>
    </el-form-item>

    <el-form-item label="产品图片：" prop="featurePic" style="margin-bottom: 25px;">
      <el-upload action='' :auto-upload="false" :show-file-list="false" :on-change="handleOnPicChange" class="upload">
        <img v-if="data['featurePic']" :src="typeof data['featurePic'] == 'string' ? data['featurePic'] : URL.createObjectURL(data['featurePic'])" width="300">
        <div v-else class="pic">请选择产品图片</div>
      </el-upload>
    </el-form-item>

    <el-form-item label="产品描述：" prop="featureDetail">
      <el-input type="textarea" v-model="data['featureDetail']" placeholder="请填写产品描述，不能超过40个字" maxlength="40"></el-input>
    </el-form-item>
  </el-form>
</template>
<script>
import rules from './featureFormRules'

export default {
  name: "FeatureForm",
  props: ["item"],
  mixins: [rules],
  data() {
    return {
      URL: URL,
      data: {
        id: -1
      }
    }
  },
  created() {
    if (this.item) {
      this.data = {...this.item};
    }
  },
  methods: {
    handleOnPicChange(file) {
      if (this.$checkFile(file.raw)) {
        this.$bus.emit('send-file', { file: file.raw,  ratio: 1/1 });
        this.$bus.once('set-file', val => {
          this.data.featurePic = val;
          this.$forceUpdate();
        });
      }
    },
    handleOnSubmitForm() {
      this.$refs["FeatureForm"].validate(valid => {
        if (valid) {
          this.data.operaType = this.data.id == -1 ? 0 : 1;
          if (!this.item) {
            this.$emit("closed", this.data);
          } else {
            this.$emit("edit", this.data);
          }
        }
      });
    }
  },
}
</script>
<style lang="scss" scoped>
.el-form {
  /deep/ .el-form-item__label {
    width: 100px!important;
    text-align: right;
    padding-right: 5px;
  }
  /deep/ .el-form-item__content {
    margin-left: 100px!important;
  }
  .upload {
    width: 430px;
    font-size: 16px;
    font-weight: bolder;
    padding-top: 10px;
    div.pic {
      height: 100%;
      color: #8c939d;
      line-height: 210px;
      background: #E8E8E8;
      text-align: center;
    }
  }
  .el-input, .el-textarea {
    width: calc(100% - 30px);
  }
  /deep/ .el-textarea textarea{
    min-height: 60px !important;
    resize: none;
  }
}
</style>