<template>
  <div class="oticket-container main-content">
    <!-- 筛选 -->
    <el-form>
      <el-form-item class="inline-block" label="查询日期：" label-width="95px">
        <date-picker type="daterange" :value.sync="formData"></date-picker>
      </el-form-item>
      <el-form-item class="inline-block" label="核券类型：" label-width="95px">
        <el-select v-model="cardType">
          <el-option :value="1" label="优惠券"></el-option>
          <el-option :value="2" label="兑换券"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="inline-block">
        <el-button type="primary" @click="handleSubmitForm()">查询</el-button>
        <el-button type="primary" @click="handleClearForm()">清空</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table :data="tableData" style="margin-bottom: 15px;">

      <el-table-column label="类型">
        <template slot-scope="scope">
          <span v-if="scope.row.cardType == 1">优惠券</span>
          <span v-else-if="scope.row.cardType == 2">兑换券</span>
        </template>
      </el-table-column>

      <el-table-column label="名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="面值">
        <template slot-scope="scope">
          <span>{{ scope.row.denomination }}</span>
        </template>
      </el-table-column>

      <el-table-column label="使用条件">
        <template slot-scope="scope">
          <span v-if="scope.row.cardType == 1">满 {{ scope.row.leastCost }} 减 {{ scope.row.denomination }}</span>
        </template>
      </el-table-column>

      <el-table-column label="有效期">
        <template slot-scope="scope">
          <div v-if="!scope.row.daysOfValidity">{{ scope.row.beginTimestamp + " 至 " + scope.row.endTimestamp }}</div>
          <div v-else>{{ scope.row.daysOfValidity }}天</div>
        </template>
      </el-table-column>

      <el-table-column label="发送张数（张）">
        <template slot-scope="scope">
          <span>{{ scope.row. sendNum }}</span>
        </template>
      </el-table-column>

      <el-table-column label="核销张数（张）">
        <template slot-scope="scope">
          <span>{{ scope.row.useNum }}</span>
        </template>
      </el-table-column>

    </el-table>
    <!-- 分页 -->
    <el-pagination @current-change="handleOnPageChange" :current-page="page" layout="total, prev, pager, next, jumper" :total="total" :page-size="pageSize"></el-pagination>
  </div>
</template>

<script>
  import DatePicker from '@/components/DatePicker';
  import { getVerificationList } from '@/api/operation';
  import { getNowFormatDate } from '@/utils';

  export default {
    name: 'oticket_views',
    components: { DatePicker },
    data() {
      return {
        formData: [getNowFormatDate(), getNowFormatDate()],
        tableData: [],
        cardType: 1,
        page: 1,
        total: 0,
        pageSize: 10
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
      handleClearForm() {
        this.formData = [];
        this.cardType = 1;
      },
      handleSubmitForm() {
        this.page = 1;
        this.handleGetTableData();
      },
      handleGetTableData() {
        getVerificationList({ dateFormat: this.formData[0], endTime: this.formData[1], currentPage: this.page, cardType: this.cardType }).then(res => {
          res.tableData.rows.forEach(item => {
            item.cardType = this.cardType;
          })
          this.tableData = res.tableData.rows;
          this.total = res.tableData.totalSize;
          this.pageSize = res.tableData.pageSize;
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
/deep/ .el-select .el-input {
  width: 120px;
}
</style>
