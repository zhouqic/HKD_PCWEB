<template>
  <div class="clearfix">
    <panel-group title="到店记录" :width="width" :height="height" :style="{float: position}">
      <template slot="content">
        <el-table :data="tableData" height="300" style="margin-bottom:15px;">
          <el-table-column label="门店名称">
            <template slot-scope="scope">
              <span>{{shop}}</span>
            </template>
          </el-table-column>

          <el-table-column label="时间">
            <template slot-scope="scope">
              <span>{{ scope.row.arriveTime}}</span>
            </template>
          </el-table-column>

          <el-table-column label="查看照片">
            <template slot-scope="scope">
              <el-button type="primary" @click="handleOpenDialog(scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @current-change="handleOnPageChange" :current-page="page" layout="total, prev, pager, next, jumper" :total="total" :page-size="10"></el-pagination>
      </template>
    </panel-group>
    <el-dialog title="查看照片" :visible.sync="showDialog" width="700px" :close-on-click-modal="false"
      :close-on-press-escape="false" @closed="handleCloseDialog">
      <photo-view v-if="showDialog" :id="recordId" :value="recordValue"></photo-view>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseDialog">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import panelGroup from "./panelGroup";
import photoView from "./photoView";
import { findComeStoreByFaceId, findUserInfoByFaceId } from '@/api/face';
export default {
  props: ["id", "width", "height", "position"],
  components: { panelGroup, photoView },
  data() {
    return {
      page: 1,
      total: 0,
      shop: this.$store.getters.shop,
      tableData: [],
      recordId: '',
      recordValue: '',
      showDialog: false
    };
  },
  watch: {
    id(val) {
      this.handleGetTableData();
    }
  },
  created() {
    this.handleGetTableData();
  },
  methods: {
    handleOpenDialog(row) {
      this.recordId = row.id;
      const data = row.arriveTime.split(" ");
      this.recordValue = [data[0], data[0]];
      this.showDialog = true;
    },
    handleCloseDialog() {
      this.recordId = '';
      this.recordValue = '';
      this.showDialog = false;
    },
    handleOnPageChange(page) {
      this.page = page;
      this.handleGetCiShuData();
    },
    handleGetTableData() {
      if (this.id) {
        findComeStoreByFaceId({id: this.id, currentPage: this.page}).then(res=> {
          this.tableData = res.tableData.records;
          this.total = res.tableData.total;
        })
      }
    }
  }
};
</script>