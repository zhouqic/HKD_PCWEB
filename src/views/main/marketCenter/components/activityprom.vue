<template>
<el-container>
  <!-- 添加活动 -->
  <el-header style="padding-left:0;" v-if="tableData.length == 0">
    <el-button type="primary" @click="handleOpenDialog(0)">创建活动</el-button>
  </el-header>
  <!-- 列表 -->
  <el-table :data="tableData" style="margin-bottom: 15px;">
    <el-table-column label="名称">
      <template slot-scope="scope">
        <template v-if="scope.row.card">
          {{ scope.row.card.reduceCost + "元代金券，满" + scope.row.card.leastCost + "元可用" }}
        </template>
        <template v-else>
          {{ scope.row.exchangeName }}
        </template>
      </template>
    </el-table-column>

    <el-table-column label="总张数">
      <template slot-scope="scope">
        <template v-if="scope.row.card">
          {{ (scope.row.cardNum ? scope.row.cardNum : 0) + "张" }}
        </template>
        <template v-else>
          {{ (scope.row.exchangeNum ? scope.row.exchangeNum : 0) + "张" }}
        </template>
      </template>
    </el-table-column>

    <el-table-column label="已领取数量">
      <template slot-scope="scope">
        <template v-if="scope.row.card">
          {{ (scope.row.cardGetNum ? scope.row.cardGetNum : 0) + "张" }}
        </template>
        <template v-else>
          {{ (scope.row.exchangeGetNum ? scope.row.exchangeGetNum : 0) + "张" }}
        </template>
      </template>
    </el-table-column>

    <el-table-column label="有效期">
      <template slot-scope="scope">
        {{ scope.row.redBeginTime | parseTime('{y}-{m}-{d}') }} 至 {{ scope.row.redEndTime | parseTime('{y}-{m}-{d}') }}
      </template>
    </el-table-column>

    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button class="table_operate" plain type="danger" @click="handleDelActivity(scope.row.id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 弹窗 -->
  <el-dialog title="添加活动" :visible.sync="showDialog" width="600px" :close-on-click-modal="false" :close-on-press-escape="false">
    <activity-form ref="activityForm" v-if="showDialog"></activity-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="showDialog = false">取 消</el-button>
      <el-button type="primary" :disabled="isSubmit ? true : false" @click="handleSubmitForm">确 定</el-button>
    </span>
  </el-dialog>
</el-container>
</template>
<script>
import { getExpandRulebyCreaterId, addExpandCodeRule, delExpandRulebyId } from '@/api/marketCenter';
import activityForm from './activityForm';

  export default {
    components: { activityForm },
    data() {
      return {
        tableData: [],
        status: '',
        isSubmit: false,
        showDialog: false
      }
    },
    created() {
      this.handleGetTableData();
    },
    methods: {
      handleGetTableData() {
        getExpandRulebyCreaterId().then(res => {
          this.tableData = res.tableData ? [res.tableData] : [];
        })
      },
      handleDelActivity(id) {
        this.$confirm('您确认要删除该活动吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          showCancelButton: true,
          type: 'warning'
        }).then(() => {
          delExpandRulebyId({ expandRuleId: id }).then(res => {
            this.$message.success("活动已删除");
            this.handleGetTableData();
          })
        }).catch(() => {});
      },
      handleOpenDialog() {
        this.showDialog = true;
      },
      handleSubmitForm() {
        let $el = this.$refs["activityForm"];
        $el.$refs["validateForm"].validate(valid => {
          if (valid) {
            this.isSubmit = true;
            addExpandCodeRule($el.formData).then(res => {
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