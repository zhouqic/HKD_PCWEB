<template>
  <el-row>
    <div class="row-item">
      <div class="row-item-label">活动状态：</div>
      <div class="row-item-content">
        <el-select v-model="disPutaway" @change="handleOnPutawayChange()">
          <el-option :value="-1" label="未上架"></el-option>
          <el-option :value="1" label="已上架"></el-option>
          <el-option :value="0" label="已下架"></el-option>
        </el-select>
        <el-button type="primary" @click="$parent.showDialog = true">创建9.9单品</el-button>
      </div>
    </div>
    <el-table :data="data" style="margin-bottom: 15px;">
      <el-table-column label="活动状态">
        <template slot-scope="scope">
          <span v-if="scope.row.putaway == -1">未上架（审核中）</span>
          <span v-else-if="scope.row.putaway == -2">未上架（审核不通过）</span>
          <span v-else-if="scope.row.putaway == 1">已上架</span>
          <span v-else-if="scope.row.putaway == 0">已下架</span>
        </template>
      </el-table-column>

      <el-table-column label="审核意见" prop="auditNotes"></el-table-column>

      <el-table-column label="名称" prop="name"></el-table-column>

      <el-table-column label="抢购价">
        <template slot-scope="scope">
          <span>{{ scope.row.cheapPrice }} 元</span>
        </template>
      </el-table-column>

      <el-table-column label="原价">
        <template slot-scope="scope">
          <span>{{ scope.row.prePrice }} 元</span>
        </template>
      </el-table-column>

      <el-table-column label="剩余库存">
        <template slot-scope="scope">
          <span>{{ scope.row.leftStock }} 件</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="220">
        <template slot-scope="scope">
          <el-button class="table_operate" type="primary" @click="$parent.handleOpenEditDialog(scope.row)">{{ scope.row.putaway == -1 ? '查看' : '编辑' }}</el-button>
          <el-button class="table_operate" type="warning" v-if="scope.row.putaway == 1 && scope.row.leftStock > 0" @click="handlePutawayGoods(scope.row.id, 0)">下架</el-button>
          <el-button class="table_operate" type="primary" v-else-if="scope.row.putaway == 0" @click="handlePutawayGoods(scope.row.id, 1)">上架</el-button>
          <el-button class="table_operate" type="danger" v-if="scope.row.putaway == 0 || scope.row.putaway == -2 || scope.row.leftStock <= 0" @click="handleDeleteGood(scope.row.id, 3)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination @current-change="handleOnPageChange" :current-page="this.currentPage" layout="total, prev, pager, next, jumper" :total="total" :page-size="pageSize"></el-pagination>
  </el-row>
</template>
<script>
import { getDisProductByCreaterId, putawayRfSingleProduct } from '@/api/bpyinliu';
import { MessageBox } from 'element-ui';

export default {
  data() {
    return {
      data: [],
      currentPage: 1,
      total: 0,
      pageSize: 10,
      disPutaway: -1
    }
  },
  created() {
    this.handleGetDisGoods();
  },
  methods: {
    // 获取9.9单品列表
    handleGetDisGoods() {
      getDisProductByCreaterId({ pageSize: this.pageSize, putaway: this.disPutaway, currentPage: this.currentPage }).then(res => {
        if (res.tableData.rows.length == 0 && this.currentPage - 1 > 0) {
          this.currentPage--;
          this.handleGetDisGoods();
        } else {
          this.data = res.tableData.rows;
          this.pageSize = res.tableData.pageSize;
          this.total = res.tableData.totalSize;
        }
      })
    },
    handleOnPutawayChange() {
      this.currentPage = 1;
      this.handleGetDisGoods();
    },
    handleOnPageChange(page) {
      this.currentPage = page;
      this.handleGetDisGoods();
    },
    handlePutawayGoods(id, type) {
      // type: 0,下架；1,上架；3,删除
      putawayRfSingleProduct({ id: id, putaway: type}).then(res => {
        this.handleGetDisGoods();
      })
    },
    handleDeleteGood(id, type) {
      MessageBox.confirm('您确认要删除该商品吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showCancelButton: true,
        type: 'warning'
      }).then(() => {
        this.handlePutawayGoods(id, type);
      }).catch(() => {});
    }
  },
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
//还原element
/deep/ .el-input--small .el-input__icon {
  line-height: 35px;
}
.row-item /deep/ .el-input {
  width: 200px;
  margin-right: 100px;
}
.row-item {
  color: #606266;
  font-size: 14px;
  overflow: hidden;
  line-height: 32px;
  margin-bottom: 15px;
  .row-item-label {
    float: left;
    width: 70px;
    font-weight: bolder;
    margin-right: 10px;
    b{
      font-size: 16px;
    }
  }
  .row-item-content {
    float: left;
    width: 500px;
  }
}
</style>