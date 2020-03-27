<template>
  <panel-group title="消费记录" :width="width" :style="{float: position}">
    <template slot="tools">
      <span style="color:#288ce2;font-size:12px;cursor:pointer;" @click="showDialog=true">更多</span>
    </template>
    <template slot="content">
      <el-table :data="tableData" height="300" style="margin-bottom:15px;">
        <el-table-column label="订单号" prop="orderNo"></el-table-column>

        <el-table-column label="消费时间">
          <template slot-scope="scope">
            <span>{{ scope.row.endTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
          </template>
        </el-table-column>

        <el-table-column label="订单金额">
          <template slot-scope="scope">
            <span>{{ parseFloat(scope.row.orderFee).toFixed(2) }}</span>
          </template>
        </el-table-column>
        
        <el-table-column label="支付金额">
          <template slot-scope="scope">
            <span>{{ parseFloat(scope.row.totalFee).toFixed(2) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="优惠金额" align="center">
          <template slot-scope="scope">
            <span>{{ (parseFloat(scope.row.orderFee) - parseFloat(scope.row.totalFee)).toFixed(2) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="支付类型" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.payWay == 1">支付宝支付</span>
            <span v-else-if="scope.row.payWay == 2">微信支付</span>
            <span v-else-if="scope.row.payWay == 3">余额支付</span>
            <span v-else-if="scope.row.payWay == 7">混合支付</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination @current-change="handleOnPageChange" :current-page="page" layout="total, prev, pager, next, jumper" :total="total" :page-size="10"></el-pagination>
      <!-- 更多 -->
      <el-dialog title="消费记录" :visible.sync="showDialog" width="700px" :close-on-click-modal="false" :close-on-press-escape="false" @open="handleGetDTableData" @closed="handleCloseDialog">
        <!-- 筛选 -->
        <el-form label-width="80px" label-position="left">
          <el-form-item class="inline-block" label="查询日期:">
            <date-picker type="daterange" :value.sync="dateRange" style="width:275px"></date-picker>
          </el-form-item>
          <el-form-item class="inline-block" label="支付类型:">
            <el-select v-model="payType" style="width:120px">
              <el-option :value="1" label="支付宝"></el-option>
              <el-option :value="2" label="微信"></el-option>
              <el-option :value="3" label="余额"></el-option>
              <el-option :value="7" label="混合支付"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="inline-block" label-width="0px">
            <el-button type="primary" @click="dPage=1;handleGetDTableData()">查询</el-button>
          </el-form-item>
        </el-form>
        <!--  -->
        <el-table :data="dTableData" style="margin-bottom:15px;">
          <el-table-column label="订单号" prop="orderNo"></el-table-column>

          <el-table-column label="消费时间">
            <template slot-scope="scope">
              <span>{{ scope.row.endTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
            </template>
          </el-table-column>

          <el-table-column label="订单金额">
            <template slot-scope="scope">
              <span>{{ parseFloat(scope.row.orderFee).toFixed(2) }}</span>
            </template>
          </el-table-column>
          
          <el-table-column label="支付金额">
            <template slot-scope="scope">
              <span>{{ parseFloat(scope.row.totalFee).toFixed(2) }}</span>
            </template>
          </el-table-column>

          <el-table-column label="优惠金额" align="center">
            <template slot-scope="scope">
              <span>{{ (parseFloat(scope.row.orderFee) - parseFloat(scope.row.totalFee)).toFixed(2) }}</span>
            </template>
          </el-table-column>

          <el-table-column label="支付类型" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.payWay == 1">支付宝支付</span>
              <span v-else-if="scope.row.payWay == 2">微信支付</span>
              <span v-else-if="scope.row.payWay == 3">余额支付</span>
              <span v-else-if="scope.row.payWay == 7">混合支付</span>
            </template>
          </el-table-column>
        </el-table>
        <!--  -->
        <el-pagination @current-change="handleOnPageChange" :current-page="dPage" layout="total, prev, pager, next, jumper" :total="dTotal" :page-size="10"></el-pagination>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleCloseDialog">关闭</el-button>
        </span>
      </el-dialog>
    </template>
  </panel-group>
</template>

<script>
import panelGroup from "./panelGroup";
import DatePicker from "@/components/DatePicker";
import { findMallOrderByPage } from "@/api/face";
export default {
  props: ["id", "width", "position"],
  components: { panelGroup, DatePicker },
  data() {
    return {
      page: 1,
      total: 0,
      tableData: [],
      dPage: 1,
      dTotal: 0,
      dTableData: [],
      showDialog: false,
      dateRange: [],
      payType: '',
    };
  },
  watch: {
    id(val) {
      this.handleGetTableData();
    }
  },
  created() {
    this.handleGetTableData();
  },
  methods: {
    handleOnPageChange(page) {
      this.page = page;
      this.handleGetCiShuData();
    },
    handleGetTableData() {
      if (this.id) {
        findMallOrderByPage({ id: this.id, currentPage: this.page, type: 0 }).then(res => {
          this.tableData = res.tableData.records;
          this.total = res.tableData.total;
        });
      }
    },
    handleGetDTableData() {
      findMallOrderByPage({ id: this.id, pageNo: this.dPage, type: 0, payType: this.payType, beginTime: this.dateRange[0], endTime: this.dateRange[1] }).then(res => {
          this.dTableData = res.tableData.records;
          this.dTotal = res.tableData.total;
        }
      );
    },
    handleCloseDialog() {
      this.dPage = 1;
      this.dTotal = 0;
      this.dTableData = [];
      this.payType = '';
      this.dateRange = [];
      this.showDialog = false;
    }
  }
};
</script>