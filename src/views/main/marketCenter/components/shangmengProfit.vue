<template>
  <el-container style="display:block;">
    <el-table :data="shopProfit" border :show-header="false" style="margin-bottom: 15px;">
      <el-table-column prop="key" label="key" width="150">
        <template slot-scope="scope">
          <span style="font-weight: 900;">{{ scope.row.key }}</span>
        </template>
      </el-table-column>
      <el-table-column label="value">
        <template slot-scope="scope">
          <div v-html="scope.row.value"></div>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align:center;font-size:14px;font-weight:bolder;color:#000;">—— 商家排行榜 ——</div>
    <!-- 优惠券 -->
    <el-table :data="rankData" style="margin-bottom: 15px;">
      <el-table-column label="排名" align="center" prop="rank"></el-table-column>
      <el-table-column label="门店名称" align="left">
        <template slot-scope="scope">
          <img :src="scope.row.logo" width='25' height='25' style='border-radius:50%;vertical-align: -7px;margin-right:10px;'>
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="推广笔数" align="center" prop="count"></el-table-column>
      <el-table-column label="推广收益" align="center" prop="money"></el-table-column>
    </el-table>
  </el-container>
</template>

<script>
import { findBusinessShopProfit } from '@/api/marketCenter';

  export default {
    props: ["id"],
    data() {
      return {
        shopProfit: [],
        rankData: []
      }
    },
    created() {
      this.handleGetActivityProfit();
    },
    methods: {
      handleGetActivityProfit() {
        findBusinessShopProfit({ "activityId": this.id, count: 0 }).then(res => {
          this.shopProfit = [
            {
              key: "商家名称",
              value: "<img src='" + res.tableData.businessShopProfit.logo + "' width='25' height='25' style='border-radius:50%;vertical-align: -7px;margin-right:10px;'>" + res.tableData.businessShopProfit.name
            },
            {
              key: "商家排行",
              value: res.tableData.businessShopProfit.rank + "名"
            },
            {
              key: "推广笔数",
              value: "<span style='color:#F56C6C'>" + res.tableData.businessShopProfit.count + "</span>"
            },
            {
              key: "推广收益",
              value: "<span style='color:#F56C6C'>￥" + res.tableData.businessShopProfit.money + "</span>"
            },
            {
              key: "推广奖励",
              value: "<span style='color:#F56C6C'>￥" + res.tableData.businessShopProfit.rewardMoney + "</span>"
            }
          ];
          this.rankData = res.tableData.businessShopProfits;
        })
      }
    }
  }
</script>