<template>
<div>
  <el-form>
    <el-form-item class="inline-block" label="查询日期：" label-width="95px">
      <date-picker type="daterange" :value.sync="formData"></date-picker>
    </el-form-item>
    <el-form-item class="inline-block" label="订单状态:" label-width="95px">
      <el-select v-model="status" style="width:120px;margin-right:80px;">
        <el-option label="不限" :value="''"></el-option>
        <el-option label="已消费" :value="1"></el-option>
        <el-option label="未消费" :value="0"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item class="inline-block">
      <el-button type="primary" @click="handleGetTableData()">查询</el-button>
      <el-button type="primary" @click="formData=[];">清空</el-button>
    </el-form-item>
  </el-form>
  <!-- 表格 -->
  <el-table :data="tableData" style="margin-bottom: 15px;">
    <el-table-column label="订单编号" prop="orderNo"></el-table-column>

    <el-table-column label="下单时间">
      <template slot-scope="scope">
        <span v-if="scope.row.createDate">{{ scope.row.createDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        <span v-else>-</span>
      </template>
    </el-table-column>

    <el-table-column label="消费时间">
      <template slot-scope="scope">
        <span v-if="scope.row.verifyTime">{{ scope.row.verifyTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        <span v-else>-</span>
      </template>
    </el-table-column>

    <el-table-column label="商品名称" prop="productName"></el-table-column>

    <el-table-column label="商品图片">
      <template slot-scope="scope">
        <img v-if="scope.row.productPic" :src="scope.row.productPic" width="50" height="50">
      </template>
    </el-table-column>

    <el-table-column label="订单总额">
      <template slot-scope="scope">
        {{ scope.row.productPointPrice }} 积分 + {{ scope.row.productCheapPrice }} 元
      </template>
    </el-table-column>

    <el-table-column label="数量" prop="orderNum" align="center"></el-table-column>

    <el-table-column label="用户手机号" prop="userPhone"></el-table-column>

    <el-table-column label="订单状态">
      <template slot-scope="scope">
        <el-tag type="info">{{ scope.row.verifyStatus == 0 ? '未消费' : '已消费' }}</el-tag>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页 -->
  <el-pagination @current-change="handleOnPageChange" :current-page="page" layout="total, prev, pager, next, jumper" :total="total" :page-size="10"></el-pagination>
</div>
</template>
<script>
import { getRfSingleOrderList } from "@/api/marketCenter";
import DatePicker from '@/components/DatePicker';
import { getNowFormatDate } from '@/utils';

export default {
  name: 'cardManage_views',
  components: { DatePicker },
  data() {
    return {
      status: '',
      formData: [getNowFormatDate(), getNowFormatDate()],
      tableData: [],
      page: 1,
      total: 0,
      isSubmit: false,
      showDialog: false
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
      getRfSingleOrderList({ beginTime: this.formData[0], endTime: this.formData[1], currentPage: this.page, type: 3, verifyStatus: this.status }).then(res => {
        this.total = res.tableData.totalSize;
        this.tableData = res.tableData.rows;
      })
    },
    handleDeleteCard(id) {
      this.$confirm('您确认要删除该卡券吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showCancelButton: true,
        type: 'warning'
      }).then(() => {
        if (this.status == 0) {
          deleteRfCardById(id).then(res => {
            this.$message({ type: 'success', message: '删除成功' })
            this.handleGetTableData();
          })
        } else {
          delEntityCardById({ id: id }).then(res => {
            this.$message({ type: 'success', message: '删除成功' })
            this.handleGetTableData();
          })
        }
      }).catch(() => {});
    },
    handleSubmitForm() {
      let $el = this.$refs["cardmanageForm"];
      $el.$refs["validateForm"].validate(valid => {
        if (valid) {
          this.isSubmit = true;
          let data = { shareNum: 1 };
          data.title = $el.formData.title;
          data.isSend = $el.formData.isSend;
          if ($el.cardType == 0) {
            data.reduceCost = $el.formData.price;
            data.leastCost = $el.formData.leastCost;
            data.type = $el.formData.type;
            data.cardType = 'CASH';
            if ($el.formData.type == 1) {
              data.beginTimestamp = $el.formData.beginTimestamp;
              data.endTimestamp = $el.formData.endTimestamp;
            } else {
              data.fixedTerm = $el.formData.fixedTerm;
            }
            saveRfCard(data).then(res => {
              this.isSubmit = false;
              this.showDialog = false;
              this.handleGetTableData();
              this.$message.success("保存成功");
            }).catch(() => { 
              this.isSubmit = false;
            });
          } else {
            data.pic = $el.formData.pic;
            data.price = $el.formData.price;
            data.shopId = this.$store.getters.shopId;
            data.validDays = $el.formData.fixedTerm;
            addEntityCard(data).then(res => {
              this.isSubmit = false;
              this.showDialog = false;
              this.handleGetTableData();
              this.$message.success("保存成功");
            }).catch(() => { 
              this.isSubmit = false;
            });
          }
        }
      })
    }
  }
}
</script>