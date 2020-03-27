<template>
  <div>
    <!-- 新建 -->
    <el-form label-width="90px">
      <el-form-item class="inline-block" label="营销类型：">
        <el-select v-model="type" style="width:120px">
          <el-option value="sms" label="短信营销"></el-option>
          <el-option value="card" label="券营销"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="inline-block" label="发送状态：" v-if="type=='sms'">
        <el-select v-model="status" style="width:120px">
          <el-option :value="''" label="不限"></el-option>
          <el-option :value="0" label="发送中"></el-option>
          <el-option :value="-1" label="发送失败"></el-option>
          <el-option :value="1" label="发送成功"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="inline-block" label="会员查询：">
        <el-input v-model="condition" placeholder="昵称/手机号"></el-input>
      </el-form-item>
      <el-form-item class="inline-block" label-width="0px">
        <el-button type="primary" @click="handleSubmitForm()">查询</el-button>
        <el-button type="primary" @click="handleResetFormData()">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table :data="tableData" style="margin-bottom:15px;">
      <el-table-column label="发送时间">
        <template slot-scope="scope">
          <span>{{scope.row.createDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
        </template>
      </el-table-column>

      <el-table-column label="发送类型">
        <template slot-scope="scope">
          <span>{{tableType == "sms" ? "短信" : "实物券/优惠券"}}</span>
        </template>
      </el-table-column>

      <el-table-column label="发送内容">
        <template slot-scope="scope">
          <span>{{tableType == "sms" ? scope.row.content : scope.row.cardName}}</span>
        </template>
      </el-table-column>

      <el-table-column label="发送状态" prop="cardName" v-if="tableType == 'sms'">
        <template slot-scope="scope">{{ scope.row.status == -1 ? "发送失败" : (scope.row.status == 0 ? "发送中" : "发送成功") }}</template>
      </el-table-column>

      <el-table-column label="会员昵称" prop="name"></el-table-column>

      <el-table-column label="手机号" prop="phone"></el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination @current-change="handleOnPageChange" :current-page="page" layout="total, prev, pager, next, jumper" :total="total" :page-size="pageSize"></el-pagination>
  </div>
</template>

<script>
import { getSendCardRecord } from '@/api/vipManage';
import { getSmsSendRecord } from '@/api/vipManage';
export default {
  name: "sendRecords",
  data() {
    return {
      type: 'card',
      status: '',
      tableType: '',
      condition: '',
      page: 1,
      total: 0,
      pageSize: 10,
      tableData: [],
      showDialog: false,
      isSubmit: false
    }
  },
  created() {
    this.handleGetTableData();
  },
  methods: {
    handleResetFormData() {
      this.condition = '';
      this.currentPage = 1;
    },
    handleOnPageChange(page) {
      this.page = page;
      this.handleGetTableData();
    },
    handleGetTableData() {
      if (this.type == "card") {
        getSendCardRecord({currentPage: this.page, condition: this.condition }).then(res => {
          this.tableType = this.type;
          this.tableData = res.tableData.records;
          this.total = res.tableData.total;
        })
      } else {
        getSmsSendRecord({currentPage: this.page, name: this.condition, type: 2, status: this.status }).then(res => {
          this.tableType = this.type;
          this.tableData = res.businessData.records;
          this.total = res.businessData.total;
        })
      }
    },
    handleSubmitForm() {
      this.page = 1;
      this.handleGetTableData();
    }
  }
};
</script>