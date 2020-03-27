<template>
  <div class="operation-container main-content">
    <!-- 筛选 -->
    <el-form>
      <el-form-item class="inline-block" label="查询日期：" label-width="95px">
        <date-picker type="daterange" :value.sync="formData"></date-picker>
      </el-form-item>
      <el-form-item class="inline-block">
        <el-button type="primary" @click="handleGetTableData()">查询</el-button>
        <el-button type="primary" @click="formData = []">清空</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData">
      <el-table-column label="支付方式">
        <template slot-scope="scope">
          <span v-if="scope.row.payWay == 1">支付宝</span>
          <span v-else-if="scope.row.payWay == 2">微信</span>
          <span v-else-if="scope.row.payWay == 3">余额</span>
          <span v-else-if="scope.row.payWay == 7">混合支付</span>
          <span v-else>总计</span>
        </template>
      </el-table-column>

      <el-table-column label="订单数">
        <template slot-scope="scope">
          <span>{{ Number(scope.row.orderSum) }}笔</span>
        </template>
      </el-table-column>

      <el-table-column label="订单金额">
        <template slot-scope="scope">
          <span>￥{{ parseFloat(scope.row.sumOrderFee).toFixed(2) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="优惠金额">
        <template slot-scope="scope">
          <span>￥{{ (parseFloat(scope.row.sumOrderFee) - parseFloat(scope.row.sumSettleAccount)).toFixed(2) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="退款金额">
        <template slot-scope="scope">
          <span>￥{{ parseFloat(scope.row.sumRefundAmount).toFixed(2) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="实收金额">
        <template slot-scope="scope">
          <span>￥{{ parseFloat(scope.row.sumSettleAccount).toFixed(2) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="手续费">
        <template slot-scope="scope">
          <span>￥{{ parseFloat(scope.row.useFee).toFixed(2) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="结算金额">
        <template slot-scope="scope">
          <span>￥{{ parseFloat(scope.row.sumTransferAccount).toFixed(2) }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getOperationSummary } from '@/api/operation';
import DatePicker from '@/components/DatePicker';
import { isValidEndTime } from '@/utils/validate';
import { getNowFormatDate } from '@/utils';

export default {
  name: 'operation_views',
  components: { DatePicker },
  data() {
    return {
      formData: [getNowFormatDate(), getNowFormatDate()],
      tableData: []
    }
  },
  created() {
    this.handleGetTableData();
  },
  methods: {
    handleGetTableData() {
      getOperationSummary({ dateFormat: this.formData[0], endTime: this.formData[1] }).then((res) => {
        this.tableData = res.tableData;
      })
    }
  }
}
</script>