<template>
  <div class="orecharge-container main-content">
    <!-- 概览统计 -->
    <div class="panel-list">
      <div class="panel-list-title">概览统计</div>
      <el-row :gutter="20">
        <el-col :span="6" class="card-panel-col">
          <div class='card-panel'>
            <div class="card-panel-description">
              <div class="card-panel-text">会员充值总额（元）</div>
              <div class="card-panel-count"><count class="card-panel-num" :endVal="Number(panelCardData.allInrecordNum)"></count></div>
            </div>
          </div>
        </el-col>
        <el-col :span="6" class="card-panel-col">
          <div class='card-panel'>
            <div class="card-panel-description">
              <div class="card-panel-text">充值总笔数（笔）</div>
              <div class="card-panel-count"><count class="card-panel-num" :endVal="Number(panelCardData.allInrecordCount)"></count></div>
            </div>
          </div>
        </el-col>
        <el-col :span="6" class="card-panel-col">
          <div class='card-panel'>
            <div class="card-panel-description">
              <div class="card-panel-text">实充总金额（元）</div>
              <div class="card-panel-count"><count class="card-panel-num" :endVal="Number(panelCardData.allTrueInrecordNum)"></count></div>
            </div>
          </div>
        </el-col>
        <el-col :span="6" class="card-panel-col">
          <div class='card-panel'>
            <div class="card-panel-description">
              <div class="card-panel-text">赠送总金额（元）</div>
              <div class="card-panel-count"><count class="card-panel-num" :endVal="Number(panelCardData.allGiveNum)"></count></div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="panel-list">
      <div class="panel-list-title">充值记录</div>
      <!-- 筛选 -->
      <el-form>
        <el-form-item class="inline-block" label="查询日期：" label-width="95px">
          <date-picker type="daterange" :value.sync="formData"></date-picker>
        </el-form-item>
        <el-form-item class="inline-block">
          <el-button type="primary" @click="handleSubmitForm()">查询</el-button>
          <el-button type="primary" @click="handleClearForm()">清空</el-button>
        </el-form-item>
      </el-form>
      <!-- 表格 -->
      <el-table :data="tableData" style="margin-bottom: 15px;">

        <el-table-column label="充值时间">
          <template slot-scope="scope">
            <span>{{ scope.row.time }}</span>
          </template>
        </el-table-column>

        <el-table-column label="充值金额">
          <template slot-scope="scope">
            <span>{{ scope.row.allInrecordNum }}</span>
          </template>
        </el-table-column>

        <el-table-column label="充值笔数">
          <template slot-scope="scope">
            <span>{{ scope.row.allInrecordCount }}</span>
          </template>
        </el-table-column>

        <el-table-column label="实充金额">
          <template slot-scope="scope">
            <span>{{ scope.row.allTrueInrecordNum }}</span>
          </template>
        </el-table-column>

        <el-table-column label="赠送金额">
          <template slot-scope="scope">
            <span>{{ scope.row.allGiveNum }}</span>
          </template>
        </el-table-column>

        <el-table-column label="充值手续费">
          <template slot-scope="scope">
            <span>{{ scope.row.poundage }}</span>
          </template>
        </el-table-column>

        <el-table-column label="实充结算金额">
          <template slot-scope="scope">
            <span>{{ scope.row.balance }}</span>
          </template>
        </el-table-column>

      </el-table>
      <!-- 分页 -->
      <el-pagination @current-change="handleOnPageChange" :current-page="formData.currentPage" layout="total, prev, pager, next, jumper" :total="total" :page-size="pageSize"></el-pagination>
    </div>
  </div>
</template>

<script>
  import { Count } from '@/views/main/dashboard/admin/components';
  import { getMembershipInrecord } from '@/api/operation';
  import { isValidEndTime } from '@/utils/validate';
  import { getNowFormatDate } from '@/utils';
  import DatePicker from '@/components/DatePicker';

  export default {
    name: 'orecharge_views',
    components: { Count, DatePicker },
    data() {
      return {
        formData: [getNowFormatDate(), getNowFormatDate()],
        panelCardData: {
          allInrecordNum: 0, // 充值总金额
          allInrecordCount: 0, // 充值总笔数
          allTrueInrecordNum: 0, // 实充总金额
          allGiveNum: 0, // 赠送总金额
        },
        tableData: [],
        page: 1,
        total: 0,
        pageSize: 10
      }
    },
    created() {
      this.handleGetTableData();
    },
    methods: {
      handleOnPageChange(page) {
        this.page = page;
        this.handleGetTableData();
      },
      handleClearForm() {
        this.formData = [];
      },
      handleSubmitForm() {
        this.page = 1;
        this.handleGetTableData();
      },
      handleGetTableData() {
        getMembershipInrecord({ dateFormat: this.formData[0], endTime: this.formData[1], currentPage: this.page }).then(res => {
          this.panelCardData = res.tableData.allInrecord;
          this.tableData = res.tableData.inrecordByDay.rows;
          this.total = res.tableData.inrecordByDay.totalSize;
          this.pageSize = res.tableData.inrecordByDay.pageSize;
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.orecharge-container {
  .panel-list {
    margin-bottom: 50px;
  }
  .panel-list-title {
    color: rgba(16, 16, 16, 1);
    font-size: 16px;
    text-align: left;
    font-weight: bold;
    margin-bottom: 25px;
  }
  .card-panel {
    // height: 170px;
    cursor: pointer;
    font-size: 12px;
    padding: 15px;
    position: relative;
    overflow: hidden;
    color: #EE454C;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    border: 1px solid #ddd;
    .card-panel-description {
      font-weight: bold;
      margin-bottom: 25px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 1);
        font-size: 16px;
        margin-bottom: 25px;
      }
      .card-panel-count {
        text-align: center;
      }
      .card-panel-num {
        font-size: 28px;
      }
    }
  }
}
</style>