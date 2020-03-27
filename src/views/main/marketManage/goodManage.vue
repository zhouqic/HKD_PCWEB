<template>
  <div id="goods-order" class="main-content">
    <el-breadcrumb separator="/" v-if="breadCrumbItem.name" style="margin-bottom: 15px;">
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: breadCrumbItem.path }">{{ breadCrumbItem.name }}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row>
      <el-form :model="formData" ref="formData" label-width="100px">
        <el-form-item class="inline-block" label="商品分类：">
          <el-input placeholder="请输入商品分类" auto-complete="off" v-model.trim="formData.produceClass" 
          @keyup.native.enter="getProductByPageData" @clear="getProductByPageData"></el-input>
        </el-form-item>
        <el-form-item class="inline-block" label="商品名称：">
          <el-input placeholder="请输入商品名称" auto-complete="off" v-model.trim="formData.productName"
           @keyup.native.enter="getProductByPageData" @clear="getProductByPageData"></el-input>
        </el-form-item>
        <el-form-item class="inline-block" label="是否活动：">
          <el-select v-model="formData.isCampaign">
            <el-option value="" label="不限"></el-option>
            <el-option :value="1" label="是"></el-option>
            <el-option :value="0" label="否"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="inline-block" label="是否热卖：">
          <el-select v-model="formData.isHot">
            <el-option value="" label="不限"></el-option>
            <el-option :value="1" label="是"></el-option>
            <el-option :value="0" label="否"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="inline-block" style="margin-bottom: 18px;" label-width="0">
          <el-button type="primary" @click="handleSearchForm()">查询</el-button>
          <el-button type="primary" @click="handleResetForm()">重置</el-button>
          <el-button type="primary" icon="el-icon-plus"  @click="addGoods()" style="margin-left: 50px">添加商品</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-table :data="goodsTableData" style="margin: 15px 0;">
      <el-table-column type="index" label="序号"></el-table-column>

      <el-table-column prop="updateDate" label="更新日期">
        <template slot-scope="scope">
          <span v-if="!scope.row.updateDate">{{ scope.row.updateDate }}</span>
          <span v-else>{{ scope.row.updateDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="title" label="商品名称"></el-table-column>

      <el-table-column prop="putaway" label="上下架状态">
        <template slot-scope="scope">
          <span>{{ scope.row.putaway ?　'上架' : '下架' }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="examine" label="审核状态">
        <template slot-scope="scope">
          <span>{{ scope.row.examine ?　'审核' : '未审核' }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="picture" label="小图" width="120px">
        <template slot-scope="scope">
          <img v-if="scope.row.picture" :src="scope.row.picture" width="105" height="53">
          <span v-else></span>
        </template>
      </el-table-column>

      <el-table-column prop="categoryname1" label="商品分类"></el-table-column>

      <el-table-column prop="maxPrice" label="最高价">
        <template slot-scope="scope">
          <span>￥{{ scope.row.maxPrice}}</span>
        </template>
      </el-table-column>

      <el-table-column prop="minPrice" label="最低价">
        <template slot-scope="scope">
          <span>￥{{ scope.row.minPrice}}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="150px">
        <template slot-scope="scope">
          <el-button class="table_operate" @click="handleEitGoods(scope.row)" type="primary">编辑</el-button>
          <el-button class="table_operate" v-if="!scope.row.putaway" @click="handleSoldOnGoods(scope.row)" type="primary">上架</el-button>
          <el-button class="table_operate" v-if="scope.row.putaway" @click="handleSoldOutGoods(scope.row)" type="warning">下架</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleOnPageChange"
      :current-page="formData.currentPage"
      :page-size="pageSize"
      layout="total, prev, pager, next, jumper"
      :total="tableTotal"
    ></el-pagination>
  </div>
</template>

<script>
import { getProductByPage, deleteProductByPage } from "@/api/marketCommodity";
import { parseTime } from "@/utils";

export default {
  created() {
    //  获取商品列表
    this.getProductByPageData();
  },
  data() {
    return {
      formData: {
        produceClass: '',
        productName: '',
        isCampaign: '',
        isHot: '',
        currentPage: 1
      },
      breadCrumbItem: {
        name: '',
        path: ''
      },
      goodsTableData: [],
      currentPage: 1,
      pageSize: 10,
      tableTotal: 0
    };
  },
  methods: {
  //  获取商品列表
   getProductByPageData() {
      getProductByPage(this.formData).then(res => {
        this.goodsTableData = res.tableData.records;
        this.tableTotal = res.tableData.total;
      })
    },
    // 表格分页
    handleOnPageChange(val) {
      this.formData.currentPage = val;
      this.getProductByPageData();
    },
    // 查询商品
    handleSearchForm() {
      this.formData.currentPage = 1;
      this.getProductByPageData();
    },
    // 重置查询商品
    handleResetForm() {
      this.formData = {
        produceClass: '',
        productName: '',
        isCampaign: '',
        isHot: ''
      }
      //  获取查询商品
      this.handleSearchForm();
    },
    // 上架商品
    handleSoldOnGoods(row) {
      this.$confirm(`确定上架${row.title}吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let option = {
          id: row.id,
          putaway: 1
        };
        deleteProductByPage(option).then(res => {
          this.$message({
            message: '上架成功',
            type: "success"
          });
          this.getProductByPageData(); //  获取商品列表
        })
      }).catch(() => {});
    },
    // 下架商品
    handleSoldOutGoods(row) {
      this.$confirm(`确定下架${row.title}吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let option = {
          id: row.id,
          putaway: 0
        };
        deleteProductByPage(option).then(res => {
          this.$message({
            message: '下架成功',
            type: "success"
          });
          this.getProductByPageData(); //  获取商品列表
        })
      }).catch(() => {});
    },
    // 编辑商品
    handleEitGoods(row) {
      this.$router.push({
        name: 'goodSet',
        params: {
          id: row.id
        }
      })
    },
    // 添加商品
    addGoods() {
      sessionStorage.removeItem("goodId");
      this.$router.push({ name: 'goodSet' });
    }
  }
};
</script>
<style lang="scss" scoped>
#goods-order .el-select {
  width: 100px;
}
#goods-order .el-input {
  width: 100% !important;
}
</style>
