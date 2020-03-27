<template>
<div class="main-content">
  <!-- 添加活动 -->
  <el-header style="padding-left:0;">
    <span class="item_label" style="font-size:14px;color:#606266;line-height:32px;font-weight:bolder;">活动状态：</span>
    <el-select v-model="status" @change="page=1;handleGetTableData()" style="width:120px;margin-right:80px;">
      <el-option label="不限" :value="''"></el-option>
      <el-option label="进行中" :value="0"></el-option>
      <el-option label="已结束" :value="1"></el-option>
    </el-select>
    <el-button type="primary" @click="handleOpenDialog()">创建活动</el-button>
  </el-header>
  <!-- 列表 -->
  <el-table :data="tableData" style="margin-bottom: 15px;">
    <el-table-column label="红包代号" prop="title"></el-table-column>

    <!-- <el-table-column label="红包总金额" :formatter="row => row.totalBudget + '元'"></el-table-column> -->

    <el-table-column label="单个红包金额">
      <template slot-scope="scope">
        <span v-if="scope.row.type == 0">{{ "最低" + scope.row.minMoney + "元，最高" + scope.row.maxMoney + "元" }}</span>
        <span v-else-if="scope.row.type == 1">{{ scope.row.minMoney + "元" }}</span>
      </template>
    </el-table-column>

    <el-table-column label="红包个数" prop="num"></el-table-column>
    
    <el-table-column label="最低消费" :formatter="row => row.minCharge + '元'"></el-table-column>

    <el-table-column label="红包有效期" :formatter="row => getNowFormatDate(row.beginTime) + ' 至 ' + getNowFormatDate(row.endTime)"></el-table-column>

    <el-table-column label="活动状态">
      <template slot-scope="scope">
        <el-tag v-if="scope.row.status == 0 && scope.row.endTime >= new Date().getTime()" type="success">进行中</el-tag>
        <el-tag v-else type="info">已结束</el-tag>
      </template>
    </el-table-column>

    <el-table-column label="操作" width="180px">
      <template slot-scope="scope">
        <el-button class="table_operate" v-if="scope.row.status == 0 && scope.row.endTime >= new Date().getTime()" plain type="danger" @click="handleStopRedPacket(scope.row)">结束活动</el-button>
        <el-button class="table_operate" plain type="danger" @click="handleDelRedPacket(scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页 -->
  <el-footer>
    <el-pagination @current-change="handleOnPageChange" :current-page="page" layout="total, prev, pager, next, jumper" :total="total" :page-size="10"></el-pagination>
  </el-footer>
  <!-- 弹窗 -->
  <el-dialog title="添加红包" :visible.sync="showDialog" width="600px" :close-on-click-modal="false" :close-on-press-escape="false">
    <sharebox-form ref="shareboxForm" v-if="showDialog"></sharebox-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="showDialog = false">取 消</el-button>
      <el-button type="primary" :disabled="isSubmit ? true : false" @click="handleSubmitForm">确 定</el-button>
    </span>
  </el-dialog>
</div>
</template>
<script>
import { getRedPacketList, saveRfRedPacket, stopRedPacketById, delRedPacketById } from '@/api/marketCenter';
import { getNowFormatDate } from '@/utils';
import shareboxForm from './shareboxForm';

  export default {
    components: { shareboxForm },
    data() {
      return {
        tableData: [],
        page: 1,
        total: 0,
        status: '',
        isSubmit: false,
        showDialog: false
      }
    },
    created() {
      this.handleGetTableData();
    },
    methods: {
      getNowFormatDate,
      handleOnPageChange(page) {
        this.page = page;
        this.handleGetTableData();
      },
      handleGetTableData() {
        getRedPacketList({ "pageNo": this.page, status: this.status }).then(res => {
          this.tableData = res.tableData;
          this.total = res.totalSize;
        })
      },
      handleStopRedPacket(row) {
        this.$confirm('您确认要结束该活动吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          showCancelButton: true,
          type: 'warning'
        }).then(() => {
          stopRedPacketById({ id: row.id }).then(res => {
            this.$message.success("活动已结束");
            this.handleGetTableData();
          })
        }).catch(() => {});
      },
      handleDelRedPacket(row) {
        this.$confirm('您确认要删除该活动吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          showCancelButton: true,
          type: 'warning'
        }).then(() => {
          delRedPacketById({ id: row.id }).then(res => {
            this.$message.success("活动已删除");
            this.handleGetTableData();
          })
        }).catch(() => {});
      },
      handleOpenDialog() {
        getRedPacketList({ "pageNo": this.page, status: 0 }).then(res => {
          if (res.totalSize > 0) {
            this.$message.error('已经有正在进行中的活动了哦');
            return false;
          }
          this.showDialog = true;
        })
      },
      handleSubmitForm() {
        let $el = this.$refs["shareboxForm"];
        $el.$refs["validateForm"].validate(valid => {
          if (valid) {
            this.isSubmit = true;
            this.$refs["shareboxForm"].selectCard.forEach((item, i) => {
              $el.formData['cardId' + (i+1)] = item.id;
              $el.formData['cardType' + (i+1)] = 0;
            });
            saveRfRedPacket($el.formData).then(res => {
              this.isSubmit = false;
              this.showDialog = false;
              this.handleGetTableData();
              this.$message.success("保存成功");
            }).catch(() => { 
              this.isSubmit = false;
            });
          }
        })
      }
    }
  }
</script>