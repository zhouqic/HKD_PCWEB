<template>
  <div id="classify" class="main-content">
    <el-row>
      <el-button type="primary" icon="el-icon-plus" @click="id = '';showDialog = true;">录入</el-button>
    </el-row>
    <!-- 表格 -->
    <el-table :data="tableData" style="margin: 15px auto;" lazy :load="handleLoadNextNode" row-key="id">

      <el-table-column label="名称" prop="title"></el-table-column>

      <el-table-column label="分类图片" prop="picture">
        <template slot-scope="scope">
          <img v-if="scope.row.picture" :src="scope.row.picture" width="53" height="53">
        </template>
      </el-table-column>

      <el-table-column label="优先级" prop="priority"></el-table-column>

      <el-table-column label="是否有子节点">
        <template slot-scope="scope">
          <span>{{ scope.row.hasChild ? '是' : '否' }}</span>
        </template>
      </el-table-column>

      <el-table-column label="是否可用优惠">
        <template slot-scope="scope">
          <span>{{ scope.row.hasDiscount ? '是' : '否' }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" min-width="130px">
        <template slot-scope="scope">
          <el-button class="table_operate" type="primary" @click="handleOpenEidtDialog(scope.row.id)">编辑</el-button>
          <el-button class="table_operate" type="danger" @click="handleDeleteProduct(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 产品分类录入 -->
    <el-dialog title="商品分类信息设置" :visible.sync="showDialog" width="600px" :close-on-click-modal="false" :close-on-press-escape="false">
      <classify-form v-if="showDialog" :id="id" ref="classifyForm"></classify-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="primary" :disabled="isSubmit ? true : false" @click="$refs['classifyForm'].handleSubmitForm();">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getProductList, getProduct, saveProduct, deleteProduct, findProductName } from "@/api/marketCommodity";
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import ClassifyForm from "./components/classifyForm";

export default {
  components: { Treeselect, ClassifyForm },
  data() {
    return {
      tableData: [],
      isSubmit: false,
      showDialog: false,
      id: ""
    };
  },
  created() {
    this.handleGetTableData();
  },
  methods: {
    // 获取商品分类列表
    handleGetTableData() {
      getProductList({}).then(res => {
        res.tableData.forEach(item => {
          if (item.hasChild && item.childCount) {
            item.hasChildren = true;
          }
        });
        this.tableData = res.tableData;
      });
    },
    // 表格懒加载
    handleLoadNextNode(tree, treeNode, resolve) {
      getProductList({ parentId: tree.id }).then(res => {
        res.tableData.forEach(item => {
          if (item.hasChild && item.childCount) {
            item.hasChildren = true;
          }
        });
        resolve(res.tableData);
      });
    },
    // 编辑商品分类
    handleOpenEidtDialog(id) {
      this.id = id;
      this.showDialog = true;
    },
    // 删除商品分类
    handleDeleteProduct(id) {
      this.$confirm(`确定删除该商品分类吗?删除该分类后，分类下的商品将保留至未分类中`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteProduct({ id: id}).then(res => {
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.handleGetTableData();
        });
      }).catch(() => {});
    }
  }
};
</script>