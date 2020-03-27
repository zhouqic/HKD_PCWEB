<template>
  <div class="gather-code-container main-content">
    <div ref="codeImage" style="height: 580px;margin-top: 45px;">
      <img v-if="url" :src="url" width="450" height="580">
    </div>
    <div style="margin-top: 80px;margin-bottom: 30px;">
      <el-button type="primary" @click="handlerDownloadIamge()">下载</el-button>
      <el-button type="primary" @click="handlerGetQRCode()">刷新</el-button>
    </div>
  </div>
</template>
<script>
import { getQRCode } from '@/api/shopmanage';
import html2canvas from 'html2canvas';
import { Message } from 'element-ui';

export default {
  name: 'GatherCode_Views',
  data() {
    return {
      url: ''
    }
  },
  created() {
    this.handlerGetQRCode();
  },
  methods: {
    handlerGetQRCode() {
      this.url = '';
      getQRCode({ refresh: true, staffId: this.$store.getters.staffId }).then(res => {
        this.url = 'data:image/jpeg;base64,' + res.tableData;
      })
    },
    handlerDownloadIamge() {
      if (this.url) {
        html2canvas(this.$refs["codeImage"]).then(canvas => {
          if (window.navigator.msSaveOrOpenBlob) {
            // IE
            let urlStr = atob(canvas.toDataURL('image/png').split(',')[1]);
            let n = urlStr.length;
            let u8arr = new Uint8Array(n);
            while (n--) {
              u8arr[n] = urlStr.charCodeAt(n);
            }
            let blob = new Blob([u8arr]);
            window.navigator.msSaveOrOpenBlob(blob, '门店收款二维码.png');
          } else {
            let link = document.createElement('a');
            link.style.display = 'none';
            link.href = canvas.toDataURL('image/png');
            link.setAttribute('download', '门店收款二维码');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        })
      } else {
        Message({
          message: "暂无图片",
          type: 'error',
          duration: 3 * 1000
        });
      }
    }
  },
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.gather-code-container {
  text-align: center;
  .el-button {
    padding-left: 50px;
    padding-right: 50px;
  }
  .el-button:first-of-type {
    margin-right: 220px;
  }
}
</style>