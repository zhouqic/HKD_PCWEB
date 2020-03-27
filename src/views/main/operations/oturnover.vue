<template>
  <div class="oturnover-container main-content">
    <!-- 筛选 -->
    <el-form>
      <el-form-item class="inline-block" label="查询日期：" label-width="95px">
        <date-picker type="daterange" :value.sync="formData"></date-picker>
      </el-form-item>
      <el-form-item class="inline-block" label="选择员工：" label-width="95px">
        <el-select v-model="staffId">
          <template v-for="item in staffList">
            <el-option :key="item.id" :value="item.id" :label="item.name"></el-option>
          </template>
        </el-select>
      </el-form-item>
      <el-form-item class="inline-block">
        <el-button type="primary" @click="handleSubmitForm()">查询</el-button>
        <el-button type="primary" @click="handleClearForm()">清空</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table :data="tableData" style="margin-bottom: 15px;">

      <el-table-column label="员工工号">
        <template slot-scope="scope">
          <span>{{ scope.row.jobNo }}</span>
        </template>
      </el-table-column>

      <el-table-column label="员工姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="实收总金额">
        <template slot-scope="scope">
          <span>{{ scope.row.money }}</span>
        </template>
      </el-table-column>

      <el-table-column label="微信收款">
        <template slot-scope="scope">
          <span>{{ scope.row.weChatMoney }}</span>
        </template>
      </el-table-column>

      <el-table-column label="支付宝收款">
        <template slot-scope="scope">
          <span>{{ scope.row.aliPayMoney }}</span>
        </template>
      </el-table-column>

      <el-table-column label="会员余额收款">
        <template slot-scope="scope">
          <span>{{ scope.row.balanceMoney }}</span>
        </template>
      </el-table-column>

      <el-table-column label="会员充值金额">
        <template slot-scope="scope">
          <span>{{scope.row.inrecordMoney}}</span>
        </template>
      </el-table-column>

      <el-table-column label="优惠券优惠金额">
        <template slot-scope="scope">
          <span>{{scope.row.coupon}}</span>
        </template>
      </el-table-column>

      <el-table-column label="红包优惠金额">
        <template slot-scope="scope">
          <span>{{scope.row.shareMoney}}</span>
        </template>
      </el-table-column>

      <el-table-column label="积分抵扣金额">
        <template slot-scope="scope">
          <span>{{scope.row.integralMoney}}</span>
        </template>
      </el-table-column>

      <el-table-column label="满减金额">
        <template slot-scope="scope">
          <span>{{(parseFloat(scope.row.randomMoney) + parseFloat(scope.row.fullReduction)).toFixed(2)}}</span>
        </template>
      </el-table-column>

    </el-table>
    <!-- 分页 -->
    <el-pagination @current-change="handleOnPageChange" :current-page="page" layout="total, prev, pager, next, jumper" :total="total" :page-size="pageSize"></el-pagination>
  </div>
</template>

<script>
  import { findStaffOperateList } from '@/api/operation';
  import { getStaffList } from '@/api/staffManage';
  import { getNowFormatDate } from '@/utils';
  import DatePicker from '@/components/DatePicker';

  export default {
    name: 'oturnover_views',
    components: { DatePicker },
    data() {
      return {
        formData: [getNowFormatDate(), getNowFormatDate()],
        staffId: '',
        staffList: [{ id: '', name: "不限"}],
        tableData: [],
        page: 1,
        total: 0,
        pageSize: 10
      }
    },
    created() {
      getStaffList({}).then(res => {
        res.tableData.rows.forEach((item, i) => {
          this.staffList.push({id: item.id, name: item.staffName != '' ? item.staffName : '老板' });
        });
      })
      this.handleGetTableData();
    },
    methods: {
      handleOnPageChange(page) {
        this.page = page;
        this.handleGetTableData();
      },
      handleClearForm() {
        this.formData = [];
        this.staffId = '';
      },
      handleSubmitForm() {
        this.page = 1;
        this.handleGetTableData()
      },
      handleGetTableData() {
        findStaffOperateList({ dateFormat: this.formData[0], endTime: this.formData[1], currentPage: this.page, staffId: this.staffId }).then(res => {
          this.tableData = res.tableData.rows;
          this.total = res.tableData.totalSize;
          this.pageSize = res.tableData.pageSize;
        })
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
/deep/ .el-select .el-input {
  width: 120px;
}
</style>