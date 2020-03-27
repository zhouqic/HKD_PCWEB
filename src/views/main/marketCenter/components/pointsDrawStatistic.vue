<template>
  <el-container style="display:block;">
    <!-- 统计 -->
    <el-row style="margin-bottom: 15px;">
      抽奖人数 {{ data.joinNumbers ? data.joinNumbers : 0 }} 人， 中奖人数 {{ data.awardNumbers ? data.awardNumbers : 0 }} 人
    </el-row>
    <!-- 领取记录 -->
    <el-table :data="data.wheelInfoJoins" border style="margin-bottom: 15px;">
      <el-table-column label="用户" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.headimgurl ? scope.row.headimgurl : defaultImg" width="30" height="30" style="border-radius:50%;vertical-align:middle;margin-right:5px;">
          {{ scope.row.name }}
          </template>
      </el-table-column>
      <el-table-column label="奖品" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.type == 1">满 {{ scope.row.awardName.split("|")[1] }} 元，立减 {{ scope.row.awardName.split("|")[0] }} 元优惠券</span>
          <span v-else-if="scope.row.type == 2">{{ scope.row.awardName.split("|")[0] }} 商品兑换券</span>
          <span v-else-if="scope.row.type == 3">{{ scope.row.awardName.split("|")[0] }} 积分</span>
          <span v-else-if="scope.row.type == 4">{{ scope.row.awardName.split("|")[0] }} 元现金红包</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination @current-change="handleOnPageChange" :current-page="page" layout="total, prev, pager, next, jumper" :total="total" :page-size="10"></el-pagination>
  </el-container>
</template>

<script>
import { findAwardById } from '@/api/marketCenter';

  export default {
    props: ["id"],
    data() {
      return {
        data: {},
        page: 1,
        total: 0
      }
    },
    created() {
      this.handleGetWheelData();
    },
    methods: {
      handleOnPageChange(page) {
        this.page = page;
        this.handleGetWheelData();
      },
      handleGetWheelData() {
        findAwardById({ pageNo: this.page, wheelId: this.id }).then(res => {
          this.data = res.tableData;
          this.total = res.tableData.awardNumbers;
        })
      }
    }
  }
</script>