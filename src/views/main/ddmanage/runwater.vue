<template>
  <div class="water-container main-content">
    <!-- 筛选 -->
    <el-form>
      <el-form-item class="inline-block" label="查询日期：" label-width="95px">
        <date-picker type="daterange" :value.sync="formData"></date-picker>
      </el-form-item>
      <el-form-item class="inline-block" label="会员手机号：" label-width="100px">
        <el-input v-model="formData.phone" placeholder="请输入手机号" style="width: 130px"></el-input>
      </el-form-item>
      <el-form-item class="inline-block" label="选择员工：" label-width="95px" v-if="$store.getters.roles.indexOf('admin') != -1">        
        <el-select v-model="staffId" style="width: 130px">
          <template v-for="item in staffList">
            <el-option :key="item.id" :value="item.id" :label="item.name"></el-option>
          </template>
        </el-select>
      </el-form-item>
      <el-form-item class="inline-block">
        <el-button type="primary" @click="handleGetSubmitForm()">查询</el-button>
        <el-button type="primary" @click="handleClearForm()">清空</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table :data="tableData" style="margin-bottom: 15px;">

      <el-table-column label="充值时间">
        <template slot-scope="scope">
          <span>{{ scope.row.inrecordTime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="充值订单号" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.inrecordOrderNo }}</span>
        </template>
      </el-table-column>

      <el-table-column label="收款工号" prop="jobNumber"></el-table-column>

      <el-table-column label="会员名称">
        <template slot-scope="scope">
          <span>{{ scope.row.memberName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="会员手机号">
        <template slot-scope="scope">
          <span>{{ scope.row.memberPhone }}</span>
        </template>
      </el-table-column>

      <el-table-column label="充值金额">
        <template slot-scope="scope">
          <span>{{ scope.row.inrecordMoney }}</span>
        </template>
      </el-table-column>

      <el-table-column label="赠送金额">
        <template slot-scope="scope">
          <span>{{ scope.row.giveMoney }}</span>
        </template>
      </el-table-column>

      <el-table-column label="手续费">
        <template slot-scope="scope">
          <span>{{ scope.row.poundage }}</span>
        </template>
      </el-table-column>

      <el-table-column label="结算金额">
        <template slot-scope="scope">
          <span>{{ scope.row.balanceMoney }}</span>
        </template>
      </el-table-column>

    </el-table>
    <el-row>
      <el-col :span="6" style="font-size: 13px;line-height: 32px;">
        总充值金额：{{ businessData }} 元
      </el-col>
      <el-col :span="18">
        <!-- 分页 -->
        <el-pagination @current-change="handleOnPageChange" :current-page="page" layout="total, prev, pager, next, jumper" :total="total" :page-size="pageSize"></el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { getStaffList } from '@/api/staffManage';
  import { findRechargeByCreaterId } from '@/api/ddmanage';
  import { getNowFormatDate } from '@/utils';
  import DatePicker from '@/components/DatePicker';

  export default {
    name: 'runwater_views',
    components: { DatePicker },
    data() {
      return {
        formData: [getNowFormatDate(), getNowFormatDate()],
        staffList: [{ id: '', name: "不限"}],
        staffId: this.$store.getters.jobNumber == 100000 ? '' : (this.$store.state.user.voiceType == 0 ? this.$store.getters.staffId : ''),
        phone: '',
        tableData: [],
        businessData: 0,
        page: 1,
        total: 0,
        pageSize: 10
      }
    },
    created() {
      if (this.$store.getters.roles.indexOf('admin') != -1) {
        getStaffList({}).then(res => {
          res.tableData.rows.forEach((item, i) => {
            this.staffList.push({id: item.id, name: item.staffName});
          });
        })
      }
      this.handleGetTableData();
    },
    methods: {
      handleOnPageChange(page) {
        this.page = page;
        this.handleGetTableData();
      },
      handleClearForm() {
        this.formData = [];
        this.phone = '';
        this.staffId = this.$store.getters.jobNumber == 100000 ? '' : (this.$store.state.user.voiceType == 0 ? this.$store.getters.staffId : '');
      },
      handleGetSubmitForm() {
        this.page = 1;
        this.handleGetTableData();
      },
      handleGetTableData() {
        findRechargeByCreaterId({ dateFormat: this.formData[0], endTime: this.formData[1], currentPage: this.page, staffId: this.staffId, phone: this.phone }).then(response => {
          this.businessData = response.businessData ? response.businessData : 0;
          this.tableData = response.tableData.rows;
          this.total = response.tableData.totalSize;
          this.pageSize = response.tableData.pageSize;
        })
      }
    }
  }
</script>