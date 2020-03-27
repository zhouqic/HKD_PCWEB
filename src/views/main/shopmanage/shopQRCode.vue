<template>
  <div class="vipCard-code-container main-content">
    <div ref="codeImage">
      <div id="codeImage">
        <div class="header clearfix">
          <img v-if="logo" :src="logo ? logo : './img/huikeduo.jpg'">
          <img v-else :src="defaultImg">
          <div class="content">
            <div class="name">{{ name }}</div>
            <div class="txt">本店已升级O+O智慧门店</div>
          </div>
        </div>
        <img class="card" src="./img/card@2x.png">
        <div class="box clearfix">
          <div class="fl" id="redBox">
            <img class="redbox" src="./img/redbox@2x.png">
            <img v-if="url" :src="url" class="qrcode">
          </div>
          <div class="content fl">
            <img class="dialog" src="./img/dialog@2x.png">
            <div>
              <div class="items">
                <img src="./img/tel@2x.png" />
                <span>{{ tel }}</span>
              </div>
              <div class="items">
                <img src="./img/address@2x.png" />
                <span>{{ address }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div style="margin-top: 45px;margin-bottom: 30px;">
      <el-button type="primary" @click="handlerDownloadIamge()">下载</el-button>
      <el-button type="primary" @click="handlerGetQRCode(1)">刷新</el-button>
    </div>
  </div>
</template>
<script>
import { getMallQRcord, findShopInfo } from '@/api/shopmanage';
import html2canvas from 'html2canvas';
import { Message } from 'element-ui';

export default {
  name: 'GatherCode_Views',
  data() {
    return {
      defaultImg: require("@/assets/default_logo.jpg"),
      url: '',
      logo: '',
      name: '',
      tel: '',
      address: ''
    }
  },
  created() {
    this.handlerGetQRCode(0);
  },
  methods: {
    handlerGetQRCode(flag) {
      this.url = '';
      getMallQRcord({ types: 2, isRefresh: flag }).then(res => {
        this.url = res.tableData;
      })
      findShopInfo().then(res => {
        this.logo = res.tableData.logoBase64;
        this.name = res.tableData.name;
        this.tel = res.tableData.tel;
        this.address = res.tableData.address;
      })
    },
    // 下载
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
            window.navigator.msSaveOrOpenBlob(blob, '云店二维码');
          } else {
            let link = document.createElement('a');
            link.style.display = 'none';
            link.href = canvas.toDataURL('image/png');
            link.setAttribute('download', '云店二维码');
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
.vipCard-code-container {
  text-align: center;
  #codeImage {
    width: 343px;
    height: 571.5px;
    background: url(./img/bg@2x.png);
    background-size: 100% 100%;
    background-position: 0 0;
    background-repeat:  no-repeat;
    margin: 0 auto;
    margin-top: 30px;
    overflow: hidden;
    #redBox {
      position: relative;
      .qrcode {
        position: absolute;
        width: 55px;
        height: 55px;
        top: 50px;
        left: 72px;
      }
    }
    .header {
      margin-top: 35px;
      margin-left: 32px;
      margin-bottom: 33.5px;
    }
    .header img {
      float: left;
      width: 37.5px;
      height: 37.5px;
      border-radius: 50%;
      margin-right: 10px;
    }
    .header .content {
      float: left;
      color:rgba(238,170,121,1);
      text-align: left;
      font-weight:bold;
      .name {
        font-size:16.5px;
        line-height:16.5px;
        margin-bottom: 10px;
      }
      .txt {
        font-size:12px;
        line-height:12px;
      }
    }
    .card {
      width: 305px;
      height: 241px;
      margin-bottom: 32.5px;
    }
    .box .redbox {
      width: 158px;
      height: 169px;
      float: left;
      margin-left: 20px;
      margin-right: 10px;
    }
    .box .dialog {
      width: 125.5px;
      height: 60px;
      margin-top: 14px;
      margin-bottom: 22px;
    }
    .box .items {
      text-align: left;
    }
    .box .items:nth-child(1) {
      margin-bottom: 6px;
      img{
        width: 15px;
        height: 12px;
        vertical-align: middle;
      }
      span {
        font-size:10px;
        font-weight:bolder;
        color:rgba(238,170,121,1);
        line-height:10px;
      }
    }
    .box .items:nth-child(2) {
      img{
        width: 10.5px;
        height: 13px;
        vertical-align: top;
        margin-right: 5px;
        margin-left: 2px;
      }
      span {
        max-width:120px;
        font-size:12px;
        font-weight:bolder;
        color:rgba(238,170,121,1);
        line-height:16.5px;
        word-break: break-all;
        display: inline-block;
      }
    }
  }
  .el-button {
    padding-left: 50px;
    padding-right: 50px;
  }
  .el-button:first-of-type {
    margin-right: 220px;
  }
}
</style>