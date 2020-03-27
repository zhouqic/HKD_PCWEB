<template>
<el-container>
  <el-main style="padding: 0;">
    <el-table :data="tableData">
      <el-table-column label="变动类型" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.productName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="储值金额" prop="totalFee" align="center"></el-table-column>
      
      <el-table-column label="操作工号" prop="jobNumber" align="center"></el-table-column>
      
      <el-table-column label="操作门店" prop="name" align="center"></el-table-column>

      <el-table-column label="操作时间" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.endTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
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
import { findRecordList } from "@/api/vipManage";

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
      findRecordList({ id: this.id, currentPage: this.page }).then(res => {
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