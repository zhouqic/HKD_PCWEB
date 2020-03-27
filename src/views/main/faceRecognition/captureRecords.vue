<template>
  <div class="main-content">
    <el-row style="margin-bottom:15px;">
      <span class="search-label">查询日期：</span>
      <date-picker type="daterange" :value.sync="formData" style="margin-right:30px;"></date-picker>
      <el-button type="primary" @click="page=1;handleGetTableData()">查询</el-button>
    </el-row>
    <!-- 表格 -->
    <el-table :data="tableData" style="margin-bottom: 15px;">
      <el-table-column label="照片">
        <template slot-scope="scope">
          <img v-if="scope.row.faceUrl" :src="scope.row.faceUrl" height="100"/>
        </template>
      </el-table-column>

      <el-table-column label="Face ID" prop="faceId"></el-table-column>

      <el-table-column label="时间">
        <template slot-scope="scope">
          <span>{{ parseTime(new Date(scope.row.createTime), '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="用户身份">
        <template slot-scope="scope">
          <span v-if="scope.row.memberType == 0">新顾客</span>
          <span v-else-if="scope.row.memberType == 1">会员</span>
          <span v-else-if="scope.row.memberType == 2">店员</span>
          <span v-else-if="scope.row.memberType == 3">熟客</span>
          <span v-else-if="scope.row.memberType == 4">疑是店员</span>
        </template>
      </el-table-column>

      <el-table-column label="性别">
        <template slot-scope="scope">
          <span>{{ scope.row.gender ? '女' : '男' }}</span>
        </template>
      </el-table-column>

      <el-table-column label="年龄" prop="age"></el-table-column>

      <el-table-column label="是否有效">
        <template slot-scope="scope">
          <span>有效</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination @current-change="handleOnPageChange" :current-page="page" layout="total, prev, pager, next, jumper" :total="total" :page-size="10"></el-pagination>
  </div>
</template>
<script>
import DatePicker from '@/components/DatePicker';
import { getNowFormatDate, parseTime } from '@/utils';
import { findFaceCustomerList } from "@/api/face";
export default {
  components: { DatePicker },
  data() {
    return {
      formData: [getNowFormatDate(), getNowFormatDate()],
      tableData: [],
      page: 1,
      total: 0
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
    handleGetTableData() {
      findFaceCustomerList({beginTime: this.formData[0], endTime: this.formData[1], currentPage: this.page}).then(res => {
        this.tableData = res.tableData.list;
        this.total = res.tableData.all;
      })
    }
  },
}
</script>
<style lang="scss" scoped>
span.search-label {
  vertical-align: middle;
  font-size: 14px;
  color: #48576a;
  font-weight: 700;
}
</style>