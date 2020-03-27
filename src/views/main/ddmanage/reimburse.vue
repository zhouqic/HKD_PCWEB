<template>
  <div class="gather-container main-content">
    <!-- 筛选 -->
    <el-form>
      <el-form-item class="inline-block" label-width="90px" label="查询日期：">
        <date-picker type="daterange" :value.sync="formData"></date-picker>
      </el-form-item>
      <el-form-item class="inline-block" label-width="130px" label="会员手机号：">
        <el-input v-model="phone" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item class="inline-block" label-width="90px" label="选择员工：" v-if="$store.getters.jobNumber == 100000">
        <el-select v-model="staffId" placeholder="请选择">
          <el-option v-for="item in staffList" :key="item.id" :value="item.id" :label="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="inline-block">
        <el-button type="primary" @click="handleGetTableData()">查询</el-button>
        <el-button type="primary" @click="handleResetForm()">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table :data="tableData" style="margin-bottom: 15px;">
      <!-- <el-table-column label="退款类型">
        <template slot-scope="scope">
          <span v-if="scope.row.type == 0">支付订单</span>
          <span v-else-if="scope.row.type == 1">商城订单</span>
          <span v-else-if="scope.row.type == 2">爆品9.9订单</span>
        </template>
      </el-table-column> -->

      <el-table-column label="退款状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 0">处理中</span>
          <span v-else-if="scope.row.status == 1">退款成功</span>
          <span v-else>退款失败</span>
        </template>
      </el-table-column>

      <el-table-column label="退款时间">
        <template slot-scope="scope">
          <span>{{scope.row.createDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
        </template>
      </el-table-column>

      <el-table-column label="退款门店" prop="shopName"></el-table-column>

      <el-table-column label="操作工号" prop="jobNumber"></el-table-column>

      <el-table-column label="退款方式">
        <template slot-scope="scope">
          <span v-if="scope.row.payWay == 1">支付宝</span>
          <span v-else-if="scope.row.payWay == 2">微信</span>
          <span v-else-if="scope.row.payWay == 3">余额</span>
        </template>
      </el-table-column>

      <el-table-column label="退款金额" prop="refundFee"></el-table-column>

      <el-table-column label="原支付单号" prop="orderNo"></el-table-column>

      <el-table-column label="消费时间">
        <template slot-scope="scope">
          <span>{{scope.row.orderTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
        </template>
      </el-table-column>

      <el-table-column label="会员卡号" prop="phone"></el-table-column>

      <el-table-column label="会员名称" prop="name"></el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination @current-change="handleOnPageChange" :current-page="page" layout="total, prev, pager, next, jumper" :total="total"></el-pagination>
  </div>
</template>

<script>
  import DatePicker from '@/components/DatePicker';
  import { getNowFormatDate, parseTime } from '@/utils';
  import { refundRecordList } from '@/api/ddmanage';
  import { getStaffList } from '@/api/staffManage';

  export default {
    name: "reimburse",
    components: { DatePicker },
    data() {
      return {
        formData: [getNowFormatDate(), getNowFormatDate()],
        phone: "",
        staffId: this.$store.getters.jobNumber == 100000 ? '' : (this.$store.state.user.voiceType == 0 ? this.$store.getters.staffId : ''),
        staffList: [{ id: '', name: "不限"}],
        tableData: [],
        total: 0,
        page: 1
      };
    },
    created() {
      if (this.$store.getters.jobNumber == 100000) {
        getStaffList({}).then(res => {
          res.tableData.rows.forEach((item, i) => {
            this.staffList.push({id: item.jobNo, name: item.staffName !== '' ? item.staffName : '老板'});
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
      handleResetForm() {
        this.page = 1;
        this.formData = [getNowFormatDate(), getNowFormatDate()];
        this.phone = "";
        this.jobNumber = "";
        this.staffId = this.$store.getters.jobNumber == 100000 ? '' : (this.$store.state.user.voiceType == 0 ? this.$store.getters.staffId : '');
      },
      handleGetTableData() {
        refundRecordList({ dateType: 6, beginDate: this.formData[0] + ' 00:00:00', endDate: this.formData[1] + " 23:59:59", pageNo: this.page, jobNumber: this.staffId, phone: this.phone }).then(res => {
          this.tableData = res.tableData;
          this.total = res.businessData.num;
        })
      }
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.icon-star {
  margin-right: 2px;
}
.drag-handler {
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.show-d {
  margin-top: 15px;
}
</style>