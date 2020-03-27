<template>
  <div id="express-order" class="main-content">
    <div>
      <el-form :model="formData" ref="pickListForm">
        <el-form-item class="inline-block" label="订单号：" label-width="80px">
          <el-input placeholder="请输入订单号" v-model.trim="formData.orderNo" maxlength="20" style="width: 200px;"></el-input>
        </el-form-item>
        <el-form-item class="inline-block" label="订单状态：" label-width="100px">
          <el-select v-model="formData.orderStatus">
            <el-option value label="全部"></el-option>
            <el-option :value="3" label="已发货"></el-option>
            <el-option :value="2" label="未发货"></el-option>
            <el-option :value="4" label="已收货"></el-option>
            <el-option :value="5" label="已退款"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="inline-block" label="订单类型：" label-width="100px">
          <el-select v-model="formData.orderType">
            <el-option value label="全部"></el-option>
            <el-option :value="0" label="支付订单"></el-option>
            <el-option :value="1" label="积分订单"></el-option>
            <el-option :value="2" label="秒杀订单"></el-option>
            <el-option :value="4" label="特价订单"></el-option>
            <el-option :value="5" label="抽奖订单"></el-option>
            <el-option :value="6" label="拼团订单"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="inline-block" label-width="0">
          <el-button type="primary" @click="handleSearchForm()">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" style="margin-bottom: 15px;">
      <el-table-column type="index" label="序号" width="80"></el-table-column>

      <el-table-column prop="payDate" label="时间"></el-table-column>

      <el-table-column prop="orderNo" label="订单号"></el-table-column>

      <el-table-column prop="consignee" label="购买者"></el-table-column>

      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <span>{{ statusType[scope.row.status] }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="orderType" label="订单类型">
        <template slot-scope="scope">
          <span>{{ orderType[scope.row.orderType] }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="expressFee" label="运费">
        <template slot-scope="scope">
          <span>￥{{ scope.row.expressFee }}</span>
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

      <el-table-column prop="buyermsg" label="用户备注"></el-table-column>

      <el-table-column label="操作" min-width="145px" fixed="right">
        <template slot-scope="scope">
          <el-button class="table_operate" @click="handleOpenDialog(scope.row.id, 1)" type="primary">查看</el-button>
          <el-button class="table_operate" v-if="scope.row.status === 2" @click="handleOpenDialog(scope.row.id, 2)" type="primary">发货</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @current-change="handleOnPageChange"
      :current-page="formData.currentPage"
      :page-size="pageSize"
      layout="total, prev, pager, next, jumper"
      :total="tableTotal"
    ></el-pagination>
    <!-- 弹框 -->
    <el-dialog :title="type == 1 ? '订单详情' : '物流信息'" :visible.sync="showDialog" :width="type == 1 ? '700px' : '500px'" :close-on-click-modal="false" :close-on-press-escape="false">
      <!-- 发货 -->
      <express-form v-if="showDialog && type == 2" :id="id" ref="ExpressForm"></express-form>
      <!-- 查看 -->
      <express-order-info v-if="showDialog && type == 1" :id="id" ref="ExpressOrderInfo"></express-order-info>
      <div slot="footer">
        <el-button v-if="type == 2" @click="showDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleOnConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getOrderByPage } from "@/api/marketOrder";
import ExpressForm from "../components/expressForm";
import ExpressOrderInfo from "../components/expressOrderInfo";

export default {
  components: { ExpressForm, ExpressOrderInfo },
  data() {
    return {
      formData: {
        orderNo: "",
        orderStatus: "",
        orderType: "",
        currentPage: 1,
        deliveryType: 1
      },
      tableData: [],
      pageSize: 10,
      tableTotal: 0,
      id: "",
      type: "",
      showDialog: false,
      statusType: {
        2: "未发货",
        3: "已发货",
        4: "已收货",
        5: "已退款"
      },
      orderType: {
        0: "支付订单",
        1: "积分订单",
        2: "秒杀订单",
        4: "特价订单",
        5: "抽奖订单",
        6: "拼团订单"
      },
      payWayType: {
        1: "支付宝",
        2: "微信",
        3: "账户余额",
        4: "银行卡",
        5: "现金"
      }
    };
  },
  created() {
    this.handleGetTableData();
  },
  methods: {
    handleOnConfirm() {
      if (this.type == 1) {
        this.showDialog = false;
      } else {
        this.$refs["ExpressForm"].handleSubmitForm();
      }
    },
    handleGetTableData() {
      getOrderByPage(this.formData).then(res => {
        if (res.tableData.records.length == 0 && this.formData.currentPage - 1 > 0) {
          this.formData.currentPage--;
          this.handleGetTableData();
        } else {
          this.tableData = res.tableData.records;
          this.tableTotal = res.tableData.total;
          this.pageSize = res.tableData.size;
        }
      });
    },
    handleSearchForm() {
      this.formData.currentPage = 1;
      this.handleGetTableData();
    },
    handleOnPageChange(val) {
      this.formData.currentPage = val;
      this.handleGetTableData();
    },
    handleOpenDialog(id, type) {
      this.id = id;
      this.type = type;
      this.showDialog = true;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
#express-order {
  .el-dialog__body {
    overflow-y: auto;
    max-height: 620px;
  }
}
</style>