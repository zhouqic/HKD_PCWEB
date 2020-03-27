<template>
  <div id="dispath-order" class="main-content">
    <div class="operate">
      <el-form :model="dispatchDataForm" ref="pickListForm">
        <el-form-item class="inline-block" label="订单号：" label-width="80px">
          <el-input
            placeholder="请输入订单号"
            auto-complete="off"
            v-model.trim="dispatchDataForm.orderCode"
            class="dispath-code"
            @keyup.native.enter="getDispathList"
            clearable @clear="getDispathList"
          ></el-input>
        </el-form-item>
        <el-form-item class="inline-block" label="订单状态：" label-width="100px">
          <el-select v-model="dispatchDataForm.status" placeholder="请选择订单状态">
            <el-option value label="全部"></el-option>
            <el-option :value="2" label="待配送"></el-option>
            <el-option :value="4" label="已配送"></el-option>
            <el-option :value="5" label="已退款"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="inline-block subscribe" label="订单类型：" label-width="100px">
          <el-select v-model="dispatchDataForm.type" placeholder="请选择订单类型">
            <el-option value label="全部"></el-option>
            <el-option :value="0" label="支付订单"></el-option>
            <el-option :value="1" label="积分订单"></el-option>
            <el-option :value="2" label="秒杀订单"></el-option>
            <el-option :value="4" label="特价订单"></el-option>
            <el-option :value="5" label="抽奖订单"></el-option>
            <el-option :value="6" label="拼团订单"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="inline-block">
          <el-button type="primary" @click="handleSearchForm()">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="dispatchTableData" stripe style="width: 100%">
      <el-table-column prop="payDate" label="时间" min-width="150px"></el-table-column>
      <el-table-column prop="orderNo" label="订单号" min-width="270px"></el-table-column>
      <el-table-column prop="consignee" label="购买者"></el-table-column>
      <el-table-column prop="consigneeAddress" label="配送地址" min-width="270px"></el-table-column>
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
      <el-table-column prop="buyermsg" label="用户备注"></el-table-column>
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
      <el-table-column prop="payPrice" label="实际支付金额" min-width="120px">
        <template slot-scope="scope">
          <span>￥{{ scope.row.payPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="150px" fixed="right">
        <template slot-scope="scope">
          <el-button class="table_operate" @click="handleCheckGoods(scope.row)" type="primary">查看</el-button>
          <el-button  class="table_operate"
            v-if="scope.row.status === 2"
            @click="handleDispatch(scope.row)"
            type="primary"
          >配送</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleDispatchCurrentChange"
      :current-page="currentPage"
      :page-size="pageSize"
      layout="total, prev, pager, next, jumper"
      :total="tableTotal"
    ></el-pagination>
    <el-dialog title="查看订单" :visible.sync="detailVisible" class="order-dialog" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-table
        :data="orderData"
        border
        style="width: 100%"
        :show-header="false"
        class="order-table"
      >
        <el-table-column prop="key" label="key">
          <template slot-scope="scope">
            <span style="font-weight: 900;">{{ scope.row.key }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="value" label="value"></el-table-column>
      </el-table>
      <el-table :data="detailData" stripe style="width: 100%">
        <el-table-column type="index" label="编号" width="50px"></el-table-column>
        <el-table-column prop="product" label="商品"></el-table-column>
        <el-table-column prop="stockContext" label="规格" width="200px">
          <template slot-scope="scope">
            <p style="margin: 0;" v-for="(item, index) in JSON.parse(scope.row.stockContext)" :key="index"> {{ item.key + ':' + item.val }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="stockPicture" label="商品图片" width="140px">
          <template slot-scope="scope">
            <img :src="scope.row.stockPicture" class="goods-picture">
          </template>
        </el-table-column>
        <el-table-column prop="num" label="数量"></el-table-column>
        <el-table-column prop="price" label="价格">
          <template slot-scope="scope">
            <span>￥{{ scope.row.price }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="detailVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getOrderByPage,
  updateOrderById,
  getOrderById
} from "@/api/marketOrder";

export default {
  mounted() {
    // 查询列表
    this.getDispathList();
  },
  data() {
    return {
      dispatchDataForm: {
        orderCode: "",
        status: "",
        type: ""
      },
      dispatchTableData: [],
      currentPage: 1,
      pageSize: 10,
      tableTotal: 0,
      detailVisible: false,
      detailData: [],
      orderData: [],
      statusType: {
        2: "待配送",
        4: "已配送",
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
  methods: {
    // 查询列表
    getDispathList() {
      let param = {
        pageSize: this.pageSize,
        currentPage: this.currentPage,
        deliveryType: 3
      };
      if (this.dispatchDataForm.orderCode) {
        param.orderNo = this.dispatchDataForm.orderCode;
      }
      if (this.dispatchDataForm.status) {
        param.orderStatus = this.dispatchDataForm.status;
      }
      if (this.dispatchDataForm.type || this.dispatchDataForm.type === 0) {
        param.orderType = this.dispatchDataForm.type;
      }
      getOrderByPage(param).then(res => {
        if (res.tableData.records.length == 0 && this.currentPage - 1 > 0) {
          this.currentPage--;
          this.getDispathList();
        } else {
          this.dispatchTableData = res.tableData.records;
          this.tableTotal = res.tableData.total;
          this.pageSize = res.tableData.size;
        }
        
      });
    },
    // 查询配送订单
    handleSearchForm() {
      this.getDispathList();
    },
    // 表格操作-配送
    handleDispatch(row) {
      this.$confirm(`确定配送吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let option = {
          id: row.id
        };
        updateOrderById(option).then(res => {
          if (res.success) {
            this.$message({
              type: "success",
              message: "提取成功"
            });
            this.getDispathList(); // 获取列表
          }
        });
      }).catch(() => {});
    },
    // 表格分页
    handleDispatchCurrentChange(val) {
      this.currentPage = val;
      this.getDispathList();
    },
    // 查看
    handleCheckGoods(row) {
      this.detailVisible = true;
      getOrderById({
        id: row.id
      }).then(res => {
        if (res.success) {
          this.orderData = [
            {
              key: "订单号",
              value: res.tableData.outTradeNo
            },
            {
              key: "收货人",
              value: res.tableData.consignee
            },
            {
              key: "收货电话",
              value: res.tableData.consigneeCall
            },
            {
              key: "买家留言",
              value: res.tableData.buyermsg
            },
            {
              key: "配送地址",
              value: res.tableData.consigneeAddress
            },
            {
              key: "配送时间",
              value: res.tableData.deliveryDate
            },
            {
              key: "运费",
              value: res.tableData.expressFee
            },
            {
              key: "支付方式",
              value: this.payWayType[res.tableData.payWay]
            },
            {
              key: "订单类型",
              value: this.orderType[res.tableData.orderType]
            },
            {
              key: "支付数额",
              value: res.tableData.totalPrice
            },
            {
              key: "实际支付数额",
              value: res.tableData.payPrice
            },
            {
              key: "状态",
              value: this.statusType[res.tableData.status]
            }
          ];
          this.detailData = res.businessData;
        } else {
          this.$message({
            type: "error",
            message: res.msg
          });
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
#dispath-order {
  .operate .dispath-code.el-input:not(.is-in-pagination) {
    width: 200px;
  }
  .order-dialog .el-dialog__body {
    overflow-y: auto;
    height: 620px;
  }
  .goods-picture{
    width: 120px;
    height: 100px;
  }
  .order-table {
    margin-bottom: 15px;
  }
}
</style>
