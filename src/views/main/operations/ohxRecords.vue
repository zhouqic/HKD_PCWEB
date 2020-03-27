<template>
  <div class="oturnover-container main-content">
    <!-- 筛选 -->
    <el-form>
      <el-form-item class="inline-block" label="查询日期:" label-width="95px">
        <date-picker type="daterange" :value.sync="dateFormat"></date-picker>
      </el-form-item>
      <el-form-item class="inline-block" label="名称:" label-width="95px">
        <el-input v-model="cardName" maxlength="10"></el-input>
      </el-form-item>
      <el-form-item class="inline-block" label="类型:" label-width="95px">
        <el-select v-model="type">
          <el-option :value="1" label="实物券"></el-option>
          <el-option :value="2" label="砍价活动"></el-option>
          <el-option :value="3" label="爆品"></el-option>
          <el-option :value="4" label="9.9"></el-option>
          <el-option :value="5" label="积分商品"></el-option>
          <el-option :value="8" label="次卡"></el-option>
          <el-option :value="9" label="锦鲤"></el-option>
          <el-option :value="10" label="商户商盟商品"></el-option>
          <el-option :value="11" label="商盟保底商品"></el-option>
          <el-option :value="12" label="好想你爆品"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="inline-block" label="员工:" label-width="95px">
        <el-select v-model="jobNumber">
          <template v-for="item in staffList">
            <el-option :key="item.id" :value="item.id" :label="item.name"></el-option>
          </template>
        </el-select>
      </el-form-item>
      <el-form-item class="inline-block">
        <el-button type="primary" @click="handleSubmitForm()">查询</el-button>
        <el-button type="primary" @click="handleResetForm()">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table :data="tableData" style="margin-bottom: 15px;">

      <el-table-column label="名称">
        <template slot-scope="scope">
          <span v-if="scope.row.type == 1 || scope.row.type == 8 || scope.row.type == 10">{{ scope.row.title }}</span>
          <span v-else-if="scope.row.type == 2 || scope.row.type == 5">{{ scope.row.productName }}</span>
          <span v-else-if="scope.row.type == 3 || scope.row.type == 4">{{ scope.row.productCheapPrice }}元抢购{{ scope.row.productName }}原价{{ scope.row.productPrePrice }}元</span>
        </template>
      </el-table-column>

      <el-table-column label="券码">
        <template slot-scope="scope">
          <span v-if="scope.row.exchangeCode.length == 12">{{ scope.row.exchangeCode }}</span>
          <span v-else>{{ handlePrefixInteger(scope.row.exchangeCode) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="核销时间">
        <template slot-scope="scope">
          <span>{{ scope.row.verifyRecodeDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="购买价格">
        <template slot-scope="scope">
          <span v-if="scope.row.productCheapPrice">￥{{ scope.row.productCheapPrice }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>

      <el-table-column label="数量">
        <template slot-scope="scope">
          <span>{{ scope.row.verifyRecodeNum }}</span>
        </template>
      </el-table-column>

      <el-table-column label="购买平台">
        <template slot-scope="scope">
          <span v-if="scope.row.operateFrom == 1">爆品网页</span>
          <span v-else-if="scope.row.operateFrom == 2">爆品小程序</span>
          <span v-else>-</span>
        </template>
      </el-table-column>

      <el-table-column label="核销员账号" prop="verifyStaffJobNumber"></el-table-column>

      <el-table-column label="核销方式">
        <template slot-scope="scope">
          <span v-if="scope.row.verifyWay == 1">扫码核销</span>
          <span v-else-if="scope.row.verifyWay == 2 || scope.row.verifyWay == 0">输码核销</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination @current-change="handleOnPageChange" :current-page="page" layout="total, prev, pager, next, jumper" :total="total" :page-size="pageSize"></el-pagination>
  </div>
</template>

<script>
  import { getVerifyRecodes, getRfStaff } from '@/api/operation';
  import { getNowFormatDate, parseTime } from '@/utils';
  import DatePicker from '@/components/DatePicker';

  export default {
    name: 'oturnover_views',
    components: { DatePicker },
    data() {
      return {
        dateFormat: [getNowFormatDate(), getNowFormatDate()],
        jobNumber: '',
        cardName: '',
        type: 1,
        staffList: [{ id: '', name: "不限"}],
        tableData: [],
        page: 1,
        total: 0,
        downloadLoading: false,
        pageSize: 10
      }
    },
    created() {
      getRfStaff().then(res => {
        res.tableData.forEach((item, i) => {
          this.staffList.push({ id: item.jobNumber, name: item.name != '' ? item.name : '老板' });
        });
      })
      this.handleGetTableData();
    },
    methods: {
      handlePrefixInteger(num) {
        return (num / Math.pow(10, 12)).toFixed(12).substr(2);
      },
      handleOnPageChange(page) {
        this.page = page;
        this.handleGetTableData();
      },
      handleResetForm() {
        this.dateFormat = [getNowFormatDate(), getNowFormatDate()];
        this.cardName = '';
        this.jobNumber = '';
        this.type = 1;
      },
      handleSubmitForm() {
        this.page = 1;
        this.handleGetTableData()
      },
      handleGetTableData() {
        getVerifyRecodes({ beginTime: this.dateFormat[0], endTime: this.dateFormat[1], cardName: this.cardName, pageNo: this.page, type: this.type, jobNumber: this.jobNumber, version: "150" }).then(res => {
          this.tableData = res.tableData;
          this.total = res.totalSize;
          this.pageSize = res.pageSize;
        })
      }
    }
  }
</script>