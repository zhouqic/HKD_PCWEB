<template>
  <div class="viplist-container main-content">
    <!-- 筛选 -->
    <el-form style="margin-bottom:15px;" label-width="100px">
      <el-form-item class="inline-block" label="会员查询：">
        <el-input v-model="formData.condition" placeholder="昵称/手机号"></el-input>
      </el-form-item>
      <el-form-item class="inline-block" label="会员身份：">
        <el-select v-model="formData.flag">
          <el-option value="" label="不限"></el-option>
          <el-option value="1" label="粉丝"></el-option>
          <el-option value="4" label="潜客"></el-option>
          <el-option value="2" label="消费会员"></el-option>
          <el-option value="3" label="储值会员"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="inline-block" label="消费频次：" v-if="$store.state.permission.showYingXiao === true">
        <el-select v-model="formData.typeId">
          <el-option value="" label="不限"></el-option>
          <el-option v-for="item in typeList" :key="item.typeId" :value="item.typeId" :label="item.consumName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="inline-block" label-width="0px">
        <el-button type="primary" @click="handleSubmitForm()">查询</el-button>
        <el-button type="primary" @click="handleResetFormData()">重置</el-button>
      </el-form-item>
      <el-form-item label-width="0px">
        <el-button type="primary" :loading="downloadLoading" @click="handleDownloadTable()">导出会员</el-button>
        <el-button type="primary" :loading="insertLoading" @click="handleInsertVipExcel()">导入会员</el-button>
        <el-button type="primary" @click="handleDownloadVipExcel()">下载会员导入摸板</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table :data="tableData" style="margin-bottom: 15px;">
      <el-table-column label="头像">
        <template slot-scope="scope">
          <img :src="scope.row.headimgurl ? scope.row.headimgurl : defaultImg" width="40" height="40" style="border-radius:50%">
        </template>
      </el-table-column>

      <el-table-column label="姓名" prop="real_name"></el-table-column>

      <el-table-column label="昵称" prop="name"></el-table-column>

      <el-table-column label="手机号" prop="phone"></el-table-column>

      <el-table-column label="注册时间">
        <template slot-scope="scope">
          <span>{{scope.row.create_date | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
        </template>
      </el-table-column>

      <el-table-column label="最近消费时间">
        <template slot-scope="scope">
          <span v-if="scope.row.end_time">{{scope.row.end_time | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}</span>
        </template>
      </el-table-column>

      <el-table-column label="消费金额" prop="consumption_money"></el-table-column>

      <el-table-column label="消费次数" prop="consumption_num"></el-table-column>

      <el-table-column label="余额" prop="balance"></el-table-column>

      <el-table-column label="当前积分" prop="points"></el-table-column>
      
      <el-table-column label="操作" width="150px" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button class="table_operate" type="primary" @click="handleShowCusDetail(scope.row)">查看</el-button>
          <el-button v-if="$store.state.permission.showYingXiao === true" class="table_operate" type="primary" @click="handleOpenCardDialog(scope.row.id)">发券</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination @current-change="handleOnPageChange" :current-page="formData.currentPage" layout="total, prev, pager, next, jumper" :total="total" :page-size="pageSize"></el-pagination>
    <!-- 编辑 -->
    <edit-form v-if="showDialog" :show="showDialog" :id="id" @closed="showDialog=false;id='';"></edit-form>
    <!-- 发券 -->
    <el-dialog title="选择优惠券" :visible.sync="showCardDialog" width="600px" :close-on-click-modal="false" :close-on-press-escape="false" @closed="handleCloseCardDialog">
      <el-form ref="validateForm" :model="sendData" label-width="120px" :label-position="'left'">
        <el-form-item label="券类型:">
          <el-checkbox label="优惠券" v-model="showYCard"></el-checkbox>
          <el-checkbox label="商品券" v-model="showSCard"></el-checkbox>
        </el-form-item>
        <el-form-item label="选择优惠券:" v-if="showYCard">
          <el-select v-model="sendData.cardId" multiple placeholder="请选择一张或者多张优惠券" style="width:80%;">
            <el-option v-for="item in YCardList" :key="item.value" :label="item.title" :value="item.id">
              <span style="float: left">{{ item.title }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px;padding-right: 12px;">{{ '满' + item.leastCost + '元，减' + item.reduceCost + '元' }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择商品券:" v-if="showSCard">
          <el-select v-model="sendData.exchangIds" multiple placeholder="请选择一张或者多张商品券" style="width:80%;">
            <el-option v-for="item in SCardList" :key="item.value" :label="item.title" :value="item.id">
              <span style="float: left"><img :src="item.pic" width='20' height='20' style='border-radius:50%;vertical-align: -7px;margin-right:10px;'>{{ item.title }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px;padding-right: 12px;">{{ '价值 ￥' + item.price }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseCardDialog">取 消</el-button>
        <el-button type="primary" :disabled="isSubmit ? true : false" @click="handleOnSendCards">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getMemberCondition, getRfShopUserInfos, downloadLoadExcel, importCustomExcel } from "@/api/vipManage";
import { sendCards, getRfCardsByCreaterId } from '@/api/vipManage';
import { findEntityCardList } from '@/api/marketCenter';
import { parseTime } from "@/utils";
import EditForm from "./components";

export default {
  name: "VipViews",
  components: { EditForm },
  data() {
    return {
      defaultImg: require("@/assets/default_logo.jpg"),
      formData: {
        condition: '',
        flag: '',
        typeId: '',
        currentPage: 1
      },
      downloadLoading: false,
      insertLoading: false,
      typeList: [],
      tableData: [],
      total: 0,
      pageSize: 10,
      id: "",
      showDialog: false,
      showCardDialog: false,
      showYCard: false,
      showSCard: false,
      sendData: {
        ids: '',
        cardId: [],
        exchangIds: []
      },
      YCardList: [],
      SCardList: [],
      isSubmit: false
    };
  },
  watch: {
    showYCard(newVal, oldVal) {
      if (!newVal) {
        return this.YCardList = [];
      }
      getRfCardsByCreaterId({}).then(res => {
        return this.YCardList = res.tableData
      });
    },
    showSCard(newVal, oldVal) {
      if (!newVal) {
        return this.SCardList = [];
      }
      findEntityCardList({}).then(res => {
        return this.SCardList = res.tableData
      });
    }
  },
  created() {
    if (['jz','marketing'].indexOf(this.$store.state.user.shopType) != -1) {
      getMemberCondition().then(res => {
        this.typeList = res.tableData;
      })
    }
    this.handleGetTableData();
  },
  methods: {
    handleCloseCardDialog() {
      this.sendData.ids = '';
      this.sendData.cardId = [];
      this.sendData.exchangIds = [];
      this.showCardDialog = false;
      this.showYCard = false;
      this.showSCard = false;
    },
    handleOpenCardDialog(id) {
      this.sendData.ids = id;
      this.showCardDialog = true;
    },
    handleOnSendCards() {
      if (!this.showYCard && !this.showSCard) {
        this.$message.error("请至少选择一种券");
        return false;
      }
      if (this.showYCard && this.sendData.cardId.length == 0) {
        this.$message.error("请选择要发送的优惠券");
        return false;
      }
      if (this.showSCard && this.sendData.exchangIds.length == 0) {
        this.$message.error("请选择要发送的商品券");
        return false;
      }
      let data = {};
      data.ids = this.sendData.ids;
      data.cardId = this.showYCard ? this.sendData.cardId.join(",") : null;
      data.exchangIds = this.showSCard ? this.sendData.exchangIds.join(",") : null;
      sendCards(data).then(res => {
        this.isSubmit = false;
        this.showCardDialog = false;
        this.$message.success("发送成功");
      }).catch(() => { 
        this.isSubmit = false;
      });
    },
    handleShowCusDetail(row) {
      if (row.isExcelImportent == 1) {
        this.$message.warning('未激活会员，不可操作');
        return false;
      }
      this.id = row.id;
      this.showDialog = true;
    },
    handleOnPageChange(page) {
      this.formData.currentPage = page;
      this.handleGetTableData();
    },
    handleResetFormData() {
      this.formData.condition = '';
      this.formData.flag = '';
      this.formData.typeId = '';
      this.formData.currentPage = 1;
    },
    handleSubmitForm() {
      this.formData.currentPage = 1;
      this.handleGetTableData();
    },
    handleGetTableData() {
      getRfShopUserInfos(this.formData).then(res => {
        this.tableData = res.tableData.rows;
        this.total = res.tableData.totalSize;
        this.pageSize = res.tableData.pageSize;
      })
    },
    handleInsertVipExcel() {
      let link = document.createElement('input');
      link.style.display = 'none';
      link.type = "file";
      document.body.appendChild(link);
      link.addEventListener("change", e =>{
        this.insertLoading = true;
        let formData = new FormData();
        formData.append("customFile", e.target.files[0]);
        importCustomExcel(formData).then(res => {
          this.insertLoading = false;
          this.$message({
            message: '导入成功',
            type: 'success'
          });
          this.handleGetTableData();
        }).catch(() => {
          this.insertLoading = false;
        })
      })
      link.click();
      document.body.removeChild(link);
    },
    handleDownloadVipExcel() {
      window.open("static/excels/汇客多会员导入模板.xlsx");
    },
    handleDownloadTable() {
      this.downloadLoading = true;
      downloadLoadExcel(this.formData).then(response => {
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['姓名', '昵称', '手机号', '注册时间', '最近消费时间', '消费金额', '消费次数', '余额', '当前积分']
          const filterVal = ['realName', 'name', 'phone', 'create_date', 'end_time', 'consumption_money', 'consumption_num', 'balance', 'points']
          const data = this.formatJson(filterVal, response.tableData)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '会员统计表',
            sheetName: '会员统计表'
          });
        })
        this.downloadLoading = false;
      }).catch(() => {
        this.downloadLoading = false;
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'create_date' || j === 'end_time') {
          return v[j] && parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.el-select, .el-input {
  width: 150px;
}
</style>