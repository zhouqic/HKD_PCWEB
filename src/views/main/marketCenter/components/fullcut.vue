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
    <el-button type="primary" @click="handleOpenDialog(0)">创建活动</el-button>
  </el-header>
  <!-- 列表 -->
  <el-table :data="tableData" style="margin-bottom: 15px;">
    <el-table-column label="满减方式">
      <template slot-scope="scope">
        <template v-for="(item, i) in scope.row.rfFullCuts">
          <div :key="i" v-if="item.type == 1">{{ (i + 1) + ".满" + item.fullMoney + "减" + item.reduceMoney + "元" }}</div>
          <div :key="i" v-else>{{ "满" + item.fullMoney + "随机减" + item.randomMinMoney + "~" + item.randomMaxMoney + "元" }}</div>
        </template>
      </template>
    </el-table-column>

    <el-table-column label="是否叠加使用">
      <template slot-scope="scope">
        <span v-if="scope.row.isAlone == 0">可与其他优惠叠加使用</span>
        <span v-else-if="scope.row.isAlone == 1">不可与其他优惠叠加使用</span>
      </template>
    </el-table-column>

    <el-table-column label="开始时间">
      <template slot-scope="scope">
        {{ scope.row.beginTime | parseTime('{y}-{m}-{d}') }}
      </template>
    </el-table-column>

    <el-table-column label="结束时间" :formatter="row => getNowFormatDate(row.endTime)"></el-table-column>

    <el-table-column label="活动状态">
      <template slot-scope="scope">
        <el-tag v-if="scope.row.status == 0 && scope.row.endTime >= new Date().getTime()" type="success">进行中</el-tag>
        <el-tag v-else type="info">已结束</el-tag>
      </template>
    </el-table-column>

    <el-table-column label="操作" v-if="status == 0">
      <template slot-scope="scope">
        <el-button class="table_operate" v-if="scope.row.status == 0 && scope.row.endTime >= new Date().getTime()" plain type="danger" @click="handleStopActivity(scope.row)">结束活动</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页 -->
  <el-footer>
    <el-pagination @current-change="handleOnPageChange" :current-page="page" layout="total, prev, pager, next, jumper" :total="total" :page-size="10"></el-pagination>
  </el-footer>
  <!-- 弹窗 -->
  <el-dialog title="添加活动" :visible.sync="showDialog" width="600px" :close-on-click-modal="false" :close-on-press-escape="false">
    <fullcut-form ref="fullcutForm" v-if="showDialog"></fullcut-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="showDialog = false">取 消</el-button>
      <el-button type="primary" :disabled="isSubmit ? true : false" @click="handleSubmitForm">确 定</el-button>
    </span>
  </el-dialog>
</div>
</template>
<script>
import { getRfFullCutList, addFullCutActive, stopRfFullCutActiveById } from '@/api/marketCenter';
import { getNowFormatDate } from '@/utils';
import fullcutForm from './fullcutForm';

  export default {
    components: { fullcutForm },
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
        getRfFullCutList({ "pageNo": this.page, status: this.status }).then(res => {
          this.tableData = res.tableData;
          this.total = res.totalSize;
        })
      },
      handleStopActivity(row) {
        this.$confirm('您确认要结束该活动吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          showCancelButton: true,
          type: 'warning'
        }).then(() => {
          stopRfFullCutActiveById({ activeId: row.id }).then(res => {
            this.$message.success("活动已结束");
            this.handleGetTableData();
          })
        }).catch(() => {});
      },
      handleOpenDialog() {
        getRfFullCutList({ "pageNo": this.page, status: 0 }).then(res => {
          if (res.totalSize > 0) {
            this.$message.error('已经有正在进行中的活动了哦');
            return false;
          }
          this.showDialog = true;
        })
      },
      handleSubmitForm() {
        let $el = this.$refs["fullcutForm"];
        $el.$refs["validateForm"].validate(valid => {
          if (valid) {
            this.isSubmit = true;
            addFullCutActive($el.formData).then(res => {
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