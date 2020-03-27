
<template>
  <div id="tableManage" class="main-content">
    <div class="operate">
      <el-button type="primary" icon="el-icon-plus" @click="handleOpenDialog()">添 加</el-button>
    </div>
    <el-table :data="tableData" style="margin: 18px 0">
      <el-table-column type="index" label="序号"></el-table-column>

      <el-table-column label="桌号" prop="tableNum"></el-table-column>

      <el-table-column label="描述" prop="descr"></el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button class="table_operate" @click="handleOpenDialog(scope.row.id)" type="primary">编辑</el-button>
          <el-button class="table_operate" @click="handleDownQRCode(scope.row)" type="primary">下载二维码</el-button>
          <el-button class="table_operate" @click="handleDeleteTable(scope.row.id)" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination @current-change="handleOnPageChange" :current-page="page" layout="total, prev, pager, next, jumper" :total="total" :page-size="pageSize"></el-pagination>
    <!-- 规格模板录入 -->
    <el-dialog title="餐桌设置" :visible.sync="showDialog" width="400px" @open="handleOnEditTable" @close="handleCloseDialog" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form v-if="showDialog" :model="formData" ref="tableInfoForm" class="tableInfo-form">
        <el-form-item label="桌号：" prop="tableNum" :rules="{ required: true, message: '请输入桌号', trigger: 'blur'}">
          <el-input v-model.trim="formData.tableNum" maxlength="10" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="描述：" prop="descr" :rules="{ required: true, message: '请输入描述信息', trigger: 'blur'}">
          <el-input type="textarea" v-model="formData.descr" maxlength="40" style="width: 80%"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmitForm">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 二维码显示 -->
    <div class="codeBg" v-if="showImg"></div>
    <div ref="qrCodeBox" id="qrCodeBox" v-if="showImg">
      <div class="code">
        <img :src="url">
      </div>
      <div class="name">{{ name }}</div>
    </div>
  </div>
</template>
<script>
import { findTableNumberList, saveUpdateTable, findTableById, delTableById, findQRcodeById } from "@/api/services";
import html2canvas from 'html2canvas';

export default {
  data() {
    return {
      id: "",
      url: '',
      name: '',
      tableData: [],
      page: 1,
      pageSize: 10,
      total: 0,
      showDialog: false,
      showImg: false,
      formData: {
        tableNum: "",
        descr: ""
      }
    };
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
      findTableNumberList({ currentPage: this.page }).then(res => {
        this.tableData = res.tableData.records;
        this.pageSize = res.tableData.size;
        this.total = res.tableData.total;
      });
    },
    handleOpenDialog(id) {
      this.id = id;
      this.showDialog = true;
    },
    handleCloseDialog() {
      this.id = "";
      this.formData = {
        tableNum: "",
        descr: ""
      };
    },
    handleOnEditTable() {
      if (this.id) {
        findTableById({ id: this.id }).then(res => {
          this.formData.descr = res.tableData.descr;
          this.formData.tableNum = res.tableData.tableNum;
        })
      }
    },
    handleDeleteTable(id) {
      this.$confirm('您确认要删除该餐桌信息吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showCancelButton: true,
        type: 'warning'
      }).then(() => {
        delTableById({ id: id }).then(res => {
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.handleGetTableData();
        })
      }).catch(() => {});
    },
    // 下载
    handleDownQRCode(row) {
      findQRcodeById({ id: row.id }).then(res => {
        this.url = res.tableData;;
        this.name = row.tableNum;
      }).then(() => {
        if (this.url) {
          this.showImg = true;
          setTimeout(() => {
            html2canvas(this.$refs["qrCodeBox"]).then(canvas => {
              if (window.navigator.msSaveOrOpenBlob) {
                // IE
                let urlStr = atob(canvas.toDataURL('image/png').split(',')[1]);
                let n = urlStr.length;
                let u8arr = new Uint8Array(n);
                while (n--) {
                  u8arr[n] = urlStr.charCodeAt(n);
                }
                let blob = new Blob([u8arr]);
                window.navigator.msSaveOrOpenBlob(blob, this.name + ".png");
              } else {
                let link = document.createElement('a');
                link.style.display = 'none';
                link.href = canvas.toDataURL('image/png');
                link.setAttribute('download', this.name + ".png");
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }
              this.url = '';
              this.name = '';
              this.showImg = false;
            })
          }, 800)
        } else {
          this.$message({
            message: "暂无图片",
            type: 'error',
            duration: 3 * 1000
          });
        }
      })
      
    },
    handleSubmitForm() {
      this.$refs.tableInfoForm.validate(valid => {
        if (valid) {
          if (this.id) {
            this.formData.id = this.id;
          }
          saveUpdateTable(this.formData).then(res => {
            this.showDialog = false;
            this.handleGetTableData();
            this.$message({
              message: "保存成功",
              type: "success"
            });
          });
        }
      });
    },
  }
};
</script>
<style rel="stylesheet/scss" lang="scss">
#tableManage {
  .tableInfo-form textarea {
    min-height: 100px;
    max-height: 300px;
  }
  .codeBg {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    opacity: .5;
    background: #000;
    z-index: 2000;
  }
  #qrCodeBox {
    width:590px;
    height:805px;
    position: fixed;
    top: 50px;
    left: 50%;
    margin-left: -295px;
    display: inline-block;
    background: url(./bg.jpg);
    background-size: 100% 100%;
    background-position: 0 0;
    background-repeat: no-repeat;
    z-index: 8888;
    overflow: hidden;
    transform: scale(0.8);
    .code {
      width: 295px;
      height: 295px;
      padding: 10px;
      margin-right: auto;
      margin-left: auto;
      margin-top: 88px;
      margin-bottom: 35px;
      background: #fff;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .name {
      text-align: center;
      font-size:43px;
      font-weight:bold;
      color:rgba(255,255,255,1);
      line-height:43px;
    }
  }
}
</style>