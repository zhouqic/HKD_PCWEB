<template>
<div class="main-content">
  <!-- 添加活动 -->
  <el-header style="padding-left:0;">
    <span class="item_label" style="font-size:14px;color:#606266;line-height:32px;font-weight:bolder;">状态：</span>
    <el-select v-model="status" @change="page=1;handleGetTableData()" style="width:120px;margin-right:80px;">
      <el-option label="不限" :value="''"></el-option>
      <el-option label="进行中" :value="0"></el-option>
      <el-option label="已结束" :value="1"></el-option>
    </el-select>
    <el-button type="primary" @click="showDialog=true">添加礼包</el-button>
  </el-header>
  <!-- 列表 -->
  <el-table :data="tableData" style="margin-bottom: 15px;">
    <el-table-column label="礼包名称">
      <template slot-scope="scope">
        <span style="color:#F56C6C;font-weight:bolder;">{{ scope.row.needFees == 0 ? "免费" : (scope.row.fees + "元") }}</span>开卡礼包
      </template>
    </el-table-column>

    <el-table-column label="专享礼品总值">
      <template slot-scope="scope">
        {{ parseFloat(scope.row.exchangePrice) ? (scope.row.exchangePrice + "元") : '无' }}
      </template>
    </el-table-column>

    <el-table-column label="优惠券总值">
      <template slot-scope="scope">
        {{ scope.row.cardPrice ? (scope.row.cardPrice + "元") : '无' }}
      </template>
    </el-table-column>

    <el-table-column label="积分">
      <template slot-scope="scope">
        <span>{{ scope.row.pointPrice ? scope.row.pointPrice : '无' }}</span>
      </template>
    </el-table-column>

    <el-table-column label="现金红包">
      <template slot-scope="scope">
        {{ scope.row.redPackPrice ? (scope.row.redPackPrice + "元") : '无' }}
      </template>
    </el-table-column>

    <el-table-column label="活动状态">
      <template slot-scope="scope">
        <el-tag v-if="scope.row.status == 0" type="success">进行中</el-tag>
        <el-tag v-else type="info">已结束</el-tag>
      </template>
    </el-table-column>

    <el-table-column label="创建日期">
      <template slot-scope="scope">
        {{ scope.row.createDate | parseTime('{y}-{m}-{d}') }}
      </template>
    </el-table-column>

    <el-table-column label="操作" width="180px">
      <template slot-scope="scope">
        <el-button class="table_operate" plain @click="handleShowDetail(scope.row.id)">查看详情</el-button>
        <el-button class="table_operate" v-if="scope.row.status === 0" plain type="danger" @click="handleDelActivity(scope.row.id)">结束活动</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页 -->
  <el-footer>
    <el-pagination @current-change="handleOnPageChange" :current-page="page" layout="total, prev, pager, next, jumper" :total="total" :page-size="10"></el-pagination>
  </el-footer>
  <!-- 添加新人礼 -->
  <el-dialog :title="id ? '礼包详情' : '添加礼包'" :visible.sync="showDialog" width="800px" @close="showDialog=false;id=''" :close-on-click-modal="false" :close-on-press-escape="false">
    <!-- 创建活动 -->
    <opencard-form ref="opencardForm" v-if="showDialog && !id" :type="1"></opencard-form>
    <!-- 详情 -->
    <opencard-detail ref="opencardDetail" v-if="id" :id="id" :type="1"></opencard-detail>
    <span slot="footer" class="dialog-footer">
      <el-button @click="showDialog=false;id=''">取 消</el-button>
      <el-button type="primary" :disabled="isSubmit ? true : false" @click="handleSubmitForm">确 定</el-button>
    </span>
  </el-dialog>
</div>
</template>
<script>
import { getRfNewGiftsByCreaterId, stopRfNewGiftPackActive, addRfNewGiftPack } from '@/api/marketCenter';
import opencardForm from './opencardForm';
import opencardDetail from './opencardDetail';

  export default {
    components: { opencardForm, opencardDetail },
    data() {
      return {
        id: "",
        tableData: [],
        page: 1,
        total: 0,
        status: '',
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
        getRfNewGiftsByCreaterId({ pageNo: this.page, status: this.status, type: 1 }).then(res => {
          this.tableData = res.tableData;
          this.total = res.totalSize;
        })
      },
      handleShowDetail(id) {
        this.id = id;
        this.showDialog = true;
      },
      handleDelActivity(id) {
        this.$confirm('您确认要结束该活动吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          showCancelButton: true,
          type: 'warning'
        }).then(() => {
          stopRfNewGiftPackActive({ activeId: id }).then(res => {
            this.$message.success("活动已结束");
            this.handleGetTableData();
          })
        }).catch(() => {});
      },
      handleSubmitForm() {
        if (this.$refs["opencardDetail"]) {
          this.id = '';
          this.showDialog = false;
          return false;
        };
        let $el = this.$refs["opencardForm"];
        if (!$el["showPoint"] && !$el["showPacket"] && !$el["showCard"] && !$el["showExchange"]) {
          this.$message.error("请至少选择一项礼品");
          return false;
        }
        if ($el["showCard"] && $el.formData.card.length == 0) {
          this.$message.error("请添加优惠券");
          return false;
        };
        if ($el["showExchange"] && $el.formData.exchange.length == 0) {
          this.$message.error("请添加商品券");
          return false;
        };
        $el.$refs["validateForm"].validate(valid => {
          if (valid) {
            this.isSubmit = true;
            addRfNewGiftPack($el.formData).then(res => {
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