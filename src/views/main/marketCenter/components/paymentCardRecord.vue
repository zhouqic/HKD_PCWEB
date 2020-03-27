<template>
<el-container>
  <!-- 列表 -->
  <el-table :data="tableData" style="margin-bottom: 15px;">
    <el-table-column label="用户" prop="name"></el-table-column>

    <el-table-column label="购买时间">
      <template slot-scope="scope">
        {{ scope.row.buyTime | parseTime('{y}-{m}-{d}') }}
      </template>
    </el-table-column>

    <el-table-column label="使用次数" prop="usedExchangeNum"></el-table-column>

    <el-table-column label="可用次数">
      <template slot-scope="scope">
        {{ rules.num == 0 ? "无限次" : scope.row.leftExchangeNum }}
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页 -->
  <el-footer>
    <el-pagination @current-change="handleOnPageChange" :current-page="page" layout="total, prev, pager, next, jumper" :total="total" :page-size="10"></el-pagination>
  </el-footer>
</el-container>
</template>
<script>
import { getRfNumCardRuleById } from '@/api/marketCenter';

export default {
  props: ["id"],
  data() {
    return {
      tableData: [],
      rules: {},
      page: 1,
      total: 0
    }
  },
  created() {
    if (this.id) {
      this.handleGetTableData();
    }
  },
  methods: {
    handleOnPageChange(page) {
      this.page = page;
      this.handleGetTableData();
    },
    handleGetTableData() {
      getRfNumCardRuleById({ id: this.id, pageNo: this.page }).then(res => {
        this.tableData = res.tableData.buyUserList;
        this.rules = res.tableData.rfNumberCardRule;
        this.total = res.totalSize;
      })
    }
  },
}
</script>