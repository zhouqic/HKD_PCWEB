<template>
<div class="main-content">
  <el-header style="padding-left:0;">
    <span class="item_label" style="font-size:14px;color:#606266;line-height:32px;font-weight:bolder;">券类型：</span>
    <el-select v-model="status" @change="handleGetTableData()" style="width:120px;margin-right:80px;">
      <el-option label="优惠券" :value="0"></el-option>
      <el-option label="商品兑换券" :value="1" v-if="$store.state.permission.showHUIYUANDABAO || $store.state.permission.showYingXiao || $store.state.permission.showFuLiShe || $store.state.permission.showShangMeng"></el-option>
    </el-select>
    <el-button type="primary" @click.native.prevent="showDialog = true">添加券</el-button>
  </el-header>
  <!-- 表格 -->
  <el-table :data="tableData" style="margin-bottom: 15px;">
    <el-table-column label="名称">
      <template slot-scope="scope">
        <div v-if="status == 0">{{ scope.row.title }}</div>
        <div v-else>
          <img :src="scope.row.pic" width="30" height="30" style="border-radius:50%;margin-right:10px;vertical-align:middle;">
          {{ scope.row.title }}
        </div>
      </template>
    </el-table-column>

    <el-table-column label="面额" prop="reduceCost">
      <template slot-scope="scope">
        <span v-if="status == 0">{{ scope.row.reduceCost }} 元</span>
        <span v-else>{{ scope.row.price }} 元</span>
      </template>
    </el-table-column>

    <el-table-column label="使用条件" prop="leastCost" v-if="status == 0">
      <template slot-scope="scope">
        <span>满 {{ scope.row.leastCost }} 元，可以使用</span>
      </template>
    </el-table-column>

    <el-table-column label="是否可赠送">
      <template slot-scope="scope">
        <span v-if="scope.row.isSend == 0">不可赠送</span>
        <span v-else>可赠送</span>
      </template>
    </el-table-column>

    <el-table-column label="有效期">
      <template slot-scope="scope">
        <template v-if="status == 0">
          <span v-if="scope.row.type == 1">
            {{ scope.row.beginTimestamp | parseTime('{y}-{m}-{d}') }}
            至
            {{ scope.row.endTimestamp | parseTime('{y}-{m}-{d}') }}
          </span>
          <span v-else>
            <span v-if="scope.row.effectNum">领取后{{ scope.row.effectNum }}天生效，</span>
            有效期{{ scope.row.fixedTerm }}天
          </span>
        </template>
        <template v-else>
          <span>领取后 {{ scope.row.validDays }} 天过期</span>
        </template>
      </template>
    </el-table-column>

    <el-table-column label="创建日期" v-if="status == 1">
      <template slot-scope="scope">
        {{ scope.row.createDate | parseTime('{y}-{m}-{d} {h}:{m}:{s}') }}
      </template>
    </el-table-column>

    <el-table-column label="操作" width="80">
      <template slot-scope="scope">
        <el-button class="table_operate" plain type="danger" @click="handleDeleteCard(scope.row.id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 创建 -->
  <el-dialog title="创建券" :visible.sync="showDialog" width="600px" @closed="showDialog=false;" :close-on-click-modal="false" :close-on-press-escape="false">
    <cardmanage-form v-if="showDialog" ref="cardmanageForm"></cardmanage-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="showDialog=false;">取 消</el-button>
      <el-button type="primary" @click="handleSubmitForm" :disabled="isSubmit ? true : false">保 存</el-button>
    </span>
  </el-dialog>
</div>
</template>
<script>
import { getRfCardsByCreaterId, findEntityCardList, deleteRfCardById, delEntityCardById, saveRfCard, addEntityCard } from "@/api/marketCenter";
import cardmanageForm from './cardmanageForm';

export default {
  name: 'cardManage_views',
  components: { cardmanageForm },
  data() {
    return {
      status: 0,//0,优惠券；1,实物券
      tableData: [],
      isSubmit: false,
      showDialog: false
    }
  },
  created() {
    this.handleGetTableData();
  },
  methods: {
    handleGetTableData() {
      if (this.status == 0) {
        getRfCardsByCreaterId({}).then(res => {
          this.tableData = res.tableData;
        })
      } else {
        findEntityCardList().then(res => {
          this.tableData = res.tableData;
        })
      }
    },
    handleDeleteCard(id) {
      this.$confirm('您确认要删除该卡券吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showCancelButton: true,
        type: 'warning'
      }).then(() => {
        if (this.status == 0) {
          deleteRfCardById(id).then(res => {
            this.$message({ type: 'success', message: '删除成功' })
            this.handleGetTableData();
          })
        } else {
          delEntityCardById({ id: id }).then(res => {
            this.$message({ type: 'success', message: '删除成功' })
            this.handleGetTableData();
          })
        }
      }).catch(() => {});
    },
    handleSubmitForm() {
      let $el = this.$refs["cardmanageForm"];
      $el.$refs["validateForm"].validate(valid => {
        if (valid) {
          this.isSubmit = true;
          let data = { shareNum: 1 };
          data.title = $el.formData.title;
          data.isSend = $el.formData.isSend;
          if ($el.cardType == 0) {
            data.reduceCost = $el.formData.price;
            data.leastCost = $el.formData.leastCost;
            data.type = $el.formData.type;
            data.cardType = 'CASH';
            if ($el.formData.type == 1) {
              data.beginTimestamp = $el.formData.beginTimestamp;
              data.endTimestamp = $el.formData.endTimestamp;
            } else {
              data.effectNum = $el.formData.effectNum;
              data.fixedTerm = $el.formData.fixedTerm;
            }
            saveRfCard(data).then(res => {
              this.isSubmit = false;
              this.showDialog = false;
              this.handleGetTableData();
              this.$message.success("保存成功");
            }).catch(() => { 
              this.isSubmit = false;
            });
          } else {
            data.pic = $el.formData.pic;
            data.price = $el.formData.price;
            data.shopId = this.$store.getters.shopId;
            data.validDays = $el.formData.fixedTerm;
            addEntityCard(data).then(res => {
              this.isSubmit = false;
              this.showDialog = false;
              this.handleGetTableData();
              this.$message.success("保存成功");
            }).catch(() => { 
              this.isSubmit = false;
            });
          }
        }
      })
    }
  }
}
</script>