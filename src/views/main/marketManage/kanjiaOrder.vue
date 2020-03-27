<template>
  <div id="bargain" class="main-content">
    <div class="operate">
      <el-form :model="bargainForm" ref="pickListForm">
        <el-form-item class="inline-block" label="订单号：" label-width="80px">
          <el-input
            placeholder="请输入订单号"
            class="bargain-code"
            auto-complete="off"
            v-model.trim="bargainForm.orderNo"
          ></el-input>
        </el-form-item>
        <el-form-item class="inline-block" label="订单状态：" label-width="100px">
          <el-select v-model="bargainForm.verifyStatus" placeholder="请选择订单状态">
            <el-option value label="全部"></el-option>
            <el-option :value="0" label="待核销"></el-option>
            <el-option :value="1" label="已核销"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="inline-block">
          <el-button type="primary" @click="handleSearchForm()">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="bargainTableData" stripe style="width: 100%">
      <el-table-column prop="payDate" label="下单时间" min-width="150px"></el-table-column>
      <el-table-column prop="orderNo" label="订单号" min-width="270px"></el-table-column>
      <el-table-column prop="consigneeCall" label="购买者手机号" min-width="110px"></el-table-column>
      <el-table-column prop="verifyTime" label="核销时间" min-width="150px">
        <template slot-scope="scope">
          <span v-if="scope.row.verifyTime">{{ scope.row.verifyTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="verifyStatus" label="核销状态">
        <template slot-scope="scope">
          <span>{{ statusType[scope.row.verifyStatus] }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="totalPrice" label="订单金额">
        <template slot-scope="scope">
          <span>￥{{ scope.row.totalPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="payPrice" label="实际支付金额">
        <template slot-scope="scope">
          <span>￥{{ scope.row.payPrice }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleBargainCurrentChange"
      :current-page="currentPage"
      :page-size="pageSize"
      layout="total, prev, pager, next, jumper"
      :total="tableTotal"
    ></el-pagination>
  </div>
</template>

<script>
import { getOrderByPage } from "@/api/marketOrder";
import { parseTime } from "@/utils";

export default {
  mounted() {
    // 获取订单的表格
    this.getPickOrderData();
  },
  data() {
    return {
      bargainTableData: [],
      currentPage: 1,
      pageSize: 10,
      tableTotal: 0,
      bargainForm: {
        orderNo: "",
        verifyStatus: ""
      },
      statusType: {
        0: "待核销",
        1: "已核销"
      }
    };
  },
  methods: {
    // 获取订单的表格
    getPickOrderData() {
      let param = {
        currentPage: this.currentPage,
        deliveryType: 2,
        orderType: 7
      };
      if (this.bargainForm.orderNo) {
        param.orderNo = this.bargainForm.orderNo;
      }
      if (this.bargainForm.verifyStatus !== "") {
        param.verifyStatus = this.bargainForm.verifyStatus;
      }
      getOrderByPage(param).then(res => {
        if (res.success) {
          this.bargainTableData = res.tableData.records;
          this.tableTotal = res.tableData.total;
        } else {
          this.bargainTableData = [];
          this.tableTotal = 0;
        }
      });
    },
    handleSearchForm() {
      this.getPickOrderData();
    },
    // 表格分页
    handleBargainCurrentChange(val) {
      this.currentPage = val;
      this.getPickOrderData();
    }
  }
};
</script>