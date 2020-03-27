<template>
  <div class="ygmanage-container main-content">
    <!-- 筛选 -->
    <el-form :model="formData">
      <el-form-item class="inline-block" label="选择员工：" label-width="100px">
        <el-input v-model="formData.account" placeholder="工号/手机号"></el-input>
      </el-form-item>
      <el-form-item class="inline-block">
        <el-button type="primary" @click="handleOnSearchTable()">查询</el-button>
        <el-button type="primary" @click="formData.account = '';">清空</el-button>
        <el-button type="primary" @click="handleOpenAddDialog()" style="margin-left: 80px;">添加员工</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table :data="tableData" style="margin-bottom: 15px;">
      <el-table-column label="姓名">
        <template slot-scope="scope">
          <span>{{scope.row.staffName}}</span>
        </template>
      </el-table-column>

      <el-table-column label="工号">
        <template slot-scope="scope">
          <span>{{ scope.row.jobNo }}</span>
        </template>
      </el-table-column>

      <el-table-column label="门店名称">
        <template slot-scope="scope">
          <span>{{ scope.row.storeName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="角色">
        <template slot-scope="scope">
          <span v-if="scope.row.role == 0 && scope.row.type == 0">老板</span>
          <span v-if="scope.row.role == 0 && scope.row.type == 1">店长</span>
          <span v-else-if="scope.row.role == 1 && scope.row.type == 1">店员</span>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button v-if="scope.row.jobNo != 100000 || $store.getters.jobNumber == 100000" class="table_operate" type="primary" @click="handleOpenEditDialog(scope.row)">编辑</el-button>
          <el-button v-if="scope.row.jobNo != 100000" class="table_operate" type="danger" @click="handleDeleteStaff(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination @current-change="handleOnPageChange" :current-page="formData.currentPage" layout="total, prev, pager, next, jumper" :total="total" :page-size="pageSize"></el-pagination>
    <!-- 员工添加、编辑 -->
    <staff-form v-if="showDialog" :id="selectID" :show="showDialog" @close="handleCloseDialog"></staff-form>
  </div>
</template>
<script>
import { getStaffList, getRfStaffById, deleteRfStaffById } from '@/api/staffManage';
import StaffForm from './staffForm';
import { Message, MessageBox } from 'element-ui'

export default {
  name: "YgManageViews",
  components: { StaffForm },
  data() {
    return {
      formData: {
        account: "",
        currentPage: 1
      },
      tableData: [],
      selectID: '',
      total: 0,
      showDialog: false,
      pageSize: 10
    };
  },
  created() {
    this.handleGetTableData();
  },
  methods: {
    handleOnPageChange(page) {
      this.formData.currentPage = page;
      this.handleGetTableData();
    },
    handleOnSearchTable() {
      this.formData.currentPage = 1;
      this.handleGetTableData();
    },
    handleGetTableData() {
      getStaffList(this.formData).then((res) => {
        if (res.tableData.rows.length == 0 && this.formData.currentPage - 1 > 0) {
          this.formData.currentPage--;
          this.handleGetTableData();
        } else {
          this.tableData = res.tableData.rows;
          this.total = res.tableData.totalSize;
          this.pageSize = res.tableData.pageSize;
        }
      })
    },
    handleOpenAddDialog() {
      if (!this.$store.state.permission.showMoreYuanGong && this.tableData.filter(item => item.jobNo != 100000).length >= 3) {
        this.$confirm('该版本最多添加4个员工，如需添加更多员工，请前往汇客多掌柜宝开通<span style="color:red;">收银员管理</span>功能?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          showCancelButton: false,
          dangerouslyUseHTMLString: true,
          type: 'warning'
        }).then(() => {}).catch(() => {});
        return false;
      }
      this.showDialog = true;
    },
    handleOpenEditDialog(row) {
      if (this.$store.getters.jobNumber != row.jobNo && this.$store.getters.staffRole == row.role && this.$store.getters.jobNumber != 100000) {
        Message({
          message: "不能编辑同级员工",
          type: 'error',
          duration: 3 * 1000
        });
      } else {
        this.selectID = row.id;
        this.showDialog = true;
      }
    },
    handleDeleteStaff(row) {
      if (this.$store.getters.jobNumber != row.jobNo && this.$store.getters.staffRole == row.role && this.$store.getters.jobNumber != 100000) {
        Message({
          message: "不能删除同级员工",
          type: 'error',
          duration: 3 * 1000
        });
      } else {
        MessageBox.confirm('您确认要删除该员工吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          showCancelButton: true,
          type: 'warning'
        }).then(() => {
          deleteRfStaffById(row.id).then(res => {
            this.handleGetTableData();
          })
        }).catch(() => {});
      }
    },
    handleCloseDialog() {
      this.selectID = '';
      this.showDialog = false;
      this.handleGetTableData();
    }
  }
};
</script>