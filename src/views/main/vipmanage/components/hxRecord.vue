<template>
<el-container>
  <el-main style="padding: 0;">
    <el-table :data="tableData">
      <el-table-column label="核销券名称" prop="title" align="center"></el-table-column>

      <el-table-column label="核销数量" prop="num" align="center"></el-table-column>

      <el-table-column label="核销类型" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.type == 1">爆品</span>
          <span v-else-if="scope.row.type == 2">9.9</span>
          <span v-if="scope.row.type == 3">积分</span>
          <span v-if="scope.row.type == 4">实物</span>
          <span v-if="scope.row.type == 5">砍价</span>
        </template>
      </el-table-column>
      
      <el-table-column label="操作工号" prop="staffId" align="center"></el-table-column>
      
      <el-table-column label="操作门店" prop="name" align="center"></el-table-column>

      <el-table-column label="操作时间" prop="verifyTime" align="center"></el-table-column>
    </el-table>
  </el-main>
  <el-footer>
    <el-pagination @current-change="handleOnPageChange" :current-page="page" :page-size="pageSize"
    layout="total, prev, pager, next" :total="total"></el-pagination>
  </el-footer>
</el-container>
</template>
<script>
import { findExchangeList } from "@/api/vipManage";

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
      findExchangeList({ id: this.id, currentPage: this.page }).then(res => {
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