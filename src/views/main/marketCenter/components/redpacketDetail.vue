<template>
  <el-container style="display:block;">
    <!-- 统计 -->
    <el-row style="margin-bottom: 15px;">
      已领取{{ detaileData.getNum ? detaileData.getNum : 0 }}/{{ detaileData.num ? detaileData.num : 0 }}个， 共{{ detaileData.getMoney ? detaileData.getMoney : 0 }}/{{ detaileData.redPacketMoney ? detaileData.redPacketMoney : 0 }}元
    </el-row>
    <!-- 领取记录 -->
    <el-table :data="tableData" border style="margin-bottom: 15px;">
      <el-table-column label="用户" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.headimgurl ? scope.row.headimgurl : defaultImg" width="30" height="30" style="border-radius:50%;vertical-align:middle;margin-right:5px;">
          {{ scope.row.wxname }}
          </template>
      </el-table-column>
      <el-table-column label="领取金额" align="center">
        <template slot-scope="scope">{{ scope.row.money + '元' }}</template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination @current-change="handleOnPageChange" :current-page="page" layout="total, prev, pager, next, jumper" :total="total" :page-size="10"></el-pagination>
  </el-container>
</template>

<script>
import { getUsersOfRedPacket, getRedPacketDetail, getRedPacketStatistics } from '@/api/marketCenter';

  export default {
    props: ["id"],
    data() {
      return {
        defaultImg: require("@/assets/default_logo.jpg"),
        tableData: [],
        detaileData: {},
        page: 1,
        total: 0
      }
    },
    created() {
      getRedPacketStatistics({ "date": "", "id": this.id, "type": ""}).then(res => {})
      getRedPacketDetail({ id: this.id }).then(res => {
        this.detaileData = res.tableData.rfCommandRedPacket;
      })
      this.handleGetUsersData();
    },
    methods: {
      handleOnPageChange(page) {
        this.page = page;
        this.handleGetUsersData();
      },
      handleGetUsersData() {
        getUsersOfRedPacket({ id: this.id, page: this.page }).then(res => {
          this.tableData = res.tableData;
          this.total = res.totalSize;
        })
      }
    }
  }
</script>