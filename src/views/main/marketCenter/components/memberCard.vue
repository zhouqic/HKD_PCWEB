<template>
  <div class="main-content">
    <!-- 列表 -->
    <el-form ref="cardForm" :model="formData" :label-position="'left'" label-width="130px">
      <el-form-item label="会员卡名称:" prop="title" :rules="[{ required: true, message: '请输入会员卡名称', trigger: 'blur' }]">
        <el-input v-model.trim="formData.title" maxlength="9"></el-input>
      </el-form-item>
      <el-form-item label="商户Logo:" prop="logoUrl" :rules="[{ required: true, message: '请上传商户logo', trigger: 'blur' }]">
        <el-upload action :auto-upload="false" :show-file-list="false" :on-change="handleOnLogoChange">
          <img v-if="formData.logoUrl" :src="typeof formData.logoUrl == 'string' ? formData.lgUrl : URL.createObjectURL(formData.logoUrl)" width="100" height="100" style="border-radius:50%;">
          <i v-else class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="会员卡背景:" prop="bgUrl" :rules="[{ required: true, message: '请上传背景图', trigger: 'blur' }]">
        <el-upload action :auto-upload="false" :show-file-list="false" :on-change="handleOnBgUrlChange">
          <img v-if="formData.bgUrl" :src="formData.bgUrl" width="250" height="150" style="border-radius:10px;">
          <i v-else class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="商户电话:" prop="servicePhone" :rules="[
        { validator: handleValidTel, trigger: 'blur' },
        { validator: handleValidTel, trigger: 'change' }
      ]">
        <el-input v-model="formData.servicePhone" maxlength="12"></el-input>
      </el-form-item>
      <el-form-item label="使用提醒:" prop="notice" :rules="[{ required: true, message: '请输入使用提醒', trigger: 'blur' }]">
        <el-input v-model="formData.notice" maxlength="16" placeholder="字数上限为16字"></el-input>
      </el-form-item>
      <el-form-item label="使用说明:" prop="description" :rules="[{ required: true, message: '请输入使用说明', trigger: 'blur' }]">
        <el-input v-model="formData.description" :disabled="!formData.id ? false : true" type="textarea" maxlength="1024" placeholder="限制1024汉字"></el-input>
        <div style="color:#F56C6C;">特别提醒：使用说明只可编辑一次，保存后不可修改。</div>
      </el-form-item>
      <el-form-item label="特权说明:" prop="prerogative" :rules="[{ required: true, message: '请输入特权说明', trigger: 'blur' }]">
        <el-input v-model="formData.prerogative" type="textarea" maxlength="1024" placeholder="限制1024汉字  示例：本店消费享会员价，每次消费累计会员积分，可兑换好礼。"></el-input>
      </el-form-item>
      <el-form-item label="支付前投放会员卡:">
        <el-switch v-model="activateCard" :active-value="1" :inactive-value="0" @change="handleSetActivateCard"></el-switch>
      </el-form-item>
      <el-form-item style="text-align:center;">
        <el-button type="primary" :disabled="isSubmit ? true : false" @click="handleSubmitForm" style="">保存设置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getVipCardByCreaterId, updateVipCard, saveVipCard, savePayOpenCard, getPayOpenCard } from '@/api/marketCenter';
import { saveImages } from "@/api/marketCommodity";
import { isValidNumber, isValidPhone } from "@/utils/validate";

  export default {
    data() {
      return {
        URL: URL,
        activateCard: 0,
        activateId: "",
        formData: {
          title: '',
          logoUrl: '',
          bgUrl: '',
          servicePhone: '',
          notice: '',
          description: '',
          prerogative: '',
          memberDayType: 0,
          memberDays: 0
        },
        isSubmit: false
      }
    },
    created() {
      getVipCardByCreaterId().then(res => {
        if (res.tableData) {
          this.formData = res.tableData;
        }
      })
      getPayOpenCard().then(res => {
        this.activateCard = res.tableData.activateCard ? res.tableData.activateCard : 0;
        this.activateId = res.tableData.id;
      })
    },
    methods: {
      handleValidTel(rule, value, callback) {
        if (value == "") {
          callback(new Error("请输入手机号"));
          return false;
        }
        if (isValidPhone(value)) {
          callback();
        } else {
          callback(new Error("请输入正确的手机号"))
        }
      },
      handleOnLogoChange(file) {
        if (this.$checkFile(file.raw)) {
          this.$bus.emit('send-file', { file: file.raw,  ratio: 1 });
          this.$bus.once('set-file', val => {
            debugger
            this.formData.logoUrl = val;
            this.$forceUpdate();
          });
        }
      },
      handleOnBgUrlChange(file) {
        if (this.$checkFile(file.raw)) {
          this.$bus.emit('send-file', { file: file.raw,  ratio: 1 });
          this.$bus.once('set-file', val => {
            let data = new FormData();
            data.append("filePicture", val);
            saveImages(data).then(res => {
              this.formData.bgUrl = res.tableData;
            })
            this.$forceUpdate();
          });
        }
      },
      handleSetActivateCard(val) {
        savePayOpenCard({ "activateCard": val, "id": this.activateId }).then(res => {
          this.$message.success("保存设置");
        })
      },
      handleSubmitForm() {
        this.$refs["cardForm"].validate(valid => {
          if (valid) {
            this.isSubmit = true;
            let data = new FormData();
            // 使用说明
            data.append("description", this.formData.description);
            // 使用提醒
            data.append("notice", this.formData.notice);
            // 特权说明
            data.append("prerogative", this.formData.prerogative);
            // 客服电话
            data.append("servicePhone", this.formData.servicePhone);
            // 名称
            data.append("title", this.formData.title);
            // 背景图片路径
            data.append("bgUrlLink", this.formData.bgUrl);
            // 商户logo
            if (typeof this.formData.logoUrl == "object") {
              data.append("logoUrl", this.formData.logoUrl);
            }
            if (this.formData.id) {
              data.append("id", this.formData.id);
              updateVipCard(data).then(res => {
                this.isSubmit = false;
                this.$message.success("保存成功");
              }).catch(() => { 
                this.isSubmit = false;
              });
            } else {
              saveVipCard(data).then(res => {
                this.isSubmit = false;
                this.$message.success("保存成功");
              }).catch(() => { 
                this.isSubmit = false;
              });
            }
          }
        })
      }
    }
  }
</script>
<style scoped lang="scss">
.el-form .el-input {
  width: 500px;
}
/deep/ .el-upload {
  overflow: hidden;
  i {
    width: 200px;
    height: 100px;
    background: #E8E8E8;
    line-height: 100px;
  }
}
</style>
