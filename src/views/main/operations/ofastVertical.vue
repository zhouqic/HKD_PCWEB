<template>
  <div class="fastVetical-container main-content">
    <div>扫描二维码：请在电脑插上扫码设备后，扫描顾客二维码进行核销。<span style="color:red;">需要把光标移到输入框再进行扫描。</span></div>
    <div>输入核销码：直接输入核销码进行核销。</div>
    <div>
      <el-input ref="codeInput" v-model="code" maxlength="18" placeholder="扫描二维码或输入核销码" @input="handleOnInputChange"></el-input>
      <el-button type="primary" @click="handleVerticalCode">核销</el-button>
    </div>
  </div>
</template>

<script>
import { exchangeCardByCode, getVerifyProductMsgNew } from "@/api/operation";

export default {
  name: "fastVertical_views",
  data() {
    return {
      code: "",
      staffId: this.$store.getters.staffId,
      options: {
        1: '兑换券',
        2: '砍价活动',
        3: '单品',
        4: '9.9',
        5: '积分商品',
        8: '次卡',
        9: '锦鲤',
        10: '商户商盟商品',
        11: '商盟保底商品',
        12: '好想你爆品'
      },
      firstTime: null,
      verifyWay: 1 //1扫码；2输码
    };
  },
  mounted() {
    this.$refs["codeInput"].focus();
  },
  methods: {
    handleOnInputChange(val) {
      this.code = this.code.replace(/[^\a-\z\A-\Z0-9]/g, '');
      if (this.firstTime === null) {
        this.firstTime = new Date();
      } else {
        this.verifyWay = new Date() - this.firstTime > 150 ? 2 : 1;
      }
    },
    handleVerticalCode() {
      if (this.code === "") {
        this.$message.error("请输入核销码");
        return false;
      }
      getVerifyProductMsgNew({
        code: this.code
      }).then(res => {
        this.$alert(`<div class="form-item">${this.options[res.tableData.type]}</div><div class="form-item">${res.tableData.name}</div><div class="form-item">${this.code}</div>`, '', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确认核销',
          cancelButtonText: '取消',
          center: true
        }).then(() => {
          this.handleSubmitForm();
        }).catch(() => {
          this.code = '';
          this.verifyWay = 1;
          this.firstTime = null;
        });
      });
    },
    handleSubmitForm() {
      exchangeCardByCode({
        code: this.code,
        staffId: this.staffId,
        verifyWay: this.verifyWay
      }).then(res => {
        this.$message.success("核销成功");
        this.code = '';
        this.verifyWay = 1;
        this.firstTime = null;
      }).catch(() => {});
    }
  }
};
</script>
<style lang="scss">
.fastVetical-container > div:nth-child(2) {
  margin-top: 25px;
  margin-bottom: 50px;
}
.fastVetical-container {
  .el-input {
    width: 500px;
    margin-right: 25px;
  }
}
.form-item {
  margin: 10px;
}
</style>