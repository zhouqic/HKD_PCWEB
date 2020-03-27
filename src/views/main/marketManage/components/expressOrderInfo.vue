<template>
  <div>
    <el-table :data="orderData" border :show-header="false" style="width: 100%">
      <el-table-column prop="key" label="key" width="200">
        <template slot-scope="scope">
          <b>{{ scope.row.key }}</B>
        </template>
      </el-table-column>

      <el-table-column prop="value" label="value"></el-table-column>
    </el-table>
    <el-table :data="detailData" border>
      <el-table-column type="index" label="编号" width="50px"></el-table-column>

      <el-table-column prop="product" label="商品"></el-table-column>

      <el-table-column prop="stockContext" label="规格">
        <template slot-scope="scope">
          <p style="margin: 0;" v-for="(item, index) in JSON.parse(scope.row.stockContext)" :key="index"> {{ item.key + ':' + item.val }}</p>
        </template>
      </el-table-column>

      <el-table-column prop="stockPicture" label="商品图片">
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
  </div>
</template>
<script>
import { getOrderById } from "@/api/marketOrder";

export default {
  props: ["id"],
  data() {
    return {
      orderData: [],
      detailData: []
    }
  },
  created() {
    getOrderById({ id: this.id }).then(res => {
      this.orderData = [
        {
          key: "订单号",
          value: res.tableData.outTradeNo
        },
        {
          key: "收件人",
          value: res.tableData.consignee
        },
        {
          key: "收件电话",
          value: res.tableData.consigneeCall
        },
        {
          key: "收件地址",
          value: res.tableData.consigneeAddress
        },
        {
          key: "买家留言",
          value: res.tableData.buyermsg
        },
        {
          key: "物流公司",
          value: res.tableData.expressInc
        },
        {
          key: "物流单号",
          value: res.tableData.expressCode
        },
        {
          key: "发货时间",
          value: res.tableData.deliveryDate
        },
        {
          key: "订单类型",
          value: this.$parent.$parent.orderType[res.tableData.orderType]
        },
        {
          key: "运费",
          value: res.tableData.expressFee
        },
        {
          key: "支付方式",
          value: this.$parent.$parent.payWayType[res.tableData.payWay]
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
          value: this.$parent.$parent.statusType[res.tableData.status]
        }
      ];
      this.detailData = res.businessData;
    });
  }
}
</script>