<template>
<el-container>
  <!-- 添加活动 -->
  <el-header style="padding-left:0;">
    <el-button type="primary" @click="showDialog=true;">创建活动</el-button>
  </el-header>
  <!-- 列表 -->
  <el-table :data="tableData" style="margin-bottom: 15px;">
    <el-table-column label="商品名称" prop="name"></el-table-column>

    <el-table-column label="商品图">
      <template slot-scope="scope">
        <img v-if="scope.row.displayPic" :src="scope.row.displayPic" width="50" height="50">
      </template>
    </el-table-column>

    <el-table-column label="原价" :formatter="row => parseFloat(row.prePrice).toFixed(2) + '元'"></el-table-column>

    <el-table-column label="兑换积分" :formatter="row => row.pointPrice + '积分'"></el-table-column>

    <el-table-column label="兑换现金" :formatter="row => parseFloat(row.cheapPrice).toFixed(2) + '元'"></el-table-column>
    
    <el-table-column label="剩余库存" :formatter="row => row.leftStock + '件'"></el-table-column>

    <el-table-column label="活动状态">
      <template slot-scope="scope">
        <el-tag v-if="scope.row.putaway == 1" type="success">上架中</el-tag>
        <el-tag v-else type="info">已下架</el-tag>
      </template>
    </el-table-column>

    <el-table-column label="操作" width="200px">
      <template slot-scope="scope">
        <el-button class="table_operate" plain type="primary" @click="handleOpenEidtDialog(scope.row.id)">编辑</el-button>
        <el-button class="table_operate" v-if="scope.row.putaway == 1" plain type="warning" @click="handleResolvePutway(scope.row.id, 0)">下架</el-button>
        <el-button class="table_operate" plain v-else type="primary" @click="handleResolvePutway(scope.row.id, 1)">上架</el-button>
        <el-button class="table_operate" plain type="danger" @click="handleResolvePutway(scope.row.id, 3)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页 -->
  <el-footer>
    <el-pagination @current-change="handleOnPageChange" :current-page="page" layout="total, prev, pager, next, jumper" :total="total" :page-size="10"></el-pagination>
  </el-footer>
  <!-- 弹窗 -->
  <el-dialog title="创建商品" :visible.sync="showDialog" width="600px" :close-on-click-modal="false" :close-on-press-escape="false" @close="handleCloseDialog">
    <pointsproduct-form ref="pointsproductForm" :id="id" v-if="showDialog"></pointsproduct-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCloseDialog">取 消</el-button>
      <el-button type="primary" v-if="showDialog && showNextBtn" :disabled="isSubmit ? true : false" @click="handleGoNextStep">下一步</el-button>
      <el-button type="primary" v-if="showDialog && showYunBtn"  @click="$router.push({ name: 'yunFitment'})">前往云店装修</el-button>
      <el-button type="primary" v-if="!showNextBtn && !showYunBtn" :disabled="isSubmit ? true : false" @click="handleSubmitForm">确 定</el-button>
    </span>
  </el-dialog>
</el-container>
</template>
<script>
import { getPointsProductList, savePointsProduct, putawayPointsProduct } from '@/api/marketCenter';
import pointsproductForm from './pointsproductForm';

  export default {
    components: { pointsproductForm },
    data() {
      return {
        id: '',
        tableData: [],
        page: 1,
        total: 0,
        isSubmit: false,
        showDialog: false,
        showNextBtn: true,
        showYunBtn: false
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
        this.id = '';
        this.showDialog = false;
        this.showYunBtn = false;
        this.showNextBtn = true;
        this.isSubmit = false;
      },
      handleOpenEidtDialog(id) {
        this.id = id;
        this.showDialog = true;
        this.showYunBtn = false;
        this.showNextBtn = false;
      },
      handleGetTableData() {
        getPointsProductList({ "pageNo": this.page, putaway: '' }).then(res => {
          this.tableData = res.tableData;
          this.total = res.totalSize;
        })
      },
      handleResolvePutway(id, type) {
        if (type != 1) {
          this.$confirm(`您确认要${type == 3 ? '删除' : (type == 0 ? '下架' : '')}该商品吗?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            showCancelButton: true,
            type: 'warning'
          }).then(() => {
            putawayPointsProduct({ id: id, putaway: type }).then(res => {
              this.$message.success(`${type == 3 ? '删除' : (type == 0 ? '下架' : '')}成功`);
              this.handleGetTableData();
            })
          }).catch(() => {});
        } else {
          putawayPointsProduct({ id: id, putaway: type }).then(res => {
            this.$message.success("上架成功");
            this.handleGetTableData();
          })
        }
      },
      handleGoNextStep() {
        this.showNextBtn = false;
        this.$refs['pointsproductForm'].activeStep = 1;
        this.$refs['pointsproductForm'].processStatus = 'text';
      },
      handleSubmitForm() {
        let $el = this.$refs["pointsproductForm"].$refs["pointsproductInfo"];
        $el.$refs["validateForm"].validate(valid => {
          if (valid) {
            this.isSubmit = true;
            let data = new FormData();
            $el.formData.putaway = 1;
            Object.keys($el.formData).forEach(item => {
              data.append(item, $el.formData[item])
            });
            if (this.id && typeof $el.formData.detailPic == "string") {
              data.set("detailPicUrl", $el.formData.detailPic);
              data.delete("detailPic");
            }
            if (this.id && typeof $el.formData.displayPic == "string") {
              data.set("displayPicUrl", $el.formData.displayPic);
              data.delete("displayPic");
            }
            savePointsProduct(data).then(res => {
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