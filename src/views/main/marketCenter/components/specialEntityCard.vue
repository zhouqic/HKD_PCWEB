<template>
<el-container>
  <!-- 添加活动 -->
  <el-header style="padding-left:0;">
    <el-button type="primary" @click="showDialog=true;">添加专享商品券</el-button>
  </el-header>
  <!-- 列表 -->
  <el-table :data="tableData" style="margin-bottom: 15px;">
    <el-table-column label="名称">
      <template slot-scope="scope">
        {{ scope.row.rfEntityCard.title }}
      </template>
    </el-table-column>

    <el-table-column label="图片">
      <template slot-scope="scope">
        <img v-if="scope.row.rfEntityCard.pic" :src="scope.row.rfEntityCard.pic" width="50" height="50">
      </template>
    </el-table-column>

    <el-table-column label="价值">
      <template slot-scope="scope">
        {{ scope.row.rfEntityCard.price + ' 元' }}
      </template>
    </el-table-column>

    <el-table-column label="有效期">
      <template slot-scope="scope">
        {{ '领取后 ' + scope.row.rfEntityCard.validDays + ' 天内有效' }}
      </template>
    </el-table-column>

    <el-table-column label="操作" width="100px">
      <template slot-scope="scope">
        <el-button class="table_operate" plain type="danger" @click="handleDelCards(scope.row.id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 弹窗 -->
  <el-dialog title="添加专享商品券" :visible.sync="showDialog" width="600px" :close-on-click-modal="false" :close-on-press-escape="false" @close="handleCloseDialog">
    <specialentity-cardform ref="specialentityCardform" v-if="showDialog"></specialentity-cardform>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCloseDialog">取 消</el-button>
      <el-button type="primary" :disabled="isSubmit ? true : false" @click="handleSubmitForm">确 定</el-button>
    </span>
  </el-dialog>
</el-container>
</template>
<script>
import { findSpecialEntityCardList, addSpecialEntityCard, delSpecialEntityCard } from '@/api/marketCenter';
import specialentityCardform from './specialentityCardform';

  export default {
    components: { specialentityCardform },
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
        findSpecialEntityCardList().then(res => {
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
          delSpecialEntityCard({ id: id }).then(res => {
            this.$message.success("删除成功");
            this.handleGetTableData();
          })
        }).catch(() => {});
      },
      handleSubmitForm() {
        let $el = this.$refs["specialentityCardform"];
        if ($el.id) {
          this.isSubmit = true;
          addSpecialEntityCard({ cardId: $el.id }).then(res => {
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