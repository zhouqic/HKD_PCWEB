<template>
  <div class="ylorder-container main-content">
    <!-- 筛选 -->
    <el-form>
      <el-form-item class="inline-block" label="查询日期：" label-width="95px">
        <date-picker type="daterange" :value.sync="formData"></date-picker>
      </el-form-item>
      <el-form-item class="inline-block" label="订单状态：" label-width="100px">
        <el-select v-model="verifyStatus">
          <el-option value="" label="全部订单"></el-option>
          <el-option value="1" label="已消费"></el-option>
          <el-option value="0" label="未消费"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="inline-block">
        <el-button type="primary" @click="handleSubmitForm()">查询</el-button>
        <el-button type="primary" @click="handleClearForm()">清空</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table :data="tableData" style="margin-bottom: 15px;">
      <el-table-column label="下单时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="消费时间">
        <template slot-scope="scope">
          <span v-if="scope.row.verifyTime">{{ parseTime(parseInt(scope.row.verifyTime)) }}</span>
          <span v-else>/</span>
        </template>
      </el-table-column>

      <el-table-column label="活动类型">
        <template slot-scope="scope">
          <span v-if="scope.row.type == 1">爆品</span>
          <span v-else-if="scope.row.type == 2">9.9专区</span>
        </template>
      </el-table-column>

      <el-table-column label="订单状态">
        <template slot-scope="scope">
          <span v-if="scope.row.verifyStatus == 1">已消费</span>
          <span v-else-if="scope.row.verifyStatus == 0">未消费</span>
        </template>
      </el-table-column>

      <el-table-column label="订单总额">
        <template slot-scope="scope">
          <span>{{ scope.row.orderPrice }} 元</span>
        </template>
      </el-table-column>

      <el-table-column label="用户手机号" prop="userPhone"></el-table-column>

      <el-table-column label="订单编号" prop="orderNo"></el-table-column>

    </el-table>
    <!-- 分页 -->
    <el-pagination @current-change="handleOnPageChange" :current-page="page" layout="total, prev, pager, next, jumper" :total="total" :page-size="pageSize"></el-pagination>
  </div>
</template>
<script>
import { parseTime } from '@/utils';
import { getNowFormatDate } from '@/utils';
import { getRfSingleOrderList } from '@/api/bpyinliu';
import DatePicker from '@/components/DatePicker';

export default {
  name: "ylOrder_Views",
  components: { DatePicker },
  data() {
    return {
      formData: [getNowFormatDate(), getNowFormatDate()],
      total: 0,
      page: 1,
      pageSize: 0,
      verifyStatus: '',
      tableData: []
    }
  },
  created() {
    this.handleGetTableData();
  },
  methods: {
    parseTime,
    handleOnPageChange(page) {
      this.page = page;
      this.handleGetTableData();
    },
    handleClearForm() {
      this.formData = [];
      this.verifyStatus = '';
    },
    handleSubmitForm() {
      this.page = 1;
      this.handleGetTableData();
    },
    handleGetTableData() {
      getRfSingleOrderList({ currentPage: this.page, verifyStatus: this.verifyStatus, beginTime: this.formData[0], endTime: this.formData[1] }).then(res => {
        this.tableData = res.tableData.rows;
        this.pageSize = res.tableData.pageSize;
        this.total = res.tableData.totalSize;
      })
    },
  },
}
</script>