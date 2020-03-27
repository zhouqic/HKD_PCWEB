<template>
  <div class="noticeset-container main-content">
    <div v-if="!showDetail">
      <el-row style="text-align: right;margin-bottom: 20px;">
        <el-button type="primary" @click.native.prevent="showDialog = true">添加云喇叭</el-button>
      </el-row>
      <!-- 云喇叭表格 -->
      <el-table :data="speakersData" style="margin-bottom: 15px;">

        <el-table-column label="云喇叭ID" prop="deviceId"></el-table-column>

        <el-table-column label="状态">
          <template slot-scope="scope">
            <div>绑定成功</div>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="danger" @click="handlerunBindRfSpeaker(scope.row.id)">解除绑定</el-button>
            <el-button type="primary" @click="handlerShowDetail(scope.row)">查看详情</el-button>
          </template>
        </el-table-column>

      </el-table>
      <!-- 添加云喇叭 -->
      <el-dialog title="添加云喇叭" :visible.sync="showDialog" width="600px" @closed="handlerCloseDialog" :close-on-click-modal="false" :close-on-press-escape="false">
        <div class="item">
          <div class="row-item">
            <div class="row-item-label"><b>云喇叭设备编号：</b></div>
            <div class="row-item-content">
              <el-input placeholder="请输入云喇叭设备编号" v-model="deviceId"></el-input>
            </div>
          </div>
          <div class="row-item" style="text-align: center;">
            <el-button type="primary" style="margin-right: 45px;" @click="handlerCloseDialog">取消</el-button>
            <el-button type="primary" @click="handlerSaveRfCloudSpeaker">绑定</el-button>
          </div>
          <div class="row-item">
            <div class="row-item-label" style="width: 100%;">
              步骤详情：
              <br>
              1. 将云喇叭接入电源，打开微信，扫描设备上方二维码进行连接；<br>
              2. 收到“连接成功”语音后，云喇叭处于在线状态，连接成功；<br>
              3. 关闭微信页面，在此页面输入设备号，确认绑定；<br>
              4. 绑定成功后，可在步骤二选择需要关联的员工。<br>
              <span style="color: #EE454C;">
                提醒：<br>
                云喇叭第一次连接成功断开电源后，再次接通电源，云喇叭保持连接状态；<br>
                一个账号可绑定多个云喇叭。
              </span>
            </div>
          </div>
        </div>
      </el-dialog>
    </div>
    <!-- 详情 -->
    <div v-else class="speaker-detail">
      <div style="margin-bottom: 20px;"><span class="el-icon-arrow-left" style="cursor: pointer;" @click="showDetail = false">返回</span></div>
      <div class="item">
        <div class="row-item">
          <div class="row-item-label">云喇叭ID</div>
          <div class="row-item-content">{{ detailDeviceID }}</div>
        </div>
        <div class="row-item">
          <div class="row-item-label">云喇叭状态</div>
          <div class="row-item-content">已绑定</div>
        </div>
        <div class="row-item">
          <div class="row-item-label">关联云喇叭员工</div>
          <div class="row-item-content" style="padding-left: 150px;">
            <el-dropdown trigger="click" @command="handleBindStaff" @visible-change="handlerGetUnBindStaffs" placement="bottom-start">
              <el-button type="primary">
                选择员工<i :class="iClass"></i>
              </el-button>
              <el-dropdown-menu class="staff-list" slot="dropdown">
                <el-dropdown-item v-for="item in unBindStaffList" :key="item.id" :command="item.id">
                  <span>{{ item.name }}({{ item.jobNumber }})</span>
                  <span style="float: right;margin-left: 50px;" v-if="item.jobNumber == 100000">老板</span>
                  <span style="float: right;margin-left: 50px;" v-else-if="item.jobNumber != 100000 && item.staffRole != 0">店长</span>
                  <span style="float: right;margin-left: 50px;" v-else-if="item.jobNumber != 100000 && item.staffRole != 1">店员</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <div class="row-item" v-for="item in RelationStaffList" :key="item.id">
          <div class="row-item-label" style="font-size: 12px;">{{ item.name }}</div>
          <div class="row-item-content">
            <el-button @click="handlerUnBindRfStaff(item.id)" :disabled="isSubmit ? true : false">取消绑定</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getAllRfCloudSpeakers, saveRfCloudSpeaker, unBindRfCloudSpeaker, getStaffsBySpeakerId, bindingRfStaffs, getNotBindStaffs, unBindingRfStaff } from "@/api/sjsettings";
export default {
  name: "notice_view",
  data() {
    return {
      deviceId: '',
      speakersData: [],
      isSubmit: false,
      showDialog: false,
      showDetail: false,
      detailID: '',
      detailDeviceID: '',
      iClass: 'el-icon-arrow-down',
      RelationStaffList: [],
      unBindStaffList: []
    }
  },
  created() {
    this.handlerGetAllSpeakers();
  },
  methods: {
    // 获取所有绑定的云喇叭
    handlerGetAllSpeakers() {
      getAllRfCloudSpeakers().then(res => {
        this.speakersData = res.tableData;
      })
    },
    // 添加云喇叭
    handlerSaveRfCloudSpeaker() {
      if (!this.deviceId) {
        this.$message({ type: 'error', message: '请输入云喇叭设备编号' });
        return false;
      }
      this.isSubmit = true;
      saveRfCloudSpeaker({ deviceId: this.deviceId}).then(() => {
        this.isSubmit = false;
        this.handlerGetAllSpeakers();
        this.handlerCloseDialog();
      }).catch(() => { this.isSubmit = false; })
    },
    // 解除云喇叭绑定
    handlerunBindRfSpeaker(id) {
      this.$confirm('您确认要解除绑定该云喇叭吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showCancelButton: true,
        type: 'warning'
      }).then(() => {
        unBindRfCloudSpeaker({ id: id }).then(res => {
          this.$message({ type: 'success', message: '解除成功' })
          this.handlerGetAllSpeakers();
        })
      }).catch(() => {});
    },
    // 云喇叭详情
    handlerShowDetail(row) {
      this.detailID = row.id;
      this.detailDeviceID = row.deviceId;
      this.showDetail = true;
      this.handlerGetStaffsBySpeakerId();
    },
    // 获取云喇叭绑定员工
    handlerGetStaffsBySpeakerId() {
      getStaffsBySpeakerId({ cloudSpeakerId: this.detailID }).then(res => {
        this.RelationStaffList = res.tableData;
      })
    },
    // 云喇叭取消绑定员工
    handlerUnBindRfStaff(id) {
      unBindingRfStaff({ staffId: id }).then(res => {
        this.handlerGetStaffsBySpeakerId();
      })
    },
    // 获取所有未绑定员工
    handlerGetUnBindStaffs(flag) {
      if (flag) {
        this.iClass = 'el-icon-arrow-up';
        getNotBindStaffs().then(res => {
          this.unBindStaffList = res.tableData;
        })
      } else {
        this.iClass = 'el-icon-arrow-down';
      }
    },
    // 绑定员工
    handleBindStaff(id) {
      bindingRfStaffs({ cloudSpeakerId: this.detailID, staffIds: id }).then(res => {
        this.handlerGetStaffsBySpeakerId();
      })
    },
    handlerCloseDialog() {
      this.showDialog = false;
      this.deviceId = '';
    }
  },
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.noticeset-container {
  padding: 40px !important;
  font-size: 16px;
  font-family: SourceHanSansSC-bold;
  color: #101010;
  .item{
    margin-bottom: 30px;
    .row-title {
      font-size: 20px;
      margin-bottom: 20px;
    }
    .row-item {
      overflow: hidden;
      margin-bottom: 30px;
      padding-left: 40px;
      padding-right: 40px;
      .row-item-label {
        float: left;
        width: 115px;
        line-height: 32px;
      }
      .row-item-content {
        float: left;
        width: calc(100% - 115px);
        /deep/ .el-input{
          width: 100%;
          margin-right: 25px;
        }
      }
    }
  }
  .speaker-detail {
    .row-item {
      height: 35px;
      margin-bottom: 15px;
    }
    .row-item-content{
      line-height: 32px;
      .el-dropdown {
        cursor: pointer;
        .el-button {
          width: 100px;
        }
        i {
          margin-left: 5px;
        }
      }
    }
  }
}
</style>
<style rel="stylesheet/scss" lang="scss">
.staff-list {
  min-width: 100px;
}
</style>