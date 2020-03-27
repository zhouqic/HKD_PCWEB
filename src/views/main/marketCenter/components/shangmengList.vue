<template>
  <el-row>
    <!-- 列表 -->
    <el-table :data="tableData" style="margin-bottom: 15px;">
      <el-table-column label="活动名称" :formatter="row => row.title"></el-table-column>

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

      <el-table-column label="活动介绍" width="200px">
        <template slot-scope="scope">
          <div v-html="scope.row.rule" style="white-space:pre;white-space:pre-wrap;max-height:200px;overflow-y:auto;"></div>
        </template>
      </el-table-column>

      <el-table-column label="活动状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.joinBeginTime > new Date().getTime()" type="info">报名未开始</el-tag>
          <el-tag v-else-if="scope.row.joinBeginTime <= new Date().getTime() && scope.row.joinEndTime >= new Date().getTime()">报名进行中</el-tag>
          <el-tag v-else-if="scope.row.joinEndTime < new Date().getTime() && scope.row.beginTime > new Date().getTime()" type="info">报名已结束</el-tag>
          <el-tag v-else-if="scope.row.beginTime <= new Date().getTime() && scope.row.endTime >= new Date().getTime()" type="success">活动进行中</el-tag>
          <el-tag v-else-if="scope.row.endTime < new Date().getTime()" type="danger">活动已结束</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="130px">
        <template slot-scope="scope">
          <el-button class="table_operate" plain type="primary" @click="handleSignUpActivity(scope.row)">报名参与</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination @current-change="handleOnPageChange" :current-page="page" layout="total, prev, pager, next, jumper" :total="total" :page-size="10"></el-pagination>
    <!-- 弹窗 -->
    <el-dialog title="商盟礼包创建" :visible.sync="showDialog" width="800px" :close-on-click-modal="false" :close-on-press-escape="false" @close="id='';">
      <shangmeng-signup ref="shangmengSignup" :id="id" v-if="showDialog"></shangmeng-signup>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialog=false;id='';">取 消</el-button>
        <el-button type="primary" :disabled="isSubmit ? true : false" @click="handleSubmitForm">确 定</el-button>
      </span>
    </el-dialog>
  </el-row>
</template>
<script>
import { getShangMengList, signupShangmengActivity } from '@/api/marketCenter';
import { parseTime } from "@/utils";
import shangmengSignup from "./shangmengSignup";

  export default {
    components: { shangmengSignup },
    data() {
      return {
        activeTab: "0",
        tableData: [],
        showDialog: false,
        isSubmit: false,
        page: 1,
        total: 0,
        id: ""
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
        getShangMengList({ ascs: "joinBeginTime", currentPage: this.page, "descs": "", "pageSize": 10 }).then(res => {
          this.total = res.tableData.total;
          this.tableData = res.tableData.records;
        })
      },
      handleSignUpActivity(row) {
        if (row.joinFlag == 1) {
          this.$message.info("活动已报名");
          return false;
        }
        if (row.joinBeginTime > new Date().getTime()) {
          this.$message.info("报名未开始");
          return false;
        }
        if (row.joinEndTime < new Date().getTime() && row.beginTime > new Date().getTime()) {
          this.$message.info("报名已结束");
          return false;
        }
        if (row.beginTime <= new Date().getTime() && row.endTime >= new Date().getTime()) {
          this.$message.info("活动进行中，不能报名");
          return false;
        }
        if (row.endTime < new Date().getTime()) {
          this.$message.info("活动已结束");
          return false;
        }
        this.id = row.id;
        this.showDialog = true;
      },
      handleSubmitForm() {
        let $el = this.$refs["shangmengSignup"];
        $el.$refs["validateForm"].validate(valid => {
          if (valid) {
            this.isSubmit = true;
            signupShangmengActivity($el.formData).then(res => {
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