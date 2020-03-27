<template>
  <div>
    <!-- 表格数据 -->
    <el-table :data="tableData" style="margin-bottom:15px;">
      <el-table-column label="发送时间">
        <template slot-scope="scope">
          <span>{{scope.row.createDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
        </template>
      </el-table-column>

      <el-table-column label="人群名称" prop="groupName"></el-table-column>

      <el-table-column label="发送总条数">
        <template slot-scope="scope">{{ scope.row.num }}条</template>
      </el-table-column>

      <el-table-column label="发送成功条数">
        <template slot-scope="scope">{{ scope.row.successNum }}条</template>
      </el-table-column>

      <el-table-column label="发送失败条数">
        <template slot-scope="scope">{{ scope.row.failNum }}条</template>
      </el-table-column>

      <el-table-column label="短信内容" prop="content"></el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button class="table_operate" type="primary" @click="handleShowDetail(scope.row.id)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination @current-change="handleOnPageChange" :current-page="page" layout="total, prev, pager, next, jumper" :total="total" :page-size="pageSize"></el-pagination>
    <!-- 弹窗 -->
    <el-dialog title="详情记录" :visible.sync="showDialog" width="750px" :close-on-click-modal="false" :close-on-press-escape="false" @closed="handleCloseDialog">
      <el-table :data="dTableData" style="margin-bottom:15px;">
        <el-table-column label="发送时间">
          <template slot-scope="scope">
            <span>{{scope.row.createDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
          </template>
        </el-table-column>

        <el-table-column label="用户头像">
          <template slot-scope="scope">
            <img :src="scope.row.headimgurl ? scope.row.headimgurl : defaultImg" width="50" height="50" style="border-radius:50%;">
          </template>
        </el-table-column>

        <el-table-column label="用户名称" prop="name"></el-table-column>

        <el-table-column label="手机号" prop="phone"></el-table-column>

        <el-table-column label="发送状态">
          <template slot-scope="scope">{{ scope.row.status == -1 ? "发送失败" : (scope.row.status == 0 ? "发送中" : "发送成功") }}</template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination @current-change="handleOnDPageChange" :current-page="dPage" layout="total, prev, pager, next, jumper" :total="dTotal" :page-size="dPageSize"></el-pagination>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleCloseDialog()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getSmsSendRecord, getSmsDetailById } from '@/api/vipManage';

export default {
  props: ["data"],
  data() {
    return {
      defaultImg: require("@/assets/default_logo.jpg"),
      page: 1,
      total: 0,
      pageSize: 10,
      tableData: [],
      id: '',
      dPage: 1,
      dTotal: 0,
      dPageSize: 10,
      dTableData: [],
      showDialog: false
    }
  },
  created() {
    this.handleGetTableData();
  },
  methods: {
    handleSubmitForm(fn) {
      this.page = 1;
      this.handleGetTableData(fn);
    },
    handleOnPageChange(page) {
      this.page = page;
      this.handleGetTableData();
    },
    handleGetTableData(fn) {
      getSmsSendRecord({currentPage: this.page, type: 1, name: this.data.name }).then(res => {
        this.tableData = res.tableData.records;
        this.total = res.tableData.total;
        if (fn) fn();
      })
    },
    handleShowDetail(id) {
      this.id = id;
      this.showDialog = true;
      this.handleGetDTableData();
    },
    handleGetDTableData() {
      getSmsDetailById({currentPage: this.dPage, name: this.id }).then(res => {
        this.dTableData = res.tableData.records;
        this.dTotal = res.tableData.total;
      })
    },
    handleOnDPageChange(page) {
      this.dPage = page;
      this.handleGetDTableData();
    },
    handleCloseDialog() {
      this.showDialog = false;
      this.id = '';
      this.dTotal = 0;
      this.dPage = 1;
      this.dTableData = [];
    }
  },
}
</script>

<style>

</style>