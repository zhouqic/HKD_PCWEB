<template>
<el-container>
  <!-- 添加活动 -->
  <el-header style="padding-left:0;">
    <el-button type="primary" @click="showDialog=true;">添加专享优惠券</el-button>
  </el-header>
  <!-- 列表 -->
  <el-table :data="tableData" style="margin-bottom: 15px;">
    <el-table-column label="名称" prop="title"></el-table-column>

    <el-table-column label="面额">
      <template slot-scope="scope">
        {{ scope.row.reduceCost + ' 元' }}
      </template>
    </el-table-column>

    <el-table-column label="使用条件">
      <template slot-scope="scope">
        {{ '满 ' + scope.row.leastCost + ' 元，可以使用' }}
      </template>
    </el-table-column>

    <el-table-column label="有效期">
      <template slot-scope="scope">
        {{ '领取后 ' + scope.row.fixedTerm + ' 天过期' }}
      </template>
    </el-table-column>

    <el-table-column label="操作" width="100px">
      <template slot-scope="scope">
        <el-button class="table_operate" plain type="danger" @click="handleDelCards(scope.row.id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 弹窗 -->
  <el-dialog title="添加专享优惠券" :visible.sync="showDialog" width="600px" :close-on-click-modal="false" :close-on-press-escape="false" @close="handleCloseDialog">
    <specialcard-form ref="specialcardForm" v-if="showDialog"></specialcard-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCloseDialog">取 消</el-button>
      <el-button type="primary" :disabled="isSubmit ? true : false" @click="handleSubmitForm">确 定</el-button>
    </span>
  </el-dialog>
</el-container>
</template>
<script>
import { getMemberSpecialCardList, addMemberSpecialCard, deleteMemberSpecialCard } from '@/api/marketCenter';
import specialcardForm from './specialcardForm';

  export default {
    components: { specialcardForm },
    data() {
      return {
        tableData: [],
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
      handleCloseDialog() {
        this.showDialog = false;
        this.isSubmit = false;
      },
      handleGetTableData() {
        getMemberSpecialCardList().then(res => {
          this.tableData = res.tableData;
          this.total = res.totalSize;
        })
      },
      handleDelCards(id) {
        this.$confirm("您确认要删除该优惠券吗?", '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          showCancelButton: true,
          type: 'warning'
        }).then(() => {
          deleteMemberSpecialCard({ id: id }).then(res => {
            this.$message.success("删除成功");
            this.handleGetTableData();
          })
        }).catch(() => {});
      },
      handleSubmitForm() {
        let $el = this.$refs["specialcardForm"];
        if ($el.id) {
          this.isSubmit = true;
          addMemberSpecialCard({ cardId: $el.id }).then(res => {
            this.isSubmit = false;
            this.showDialog = false;
            this.handleGetTableData();
            this.$message.success("保存成功");
          }).catch(() => {
            this.isSubmit = false;
          });
        } else {
          this.$message.error("请选择优惠券")
        }
      }
    }
  }
</script>