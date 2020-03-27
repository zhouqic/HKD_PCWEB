<template>
<div class="main-content">
  <!-- 添加活动 -->
  <el-header style="padding-left:0;">
    <el-button type="primary" @click="showDialog=true;">创建会员等级</el-button>
  </el-header>
  <!-- 列表 -->
  <el-table :data="tableData" style="margin-bottom: 15px;">
    <el-table-column label="名称" prop="gradeName"></el-table-column>

    <el-table-column label="等级" prop="grade"></el-table-column>

    <el-table-column label="成长值">
      <template slot-scope="scope">
        <span>{{ scope.row.minGrowValue }} ~ {{ scope.row.maxGrowValue }}</span>
      </template>
    </el-table-column>

    <el-table-column label="积分赠送">
      <template slot-scope="scope">
        <span v-if="scope.row.points">每消费 1 元，赠送 {{ scope.row.points }} 倍积分</span>
        <span v-else>无</span>
      </template>
    </el-table-column>

    <el-table-column label="专享优惠券">
      <template slot-scope="scope">
        <span v-if="scope.row.maxCardNum">每人每月可领取 {{ scope.row.maxCardNum }} 张</span>
        <span v-else>无</span>
      </template>
    </el-table-column>

    <el-table-column label="专属商品券">
      <template slot-scope="scope">
        <span v-if="scope.row.maxEntityCard">每人每月可领取 {{ scope.row.maxEntityCard }} 张</span>
        <span v-else>无</span>
      </template>
    </el-table-column>

    <el-table-column label="门店特权">
      <template slot-scope="scope">
        <div v-if="scope.row.privilege1">1、{{ scope.row.privilege1 }}</div>
        <div v-if="scope.row.privilege2">2、{{ scope.row.privilege2 }}</div>
        <div v-if="scope.row.privilege3">3、{{ scope.row.privilege3 }}</div>
      </template>
    </el-table-column>

    <el-table-column label="创建日期">
      <template slot-scope="scope">
        {{ scope.row.createDate | parseTime('{y}-{m}-{d} {h}:{m}:{s}') }}
      </template>
    </el-table-column>

    <el-table-column label="操作" width="120">
      <template slot-scope="scope">
        <el-button class="table_operate" plain type="primary" @click="handleEditMemberLevel(scope.row.id)">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 弹窗 -->
  <el-dialog title="添加活动" :visible.sync="showDialog" width="600px" @close="id='';" :close-on-click-modal="false" :close-on-press-escape="false">
    <member-grade-form ref="memberGradeForm" v-if="showDialog" :id="id"></member-grade-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="showDialog=false;id='';">取 消</el-button>
      <el-button type="primary" :disabled="isSubmit ? true : false" @click="handleSubmitForm">确 定</el-button>
    </span>
  </el-dialog>
</div>
</template>
<script>
import { getMemberGradeSet, addMemberGradeSet } from '@/api/marketCenter';
import memberGradeForm from './memberGradeForm';

  export default {
    components: { memberGradeForm },
    data() {
      return {
        id: '',
        tableData: [],
        isSubmit: false,
        showDialog: false
      }
    },
    created() {
      this.handleGetTableData();
    },
    methods: {
      handleGetTableData() {
        getMemberGradeSet().then(res => {
          this.tableData = res.tableData;
        })
      },
      handleEditMemberLevel(id) {
        this.id = id;
        this.showDialog = true;
      },
      handleSubmitForm() {
        let $el = this.$refs["memberGradeForm"];
        $el.$refs["validateForm"].validate(valid => {
          if (valid) {
            this.isSubmit = true;
            addMemberGradeSet($el.formData).then(res => {
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