<template>
  <div id="express" class="main-content">
    <el-row style="margin-bottom: 15px;">
      <el-button type="primary" icon="el-icon-plus" @click="id = '';showDialog = true;">录入</el-button>
      <!-- <el-button type="primary" icon="el-icon-download" @click="importExpress">导入</el-button>
      <el-button type="primary" icon="el-icon-upload2" @click="exportExpress">导出</el-button>
      <el-button type="primary" icon="el-icon-download" @click="downloadExpress">模板下载</el-button>-->
    </el-row>
    <!-- 表格 -->
    <el-table :data="tableData" style="margin-bottom: 15px">
      <el-table-column type="index" label="序号" width="80"></el-table-column>
      
      <el-table-column prop="fee" label="运费"></el-table-column>

      <el-table-column prop="orderFee" label="免运费订单金额"></el-table-column>

      <el-table-column prop="expressType" label="快递方式"></el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button class="table_operate" @click="handleOpenEditDialog(scope.row.id)" type="primary">编辑</el-button>
          <el-button class="table_operate" @click="handleDeleteExpress(scope.row.id)" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination @current-change="handleOnPageChange" :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="total"></el-pagination>
    <!-- 编辑数据 -->
    <el-dialog title="运费信息设置" :visible.sync="showDialog" width="500px" :close-on-click-modal="false" :close-on-press-escape="false">
      <express-form v-if="showDialog" ref="expressForm" :id="id"></express-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="primary" :disabled="isSubmit ? true : false" @click="$refs['expressForm'].handleSubmitForm();">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getExpressList, saveExpress, deleteExpress } from "@/api/marketSettings";
import ExpressForm from "./components/expressForm";

export default {
  components: { ExpressForm }, 
  data() {
    const checkExpress = (rule, value, callback) => {
      let reg = /^[1-9]\d{0,8}(\.\d{0,2})?$/;
      let regs = /^0(\.\d{0,2})?$/;
      if (reg.test(Number(value))) {
        callback();
      } else {
        if (value < 1) {
          if (regs.test(Number(value))) {
            callback();
          } else {
            callback(new Error("请输入大于或者等于0的数字值，支持小数点后2位"));
          }
        } else {
          callback(new Error("请输入大于或者等于0数字值，支持小数点后2位"));
        }
      }
    };
    return {
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      id: "",
      showDialog: false,
      isSubmit: false,
      expressNumType: {
        1: "快递",
        2: "到店自提",
        3: "商家配送"
      }
    };
  },
  created() {
    this.handleGetTableData();
  },
  methods: {
    // 获取运费信息
    handleGetTableData() {
      getExpressList({ currentPage: this.currentPage }).then(res => {
        if (res.tableData.records.length == 0 && this.currentPage - 1 > 0) {
          this.currentPage--;
          this.handleGetTableData();
        } else {
          let data = res.tableData.records;
          for (let i = 0; i < data.length; i++) {
            let type = data[i].expressType.split(",");
            let word = "";
            for (let j = 0; j < type.length; j++) {
              word += this.expressNumType[type[j]] + "，";
            }
            data[i].expressType = word.substring(0, word.length - 1);
          }
          this.tableData = res.tableData.records;
          this.total = res.tableData.total;
          this.pageSize = res.tableData.size;
        }
      });
    },
    // 分页设置
    handleOnPageChange(val) {
      this.currentPage = val;
      this.handleGetTableData();
    },
    // 编辑运费
    handleOpenEditDialog(id) {
      this.id = id;
      this.showDialog = true;
    },
    // 导入运费
    importExpress() {},
    // 导出运费
    exportExpress() {},
    // 模板下载运费
    downloadExpress() {},
    // 删除运费信息
    handleDeleteExpress(id) {
      this.$confirm("确定删除该运费信息吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteExpress({ id: id }).then(res => {
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