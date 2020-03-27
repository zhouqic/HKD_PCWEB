<template>
  <div class="main-content">
    <!-- 统计 -->
    <el-row class="tabs-bar">
      <el-radio-group v-model="memberType" @change="handleOnMemberTypeChange">
        <el-radio :label="1">会员（{{ hyCount }}）</el-radio>
        <el-radio :label="2">店员（{{ ygCount }}）</el-radio>
        <el-radio :label="3">熟客（{{ skCount }}）</el-radio>
        <el-radio :label="4">疑似店员（{{ ysdyCount }}）</el-radio>
      </el-radio-group>
    </el-row>
    <div v-show="!showDetail">
      <!-- 搜索 -->
      <el-row class="base-search">
        <span>人员查询：</span>
        <el-input v-model.trim="account" placeholder="请输入姓名/手机号" maxlength="11"></el-input>
        <el-button type="primary" @click="page=1;handleGetTableData()">查询</el-button>
      </el-row>
      <!-- 列表 -->
      <el-main>
        <panel-card v-for="item in tableData" :key="item.id" :data="item" :show-label="false" :show-name="true" @click.native="handleSelectPanelCard(item)"></panel-card>
      </el-main>
      <!-- 分页 -->
      <el-pagination @current-change="handleOnPageChange" :current-page="page" layout="total, prev, pager, next, jumper" :total="total" :page-size="20"></el-pagination>
    </div>
    <!-- 详情 -->
    <div v-if="showDetail">
      <el-row style="margin-bottom:15px;">
        <el-button type="primary" plain icon="el-icon-arrow-left" @click="handleGetListPage">返回</el-button>
      </el-row>
      <!-- 会员 -->
      <div v-if="memberType == 1">
        <div class="clearfix">
          <!-- 个人档案 -->
          <panel-group title="个人档案" style="width:45%;float:left;">
            <template slot="content">
              <div style="text-indent:18px;line-height:48px;font-size:14px;">姓名：{{customName}}</div>
              <div style="text-indent:18px;line-height:48px;font-size:14px;">电话：{{customTel}}</div>
            </template>
          </panel-group>
          <!-- 到店时间分布 -->
          <time-records :id="customId" width="45%" position="right"></time-records>
        </div>
        <div class="clearfix">
          <!-- 消费记录 -->
          <consume-records :id="customId" width="45%" height="auto" position="left"></consume-records>
          <!-- 到店记录 -->
          <enter-records :id="customId" width="45%" height="auto" position="right"></enter-records>
        </div>
      </div>
      <!-- 会员 -->
      <div v-else-if="memberType == 2">
        <div class="clearfix">
          <!-- 个人档案 -->
          <panel-group title="个人档案" style="width:45%;float:left;">
            <template slot="content">
              <div style="text-indent:18px;line-height:48px;font-size:14px;">姓名：{{customName}}</div>
              <div style="text-indent:18px;line-height:48px;font-size:14px;">电话：{{customTel}}</div>
            </template>
          </panel-group>
          <!-- 到店时间分布 -->
          <time-records :id="customId" width="45%" position="right"></time-records>
        </div>
        <div class="clearfix">
          <!-- 到店记录 -->
          <enter-records :id="customId" width="45%" height="auto" position="left"></enter-records>
        </div>
      </div>
      <!-- 熟客 -->
      <div v-else-if="memberType == 3" class="clearfix">
        <!-- 到店时间分布 -->
        <time-records :id="customId" width="45%" position="left"></time-records>
        <!-- 到店记录 -->
        <enter-records :id="customId" width="45%" height="auto" position="right"></enter-records>
      </div>
    </div>
  </div>
</template>
<script>
import panelCard from './common/panelCard';
import panelGroup from './common/panelGroup';
import timeRecords from './common/timeRecords';
import consumeRecords from './common/consumeRecords';
import enterRecords from './common/enterRecords';
import { findUserManageCount, findUserManage } from "@/api/face";
export default {
  components: { panelCard, panelGroup, timeRecords, consumeRecords, enterRecords },
  data() {
    return {
      memberType: 1,
      hyCount: 0,
      ygCount: 0,
      skCount: 0,
      ysdyCount: 0,
      account: '',
      tableData: [],
      page: 1,
      total: 0,
      showDetail: false,
      customId: '',
      customName: '',
      customTel: '',
    };
  },
  created() {
    findUserManageCount().then(res => {
      res.tableData.forEach(item => {
        if (item["member_type"] == 1 && item["count"]) {
          this.hyCount = item["count"];
        } else if (item["member_type"] == 2 && item["count"]) {
          this.ygCount = item["count"];
        } else if (item["member_type"] == 3 && item["count"]) {
          this.skCount = item["count"];
        } else if (item["member_type"] == 4 && item["count"]) {
          this.ysdyCount = item["count"];
        }
      })
    })
    this.handleGetTableData();
  },
  methods: {
    handleGetListPage() {
      this.customId = '';
      this.customName = '';
      this.customTel = '';
      this.showDetail = false;
    },
    handleSelectPanelCard(data) {
      if (data.memberType !== 4) {
        this.customName = data.username;
        this.customTel = data.mobilephone;
        this.customId = data.id;
        this.showDetail = true;
      }
    },
    handleOnMemberTypeChange(val) {
      this.showDetail = false;
      this.memberType = val;
      this.page = 1;
      this.handleGetTableData();
    },
    handleOnPageChange(page) {
      this.page = page;
      this.handleGetTableData();
    },
    handleGetTableData() {
      findUserManage({account: this.account, pageSize: 20, currentPage: this.page, memberType: this.memberType}).then(res => {
        this.tableData = res.tableData.records;
        this.total = res.tableData.total;
      });
    }
  },
};
</script>
<style lang="scss" scoped>
.tabs-bar {
  padding-bottom: 15px;
  margin-bottom: 15px;
  border-bottom: 1px solid #dcdee2;
}
.base-search {
  margin-bottom: 15px;
  span {
    vertical-align: middle;
    font-size: 14px;
    color: #48576a;
    font-weight: 700;
  }
  .el-input {
    width: 200px;
    margin-right: 30px;
  }
}
.panel-card {
  display: inline-block;
  border: 1px solid #dcdee2;
  border-radius: 4px;
  margin-right: 10px;
  padding-bottom: 10px !important;
}
.panel-card:hover{
  box-shadow: 0 1px 6px rgba(0,0,0,.2);
  border-color: #eee;
}
</style>