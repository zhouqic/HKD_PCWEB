<template>
  <div class="bptg-container main-content">
    <!-- 操作 -->
    <div class="row-item">
      <div class="row-item-label"><b>选择推广方式：</b></div>
      <div class="row-item-content">
        <el-select v-model="siteId" placeholder="请选择">
          <template v-for="item in siteOptions">
            <el-option :label="item.name" :key="item.id" :value="item.id"></el-option>
          </template>
        </el-select>
        <el-button type="primary" style="margin-left: 50px;" @click="handleTuiGuang">确定</el-button>
      </div>
    </div>
    <!-- 列表 -->
    <el-table :data="data" ref="bpTable" @row-click="handleOnClickRow" style="margin-bottom: 20px;">

      <el-table-column align="center" width="100">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.checked" :value="scope.row.id == selectID ? true : false" @change="handleOnClickRow(scope.row)"></el-checkbox>
        </template>
      </el-table-column>

      <el-table-column label="推广方式">
        <template slot-scope="scope">
          <span v-html="handleTableSiteType(scope.row.id)"></span>
        </template>
      </el-table-column>

      <el-table-column label="爆品缩略图">
        <template slot-scope="scope">
          <img v-if="scope.row.displayPic" :src="scope.row.displayPic" width="100" height="100" />
        </template>
      </el-table-column>

      <el-table-column label="爆品名称" prop="name"></el-table-column>

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
    </el-table>
    <!-- 操作 -->
    <div class="row-item">
      <div class="row-item-label"><b>已选择：</b></div>
      <div class="row-item-content">{{ selectID ? data.filter(item => item.id == selectID)[0].name : '' }}</div>
      <!-- 分页 -->
      <el-pagination @current-change="handleOnPageChange" :current-page="currentPage" layout="total, prev, pager, next, jumper" :total="total" :page-size="pageSize"></el-pagination>
    </div>
  </div>
</template>
<script>
import { getBPListByCreaterId, getRfSingleProductSiteDetail, setProductDisplaySite } from '@/api/bpyinliu';
import { Message, MessageBox } from 'element-ui';

export default {
  name: 'bpYinLiu_Views',
  data() {
    return {
      siteId: '',
      siteOptions: [],
      selectID: '',
      currentPage: 1,
      total: 0,
      pageSize: 10,
      data: []
    }
  },
  created() {
    this.handleGetSiteDetail();
    this.handleGetBPList();
  },
  methods: {
    handleOnPageChange(page) {
      this.currentPage = page;
      this.handleGetBPList();
    },
    handleGetBPList() {
      getBPListByCreaterId({ type: 1, putaway: 1, currentPage: this.currentPage }).then(res => {
        this.data = res.tableData.records;
        this.data = this.data.map(item => {
          if (this.selectID == item.id) {
            item.checked = true;
          } else {
            item.checked = false;
          }
          return item;
        });
        this.pageSize = res.tableData.size;
        this.total = res.tableData.total;
      })
    },
    handleGetSiteDetail() {
      getRfSingleProductSiteDetail().then(res => {
        this.siteId = this.siteId ? this.siteId : (res.tableData.length ? res.tableData[0]["id"] : '');
        this.siteOptions = res.tableData;
      })
    },
    handleOnClickRow(row) {
      if (this.selectID != row.id) {
        this.data.map(item => item.checked = false );
        row.checked = true;
        this.selectID = row.id;
      } else {
        row.checked = false;
        this.selectID = '';
      }
    },
    handleTableSiteType(id) {
      let type = [];
      let siteInfo = this.siteOptions.filter( item => item.productId == id ).forEach(item => {
        type.push(item.name);
      });
      return type.join("</br>");
    },
    handleTuiGuang() {
      if (this.selectID) {
        let selectSite = this.siteOptions.filter( item => item.id == this.siteId );
        setProductDisplaySite({ productId: this.selectID, siteId: this.siteId }).then(res => {
          this.handleGetSiteDetail();
          this.handleGetBPList();
          if (selectSite.length && selectSite[0]["site"] == 1) {
            MessageBox.confirm('<div>设置成功, 请联系运营商付费</div><div>客服热线：18236782516</div>', '提示', {
              confirmButtonText: '确定',
              type: 'info',
              showCancelButton: false,
              dangerouslyUseHTMLString: true
            }).then(() => {}).catch(() => {});
          }
        })
      } else {
        Message({
          message: "请选择一个商品",
          type: 'error',
          duration: 3 * 1000
        });
      }
    }
  },
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.bptg-container {
  font-size: 13px;
  color: #101010;
  .row-item {
    overflow: hidden;
    line-height: 32px;
    margin-bottom: 20px;
    .row-item-label {
      float: left;
      color: #606266;
      margin-right: 10px;
      b{
        font-size: 14px;
      }
    }
    .row-item-content {
      float: left;
      width: 500px;
    }
  }
}
</style>