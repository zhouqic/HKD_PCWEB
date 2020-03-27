<template>
  <div>
    <!-- 列表 -->
    <el-table :data="tableData" style="margin-bottom: 15px;">
      <el-table-column label="活动名称" :formatter="row => row.title"></el-table-column>

      <el-table-column label="礼包总价值" :formatter="row => row.businessAllianceJoinShop.totalMoney + '元'"></el-table-column>

      <el-table-column label="活动开始时间">
        <template slot-scope="scope">
          {{ scope.row.beginTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
        </template>
      </el-table-column>

      <el-table-column label="活动结束时间">
        <template slot-scope="scope">
          {{ scope.row.endTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
        </template>
      </el-table-column>

      <el-table-column label="报名开始时间">
        <template slot-scope="scope">
          {{ scope.row.joinBeginTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
        </template>
      </el-table-column>

      <el-table-column label="报名结束时间">
        <template slot-scope="scope">
          {{ scope.row.joinEndTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
        </template>
      </el-table-column>

      <el-table-column label="活动状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.businessAllianceJoinShop.isAudit == 0" type="">审核中</el-tag>
          <el-tag v-else-if="scope.row.businessAllianceJoinShop.isAudit == -1" type="danger">审核不通过</el-tag>
          <el-tag v-else-if="scope.row.businessAllianceJoinShop.isAudit == 1" type="success">审核通过</el-tag>
          <el-tag v-else-if="scope.row.businessAllianceJoinShop.isAudit == 2" type="success">活动进行中</el-tag>
          <el-tag v-else-if="scope.row.businessAllianceJoinShop.isAudit == -2" type="info">活动已结束</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="180px">
        <template slot-scope="scope">
          <el-button class="table_operate" plain type="primary" @click="handleGetActivityDetail(scope.row.id)">活动详情</el-button>
          <el-button class="table_operate" plain type="primary" @click="handleGetActivityProfit(scope.row.id)">我的收益</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination @current-change="handleOnPageChange" :current-page="page" layout="total, prev, pager, next, jumper" :total="total" :page-size="10"></el-pagination>
    <!-- 弹窗 -->
    <el-dialog :title="detailID ? '活动详情' : '我的收益'" :visible.sync="showDialog" width="650px" :close-on-click-modal="false" :close-on-press-escape="false" @close="handleCloseDialog">
      <shangmeng-detail :id="detailID" v-if="detailID"></shangmeng-detail>
      <shangmeng-profit :id="profitID" v-if="profitID"></shangmeng-profit>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleCloseDialog">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getJoinActivityList } from '@/api/marketCenter';
import { parseTime } from "@/utils";
import shangmengDetail from "./shangmengDetail";
import shangmengProfit from "./shangmengProfit";

  export default {
    components: { shangmengDetail, shangmengProfit },
    data() {
      return {
        activeTab: "0",
        tableData: [],
        showDialog: false,
        page: 1,
        total: 0,
        detailID: "",
        profitID: ""
      }
    },
    created() {
      this.handleGetTableData();
    },
    methods: {
      handleOnPageChange(page) {
        this.page = page;
        this.handleGetTableData();
      },
      handleCloseDialog() {
        this.profitID = "";
        this.detailID = "";
        this.showDialog = false;
      },
      handleGetTableData() {
        getJoinActivityList({ currentPage: this.page }).then(res => {
          this.total = res.tableData.total;
          this.tableData = res.tableData.records;
        })
      },
      handleGetActivityDetail(id) {
        this.detailID = id;
        this.showDialog = true;
      },
      handleGetActivityProfit(id) {
        this.profitID = id;
        this.showDialog = true;
      }
    }
  }
</script>