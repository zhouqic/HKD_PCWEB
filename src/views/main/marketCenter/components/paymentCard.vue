<template>
<div class="main-content">
  <!-- 添加活动 -->
  <el-header style="padding-left:0;">
    <span class="item_label" style="font-size:14px;color:#606266;line-height:32px;font-weight:bolder;">活动状态：</span>
    <el-select v-model="status" @change="page=1;handleGetTableData()" style="width:120px;margin-right:80px;">
      <!-- <el-option label="不限" :value="''"></el-option> -->
      <el-option label="进行中" :value="0"></el-option>
      <el-option label="已结束" :value="1"></el-option>
    </el-select>
    <el-button type="primary" @click="showDialog = true;dialogType = 0;">新建付费次卡</el-button>
  </el-header>
  <!-- 列表 -->
  <el-table :data="tableData" style="margin-bottom: 15px;">
    <el-table-column label="名称" prop="title"></el-table-column>

    <el-table-column label="次数" prop="num" :formatter="row => (row.num ? row.num : '无限') + '次'"></el-table-column>

    <el-table-column label="原价" prop="prePrice" :formatter="row => '￥' + row.prePrice"></el-table-column>

    <el-table-column label="购买价格" prop="price" :formatter="row => '￥' + row.price"></el-table-column>

    <el-table-column label="购买说明" prop="buyNum" :formatter="row => '每人可领取' + (row.buyNum ? row.buyNum : '无限') + '张'"></el-table-column>

    <el-table-column label="有效期" prop="days" :formatter="row => '购买后' + row.days + '天内有效'"></el-table-column>

    <el-table-column label="创建时间">
      <template slot-scope="scope">
        {{ scope.row.createDate | parseTime('{y}-{m}-{d}') }}
      </template>
    </el-table-column>

    <el-table-column label="使用提醒" prop="reminders" :formatter="row => row.reminders"></el-table-column>

    <el-table-column label="使用须知" prop="notice" :formatter="row => row.notice"></el-table-column>

    <el-table-column label="操作" width="180px">
      <template slot-scope="scope">
        <el-button class="table_operate" v-if="scope.row.status == 0" plain type="danger" @click="handleStopActivity(scope.row.id)">结束</el-button>
        <el-button class="table_operate" plain @click="handleGetRecord(scope.row.id)">购买记录</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页 -->
  <el-footer>
    <el-pagination @current-change="handleOnPageChange" :current-page="page" layout="total, prev, pager, next, jumper" :total="total" :page-size="10"></el-pagination>
  </el-footer>
  <!-- 弹窗 -->
  <el-dialog :title="dialogType === 0 ? '添加活动' : '购买记录'" :visible.sync="showDialog" width="600px" :close-on-click-modal="false" :close-on-press-escape="false">
    <payment-card-form ref="paymentCardForm" v-if="showDialog && dialogType === 0"></payment-card-form>
    <payment-card-record :id="id" v-if="showDialog && dialogType === 1"></payment-card-record>
    <span slot="footer" class="dialog-footer">
      <el-button @click="showDialog = false">取 消</el-button>
      <el-button type="primary" :disabled="isSubmit ? true : false" @click="handleSubmitForm">确 定</el-button>
    </span>
  </el-dialog>
</div>
</template>
<script>
import { saveRfNumCardRule, stopRfNumCardRule, getRfNumCardList } from '@/api/marketCenter';
import paymentCardForm from './paymentCardForm';
import paymentCardRecord from './paymentCardRecord';

  export default {
    name: "numbercard",
    components: { paymentCardForm, paymentCardRecord },
    data() {
      return {
        tableData: [],
        id: "",
        page: 1,
        total: 0,
        status: 0,
        isSubmit: false,
        showDialog: false,
        dialogType: 0,//0,添加；1，记录
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
      handleGetTableData() {
        getRfNumCardList({ "pageNo": this.page, status: this.status }).then(res => {
          this.tableData = res.tableData;
          this.total = res.totalSize;
        })
      },
      handleGetRecord(id) {
        this.id = id;
        this.showDialog = true;
        this.dialogType = 1;
      },
      handleStopActivity(id) {
        this.$confirm('您确认要结束该活动吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          showCancelButton: true,
          type: 'warning'
        }).then(() => {
          stopRfNumCardRule({ id: id }).then(res => {
            this.$message.success("活动已结束");
            this.handleGetTableData();
          })
        }).catch(() => {});
      },
      handleSubmitForm() {
        if (this.dialogType == 1) {
          this.showDialog = false;
          this.id = "";
          return false; 
        }
        let $el = this.$refs["paymentCardForm"];
        $el.$refs["validateForm"].validate(valid => {
          if (valid) {
            this.isSubmit = true;
            saveRfNumCardRule($el.formData).then(res => {
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