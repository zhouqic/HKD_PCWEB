<template>
  <div id="carousel" class="main-content">
    <el-row class="search">
      <el-button type="primary" @click="id = '';showDialog = true;">新增</el-button>
    </el-row>
    <!-- 表格 -->
    <el-table :data="tableData" style="margin-bottom: 15px;">

      <el-table-column type="index" label="序号" width="80"></el-table-column>

      <el-table-column label="跳转位置">
        <template slot-scope="scope">
          <span v-if="scope.row.jumplocate == 3">商品列表</span>
          <span v-else-if="scope.row.jumplocate == 7">商品详情</span>
          <span v-else-if="scope.row.jumplocate == 0">不跳转</span>
        </template>
      </el-table-column>

      <el-table-column prop="picture" label="图片">
        <template slot-scope="scope">
          <img v-if="scope.row.picture" :src="scope.row.picture" width="105" height="53" />
        </template>
      </el-table-column>

      <el-table-column prop="createDate" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 0">未启用</span>
          <span v-else>启用</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="240" fixed="right">
        <template slot-scope="scope">
          <el-button class="table_operate" type="warning" @click="handleForbiddenClick(scope.row)">{{ scope.row.status == 0 ? '启用' : '禁用' }}</el-button>
          <el-button class="table_operate" type="primary" @click="handleOpenEditDialog(scope.row)">编辑</el-button>
          <el-button class="table_operate" type="danger" @click="handleOnDeleteClick(scope.row)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>
    <!-- 分页 -->
    <el-pagination @current-change="handleOnPageChange" :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="total"></el-pagination>
    <!-- 添加轮播图 -->
    <el-dialog title="轮播图设置" :visible.sync="showDialog" width="600px" :close-on-click-modal="false" :close-on-press-escape="false">
     <slide-form v-if="showDialog" :id="id" ref="SlideForm"></slide-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false;">取 消</el-button>
        <el-button type="primary" :disabled="isSubmit ? true : false" @click="$refs['SlideForm'].handleSubmitForm();">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getSlideListShow, deleteSlideShow, saveSlideShow } from "@/api/marketSettings";
import SlideForm from "./components/sliderForm"

export default {
  components: { SlideForm },
  data() {
    return {
      tableData: [], // 轮播图表格数据
      pageSize: 10,
      currentPage: 1,
      total: 0,
      id: "",
      isSubmit: false,
      showDialog: false
    };
  },
  created() {
    // 获取轮播图
    this.handleGetTableData();
  },
  methods: {
    // 获取表格数据
    handleGetTableData() {
      getSlideListShow({ currentPage: this.currentPage }).then(res => {
        if (res.tableData.records.length == 0 && this.currentPage - 1 > 0) {
          this.currentPage--;
          this.handleGetTableData();
        } else {
          this.tableData = res.tableData.records;
          this.total = res.tableData.total;
          this.pageSize = res.tableData.size;
        }
      });
    },
    // 分页
    handleOnPageChange(val) {
      this.currentPage = val;
      this.handleGetTableData();
    },
    // 禁用/启用某个轮播图
    handleForbiddenClick(row) {
      let formData = new FormData();
      formData.append("id", row.id);
      formData.append("status", row.status ? 0 : 1);
      saveSlideShow(formData).then(res => {
        this.handleGetTableData();
        this.$message({
          type: "success",
          message: row.status ? "禁用成功" : "启用成功"
        });
      });
    },
    // 编辑某个轮播图
    handleOpenEditDialog(row) {
      this.id = row.id;
      this.showDialog = true;
    },
    // 删除某个轮播图
    handleOnDeleteClick(row) {
      this.$confirm("确定删除该轮播图吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteSlideShow({ id: row.id }).then(res => {
          this.$message({
            type: "success",
            message: res.msg
          });
          this.handleGetTableData();
        });
      }).catch(() => {});
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss">
#carousel {
  .search {
    margin-bottom: 15px;
  }
}
</style>
