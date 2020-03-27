<template>
  <div id="pick-order" class="main-content">
    <div class="operate">
      <el-form :model="pickDataForm" ref="pickListForm" label-width="100px">
        <el-form-item class="inline-block" label="订单号：" label-width="80px">
          <el-input
            placeholder="请输入订单号"
            auto-complete="off"
            class="pick-code"
            v-model.trim="pickDataForm.orderCode"
            @keyup.native.enter="getPickOrderData"
            clearable @clear="getPickOrderData"
          ></el-input>
        </el-form-item>
        <el-form-item class="inline-block" label="订单状态：" v-if=" $store.getters.roleId != 1">
          <el-select v-model="pickDataForm.status" placeholder="请选择订单状态">
            <el-option value label="全部"></el-option>
            <el-option :value="2" label="待提货"></el-option>
            <el-option :value="4" label="已提货"></el-option>
            <el-option :value="5" label="已退款"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="inline-block subscribe" label="订单类型：">
          <el-select v-model="pickDataForm.type" placeholder="请选择订单类型">
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
    <el-table :data="pickTableData" stripe style="width: 100%">
      <el-table-column prop="payDate" label="下单时间"></el-table-column>
      <el-table-column prop="orderNo" label="订单号"></el-table-column>
      <el-table-column prop="consignee" label="购买者"></el-table-column>
      <el-table-column prop="pickupTime" label="到店提货时间" v-if=" $store.getters.roleId != 1"></el-table-column>
      <el-table-column prop="status" label="状态" v-if=" $store.getters.roleId != 1">
        <template slot-scope="scope">
          <span>{{ statusType[scope.row.status] }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="orderType" label="订单类型">
        <template slot-scope="scope">
          <span>{{ orderType[scope.row.orderType] }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="expressFee" label="运费" v-if=" $store.getters.roleId != 1">
        <template slot-scope="scope">
          <span>￥{{ scope.row.expressFee }}</span>
        </template>
      </el-table-column>
      <el-table-column v-else prop="tableNum" label="桌号"></el-table-column>

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
          <el-button class="table_operate" @click="handleCheckGoods(scope.row)" type="primary">查看</el-button>
          <template v-if=" $store.getters.roleId != 1">
            <el-button class="table_operate" v-if="scope.row.status === 2 && scope.row.orderType !== 7" @click="handlePickUpGoods(scope.row)" type="primary">提货</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handlePickCurrentChange"
      :current-page="currentPage"
      :page-size="pageSize"
      layout="total, prev, pager, next, jumper"
      :total="tableTotal"
    ></el-pagination>
    <el-dialog title="查看订单" :visible.sync="detailVisible" width="850px" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-table :data="orderData" border :show-header="false" style="margin-bottom: 15px;">
        <el-table-column prop="key" label="key" width="200">
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
          <template slot-scope="scope" v-if="scope.row.stockContext">
            <p style="margin: 0;" v-for="(item, index) in JSON.parse(scope.row.stockContext)" :key="index"> {{ item.key + ':' + item.val }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="stockPicture" label="商品图片" width="140px">
          <template slot-scope="scope">
            <img v-if="scope.row.stockPicture" :src="scope.row.stockPicture" width="120" height="100">
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
    // 获取自提订单的表格
    this.getPickOrderData();
  },
  data() {
    return {
      pickDataForm: {
        orderCode: "",
        status: "",
        type: ""
      },
      pickTableData: [],
      currentPage: 1,
      pageSize: 10,
      tableTotal: 0,
      detailVisible: false,
      detailData: [],
      orderData: [],
      statusType: {
        2: "待提货",
        4: "已提货",
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
    // 获取自提订单的表格
    getPickOrderData() {
      let param = {
        pageSize: this.pageSize,
        currentPage: this.currentPage,
        deliveryType: 2
      };
      if (this.pickDataForm.orderCode) {
        param.orderNo = this.pickDataForm.orderCode;
      }
      if (this.pickDataForm.status) {
        param.orderStatus = this.pickDataForm.status;
      }
      if (this.pickDataForm.type || this.pickDataForm.type === 0) {
        param.orderType = this.pickDataForm.type;
      }
      getOrderByPage(param).then(res => {
        if (res.tableData.records.length == 0 && this.currentPage - 1 > 0) {
          this.currentPage--;
          this.getPickOrderData();
        } else {
          this.pickTableData = res.tableData.records;
          this.tableTotal = res.tableData.total;
          this.pageSize = res.tableData.size;
        }
      });
    },
    // 查询自提订单
    handleSearchForm() {
      this.getPickOrderData();
    },
    // 表格操作-提货
    handlePickUpGoods(row) {
      this.$confirm(`确定提取吗?`, "提示", {
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
            this.getPickOrderData(); // 获取列表
          }
        });
      });
    },
    // 表格分页
    handlePickCurrentChange(val) {
      this.currentPage = val;
      this.getPickOrderData();
    },
    // 查看
    handleCheckGoods(row) {
      this.detailVisible = true;
      getOrderById({
        id: row.id
      }).then(res => {
        this.orderData = [
          {
            key: "订单号",
            value: res.tableData.outTradeNo
          },
          {
            key: "姓名",
            value: res.tableData.consignee
          },
          {
            key: "预留电话",
            value: res.tableData.consigneeCall
          },
          {
            key: "买家留言",
            value: res.tableData.buyermsg
          },
          {
            key: "到店自提时间",
            value: res.tableData.pickupTime
          },
          {
            key: "订单类型",
            value: this.orderType[res.tableData.orderType]
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
            key: "支付数额",
            value: res.tableData.totalPrice
          },
          {
            key: "实际支付数额",
            value: res.tableData.payPrice
          },
          {
            key: "确定提货时间",
            value: res.tableData.deliveryDate
          },
          {
            key: "状态",
            value: this.statusType[res.tableData.status]
          }
        ];
        if (this.$store.getters.roleId == 1) {
          this.orderData = this.orderData.filter(item => {
            return item.key != "状态" && item.key != "确定提货时间" && item.key != "运费" && item.key != "到店自提时间";
          })
        }
        this.detailData = res.businessData;
      });
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss">
#pick-order {
  .el-dialog__body {
    overflow-y: auto;
    height: 620px;
  }
  .operate .pick-code.el-input:not(.is-in-pagination) {
    width: 200px;
  }
}
</style>