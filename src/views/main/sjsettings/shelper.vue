<template>
  <div class="shelper-container main-content">
    <el-tabs v-model="activeIndex">
      <el-tab-pane label="绑定商户助手" name="0"></el-tab-pane>
      <el-tab-pane label="已绑定" name="1"></el-tab-pane>
    </el-tabs>
    <div v-if="activeIndex == 0">
      <div ref="codeImage" style="height: 580px;margin-top: 45px;">
        <img v-if="url" :src="url" width="450" height="450">
      </div>
      <div style="margin-top: 40px;margin-bottom: 30px;">
        <el-button type="primary" @click="handlerDownloadIamge()" style="width: 450px;">下载商户助手二维码</el-button>
      </div>
    </div>
    <div v-else class="item">
      <div class="row-item">
        <div class="row-item-content">
          <template v-for="item in bindStaffList">
            <div :key="item.id" style="overflow: hidden;margin-bottom: 10px;">
              <div style="float: left;line-height: 32px;">{{ item.nickname }}</div>
              <div style="float: right;">
                <el-button @click="handlerUnBindStaff(item.id)">解除绑定</el-button>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getAlreadBindAssistant, disBindAssistant, getAssistantCode } from '@/api/sjsettings';
import html2canvas from 'html2canvas';
import { Message } from 'element-ui';

export default {
  name: 'shelper_view',
  data() {
    return {
      bindStaffList: [],
      activeIndex: 0,
      url: ''
    }
  },
  created() {
    this.handlerGetAssCode();
  },
  watch: {
    activeIndex(newVal, oldVal) {
      if(newVal == oldVal) {
        return false;
      }
      if (newVal == 0) {
        this.handlerGetAssCode();
      } else {
        this.handlerGetBindStaff();
      }
    }
  },
  methods: {
    handlerGetAssCode() {
      this.url = '';
      getAssistantCode({ refresh: true, staffId: this.$store.getters.staffId }).then(res => {
        this.url = 'data:image/jpeg;base64,' + res.tableData;
      })
    },
    handlerGetBindStaff() {
      getAlreadBindAssistant({ page: 0, staffId: this.$store.getters.staffId }).then(res => {
        this.bindStaffList = res.tableData;
      })
    },
    handlerUnBindStaff(id) {
      disBindAssistant({ wxuserid: id }).then(res => {
        this.handlerGetBindStaff();
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
            window.navigator.msSaveOrOpenBlob(blob, '商户助手二维码.png');
          } else {
            let link = document.createElement('a');
            link.style.display = 'none';
            link.href = canvas.toDataURL('image/png');
            link.setAttribute('download', '商户助手二维码');
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
.shelper-container {
  font-size: 16px;
  color: #101010;
  .item{
    margin-bottom: 30px;
    .row-item {
      overflow: hidden;
      margin-bottom: 15px;
      .row-item-label {
        float: left;
        width: 70px;
        margin-right: 10px;
        line-height: 30px;
      }
      .row-item-content {
        float: left;
        width: 500px;
      }
    }
  }
}
</style>