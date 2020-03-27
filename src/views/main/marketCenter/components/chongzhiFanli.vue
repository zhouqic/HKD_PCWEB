<template>
<div class="main-content">
  <!-- 添加活动 -->
  <el-header style="padding-left:0;">
    <span class="item_label" style="font-size:14px;color:#606266;line-height:32px;font-weight:bolder;">活动状态：</span>
    <el-select v-model="status" @change="page=1;handleGetTableData()" style="width:120px;margin-right:80px;">
      <el-option label="进行中" :value="0"></el-option>
      <el-option label="已结束" :value="1"></el-option>
    </el-select>
    <el-button type="primary" @click="handleOpenDialog()">创建活动</el-button>
  </el-header>
  <!-- 列表 -->
  <el-table :data="tableData" style="margin-bottom: 15px;">
    <el-table-column label="返利类型">
      <template slot-scope="scope">
        <span v-if="scope.row.type == 0">充值返现金</span>
        <span v-else-if="scope.row.type == 1">充值返实物券</span>
      </template>
    </el-table-column>

    <el-table-column label="充值金额">
      <template slot-scope="scope">
        <span>{{ scope.row.recharge + "元" }}</span>
      </template>
    </el-table-column>

    <el-table-column label="赠送物品">
      <template slot-scope="scope">
        <span v-if="scope.row.type == 0">{{ scope.row.give != 0 ? (scope.row.give + "元现金") : "无赠送" }}</span>
        <span v-else-if="scope.row.type == 1">{{ scope.row.give }}</span>
      </template>
    </el-table-column>

    <el-table-column label="返利规则">
      <template slot-scope="scope">
        <span v-if="scope.row.type == 0">{{  scope.row.giveTime ? ("分" + scope.row.giveTime + "个月返还") : "无分期" }}</span>
        <span v-else-if="scope.row.type == 1">{{ "领取后" + scope.row.endTime + "天内有效" }}</span>
      </template>
    </el-table-column>

    <el-table-column label="备注说明" :formatter="row => row.rechargeDesc ? row.rechargeDesc : '无'"></el-table-column>

    <el-table-column label="创建时间">
      <template slot-scope="scope">
        {{ scope.row.createDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
      </template>
    </el-table-column>
    
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button v-if="scope.row.status != 1" class="table_operate" plain type="danger" @click="handleDelActivity(scope.row.id)">结束活动</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页 -->
  <el-footer>
    <el-pagination @current-change="handleOnPageChange" :current-page="page" layout="total, prev, pager, next, jumper" :total="total" :page-size="10"></el-pagination>
  </el-footer>
  <!-- 弹窗 -->
  <el-dialog title="添加规则" :visible.sync="showDialog" width="600px" :close-on-click-modal="false" :close-on-press-escape="false">
    <chongzhifanli-form ref="chongzhifanliForm" v-if="showDialog"></chongzhifanli-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="showDialog = false">取 消</el-button>
      <el-button type="primary" :disabled="isSubmit ? true : false" @click="handleSubmitForm">确 定</el-button>
    </span>
  </el-dialog>
</div>
</template>
<script>
import { getRfRechargeRules, saveRfRechargeRule, deleteRfRechargeRuleById } from '@/api/marketCenter';
import chongzhifanliForm from './chongzhifanliForm';

  export default {
    components: { chongzhifanliForm },
    data() {
      return {
        tableData: [],
        page: 1,
        total: 0,
        status: 0,
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
        getRfRechargeRules({ status: this.status, pageNo: this.page }).then(res => {
          this.tableData = res.tableData;
          this.total = res.totalSize;
          this.$forceUpdate();
        })
      },
      handleDelActivity(id) {
        this.$confirm('您确认要结束该活动吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          showCancelButton: true,
          type: 'warning'
        }).then(() => {
          deleteRfRechargeRuleById({ id: id }).then(res => {
            this.$message.success("活动已结束");
            this.handleGetTableData();
          })
        }).catch(() => {});
      },
      handleOpenDialog() {
        this.showDialog = true;
      },
      handleSubmitForm() {
        let $el = this.$refs["chongzhifanliForm"];
        $el.$refs["validateForm"].validate(valid => {
          if (valid) {
            this.isSubmit = true;
            saveRfRechargeRule($el.formData).then(res => {
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