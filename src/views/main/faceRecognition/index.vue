<template>
  <div class="main-content">
    <!-- 筛选 -->
    <el-form label-width="100px">
      <el-form-item class="inline-block" label="查询日期：" label-width="95px">
        <date-picker type="date" :value.sync="time" style="width:180px"></date-picker>
      </el-form-item>
      <el-form-item class="inline-block" label="顾客类型：">
        <el-select v-model="type" style="width:120px">
          <el-option :value="''" label="不限"></el-option>
          <el-option :value="0" label="新客"></el-option>
          <el-option :value="3" label="熟客"></el-option>
          <el-option :value="1" label="会员"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="inline-block" label-width="0px">
        <el-button type="primary" @click="handleOnSearchCommand()">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 顾客数据 -->
    <el-container>
      <!-- 左侧列表数据 -->
      <el-aside width="280px">
        <div class="aside-list">
          <panel-card v-for="item in asideData" :key="item.id" :data="item" :is-actived="customId===item.id" :show-label="true" @click.native="handleSelectPanelCard(item)"></panel-card>
          <div v-if="asideData.length == 0" class="text-center" style="line-height:600px;">暂无数据</div>
        </div>
        <el-pagination @current-change="handleOnAsidePageChange" :current-page="asidePage" layout="prev, pager, next" :pager-count="5" :total="asideTotal" :page-size="10"></el-pagination>
      </el-aside>
      <!-- 右侧详情 -->
      <el-container>
         <el-header height="30px">
           <el-dropdown trigger="click" @visible-change="toggleUserAvatar">
            <span class="el-dropdown-link">操作<i :class="iClass"></i></span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <span @click="handleRegisterCustom(2)">注册店员</span>
              </el-dropdown-item>
              <el-dropdown-item>
                <span @click="handleRegisterCustom(1)">注册会员</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
         </el-header>
         <el-main style="padding:10px 20px;">
           <!-- 新客 -->
           <div v-if="customType == 0" class="text-center" style="line-height:600px;">
             <el-button type="primary" @click="handleRegisterCustom(2)">注册店员</el-button>
             <el-button type="primary" @click="handleRegisterCustom(1)">注册会员</el-button>
           </div>
           <!-- 熟客 -->
           <div v-else-if="customType == 3">
             <!-- 到店时间分布 -->
             <time-records :id="customId" width="100%" position="left"></time-records>
             <!-- 到店记录 -->
             <enter-records :id="customId" width="100%"></enter-records>
           </div>
           <!-- 会员 -->
           <div v-else-if="customType == 1">
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
             <consume-records :id="customId" width="45%" position="left"></consume-records>
             <!-- 到店记录 -->
             <enter-records :id="customId" width="45%" position="right"></enter-records>
             </div>
           </div>
         </el-main>
      </el-container>
      <!-- 注册 -->
      <el-dialog title="注册" :visible.sync="showDialog" width="600px" :close-on-click-modal="false" :close-on-press-escape="false" @closed="handleCloseDialog">
        <register-form v-if="showDialog" ref="registerForm"></register-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleCloseDialog">取 消</el-button>
          <el-button type="primary" :disabled="isSubmit ? true : false" @click="handleSubmitForm">确 定</el-button>
        </span>
      </el-dialog>
    </el-container>
  </div>
</template>
<script>
import DatePicker from '@/components/DatePicker';
import panelCard from './common/panelCard';
import panelGroup from './common/panelGroup';
import timeRecords from './common/timeRecords';
import consumeRecords from './common/consumeRecords';
import enterRecords from './common/enterRecords';
import registerForm from './common/registerForm';
import { getNowFormatDate, parseTime } from '@/utils';
import { findUserToStore, registerUserById } from '@/api/face';
export default {
  name: "shopCustomView",
  components: { DatePicker, panelCard, panelGroup, registerForm, timeRecords, enterRecords, consumeRecords },
  data() {
    return {
      type: '',
      time: getNowFormatDate(),
      searchData: {},
      asideData: [],
      asidePage: 1,
      asideTotal: 0,
      customId: '',
      customType: '',
      customName: '',
      customTel: '',
      iClass: 'el-icon-arrow-down',
      registeType: '',
      showDialog: false,
      isSubmit: false,
      timeInteval: null
    }
  },
  created() {
    this.handleGetAsideData();
  },
  mounted() {
    this.timeInteval = setInterval(() => {
      this.handleGetAsideData();
      if (this.customId) {
        this.handleRefreshComponent();
      }
    }, 5000)
  },
  beforeDestroy() {
    clearInterval(this.timeInteval);
  },
  methods: {
    handleRefreshComponent() {
      const id = this.customId;
      this.customId = '';
      this.$nextTick(() => (this.customId = id))
    },
    toggleUserAvatar(flag) {
      if (flag) {
        this.iClass = "el-icon-arrow-up"
      } else {
        this.iClass = "el-icon-arrow-down"
      }
    },
    handleSelectPanelCard(data) {
      this.customId = data.id;
      this.customType = data.memberType;
      this.customName = data.username;
      this.customTel = data.mobilephone;
    },
    handleOnSearchCommand() {
      this.asidePage = 1;
      this.searchData = {
        time: this.time, 
        type: this.type, 
        currentPage: this.asidePage
      }
      this.handleGetAsideData();
    },
    handleOnAsidePageChange(page) {
      this.asidePage = page;
      this.searchData = {
        time: this.time, 
        type: this.type, 
        currentPage: this.asidePage
      }
      this.handleGetAsideData();
    },
    handleGetAsideData() {
      findUserToStore(this.searchData).then(res => {
        this.asideData = res.tableData.records;
        this.asideTotal = res.tableData.total;
        const data = this.asideData.filter(item=>item.id==this.customId);
        if (data.length <= 0) {
          this.customId = '';
          this.customType = null;
        }
        this.$forceUpdate();
      })
    },
    handleRegisterCustom(type) {
      if (!this.customId) {
        this.$message.error("请选择一个顾客");
        return false;
      }
      this.registeType = type;
      this.showDialog = true;
    },
    handleCloseDialog() {
      this.showDialog = false;
      this.registeType = '';
    },
    handleSubmitForm() {
      const $el = this.$refs["registerForm"];
      $el.$refs["validateForm"].validate(valid => {
        if (valid) {
          this.isSubmit = true;
          registerUserById($el.data).then(res => {
            this.isSubmit = false;
            this.$message.error("注册成功");
          }).catch(err => {
            this.isSubmit = false;
          });
        }
      });
    }
  },
}
</script>
<style lang="scss" scoped>
  .main-content {
    height: 100%;
    .el-container {
      height: calc(100% - 51px);
      .el-aside {
        position: relative;
        .aside-list {
          height: calc(100% - 40px);
          overflow: auto;
        }
        .el-pagination {
          background: #fff;
          text-align: center;
          padding-top: 10px;
          margin-bottom: 0;
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          /deep/ li.number {
            min-width: 25.5px!important;
          }

        }

      }
      .el-container {
        height: 100%;
        .el-header {
          line-height: 30px;
          border-bottom: 1px solid #e8eaec;
          text-align: right;
        }
        .xin-box {
          height: 100%;
        }
      }
    }
  }
</style>