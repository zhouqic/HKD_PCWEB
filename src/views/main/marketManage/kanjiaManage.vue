<template>
  <div id="bargain" class="main-content">
    <div>
      <el-button type="primary" @click="addBargain()">新增</el-button>
    </div>
    <el-table :data="bargainTableData" stripe style="margin: 15px 0" @sort-change='sortTableChange'>
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="createDate" label="创建日期" min-width="150px" sortable='custom'>
        <template slot-scope="scope">
          <span v-if="!scope.row.createDate">{{ scope.row.createDate }}</span>
          <span v-else>{{ scope.row.createDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="product" label="商品"></el-table-column>
      <el-table-column prop="price" label="商品原价" min-width="100px" sortable='custom'>
        <template slot-scope="scope">
          <span>￥{{ scope.row.price}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cutPrice" label="砍价最低价格" min-width="140px" sortable='custom'>
        <template slot-scope="scope">
          <span>￥{{ scope.row.cutPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cutMoney" label="一次最高砍价金额" min-width="160px" sortable='custom'>
        <template slot-scope="scope">
          <span>￥{{ scope.row.cutMoney}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="moneyType" label="砍价金额类型" min-width="130px" sortable='custom'>
        <template slot-scope="scope">
          <span>{{ scope.row.moneyType ? "固定金额" :"随机金额"}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="beginTime" label="活动开始时间" min-width="150px" sortable='custom'>
        <template slot-scope="scope">
          <span v-if="!scope.row.beginTime">{{ scope.row.beginTime }}</span>
          <span v-else>{{ scope.row.beginTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="endTime" label="活动结束时间" min-width="150px" sortable='custom'>
        <template slot-scope="scope">
          <span v-if="!scope.row.endTime">{{ scope.row.endTime }}</span>
          <span v-else>{{ scope.row.endTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <span>{{ scope.row.status ? '启用' : '禁用' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="260px" fixed="right">
        <template slot-scope="scope">
          <!-- <el-button class="table_operate" @click="handleEditBargain(scope.row)" type="primary">编辑</el-button> -->
          <el-button class="table_operate"
            v-if="!scope.row.status"
            @click="handleStartUsingOrForbidden(scope.row)"
            type="warning"
          >启用</el-button>
          <el-button class="table_operate"
            v-if="scope.row.status"
            @click="handleStartUsingOrForbidden(scope.row)"
            type="warning"
          >禁用</el-button>
          <el-button class="table_operate" @click="handleQRCode(scope.row)" type="primary">生成二维码</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @current-change="handleOnPageChange" :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="tableTotal"></el-pagination>
    <!-- 砍价商品录入的对话框 -->
    <el-dialog title="砍价商品录入" :visible.sync="dialogBargainVisible" width="600px" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :model="bargainForm" ref="bargainForm" :rules="bargainFormRules" class="bargain-form" label-width="150px">
        <el-form-item label="商品名称:" prop="product">
          <el-input placeholder="请输入商品名称" auto-complete="off" @focus="showProductVisible" v-model.trim="bargainForm.product"></el-input>
        </el-form-item>
        <el-form-item label="商品原价:" prop="price">
          <el-input placeholder="请输入商品原价" auto-complete="off" v-model.trim="bargainForm.price"></el-input>
          <p class="bargain-note">注：作为砍价商品，所有规格价格相同</p>
        </el-form-item>
        <el-form-item label="砍价最低价格:" prop="cutPrice">
          <el-input placeholder="请输入砍价最低价格" auto-complete="off" v-model.trim="bargainForm.cutPrice"></el-input>
        </el-form-item>
        <el-form-item label="一次最高砍价金额:" prop="cutMoney">
          <el-input
            placeholder="请输入一次最高砍价金额"
            auto-complete="off"
            v-model.trim="bargainForm.cutMoney"
          ></el-input>
        </el-form-item>
        <el-form-item label="砍价金额类型">
          <el-radio-group v-model="bargainForm.moneyType">
            <el-radio :label="0">随机金额</el-radio>
            <el-radio :label="1">固定金额</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="活动开始时间:" prop="beginTime">
          <el-date-picker v-model="bargainForm.beginTime" type="datetime" placeholder="请选择活动开始时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="活动结束时间:" prop="endTime">
          <el-date-picker v-model="bargainForm.endTime" type="datetime" placeholder="请选择活动结束时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="范围:" prop="scope">
          <el-input placeholder="请输入范围" auto-complete="off" v-model.trim="bargainForm.scope"></el-input>
        </el-form-item>
        <el-form-item label="状态:">
          <el-radio-group v-model="bargainForm.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogBargainVisible = false">取 消</el-button>
        <el-button type="primary" :disabled="isSubmit ? true : false" @click="saveBargain">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="二维码" :visible.sync="dialogQRcodeVisible" width="296px" :close-on-click-modal="false" :close-on-press-escape="false">
      <div id="qrcode" ref="qrcode"></div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogQRcodeVisible = false">确 定</el-button>
      </span>
  </el-dialog>
  <!-- 砍价商品录入的对话框 -->
    <el-dialog title="砍价商品录入" :visible.sync="dialogProductVisible" class="product-dialog" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-table :data="productTableData" highlight-current-row stripe style="width: 100%" @row-click='rowTableChange'>
        <el-table-column type="index"></el-table-column>
        <!-- <el-table-column prop="id" label="id" min-width="100px"></el-table-column> -->
        <el-table-column prop="title" label="商品名称" min-width="100px"></el-table-column>
        <el-table-column prop="minPrice" label="最低价" min-width="140px"></el-table-column>
        <el-table-column prop="maxPrice" label="最高价" min-width="160px"></el-table-column>
        <el-table-column prop="picture" label="图片" min-width="95px">
          <template slot-scope="scope">
            <img :src="scope.row.picture" class="carousel-picture">
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="handleProductCurrentChange"
        :current-page="productCurrentPage"
        :page-size="productPageSize"
        layout="total, prev, pager, next, jumper"
        :total="productTableTotal"
      ></el-pagination>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogProductVisible = false">取 消</el-button>
        <el-button type="primary" :disabled="isSubmit ? true : false" @click="saveProduct">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getCutPriceList, getCutPrice, saveCutPrice } from "@/api/marketActivity";
import { getProductByPage } from "@/api/marketCommodity";
import { parseTime } from "@/utils";
import QRCode from 'qrcodejs2';

export default {
  components: { 
    QRCode
  },
  mounted() {
    // 获取砍价管理列表
    this.getCutPriceListData();
  },
  data() {
    const checkPrice = (rule, value, callback) => {
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
    const checkScope = (rule, value, callback) => {
      let reg = /^[1-9]\d{0,8}?$/;
      if (reg.test(Number(value))) {
        callback();
      } else {
        if (value < 1) {
          if (value === "" || value === 0) {
            callback();
            return;
          }
          callback(new Error("请输入数字值，只能输入大于0的整数"));
        } else {
          callback(new Error("请输入数字值，只能输入大于0的整数"));
        }
      }
    };
    return {
      bargainTableData: [],
      currentPage: 1,
      pageSize: 10,
      tableTotal: 0,
      isSubmit: false,
      dialogBargainVisible: false,
      bargainForm: {
        product: '',
        price: '',
        cutPrice: '',
        cutMoney: '',
        moneyType: 0,
        beginTime: '',
        endTime: '',
        scope: '',
        status: 0,
        type: 'new',
        id: ''
      },
      bargainFormRules: {
        product: { required: true, message: "请输入商品名称", trigger: "bulr" },
        price: [
          { required: true, message: "请输入商品原价", trigger: "bulr" },
          { validator: checkPrice, trigger: "blur" }
        ],
        cutPrice: [
          { required: true, message: "请输入砍价最低价格", trigger: "bulr" },
          { validator: checkPrice, trigger: "blur" }
        ],
        cutMoney: [
          { required: true, message: "请输入一次最高砍价金额", trigger: "bulr" },
          { validator: checkPrice, trigger: "blur" }
        ],
        beginTime: { type: 'date', required: true, message: "请选择活动开始时间", trigger: "change" },
        endTime: { type: 'date', required: true, message: "请选择活动结束时间", trigger: "change" },
        scope: [
          { required: true, message: "请输入范围", trigger: "bulr" },
          { validator: checkScope, trigger: "blur" }
        ]
      },
      dialogQRcodeVisible: false,
      bargainTable: {
        createDate: 'create_date',
        price: 'price',
        cutPrice: 'cut_price',
        cutMoney: 'cut_money',
        moneyType: 'money_type',
        beginTime: 'begin_time',
        endTime: 'end_time'
      },
      priceObject: {
        key: '',
        value: ''
      },
      productTableData: [],
      productCurrentPage: 1,
      productPageSize: 10,
      dialogProductVisible: false,
      productTableTotal: 0,
      highlightRow: {}
    };
  },
  methods: {
    // 获取砍价管理
    getCutPriceListData() {
      let option = {
        currentPage: this.currentPage,
        pageSize: this.pageSize
      };
      if (this.priceObject.key) {
        option[this.priceObject.key] = this.priceObject.value;
      }
      getCutPriceList(option).then(res => {
        if (res.success) {
          this.bargainTableData = res.tableData.records;
          this.tableTotal = res.tableData.total;
        } else {
          this.$message({
            type: "success",
            message: res.msg
          });
        }
      });
    },
    sortTableChange(column) {
      if (column.order === 'ascending') {
        this.priceObject = {
          key: 'ascs',
          value: this.bargainTable[column.prop]
        }
      } else if (column.order === 'descending') {
        this.priceObject = {
          key: 'descs',
          value: this.bargainTable[column.prop]
        }
      } else {
        this.priceObject = {
          key: '',
          value: ''
        }
      }
      this.getCutPriceListData();
    },
    // 查询活动
    addBargain() {
      this.bargainForm = {
        product: '',
        price: '',
        cutPrice: '',
        cutMoney: '',
        moneyType: 0,
        beginTime: '',
        endTime: '',
        scope: '',
        status: 0,
        type: 'new',
        id: ''
      }
      this.highlightRow = {};
      this.dialogBargainVisible = true;
      setTimeout(() => {
        this.$refs.bargainForm.clearValidate();
      }, 100);
    },
    // 表格操作-编辑
    handleEditBargain(row) {
      setTimeout(() => {
        this.$refs.bargainForm.clearValidate();
      }, 100);
      getCutPrice({
        id: row.id
      }).then(res => {
        this.dialogBargainVisible = true;
        this.highlightRow.id = res.tableData.productId;
        this.bargainForm = {
          product: res.tableData.product,
          price: res.tableData.price,
          cutPrice: res.tableData.cutPrice,
          cutMoney: res.tableData.cutMoney,
          moneyType: res.tableData.moneyType,
          beginTime: new Date(Number(res.tableData.beginTime)),
          endTime: new Date(Number(res.tableData.endTime)),
          scope: res.tableData.scope,
          status: res.tableData.status,
          type: 'edit',
          id: res.tableData.id
        }
      })
    },
    // 表格操作-启用
    handleStartUsingOrForbidden(row) {
      let word = !row.status ? '启用' : '禁用';
      this.$confirm( `确定要${word}${row.product}吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        saveCutPrice({ id:　row.id, status: !row.status ? 1 : 0 }).then(res =>{
          this.$message({
            type: "success",
            message: res.tableData.status ? '启用成功' : '禁用成功'
          });
          this.getCutPriceListData(); // 获取砍价管理列表
        })
      })
    },
    // 表格操作-生成二维码
    handleQRCode(row) {
      this.dialogQRcodeVisible = true;
      let baseUrl = process.env.ENV_CONFIG == "sit" ? location.origin : "https://www.qiyito.com";
      let link = baseUrl + '/hkd/wechat/activity/CP_detail.html?cutActiveId=' + row.id;
      this.$nextTick(()=> {
        this.qrcode(link);
      })
    },
    // 生成二维码
    qrcode(link) {
      if (this.qrCodeCanvas) { // 清除上一次的二维码
        document.getElementById('qrcode').innerHTML = '';
      }
      this.qrCodeCanvas = new QRCode('qrcode', {
        width: 255, // 二维码宽度，单位像素
        height: 255, // 二维码高度，单位像素
        text: link, // 二维码中的内容
        colorDark : '#000000', // 前景色
        colorLight : '#ffffff', // 背景色
        correctLevel : QRCode.CorrectLevel.H  // 容错级别，
      })
    },
    // 表格分页
    handleOnPageChange(val) {
      this.currentPage = val;
      // 获取活动列表
      this.getCutPriceListData();
    },
    // 新增或者编辑
    saveBargain() {
      this.$refs.bargainForm.validate(valid => {
        if (valid) {
          let start = new Date(this.bargainForm.beginTime).getTime();
          let end = new Date(this.bargainForm.endTime).getTime();
          if (start > end) {
            this.$message({
              type: "error",
              message: '您选择的开始时间应小于结束时间'
            });
            return;
          }
          let word = "";
          let param = {
            productId: this.highlightRow.id,
            product: this.bargainForm.product,
            price: Number(this.bargainForm.price),
            cutPrice: Number(this.bargainForm.cutPrice),
            cutMoney: Number(this.bargainForm.cutMoney),
            moneyType:this.bargainForm.moneyType,
            beginTime: parseTime(this.bargainForm.beginTime),
            endTime: parseTime(this.bargainForm.endTime),
            scope: Number(this.bargainForm.scope),
            status: this.bargainForm.status
          }
          if (this.bargainForm.type === 'edit') {
            param.id = this.bargainForm.id;
            word = "编辑成功";
          } else {
            word = "新增成功";
          }
          this.isSubmit = true;
          saveCutPrice(param).then(res =>{
            this.$message({
              type: "success",
              message: word
            });
            this.isSubmit = false;
            this.dialogBargainVisible = false;
            this.highlightRow = {};
            this.getCutPriceListData(); // 获取砍价管理列表
          }).catch(() => {
            this.isSubmit = false;
          })
        } else {
          return false;
        }
      });
    },
    // 展示商品名称的表格
    showProductVisible() {
      this.dialogProductVisible = true;
      this.highlightRow = {};
      // 获取可作为砍价的商品
      this.getProduct();
    },
    getProduct() {
      let option = {
        currentPage: this.productCurrentPage,
        pageSize: this.productPageSize,
        isCampaign: 1,
        examine: 1,
        putaway: 1
      }
      getProductByPage(option).then(res => {
        if (res.success) {
          this.productTableData = res.tableData.records;
          this.productTableTotal = res.tableData.total;
        } else {
          this.$message({
            message: res.msg,
            type: "error"
          });
        }
      })
    },
    // 录入时获取商品id
    handleProductCurrentChange(val) {
      this.productCurrentPage = val;
      this.getProduct();
    },
    rowTableChange(row, column, event) {
      this.highlightRow = row;
    },
    saveProduct() {
      if (!this.highlightRow.id) {
        this.$message({
          message: '请选择商品',
          type: "error"
        });
      } else {
        this.dialogProductVisible = false;
        this.bargainForm.product = this.highlightRow.title;
        this.bargainForm.price = this.highlightRow.minPrice;
      }
    },
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
#bargain {
  .el-input {
    width: 80%;
  }
  .carousel-picture{
    width: 100px;
    height: 80px;
  }
  .bargain-note {
    margin: 5px 0 0 0px;
    line-height: 12px;
    font-size: 12px;
    color: #f00;
  }
}
</style>
