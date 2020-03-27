<template>
<el-container>
  <el-main style="padding: 0;">
    <el-table :data="tableData">
      <el-table-column label="订单号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.orderNo }}</span>
        </template>
      </el-table-column>

      <el-table-column label="消费时间" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.endTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
        </template>
      </el-table-column>

      <el-table-column label="订单金额" align="center">
        <template slot-scope="scope">
          <span>{{ parseFloat(scope.row.orderFee).toFixed(2) }}</span>
        </template>
      </el-table-column>
      
      <el-table-column label="支付金额" align="center">
        <template slot-scope="scope">
          <span>{{ parseFloat(scope.row.totalFee).toFixed(2) }}</span>
        </template>
      </el-table-column>
      
      <el-table-column label="优惠金额" align="center">
        <template slot-scope="scope">
          <span>{{ (parseFloat(scope.row.orderFee) - parseFloat(scope.row.totalFee)).toFixed(2) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="支付类型" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.payWay == 1">支付宝支付</span>
          <span v-else-if="scope.row.payWay == 2">微信支付</span>
          <span v-else-if="scope.row.payWay == 3">余额支付</span>
          <span v-else-if="scope.row.payWay == 5">现金支付</span>
          <span v-else-if="scope.row.payWay == 7">混合支付</span>
        </template>
      </el-table-column>
    </el-table>
  </el-main>
  <el-footer>
    <el-pagination @current-change="handleOnPageChange" :current-page="page" :page-size="pageSize"
    layout="total, prev, pager, next" :total="total"></el-pagination>
  </el-footer>
</el-container>
</template>
<script>
import { findMallOrderByPage } from "@/api/vipManage";

export default {
  props: ["id"],
  data() {
    return {
      tableData: [],
      page: 1,
      pageSize: 0,
      total: 0
    }
  },
  created() {
    this.handleGetTableData();
  },
  methods: {
    handleGetTableData() {
      findMallOrderByPage({ id: this.id, currentPage: this.page, type: 0 }).then(res => {
        this.tableData = res.tableData.records;
        this.pageSize = res.tableData.size;
        this.total = res.tableData.total;
      })
    },
    handleOnPageChange(val) {
      this.page = val;
      this.handleGetTableData();
    }
  }
}
</script>