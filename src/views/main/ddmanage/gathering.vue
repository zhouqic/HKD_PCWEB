<template>
  <div class="gather-container main-content">
    <!-- 筛选 -->
    <el-form>
      <el-form-item class="inline-block" label="查询日期：" label-width="95px">
        <date-picker type="daterange" :value.sync="formData"></date-picker>
      </el-form-item>
      <el-form-item class="inline-block" label="会员手机号：" label-width="100px">
        <el-input v-model="phone" placeholder="请输入手机号" style="width: 130px"></el-input>
      </el-form-item>
      <el-form-item class="inline-block" label="订单类型：" label-width="95px">
        <el-select v-model="type" style="width: 130px">
            <el-option value="" label="不限"></el-option>
            <el-option :value="0" label="扫码支付"></el-option>
            <el-option :value="1" label="会员充值"></el-option>
            <el-option :value="2" label="会员开卡"></el-option>
            <el-option :value="3" label="付费次卡"></el-option>
            <el-option :value="4" label="会员礼包支付"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="inline-block" label="选择员工：" label-width="95px" v-if="$store.getters.roles.indexOf('admin') != -1">
        <el-select v-model="staffId" style="width: 130px">
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

      <el-table-column label="订单类型">
        <template slot-scope="scope">
          <span v-if="scope.row.type === '0'">扫码支付</span>
          <span v-else-if="scope.row.type === '1'">会员充值</span>
          <span v-else-if="scope.row.type === '2'">会员开卡</span>
          <span v-else-if="scope.row.type === '3'">付费次卡</span>
          <span v-else-if="scope.row.type === '4'">会员礼包支付</span>
        </template>
      </el-table-column>

      <el-table-column label="订单状态">
        <template slot-scope="scope">
          <span v-if="scope.row.orderStatus == 0">未支付</span>
          <span v-else-if="scope.row.orderStatus == 1">支付成功</span>
          <span v-else-if="scope.row.orderStatus == 2">处理中</span>
          <span v-else-if="scope.row.orderStatus == 3">过期</span>
          <span v-else-if="scope.row.orderStatus == 4">失败</span>
          <span v-else-if="scope.row.orderStatus == 5">部分退款</span>
          <span v-else-if="scope.row.orderStatus == 6">全额退款</span>
        </template>
      </el-table-column>

      <el-table-column label="消费时间" prop="consumptionTime"></el-table-column>

      <el-table-column label="消费门店" prop="consumptionStore"></el-table-column>

      <el-table-column label="收银工号" prop="jobNumber"></el-table-column>

      <el-table-column label="支付方式">
        <template slot-scope="scope">
          <span v-if="scope.row.payWay == 1">支付宝</span>
          <span v-else-if="scope.row.payWay == 2">微信</span>
          <span v-else-if="scope.row.payWay == 3">余额</span>
          <span v-else-if="scope.row.payWay == 7">混合支付</span>
        </template>
      </el-table-column>

      <el-table-column label="订单原价">
        <template slot-scope="scope">
          <span>{{ scope.row.originalPrice }}</span>
        </template>
      </el-table-column>

      <el-table-column label="实付金额">
        <template slot-scope="scope">
          <span>{{ scope.row.actualPrice }}</span>
        </template>
      </el-table-column>

      <el-table-column label="满减抵扣">
        <template slot-scope="scope">
          <span>{{ scope.row.fullReductionDeduction }}</span>
        </template>
      </el-table-column>

      <el-table-column label="优惠券抵扣">
        <template slot-scope="scope">
          <span>{{ scope.row.couponDeduction }}</span>
        </template>
      </el-table-column>

      <el-table-column label="积分抵扣">
        <template slot-scope="scope">
          <span>{{ scope.row.integralDeduction }}</span>
        </template>
      </el-table-column>

      <el-table-column label="获得积分">
        <template slot-scope="scope">
          <span>{{ scope.row.integralGet }}</span>
        </template>
      </el-table-column>

      <el-table-column label="手续费">
        <template slot-scope="scope">
          <span>{{ scope.row.poundage }}</span>
        </template>
      </el-table-column>

      <el-table-column label="商家所得">
        <template slot-scope="scope">
          <span>{{ scope.row.shopMoney }}</span>
        </template>
      </el-table-column>

      <el-table-column label="会员卡号">
        <template slot-scope="scope">
          <span>{{ scope.row.card }}</span>
        </template>
      </el-table-column>

      <el-table-column label="会员姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" min-width="170px" fixed="right">
        <template slot-scope="scope">
          <el-button class="table_operate" type="primary" @click="handlePrintDevOrder(scope.row)">本地打印</el-button>
          <el-button class="table_operate" type="primary" @click="handlePrintYunOrder(scope.row)">云打印</el-button>
        </template>
      </el-table-column>

    </el-table>
    <!-- 分页 -->
    <el-row>
      <el-col :span="6" style="font-size: 13px;line-height: 32px;">
        总收款金额：{{ businessData }} 元
      </el-col>
      <el-col :span="18">
        <el-pagination @current-change="handleOnPageChange" :current-page="page" layout="total, prev, pager, next, jumper" :total="total" :page-size="pageSize"></el-pagination>
      </el-col>
    </el-row>
    <!-- 本地打印 -->
    <el-dialog title="打印订单" :visible.sync="showDialog" :show-close="false" width="300px" center @opened="handleOpenDialog">
      <div id="orderContent" ref="orderContent">
        <div class="print-title">{{ printData.shopName }}</div>
        <div class="print-list">交易状态：{{ printData.payStatus }}</div>
        <div class="print-list">付款渠道：{{ printData.payWay }}</div>
        <div class="print-list">收银员：{{ printData.staff }}</div>
        <div class="print-list">交易时间：{{ printData.payDate }}</div>
        <div class="print-list">打印时间：{{ printData.printDate }}</div>
        <div class="print-list print-list-border">交易编号：{{ printData.orderNo }}</div>
        <div class="print-list">消费总金额：{{ printData.totalFee }}</div>
        <div class="print-list">优惠金额：{{ printData.reduceFee }}</div>
        <div class="print-list print-list-border">实收金额：{{ printData.orderFee }}</div>
        <div class="print-list print-list-border">签名：</div>
      </div>
    </el-dialog>
  </div>
</template>
<style scoped>
.print-title {
  text-align: center;
  padding-bottom: 10px;
  border-bottom: 2px dashed #606266;
  /* font-weight: bold; */
  font-size: 18px;
}
.print-list {
  font-size: 14px;
  margin:10px 0;
}
.print-list-border {
  padding-bottom: 10px;
  border-bottom: 2px dashed #606266;
}
</style>


<script>
  import { getStaffList } from '@/api/staffManage';
  import { getOperationSummary, printOrder } from '@/api/ddmanage';
  import { getNowFormatDate, parseTime } from '@/utils';
  import DatePicker from '@/components/DatePicker';

  import Print from './printarea.js';

  export default {
    name: 'gathering_views',
    components: { DatePicker },
    data() {
      return {
        formData: [getNowFormatDate(), getNowFormatDate()],
        staffList: [{ id: '', name: "不限"}],
        staffId: this.$store.getters.jobNumber == 100000 ? '' : (this.$store.state.user.voiceType == 0 ? this.$store.getters.staffId : ''),
        type: '',
        phone: '',
        tableData: [],
        businessData: 0,
        page: 1,
        total: 0,
        pageSize: 10,
        showDialog: false,
        printData: {
          shopName: "",
          payStatus: "",
          payWay: "",
          staff: "",
          orderNo: "",
          payDate: "",
          printDate: ""
        }
      }
    },
    created() {
      if (this.$store.getters.jobNumber === 100000) {
        getStaffList({}).then(res => {
          res.tableData.rows.forEach((item, i) => {
            this.staffList.push({id: item.id, name: item.staffName});
          });
        })
      }
      this.handleGetTableData();
    },
    methods: {
      handlePrintYunOrder(row) {
        let data = {
          orderNo: row.orderNo,
          payDate: row.consumptionTime,
          payWay: row.payWay == 1 ? "支付宝支付" : (row.payWay == 2 ? "微信支付" : (row.payWay == 3 ? "余额支付" : "混合支付")),
          staff: row.jobNumber,
          shopName: row.consumptionStore,
          orderFee: parseFloat(row.originalPrice).toFixed(2),
          reduceFee: (parseFloat(row.fullReductionDeduction) + parseFloat(row.couponDeduction) + parseFloat(row.integralDeduction)).toFixed(2),
          totalFee: parseFloat(row.actualPrice).toFixed(2),
        }
        switch (parseFloat(row.orderStatus)) {
          case 0:
            data.payStatus = "未支付";
            break;
          case 1:
            data.payStatus = "支付成功";
            break;
          case 2:
            data.payStatus = "处理中";
            break;
          case 3:
            data.payStatus = "过期";
            break;
          case 4:
            data.payStatus = "失败";
            break;
          case 5:
            data.payStatus = "部分退款";
            break;
          case 6:
            data.payStatus = "全额退款";
            break;
          default:
            break;
        }
        printOrder(data).then(res => {
          this.$message({ type: "success", message: "打印成功" })
        })
      },
      handlePrintDevOrder(row) {
        this.printData = {
          orderNo: row.orderNo,
          payDate: row.consumptionTime,
          printDate: parseTime(new Date()),
          payWay: row.payWay == 1 ? "支付宝支付" : (row.payWay == 2 ? "微信支付" : (row.payWay == 3 ? "余额支付" : "混合支付")),
          staff: row.jobNumber + "（" + (row.jobNumber == 100000 ? "老板" : row.jobName) + "）",
          shopName: row.consumptionStore,
          orderFee: parseFloat(row.originalPrice).toFixed(2),
          reduceFee: (parseFloat(row.fullReductionDeduction) + parseFloat(row.couponDeduction) + parseFloat(row.integralDeduction)).toFixed(2),
          totalFee: parseFloat(row.actualPrice).toFixed(2),
        }
        switch (parseFloat(row.orderStatus)) {
          case 0:
            this.printData.payStatus = "未支付";
            break;
          case 1:
            this.printData.payStatus = "支付成功";
            break;
          case 2:
            this.printData.payStatus = "处理中";
            break;
          case 3:
            this.printData.payStatus = "过期";
            break;
          case 4:
            this.printData.payStatus = "失败";
            break;
          case 5:
            this.printData.payStatus = "部分退款";
            break;
          case 6:
            this.printData.payStatus = "全额退款";
            break;
          default:
            break;
        }
        this.showDialog = true;
      },
      handleOpenDialog() {
        let this_ = this;
        this_.$nextTick(() => {
          new Print({
            ids: "orderContent",
            endCallback() {
              this_.showDialog = false;
            }
          });
        })
      },
      handleOnPageChange(page) {
        this.page = page;
        this.handleGetTableData();
      },
      handleClearForm() {
        this.formData = [];
        this.staffId = this.$store.getters.jobNumber == 100000 ? '' : (this.$store.state.user.voiceType == 0 ? this.$store.getters.staffId : '');
        this.phone = '';
        this.type = '';
      },
      handleSubmitForm() {
        this.page = 1;
        this.handleGetTableData();
      },
      handleGetTableData() {
        getOperationSummary({ dateFormat: this.formData[0], endTime: this.formData[1], currentPage: this.page, type: this.type, staffId: this.staffId, phone: this.phone }).then(response => {
          this.businessData = response.businessData ? response.businessData : 0;
          this.tableData = response.tableData.rows;
          this.total = response.tableData.totalSize;
          this.pageSize = response.tableData.pageSize;
        })
      }
    }
  }
</script>