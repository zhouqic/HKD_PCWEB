<template>
  <div class="osurvey-container main-content">
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

      <el-table-column label="会员昵称">
        <template slot-scope="scope">
          <span>{{ scope.row.memberName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="实充金额">
        <template slot-scope="scope">
          <span>{{ scope.row.inrecord }}</span>
        </template>
      </el-table-column>

      <el-table-column label="赠送金额">
        <template slot-scope="scope">
          <span>{{ scope.row.give }}</span>
        </template>
      </el-table-column>

      <el-table-column label="消费总额">
        <template slot-scope="scope">
          <span>{{ scope.row.consumption }}</span>
        </template>
      </el-table-column>

      <el-table-column label="剩余金额">
        <template slot-scope="scope">
          <span>{{ scope.row.balance }}</span>
        </template>
      </el-table-column>

      <el-table-column label="会员积分">
        <template slot-scope="scope">
          <span>{{ scope.row.points }}</span>
        </template>
      </el-table-column>

    </el-table>
    <!-- 分页 -->
    <el-pagination @current-change="handleOnPageChange" :current-page="page" layout="total, prev, pager, next, jumper" :total="total" :page-size="pageSize"></el-pagination>
  </div>
</template>

<script>
  import DatePicker from '@/components/DatePicker';
  import { getMembershipProfile } from '@/api/operation';
  import { getNowFormatDate } from '@/utils';

  export default {
    name: 'osurvey_views',
    components: { DatePicker },
    data() {
      return {
        formData: [getNowFormatDate(), getNowFormatDate()],
        total: 0,
        pageSize: 10,
        page: 1,
        tableData: []
      }
    },
    created() {
      this.handleGetTableData();
    },
    methods: {
      handleClearForm() {
        this.formData = [];
      },
      handleOnPageChange(page) {
        this.page = page;
        this.handleGetTableData();
      },
      handleSubmitForm() {
        this.page = 1;
        this.handleGetTableData();
      },
      handleGetTableData() {
        getMembershipProfile({ dateFormat: this.formData[0], endTime: this.formData[1], currentPage: this.page }).then(res => {
          this.tableData = res.tableData.rows;
          this.total = res.tableData.totalSize;
          this.pageSize = res.tableData.pageSize;
        })
      }
    }
  }
</script>