<template>
  <div class="jyfenxi-container main-content">
    <!-- 筛选 -->
    <el-form>
      <el-form-item class="inline-block" label="查询日期：" label-width="95px">
        <date-picker type="daterange" :value.sync="formData"></date-picker>
      </el-form-item>
      <el-form-item class="inline-block">
        <el-button type="primary" @click="handleGetTableData()">查询</el-button>
        <el-button type="primary" @click="formData = []">清空</el-button>
      </el-form-item>
    </el-form>
    <!-- 统计面板 -->
    <el-row class="panel-group" :gutter="40">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class='card-panel'>
          <div class="card-panel-description">
            <div class="card-panel-text">实收金额（元）</div>
            <div class="card-panel-count">
              <count class="card-panel-num" :endVal="cardListData.all_price != undefined ? cardListData.all_price : 0 "></count>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class='card-panel'>
          <div class="card-panel-description">
            <div class="card-panel-text">消费顾客人数（人）</div>
            <div class="card-panel-count">
              <count class="card-panel-num" :endVal="cardListData.all_num" :decimals="0"></count>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class='card-panel'>
          <div class="card-panel-description">
            <div class="card-panel-text">线上访问人数（人）</div>
            <div class="card-panel-count">
              <count class="card-panel-num" :endVal="cardListData.accessAnaly.all_access" :decimals="0"></count>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- 交易分析 -->
    <el-row style="margin-bottom: 25px;">
      <h4>交易分析</h4>
      <table class="custom-table">
        <thead>
          <tr><th>类型</th><th>实收金额（元）</th><th>订单数（笔）</th><th>笔单价（元）</th></tr>
        </thead>
        <tbody>
          <tr>
            <td align="center">爆品</td>
            <td align="center">{{ cardListData.single_price != undefined ? cardListData.single_price : 0 }}</td>
            <td align="center">{{ cardListData.single_num != undefined ? cardListData.single_num : 0 }}</td>
            <td align="center">{{ cardListData.single_price_sum_divide != undefined ? cardListData.single_price_sum_divide : 0 }}</td>
          </tr>
          <tr>
            <td align="center">9.9商品</td>
            <td align="center">{{ cardListData.discount_price != undefined ? cardListData.discount_price : 0 }}</td>
            <td align="center">{{ cardListData.discount_num != undefined ? cardListData.discount_num : 0 }}</td>
            <td align="center">{{ cardListData.discount_price_sum_divide != undefined ? cardListData.discount_price_sum_divide : 0 }}</td>
          </tr>
          <tr>
            <td align="center">全部</td>
            <td align="center">{{ cardListData.all_price != undefined ? cardListData.all_price : 0 }}</td>
            <td align="center">{{ cardListData.all_num != undefined ? cardListData.all_num : 0 }}</td>
            <td align="center">{{ cardListData.all_price_sum_divide != undefined ? cardListData.all_price_sum_divide : 0 }}</td>
          </tr>
        </tbody>
      </table>
    </el-row>
    <!-- 流量分析 -->
    <el-row>
      <h4>流量分析</h4>
      <table class="custom-table">
        <thead>
          <tr><th>类型</th><th>访问次数（人）</th><th>消费人数（人）</th><th>转化率</th></tr>
        </thead>
        <tbody>
          <tr>
            <td align="center">爆品</td>
            <td align="center">{{ cardListData.accessAnaly.single_access != undefined ? cardListData.accessAnaly.single_access : 0 }}</td>
            <td align="center">{{ cardListData.single_num != undefined ? cardListData.single_num : 0 }}</td>
            <td align="center">{{ cardListData.accessAnaly.single_access_buy_divide != undefined ? (cardListData.accessAnaly.single_access_buy_divide * 100).toFixed(2) : 0 }}%</td>
          </tr>
          <tr>
            <td align="center">9.9商品</td>
            <td align="center">{{ cardListData.accessAnaly.discount_access != undefined ? cardListData.accessAnaly.discount_access : 0 }}</td>
            <td align="center">{{ cardListData.discount_num != undefined ? cardListData.discount_num : 0 }}</td>
            <td align="center">{{ cardListData.accessAnaly.discount_access_buy_divide != undefined ? (cardListData.accessAnaly.discount_access_buy_divide * 100).toFixed(2) : 0 }}%</td>
          </tr>
          <tr>
            <td align="center">全部</td>
            <td align="center">{{ cardListData.accessAnaly.all_access != undefined ? cardListData.accessAnaly.all_access : 0 }}</td>
            <td align="center">{{ cardListData.all_num != undefined ? cardListData.all_num : 0 }}</td>
            <td align="center">{{ cardListData.accessAnaly.all_access_buy_divide != undefined ? (cardListData.accessAnaly.all_access_buy_divide * 100).toFixed(2) : 0 }}%</td>
          </tr>
        </tbody>
      </table>
    </el-row>
  </div>
</template>
<script>
import { getNowFormatDate } from '@/utils';
import { getPushProductAnalysis } from '@/api/bpyinliu';
import { Count } from '../dashboard/admin/components';
import DatePicker from '@/components/DatePicker';

export default {
  name: "jyFenXi_Views",
  components: { Count, DatePicker },
  data() {
    return {
      formData: [getNowFormatDate(), getNowFormatDate()],
      cardListData: {
        accessAnaly: {}
      }
    }
  },
  created() {
    this.handleGetTableData();
  },
  methods: {
    handleGetTableData() {
      getPushProductAnalysis({ beginTime: this.formData[0], endTime: this.formData[1] }).then(res => {
        this.cardListData = res.tableData;
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.card-panel-col {
  margin-bottom: 20px;
}
.card-panel {
    height: 135px;
    font-size: 12px;
    padding: 15px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    border: 1px solid rgba(187, 187, 187, 1);
    .icon-help {
      font-size: 18px;
    }
    .card-panel-description {
      font-weight: bold;
      margin-bottom: 25px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 1);
        font-size: 16px;
        margin-bottom: 25px;
      }
      .card-panel-count {
        text-align: center;
      }
      .card-panel-num {
        font-size: 28px;
        color: #EE454C;
      }
    }
  }
.custom-table {
  width: 75%;
  thead th {
    color: #000;
    padding: 5px 10px;
    font-size: 12px;
    border-bottom: 1px solid #EBEEF5;
  }
  tbody td {
    color: #606266;
    padding: 8px 0px;
    font-size: 12px;
    border-bottom: 1px solid #EBEEF5;
  }
}
</style>
